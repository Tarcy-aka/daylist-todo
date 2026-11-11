# Daylist — React Todoアプリ

React・TypeScriptで制作したタスク管理アプリです。

## 開き方
ZIPをすべて解凍して `html/index.html` をブラウザで開いてください。
インストールや開発サーバーは不要です。

## 機能
- タスクの追加・編集・完了切り替え・削除
- 優先度と期限の設定
- キーワード検索、未完了・完了の絞り込み
- 追加順・優先度順・期限順の並び替え
- 完了率表示、完了したタスクの一括削除

## データについて
タスクはセッション内のみで管理されます。再読み込みするとリセットされます。
保存機能・ログイン機能はありません。

## 構成
- `html/index.html`：単体版の画面
- `css/style.css`：スタイル
- `js/script.js`：ブラウザ実行用のReact同梱ファイル
- `src/`：編集用のReact・TypeScriptソースとテスト

## 編集とテスト
このフォルダで `npm install` を実行後、以下を実行します。

```sh
npm run build
npm test
```

ビルドはJavaScriptを更新します。CSSは配布済みのスタイルを直接編集してください。

## 使用技術
React、TypeScript、CSS、Radix UI、Lucide React、esbuild、Vitest。

## 公開URL
未設定です。公開後にURLを追記してください。
