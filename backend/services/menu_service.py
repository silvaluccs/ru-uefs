import os
from datetime import datetime, time, timedelta, timezone

from pymongo.asynchronous.collection import AsyncCollection

from backend.config.database import get_db_client

FUSO_BAHIA = timezone(timedelta(hours=-3))

HORARIOS = {
    "weekday": [
        (time(6, 30), time(9, 0), "desjejum"),
        (time(11, 0), time(14, 30), "almoco"),
        (time(17, 30), time(19, 30), "jantar"),
    ],
    "saturday": [
        (time(6, 30), time(9, 0), "desjejum"),
        (time(11, 30), time(14, 0), "almoco"),
        (time(17, 30), time(19, 0), "jantar"),
    ],
    "sunday": [
        (time(7, 30), time(9, 0), "desjejum"),
        (time(11, 30), time(13, 30), "almoco"),
        (time(17, 30), time(19, 0), "jantar"),
    ],
}


def get_menu_collection() -> AsyncCollection:
    db_name = os.getenv("MONGO_DB", "ru_uefs")
    collection_name = os.getenv("MONGO_COLLECTION", "cardapios")
    client = get_db_client()
    return client[db_name][collection_name]


async def fetch_current_week_menu(collection: AsyncCollection) -> dict:
    latest_menu = await collection.find_one({}, sort=[("created_at", -1)])
    if not latest_menu:
        return {}
    latest_menu["_id"] = str(latest_menu["_id"])

    today = datetime.now(FUSO_BAHIA).date()

    start_day_menu = latest_menu["data_inicio"]
    end_day_menu = latest_menu["data_fim"]

    start_date = datetime.strptime(start_day_menu, "%d/%m/%Y").date()
    end_date = datetime.strptime(end_day_menu, "%d/%m/%Y").date()

    return latest_menu if start_date <= today <= end_date else {}


async def fetch_today_menu(collection: AsyncCollection) -> dict:
    today = datetime.now(FUSO_BAHIA).date().strftime("%d/%m/%Y")
    return await fetch_menu_for_date(collection, today)


async def fetch_menu_for_date(collection: AsyncCollection, date: str) -> dict:
    document = await collection.find_one({"cardapio.data": date})

    if not document:
        return {}

    date_entry = next(
        (day for day in document["cardapio"] if day["data"] == date),
        None,
    )

    return date_entry if date_entry else {}


def get_current_meal(time_now: time, weekday: int) -> str | None:
    key = "weekday" if weekday < 5 else "saturday" if weekday == 5 else "sunday"
    return next(
        (meal for start, end, meal in HORARIOS[key] if start <= time_now <= end),
        None,
    )


async def fetch_menu_for_now(collection: AsyncCollection) -> dict:
    today_menu = await fetch_today_menu(collection)
    if not today_menu:
        return {}

    now = datetime.now(FUSO_BAHIA)

    meal_key = get_current_meal(now.time(), now.weekday())

    if not meal_key:
        return {"message": "Restaurante fechado no momento."}

    refeicoes = today_menu.get("refeicoes", [{}])[0]
    meal = refeicoes.get(meal_key)

    return {"refeicao": meal_key, "dados": meal} if meal else {}
