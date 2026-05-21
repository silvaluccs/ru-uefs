import requests
from bs4 import BeautifulSoup, Tag

PAGE_URL = "http://www.propaae.uefs.br/modules/conteudo/conteudo.php?conteudo=15"
BASE_URL = "http://www.propaae.uefs.br"


def fetch_page(url: str) -> str:
    """Fetches and returns the HTML content of a page."""
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.text


def parse_html(html: str) -> BeautifulSoup:
    """Parses HTML string into a BeautifulSoup object."""
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
        return None

    return _normalize_href(link.get("href"))


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
            return ensure_absolute_url(relative_url, BASE_URL)
        return None
    except requests.RequestException as error:
        print(f"Failed to fetch menu: {error}")
        return None


def main() -> None:
    """Runs the menu URL extraction and displays the result."""

    url = get_weekly_menu_url()

    if url:
        print(f"✅ Menu link: {url}")
    else:
        print("❌ Menu link not found")


if __name__ == "__main__":
    main()
