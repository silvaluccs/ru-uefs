from contextlib import asynccontextmanager

from fastapi import FastAPI

from backend.api.route import router as menu_router
from backend.config.database import close_db_client, get_db_client


@asynccontextmanager
async def lifespan(app: FastAPI):
    db_client = get_db_client()

    # Testa a conexão
    await db_client.admin.command("ping")
    print("✅ Conectado ao MongoDB com sucesso!")

    yield

    # Encerra (shutdown): Fecha a conexão
    await close_db_client()
    print("🛑 Conexão com o MongoDB encerrada.")


app = FastAPI(
    title="RU UEFS API",
    description="API para disponibilizar o cardápio do Restaurante Universitário da UEFS.",
    lifespan=lifespan,
)

app.include_router(menu_router)
