import pandas as pd

from weather_simulator.datasources.jma_amedas import normalize_station_dataframe


def test_normalize_station_dataframe_maps_japanese_columns():
    source = pd.DataFrame(
        {
            "観測所番号": ["12345"],
            "観測所名": ["東京"],
            "都道府県": ["東京都"],
            "所在地": ["千代田区"],
            "緯度": [35.69],
            "経度": [139.75],
            "標高": [25.0],
            "観測要素": ["気温,降水量"],
        }
    )

    normalized = normalize_station_dataframe(source, raw_file="sample.csv")

    assert normalized.loc[0, "source"] == "jma_amedas"
    assert normalized.loc[0, "station_name"] == "東京"
    assert normalized.loc[0, "latitude"] == 35.69
    assert normalized.loc[0, "longitude"] == 139.75
    assert normalized.loc[0, "raw_file"] == "sample.csv"


def test_normalize_station_dataframe_converts_degree_minute_columns():
    source = pd.DataFrame(
        {
            "観測所番号": ["12345"],
            "観測所名": ["東京"],
            "緯度(度)": [35],
            "緯度(分)": [414],
            "経度(度)": [139],
            "経度(分)": [450],
        }
    )

    normalized = normalize_station_dataframe(source, raw_file="sample.csv")

    assert round(normalized.loc[0, "latitude"], 3) == 35.690
    assert round(normalized.loc[0, "longitude"], 3) == 139.750
