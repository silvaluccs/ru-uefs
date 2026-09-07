from enum import Enum

from pydantic import BaseModel, Field


class QueueLevel(str, Enum):
    LEVE = "leve"
    MODERADA = "moderada"
    INTENSA = "intensa"


class QueueVoteRequestSchema(BaseModel):
    level: QueueLevel = Field(..., description="Nível de lotação percebido na fila")


class WeightedPercents(BaseModel):
    leve: float = 0.0
    moderada: float = 0.0
    intensa: float = 0.0


class QueueStatusResponseSchema(BaseModel):
    status: QueueLevel | None = None
    hasEnoughData: bool
    totalVotes: int
    votesNeeded: int
    weightedPercents: WeightedPercents


class PeakHourSlotSchema(BaseModel):
    slot: str
    avgIntensity: float | None = None
    sampleCount: int
    noData: bool


class TrendResponseSchema(BaseModel):
    points: list[float]
    trendUp: bool
