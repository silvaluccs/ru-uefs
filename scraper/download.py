import logging
from datetime import date
from pathlib import Path

import extract
import requests

logger = logging.getLogger(__name__)

OUTPUT_DIR = Path(__file__).resolve().parents[1] / "temp"


def download(url: str) -> bool:
    logger.info("Downloading menu", extra={"url": url})

    try:
        response = requests.get(url=url, stream=True, timeout=10)
        response.raise_for_status()
    except requests.RequestException as error:
        logger.error("Failed to download menu", exc_info=error)
        return False

    file_name = f"cardapio_{date.today().strftime('%Y-%m-%d')}.pdf"
    file_path = OUTPUT_DIR / file_name

    try:
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        with file_path.open("wb") as f:
            f.write(response.content)
    except OSError as error:
        logger.error("Failed to write menu file", exc_info=error)
        return False

    logger.info("Menu saved", extra={"file_path": str(file_path)})
    return True


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    url = extract.get_weekly_menu_url()

    if url is not None:
        download(url)
