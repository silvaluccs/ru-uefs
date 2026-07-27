
from datetime import datetime, time, timedelta, timezone
import os

def load_schedule():

    """Carrega os horários de funcionamento dinamicamente a partir do .env"""
    return {
        "weekday": [
            (
                time.fromisoformat(os.getenv("WEEKDAY_BREAKFAST_START", "07:30")),
                time.fromisoformat(os.getenv("WEEKDAY_BREAKFAST_END", "09:00")),
                "breakfast",
                "Café da manhã",
            ),
            (
                time.fromisoformat(os.getenv("WEEKDAY_LUNCH_START", "11:30")),
                time.fromisoformat(os.getenv("WEEKDAY_LUNCH_END", "13:30")),
                "lunch",
                "Almoço",
            ),
            (
                time.fromisoformat(os.getenv("WEEKDAY_DINNER_START", "17:30")),
                time.fromisoformat(os.getenv("WEEKDAY_DINNER_END", "19:00")),
                "dinner",
                "Jantar",
            ),
        ],
        "saturday": [
            (
                time.fromisoformat(os.getenv("SATURDAY_BREAKFAST_START", "06:30")),
                time.fromisoformat(os.getenv("SATURDAY_BREAKFAST_END", "09:00")),
                "breakfast",
                "Café da manhã",
            ),
            (
                time.fromisoformat(os.getenv("SATURDAY_LUNCH_START", "11:30")),
                time.fromisoformat(os.getenv("SATURDAY_LUNCH_END", "14:00")),
                "lunch",
                "Almoço",
            ),
            (
                time.fromisoformat(os.getenv("SATURDAY_DINNER_START", "17:30")),
                time.fromisoformat(os.getenv("SATURDAY_DINNER_END", "19:00")),
                "dinner",
                "Jantar",
            ),
        ],
        "sunday": [
            (
                time.fromisoformat(os.getenv("SUNDAY_BREAKFAST_START", "07:30")),
                time.fromisoformat(os.getenv("SUNDAY_BREAKFAST_END", "09:00")),
                "breakfast",
                "Café da manhã",
            ),
            (
                time.fromisoformat(os.getenv("SUNDAY_LUNCH_START", "11:30")),
                time.fromisoformat(os.getenv("SUNDAY_LUNCH_END", "13:30")),
                "lunch",
                "Almoço",
            ),
            (
                time.fromisoformat(os.getenv("SUNDAY_DINNER_START", "17:30")),
                time.fromisoformat(os.getenv("SUNDAY_DINNER_END", "19:00")),
                "dinner",
                "Jantar",
            ),
        ],
    }
