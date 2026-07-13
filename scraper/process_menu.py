import json
import logging
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import List
from urllib.parse import quote_plus

import download
import extract
from google import genai
from google.genai import types
from pymongo import MongoClient
from pymongo.errors import PyMongoError

logger = logging.getLogger(__name__)

PROJECT_ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = PROJECT_ROOT / ".env"
PDF_DIR = PROJECT_ROOT / "temp"
CARDAPIO_JSON_PATH = PROJECT_ROOT / "cardapio.json"


DEFAULT_GEMINI_MODELS = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-3.1-pro-preview",
]

PROMPT_CARDAPIO_EXTRACTION = """
Você é um interpretador de dados nutricionais automatizado. Seu objetivo é extrair o cardápio contido no documento e mapeá-lo estritamente no formato JSON estruturado fornecido.

Siga estas regras lógicas de extração para garantir o dinamismo, a limpeza textual e a correção dos dados:

1. **Regra de Higienização Textual (Remover Abreviações)**:
   - Você DEVE expandir e limpar todas as abreviações e barras encontradas nos nomes dos pratos.
   - Substitua qualquer ocorrência de "C/" ou "c/" pela palavra "com" (ex: "ARROZ C/CENOURA" deve virar "Arroz com cenoura", "CAFÉ C/LEITE" deve virar "Café com leite").
   - Substitua barras "/" que unem dois pratos ou acompanhamentos pela conjunção "e" (ex: "BATATA/ABOBORA" deve virar "Batata e abóbora", "CHUCHU/BETERRABA" deve virar "Chuchu e beterraba").
   - Escreva os valores textuais aplicando capitalização padrão (apenas a primeira letra maiúscula ou nomes próprios), evitando manter tudo em caixa alta (Gritando).

2. **Datas de Início e Fim**:
   - Identifique na primeira linha do documento o primeiro dia (ex: "18 de Maio") e o último dia (ex: "24 de Maio").
   - Formate `data_inicio` e `data_fim` no padrão "DD/MM/AAAA", usando o ano correspondente indicado no rodapé/título (ex: 2026).
   - Para cada objeto do dia, preencha o campo `data` mapeando o dia correspondente (ex: SEGUNDA-FEIRA -> "18/05/2026").

3. **Lógica de Separação de Células Agrupadas (Coluna 1 do Almoço)**:
   - No bloco do **ALMOÇO**, observe atentamente que a primeira coluna de dados mescla e agrupa os itens da SEGUNDA-FEIRA e da TERÇA-FEIRA na mesma célula, separando-os por quebras de linha (\\n).
   - REGRA: O primeiro bloco de texto ou primeira linha de cada célula desta coluna pertence OBRIGATORIAMENTE à SEGUNDA-FEIRA. O segundo bloco de texto ou linha debaixo pertence OBRIGATORIAMENTE à TERÇA-FEIRA.
   - Aplique essa divisão para todos os campos do almoço desta coluna. Não misture os pratos nem repita os dados da segunda na terça.

4. **Colunas Individuais (Quarta a Domingo)**:
   - A partir da segunda coluna de dados do Almoço, cada coluna representa um dia individual de forma direta (Quarta-feira, Quinta-feira, etc.). Mapeie-as de forma linear.

5. **Formatação de Listas (Bebidas e Ovolactovegetarianos)**:
   - Sempre que houver termos separados por "OU", remova o "OU" e quebre o texto em elementos de uma lista JSON (ex: ["Suco de umbu", "Café", "Café com leite"]).
   - Na linha "OVOLACTOVEGETARIANO", separe cada prato ou componente completo em um elemento diferente na lista.

6. **Mapeamento do Jantar**:
   - Na linha "RAIZ OU FARINÁCEO SOPA", o primeiro item textual é o carboidrato correspondente à chave `raiz_ou_farinaceio`. Se houver um segundo item textual na linha (um caldo ou sopa), extraia o nome desse item para a chave `sopa`.
   - Na propriedade `ovolactovegetariano` do jantar, inclua tanto a sopa/caldo quanto a opção proteica vegetariana listada na célula debaixo.

Mapeie todos os 7 dias da semana sequencialmente de forma factual e sem inventar dados.
"""


def _find_latest_pdf(directory: Path) -> Path | None:
    pdf_files = list(directory.glob("*.pdf"))
    if not pdf_files:
        return None
    return max(pdf_files, key=lambda file: file.stat().st_mtime)


def _load_env_file(path: Path) -> None:
    if not path.exists():
        logger.warning("Arquivo .env não encontrado", extra={"path": str(path)})
        return

    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


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


def _import_cardapio_schema():
    """Import tardio para suportar execução tanto como módulo quanto como script solto."""
    try:
        from backend.schemas.menu import CardapioResponseSchema
    except ModuleNotFoundError:
        if str(PROJECT_ROOT) not in sys.path:
            sys.path.insert(0, str(PROJECT_ROOT))
        from backend.schemas.menu import CardapioResponseSchema
    return CardapioResponseSchema

def _get_gemini_models() -> List[str]:
    """Lê GEMINI_MODEL do .env (ex: 'gemini-3.5-flash,gemini-3.1-flash-lite')
    e retorna a lista de modelos a tentar, em ordem. Usa DEFAULT_GEMINI_MODELS
    se a variável não estiver definida."""
    raw = os.getenv("GEMINI_MODEL")
    if not raw:
        return DEFAULT_GEMINI_MODELS

    models = [name.strip() for name in raw.split(",") if name.strip()]
    return models or DEFAULT_GEMINI_MODELS


def _generate_cardapio_json(client: genai.Client, model: str, pdf_file, schema) -> dict:
    """Chama um único modelo Gemini e retorna o JSON já parseado.
    Levanta exceção em qualquer falha (erro de API, resposta vazia, JSON inválido)."""
    response = client.models.generate_content(
        model=model,
        contents=[pdf_file, PROMPT_CARDAPIO_EXTRACTION],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=schema,
            temperature=0.1,
        ),
    )

    if not response.text:
        raise RuntimeError(f"Resposta vazia do modelo {model}")

    return json.loads(response.text)


def _cleanup_uploaded_file(client: genai.Client, uploaded_file) -> None:
    if uploaded_file is None or not uploaded_file.name:
        return
    logger.info("Limpando arquivos temporários do servidor...")
    try:
        client.files.delete(name=uploaded_file.name)
    except Exception:
        logger.exception("Falha ao limpar arquivos temporários do servidor")


def send_pdf_to_gemini(pdf_path: Path, client: genai.Client, schema) -> dict | None:
    """Envia o PDF para a API do Gemini e retorna o cardápio extraído em JSON.

    Faz upload do arquivo uma única vez e tenta os modelos configurados em
    GEMINI_MODEL, na ordem informada, até um funcionar. Retorna None se
    todos os modelos falharem.
    """
    models = _get_gemini_models()
    pdf_file = client.files.upload(file=str(pdf_path))

    try:
        for model in models:
            logger.info("Tentando gerar cardápio com o modelo %s", model)
            try:
                result = _generate_cardapio_json(client, model, pdf_file, schema)
            except Exception as exc:
                logger.warning("Falha ao usar o modelo %s: %s", model, exc)
                continue

            logger.info("Sucesso ao usar o modelo %s", model)
            return result

        logger.error("Todos os modelos falharam ao processar o PDF.")
        return None
    finally:
        _cleanup_uploaded_file(client, pdf_file)


def _save_cardapio_to_file(cardapio: dict, path: Path = CARDAPIO_JSON_PATH) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(cardapio, f, ensure_ascii=False, indent=2)


def _save_cardapio_to_mongo(cardapio: dict) -> None:
    date_start = cardapio.get("data_inicio")
    date_end = cardapio.get("data_fim")
    if not date_start or not date_end:
        logger.error("JSON sem data_inicio/data_fim. Inserção ignorada.")
        return

    db_name = os.getenv("MONGO_DB") or os.getenv("MONGO_INITDB_DATABASE") or "ru_uefs"
    collection_name = os.getenv("MONGO_COLLECTION", "cardapios")

    mongo_client = None
    try:
        mongo_client = MongoClient(_build_mongo_uri(), serverSelectionTimeoutMS=5000)
        mongo_client.admin.command("ping")
        collection = mongo_client[db_name][collection_name]

        if collection.find_one({"data_inicio": date_start, "data_fim": date_end}):
            logger.info(
                "Cardápio já existente no banco. Inserção ignorada.",
                extra={"data_inicio": date_start, "data_fim": date_end},
            )
            return

        document = {**cardapio, "created_at": datetime.now(timezone.utc)}
        result = collection.insert_one(document)
        logger.info("Cardápio inserido no MongoDB", extra={"id": str(result.inserted_id)})
    except PyMongoError:
        logger.exception("Erro ao inserir no MongoDB")
    finally:
        if mongo_client is not None:
            try:
                mongo_client.close()
            except Exception:
                logger.debug("Falha ao fechar conexão com MongoDB")


def process_to_json() -> None:
    schema = _import_cardapio_schema()
    _load_env_file(ENV_PATH)
    client = genai.Client()

    if not PDF_DIR.exists():
        logger.error("Diretório de PDFs não encontrado", extra={"path": str(PDF_DIR)})
        return

    pdf_path = _find_latest_pdf(PDF_DIR)
    if pdf_path is None:
        logger.error("Nenhum arquivo PDF encontrado no diretório.", extra={"path": str(PDF_DIR)})
        return

    logger.info("PDF encontrado", extra={"path": str(pdf_path)})

    cardapio = send_pdf_to_gemini(pdf_path, client, schema)
    if cardapio is None:
        logger.error("Não foi possível extrair o cardápio do PDF com nenhum modelo disponível.")
        return

    _save_cardapio_to_file(cardapio)
    _save_cardapio_to_mongo(cardapio)


def run() -> None:
    url_to_download = extract.get_weekly_menu_url()
    if url_to_download is None:
        logger.warning("Nenhuma URL de menu encontrada.")
        return

    if not download.download(url_to_download):
        logger.error("Falha ao baixar o arquivo.")
        return

    process_to_json()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run()
