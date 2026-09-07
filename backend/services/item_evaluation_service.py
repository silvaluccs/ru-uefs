from datetime import datetime

from fastapi import HTTPException
from pymongo.asynchronous.collection import AsyncCollection

from backend.schemas.evaluation import MealType
from backend.schemas.item_evaluation import (
    ItemEvaluationRequestSchema,
    ItemStatsResponseSchema,
)
from backend.services.evaluation_service import verify_uefs_ip
from backend.services.menu_service import FUSO_BAHIA, get_current_meal


def _stats_from_doc(item_key: str, doc: dict | None) -> ItemStatsResponseSchema:
    likes = doc.get("likes", 0) if doc else 0
    dislikes = doc.get("dislikes", 0) if doc else 0
    total = likes + dislikes
    percentage = (likes / total * 100) if total > 0 else 0.0

    return ItemStatsResponseSchema(
        item_key=item_key,
        likes=likes,
        dislikes=dislikes,
        percentage_likes=round(percentage, 1),
    )


async def get_item_stats(
    date: str, meal_type: MealType, collection: AsyncCollection
) -> list[ItemStatsResponseSchema]:
    cursor = collection.find({"date": date, "meal_type": meal_type})
    docs = [doc async for doc in cursor]
    return [_stats_from_doc(doc["item_key"], doc) for doc in docs]


async def submit_item_evaluation(
    evaluation: ItemEvaluationRequestSchema,
    client_ip: str,
    collection: AsyncCollection,
) -> ItemStatsResponseSchema:
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
        {
            "date": evaluation.date,
            "meal_type": evaluation.meal_type,
            "item_key": evaluation.item_key,
        },
        {"$inc": {field_to_increment: 1}},
        upsert=True,
    )

    doc = await collection.find_one(
        {
            "date": evaluation.date,
            "meal_type": evaluation.meal_type,
            "item_key": evaluation.item_key,
        }
    )

    return _stats_from_doc(evaluation.item_key, doc)
