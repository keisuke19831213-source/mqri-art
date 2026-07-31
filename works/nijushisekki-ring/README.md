# 二十四節気の円環 — The Ring of Twenty-Four Seasons

太陽黄経360°を24等分し、一年を円環として巡る暦の幾何学。
— https://art.mqri.or.jp/works/nijushisekki-ring/

初出 2026-07-10（旧 `nijushisekki-ring` / `nijushisekki-ring.vercel.app`）。

## 単一HTML化について（2026-07-31）

もとは **Next.js + Cloudflare Workers(vinext) + D1(drizzle)** の構成だった。ただし中身を読むと、

- 作品本体は `app/season-ring.tsx`（69行）とフラグメントシェーダ1枚のみ
- D1 / drizzle は `worker/index.ts` にしか現れず、**実行時には使われていない**（テンプレートの残骸）
- Tailwind はインポートされていたが、**ユーティリティクラスの使用は0件**（クラスはすべて自前）

つまりビルドと実行環境を必要とする理由が無かったので、`mqri-art` の規約（外部依存ゼロ・1フォルダ=1URL・ビルドなし）に合わせて素のJSへ書き直した。

**シェーダ(VERT/FRAG)・24節気の表・CSSは、もとの実装からスクリプトで機械的に抽出して逐語で移している**（転記ミスを避けるため）。React が担っていたのは `selected` / `auto` の状態管理と24ボタンの生成だけなので、そこだけ素のDOM操作に置き換えた。

### 検算

本番（`nijushisekki-ring.vercel.app`）と単一HTML版で、`h1` / `.current h2` / `.current p` / `.current em` / `.term` / `.mode` / `.dial` / `body` の算出スタイルを突き合わせ、**全項目一致**を確認した（Tailwindのプリフライトを落とした影響がないことの確認）。節気の値も検算済み：冬至=太陽黄経270°・立秋=135°。

### 追加した点

- viewport meta（`viewport-fit=cover`）と展示用meta・`manifest.webmanifest`
- `.artwork` に `touch-action:none`（指の操作をブラウザのスクロールに奪わせない）
- スマホでヘッダーとフッターに safe-area を見込む

## 仕組み

季節は `s`（0〜1）としてシェーダに渡され、`pal()` が冬→春→夏→秋を巡る配色を返す。円環・花弁・輻・塵はすべて fBm ノイズで歪められ、ポインタ位置は `m` として渡って局所的に光を強める。節気を選ぶと `s` が目標値へ 2.5%/frame で緩和されるので、季節は跳ばずに滑って移る。
