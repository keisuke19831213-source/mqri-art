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
| [/works/iris-aquae/](https://art.mqri.or.jp/works/iris-aquae/) | IRIS AQUAE 水面の虹色の輝き | 薄膜干渉を13波長で計算しCIE1931で色に戻す。夕暮れの海面に本物の構造色が立つ |
| [/works/shimmer/](https://art.mqri.or.jp/works/shimmer/) | SHIMMER 薄膜のきらめきとグリント | 同じ薄膜干渉を闇に放つ。手続き的グリントが星のように瞬く。IRIS AQUAE の姉妹作 |
| [/works/quanta/](https://art.mqri.or.jp/works/quanta/) | QUANTA 幾何学と量子力学 | 確率の地形を等高線で切る三楽章（量子カーペット／球面調和関数ほか）。タップで楽章が進む |
| [/works/hive-resonance/](https://art.mqri.or.jp/works/hive-resonance/) | HIVE RESONANCE 蜂の巣と周波数 | 六角格子に周波数を通すと定在波が紋様になる。230Hz=蜂の羽音。音つき（開始オーバーレイでユーザー操作を取る） |
| [/works/sekki-circle/](https://art.mqri.or.jp/works/sekki-circle/) | 環 二十四節気の円環 | 24節気＋七十二候を円環に。「今日」で現在の節気へ戻れる。※`nijushisekki-ring` と同じ主題の**別実装**（意図的に併存） |
| [/works/healing-tones/](https://art.mqri.or.jp/works/healing-tones/) | Healing Tones 周波数ミュージックジェネレーター | **唯一の道具（作品ではない）**。9周波数×7音色・A4=440/432・鍵盤/16パッド/バイノーラル・録音。スクロールする文書レイアウトなので touch-action は canvas だけに掛ける |
| [/works/senko/](https://art.mqri.or.jp/works/senko/) | 旋光 Senkō | 光渦（軌道角運動量）。角運動量に比例して周波数をずらすと場全体が厳密な剛体として回る。移設時に**touch-action欠落を修正**＋ピンチ・タップ・2本指タップ・長押しを実装 |
| [/works/mizu-no-kioku/](https://art.mqri.or.jp/works/mizu-no-kioku/) | 水の記憶 Memory of Water | 浅水波をGPUで解き200万個の光子を屈折させて本物のコースティクスを結ぶ。移設時はsafe-areaと展示用metaのみ追加（タッチは元から対応済み） |
| [/works/infinite-mandala/](https://art.mqri.or.jp/works/infinite-mandala/) | 無限曼荼羅 Infinite Mandala | 対数極座標の無限ズーム。中心のビンドゥには永遠に届かない。ピンチは元から実装済みで、safe-areaと展示用metaのみ追加 |
| [/works/square-mandala/](https://art.mqri.or.jp/works/square-mandala/) | 方壇曼荼羅 Square Mandala | チェビシェフ距離の対数ズームで密教方壇の伽藍が無限に湧く。無限曼荼羅の姉妹作（旧 infinite-mandala/art02） |
| [/works/morphogenesis/](https://art.mqri.or.jp/works/morphogenesis/) | 生命と幾何学 Morphogenesis | 黄金角の種子格子にチューリング反応拡散系が芽吹く。**7/13にギャラリーから外していた作品**（7/31に復帰）。移設時にtouch-action・スマホ用レイアウト・タップ操作を実装 |
| [/works/cymatic-resonance/](https://art.mqri.or.jp/works/cymatic-resonance/) | 共鳴譜 Cymatic Resonance | 52万粒の砂が音を見るクラドニ図形。**唯一マイクを使う作品**（拒否時はヒント欄で知らせ、内蔵音に誘導）。移設時にスマホ用レイアウトを新設 |
| [/works/infinite-geometry/](https://art.mqri.or.jp/works/infinite-geometry/) | 無限幾何回廊 Infinite Geometry | アポロニウスのガスケットを永遠に潜行。移設時にピンチ=潜行速度・タップ=停止・2本指タップ=配色を実装 |
| [/works/genesis-of-form/](https://art.mqri.or.jp/works/genesis-of-form/) | 幾何の創世 Genesis of Form | 聖なる幾何学の生成順序を68秒の創世神話に。移設時にピンチ=拡縮・タップ=一時停止を実装 |
| [/works/solstitial-still-point/](https://art.mqri.or.jp/works/solstitial-still-point/) | 夏至・光の静止点 Solstitial Still Point | 地球の傾き23.44°と大気の散乱をリアルタイムの光の場に。日付（2026.06.21）を持つ作品。移設前からスマホ対応済み |
| [/works/circle-limit/](https://art.mqri.or.jp/works/circle-limit/) | Circle Limit — Flower of Life | ポアンカレ円板の双曲平面に{6,4}タイリングで生命の花を敷き詰める。p5.jsローカル同梱・移設時に可変サイズ化とタッチ操作を実装 |
| [/works/flower-differential-growth/](https://art.mqri.or.jp/works/flower-differential-growth/) | 生命の花と、分化成長 | フラワーオブライフの格子の上を差分成長する曲線が埋めていく。p5.jsローカル同梱・移設時にタッチ操作を実装（[経緯](works/flower-differential-growth/README.md)） |
| [/works/quantum-mandala/](https://art.mqri.or.jp/works/quantum-mandala/) | 量子曼荼羅 Quantum Mandala | シュレーディンガー方程式の実時間GPU解法 × 神聖幾何学。iPad展示用にタッチ最適化済み(詳細は各フォルダのREADME) |
| [/works/hopf-loom/](https://art.mqri.or.jp/works/hopf-loom/) | HOPF LOOM — S³の織物 | 四次元球面のHopfファイブレーション × 四次元正多胞体。マルチタッチ(1本指=視点/2本指=ズーム・4次元回転)でiPad展示用に最適化済み |

## 展示モード（投影用）

`exhibit/` — 作品を全画面で自動巡回する投影用ページ。🌐 https://art.mqri.or.jp/exhibit/
`ccf5-gallery/kiosk.html` から移設したもので、上映順と操作系（`→` `←` `Space` `F` `L` `C`）はそのまま。
運用は [`EXHIBITION.md`](EXHIBITION.md) を参照。

> ⚠ `ORDER` に作品を足すときは `HIDE`（作品固有UIを隠すセレクタ）にも行を足す。セレクタは
> **必ずその作品の `index.html` を見て確認する**。同じ作品名でも実装が違うことがある
> （`hopf-loom` は iPad展示版なので `#topbar,#controls`。ccf5-gallery 時代の `#hud,.jp,.keys` では効かない）。
> `file://` で開くと iframe が別オリジンになり自動非表示もキー中継も効かないので、ローカルでもサーバ経由で開くこと。

## 旧URLについて

- `/quantum-mandala/` `/hopf-loom/` → `vercel.json` の恒久リダイレクト(308)で `works/` 配下へ。**iPad常設展示のホーム画面アプリが依存しているので消さない**
- `keisuke19831213-source.github.io/ccf5-gallery/` → 各ページを meta refresh + canonical で誘導。**REGEN DAY 2026-07-13 で配布したQRの飛び先なので、あちらのリポジトリも消さない**

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
