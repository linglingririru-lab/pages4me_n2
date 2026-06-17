create table if not exists public.yohaku_app_states (
  owner_id text primary key,
  state jsonb not null,
  catalog_version text not null default '2026-06-demo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.yohaku_books (
  id text primary key,
  title text not null,
  author text not null,
  author_kana text,
  category text not null default 'general-fiction',
  published_year integer,
  publisher text,
  tones text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_yohaku_app_states_updated_at on public.yohaku_app_states;
create trigger set_yohaku_app_states_updated_at
before update on public.yohaku_app_states
for each row
execute function public.set_updated_at();

drop trigger if exists set_yohaku_books_updated_at on public.yohaku_books;
create trigger set_yohaku_books_updated_at
before update on public.yohaku_books
for each row
execute function public.set_updated_at();

alter table public.yohaku_app_states enable row level security;
alter table public.yohaku_books enable row level security;

drop policy if exists "Allow personal app read" on public.yohaku_app_states;
drop policy if exists "Users can read own app state" on public.yohaku_app_states;
create policy "Users can read own app state"
on public.yohaku_app_states
for select
using (owner_id = auth.uid()::text);

drop policy if exists "Allow personal app insert" on public.yohaku_app_states;
drop policy if exists "Users can insert own app state" on public.yohaku_app_states;
create policy "Users can insert own app state"
on public.yohaku_app_states
for insert
with check (owner_id = auth.uid()::text);

drop policy if exists "Allow personal app update" on public.yohaku_app_states;
drop policy if exists "Users can update own app state" on public.yohaku_app_states;
create policy "Users can update own app state"
on public.yohaku_app_states
for update
using (owner_id = auth.uid()::text)
with check (owner_id = auth.uid()::text);

drop policy if exists "Allow catalog read" on public.yohaku_books;
create policy "Allow catalog read"
on public.yohaku_books
for select
using (true);

drop policy if exists "Allow catalog insert" on public.yohaku_books;
drop policy if exists "Allow catalog update" on public.yohaku_books;

insert into public.yohaku_books (id, title, author, author_kana, category, published_year, publisher, tones)
values
  ('jp-fiction-0001', 'ノルウェイの森', '村上春樹', 'むらかみはるき', 'literary-fiction', 1987, '講談社', array['静か','内省']),
  ('jp-fiction-0002', '海辺のカフカ', '村上春樹', 'むらかみはるき', 'literary-fiction', 2002, '新潮社', array['遠く','不思議']),
  ('jp-fiction-0003', '重力ピエロ', '伊坂幸太郎', 'いさかこうたろう', 'general-fiction', 2003, '新潮社', array['軽やか','不穏']),
  ('jp-fiction-0004', 'アヒルと鴨のコインロッカー', '伊坂幸太郎', 'いさかこうたろう', 'mystery', 2003, '東京創元社', array['謎','余韻']),
  ('jp-fiction-0005', '何者', '朝井リョウ', 'あさいりょう', 'general-fiction', 2012, '新潮社', array['現代','鋭い']),
  ('jp-fiction-0006', '正欲', '朝井リョウ', 'あさいりょう', 'general-fiction', 2021, '新潮社', array['鋭い','考える']),
  ('jp-fiction-0007', 'コンビニ人間', '村田沙耶香', 'むらたさやか', 'literary-fiction', 2016, '文藝春秋', array['違和感','鋭い']),
  ('jp-fiction-0008', '地球星人', '村田沙耶香', 'むらたさやか', 'literary-fiction', 2018, '新潮社', array['不穏','鋭い']),
  ('jp-fiction-0009', '乳と卵', '川上未映子', 'かわかみみえこ', 'literary-fiction', 2008, '文藝春秋', array['身体','鋭い']),
  ('jp-fiction-0010', 'ヘヴン', '川上未映子', 'かわかみみえこ', 'literary-fiction', 2009, '講談社', array['痛み','静か']),
  ('jp-fiction-0011', '博士の愛した数式', '小川洋子', 'おがわようこ', 'general-fiction', 2003, '新潮社', array['静か','やさしい']),
  ('jp-fiction-0012', 'ことり', '小川洋子', 'おがわようこ', 'literary-fiction', 2012, '朝日新聞出版', array['静か','孤独']),
  ('jp-fiction-0013', 'センセイの鞄', '川上弘美', 'かわかみひろみ', 'literary-fiction', 2001, '平凡社', array['静か','やさしい']),
  ('jp-fiction-0014', '蛇にピアス', '金原ひとみ', 'かねはらひとみ', 'literary-fiction', 2003, '集英社', array['鋭い','身体']),
  ('jp-fiction-0015', '蹴りたい背中', '綿矢りさ', 'わたやりさ', 'literary-fiction', 2003, '河出書房新社', array['青春','鋭い']),
  ('jp-fiction-0016', 'パーク・ライフ', '吉田修一', 'よしだしゅういち', 'literary-fiction', 2002, '文藝春秋', array['都市','静か']),
  ('jp-fiction-0017', '流浪の月', '凪良ゆう', 'なぎらゆう', 'general-fiction', 2019, '東京創元社', array['切実','やさしい']),
  ('jp-fiction-0018', '夜のピクニック', '恩田陸', 'おんだりく', 'general-fiction', 2004, '新潮社', array['青春','歩く']),
  ('jp-fiction-0019', '告白', '湊かなえ', 'みなとかなえ', 'mystery', 2008, '双葉社', array['不穏','謎']),
  ('jp-fiction-0020', '白夜行', '東野圭吾', 'ひがしのけいご', 'mystery', 1999, '集英社', array['謎','重い']),
  ('jp-fiction-0021', '人間失格', '太宰治', 'だざいおさむ', 'modern-classics', 1948, '筑摩書房', array['古典','内省']),
  ('jp-fiction-0022', 'こころ', '夏目漱石', 'なつめそうせき', 'modern-classics', 1914, '岩波書店', array['古典','内省'])
on conflict (id) do update
set title = excluded.title,
    author = excluded.author,
    author_kana = excluded.author_kana,
    category = excluded.category,
    published_year = excluded.published_year,
    publisher = excluded.publisher,
    tones = excluded.tones;
