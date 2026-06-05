import os
from datetime import datetime

from fastapi import HTTPException
from pymongo.asynchronous.collection import AsyncCollection

from backend.schemas.evaluation import (
    EvaluationRequestSchema,
    MealStatsResponseSchema,
    MealType,
)
from backend.services.menu_service import FUSO_BAHIA, get_current_meal


def verify_uefs_ip(client_ip: str) -> bool:
    if os.getenv("ENV") == "development":
        return True

    allowed_local_ips = os.getenv("ALLOWED_LOCAL_IPS")
    if allowed_local_ips and client_ip in [
        ip.strip() for ip in allowed_local_ips.split(",")
    ]:
        return True

    uefs_prefixes = os.getenv("UEFS_IP_PREFIXES")
    if uefs_prefixes:
        prefixes_list = [p.strip() for p in uefs_prefixes.split(",") if p.strip()]
        return any(client_ip.startswith(prefix) for prefix in prefixes_list)

    return False


async def get_meal_stats(
    date: str, meal_type: MealType, collection: AsyncCollection
) -> MealStatsResponseSchema:
    doc = await collection.find_one({"date": date, "meal_type": meal_type})

    if not doc:
        return MealStatsResponseSchema(
            date=date, meal_type=meal_type, likes=0, dislikes=0, percentage_likes=0.0
        )

    likes = doc.get("likes", 0)
    dislikes = doc.get("dislikes", 0)
    total = likes + dislikes

    percentage = (likes / total * 100) if total > 0 else 0.0

    return MealStatsResponseSchema(
        date=date,
        meal_type=meal_type,
        likes=likes,
        dislikes=dislikes,
        percentage_likes=round(percentage, 1),
    )


async def submit_evaluation(
    evaluation: EvaluationRequestSchema, client_ip: str, collection: AsyncCollection
) -> MealStatsResponseSchema:
    if not verify_uefs_ip(client_ip):
        raise HTTPException(
            status_code=403,
            detail="Acesso negado. Apenas estudantes conectados à rede da UEFS podem avaliar o cardápio.",
        )

    now_bahia = datetime.now(FUSO_BAHIA)
    current_date_str = now_bahia.date().strftime("%d-%m-%Y")
    active_meal = get_current_meal(now_bahia.time(), now_bahia.weekday())

    if not active_meal:
        raise HTTPException(
            status_code=400,
            detail="O restaurante está fechado no momento. Avaliações não estão disponíveis.",
        )

    if evaluation.date != current_date_str:
        raise HTTPException(
            status_code=400,
            detail=f"Não é possível avaliar refeições de datas retroativas ou futuras. Data permitida hoje: {current_date_str}.",
        )

    if evaluation.meal_type != active_meal:
        raise HTTPException(
            status_code=400,
            detail=f"Refeição incorreta. No momento você só pode avaliar o {active_meal}.",
        )

    field_to_increment = "likes" if evaluation.vote == "like" else "dislikes"

    await collection.update_one(
        {"date": evaluation.date, "meal_type": evaluation.meal_type},
        {"$inc": {field_to_increment: 1}},
        upsert=True,
    )

    return await get_meal_stats(evaluation.date, evaluation.meal_type, collection)
