# YORIMICHI.dev

SIer一年目・エンジニア初学者向けの、寄り道できるIT学習マガジンです。

## 起動方法

依存関係はありません。`index.html` を直接開くか、ローカルサーバーを起動します。

```bash
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000` を開いてください。

読書アプリは `reading-app.html` です。実在本カタログのJSON読み込みまで確認する場合は、直接ファイルを開くよりローカルサーバー経由がおすすめです。

```bash
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000/reading-app.html` を開いてください。

## 読書アプリのDB同期

初期状態ではブラウザの `localStorage` に保存します。Supabaseを使う場合は、Supabase SQL Editorで `supabase-schema.sql` を実行してから、`supabase-config.js` に公開用の Project URL と anon key を設定します。

```js
window.YOHAKU_SUPABASE = {
  enabled: true,
  url: "https://xxxxx.supabase.co",
  anonKey: "public-anon-key",
  authRequired: true,
  ownerId: "local-preview"
};
```

DB同期はSupabase Authのメールリンクログインを使います。ログイン後は `auth.uid()` ごとに本棚、読書記録、レビュー履歴を分けて保存します。本マスタは全員が読めますが、追加・更新はSupabase側のSQLや管理画面から行う想定です。

Supabase側では Authentication の Site URL に公開先URLを設定し、必要なら Redirect URLs にローカル確認用の `http://localhost:8000/reading-app.html` も追加してください。

## 主な機能

- Java、Linux、CSS、Eclipse、設計・DBなど100件以上の教材図鑑
- コード例、寄り道コラム、関連語を含む記事表示
- メソッド、for文、FizzBuzz、シーケンス図、ER図、COBOL、C言語系比較の詳説
- 全教材に固有の定義・実行例・よくある誤り・演習・公式資料を掲載
- IT、セキュリティ、AIの週刊トピック
- キーワード検索とカテゴリ絞り込み
- 記事化依頼として構造化保存できる「あとでまとめる箱」と、タイトルなしでも残せる研修メモ
- History API対応によるブラウザの戻る・進む操作
- 行別コード解説、実行トレース、周辺知識・雑学カード
- 管理画面からのカテゴリ・キーワード追加と削除
- ブラウザの `localStorage` による追加データの保存

## ファイル構成

- `data/keywords.js`: 教材・キーワードの元データ
- `data/article-data.js`: 公式資料、深掘り記事、コード解説、雑学
- `app.js`: 画面描画、ルーティング、保存、共有などのアプリ処理
- `styles.css`: PC・スマートフォン共通の見た目
