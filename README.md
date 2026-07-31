# MQRI ART

触れて楽しむリアルタイム生成アートのギャラリー — https://art.mqri.or.jp

静的サイト(ビルドなし)。ルートの `index.html` が作品一覧のランディング、各作品は1フォルダ=1URL。

**URL規約(2026-07-31〜)**: 作品の実体は `works/<slug>/` に置く(フラット・slugは英題のローマ字・一度決めたら変えない)。分類はURLに焼かず、ルート `index.html` の並べ方で行う。規約制定前の `/quantum-mandala/` `/hopf-loom/` は 2026-07-31 に `works/` へ移設し、**旧URLは `vercel.json` の redirects で301を維持**している（iPadのホーム画面アプリと台帳・Homeに旧URLが配られているため、消してはいけない）。

## 作品

| URL | 作品 | 概要 |
|---|---|---|
| [/works/taiji-spin/](https://art.mqri.or.jp/works/taiji-spin/) | 太極回転 TAIJI SPIN | 太極図の回転速度とディスプレイの更新間隔が噛み合うと現れるストロボ錯視。Canvas 2D・鑑賞モード(`A`)あり |
| [/works/tomoe-spin/](https://art.mqri.or.jp/works/tomoe-spin/) | 巴回転 TOMOE SPIN | 勾玉ひとつを回すと巴紋が結晶する。速度を360で割った既約分数の分母が紋の枚数。太極回転の姉妹作 |
| [/works/quintessence/](https://art.mqri.or.jp/works/quintessence/) | QUINTESSENCE 内接するプラトン立体 | 一つの立方体に五つの正多面体が内接。体対角線に整列すると13点のメタトロンキューブが結晶。純WebGL2 |
| [/works/metatron/](https://art.mqri.or.jp/works/metatron/) | METATRON 立体メタトロン方陣 | 十三の球・七十八の光径。平面の方陣とベクトル平衡体を連続変形。純WebGL2 |
| [/works/nijushisekki-ring/](https://art.mqri.or.jp/works/nijushisekki-ring/) | 二十四節気の円環 | 太陽黄経360°を24等分した暦の幾何学。**もとはNext.js+D1のアプリだったが、実行時に使われていないことを確かめて単一HTMLに書き直した**（[経緯と検算](works/nijushisekki-ring/README.md)） |
| [/works/cymatic-resonance/](https://art.mqri.or.jp/works/cymatic-resonance/) | 共鳴譜 Cymatic Resonance | 52万粒の砂が音を見るクラドニ図形。**唯一マイクを使う作品**（拒否時はヒント欄で知らせ、内蔵音に誘導）。移設時にスマホ用レイアウトを新設 |
| [/works/infinite-geometry/](https://art.mqri.or.jp/works/infinite-geometry/) | 無限幾何回廊 Infinite Geometry | アポロニウスのガスケットを永遠に潜行。移設時にピンチ=潜行速度・タップ=停止・2本指タップ=配色を実装 |
| [/works/genesis-of-form/](https://art.mqri.or.jp/works/genesis-of-form/) | 幾何の創世 Genesis of Form | 聖なる幾何学の生成順序を68秒の創世神話に。移設時にピンチ=拡縮・タップ=一時停止を実装 |
| [/works/solstitial-still-point/](https://art.mqri.or.jp/works/solstitial-still-point/) | 夏至・光の静止点 Solstitial Still Point | 地球の傾き23.44°と大気の散乱をリアルタイムの光の場に。日付（2026.06.21）を持つ作品。移設前からスマホ対応済み |
| [/works/circle-limit/](https://art.mqri.or.jp/works/circle-limit/) | Circle Limit — Flower of Life | ポアンカレ円板の双曲平面に{6,4}タイリングで生命の花を敷き詰める。p5.jsローカル同梱・移設時に可変サイズ化とタッチ操作を実装 |
| [/works/flower-differential-growth/](https://art.mqri.or.jp/works/flower-differential-growth/) | 生命の花と、分化成長 | フラワーオブライフの格子の上を差分成長する曲線が埋めていく。p5.jsローカル同梱・移設時にタッチ操作を実装（[経緯](works/flower-differential-growth/README.md)） |
| [/works/quantum-mandala/](https://art.mqri.or.jp/works/quantum-mandala/) | 量子曼荼羅 Quantum Mandala | シュレーディンガー方程式の実時間GPU解法 × 神聖幾何学。iPad展示用にタッチ最適化済み(詳細は各フォルダのREADME) |
| [/works/hopf-loom/](https://art.mqri.or.jp/works/hopf-loom/) | HOPF LOOM — S³の織物 | 四次元球面のHopfファイブレーション × 四次元正多胞体。マルチタッチ(1本指=視点/2本指=ズーム・4次元回転)でiPad展示用に最適化済み |

## 作品の追加手順

1. `works/<slug>/` フォルダを作り `index.html`(単一HTML推奨・外部依存なし)を置く
1. `CAPTION.md`(作品解説)と `manifest.webmanifest`(ホーム画面アプリ化用)を添える
2. ルート `index.html` の `.works` にカードを1枚追加（並び順＝新しい作品が上）
3. スマホ実機の観点を確認する：`viewport-fit=cover` があるか／`touch-action:none` か／ピンチが要る作品に2本指処理があるか／操作案内がキーボード・ホイール前提のままでないか
4. `main` に push すると Vercel が自動デプロイ

## ローカル確認

```sh
npx serve .
```
