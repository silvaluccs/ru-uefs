import re

from pydantic import BaseModel, Field, field_validator

from backend.schemas.evaluation import EvaluationType, MealType


class ItemEvaluationRequestSchema(BaseModel):
    date: str = Field(..., description="Data da refeição no formato DD-MM-YYYY")
    meal_type: MealType = Field(..., description="Tipo da refeição avaliada")
    item_key: str = Field(..., description="Identificador estável do prato dentro da refeição")
    vote: EvaluationType = Field(..., description="Voto (like ou dislike)")

    @field_validator("date")
    @classmethod
    def validate_date_format(cls, value: str) -> str:
        if not re.match(r"^\d{2}-\d{2}-\d{4}$", value):
            raise ValueError("A data deve estar no formato DD-MM-YYYY")
        return value


class ItemStatsResponseSchema(BaseModel):
    item_key: str
    likes: int = Field(default=0)
    dislikes: int = Field(default=0)
    percentage_likes: float = Field(default=0.0)
