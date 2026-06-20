#!/usr/bin/env python3
"""Refresh the four verified books shown in the new-arrivals section."""

from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from zoneinfo import ZoneInfo


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "data/books/new-arrivals.json"
API_URL = "https://ndlsearch.ndl.go.jp/api/sru"
COLORS = ["#d5dce1", "#c8d2dc", "#cfd0dc", "#d8dee2"]
MAJOR_PUBLISHERS = (
    "新潮社", "文藝春秋", "講談社", "集英社", "小学館", "KADOKAWA",
    "河出書房新社", "中央公論新社", "幻冬舎", "東京創元社", "早川書房",
    "双葉社", "光文社", "祥伝社", "角川春樹事務所", "筑摩書房",
)
EXCLUDED_WORDS = (
    "異世界", "転生", "令嬢", "婚約破棄", "溺愛", "公爵", "王子", "悪役",
    "チート", "聖女", "魔法使い", "コミック", "漫画", "アンソロジー",
    "ノベライズ", "公式小説", "スピンオフ", "ゲーム", "ドラマCD", "BL",
    "絵本", "ファンブック", "青い鳥文庫", "スニーカー文庫", "ビーンズ文庫", "キャラブン",
)
EXCLUDED_CREATOR_MARKERS = ("編", "編集", "原作", "監修", "著者不明")
PREFERRED_AUTHORS = {
    "青山七恵", "滝口悠生", "小砂川チト", "柚木麻子", "大庭みな子", "林真理子",
    "西尾維新", "堂場瞬一", "麻見和史", "千葉ともこ", "高瀬乃一", "紗倉まな",
    "辻村深月", "吉田修一", "澤村伊智", "小林恭二", "朝井リョウ", "伊坂幸太郎",
    "村田沙耶香", "川上未映子", "小川洋子", "川上弘美", "綿矢りさ", "金原ひとみ",
    "恩田陸", "宮部みゆき", "東野圭吾", "湊かなえ", "三浦しをん", "角田光代",
    "凪良ゆう", "宇佐見りん", "朝比奈秋", "高瀬隼子", "市川沙央", "九段理江",
    "平野啓一郎", "又吉直樹", "佐藤究", "逢坂冬馬", "町田康", "多和田葉子",
    "松浦理英子", "津村記久子", "柴崎友香", "金原ひとみ", "古川日出男", "絲山秋子",
}
NS = {
    "srw": "http://www.loc.gov/zing/srw/",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "dc": "http://purl.org/dc/elements/1.1/",
    "dcterms": "http://purl.org/dc/terms/",
    "dcndl": "http://ndl.go.jp/dcndl/terms/",
    "foaf": "http://xmlns.com/foaf/0.1/",
}


def text_of(parent: ET.Element, path: str) -> str:
    node = parent.find(path, NS)
    return "" if node is None or node.text is None else node.text.strip()


def clean_author(value: str) -> str:
    value = re.sub(r"\s*[\[（(]?(著|作|著作)[\]）)]?\s*$", "", value).strip()
    return re.sub(r"[,，\s]+", "", value)


def known_authors() -> set[str]:
    authors: set[str] = set()
    index = json.loads((ROOT / "data/books/catalog-index.json").read_text(encoding="utf-8"))
    for source in index:
        path = ROOT / source["path"].removeprefix("./")
        for book in json.loads(path.read_text(encoding="utf-8")):
            if book.get("author"):
                authors.add(re.sub(r"\s+", "", book["author"]))
    return authors


def fetch_records(month: str) -> list[dict[str, str]]:
    query = f'ndc="913" AND from="{month}" AND until="{month}"'
    params = urllib.parse.urlencode({
        "operation": "searchRetrieve",
        "version": "1.2",
        "recordSchema": "dcndl",
        "maximumRecords": "200",
        "inprocess": "true",
        "query": query,
    })
    request = urllib.request.Request(
        f"{API_URL}?{params}",
        headers={"User-Agent": "YohakuReadingApp/1.0 (monthly bibliography refresh)"},
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        outer = ET.fromstring(response.read())

    records: list[dict[str, str]] = []
    for record_data in outer.findall(".//srw:recordData", NS):
        if not record_data.text:
            continue
        try:
            rdf = ET.fromstring(html.unescape(record_data.text))
        except ET.ParseError:
            continue
        resource = next((node for node in rdf.findall("dcndl:BibResource", NS) if node.find("dcterms:title", NS) is not None), None)
        if resource is None:
            continue
        title = text_of(resource, "dcterms:title")
        creator = text_of(resource, "dc:creator")
        author = clean_author(creator)
        publisher = text_of(resource, "dcterms:publisher/foaf:Agent/foaf:name")
        publication_date = text_of(resource, "dcterms:date")
        extent = text_of(resource, "dcterms:extent")
        audience = text_of(resource, "dcterms:audience")
        series = text_of(resource, "dcndl:seriesTitle/rdf:Description/rdf:value")
        isbn = ""
        for identifier in resource.findall("dcterms:identifier", NS):
            datatype = identifier.attrib.get(f"{{{NS['rdf']}}}datatype", "")
            if datatype.endswith("ISBN") and identifier.text:
                isbn = identifier.text.strip()
                break
        admin = rdf.find("dcndl:BibAdminResource", NS)
        source_url = "" if admin is None else admin.attrib.get(f"{{{NS['rdf']}}}about", "")
        records.append({
            "title": title,
            "author": author,
            "creator": creator,
            "publisher": publisher,
            "date": publication_date,
            "extent": extent,
            "audience": audience,
            "series": series,
            "isbn": isbn,
            "sourceUrl": source_url,
        })
    return records


def choose_books(records: list[dict[str, str]], month: str) -> list[dict[str, object]]:
    familiar = known_authors()
    candidates: list[tuple[int, dict[str, str]]] = []
    seen: set[tuple[str, str]] = set()
    for book in records:
        title, author = book["title"], book["author"]
        searchable = f'{title} {book["series"]}'
        if not title or not author or not book["sourceUrl"] or not book["isbn"]:
            continue
        if book["audience"] and book["audience"] != "一般":
            continue
        if not any(name in book["publisher"] for name in MAJOR_PUBLISHERS):
            continue
        if any(word.casefold() in searchable.casefold() for word in EXCLUDED_WORDS):
            continue
        if any(marker in book["creator"] for marker in EXCLUDED_CREATOR_MARKERS):
            continue
        identity = (re.sub(r"\s+", "", title).casefold(), author.casefold())
        if identity in seen:
            continue
        seen.add(identity)
        size_match = re.search(r";\s*(\d+)cm", book["extent"])
        size = int(size_match.group(1)) if size_match else 0
        score = 50 if author in familiar or author in PREFERRED_AUTHORS else 0
        score += 12 if size >= 18 else 4
        score += max(0, len(MAJOR_PUBLISHERS) - next(i for i, name in enumerate(MAJOR_PUBLISHERS) if name in book["publisher"]))
        score -= 4 if re.search(r"(?:\s|^)[上下](?:\s|$)|\d+$", title) else 0
        candidates.append((score, book))

    candidates.sort(key=lambda item: (-item[0], item[1]["title"]))
    selected: list[dict[str, object]] = []
    authors: set[str] = set()
    publishers: set[str] = set()
    selected_urls: set[str] = set()
    for require_new_publisher in (True, False):
        for _, book in candidates:
            if book["sourceUrl"] in selected_urls or book["author"] in authors:
                continue
            if require_new_publisher and book["publisher"] in publishers:
                continue
            authors.add(book["author"])
            publishers.add(book["publisher"])
            selected_urls.add(book["sourceUrl"])
            selected.append({
                "title": book["title"],
                "author": book["author"],
                "genre": "小説",
                "date": month,
                "tone": "今月 文学",
                "description": f'{book["publisher"]}から{int(month[-2:])}月刊行。次に読む本の候補へ。',
                "color": COLORS[len(selected)],
                "isbn": book["isbn"],
                "publisher": book["publisher"],
                "source": "国立国会図書館サーチ",
                "sourceUrl": book["sourceUrl"],
                "verified": True,
            })
            if len(selected) == 4:
                return selected
    return selected


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--month", help="Target month in YYYY-MM format")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    month = args.month or dt.datetime.now(ZoneInfo("Asia/Tokyo")).strftime("%Y-%m")
    if not re.fullmatch(r"\d{4}-\d{2}", month):
        parser.error("--month must use YYYY-MM")

    selected = choose_books(fetch_records(month), month)
    if len(selected) < 4:
        print(f"Only {len(selected)} verified candidates found; keeping the existing file.", file=sys.stderr)
        return 0
    payload = {
        "month": month,
        "updatedAt": dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "source": "国立国会図書館サーチ",
        "sourceUrl": "https://ndlsearch.ndl.go.jp/",
        "books": selected,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    rendered = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    if args.output.exists():
        current = json.loads(args.output.read_text(encoding="utf-8"))
        if current.get("month") == month and current.get("books") == selected:
            print("New-arrivals data is already current.")
            return 0
    args.output.write_text(rendered, encoding="utf-8")
    print(f"Updated {args.output} with {len(selected)} verified books for {month}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
