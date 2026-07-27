from fastapi import APIRouter, Depends, HTTPException
from pymongo.asynchronous.collection import AsyncCollection

from backend.services.menu_service import (
    fetch_current_week_menu,
    fetch_menu_for_date,
    fetch_menu_for_now,
    fetch_today_menu,
    get_menu_collection,
    get_restaurant_status,
)

router = APIRouter(prefix="/api/v1/menu", tags=["Menu"])


@router.get("/status")
async def get_status():
    return await get_restaurant_status()


@router.get("/week")
async def get_current_week_menu(
    collection: AsyncCollection = Depends(get_menu_collection),
):

    return await fetch_current_week_menu(collection)


@router.get("/today")
async def get_today_menu(
    collection: AsyncCollection = Depends(get_menu_collection),
):
    return await fetch_today_menu(collection)


@router.get("/now")
async def get_menu_for_now(
    collection: AsyncCollection = Depends(get_menu_collection),
):
    return await fetch_menu_for_now(collection)


@router.get("/{date}")
async def get_menu_for_date(
    date: str,
    collection: AsyncCollection = Depends(get_menu_collection),
):
    normalized = date.replace("-", "/")
    menu = await fetch_menu_for_date(collection, normalized)
    if not menu:
        raise HTTPException(
            status_code=404,
            detail=f"Nenhum cardápio disponível para a data especificada: {date}.",
        )
    return menu
