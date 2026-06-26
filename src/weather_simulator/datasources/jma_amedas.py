from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from zipfile import ZipFile

import pandas as pd

from weather_simulator.datasources.http import download_file

AMEDAS_STATIONS_PAGE_URL = "https://www.jma.go.jp/jma/kishou/know/amedas/kaisetsu.html"

# The public page links the current ZIP file. If JMA changes the exact file URL,
# update this constant after confirming the page.
AMEDAS_STATIONS_ZIP_URL = (
    "https://www.jma.go.jp/jma/kishou/know/amedas/ame_master.zip"
)

RAW_DIR = Path("data/raw")
PROCESSED_DIR = Path("data/processed")


@dataclass(frozen=True)
class NormalizedColumn:
    output_name: str
    candidates: tuple[str, ...]


NORMALIZED_COLUMNS = (
    NormalizedColumn("station_id", ("観測所番号", "地点番号", "station_id", "id")),
    NormalizedColumn("station_name", ("観測所名", "地点名", "名称", "station_name", "name")),
    NormalizedColumn("prefecture", ("都道府県", "府県", "prefecture")),
    NormalizedColumn("address", ("所在地", "住所", "address")),
    NormalizedColumn("latitude", ("緯度", "lat", "latitude")),
    NormalizedColumn("longitude", ("経度", "lon", "lng", "longitude")),
    NormalizedColumn(
        "elevation_m",
        ("標高", "標高(m)", "海面上の高さ", "海面上の高さ(m)", "elevation", "elevation_m"),
    ),
    NormalizedColumn("observed_items", ("観測要素", "要素", "observed_items")),
)

LATITUDE_DEGREE_COLUMNS = ("緯度(度)", "緯度（度）", "緯度_度", "緯度度")
LATITUDE_MINUTE_COLUMNS = ("緯度(分)", "緯度（分）", "緯度_分", "緯度分")
LONGITUDE_DEGREE_COLUMNS = ("経度(度)", "経度（度）", "経度_度", "経度度")
LONGITUDE_MINUTE_COLUMNS = ("経度(分)", "経度（分）", "経度_分", "経度分")


def fetch_station_zip(output_path: Path = RAW_DIR / "jma_amedas_stations.zip") -> Path:
    return download_file(AMEDAS_STATIONS_ZIP_URL, output_path)


def extract_csv_files(
    zip_path: Path,
    extract_dir: Path = RAW_DIR / "jma_amedas_stations",
) -> list[Path]:
    extract_dir.mkdir(parents=True, exist_ok=True)

    with ZipFile(zip_path) as archive:
        csv_members = [
            member
            for member in archive.namelist()
            if member.lower().endswith((".csv", ".txt"))
        ]
        archive.extractall(extract_dir, members=csv_members)

    return [path for path in extract_dir.rglob("*") if path.suffix.lower() in {".csv", ".txt"}]


def read_public_csv(path: Path) -> pd.DataFrame:
    for encoding in ("utf-8-sig", "utf-8", "cp932"):
        try:
            return pd.read_csv(path, encoding=encoding)
        except UnicodeDecodeError:
            continue
    raise UnicodeDecodeError("unknown", b"", 0, 1, f"Could not decode {path}")


def normalize_station_dataframe(dataframe: pd.DataFrame, raw_file: str) -> pd.DataFrame:
    normalized = pd.DataFrame(index=dataframe.index)
    normalized["source"] = "jma_amedas"

    for definition in NORMALIZED_COLUMNS:
        source_column = _find_column(dataframe.columns, definition.candidates)
        if source_column is None:
            normalized[definition.output_name] = pd.NA
        else:
            normalized[definition.output_name] = dataframe[source_column]

    normalized["raw_file"] = raw_file

    latitude = _decimal_degrees_from_degree_minute_columns(
        dataframe, LATITUDE_DEGREE_COLUMNS, LATITUDE_MINUTE_COLUMNS
    )
    if latitude is not None:
        normalized["latitude"] = latitude

    longitude = _decimal_degrees_from_degree_minute_columns(
        dataframe, LONGITUDE_DEGREE_COLUMNS, LONGITUDE_MINUTE_COLUMNS
    )
    if longitude is not None:
        normalized["longitude"] = longitude

    for column in ("latitude", "longitude", "elevation_m"):
        normalized[column] = pd.to_numeric(normalized[column], errors="coerce")

    return normalized


def build_station_master(
    zip_path: Path = RAW_DIR / "jma_amedas_stations.zip",
    output_path: Path = PROCESSED_DIR / "jma_amedas_stations.csv",
) -> Path:
    if not zip_path.exists():
        fetch_station_zip(zip_path)

    csv_files = extract_csv_files(zip_path)
    if not csv_files:
        raise FileNotFoundError(f"No CSV files were found in {zip_path}")

    frames = []
    for csv_file in csv_files:
        frame = read_public_csv(csv_file)
        frames.append(normalize_station_dataframe(frame, raw_file=str(csv_file)))

    output_path.parent.mkdir(parents=True, exist_ok=True)
    pd.concat(frames, ignore_index=True).to_csv(output_path, index=False, encoding="utf-8-sig")
    return output_path


def _find_column(columns: pd.Index, candidates: tuple[str, ...]) -> str | None:
    stripped_columns = {str(column).strip(): str(column) for column in columns}
    lower_columns = {str(column).strip().lower(): str(column) for column in columns}

    for candidate in candidates:
        if candidate in stripped_columns:
            return stripped_columns[candidate]
        if candidate.lower() in lower_columns:
            return lower_columns[candidate.lower()]

    return None


def _decimal_degrees_from_degree_minute_columns(
    dataframe: pd.DataFrame,
    degree_candidates: tuple[str, ...],
    minute_candidates: tuple[str, ...],
) -> pd.Series | None:
    degree_column = _find_column(dataframe.columns, degree_candidates)
    minute_column = _find_column(dataframe.columns, minute_candidates)
    if degree_column is None or minute_column is None:
        return None

    degrees = pd.to_numeric(dataframe[degree_column], errors="coerce")
    minutes = pd.to_numeric(dataframe[minute_column], errors="coerce")

    # JMA specs may express minutes in 0.1 minute units. Values above 60 are
    # treated as tenths of minutes before converting to decimal degrees.
    minutes = minutes.where(minutes <= 60, minutes / 10)
    return degrees + (minutes / 60)
