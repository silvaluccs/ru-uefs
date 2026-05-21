import json
import logging
import sys
from pathlib import Path

import download
import extract
from google import genai
from google.genai import types

logger = logging.getLogger(__name__)
PDF_DIR = Path(__file__).resolve().parents[1] / "temp"
OUTPUT_DIR = Path(__file__).resolve().parents[1] / "temp"


def _find_latest_pdf(directory: Path) -> Path | None:
    pdf_files = list(directory.glob("*.pdf"))
    if not pdf_files:
        return None
    return max(pdf_files, key=lambda file: file.stat().st_mtime)


def process_to_json() -> None:
    base_dir = Path(__file__).resolve().parent
    project_root = base_dir.parent

    try:
        from schemas.menu import CardapioResponseSchema
    except ModuleNotFoundError:
        if str(project_root) not in sys.path:
            sys.path.insert(0, str(project_root))
        from schemas.menu import CardapioResponseSchema

    client = genai.Client()

    if not PDF_DIR.exists():
        logger.error("Diretório de PDFs não encontrado", extra={"path": str(PDF_DIR)})
        return

    pdf_path = _find_latest_pdf(PDF_DIR)

    if pdf_path is None:
        logger.error(
            "Nenhum arquivo PDF encontrado no diretório.", extra={"path": str(PDF_DIR)}
        )
        return

    logger.info("PDF encontrado", extra={"path": str(pdf_path)})
    logger.info("Fazendo upload do PDF para a API do Gemini...")

    prompt = """
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

    arquivo_pdf = None
    try:
        arquivo_pdf = client.files.upload(file=str(pdf_path))
        logger.info("Processando o PDF de forma dinâmica e limpando textos...")

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=[arquivo_pdf, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=CardapioResponseSchema,
                temperature=0.1,
            ),
        )

        if not response.text:
            logger.error("Resposta vazia do modelo.")
            return

        json_final = json.loads(response.text)

        output_path = OUTPUT_DIR / "cardapio_completo.json"
        with output_path.open("w", encoding="utf-8") as f:
            json.dump(json_final, f, indent=4, ensure_ascii=False)

        logger.info(
            "JSON gerado dinamicamente com textos higienizados",
            extra={"path": str(output_path)},
        )

    except Exception:
        logger.exception("Erro na execução")

    finally:
        if arquivo_pdf is not None and arquivo_pdf.name:
            logger.info("Limpando arquivos temporários do servidor...")
            try:
                client.files.delete(name=arquivo_pdf.name)
            except Exception:
                logger.exception("Falha ao limpar arquivos temporários do servidor")
        elif arquivo_pdf is not None:
            logger.warning("Arquivo enviado sem nome; limpeza ignorada")


def run() -> None:
    url_to_download = extract.get_weekly_menu_url()

    if url_to_download is None:
        logger.warning("Nenhuma URL de menu encontrada.")
        return

    download_success = download.download(url_to_download)

    if not download_success:
        logger.error("Falha ao baixar o arquivo.")
        return

    process_to_json()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run()
