from fastapi import APIRouter, Depends, Request
from pymongo.asynchronous.collection import AsyncCollection

from backend.config.database import (
    get_evaluation_collection,
    get_item_evaluation_collection,
)
from backend.schemas.evaluation import (
    EvaluationRequestSchema,
    MealStatsResponseSchema,
    MealType,
)
from backend.schemas.item_evaluation import (
    ItemEvaluationRequestSchema,
    ItemStatsResponseSchema,
)
from backend.services.evaluation_service import (
    get_meal_stats,
    submit_evaluation,
    verify_uefs_ip,
)
from backend.services.item_evaluation_service import (
    get_item_stats,
    submit_item_evaluation,
)

router = APIRouter(prefix="/api/v1/reviews", tags=["Evaluations"])


def _extract_client_ip(request: Request) -> str:
    client_ip = request.headers.get("x-forwarded-for") or request.client.host
    if client_ip and "," in client_ip:
        client_ip = client_ip.split(",")[0].strip()
    return client_ip


@router.post("/evaluate", response_model=MealStatsResponseSchema)
async def evaluate_meal(
    request: Request,
    payload: EvaluationRequestSchema,
    collection: AsyncCollection = Depends(get_evaluation_collection),
):
    client_ip = request.headers.get("x-forwarded-for") or request.client.host
    if client_ip and "," in client_ip:
        client_ip = client_ip.split(",")[0].strip()

    return await submit_evaluation(payload, client_ip, collection)


@router.get("/stats/{date}/{meal_type}", response_model=MealStatsResponseSchema)
async def get_meal_evaluation_stats(
    date: str,
    meal_type: MealType,
    collection: AsyncCollection = Depends(get_evaluation_collection),
):
    return await get_meal_stats(date, meal_type, collection)


@router.get("/network-check")
async def check_network_status(request: Request):
    is_uefs = verify_uefs_ip(_extract_client_ip(request))
    return {"is_uefs_network": is_uefs}


@router.post("/items/evaluate", response_model=ItemStatsResponseSchema)
async def evaluate_item(
    request: Request,
    payload: ItemEvaluationRequestSchema,
    collection: AsyncCollection = Depends(get_item_evaluation_collection),
):
    return await submit_item_evaluation(payload, _extract_client_ip(request), collection)


@router.get("/items/stats/{date}/{meal_type}", response_model=list[ItemStatsResponseSchema])
async def get_item_evaluation_stats(
    date: str,
    meal_type: MealType,
    collection: AsyncCollection = Depends(get_item_evaluation_collection),
):
    return await get_item_stats(date, meal_type, collection)
