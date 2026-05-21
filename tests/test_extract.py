import unittest
from unittest.mock import Mock, patch

import requests
from bs4 import BeautifulSoup

from scraper import extract


class TestFetchPage(unittest.TestCase):
    def test_fetch_page_success(self) -> None:
        response = Mock()
        response.text = "<html></html>"
        response.raise_for_status = Mock()

        with patch("scraper.extract.requests.get", return_value=response) as get:
            html = extract.fetch_page("http://example.com")

        get.assert_called_once_with("http://example.com", timeout=10)
        response.raise_for_status.assert_called_once()
        self.assertEqual(html, "<html></html>")

    def test_fetch_page_raises_http_error(self) -> None:
        response = Mock()
        response.raise_for_status.side_effect = requests.HTTPError("boom")

        with patch("scraper.extract.requests.get", return_value=response):
            with self.assertRaises(requests.HTTPError):
                extract.fetch_page("http://example.com")


class TestParseHtml(unittest.TestCase):
    def test_parse_html_returns_soup(self) -> None:
        soup = extract.parse_html("<html><body><p>Hi</p></body></html>")

        self.assertIsInstance(soup, BeautifulSoup)
        p_tag = soup.find("p")
        assert p_tag is not None
        self.assertEqual(p_tag.text, "Hi")


class TestMenuUrlHelpers(unittest.TestCase):
    def test_has_menu_keyword(self) -> None:
        self.assertTrue(extract._has_menu_keyword("/cardapio.pdf"))
        self.assertTrue(extract._has_menu_keyword(["/foo", "/Cardapio.pdf"]))
        self.assertFalse(extract._has_menu_keyword("/menu.pdf"))
        self.assertFalse(extract._has_menu_keyword(None))

    def test_normalize_href(self) -> None:
        self.assertEqual(extract._normalize_href(["/a", "/b"]), "/a")
        self.assertIsNone(extract._normalize_href([]))
        self.assertEqual(extract._normalize_href("/a"), "/a")
        self.assertIsNone(extract._normalize_href(None))


class TestExtractMenuUrl(unittest.TestCase):
    def test_extract_menu_url_found(self) -> None:
        soup = extract.parse_html('<a href="/cardapio.pdf">Cardápio</a>')

        self.assertEqual(extract.extract_menu_url(soup), "/cardapio.pdf")

    def test_extract_menu_url_not_found(self) -> None:
        soup = extract.parse_html('<a href="/menu.pdf">Menu</a>')

        self.assertIsNone(extract.extract_menu_url(soup))


class TestGetWeeklyMenuUrlIntegration(unittest.TestCase):
    def _mock_response(self, text: str) -> Mock:
        response = Mock()
        response.text = text
        response.raise_for_status = Mock()
        return response

    def test_get_weekly_menu_url_relative(self) -> None:
        html = '<html><a href="/files/cardapio.pdf">Cardápio</a></html>'
        response = self._mock_response(html)

        with patch("scraper.extract.requests.get", return_value=response):
            url = extract.get_weekly_menu_url()

        self.assertEqual(url, "http://www.propaae.uefs.br/files/cardapio.pdf")

    def test_get_weekly_menu_url_absolute(self) -> None:
        html = (
            '<html><a href="http://www.propaae.uefs.br/files/cardapio.pdf">'
            "Cardápio</a></html>"
        )
        response = self._mock_response(html)

        with patch("scraper.extract.requests.get", return_value=response):
            url = extract.get_weekly_menu_url()

        self.assertEqual(url, "http://www.propaae.uefs.br/files/cardapio.pdf")

    def test_get_weekly_menu_url_request_error(self) -> None:
        with (
            patch(
                "scraper.extract.requests.get",
                side_effect=requests.RequestException("fail"),
            ),
            patch("builtins.print") as printer,
        ):
            url = extract.get_weekly_menu_url()

        self.assertIsNone(url)
        printer.assert_called()
