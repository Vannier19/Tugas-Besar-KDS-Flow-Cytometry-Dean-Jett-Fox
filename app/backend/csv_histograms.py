from __future__ import annotations

import csv
from io import StringIO
from pathlib import Path


MAX_CSV_BYTES = 1_000_000
HEADER_ALIASES = {("bin", "count"), ("bins", "counts")}


def _is_number(value: str) -> bool:
    try:
        float(value)
    except ValueError:
        return False
    return True


def _normalize_row(row: list[str]) -> list[str]:
    return [cell.strip() for cell in row]


def _is_blank_row(row: list[str]) -> bool:
    return all(cell.strip() == "" for cell in row)


def parse_histogram_csv(content: bytes, filename: str | None = None) -> tuple[list[float], list[float]]:
    if filename and Path(filename).suffix.lower() != ".csv":
        raise ValueError("file harus berekstensi .csv")
    if len(content) > MAX_CSV_BYTES:
        raise ValueError("ukuran file CSV maksimal 1 MB")
    if not content:
        raise ValueError("file CSV kosong")

    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        raise ValueError("file CSV harus memakai encoding UTF-8") from exc

    rows = [_normalize_row(row) for row in csv.reader(StringIO(text))]
    rows = [row for row in rows if not _is_blank_row(row)]
    if not rows:
        raise ValueError("file CSV kosong")

    first_two = tuple(cell.lower() for cell in rows[0][:2])
    has_header = first_two in HEADER_ALIASES
    if has_header:
        rows = rows[1:]
    elif len(rows[0]) < 2 or not (_is_number(rows[0][0]) and _is_number(rows[0][1])):
        raise ValueError("header CSV harus bin,count atau bins,counts")

    bins: list[float] = []
    counts: list[float] = []
    for index, row in enumerate(rows, start=2 if has_header else 1):
        non_empty = [cell for cell in row if cell != ""]
        if len(non_empty) != 2:
            raise ValueError(f"baris {index} harus memiliki tepat dua kolom numeric")
        if not (_is_number(non_empty[0]) and _is_number(non_empty[1])):
            raise ValueError(f"baris {index} berisi nilai non-numeric")
        bin_value = float(non_empty[0])
        count_value = float(non_empty[1])
        if count_value < 0:
            raise ValueError(f"baris {index} memiliki count negatif")
        bins.append(bin_value)
        counts.append(count_value)

    if len(bins) < 3:
        raise ValueError("CSV harus memiliki minimal 3 baris data")

    return bins, counts
