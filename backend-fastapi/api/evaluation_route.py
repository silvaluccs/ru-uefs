from fastapi import APIRouter, Depends, Request
from pymongo.asynchronous.collection import AsyncCollection

from backend.config.database import get_evaluation_collection
from backend.schemas.evaluation import (
    EvaluationRequestSchema,
    MealStatsResponseSchema,
    MealType,
)
from backend.services.evaluation_service import (
    get_meal_stats,
    submit_evaluation,
    verify_uefs_ip,
)

router = APIRouter(prefix="/api/v1/reviews", tags=["Evaluations"])


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
    client_ip = request.headers.get("x-forwarded-for") or request.client.host
    if client_ip and "," in client_ip:
        client_ip = client_ip.split(",")[0].strip()

    is_uefs = verify_uefs_ip(client_ip)
    return {"is_uefs_network": is_uefs}
