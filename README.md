# MQRI ART

触れて楽しむリアルタイム生成アートのギャラリー — https://art.mqri.or.jp

静的サイト(ビルドなし)。ルートの `index.html` が作品一覧のランディング、各作品は1フォルダ=1URL。

**URL規約(2026-07-31〜)**: 作品の実体は `works/<slug>/` に置く(フラット・slugは英題のローマ字・一度決めたら変えない)。分類はURLに焼かず、ルート `index.html` の並べ方で行う。`/quantum-mandala/` `/hopf-loom/` は規約制定前の作品で、移設時は旧URLに301を残す。

## 作品

| URL | 作品 | 概要 |
|---|---|---|
| [/works/taiji-spin/](https://art.mqri.or.jp/works/taiji-spin/) | 太極回転 TAIJI SPIN | 太極図の回転速度とディスプレイの更新間隔が噛み合うと現れるストロボ錯視。Canvas 2D・鑑賞モード(`A`)あり |
| [/quantum-mandala/](https://art.mqri.or.jp/quantum-mandala/) | 量子曼荼羅 Quantum Mandala | シュレーディンガー方程式の実時間GPU解法 × 神聖幾何学。iPad展示用にタッチ最適化済み(詳細は各フォルダのREADME) |
| [/hopf-loom/](https://art.mqri.or.jp/hopf-loom/) | HOPF LOOM — S³の織物 | 四次元球面のHopfファイブレーション × 四次元正多胞体。マルチタッチ(1本指=視点/2本指=ズーム・4次元回転)でiPad展示用に最適化済み |

## 作品の追加手順

1. `works/<slug>/` フォルダを作り `index.html`(単一HTML推奨・外部依存なし)を置く
1. `CAPTION.md`(作品解説)と `manifest.webmanifest`(ホーム画面アプリ化用)を添える
2. ルート `index.html` の `.works` にカードを1枚追加
3. `main` に push すると Vercel が自動デプロイ

## ローカル確認

```sh
npx serve .
```
