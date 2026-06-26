from __future__ import annotations

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = PROJECT_ROOT / "src"
sys.path.insert(0, str(SRC_DIR))

from weather_simulator.datasources.jma_amedas import build_station_master  # noqa: E402


def main() -> None:
    output_path = build_station_master()
    print(f"Saved normalized station master: {output_path}")


if __name__ == "__main__":
    main()
