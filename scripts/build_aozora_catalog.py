#!/usr/bin/env python3

import csv
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BOOKS_DIR = ROOT / "data" / "books"
AOSORA_CSV = ROOT / "tmp" / "aozora-data" / "list_person_all_extended_utf8.csv"

TARGETS = {
    "japanese-modern-aozora-plus.json": 360,
    "japanese-poetry-aozora-plus.json": 80,
    "japanese-tanka-aozora-plus.json": 80,
}

MODERN_AUTHORS = {
    "芥川竜之介", "太宰治", "夏目漱石", "森鴎外", "宮沢賢治", "泉鏡花", "梶井基次郎",
    "国木田独歩", "志賀直哉", "谷崎潤一郎", "有島武郎", "中島敦", "徳田秋声",
    "島崎藤村", "織田作之助", "坂口安吾", "川端康成", "横光利一", "小川未明",
    "林芙美子", "堀辰雄", "正宗白鳥", "里見弴", "佐藤春夫", "嘉村礒多",
    "菊池寛", "久生十蘭", "久米正雄", "室生犀星", "夢野久作", "田山花袋",
    "岡本かの子", "岡本綺堂", "牧野信一", "中勘助", "長与善郎", "豊島与志雄",
    "武者小路実篤", "尾崎士郎", "正宗白鳥", "葛西善蔵", "広津和郎", "宇野浩二"
}

POETRY_AUTHORS = {
    "萩原朔太郎", "宮沢賢治", "中原中也", "三好達治", "北原白秋", "安西冬衛",
    "小熊秀雄", "百田宗治", "室生犀星", "佐藤春夫", "富永太郎", "竹内浩三",
    "森川義信", "今野大力", "槙村浩", "蒲原有明", "野口雨情", "金子みすゞ",
    "山村暮鳥", "草野心平", "高村光太郎", "壺井繁治", "立原道造", "原民喜"
}

TANKA_AUTHORS = {
    "石川啄木", "斎藤茂吉", "与謝野晶子", "北原白秋", "正岡子規", "伊藤左千夫",
    "長塚節", "折口信夫", "釈迢空", "窪田空穂", "会津八一", "与謝野鉄幹"
}

TANKA_TITLE_KEYWORDS = (
    "歌集", "和歌", "短歌", "一握の砂", "悲しき玩具", "みだれ髪", "恋衣",
    "桐の花", "雲母集", "歌よみに与ふる書", "万葉秀歌", "歌の", "古歌"
)

POETRY_SKIP_WORDS = ("校歌", "県歌")


def normalize(value: str) -> str:
    text = unicodedata.normalize("NFKC", value or "")
    return "".join(ch.lower() for ch in text if not ch.isspace())


def likely_japanese_author(author: str) -> bool:
    if not author:
        return False
    return bool(re.search(r"[一-龯ぁ-ん]", author))


def load_existing_identities():
    seen = set()
    for path in BOOKS_DIR.glob("*.json"):
        data = json.loads(path.read_text(encoding="utf-8"))
        books = data if isinstance(data, list) else data.get("books", [])
        for book in books:
            seen.add((normalize(book.get("title", "")), normalize(book.get("author", ""))))
            if book.get("sourceId"):
                seen.add(("source", str(book["sourceId"])))
    return seen


def to_record(row, category: str):
    author = f'{row["姓"] or ""}{row["名"] or ""}'.strip()
    return {
        "id": f'aozora-plus-{row["作品ID"]}',
        "title": row["作品名"],
        "titleKana": row["作品名読み"],
        "author": author,
        "authorKana": f'{row["姓読み"] or ""}{row["名読み"] or ""}'.strip(),
        "category": category,
        "source": "青空文庫",
        "sourceId": row["作品ID"],
        "sourceUrl": row["図書カードURL"],
        "ndc": row["分類番号"],
    }


def unique_append(target, row, category, seen):
    record = to_record(row, category)
    identity = (normalize(record["title"]), normalize(record["author"]))
    if identity in seen or ("source", str(record["sourceId"])) in seen:
        return False
    seen.add(identity)
    seen.add(("source", str(record["sourceId"])))
    target.append(record)
    return True


def sort_key(row):
    author = f'{row["姓"] or ""}{row["名"] or ""}'
    return (normalize(author), normalize(row["作品名"]), row["作品ID"])


def main():
    if not AOSORA_CSV.exists():
        raise SystemExit(f"Missing source csv: {AOSORA_CSV}")

    seen = load_existing_identities()

    with AOSORA_CSV.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))

    modern = []
    poetry = []
    tanka = []

    modern_rows = sorted(
        [
            row for row in rows
            if "NDC 913" in (row["分類番号"] or "")
            and likely_japanese_author(f'{row["姓"] or ""}{row["名"] or ""}')
            and f'{row["姓"] or ""}{row["名"] or ""}' in MODERN_AUTHORS
        ],
        key=sort_key
    )
    for row in modern_rows:
        if len(modern) >= TARGETS["japanese-modern-aozora-plus.json"]:
            break
        unique_append(modern, row, "modern-classics", seen)

    poetry_rows = sorted(
        [
            row for row in rows
            if "NDC 911" in (row["分類番号"] or "")
            and likely_japanese_author(f'{row["姓"] or ""}{row["名"] or ""}')
            and f'{row["姓"] or ""}{row["名"] or ""}' in POETRY_AUTHORS
            and not any(skip in (row["作品名"] or "") for skip in POETRY_SKIP_WORDS)
        ],
        key=sort_key
    )
    for row in poetry_rows:
        if len(poetry) >= TARGETS["japanese-poetry-aozora-plus.json"]:
            break
        unique_append(poetry, row, "poetry", seen)

    tanka_rows = sorted(
        [
            row for row in rows
            if "NDC 911" in (row["分類番号"] or "")
            and likely_japanese_author(f'{row["姓"] or ""}{row["名"] or ""}')
            and (
                f'{row["姓"] or ""}{row["名"] or ""}' in TANKA_AUTHORS
                or any(keyword in (row["作品名"] or "") for keyword in TANKA_TITLE_KEYWORDS)
            )
        ],
        key=sort_key
    )
    for row in tanka_rows:
        if len(tanka) >= TARGETS["japanese-tanka-aozora-plus.json"]:
            break
        unique_append(tanka, row, "tanka", seen)

    payloads = {
        "japanese-modern-aozora-plus.json": modern,
        "japanese-poetry-aozora-plus.json": poetry,
        "japanese-tanka-aozora-plus.json": tanka,
    }
    for filename, books in payloads.items():
        target = BOOKS_DIR / filename
        if len(books) < TARGETS[filename]:
            raise SystemExit(f"{filename}: expected {TARGETS[filename]}, got {len(books)}")
        target.write_text(json.dumps(books, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"{filename}: {len(books)}")


if __name__ == "__main__":
    main()
