import os
from datetime import datetime, time, timedelta, timezone

from pymongo.asynchronous.collection import AsyncCollection

from backend.config.database import get_db_client
from backend.services.work_time import load_schedule

FUSO_BAHIA = timezone(timedelta(hours=-3))

HORARIOS = load_schedule()


def get_menu_collection() -> AsyncCollection:
    db_name = os.getenv("MONGO_DB", "ru_uefs")
    collection_name = os.getenv("MONGO_COLLECTION", "cardapios")
    client = get_db_client()
    return client[db_name][collection_name]


async def get_restaurant_status() -> dict:
    now = datetime.now(FUSO_BAHIA)
    time_now = now.time()
    weekday = now.weekday()  

    key = "weekday" if weekday < 5 else "saturday" if weekday == 5 else "sunday"
    meals = HORARIOS[key]

    for start, end, meal_code, meal_label in meals:
        if time_now < start:
            return {
                "isOpen": False,
                "isLastServed": False,
                "defaultMeal": meal_code,
                "badgeText": f"Abre às {start.strftime('%H:%M')} ({meal_label})",
            }
        if start <= time_now <= end:
            return {
                "isOpen": True,
                "isLastServed": False,
                "defaultMeal": meal_code,
                "badgeText": f"{meal_label} até {end.strftime('%H:%M')}",
            }

    return {
        "isOpen": False,
        "isLastServed": True,
        "defaultMeal": "dinner",
        "badgeText": "Última refeição servida",
    }


async def fetch_current_week_menu(collection: AsyncCollection) -> dict:
    latest_menu = await collection.find_one({}, sort=[("created_at", -1)])
    if not latest_menu:
        return {}
    latest_menu["_id"] = str(latest_menu["_id"])

    if "created_at" in latest_menu and isinstance(latest_menu["created_at"], datetime):
        latest_menu["created_at"] = latest_menu["created_at"].isoformat()

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
    
    # Mapeia o código da refeição para a chave correspondente no documento do MongoDB
    meal_mapping = {
        "breakfast": "desjejum",
        "lunch": "almoco",
        "dinner": "jantar",
    }
    
    meal_code = next(
        (code for start, end, code, label in HORARIOS[key] if start <= time_now <= end),
        None,
    )
    
    return meal_mapping.get(meal_code) if meal_code else None


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
