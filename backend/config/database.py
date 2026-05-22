import os
from urllib.parse import quote_plus

from dotenv import load_dotenv
from pymongo import AsyncMongoClient

_db_client: AsyncMongoClient | None = None


def _build_mongo_uri() -> str:
    uri = os.getenv("MONGO_URI")
    if uri:
        return uri

    host = os.getenv("MONGO_HOST", "localhost")
    port = os.getenv("MONGO_PORT", "27017")
    user = os.getenv("MONGO_INITDB_ROOT_USERNAME") or os.getenv("MONGO_USER")
    password = os.getenv("MONGO_INITDB_ROOT_PASSWORD") or os.getenv("MONGO_PASSWORD")
    auth_source = os.getenv("MONGO_AUTH_SOURCE", "admin")
    db_name = os.getenv("MONGO_DB") or os.getenv("MONGO_INITDB_DATABASE") or "ru_uefs"

    if user and password:
        user_enc = quote_plus(user)
        password_enc = quote_plus(password)
        return f"mongodb://{user_enc}:{password_enc}@{host}:{port}/{db_name}?authSource={auth_source}"
    return f"mongodb://{host}:{port}/{db_name}"


def get_mongo_client() -> AsyncMongoClient:
    load_dotenv()
    uri = _build_mongo_uri()
    return AsyncMongoClient(uri)


def get_db_client() -> AsyncMongoClient:
    global _db_client
    if _db_client is None:
        _db_client = get_mongo_client()
    return _db_client


async def close_db_client() -> None:
    global _db_client
    if _db_client is not None:
        await _db_client.close()
        _db_client = None
