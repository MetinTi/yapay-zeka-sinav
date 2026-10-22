#!/usr/bin/env python3
"""Download lesson images and attach paths to lessons.json."""

import json
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSONS = ROOT / "mobile" / "assets" / "data" / "lessons.json"
SOURCES = Path(__file__).with_name("lesson_image_sources.json")
OUT_DIR = ROOT / "mobile" / "assets" / "images" / "lessons"
USER_AGENT = "YZ-Egitim-App/1.0 (educational; metintiryaki.com)"
HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
}


def download(url: str, dest: Path) -> bool:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
    if len(data) < 1500:
        return False
    dest.write_bytes(data)
    return True


def is_junk_section(section: dict) -> bool:
    if section.get("type") != "text":
        return False
    body = section.get("body", "")
    return "tbm=isch" in body or body.strip() in ("|", "25 dakika")


def main():
    sources = json.loads(SOURCES.read_text(encoding="utf-8"))
    lessons = json.loads(LESSONS.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    ok, fail = 0, []

    for lesson in lessons:
        mod = lesson["order"]
        img_idx = 0
        cleaned = []
        for section in lesson["sections"]:
            if is_junk_section(section):
                continue
            if section.get("type") != "image":
                cleaned.append(section)
                continue

            slug = f"modul-{mod:02d}-{img_idx:02d}"
            img_idx += 1
            keyword = (section.get("items") or [""])[0] or section.get("body", "")
            dest = OUT_DIR / f"{slug}.jpg"
            asset = f"assets/images/lessons/{slug}.jpg"
            url = sources.get(slug)

            if dest.exists() and dest.stat().st_size > 5000:
                section["items"] = [keyword, asset]
                ok += 1
                cleaned.append(section)
                continue

            if not url:
                fail.append(slug)
                cleaned.append(section)
                continue

            print(f"Download {slug}...")
            try:
                if download(url, dest):
                    section["items"] = [keyword, asset]
                    ok += 1
                    print("  OK")
                else:
                    fail.append(slug)
                    print("  too small")
            except Exception as e:
                fail.append(slug)
                print(f"  error: {e}")
            time.sleep(0.8)
            cleaned.append(section)

        lesson["sections"] = cleaned

    LESSONS.write_text(json.dumps(lessons, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nAttached {ok} images. Failed: {len(fail)}")
    if fail:
        print(", ".join(fail[:15]))


if __name__ == "__main__":
    main()
