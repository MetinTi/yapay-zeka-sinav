#!/usr/bin/env python3
"""Build exam_pool.json from index.html (60) + lessons.json handbook (17×3)."""

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX_HTML = ROOT / "index.html"
LESSONS_JSON = ROOT / "mobile" / "assets" / "data" / "lessons.json"
OUT_JSON = ROOT / "mobile" / "assets" / "data" / "exam_pool.json"


def load_web_questions() -> list[dict]:
    js = r"""
const fs=require('fs');
const h=fs.readFileSync('index.html','utf8');
const i=h.indexOf('var P=[');
let depth=0,start=i+6,end=start;
for(let j=start;j<h.length;j++){
  if(h[j]==='[')depth++;
  if(h[j]===']'){depth--;if(depth===0){end=j+1;break;}}
}
const P=eval(h.slice(start,end));
console.log(JSON.stringify(P));
"""
    out = subprocess.run(
        ["node", "-e", js],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    )
    raw = json.loads(out.stdout)
    items = []
    for idx, q in enumerate(raw, start=1):
        level, text, options, correct_idx, feedback = q
        items.append(
            {
                "id": f"web-{idx:03d}",
                "source": "web",
                "level": level,
                "question": text,
                "options": options,
                "correctIndex": correct_idx,
                "feedback": feedback or "",
            }
        )
    return items


def load_handbook_questions() -> list[dict]:
    lessons = json.loads(LESSONS_JSON.read_text(encoding="utf-8"))
    items = []
    for lesson in lessons:
        mod = lesson["order"]
        quiz_sections = [s for s in lesson["sections"] if s.get("type") == "quiz"]
        if not quiz_sections:
            continue
        questions = quiz_sections[0].get("questions", [])
        # Handbook: soru 1–3 kolay, 4–6 orta, 7–9 zor — havuzda modül başına 3 soru
        for slot, (pick_idx, level) in enumerate(
            ((0, "easy"), (3, "medium"), (6, "hard"))
        ):
            if pick_idx >= len(questions):
                continue
            q = questions[pick_idx]
            items.append(
                {
                    "id": f"handbook-{mod:02d}-{slot + 1}",
                    "source": "handbook",
                    "level": level,
                    "question": q["question"],
                    "options": [o for o in q["options"] if o],
                    "correctIndex": q["correctIndex"],
                    "feedback": "",
                }
            )
    return items


def main():
    web = load_web_questions()
    handbook = load_handbook_questions()
    pool = web + handbook
    data = {
        "version": 1,
        "poolSize": len(pool),
        "examQuestionCount": 20,
        "durationMinutes": 45,
        "questions": pool,
    }
    OUT_JSON.write_text(
        json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"Wrote {len(pool)} questions ({len(web)} web + {len(handbook)} handbook) -> {OUT_JSON}")


if __name__ == "__main__":
    main()
