import logging

import time

import requests
from bs4 import BeautifulSoup, Tag

logger = logging.getLogger(__name__)

PAGE_URL = "http://www.propaae.uefs.br/modules/conteudo/conteudo.php?conteudo=15"
BASE_URL = "http://www.propaae.uefs.br"


def fetch_page(url: str) -> str:
    """Fetches and returns the HTML content of a page with retries."""
    logger.info("Fetching page", extra={"url": url})
    
    # Simula um navegador real
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    # Tenta até 3 vezes se der timeout
    for tentativa in range(3):
        try:
            response = requests.get(url, headers=headers, timeout=20) # Aumentamos para 20 segundos
            response.raise_for_status()
            logger.debug("Fetched page successfully", extra={"url": url})
            return response.text
        except requests.exceptions.ConnectTimeout as e:
            if tentativa == 2: # Se for a última tentativa, lança o erro
                raise e
            logger.warning(f"Timeout na tentativa {tentativa + 1}. Tentando novamente em 5 segundos...")
            time.sleep(5)

def parse_html(html: str) -> BeautifulSoup:
    """Parses HTML string into a BeautifulSoup object."""
    logger.debug("Parsing HTML", extra={"length": len(html)})
    return BeautifulSoup(html, "html.parser")


def _has_menu_keyword(href: str | list[str] | None) -> bool:
    if isinstance(href, list):
        return any(
            isinstance(item, str) and "cardapio" in item.lower() for item in href
        )
    if isinstance(href, str):
        return "cardapio" in href.lower()
    return False


def _normalize_href(href: str | list[str] | None) -> str | None:
    if isinstance(href, list):
        for item in href:
            if isinstance(item, str):
                return item
        return None
    return href


def extract_menu_url(soup: BeautifulSoup) -> str | None:
    """Extracts the menu URL from parsed HTML."""
    link = soup.find("a", href=_has_menu_keyword)

    if not isinstance(link, Tag):
        logger.warning("Menu link not found in HTML")
        return None

    href = _normalize_href(link.get("href"))
    logger.info("Menu link extracted", extra={"href": href})
    return href


def ensure_absolute_url(url: str, base: str = "http://www.propaae.uefs.br") -> str:
    """Ensures a URL is absolute by adding the base if needed."""
    return url if url.startswith("http") else f"{base.rstrip('/')}/{url.lstrip('/')}"


def get_weekly_menu_url() -> str | None:
    """Gets the weekly menu PDF URL from the university restaurant page."""

    try:
        html = fetch_page(PAGE_URL)
        soup = parse_html(html)
        relative_url = extract_menu_url(soup)

        if relative_url:
            absolute_url = ensure_absolute_url(relative_url, BASE_URL)
            logger.info("Absolute menu URL resolved", extra={"url": absolute_url})
            return absolute_url
        return None
    except requests.RequestException as error:
        logger.error("Failed to fetch menu", exc_info=error)
        return None


def main() -> None:
    """Runs the menu URL extraction and displays the result."""

    url = get_weekly_menu_url()

    if url:
        logger.info("Menu link resolved", extra={"url": url})
        print(f"✅ Menu link: {url}")
    else:
        logger.error("Menu link not found")
        print("❌ Menu link not found")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
