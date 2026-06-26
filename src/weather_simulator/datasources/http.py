from __future__ import annotations

import os
from pathlib import Path

import requests

DEFAULT_TIMEOUT_SECONDS = int(os.getenv("WEATHER_SIMULATOR_HTTP_TIMEOUT", "30"))


def download_file(url: str, output_path: Path, timeout: int = DEFAULT_TIMEOUT_SECONDS) -> Path:
    """Download a URL to a local file."""
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with requests.get(url, timeout=timeout, stream=True) as response:
        response.raise_for_status()
        with output_path.open("wb") as file:
            for chunk in response.iter_content(chunk_size=1024 * 256):
                if chunk:
                    file.write(chunk)

    return output_path
