# MQRI ART

触れて楽しむリアルタイム生成アートのギャラリー — https://art.mqri.or.jp

静的サイト(ビルドなし)。ルートの `index.html` が作品一覧のランディング、各作品は1フォルダ=1URL。

## 作品

| URL | 作品 | 概要 |
|---|---|---|
| [/quantum-mandala/](https://art.mqri.or.jp/quantum-mandala/) | 量子曼荼羅 Quantum Mandala | シュレーディンガー方程式の実時間GPU解法 × 神聖幾何学。iPad展示用にタッチ最適化済み(詳細は各フォルダのREADME) |
| [/hopf-loom/](https://art.mqri.or.jp/hopf-loom/) | HOPF LOOM — S³の織物 | 四次元球面のHopfファイブレーション × 四次元正多胞体。マルチタッチ(1本指=視点/2本指=ズーム・4次元回転)でiPad展示用に最適化済み |

## 作品の追加手順

1. `作品名/` フォルダを作り `index.html`(単一HTML推奨・外部依存なし)を置く
2. ルート `index.html` の `.works` にカードを1枚追加
3. `main` に push すると Vercel が自動デプロイ

## ローカル確認

```sh
npx serve .
```
