from datetime import datetime, timedelta

from fastapi import HTTPException
from pymongo.asynchronous.collection import AsyncCollection

from backend.schemas.queue import (
    PeakHourSlotSchema,
    QueueLevel,
    QueueStatusResponseSchema,
    TrendResponseSchema,
    WeightedPercents,
)
from backend.services.evaluation_service import verify_uefs_ip
from backend.services.menu_service import FUSO_BAHIA, get_restaurant_status

WINDOW_MINUTES = 30
MIN_VOTES = 15
MIN_PEAK_SAMPLES = 10

LEVEL_WEIGHT = {QueueLevel.LEVE: 1, QueueLevel.MODERADA: 2, QueueLevel.INTENSA: 3}

LUNCH_SLOTS = ["11:00", "11:30", "12:00", "12:30", "13:00", "13:30"]
DINNER_SLOTS = ["17:30", "18:00", "18:30", "19:00", "19:30"]


def _now() -> datetime:
    """Horário local da Bahia, naive (sem tzinfo) — Mongo/pymongo persiste e
    devolve datetimes naive em UTC-equivalente, então mantemos tudo naive aqui
    para evitar `can't subtract offset-naive and offset-aware datetimes`."""
    return datetime.now(FUSO_BAHIA).replace(tzinfo=None)


async def submit_queue_vote(
    level: QueueLevel, client_ip: str, collection: AsyncCollection
) -> QueueStatusResponseSchema:
    if not verify_uefs_ip(client_ip):
        raise HTTPException(
            status_code=403,
            detail="Acesso negado. Apenas estudantes conectados à rede da UEFS podem votar na fila.",
        )

    status = await get_restaurant_status()
    if not status["isOpen"]:
        raise HTTPException(
            status_code=400,
            detail="O restaurante está fechado no momento. A votação da fila só é liberada durante o funcionamento do RU.",
        )

    await collection.insert_one({"level": level.value, "timestamp": _now()})

    return await compute_queue_status(collection)


async def compute_queue_status(collection: AsyncCollection) -> QueueStatusResponseSchema:
    now = _now()
    window_start = now - timedelta(minutes=WINDOW_MINUTES)

    cursor = collection.find({"timestamp": {"$gte": window_start, "$lte": now}})
    votes = [doc async for doc in cursor]

    scores = {level: 0.0 for level in QueueLevel}
    counts = {level: 0 for level in QueueLevel}

    for vote in votes:
        try:
            level = QueueLevel(vote["level"])
        except ValueError:
            continue
        age_minutes = (now - vote["timestamp"]).total_seconds() / 60
        if age_minutes < 0 or age_minutes > WINDOW_MINUTES:
            continue
        counts[level] += 1
        scores[level] += max(0.0, 1 - age_minutes / WINDOW_MINUTES)

    total_votes = sum(counts.values())
    total_score = sum(scores.values())

    def pct(score: float) -> float:
        return round((score / total_score) * 100, 1) if total_score > 0 else 0.0

    has_enough_data = total_votes >= MIN_VOTES
    status = None
    if has_enough_data:
        status = max(QueueLevel, key=lambda level: scores[level])

    return QueueStatusResponseSchema(
        status=status,
        hasEnoughData=has_enough_data,
        totalVotes=total_votes,
        votesNeeded=max(0, MIN_VOTES - total_votes),
        weightedPercents=WeightedPercents(
            leve=pct(scores[QueueLevel.LEVE]),
            moderada=pct(scores[QueueLevel.MODERADA]),
            intensa=pct(scores[QueueLevel.INTENSA]),
        ),
    )


async def compute_peak_hours(
    collection: AsyncCollection, meal: str
) -> list[PeakHourSlotSchema]:
    slots = LUNCH_SLOTS if meal == "lunch" else DINNER_SLOTS
    now = _now()
    weekday = now.weekday()
    if weekday >= 5:
        weekday = 3  # sem histórico de fim de semana ainda: aproxima por quinta-feira

    window_start = now - timedelta(days=60)
    cursor = collection.find({"timestamp": {"$gte": window_start}})
    votes = [doc async for doc in cursor]

    by_slot: dict[str, list[int]] = {slot: [] for slot in slots}
    for vote in votes:
        ts: datetime = vote["timestamp"]
        if ts.weekday() != weekday:
            continue
        slot = _closest_slot(ts, slots)
        if slot is None:
            continue
        try:
            level = QueueLevel(vote["level"])
        except ValueError:
            continue
        by_slot[slot].append(LEVEL_WEIGHT[level])

    result = []
    for slot in slots:
        samples = by_slot[slot]
        sample_count = len(samples)
        if sample_count < MIN_PEAK_SAMPLES:
            result.append(
                PeakHourSlotSchema(
                    slot=slot, avgIntensity=None, sampleCount=sample_count, noData=True
                )
            )
            continue
        avg = sum(samples) / sample_count
        result.append(
            PeakHourSlotSchema(
                slot=slot, avgIntensity=round(avg, 2), sampleCount=sample_count, noData=False
            )
        )
    return result


def _closest_slot(ts: datetime, slots: list[str]) -> str | None:
    target_minutes = ts.hour * 60 + ts.minute
    best_slot = None
    best_diff = None
    for slot in slots:
        h, m = slot.split(":")
        slot_minutes = int(h) * 60 + int(m)
        diff = abs(slot_minutes - target_minutes)
        if diff > 20:
            continue
        if best_diff is None or diff < best_diff:
            best_diff = diff
            best_slot = slot
    return best_slot


async def compute_trend(collection: AsyncCollection) -> TrendResponseSchema:
    now = _now()
    bucket_minutes = 15
    bucket_count = 8  # 2 horas
    window_start = now - timedelta(minutes=bucket_minutes * bucket_count)

    cursor = collection.find({"timestamp": {"$gte": window_start, "$lte": now}})
    votes = [doc async for doc in cursor]

    buckets = [[] for _ in range(bucket_count)]
    for vote in votes:
        try:
            level = QueueLevel(vote["level"])
        except ValueError:
            continue
        age_minutes = (now - vote["timestamp"]).total_seconds() / 60
        if age_minutes < 0 or age_minutes > bucket_minutes * bucket_count:
            continue
        idx = min(bucket_count - 1, int(age_minutes // bucket_minutes))
        # bucket 0 = mais recente; inverte para ordem cronológica
        buckets[bucket_count - 1 - idx].append(LEVEL_WEIGHT[level])

    points = []
    last_known = 1.0
    for bucket in buckets:
        if bucket:
            last_known = sum(bucket) / len(bucket)
        points.append(round(last_known, 2))

    trend_up = points[-1] >= points[0] if points else False

    return TrendResponseSchema(points=points, trendUp=trend_up)
