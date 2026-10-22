#!/usr/bin/env python3
"""lessons.json → ai-education.md (düzenleme için tam içerik dökümü)."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSONS = ROOT / "mobile" / "assets" / "data" / "lessons.json"
OUTPUT = ROOT / "ai-education.md"


def section_to_md(section: dict) -> str:
    stype = section.get("type", "text")
    body = (section.get("body") or "").strip()
    items = section.get("items") or []

    if stype == "image":
        img = items[1] if len(items) > 1 else ""
        alt = items[0] if items else body
        return f"\n![{alt}]({img})\n\n*{body}*\n" if img else f"\n*{body}*\n"

    if stype == "bullet":
        lines = [f"- {item}" for item in items if item]
        return "\n".join(lines) + "\n" if lines else ""

    if stype == "tip":
        return f"\n> **İpucu:** {body}\n\n"

    if stype == "quiz":
        return ""  # quiz ayrı bölümde

    if body:
        if body[0].isdigit() or body.startswith("Bölüm"):
            return f"\n### {body}\n\n"
        return f"{body}\n\n"
    return ""


def quiz_to_md(questions: list) -> str:
    if not questions:
        return ""
    parts = ["\n### Modül sonu quiz\n\n"]
    for i, q in enumerate(questions, 1):
        parts.append(f"**S{i}.** {q.get('question', '')}\n\n")
        for j, opt in enumerate(q.get("options") or []):
            mark = " ✓" if j == q.get("correctIndex") else ""
            parts.append(f"- [{['A','B','C','D'][j]}] {opt}{mark}\n")
        expl = q.get("explanation") or ""
        if expl:
            parts.append(f"\n*Açıklama:* {expl}\n")
        parts.append("\n")
    return "".join(parts)


def main() -> None:
    modules = json.loads(LESSONS.read_text(encoding="utf-8"))
    out: list[str] = [
        "# Yapay Zeka Eğitimi — Tam İçerik Taslağı\n\n",
        "> Kaynak: `mobile/assets/data/lessons.json` · ",
        f"{len(modules)} modül · Düzenleyip genişlettikten sonra ",
        "`tools/handbook_to_lessons.py` veya doğrudan JSON ile uygulamaya aktarın.\n\n",
        "---\n\n",
    ]

    for mod in modules:
        order = mod.get("order", "?")
        title = mod.get("title", "Başlıksız")
        subtitle = mod.get("subtitle", "")
        est = mod.get("estimatedMinutes", "")

        out.append(f"## Modül {order}: {title}\n\n")
        out.append(f"- **ID:** `{mod.get('id', '')}`\n")
        if subtitle:
            out.append(f"- **Alt başlık:** {subtitle}\n")
        if est:
            out.append(f"- **Tahmini süre:** {est} dk\n")
        out.append("\n")

        for section in mod.get("sections") or []:
            if section.get("type") == "quiz":
                continue
            out.append(section_to_md(section))

        quiz_sections = [s for s in mod.get("sections") or [] if s.get("type") == "quiz"]
        for qs in quiz_sections:
            out.append(quiz_to_md(qs.get("questions") or []))

        out.append("\n---\n\n")

    OUTPUT.write_text("".join(out), encoding="utf-8")
    print(f"Wrote {OUTPUT} ({OUTPUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
