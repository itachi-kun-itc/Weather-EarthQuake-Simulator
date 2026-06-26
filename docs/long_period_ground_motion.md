# 長周期地震動API 調査メモ

参考PDF:
https://www.jma.go.jp/jma/kishou/shingikai/jishin/tyoshuki_joho_kentokai/wg3/siryou4.pdf

## 確認予定

- 利用可能なエンドポイント
- リクエストパラメータ
- レスポンス形式
- 観測点名・緯度・経度の有無
- 地図プロットに使う地点マスタの取得方法

## 実装方針

PDF仕様からAPIのエンドポイントとレスポンス例を転記したあと、`src/weather_simulator/datasources/` に取得処理を追加します。
