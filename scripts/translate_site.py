#!/usr/bin/env python3
"""
scripts/translate_site.py
=========================
Automated website translation script.

Reads config/translate_config.json (or a path supplied via --config), fetches
every URL listed in the sitemap (or scans a local HTML directory), extracts all
translatable text nodes (visible text, <title>, <meta description>, alt
attributes, OpenGraph tags), translates them via DeepL or Google Translate, and
writes the translated HTML files into language sub-folders (e.g. i18n/en/…).

Usage
-----
    python scripts/translate_site.py [--config path/to/config.json]

Environment variables
---------------------
    DEEPL_API_KEY              – required when api_provider == "deepl"
    GOOGLE_TRANSLATE_API_KEY   – required when api_provider == "google"

Configuration keys (config/translate_config.json)
--------------------------------------------------
    sitemap_url          – URL of the live sitemap (used when local_html_dir is empty)
    local_html_dir       – path to a local directory of HTML files (overrides sitemap_url)
    source_lang          – BCP-47 language code of the source content (e.g. "de")
    target_langs         – list of BCP-47 codes to translate into (e.g. ["en", "fr", "es"])
    api_provider         – "deepl" | "google"
    output_dir           – root output directory (default "i18n")
    domain_mapping       – dict mapping original domain to translated domain (optional)
    preserve_urls        – if true, keep original URLs in href/src attributes
    hreflang_options     – inject_hreflang_tags (bool), x_default_lang (str)
    batch_size           – max text strings per API call
    rate_limit_backoff_seconds – sleep time on HTTP 429
    max_retries          – number of retries per batch on transient errors
    log_level            – Python logging level name (e.g. "INFO")
    resume               – if true, skip pages whose output file already exists
"""

import argparse
import json
import logging
import os
import re
import sys
import time
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup, Comment, NavigableString, Tag

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

def setup_logging(level_name: str) -> None:
    level = getattr(logging, level_name.upper(), logging.INFO)
    logging.basicConfig(
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S",
        level=level,
    )

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Config loading
# ---------------------------------------------------------------------------

DEFAULT_CONFIG: dict[str, Any] = {
    "sitemap_url": "",
    "local_html_dir": "",
    "source_lang": "de",
    "target_langs": ["en", "fr", "es"],
    "api_provider": "deepl",
    "output_dir": "i18n",
    "domain_mapping": {},
    "preserve_urls": True,
    "hreflang_options": {
        "inject_hreflang_tags": True,
        "x_default_lang": "de",
    },
    "batch_size": 50,
    "rate_limit_backoff_seconds": 60,
    "max_retries": 3,
    "log_level": "INFO",
    "resume": True,
}


def load_config(config_path: str) -> dict[str, Any]:
    """Load and merge user config over the defaults."""
    cfg = dict(DEFAULT_CONFIG)
    path = Path(config_path)
    if not path.exists():
        logger.warning("Config file not found at %s – using defaults.", config_path)
        return cfg
    with path.open(encoding="utf-8") as fh:
        user = json.load(fh)
    # Remove comment key if present
    user.pop("_comment", None)
    cfg.update(user)
    return cfg

# ---------------------------------------------------------------------------
# Sitemap parsing
# ---------------------------------------------------------------------------

def fetch_urls_from_sitemap(sitemap_url: str) -> list[str]:
    """
    Recursively fetch all page URLs from a sitemap or sitemap index.
    Returns a deduplicated list of page URLs.
    """
    urls: list[str] = []
    visited_sitemaps: set[str] = set()

    def _process(url: str) -> None:
        if url in visited_sitemaps:
            return
        visited_sitemaps.add(url)
        try:
            resp = requests.get(url, timeout=30)
            resp.raise_for_status()
        except requests.RequestException as exc:
            logger.error("Failed to fetch sitemap %s: %s", url, exc)
            return

        soup = BeautifulSoup(resp.content, "xml")

        # Sitemap index – recurse into child sitemaps
        for loc in soup.find_all("sitemap"):
            child_loc = loc.find("loc")
            if child_loc and child_loc.text.strip():
                _process(child_loc.text.strip())

        # URL set – collect page URLs
        for loc in soup.find_all("url"):
            page_loc = loc.find("loc")
            if page_loc and page_loc.text.strip():
                urls.append(page_loc.text.strip())

    _process(sitemap_url)
    # Deduplicate while preserving order
    seen: set[str] = set()
    result: list[str] = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            result.append(u)
    logger.info("Discovered %d URLs from sitemap.", len(result))
    return result


def collect_local_html_files(directory: str) -> list[tuple[str, str]]:
    """
    Walk *directory* and return a list of (file_path, relative_url) tuples
    for every .html / .htm file found.
    """
    base = Path(directory).resolve()
    pairs: list[tuple[str, str]] = []
    for html_file in sorted(base.rglob("*.html")):
        rel = html_file.relative_to(base)
        # Convert path separators to URL slashes
        pairs.append((str(html_file), "/" + rel.as_posix()))
    for html_file in sorted(base.rglob("*.htm")):
        rel = html_file.relative_to(base)
        pairs.append((str(html_file), "/" + rel.as_posix()))
    logger.info("Found %d local HTML files in %s.", len(pairs), directory)
    return pairs

# ---------------------------------------------------------------------------
# HTML fetching / loading
# ---------------------------------------------------------------------------

def fetch_html(url: str) -> str | None:
    """Fetch a URL and return its HTML text, or None on failure."""
    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        return resp.text
    except requests.RequestException as exc:
        logger.error("Failed to fetch %s: %s", url, exc)
        return None


def load_html(path: str) -> str | None:
    """Read a local HTML file and return its text, or None on failure."""
    try:
        return Path(path).read_text(encoding="utf-8", errors="replace")
    except OSError as exc:
        logger.error("Failed to read %s: %s", path, exc)
        return None

# ---------------------------------------------------------------------------
# Text extraction
# ---------------------------------------------------------------------------

# Tags whose visible text content should be translated
_TRANSLATE_TAGS = {
    "p", "h1", "h2", "h3", "h4", "h5", "h6",
    "li", "td", "th", "caption", "blockquote",
    "dt", "dd", "figcaption", "label", "button",
    "span", "a", "strong", "em", "b", "i",
    "div",  # only leaf div nodes (no nested block children)
}

# Tags whose content we skip entirely
_SKIP_TAGS = {"script", "style", "noscript", "code", "pre", "svg"}


def _is_leaf_text_node(tag: Tag) -> bool:
    """Return True if *tag* has no block-level children (treat it as a leaf)."""
    block_tags = {"p", "div", "section", "article", "header", "footer",
                  "aside", "ul", "ol", "table", "blockquote", "pre"}
    for child in tag.children:
        if isinstance(child, Tag) and child.name in block_tags:
            return False
    return True


class TextNode:
    """Represents a single translatable piece of text found in the HTML."""
    __slots__ = ("key", "original", "translated", "node_ref", "attr")

    def __init__(self, key: str, original: str, node_ref: Any, attr: str | None = None):
        self.key = key
        self.original = original.strip()
        self.translated: str | None = None
        self.node_ref = node_ref  # NavigableString or Tag
        self.attr = attr          # attribute name if this is an attribute value


def extract_text_nodes(soup: BeautifulSoup) -> list[TextNode]:
    """
    Walk the parsed HTML tree and collect all translatable text nodes.

    Covers:
    - <title> text
    - <meta name="description"> content attribute
    - <meta property="og:*"> content attribute
    - <meta name="twitter:*"> content attribute
    - alt attributes on <img> tags
    - visible text inside standard HTML elements
    """
    nodes: list[TextNode] = []
    idx = 0

    def _add(text: str, node_ref: Any, attr: str | None = None) -> None:
        nonlocal idx
        clean = text.strip()
        if clean and not clean.isspace():
            nodes.append(TextNode(f"node_{idx}", clean, node_ref, attr))
            idx += 1

    # --- <title> ---
    title_tag = soup.find("title")
    if title_tag and title_tag.string:
        _add(title_tag.string, title_tag.string, attr=None)

    # --- <meta description / og / twitter> ---
    for meta in soup.find_all("meta"):
        name = meta.get("name", "").lower()
        prop = meta.get("property", "").lower()
        content = meta.get("content", "").strip()
        if not content:
            continue
        # "keywords" is intentionally excluded – it contains comma-separated
        # terms that are best left in the source language for SEO consistency.
        if name == "description" or prop.startswith("og:") or name.startswith("twitter:"):
            _add(content, meta, attr="content")

    # --- alt attributes on images ---
    for img in soup.find_all("img"):
        alt = img.get("alt", "").strip()
        if alt:
            _add(alt, img, attr="alt")

    # --- visible body text ---
    body = soup.find("body")
    if body:
        for element in body.descendants:
            if isinstance(element, Comment):
                continue
            if isinstance(element, NavigableString):
                text = str(element)
                if not text.strip():
                    continue
                parent = element.parent
                if parent is None:
                    continue
                # Skip undesirable parent tags
                if parent.name in _SKIP_TAGS:
                    continue
                # Only collect from known translatable tags
                if parent.name in _TRANSLATE_TAGS:
                    # Avoid duplicating text already covered by a parent node
                    _add(text, element, attr=None)

    return nodes

# ---------------------------------------------------------------------------
# Translation API clients
# ---------------------------------------------------------------------------

def _deepl_translate(texts: list[str], target_lang: str, source_lang: str,
                     api_key: str, backoff: int, max_retries: int) -> list[str]:
    """
    Translate a list of strings using the DeepL REST API.
    Supports both the free (api-free.deepl.com) and pro (api.deepl.com) endpoints.
    """
    # DeepL language codes are uppercase; only the primary subtag is sent
    # (e.g. "en-US" → "EN", "fr-BE" → "FR"). Regional variants are therefore
    # treated as the base language when calling the API.
    tl = target_lang.upper().split("-")[0]  # e.g. EN, FR, ES, ZH
    sl = source_lang.upper()

    # Choose endpoint based on key suffix
    host = "api-free.deepl.com" if api_key.endswith(":fx") else "api.deepl.com"
    url = f"https://{host}/v2/translate"

    payload: dict[str, Any] = {
        "auth_key": api_key,
        "target_lang": tl,
        "source_lang": sl,
        "text": texts,
        "tag_handling": "html",
        "non_splitting_tags": ["em", "strong", "b", "i", "a", "span"],
    }

    for attempt in range(max_retries):
        try:
            resp = requests.post(url, json=payload, timeout=60)
            if resp.status_code == 429:
                logger.warning("DeepL rate limit hit. Sleeping %ds (attempt %d/%d).",
                               backoff, attempt + 1, max_retries)
                time.sleep(backoff)
                continue
            resp.raise_for_status()
            data = resp.json()
            return [item["text"] for item in data["translations"]]
        except requests.RequestException as exc:
            logger.warning("DeepL request error (attempt %d/%d): %s", attempt + 1, max_retries, exc)
            if attempt < max_retries - 1:
                time.sleep(backoff)

    logger.error("DeepL translation failed after %d retries.", max_retries)
    return texts  # fall back to original text


def _google_translate(texts: list[str], target_lang: str, source_lang: str,
                      api_key: str, backoff: int, max_retries: int) -> list[str]:
    """
    Translate a list of strings using the Google Cloud Translation REST API (v2).
    """
    url = "https://translation.googleapis.com/language/translate/v2"
    payload = {
        "q": texts,
        "source": source_lang,
        "target": target_lang,
        "format": "html",
        "key": api_key,
    }

    for attempt in range(max_retries):
        try:
            resp = requests.post(url, json=payload, timeout=60)
            if resp.status_code == 429:
                logger.warning("Google Translate rate limit hit. Sleeping %ds (attempt %d/%d).",
                               backoff, attempt + 1, max_retries)
                time.sleep(backoff)
                continue
            resp.raise_for_status()
            data = resp.json()
            return [item["translatedText"] for item in data["data"]["translations"]]
        except (requests.RequestException, KeyError) as exc:
            logger.warning("Google Translate error (attempt %d/%d): %s", attempt + 1, max_retries, exc)
            if attempt < max_retries - 1:
                time.sleep(backoff)

    logger.error("Google Translate failed after %d retries.", max_retries)
    return texts


def translate_batch(texts: list[str], target_lang: str, source_lang: str,
                    cfg: dict[str, Any]) -> list[str]:
    """Dispatch a batch to the configured translation provider."""
    provider = cfg["api_provider"].lower()
    backoff = int(cfg["rate_limit_backoff_seconds"])
    retries = int(cfg["max_retries"])

    if provider == "deepl":
        api_key = os.environ.get("DEEPL_API_KEY", "")
        if not api_key:
            logger.error("DEEPL_API_KEY environment variable is not set.")
            return texts
        return _deepl_translate(texts, target_lang, source_lang, api_key, backoff, retries)

    if provider == "google":
        api_key = os.environ.get("GOOGLE_TRANSLATE_API_KEY", "")
        if not api_key:
            logger.error("GOOGLE_TRANSLATE_API_KEY environment variable is not set.")
            return texts
        return _google_translate(texts, target_lang, source_lang, api_key, backoff, retries)

    logger.error("Unknown api_provider '%s'. No translation performed.", provider)
    return texts

# ---------------------------------------------------------------------------
# Applying translations back to the HTML tree
# ---------------------------------------------------------------------------

def apply_translations(nodes: list[TextNode], translated: list[str]) -> None:
    """Write translated strings back into the BeautifulSoup tree."""
    assert len(nodes) == len(translated), (
        f"Node/translation count mismatch: expected {len(nodes)}, got {len(translated)}"
    )
    for node, trans in zip(nodes, translated):
        if not trans:
            continue
        if node.attr is not None:
            # Attribute-based node (meta content, img alt, etc.)
            node.node_ref[node.attr] = trans
        else:
            # NavigableString – replace in place
            node.node_ref.replace_with(trans)


# ---------------------------------------------------------------------------
# hreflang injection
# ---------------------------------------------------------------------------

def inject_hreflang_tags(soup: BeautifulSoup, page_url: str,
                         source_lang: str, target_langs: list[str],
                         x_default: str, output_dir: str,
                         domain_mapping: dict[str, str]) -> None:
    """
    Inject <link rel="alternate" hreflang="…"> tags into the <head>.
    All alternate URLs are constructed from the output_dir path convention.
    """
    head = soup.find("head")
    if head is None:
        return

    parsed = urlparse(page_url)
    # Build a list of (lang, url) pairs for the hreflang set
    all_langs = [source_lang] + list(target_langs)
    for lang in all_langs:
        if lang == source_lang:
            href = page_url
        else:
            # Translated pages live at /{output_dir}/{lang}/{path}
            href = f"/{output_dir}/{lang}{parsed.path}"

        # Apply optional domain mapping
        for orig_domain, new_domain in domain_mapping.items():
            href = href.replace(orig_domain, new_domain)

        link = soup.new_tag("link", rel="alternate", hreflang=lang, href=href)
        head.append(link)

    # x-default – point to the language configured as the canonical default
    if x_default == source_lang:
        xdefault_href = page_url
    else:
        xdefault_href = f"/{output_dir}/{x_default}{parsed.path}"
        for orig_domain, new_domain in domain_mapping.items():
            xdefault_href = xdefault_href.replace(orig_domain, new_domain)
    link_default = soup.new_tag("link", rel="alternate", hreflang="x-default", href=xdefault_href)
    head.append(link_default)

# ---------------------------------------------------------------------------
# Output path computation
# ---------------------------------------------------------------------------

def output_path_for(page_url: str, lang: str, output_dir: str) -> Path:
    """
    Given a page URL and a language code, return the local file path where
    the translated HTML should be written.

    Examples:
      https://example.com/       -> i18n/en/index.html
      https://example.com/about  -> i18n/en/about/index.html
      https://example.com/a/b/   -> i18n/en/a/b/index.html
    """
    parsed = urlparse(page_url)
    path = parsed.path.rstrip("/") or "/"

    if path == "/":
        rel = "index.html"
    elif path.endswith(".html") or path.endswith(".htm"):
        rel = path.lstrip("/")
    else:
        rel = path.lstrip("/") + "/index.html"

    return Path(output_dir) / lang / rel


def output_path_for_local(rel_url: str, lang: str, output_dir: str) -> Path:
    """Same as output_path_for but for a local relative URL."""
    return output_path_for(f"http://localhost{rel_url}", lang, output_dir)

# ---------------------------------------------------------------------------
# Resume support
# ---------------------------------------------------------------------------

RESUME_LOG = ".translate_resume.json"


def load_resume_log() -> set[str]:
    """Return a set of already-translated page keys (url:lang)."""
    p = Path(RESUME_LOG)
    if p.exists():
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
            return set(data.get("done", []))
        except (json.JSONDecodeError, OSError):
            pass
    return set()


def save_resume_log(done: set[str]) -> None:
    """Persist the set of completed page keys to disk."""
    try:
        Path(RESUME_LOG).write_text(
            json.dumps({"done": sorted(done)}, indent=2),
            encoding="utf-8",
        )
    except OSError as exc:
        logger.warning("Could not write resume log: %s", exc)

# ---------------------------------------------------------------------------
# Main translation loop
# ---------------------------------------------------------------------------

def translate_page(
    html: str,
    page_url: str,
    target_lang: str,
    cfg: dict[str, Any],
) -> str:
    """
    Parse *html*, extract text nodes, translate them, optionally inject
    hreflang tags, and return the modified HTML as a string.
    """
    soup = BeautifulSoup(html, "lxml")
    nodes = extract_text_nodes(soup)

    if not nodes:
        logger.debug("No translatable nodes found in %s", page_url)
        return str(soup)

    # Split into batches to respect API limits
    batch_size = int(cfg["batch_size"])
    source_lang = cfg["source_lang"]
    translated_strings: list[str] = []

    for i in range(0, len(nodes), batch_size):
        batch_nodes = nodes[i : i + batch_size]
        originals = [n.original for n in batch_nodes]
        translated_strings.extend(
            translate_batch(originals, target_lang, source_lang, cfg)
        )

    apply_translations(nodes, translated_strings)

    # Inject hreflang if requested
    hreflang_opts = cfg.get("hreflang_options", {})
    if hreflang_opts.get("inject_hreflang_tags", False):
        inject_hreflang_tags(
            soup=soup,
            page_url=page_url,
            source_lang=source_lang,
            target_langs=cfg["target_langs"],
            x_default=hreflang_opts.get("x_default_lang", source_lang),
            output_dir=cfg["output_dir"],
            domain_mapping=cfg.get("domain_mapping", {}),
        )

    # Update <html lang="…"> attribute
    html_tag = soup.find("html")
    if html_tag and isinstance(html_tag, Tag):
        html_tag["lang"] = target_lang

    return str(soup)


def run(cfg: dict[str, Any]) -> None:
    """Main entry point – orchestrates discovery, translation, and file writing."""
    setup_logging(cfg.get("log_level", "INFO"))

    output_dir = cfg["output_dir"]
    target_langs: list[str] = cfg["target_langs"]
    resume = bool(cfg.get("resume", True))

    if not target_langs:
        logger.error("No target_langs configured. Nothing to do.")
        sys.exit(1)

    # --- Discover pages ---
    local_dir = cfg.get("local_html_dir", "").strip()
    if local_dir:
        local_pairs = collect_local_html_files(local_dir)
        pages: list[tuple[str | None, str]] = [
            (path, f"http://localhost{rel}") for path, rel in local_pairs
        ]
    else:
        sitemap_url = cfg.get("sitemap_url", "").strip()
        if not sitemap_url:
            logger.error("Neither local_html_dir nor sitemap_url is configured.")
            sys.exit(1)
        urls = fetch_urls_from_sitemap(sitemap_url)
        pages = [(None, url) for url in urls]

    if not pages:
        logger.warning("No pages discovered. Exiting.")
        return

    done = load_resume_log() if resume else set()
    newly_done: set[str] = set()

    for local_path, page_url in pages:
        for lang in target_langs:
            resume_key = f"{page_url}:{lang}"
            if resume and resume_key in done:
                logger.debug("Skipping (already done): %s → %s", page_url, lang)
                continue

            logger.info("Translating %s → %s", page_url, lang)

            # Determine output path early so we can skip if resume is active
            out_file = output_path_for(page_url, lang, output_dir)

            # Load HTML
            if local_path:
                html = load_html(local_path)
            else:
                html = fetch_html(page_url)

            if not html:
                logger.warning("Skipping %s (could not load HTML).", page_url)
                continue

            # Translate
            try:
                translated_html = translate_page(html, page_url, lang, cfg)
            except Exception as exc:  # pylint: disable=broad-except
                logger.error("Error translating %s → %s: %s", page_url, lang, exc)
                continue

            # Write output
            out_file.parent.mkdir(parents=True, exist_ok=True)
            try:
                out_file.write_text(translated_html, encoding="utf-8")
                logger.info("Written: %s", out_file)
            except OSError as exc:
                logger.error("Failed to write %s: %s", out_file, exc)
                continue

            newly_done.add(resume_key)

    # Persist resume state
    if resume:
        done.update(newly_done)
        save_resume_log(done)

    logger.info("Translation complete. %d page/language combinations processed.", len(newly_done))

# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Translate a website into multiple languages.",
    )
    parser.add_argument(
        "--config",
        default="config/translate_config.json",
        help="Path to the JSON configuration file (default: config/translate_config.json)",
    )
    args = parser.parse_args()
    cfg = load_config(args.config)
    run(cfg)


if __name__ == "__main__":
    main()
