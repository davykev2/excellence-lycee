from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import pdfplumber


def lesson_number(path: Path) -> int:
    match = re.search(r"_L(\d+)_", path.name)
    return int(match.group(1)) if match else 999


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: extract_philo_pdfs.py INPUT_DIRECTORY OUTPUT_DIRECTORY")

    input_directory = Path(sys.argv[1])
    output_directory = Path(sys.argv[2])
    output_directory.mkdir(parents=True, exist_ok=True)

    manifest: list[dict[str, object]] = []
    for pdf_path in sorted(input_directory.glob("*.pdf"), key=lesson_number):
        number = lesson_number(pdf_path)
        page_texts: list[str] = []
        with pdfplumber.open(pdf_path) as document:
            for page_number, page in enumerate(document.pages, start=1):
                text = page.extract_text(x_tolerance=1, y_tolerance=3) or ""
                page_texts.append(f"\n===== PAGE {page_number} =====\n{text.strip()}\n")

        full_text = "".join(page_texts)
        text_path = output_directory / f"L{number:02d}.txt"
        text_path.write_text(full_text, encoding="utf-8")
        manifest.append(
            {
                "lesson": number,
                "source": str(pdf_path),
                "text": str(text_path),
                "pages": len(page_texts),
                "characters": len(full_text),
                "page_characters": [len(page) for page in page_texts],
            }
        )

    manifest_path = output_directory / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
