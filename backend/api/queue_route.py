from typing import Literal

from fastapi import APIRouter, Depends, Query, Request
from pymongo.asynchronous.collection import AsyncCollection

from backend.config.database import get_queue_collection
from backend.schemas.queue import (
    PeakHourSlotSchema,
    QueueStatusResponseSchema,
    QueueVoteRequestSchema,
    TrendResponseSchema,
)
from backend.services.queue_service import (
    compute_peak_hours,
    compute_queue_status,
    compute_trend,
    submit_queue_vote,
)

router = APIRouter(prefix="/api/v1/queue", tags=["Fila"])


def _client_ip(request: Request) -> str:
    client_ip = request.headers.get("x-forwarded-for") or request.client.host
    if client_ip and "," in client_ip:
        client_ip = client_ip.split(",")[0].strip()
    return client_ip


@router.post("/vote", response_model=QueueStatusResponseSchema)
async def vote_queue(
    request: Request,
    payload: QueueVoteRequestSchema,
    collection: AsyncCollection = Depends(get_queue_collection),
):
    return await submit_queue_vote(payload.level, _client_ip(request), collection)


@router.get("/status", response_model=QueueStatusResponseSchema)
async def get_queue_status(
    collection: AsyncCollection = Depends(get_queue_collection),
):
    return await compute_queue_status(collection)


@router.get("/peak-hours", response_model=list[PeakHourSlotSchema])
async def get_peak_hours(
    meal: Literal["lunch", "dinner"] = Query("lunch"),
    collection: AsyncCollection = Depends(get_queue_collection),
):
    return await compute_peak_hours(collection, meal)


@router.get("/trend", response_model=TrendResponseSchema)
async def get_trend(
    collection: AsyncCollection = Depends(get_queue_collection),
):
    return await compute_trend(collection)
