from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

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

origins = [
    "http://localhost:5173",  # Porta padrão do Vite local
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="../resources"), name="static")

app.include_router(menu_router)
