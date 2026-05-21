from pydantic import BaseModel


class DesjejumSchema(BaseModel):
    inicio: str = "07:00"
    fim: str = "08:00"
    bebida: list[str]
    pao: str
    raiz_ou_farinaceio: str
    fruta: str
    ovolactovegetariano: str


class AlmocoSchema(BaseModel):
    acompanhamento_I: str
    acompanhamento_II: str
    guarnicao: str
    salada_cozida: str
    salada_crua: str
    proteina: str
    opcao_proteina: str
    fruta: str
    ovolactovegetariano: list[str]
    suco: str


class JantarSchema(BaseModel):
    bebida: list[str]
    pao: str
    proteina: str
    raiz_ou_farinaceio: str
    sopa: str | None = None
    ovolactovegetariano: list[str]


class RefeicaoItem(BaseModel):
    desjejum: DesjejumSchema | None = None
    almoco: AlmocoSchema | None = None
    jantar: JantarSchema | None = None


class DiaCardapio(BaseModel):
    dia: str
    data: str
    refeicoes: list[RefeicaoItem]


class CardapioResponseSchema(BaseModel):
    data_inicio: str
    data_fim: str
    cardapio: list[DiaCardapio]
