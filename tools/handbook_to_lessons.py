#!/usr/bin/env python3
"""Convert handbook_extracted.md to mobile/assets/data/lessons.json"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MD_PATH = ROOT / "docs" / "handbook_extracted.md"
OUT_PATH = ROOT / "mobile" / "assets" / "data" / "lessons.json"

CHAPTER_RE = re.compile(
    r"^\*\*BÖLÜM\s+(\d+):\s*(.+?)\*\*\s*$", re.MULTILINE
)
MINUTES_RE = re.compile(r"\*\*(\d+)\s+dakika\*\*")
IMAGE_BLOCK_RE = re.compile(
    r"\+\:.*?\*\*📷 GÖRSEL\s+\d+\s+ALANI\*\*.*?"
    r"\*([^*]+)\*.*?"
    r"\*\*🔍 Anahtar kelimeler:\*\*\s*([^\n|]+).*?\+",
    re.DOTALL,
)
ANSWER_KEY_RE = re.compile(
    r"🟢\s*KOLAY[:\*]*\s*([0-9A-D\-\s]+).*?"
    r"🟡\s*ORTA[:\*]*\s*([0-9A-D\-\s]+).*?"
    r"🔴\s*ZOR[:\*]*\s*([0-9A-D\-\s]+)",
    re.DOTALL,
)
LETTER_TO_INDEX = {"A": 0, "B": 1, "C": 2, "D": 3}
OPTION_RE = re.compile(r">\s*\*\*([A-D])\)\*\*\s*(.*)")


def unescape(s: str) -> str:
    return (
        s.replace("\\'", "'")
        .replace('\\"', '"')
        .replace("\\n", "\n")
        .replace("**", "")
        .strip()
    )


def slugify(title: str, num: int) -> str:
    t = title.lower()
    trans = str.maketrans("ığüşöç", "igusoc")
    t = t.translate(trans)
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return f"modul-{num:02d}-{t[:36]}"


def parse_answer_map(key_line: str) -> dict[int, int]:
    result = {}
    for part in key_line.strip().split():
        m = re.match(r"(\d+)-([A-D])", part)
        if m:
            result[int(m.group(1))] = LETTER_TO_INDEX[m.group(2)]
    return result


def parse_questions(quiz_text: str, answer_part: str) -> list[dict]:
    answer_maps: dict[str, dict[int, int]] = {
        "easy": {},
        "medium": {},
        "hard": {},
    }
    if answer_part:
        m = ANSWER_KEY_RE.search(answer_part)
        if m:
            answer_maps["easy"] = parse_answer_map(m.group(1))
            answer_maps["medium"] = parse_answer_map(m.group(2))
            answer_maps["hard"] = parse_answer_map(m.group(3))

    level_markers = [
        ("easy", "🟢 KOLAY"),
        ("medium", "🟡 ORTA"),
        ("hard", "🔴 ZOR"),
    ]
    current_level = "easy"
    q_num_in_level = 0
    questions = []

    questions = []
    current_level = "easy"
    q_num_in_level = 0
    for m in re.finditer(
        r"(🟢 KOLAY|🟡 ORTA|🔴 ZOR)|\*\*Soru\s+\d+:\*\*\s*(.*?)(?=(?:\n\*\*Soru\s+\d+:\*\*)|(?:\n\*\*🔑)|\Z)",
        quiz_text,
        re.DOTALL,
    ):
        tag = m.group(1)
        if tag:
            if "KOLAY" in tag:
                current_level = "easy"
                q_num_in_level = 0
            elif "ORTA" in tag:
                current_level = "medium"
                q_num_in_level = 0
            elif "ZOR" in tag:
                current_level = "hard"
                q_num_in_level = 0
            continue
        block = m.group(2) or ""
        if not block.strip():
            continue
        q_match = re.match(
            r"^(.*?)(?:\n>(?:\s*\*\*[A-D]\).*)+)",
            block,
            re.DOTALL,
        )
        if not q_match:
            continue
        q_text = unescape(re.sub(r"\s+", " ", q_match.group(1)))
        options = []
        for om in OPTION_RE.finditer(block):
            opt = unescape(om.group(2))
            if opt:
                options.append(opt)
        if len(options) < 2:
            continue
        q_num_in_level += 1
        correct = answer_maps.get(current_level, {}).get(q_num_in_level, 0)
        questions.append(
            {
                "question": q_text,
                "options": options[:4],
                "correctIndex": min(correct, len(options) - 1),
                "level": current_level,
            }
        )
    return questions


def strip_tables(text: str) -> str:
    return re.sub(r"\+:.*?\+", "", text, flags=re.DOTALL)


def is_garbage_line(s: str) -> bool:
    if not s:
        return True
    if "tbm=isch" in s or "google.com/search" in s:
        return True
    if s.startswith("+") and ("---" in s or len(s) > 20):
        return True
    if re.match(r"^\+-+\+$", s):
        return True
    if s in ("|", "25 dakika") or re.match(r"^\d+\s+dakika$", s):
        return True
    return False


def parse_content(body: str) -> list[dict]:
    sections: list[dict] = []
    body = re.sub(r"\*⏱️[^*]+\*", "", body)

    pos = 0
    for im in IMAGE_BLOCK_RE.finditer(body):
        before = strip_tables(body[pos : im.start()])
        if before.strip():
            sections.extend(parse_text_block(before))
        sections.append(
            {
                "type": "image",
                "body": unescape(im.group(1)),
                "items": [unescape(im.group(2)), ""],
            }
        )
        pos = im.end()
    tail = strip_tables(body[pos:])
    if tail.strip():
        sections.extend(parse_text_block(tail))

    return sections


def parse_text_block(text: str) -> list[dict]:
    sections: list[dict] = []
    lines = text.split("\n")
    para_buf: list[str] = []
    bullet_buf: list[str] = []
    current_heading = ""

    def flush_para():
        nonlocal para_buf, current_heading
        if para_buf:
            t = unescape(" ".join(para_buf))
            t = re.sub(r"\s+", " ", t)
            if len(t) > 25 and not t.startswith("|") and not is_garbage_line(t):
                if current_heading and not sections:
                    sections.append(
                        {"type": "text", "body": f"{current_heading}\n\n{t}"}
                    )
                    current_heading = ""
                else:
                    sections.append({"type": "text", "body": t})
            para_buf = []

    def flush_bullets():
        nonlocal bullet_buf
        if bullet_buf:
            sections.append({"type": "bullet", "body": "", "items": bullet_buf[:]})
            bullet_buf = []

    for line in lines:
        s = line.strip()
        if is_garbage_line(s) or s.startswith(">") or s.startswith("|"):
            flush_para()
            continue
        if re.match(r"^\*\*\d+\.\d+", s):
            flush_para()
            flush_bullets()
            current_heading = unescape(s.strip("*"))
            continue
        if s.startswith("- "):
            flush_para()
            item = unescape(s[2:])
            if bullet_buf and not bullet_buf[-1].endswith((".", ":", ")", '"')):
                bullet_buf[-1] += " " + item
            else:
                bullet_buf.append(item)
            continue
        if s.startswith("**") and s.endswith("**") and len(s) < 120:
            flush_para()
            flush_bullets()
            h = unescape(s)
            if current_heading:
                sections.append({"type": "text", "body": current_heading})
            current_heading = h
            continue
        if bullet_buf and not s[0].isupper() and len(s) < 100:
            bullet_buf[-1] += " " + unescape(s)
            continue
        flush_bullets()
        if para_buf and not s[0].isupper() and len(s) < 120:
            para_buf[-1] += " " + s
            continue
        para_buf.append(s)
    flush_bullets()
    flush_para()
    if current_heading:
        sections.append({"type": "text", "body": current_heading})
    return sections


def split_chapters(md: str) -> list[tuple[int, str, str]]:
    parts = CHAPTER_RE.split(md)
    chapters = []
    i = 1
    while i + 2 <= len(parts):
        num = int(parts[i])
        title = unescape(parts[i + 1].strip())
        body = parts[i + 2]
        chapters.append((num, title, body))
        i += 3
    return chapters


def main():
    md = MD_PATH.read_text(encoding="utf-8")
    start = md.find("**BÖLÜM 1:")
    if start < 0:
        raise SystemExit("Chapter 1 not found")
    md = md[start:]

    lessons = []
    for num, title, body in split_chapters(md):
        minutes_m = MINUTES_RE.search(body)
        minutes = int(minutes_m.group(1)) if minutes_m else 25

        content_body = body
        quiz_part = ""
        answer_part = ""
        if "**📝 BÖLÜM SONU SINAVI**" in body:
            before, rest = body.split("**📝 BÖLÜM SONU SINAVI**", 1)
            content_body = before
            ak_split = re.split(r"\*\*🔑 Cevap Anahtarı", rest, maxsplit=1)
            quiz_part = ak_split[0]
            answer_part = ak_split[1] if len(ak_split) > 1 else ""

        sections = parse_content(content_body)
        questions = parse_questions(quiz_part, answer_part)
        if questions:
            sections.append(
                {
                    "type": "quiz",
                    "body": "Bölüm sonu değerlendirme soruları",
                    "questions": questions,
                }
            )

        filtered = [
            s
            for s in sections
            if not (s["type"] == "text" and len(s.get("body", "")) < 20)
            and not (s["type"] == "bullet" and not s.get("items"))
        ]

        lessons.append(
            {
                "id": slugify(title, num),
                "order": num,
                "title": title.strip(),
                "subtitle": f"Handbook Bölüm {num} · ~{minutes} dk okuma",
                "estimatedMinutes": minutes,
                "sections": filtered,
            }
        )

    OUT_PATH.write_text(
        json.dumps(lessons, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"Wrote {len(lessons)} lessons to {OUT_PATH}")
    # validate first quiz
    q0 = lessons[0]["sections"][-1].get("questions", [])[0]
    print("Sample Q:", q0["question"][:50], "| opts:", len(q0["options"]), "| correct:", q0["correctIndex"])


if __name__ == "__main__":
    main()
