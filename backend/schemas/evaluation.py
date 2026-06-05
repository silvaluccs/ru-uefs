import re
from enum import Enum

from pydantic import BaseModel, Field, field_validator


class EvaluationType(str, Enum):
    LIKE = "like"
    DISLIKE = "dislike"


class MealType(str, Enum):
    DESJEJUM = "desjejum"
    ALMOCO = "almoco"
    JANTAR = "jantar"


class EvaluationRequestSchema(BaseModel):
    date: str = Field(..., description="Data da refeição no formato DD-MM-YYYY")
    meal_type: MealType = Field(..., description="Tipo da refeição avaliada")
    vote: EvaluationType = Field(..., description="Voto (like ou dislike)")

    @field_validator("date")
    @classmethod
    def validate_date_format(cls, value: str) -> str:
        if not re.match(r"^\d{2}-\d{2}-\d{4}$", value):
            raise ValueError("A data deve estar no formato DD-MM-YYYY")
        return value


class MealStatsResponseSchema(BaseModel):
    date: str
    meal_type: MealType
    likes: int = Field(default=0)
    dislikes: int = Field(default=0)
    percentage_likes: float = Field(default=0.0, description="Porcentagem de aprovação")
