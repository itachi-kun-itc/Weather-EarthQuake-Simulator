# API・データソース調査メモ

このファイルには、観測点名・緯度・経度・観測データを取得できるかを確認した結果を記録します。

## 気象庁 気象データ高度利用ポータルサイト

- URL: https://www.data.jma.go.jp/developer/index.html
- 内容: 気象庁が提供するXML電文、JSONデータ、CSVデータ、過去データの入口。
- 観測点情報:
  - アメダス関連ページから観測所一覧をCSV/ZIP形式で取得できる。
  - 観測所一覧には、観測所名、所在地、緯度、経度など、地図プロットに必要な項目が含まれる想定。
- このリポジトリでの扱い:
  - `scripts/fetch_jma_amedas_stations.py` で元ZIPを保存し、CSVへ正規化する。

## 気象庁 アメダス観測所一覧

- URL: https://www.jma.go.jp/jma/kishou/know/amedas/kaisetsu.html
- 用途: 地上気象観測点の地点情報を取得する。
- 確認日: 2026-06-26
- 最新ファイル: 適用日 2026-03-24
- 確認したい代表項目:
  - 観測所番号
  - 種類
  - 観測所名
  - カタカナ名
  - 気象情報等に表記する名称
  - 所在地
  - 緯度
  - 経度
  - 海面上の高さ
  - 観測開始年月日
- 注意:
  - PDF仕様上、緯度・経度の単位は「0.1分」。
  - 公開ZIP内ファイルの列名や文字コードは変更される可能性があるため、取得スクリプト側で列名ゆれを吸収する。

## J-SHIS Web API

- URL: https://www.j-shis.bosai.go.jp/api-list
- 提供元: 国立研究開発法人 防災科学技術研究所
- 内容: 地震ハザードステーション J-SHIS の地震ハザード情報を取得するWeb API。
- 観測点情報:
  - J-SHISは主に地震ハザード、地盤、確率論的地震動予測地図などの地点・メッシュ情報を扱う。
  - 「観測点一覧」を取得するAPIというより、緯度経度やメッシュコードを指定して地震ハザード情報を取得する用途が中心。
- このリポジトリでの扱い:
  - 地図上の任意地点・メッシュごとの地震リスク指標を取得するデータソース候補として扱う。
  - 観測点マスタとは分けて、`data/processed/earthquake_hazard_points.csv` のような別データにする。

## 長周期地震動指標WebAPIとサンプルツール

- URL: https://www.jma.go.jp/jma/kishou/shingikai/jishin/tyoshuki_joho_kentokai/wg3/siryou4.pdf
- 内容: 長周期地震動指標のWeb APIとサンプルツールに関する資料。
- 確認ポイント:
  - APIレスポンスに観測点名、緯度、経度、長周期地震動階級・指標が含まれるか。
  - 時刻指定、地震イベント指定、地点指定のどれで取得するAPIか。
- このリポジトリでの扱い:
  - PDF仕様を読みながら `docs/long_period_ground_motion.md` に詳細を追記する。

## 正規化後の観測点CSVスキーマ案

`data/processed/*_stations.csv` は、APIや公開CSVごとの列名ゆれを以下に寄せます。

| column | type | description |
| --- | --- | --- |
| source | string | データ提供元。例: `jma_amedas` |
| station_id | string | 観測点ID。存在しない場合は空欄 |
| station_name | string | 観測点名 |
| prefecture | string | 都道府県 |
| address | string | 所在地 |
| latitude | float | 緯度。10進表記 |
| longitude | float | 経度。10進表記 |
| elevation_m | float | 標高。存在しない場合は空欄 |
| observed_items | string | 観測要素 |
| raw_file | string | 元データファイル名 |
