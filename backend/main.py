import logging
from contextlib import asynccontextmanager
from pathlib import Path

from backend.api.evaluation_route import router as evaluation_router
from backend.api.queue_route import router as queue_router
from backend.api.route import router as menu_router
from backend.config.database import close_db_client, get_db_client
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

logger = logging.getLogger(__name__)
PROJECT_ROOT = Path(__file__).resolve().parents[1]
RESOURCES_DIR = PROJECT_ROOT / "resources"


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


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static resources directory (served at /static)
if RESOURCES_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(RESOURCES_DIR)), name="static")
else:
    logger.warning(
        "Resources directory not found, skipping static mount: %s", str(RESOURCES_DIR)
    )

app.include_router(menu_router)
app.include_router(evaluation_router)
app.include_router(queue_router)
