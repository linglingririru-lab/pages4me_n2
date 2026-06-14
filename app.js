function codeStudyFor(item) {
  const explicit = codeStudies[item.id];
  if (explicit) return explicit;
  const lines = item.code.split("\n").filter(line => line.trim()).slice(0, 8);
  return {
    notes: lines.map(line => {
      const clean = line.trim();
      let explanation = "この行が直前の状態をどう変え、次の行へ何を渡すかを確認します。";
      if (clean.startsWith("#") || clean.startsWith("//")) explanation = "実行されないコメントです。例の前提、注意点、期待する結果を人間向けに残しています。";
      else if (clean.startsWith("$")) explanation = "シェルで実行するコマンドです。`$` 自体は入力せず、その後ろを実行します。終了ステータスと標準出力も確認します。";
      else if (/^(if|else if|while|for|switch)\b/.test(clean)) explanation = "処理の流れを変える行です。条件がtrueになる具体的な値と、falseのときの行き先を追います。";
      else if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|FROM|WHERE|JOIN|GROUP|ORDER|BEGIN|COMMIT|ROLLBACK)/i.test(clean)) explanation = "SQLの役割を表す句です。対象テーブル、対象行、変更範囲を日本語へ戻して読みます。";
      else if (clean.includes("=")) explanation = "値の定義または代入を含む行です。左辺が何を指し、右辺がどの型・値になるかを確認します。";
      else if (clean.includes("return")) explanation = "呼び出し元へ結果を返し、この処理を終了します。返る値の型と受け取り先を追います。";
      return [clean, explanation];
    }),
    trace: [
      ["実行前", "入力・対象・現在地を確認", "予想を一文で書く"],
      ["実行中", "値、条件、対象件数の変化を追う", "最初に予想とずれた行を探す"],
      ["実行後", "出力・終了状態・副作用を確認", "一か所だけ変えて再実行する"]
    ]
  };
}

function reproductionGuideFor(item) {
  const explicit = {
    "command-line-args": {
      label: "ECLIPSE または TERMINAL",
      title: "引数を渡して、結果を確かめる",
      intro: "コードだけ眺めるより、起動時に値を渡してargsの中身が変わるところを見る方が早く理解できます。",
      stepLabel: "実行まで",
      resultLabel: "表示されるもの",
      changeLabel: "次に試すこと",
      steps: ["Hello.javaとして保存する", "ターミナルなら `javac Hello.java` でコンパイルする", "`java Hello Tanaka` を実行する"],
      expected: "こんにちは、Tanakaさん",
      change: "`Tanaka`を自分の名前へ変える。次に引数なしで実行し、なぜ例外になるかをargs.lengthから説明する。"
    },
    "java-method": {
      label: "ECLIPSE または TERMINAL",
      title: "呼び出して、戻り値を受け取る",
      intro: "メソッドへ値が入り、計算結果が呼び出し元へ戻る往復を、小さなプログラムで追います。",
      stepLabel: "実行まで",
      resultLabel: "表示されるもの",
      changeLabel: "次に試すこと",
      steps: ["PriceCalculator.javaとして保存する", "EclipseならRun As → Java Application、ターミナルなら `javac PriceCalculator.java`", "`java PriceCalculator` を実行する"],
      expected: "1100",
      change: "1000を1999へ変更し、小数部分が四捨五入ではなく切り捨てになることを確認する。"
    },
    "java-for-loop": {
      label: "ECLIPSE または TERMINAL",
      title: "繰り返しの順番を観察する",
      intro: "iの値と配列の添字を一周ずつ対応させると、for文の3つの式が何を担当しているか見えてきます。",
      stepLabel: "実行まで",
      resultLabel: "観察する結果",
      changeLabel: "境界を変える",
      steps: ["配列とfor文をmainメソッド内へ置く", "実行前に3行の出力順を紙へ書く", "実行後、予想とConsoleを比較する"],
      expected: "Java、Linux、Gitが配列の順番で1行ずつ表示される",
      change: "条件を `i <= tools.length` に変えて一度失敗し、存在しない添字へ進む瞬間を確認する。"
    },
    "java-fizzbuzz": {
      label: "ECLIPSE または TERMINAL",
      title: "条件の順番を出力で確かめる",
      intro: "正解コードを暗記せず、3・5・15のときにどの条件へ入るかを出力と照らして読みます。",
      stepLabel: "実行まで",
      resultLabel: "観察する結果",
      changeLabel: "順番を変える",
      steps: ["クラスのmainメソッド内へコードを置く", "まず1〜20へ上限を縮めて実行する", "3・5・15・16の出力を条件式と照合する"],
      expected: "3はFizz、5はBuzz、15はFizzBuzz、16は16",
      change: "15の条件を最後へ移し、15がFizzだけになる理由を確認する。"
    }
  };
  if (explicit[item.id]) return explicit[item.id];

  if (item.category === "Java" || item.category === "Java演習") {
    return {
      label: "ECLIPSE / JAVA",
      title: "コードを動かして確かめる",
      intro: "実行前に結果を一度予想し、EclipseのConsoleと比較します。予想と最初にずれた場所が、今読むべきポイントです。",
      stepLabel: "実行まで",
      resultLabel: "確認する結果",
      changeLabel: "一か所変える",
      steps: ["コードをmainメソッドを持つクラスへ置く", "実行前にConsoleへ出る値かエラーを予想する", "Run As → Java Applicationで実行し、最初に予想と違った行を探す"],
      expected: "記事のコードに対応する値、または理解に必要なコンパイルエラー・例外",
      change: "値・条件・引数のどれか一つだけを変え、結果が変わった理由を一文で残す。"
    };
  }
  if (item.category === "Linux") {
    return {
      label: "TERMINAL",
      title: "コマンドの前後を比べる",
      intro: "コマンド名だけを覚えず、実行前の状態・表示された内容・実行後の状態をセットで観察します。",
      stepLabel: "試す手順",
      resultLabel: "観察するもの",
      changeLabel: "比較してみる",
      steps: ["`pwd`で現在地を確認する", "練習用ディレクトリで記事のコマンドを一つずつ実行する", "標準出力に加えて `echo $?` で終了ステータスを確認する"],
      expected: "コマンドによる表示、ファイル状態の変化、終了ステータス",
      change: "存在する対象と存在しない対象の両方で実行し、表示と終了ステータスの違いを見る。"
    };
  }
  if (item.category === "CSS" || item.category === "Web・CSS") {
    return {
      label: "BROWSER DEVTOOLS",
      title: "ブラウザで変化を観察する",
      intro: "CSSはコードと画面を往復して理解します。DevToolsで宣言を一つずつ切り替え、どの領域や配置が変わるかを見ます。",
      stepLabel: "観察の手順",
      resultLabel: "画面で見る場所",
      changeLabel: "条件を変える",
      steps: ["小さなHTMLとCSSへ例を貼る", "ブラウザで開き、DevToolsで対象要素を選ぶ", "CSS宣言を一つ無効化して、箱と配置の変化を見る"],
      expected: "指定したスタイルが画面とComputed Styleへ反映される",
      change: "画面幅を狭め、どの幅で読みづらくなるかを確認してからmedia queryを調整する。"
    };
  }
  if (item.category === "設計・DB") {
    return {
      label: "PAPER / SQL CONSOLE",
      title: "記号を業務の言葉へ戻す",
      intro: "図やSQLは実行結果だけでなく、誰・何・どの関係を表しているかを日本語で説明できることが大切です。",
      stepLabel: "読み解く手順",
      resultLabel: "説明できる状態",
      changeLabel: "条件を変える",
      steps: ["例に登場する名詞・関係・処理を日本語で書き出す", "図やSQLの各行がどの日本語に対応するか線で結ぶ", "SQLならSELECTで対象行を確認してから変更文を考える"],
      expected: "記号やSQLを、日本語の業務ルールとして説明できる",
      change: "1対多を多対多へ変えた場合、どの表や関係が必要になるか考える。"
    };
  }
  return {
    label: "DESK CHECK",
    title: "具体例に置き換えて考える",
    intro: "身近な例と比較対象を置き、用語がどんな役割を担当するのかを自分の言葉で確かめます。",
    stepLabel: "考える手順",
    resultLabel: "説明できる状態",
    changeLabel: "自分の例へ",
    steps: ["例を読む前に結果や関係を予想する", "入力・処理・結果、または目的・手段・制約へ分ける", "似た用語との違いを一つ書く"],
    expected: "用語を暗記文ではなく、具体例と比較対象を使って説明できる",
    change: "自分の研修や身近なシステムへ置き換え、同じ考え方がどこに現れるか探す。"
  };
}

function officialNotesFor(item) {
  return officialNotes[item.category] || officialNotes["開発道具"];
}

function triviaFor(item) {
  return triviaByCategory[item.category] || [
    ["名前の由来を調べる", "技術用語の名前には、以前の道具や歴史的な制約が残っていることがあります。"],
    ["似た仕組みと比較する", "単独の定義より、何が同じで何が違うかを並べる方が記憶に残ります。"],
    ["失敗例を一つ持つ", "正しい例だけでなく、どんな入力で壊れるかを知ると実務で思い出しやすくなります。"],
    ["現場の理由を尋ねる", "仕様上できることと、そのプロジェクトで採用されている理由は別です。"]
  ];
}

const weeklyArticles = [
  {
    id: "week-24",
    issue: "024",
    date: "2026.06.14",
    title: "今週のITを、3つだけ。パスキー、AIエージェント、そして“消えない”古いJava",
    summary: "全部追わなくて大丈夫。新人エンジニアの仕事や勉強につながりそうな話題だけ、背景からゆっくり読み解きます。",
    tags: ["SECURITY", "AI", "JAVA"],
    minutes: "6 MIN READ"
  },
  {
    id: "week-23",
    issue: "023",
    date: "2026.06.07",
    title: "Linuxの小さな道具たちと、AI時代にCLIが妙に元気な理由",
    summary: "派手なAIニュースの脇で、ターミナルが再評価されている。初学者向けにコマンド文化から紹介。",
    tags: ["LINUX", "AI"],
    minutes: "5 MIN READ"
  }
];

const sideNotes = [
  { label: "INTERNET FOLKLORE", title: "「本番環境で試す」という怖い言葉", text: "なぜ検証環境が必要なのかを、失敗談の構造から考える。笑えるうちに覚えておこう。" },
  { label: "JAVA SIDE QUEST", title: "nullは「空っぽ」ではない", text: "空文字や0とは別物。何も参照していない、という状態がどうして厄介なのか。" },
  { label: "1ST YEAR SURVIVAL", title: "質問するときの最強テンプレ", text: "やったこと、期待したこと、起きたこと。この3つだけで質問の解像度がぐっと上がる。" }
];

let keywords = loadKeywords();
let currentFilter = "すべて";
let readingList = loadBacklog();
let trainingNotes = loadJson("yorimichi-training-notes", []);

function loadJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function loadBacklog() {
  const saved = loadJson("yorimichi-reading-list", []);
  return saved.map((entry, index) => {
    if (typeof entry === "string") {
      const item = keywords.find(keyword => keyword.id === entry);
      return {
        id: `backlog-legacy-${index}-${entry}`,
        keywordId: entry,
        title: item?.title || entry,
        request: "",
        category: item?.category || "未分類",
        source: "article",
        status: "waiting",
        createdAt: ""
      };
    }
    return {
      id: entry.id || `backlog-${Date.now()}-${index}`,
      keywordId: entry.keywordId || "",
      title: entry.title || "名称未設定",
      request: entry.request || "",
      category: entry.category || "あとでまとめる",
      source: entry.source || "desk",
      status: entry.status || "waiting",
      createdAt: entry.createdAt || ""
    };
  });
}

function saveReadingList() {
  localStorage.setItem("yorimichi-reading-list", JSON.stringify(readingList));
}

function isSavedForLater(keywordId) {
  return readingList.some(entry => entry.keywordId === keywordId);
}

function formatSavedDate(value) {
  if (!value) return "登録日なし";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "登録日なし";
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(date);
}

function loadKeywords() {
  try {
    const savedValue = JSON.parse(localStorage.getItem("yorimichi-keywords"));
    const saved = Array.isArray(savedValue)
      ? savedValue.filter(item => item.level !== "予習カード")
      : savedValue;
    if (!Array.isArray(saved) || !saved.length) return seedKeywords;
    const savedIds = new Set(saved.map(item => item.id));
    return [...saved, ...seedKeywords.filter(item => !savedIds.has(item.id))];
  } catch {
    return seedKeywords;
  }
}

function saveKeywords() {
  localStorage.setItem("yorimichi-keywords", JSON.stringify(keywords));
}

function escapeHtml(value = "") {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function formatInline(value = "") {
  return escapeHtml(value).replace(/`([^`]+)`/g, "<code class=\"inline-code\">$1</code>");
}

function genericLesson(item) {
  const guide = categoryGuides[item.category] || {
    viewpoint: `${item.title}は単独で暗記せず、何を入力として受け取り、何を変え、どんな結果を返すものかに分けて理解します。`,
    pitfall: "用語の一文定義だけで分かったつもりにならず、具体例と反例を一つずつ作ると理解の穴が見つかります。",
    practice: ["一文で説明する", "具体例を一つ作る", "似た用語との違いを書く"]
  };
  return {
    duration: "8 MIN + MINI PRACTICE",
    goals: [
      `${item.title}を自分の言葉で説明できる`,
      "使う場面と使わない場面を区別できる",
      "小さな具体例で理解を確認できる"
    ],
    sections: [
      {
        title: "まず役割から理解する",
        paragraphs: [
          item.body,
          guide.viewpoint
        ]
      },
      {
        title: "研修中はここを観察する",
        paragraphs: [
          `資料やサンプルコードで「${item.title}」を見つけたら、その行だけでなく直前の入力と直後の結果を追います。名前を知ることより、処理の流れの中で何を担当しているかを説明できる方が実務では役立ちます。`,
          "講師の操作を写すときは、操作前の状態、実行したこと、変化した結果の3列でメモします。後から再現できなければ、どの段階が曖昧かを特定できます。"
        ]
      },
      {
        title: "知識を使える形へ変える",
        paragraphs: [
          `最小例を一度そのまま動かした後、値・条件・名前のどれか一つだけを変えます。「${item.title}がなくても同じことができるか」「使うと何が読みやすくなるか」まで比較すると、丸暗記から抜けられます。`,
          "エラーが出た場合は消して終わりにせず、エラー名、原因だった行、直した内容を一行ずつ残します。自分専用のエラー辞典になり、同じ失敗からの復帰が速くなります。"
        ]
      }
    ],
    mistakes: [
      { bad: "定義を読んだだけで完了にする", fix: "画面、コード、コマンド、図のいずれかで具体例を一つ作ります。" },
      { bad: "似た言葉を同じものとして覚える", fix: `関連語の「${item.related[0] || "比較対象"}」と、目的・入力・結果の違いを表にします。` },
      { bad: "分からない箇所を全部同時に調べる", fix: "今の処理を止めている疑問を一つ選び、残りはあとでまとめる箱へ置きます。" }
    ],
    exercises: [
      `上の「${item.title}」の例を手元で再現し、実行前の予想と実際の結果を書く。`,
      "値・条件・対象のどれか一つだけを変え、結果が変わる理由を一文で説明する。",
      `「${item.related[0] || "似た用語"}」との違いを、目的・入力・結果の3列で比較する。`
    ],
    fieldNote: guide.pitfall
  };
}

function lessonFor(item) {
  return deepLessons[item.id] || genericLesson(item);
}

function codeLabelFor(category) {
  return ({
    Java: "JAVA",
    Java演習: "JAVA EXERCISE",
    Linux: "TERMINAL",
    "設計・DB": "SQL / DIAGRAM",
    "Web・CSS": "WEB",
    CSS: "CSS",
    COBOL: "COBOL",
    "開発道具": "TOOL / COMMAND",
    Eclipse: "IDE / FILE",
    基本情報: "CONCEPT MODEL",
    言語比較: "LANGUAGE MAP"
  })[category] || "EXAMPLE";
}

const LIBRARY_PAGE_SIZE = 6;

function keywordCards(items = keywords, startIndex = 0) {
  return items.map((item, index) => `
    <article class="keyword-card" data-keyword="${item.id}" tabindex="0">
      <div>
      <span class="card-number">${item.level ? "QUICK" : "GUIDE"}_${String(startIndex + index + 1).padStart(2, "0")}</span>
        <span class="category-label">${escapeHtml(item.category)}</span>
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary)}</p>
      <span class="card-arrow">↗</span>
    </article>
  `).join("");
}

function renderHome() {
  return `
    <div class="view">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">A casual field guide for rookie engineers</p>
          <h1>わからないを、<br><em>寄り道しながら</em><br>面白く。</h1>
          <p class="hero-lead">教科書のすみっこにあったコラムのように。Java、Linux、CSSから現場の小ネタまで、気になった言葉を入口にゆっくり知識をつなげよう。</p>
          <form class="search-box" id="hero-search">
            <span class="search-icon" aria-hidden="true"></span>
            <input id="hero-search-input" aria-label="キーワードを検索" placeholder="例：コマンドライン引数、クラスパス、chmod..." />
            <button class="primary-btn" type="submit">調べる</button>
          </form>
          <div class="quick-row">
            <div class="quick-tags">
              <button data-search="コマンドライン引数"># コマンドライン引数</button>
              <button data-search="クラスパス"># クラスパス</button>
              <button data-search="FizzBuzz"># FizzBuzz</button>
              <button data-search="シーケンス図"># シーケンス図</button>
            </div>
            <span class="hero-mini-mark" aria-hidden="true">
              <i>&lt;/&gt;</i>
              <b></b>
              <b></b>
            </span>
          </div>
        </div>
        <div class="hero-art">
          <img src="./assets/learning-map-v2.png" alt="JavaやLinuxなどの技術モチーフを淡い青と緑で構成したイラスト" />
        </div>
      </section>

      <section class="section alt home-keyword-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">START HERE</p>
            <h2>今日のキーワード図鑑</h2>
            <p>${keywords.length}件の教材から、定義だけで終わらない解説と演習へ。</p>
          </div>
          <button class="text-btn" data-route="library">図鑑を全部見る →</button>
        </div>
        <p class="swipe-hint" aria-hidden="true">横にスワイプして、ほかのカテゴリを見る →</p>
        <div class="card-grid home-keyword-scroll">${keywordCards(keywords.slice(0, 6))}</div>
      </section>

      <section class="section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">WEEKLY DIGEST</p>
            <h2>今週、何があった？</h2>
          </div>
          <button class="text-btn" data-route="weekly">バックナンバー →</button>
        </div>
        ${weeklyFeature(weeklyArticles[0])}
      </section>

      <section class="section alt">
        <div class="section-heading">
          <div>
            <p class="eyebrow">SIDE NOTES</p>
            <h2>教科書のすみっこ</h2>
            <p>試験には出ないかもしれない。でも、たぶん覚えている話。</p>
          </div>
        </div>
        <div class="side-note-grid">
          ${sideNotes.map(note => `
            <article class="side-note">
              <span class="mono">${note.label}</span>
              <h3>${note.title}</h3>
              <p>${note.text}</p>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">DESK SIDE</p>
            <h2>今週のガジェット寄り道</h2>
            <p>道具から入ると、技術の話が少し身近になる。</p>
          </div>
        </div>
        <article class="gadget-feature">
          <div class="keyboard-visual" aria-label="コンパクトキーボードの図">
            ${Array.from({ length: 24 }, () => "<span></span>").join("")}
          </div>
          <div class="gadget-copy">
            <span class="category-label">KEYBOARD · 3 MIN</span>
            <h3>なぜエンジニアはキーボード配列の話を始めると長いのか</h3>
            <p>JISとUS、テンキーレス、分割式。正解探しというより、毎日触る道具を自分の作業に合わせる小さな改善です。まずは記号の位置とショートカットの違いから眺めます。</p>
            <button class="secondary-btn" data-search="コマンドライン引数">キーボードでCLIへ寄り道 →</button>
          </div>
        </article>
      </section>
    </div>
  `;
}

function weeklyFeature(article) {
  return `
    <article class="weekly-feature" data-weekly="${article.id}">
      <div class="weekly-copy">
        <p class="eyebrow">ISSUE #${article.issue} · ${article.tags.join(" / ")}</p>
        <h3>${article.title}</h3>
        <p>${article.summary}</p>
        <div class="weekly-meta">
          <span>${article.date}</span>
          <span>${article.minutes}</span>
          <span>READ →</span>
        </div>
      </div>
      <div class="weekly-side">
        <div class="week-stamp">
          <span>WEEKLY</span>
          <strong>${article.issue}</strong>
          <small>YORIMICHI PRESS</small>
        </div>
      </div>
    </article>
  `;
}

function renderLibrary(query = "", requestedPage = 1) {
  const categories = ["すべて", ...new Set(keywords.map(item => item.category))];
  const normalized = query.toLowerCase();
  const filtered = keywords.filter(item => {
    const matchesFilter = currentFilter === "すべて" || item.category === currentFilter;
    const haystack = `${item.title} ${item.category} ${item.summary}`.toLowerCase();
    return matchesFilter && haystack.includes(normalized);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / LIBRARY_PAGE_SIZE));
  const page = Math.min(Math.max(Number(requestedPage) || 1, 1), totalPages);
  const startIndex = (page - 1) * LIBRARY_PAGE_SIZE;
  const pageItems = filtered.slice(startIndex, startIndex + LIBRARY_PAGE_SIZE);
  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter(number => number === 1 || number === totalPages || Math.abs(number - page) <= 1);
  const pageButtons = visiblePages.map((number, index) => {
    const previous = visiblePages[index - 1];
    const gap = previous && number - previous > 1 ? `<span class="page-gap">…</span>` : "";
    return `${gap}<button class="page-number ${number === page ? "active" : ""}" data-library-page="${number}" ${number === page ? 'aria-current="page"' : ""}>${number}</button>`;
  }).join("");

  return `
    <div class="view">
      <header class="page-heading">
        <p class="eyebrow">KEYWORD LIBRARY</p>
        <h1>キーワード図鑑</h1>
        <p>知りたい単語から入って、関連語へふらふら進むための場所。試験対策と現場の「それ何？」の間を埋めます。</p>
      </header>
      <section class="section">
        <form class="search-box" id="library-search" style="margin-bottom: 30px">
          <span class="search-icon" aria-hidden="true"></span>
          <input id="library-search-input" value="${escapeHtml(query)}" placeholder="キーワードを絞り込む" />
          <button class="primary-btn" type="submit">検索</button>
        </form>
        <div class="filter-bar">
          ${categories.map(category => `<button class="chip ${currentFilter === category ? "active" : ""}" data-filter="${category}">${category}</button>`).join("")}
        </div>
        ${filtered.length ? `
          <div class="library-summary">
            <span>${filtered.length}件中 ${startIndex + 1}〜${Math.min(startIndex + LIBRARY_PAGE_SIZE, filtered.length)}件</span>
            <span>${page} / ${totalPages}ページ</span>
          </div>
          <div class="card-grid">${keywordCards(pageItems, startIndex)}</div>
          <nav class="pagination" aria-label="キーワード図鑑のページ">
            <button class="page-move" data-library-page="${page - 1}" ${page === 1 ? "disabled" : ""}>前へ</button>
            <div class="page-numbers">${pageButtons}</div>
            <button class="page-move" data-library-page="${page + 1}" ${page === totalPages ? "disabled" : ""}>次へ</button>
          </nav>
        ` : `<div class="empty-state"><h3>まだ、その寄り道はありません。</h3><p>管理画面から新しいキーワードを追加できます。</p></div>`}
      </section>
    </div>
  `;
}

function renderKeyword(id) {
  const item = keywords.find(keyword => keyword.id === id);
  if (!item) return renderLibrary();
  const lesson = lessonFor(item);
  const codeStudy = codeStudyFor(item);
  const reproduction = reproductionGuideFor(item);
  const researchedNotes = officialNotesFor(item);
  const trivia = triviaFor(item);
  const sources = sourceCatalog[item.category] || [];
  return `
    <div class="view">
      <div class="article-nav">
        <button class="article-back" data-article-back>← 前の画面へ戻る</button>
        <span>${escapeHtml(item.category)} / ${escapeHtml(item.title)}</span>
      </div>
      <div class="detail-layout">
        <aside class="margin-rail" aria-hidden="true">
          <span class="margin-rail-label">YORIMICHI NOTE</span>
          <i></i>
          <span>READ</span>
          <b></b>
          <span>TRACE</span>
          <b></b>
          <span>DETOUR</span>
        </aside>
        <article class="article">
          <p class="eyebrow">${escapeHtml(item.category)} · ${escapeHtml(lesson.duration)}</p>
          <h1>${escapeHtml(item.title)}</h1>
          <p class="lead">${escapeHtml(item.lead)}</p>
          <section class="learning-goals">
            <span>この記事を終えたら</span>
            <ul>${lesson.goals.map(goal => `<li>${escapeHtml(goal)}</li>`).join("")}</ul>
          </section>
          <h2 id="overview">${escapeHtml(reproduction.title)}</h2>
          <p>${formatInline(item.body)}</p>
          <aside class="example-notice">
            <strong>${escapeHtml(reproduction.label)}</strong>
            <p>${escapeHtml(reproduction.intro)}</p>
          </aside>
          <pre class="code-block" data-label="${escapeHtml(codeLabelFor(item.category))}"><code>${escapeHtml(item.code)}</code></pre>
          <div class="reproduction-grid">
            <section>
              <span>01 / ${escapeHtml(reproduction.stepLabel)}</span>
              <ol>${reproduction.steps.map(step => `<li>${formatInline(step)}</li>`).join("")}</ol>
            </section>
            <section>
              <span>02 / ${escapeHtml(reproduction.resultLabel)}</span>
              <p>${formatInline(reproduction.expected)}</p>
            </section>
            <section>
              <span>03 / ${escapeHtml(reproduction.changeLabel)}</span>
              <p>${formatInline(reproduction.change)}</p>
            </section>
          </div>
          <p class="code-caption">読む順番は、入力される値 → 条件や処理 → 出力される結果。実行前の予想を一行残すと、分からなかった場所が見つけやすくなります。</p>
          <section class="code-study" id="code-study">
            <p class="eyebrow">READ THE CODE</p>
            <h2>コードを上から追う</h2>
            <p>コードの言い換えだけではなく、その行で値や処理の流れがどう変わるかを追います。</p>
            <div class="code-note-list">
              ${codeStudy.notes.map((note, index) => `
                <article>
                  <span class="code-note-number">${String(index + 1).padStart(2, "0")}</span>
                  <code>${escapeHtml(note[0])}</code>
                  <p>${formatInline(note[1])}</p>
                </article>
              `).join("")}
            </div>
          </section>
          <section class="execution-trace" id="trace">
            <p class="eyebrow">EXECUTION TRACE</p>
            <h2>実行中の頭の中</h2>
            <div class="trace-table">
              ${codeStudy.trace.map(row => `
                <div>
                  <strong>${escapeHtml(row[0])}</strong>
                  <span>${formatInline(row[1])}</span>
                  <span>${formatInline(row[2])}</span>
                </div>
              `).join("")}
            </div>
          </section>
          ${lesson.sections.map((section, index) => `
            <section class="lesson-section" id="section-${index + 1}">
              <span class="section-index">0${index + 1}</span>
              <h2>${escapeHtml(section.title)}</h2>
              ${section.paragraphs.map(paragraph => `<p>${formatInline(paragraph)}</p>`).join("")}
            </section>
          `).join("")}
          <section class="researched-notes">
            <p class="eyebrow">FROM OFFICIAL DOCS</p>
            <h2>公式資料から、もう一段だけ深く</h2>
            <p>仕様を最初から全部読む必要はありません。この記事に関係する部分だけ、初学者向けの観察ポイントへ言い換えました。</p>
            <div>
              ${researchedNotes.map((note, index) => `
                <article>
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <p>${formatInline(note)}</p>
                </article>
              `).join("")}
            </div>
          </section>
          <aside class="detour-box">
            <h3>${escapeHtml(item.detourTitle)}</h3>
            <p>${escapeHtml(item.detour)}</p>
          </aside>
          <section class="trivia-section" id="trivia">
            <p class="eyebrow">DETOUR NOTES</p>
            <h2>ここから広がる寄り道</h2>
            <p>本筋の外側にある話ほど、あとで記憶を引っ張り出す目印になります。</p>
            <div class="trivia-grid">
              ${trivia.map((fact, index) => `
                <article>
                  <span>寄り道 ${String(index + 1).padStart(2, "0")}</span>
                  <h3>${escapeHtml(fact[0])}</h3>
                  <p>${formatInline(fact[1])}</p>
                </article>
              `).join("")}
            </div>
          </section>
          <section class="mistake-section" id="mistakes">
            <p class="eyebrow">COMMON MISTAKES</p>
            <h2>よくある詰まり方</h2>
            <div class="mistake-list">
              ${lesson.mistakes.map((mistake, index) => `
                <article>
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <div><strong>${formatInline(mistake.bad)}</strong><p>${formatInline(mistake.fix)}</p></div>
                </article>
              `).join("")}
            </div>
          </section>
          <section class="exercise-section" id="exercises">
            <p class="eyebrow">TRY IT YOURSELF</p>
            <h2>予習・復習のための演習</h2>
            <ol>${lesson.exercises.map(exercise => `<li>${formatInline(exercise)}</li>`).join("")}</ol>
          </section>
          <aside class="field-note">
            <span>現場メモ</span>
            <p>${formatInline(lesson.fieldNote)}</p>
          </aside>
          ${sources.length ? `
            <section class="source-section" id="sources">
              <p class="eyebrow">PRIMARY SOURCES</p>
              <h2>次に読む公式資料</h2>
              <p>この記事は入口です。仕様や正確な挙動を確認するときは、検索結果の要約ではなく公式資料へ戻ります。</p>
              <div class="source-links">
                ${sources.map(source => `<a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.label)} <span>↗</span></a>`).join("")}
              </div>
            </section>
          ` : ""}
        </article>
        <aside class="article-aside">
          <div class="toc">
            <strong>この記事の道順</strong>
            <button data-scroll="overview">00 最初の具体例</button>
            <button data-scroll="code-study">01 コードを追う</button>
            <button data-scroll="trace">02 実行トレース</button>
            ${lesson.sections.map((section, index) => `<button data-scroll="section-${index + 1}">0${index + 1} ${escapeHtml(section.title)}</button>`).join("")}
            <button data-scroll="trivia">寄り道・雑学</button>
            <button data-scroll="mistakes">よくある詰まり</button>
            <button data-scroll="exercises">演習</button>
            ${sources.length ? `<button data-scroll="sources">公式資料</button>` : ""}
          </div>
          <div class="related">
            <strong>RELATED WORDS</strong>
            ${item.related.map(word => `<button class="chip" data-search="${escapeHtml(word)}">${escapeHtml(word)}</button>`).join("")}
          </div>
          <button class="secondary-btn save-later ${isSavedForLater(item.id) ? "saved" : ""}" data-save-later="${item.id}">
            ${isSavedForLater(item.id) ? "あとでまとめる箱に追加済み" : "あとでまとめる箱へ"}
          </button>
          <button class="secondary-btn" data-route="library" style="width:100%; margin-top: 20px">← 図鑑へ戻る</button>
        </aside>
      </div>
    </div>
  `;
}

function renderDesk() {
  return `
    <div class="view">
      <header class="page-heading">
        <p class="eyebrow">YOUR STUDY DESK</p>
        <h1>学習デスク</h1>
        <p>今は理解しきれない言葉と、研修中の雑なメモをいったん置く場所。きれいに整理するのは後で大丈夫です。</p>
      </header>
      <div class="desk-layout">
        <section class="panel notes-panel">
          <div class="panel-heading">
            <div><span class="category-label">ROUGH NOTES</span><h2>研修メモ置き場</h2></div>
            <strong>${trainingNotes.length}枚</strong>
          </div>
          <form id="note-form">
            <div class="field">
              <input name="title" placeholder="タイトル（空欄でも保存できます）" />
              <small>見出しがいらないメモは、そのまま本文だけ残せます。</small>
            </div>
            <div class="field"><textarea name="text" required placeholder="箇条書き、疑問、あとで試したいコードなどを雑に置いておく"></textarea></div>
            <button class="primary-btn" type="submit">メモを置く</button>
          </form>
          <div class="note-grid">
            ${trainingNotes.map(note => `
              <article class="training-note">
                <div><time>${escapeHtml(note.date)}</time><button class="icon-btn" data-delete-note="${note.id}">削除</button></div>
                ${note.title ? `<h3>${escapeHtml(note.title)}</h3>` : ""}
                <p class="${note.title ? "" : "titleless"}">${escapeHtml(note.text).replace(/\n/g, "<br>")}</p>
              </article>`).join("")}
          </div>
        </section>
        <section class="panel backlog-panel">
          <div class="panel-heading">
            <div><span class="category-label">READ LATER</span><h2>あとでまとめる箱</h2></div>
            <strong>${readingList.length}件</strong>
          </div>
          <p class="panel-description">ここへ置いた内容は、後で教材記事に追加するための原稿依頼として保存されます。単語だけでも、欲しいコード例や疑問まで書いても大丈夫です。</p>
          <form id="backlog-form" class="backlog-form">
            <div class="field">
              <input name="title" required placeholder="まとめてほしいテーマ：DI、排他制御、配列など" />
            </div>
            <div class="field">
              <textarea name="request" placeholder="任意：Javaのコード例が欲しい、研修でここが分からなかった、周辺知識も知りたい等"></textarea>
            </div>
            <button class="primary-btn" type="submit">記事化待ちに追加</button>
          </form>
          <div class="backlog-share">
            <div>
              <strong>まとめて管理者へ送る</strong>
              <p>箱の内容を文章にまとめ、スマホの共有メニューまたはメールで送れます。</p>
            </div>
            <button class="secondary-btn" id="open-backlog-share" type="button" ${readingList.length ? "" : "disabled"}>
              ${readingList.length ? `${readingList.length}件を共有` : "共有する内容がありません"}
            </button>
          </div>
          <div class="desk-list">
            ${readingList.length ? readingList.map(entry => `
              <div class="desk-item">
                ${entry.keywordId ? `
                  <button class="desk-link" data-keyword="${entry.keywordId}">
                    <small>${escapeHtml(entry.category)} · ${formatSavedDate(entry.createdAt)}</small>
                    <strong>${escapeHtml(entry.title)}</strong>
                    ${entry.request ? `<span>${escapeHtml(entry.request)}</span>` : ""}
                  </button>
                ` : `
                  <div class="desk-link">
                    <small>記事化待ち · ${formatSavedDate(entry.createdAt)}</small>
                    <strong>${escapeHtml(entry.title)}</strong>
                    ${entry.request ? `<span>${escapeHtml(entry.request)}</span>` : ""}
                  </div>
                `}
                <button class="icon-btn" data-remove-later="${entry.id}">外す</button>
              </div>`).join("") : `<div class="empty-state small"><p>記事の「あとでまとめる箱へ」か、上の入力欄から追加できます。</p></div>`}
          </div>
        </section>
      </div>
    </div>
  `;
}

function renderWeekly() {
  return `
    <div class="view">
      <header class="page-heading">
        <p class="eyebrow">WEEKLY YORIMICHI PRESS</p>
        <h1>週刊トピック</h1>
        <p>IT、セキュリティ、AIの話を全部追うのは無理。新人エンジニアの視点で「今これだけ知っておこう」を記事風にまとめます。</p>
      </header>
      <section class="section">
        <div style="display:grid; gap:24px">
          ${weeklyArticles.map(weeklyFeature).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderWeeklyDetail(id) {
  const article = weeklyArticles.find(item => item.id === id) || weeklyArticles[0];
  return `
    <div class="view">
      <div class="detail-layout">
        <article class="article">
          <p class="eyebrow">WEEKLY #${article.issue} · ${article.date}</p>
          <h1>${article.title}</h1>
          <p class="lead">${article.summary}</p>
          <h2 id="roughly">01. パスワードの次に来るもの</h2>
          <p>セキュリティの世界では「人間に複雑な文字列を覚えさせる」方法から少しずつ離れています。パスキーは端末側の仕組みを使い、偽サイトへ秘密を渡しにくくする考え方です。用語そのものより、認証の責任を人の記憶だけに背負わせない流れを押さえておきましょう。</p>
          <aside class="detour-box">
            <h3>「強いパスワード」だけでは足りない理由</h3>
            <p>どれだけ複雑でも、偽サイトに自分で入力すれば盗まれます。文字列の強度と、渡す相手が本物かどうかは別問題です。</p>
          </aside>
          <h2 id="try">02. AIエージェントって結局なに？</h2>
          <p>質問に文章で答えるだけでなく、道具を選び、途中経過を見て、複数の操作を進めるAIを指すことが増えました。新人のうちは「全部任せられる存在」ではなく、「作業を分解して、確認ポイントを置く必要がある自動化」と捉えるとちょうどよいでしょう。</p>
          <pre class="code-block"><code>目的を受け取る\n  ↓\n必要な手順を考える\n  ↓\nツールを使う → 結果を確認する\n  ↓\n次の手順へ進む / 人に確認する</code></pre>
          <h2 id="next">03. 古いJavaはなぜ消えない？</h2>
          <p>企業システムでは、長年安定稼働していること自体が価値です。新しい技術が出ても、移行コストや業務リスクとの比較になります。SIer一年目なら、新旧どちらが正義かではなく「なぜ今これが使われているか」を聞く姿勢が強い武器になります。</p>
        </article>
        <aside class="article-aside">
          <div class="toc">
            <strong>今週の3トピック</strong>
            <button data-scroll="roughly">01 パスキー</button>
            <button data-scroll="try">02 AIエージェント</button>
            <button data-scroll="next">03 古いJava</button>
          </div>
          <button class="secondary-btn" data-route="weekly" style="width:100%; margin-top: 20px">← バックナンバー</button>
        </aside>
      </div>
    </div>
  `;
}

function renderAdmin() {
  const categories = [...new Set(keywords.map(item => item.category))];
  return `
    <div class="view">
      <header class="page-heading">
        <p class="eyebrow">CONTENT DESK</p>
        <h1>管理メニュー</h1>
        <p>学びたい言語やキーワードを、あとから自由に足せます。追加内容はこのブラウザに保存されます。</p>
      </header>
      <div class="admin-layout">
        <section class="panel">
          <h2>新しいキーワードを追加</h2>
          <form id="keyword-form">
            <div class="field">
              <label for="new-title">キーワード</label>
              <input id="new-title" name="title" required placeholder="例：例外処理" />
            </div>
            <div class="field">
              <label for="new-category">カテゴリ</label>
              <input id="new-category" name="category" list="category-list" required placeholder="例：Java" />
              <datalist id="category-list">${categories.map(category => `<option value="${escapeHtml(category)}">`).join("")}</datalist>
            </div>
            <div class="field">
              <label for="new-summary">カードの説明</label>
              <textarea id="new-summary" name="summary" required placeholder="どんなことがわかる記事か、短く入力"></textarea>
            </div>
            <div class="field">
              <label for="new-body">ざっくり解説</label>
              <textarea id="new-body" name="body" required placeholder="初学者向けの説明"></textarea>
            </div>
            <div class="field">
              <label for="new-code">コード・コマンド例</label>
              <textarea id="new-code" name="code" placeholder="System.out.println(...);"></textarea>
            </div>
            <button class="primary-btn" type="submit">図鑑に追加する</button>
          </form>
        </section>
        <section class="panel">
          <h2>登録済みコンテンツ <small style="font:400 11px 'DM Mono'">${keywords.length} FILES</small></h2>
          <div class="admin-list">
            ${keywords.map(item => `
              <div class="admin-item">
                <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.category)} · ${escapeHtml(item.summary.slice(0, 45))}${item.summary.length > 45 ? "..." : ""}</small></div>
                <button class="icon-btn" data-delete="${item.id}">削除</button>
              </div>
            `).join("")}
          </div>
          <button class="secondary-btn" id="reset-data" style="margin-top:20px">初期データに戻す</button>
        </section>
      </div>
    </div>
  `;
}

function routeUrl(route, id, query = "", page = 1) {
  const params = new URLSearchParams();
  if (route && route !== "home") params.set("view", route);
  if (id) params.set("id", id);
  if (query) params.set("q", query);
  if (route === "library" && page > 1) params.set("page", page);
  const search = params.toString();
  return `${window.location.pathname}${search ? `?${search}` : ""}`;
}

function routeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    route: params.get("view") || "home",
    id: params.get("id") || undefined,
    query: params.get("q") || "",
    page: Number(params.get("page")) || 1
  };
}

const ADMIN_UNLOCK_KEY = "yorimichi-admin-unlocked";
const ADMIN_PASSCODE_HASH = "5b7465c902b300d7f5fe84df02fe151d11cb93cbe30d1edf75d5e46731868492";
let adminAccessPending = false;

function isAdminUnlocked() {
  return sessionStorage.getItem(ADMIN_UNLOCK_KEY) === "true";
}

function openAdminLock() {
  adminAccessPending = true;
  const dialog = document.getElementById("admin-lock-dialog");
  const form = document.getElementById("admin-lock-form");
  form.reset();
  document.getElementById("admin-lock-error").textContent = "";
  if (!dialog.open) dialog.showModal();
  document.getElementById("admin-passcode").focus();
}

function closeAdminLock() {
  const dialog = document.getElementById("admin-lock-dialog");
  if (dialog.open) dialog.close();
  adminAccessPending = false;
}

async function hashPasscode(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

function navigate(route, id, query = "", options = {}) {
  const app = document.getElementById("app");
  const page = route === "library" ? (options.page || 1) : 1;

  if (route === "admin" && !isAdminUnlocked()) {
    if (!app.innerHTML.trim()) {
      app.innerHTML = renderHome();
      document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle("active", link.dataset.route === "home");
      });
      window.history.replaceState({ route: "home" }, "", routeUrl("home"));
    }
    openAdminLock();
    return;
  }

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.route === route || (route === "keyword" && link.dataset.route === "library"));
  });
  document.querySelector(".main-nav").classList.remove("open");

  if (route === "library") app.innerHTML = renderLibrary(query, page);
  else if (route === "keyword") app.innerHTML = renderKeyword(id);
  else if (route === "weekly") app.innerHTML = renderWeekly();
  else if (route === "weekly-detail") app.innerHTML = renderWeeklyDetail(id);
  else if (route === "desk") app.innerHTML = renderDesk();
  else if (route === "admin") app.innerHTML = renderAdmin();
  else app.innerHTML = renderHome();

  if (options.history !== false) {
    const method = options.replace ? "replaceState" : "pushState";
    window.history[method]({ route, id, query, page }, "", routeUrl(route, id, query, page));
  }
  window.scrollTo({ top: 0, behavior: options.instant ? "auto" : "smooth" });
}

function searchKeyword(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    navigate("library");
    return;
  }
  const exact = keywords.find(item =>
    item.title.toLowerCase().includes(normalized) ||
    normalized.includes(item.title.toLowerCase())
  );
  if (exact) navigate("keyword", exact.id);
  else navigate("library", null, query.trim());
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}

const ADMIN_CONTACT_EMAIL = "ryougayamamura@gmail.com";
let backlogShareText = "";

function buildBacklogShareText() {
  const lines = readingList.map((entry, index) => {
    const details = [
      `${index + 1}. ${entry.title}`,
      `カテゴリ: ${entry.category}`,
      `登録日: ${formatSavedDate(entry.createdAt)}`,
      entry.request ? `希望・疑問: ${entry.request}` : "希望・疑問: 記載なし"
    ];
    return details.join("\n");
  });

  return [
    "YORIMICHI.dev「あとでまとめる箱」の記事化リクエスト",
    "",
    ...lines.flatMap((line, index) => index === lines.length - 1 ? [line] : [line, ""]),
    "",
    `管理者連絡先: ${ADMIN_CONTACT_EMAIL}`
  ].join("\n");
}

function openBacklogShareDialog() {
  if (!readingList.length) return;
  backlogShareText = buildBacklogShareText();
  document.getElementById("backlog-share-preview").value = backlogShareText;
  const dialog = document.getElementById("backlog-share-dialog");
  dialog.showModal();
  document.getElementById("cancel-backlog-share").focus();
}

function closeBacklogShareDialog() {
  const dialog = document.getElementById("backlog-share-dialog");
  if (dialog.open) dialog.close();
}

async function shareBacklog() {
  if (!backlogShareText) return;
  const shareData = {
    title: "YORIMICHI.dev 記事化リクエスト",
    text: backlogShareText
  };

  closeBacklogShareDialog();
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      showToast("共有メニューへ渡しました");
    } catch (error) {
      if (error.name !== "AbortError") showToast("共有を開けませんでした");
    }
    return;
  }

  const subject = encodeURIComponent(shareData.title);
  const body = encodeURIComponent(shareData.text);
  window.location.href = `mailto:${ADMIN_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

let pendingDeleteAction = null;

function openDeleteDialog(action, label, message = "この操作は元に戻せません。") {
  pendingDeleteAction = action;
  const dialog = document.getElementById("delete-dialog");
  document.getElementById("delete-dialog-title").textContent = `「${label}」を削除しますか？`;
  document.getElementById("delete-dialog-message").textContent = message;
  dialog.showModal();
  document.getElementById("cancel-delete").focus();
}

function closeDeleteDialog() {
  const dialog = document.getElementById("delete-dialog");
  if (dialog.open) dialog.close();
  pendingDeleteAction = null;
}

function confirmPendingDeletion() {
  if (!pendingDeleteAction) return;
  const { type, id } = pendingDeleteAction;
  closeDeleteDialog();

  if (type === "keyword") {
    keywords = keywords.filter(item => item.id !== id);
    saveKeywords();
    navigate("admin");
    showToast("キーワードを削除しました");
  }
  if (type === "backlog") {
    readingList = readingList.filter(entry => entry.id !== id);
    saveReadingList();
    navigate("desk");
    showToast("記事化待ちから削除しました");
  }
  if (type === "note") {
    trainingNotes = trainingNotes.filter(note => note.id !== id);
    localStorage.setItem("yorimichi-training-notes", JSON.stringify(trainingNotes));
    navigate("desk");
    showToast("研修メモを削除しました");
  }
  if (type === "reset") {
    keywords = [...seedKeywords];
    saveKeywords();
    navigate("admin");
    showToast("初期データに戻しました");
  }
}

document.addEventListener("click", (event) => {
  const routeTarget = event.target.closest("[data-route]");
  const keywordTarget = event.target.closest("[data-keyword]");
  const weeklyTarget = event.target.closest("[data-weekly]");
  const searchTarget = event.target.closest("[data-search]");
  const filterTarget = event.target.closest("[data-filter]");
  const libraryPageTarget = event.target.closest("[data-library-page]");
  const scrollTarget = event.target.closest("[data-scroll]");
  const deleteTarget = event.target.closest("[data-delete]");
  const saveLaterTarget = event.target.closest("[data-save-later]");
  const removeLaterTarget = event.target.closest("[data-remove-later]");
  const deleteNoteTarget = event.target.closest("[data-delete-note]");
  const articleBackTarget = event.target.closest("[data-article-back]");

  if (event.target.closest("#open-backlog-share")) {
    openBacklogShareDialog();
    return;
  }
  if (event.target.closest("#cancel-backlog-share")) {
    closeBacklogShareDialog();
    return;
  }
  if (event.target.closest("#confirm-backlog-share")) {
    shareBacklog();
    return;
  }
  if (event.target.closest("#cancel-admin-access")) {
    closeAdminLock();
    return;
  }
  if (event.target.closest("#cancel-delete")) {
    closeDeleteDialog();
    return;
  }
  if (event.target.closest("#confirm-delete")) {
    confirmPendingDeletion();
    return;
  }
  if (articleBackTarget) {
    if (window.history.length > 1) window.history.back();
    else navigate("library");
    return;
  }
  if (routeTarget) navigate(routeTarget.dataset.route);
  if (keywordTarget) navigate("keyword", keywordTarget.dataset.keyword);
  if (weeklyTarget) navigate("weekly-detail", weeklyTarget.dataset.weekly);
  if (searchTarget) searchKeyword(searchTarget.dataset.search);
  if (filterTarget) {
    currentFilter = filterTarget.dataset.filter;
    navigate("library");
  }
  if (libraryPageTarget && !libraryPageTarget.disabled) {
    const query = document.getElementById("library-search-input")?.value || "";
    navigate("library", null, query, { page: Number(libraryPageTarget.dataset.libraryPage) });
  }
  if (scrollTarget) document.getElementById(scrollTarget.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
  if (deleteTarget) {
    const item = keywords.find(keyword => keyword.id === deleteTarget.dataset.delete);
    openDeleteDialog(
      { type: "keyword", id: deleteTarget.dataset.delete },
      item?.title || "このキーワード"
    );
    return;
  }
  if (saveLaterTarget) {
    const item = keywords.find(keyword => keyword.id === saveLaterTarget.dataset.saveLater);
    if (item && !isSavedForLater(item.id)) {
      readingList.unshift({
        id: `backlog-${Date.now()}`,
        keywordId: item.id,
        title: item.title,
        request: "この記事を、コード例や周辺知識を含めてあとで読み直す。",
        category: item.category,
        source: "article",
        status: "waiting",
        createdAt: new Date().toISOString()
      });
    }
    saveReadingList();
    navigate("desk");
    showToast("あとでまとめる箱へ追加しました");
  }
  if (removeLaterTarget) {
    const entry = readingList.find(item => item.id === removeLaterTarget.dataset.removeLater);
    openDeleteDialog(
      { type: "backlog", id: removeLaterTarget.dataset.removeLater },
      entry?.title || "この記事化待ち"
    );
    return;
  }
  if (deleteNoteTarget) {
    const note = trainingNotes.find(item => item.id === deleteNoteTarget.dataset.deleteNote);
    const label = note?.title || note?.text.slice(0, 18) || "この研修メモ";
    openDeleteDialog({ type: "note", id: deleteNoteTarget.dataset.deleteNote }, label);
    return;
  }
  if (event.target.closest("#reset-data")) {
    openDeleteDialog(
      { type: "reset" },
      "追加したキーワード",
      "自分で追加したキーワードが削除され、初期状態へ戻ります。この操作は元に戻せません。"
    );
    return;
  }
  if (event.target.closest(".mobile-menu")) {
    document.querySelector(".main-nav").classList.toggle("open");
  }
});

document.getElementById("delete-dialog").addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDeleteDialog();
});

document.getElementById("delete-dialog").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) closeDeleteDialog();
});

document.getElementById("admin-lock-dialog").addEventListener("cancel", (event) => {
  event.preventDefault();
  closeAdminLock();
});

document.getElementById("admin-lock-dialog").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) closeAdminLock();
});

document.getElementById("backlog-share-dialog").addEventListener("cancel", (event) => {
  event.preventDefault();
  closeBacklogShareDialog();
});

document.getElementById("backlog-share-dialog").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) closeBacklogShareDialog();
});

document.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (event.target.id === "admin-lock-form") {
    const passcode = new FormData(event.target).get("passcode");
    const hash = await hashPasscode(passcode);
    if (hash === ADMIN_PASSCODE_HASH) {
      sessionStorage.setItem(ADMIN_UNLOCK_KEY, "true");
      closeAdminLock();
      navigate("admin");
      showToast("管理メニューのロックを解除しました");
    } else {
      const error = document.getElementById("admin-lock-error");
      error.textContent = "パスコードが違います。大文字・小文字も確認してください。";
      document.getElementById("admin-passcode").select();
    }
    return;
  }
  if (event.target.id === "hero-search") {
    searchKeyword(document.getElementById("hero-search-input").value);
  }
  if (event.target.id === "library-search") {
    navigate("library", null, document.getElementById("library-search-input").value);
  }
  if (event.target.id === "keyword-form") {
    const data = new FormData(event.target);
    const title = data.get("title").trim();
    const id = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "keyword"}-${Date.now()}`;
    keywords.unshift({
      id,
      title,
      category: data.get("category").trim(),
      summary: data.get("summary").trim(),
      lead: `${title}について、まずは初学者向けにざっくり見ていきましょう。`,
      body: data.get("body").trim(),
      code: data.get("code").trim() || "// コード例はまだありません",
      detourTitle: "ここから寄り道",
      detour: "このキーワードと一緒によく登場する言葉を、ひとつずつ調べてみると理解がつながります。",
      related: ["関連用語", "実行してみる", "エラーを読む"]
    });
    saveKeywords();
    navigate("admin");
    showToast(`「${title}」を追加しました`);
  }
  if (event.target.id === "backlog-form") {
    const data = new FormData(event.target);
    const title = data.get("title").trim();
    const request = data.get("request").trim();
    const match = keywords.find(item => item.title.toLowerCase() === title.toLowerCase());
    readingList.unshift({
      id: `backlog-${Date.now()}`,
      keywordId: match?.id || "",
      title,
      request,
      category: match?.category || "あとでまとめる",
      source: "desk",
      status: "waiting",
      createdAt: new Date().toISOString()
    });
    saveReadingList();
    navigate("desk");
    showToast("記事化待ちに追加しました");
  }
  if (event.target.id === "note-form") {
    const data = new FormData(event.target);
    trainingNotes.unshift({
      id: `note-${Date.now()}`,
      title: data.get("title").trim(),
      text: data.get("text").trim(),
      date: new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(new Date())
    });
    localStorage.setItem("yorimichi-training-notes", JSON.stringify(trainingNotes));
    navigate("desk");
    showToast("研修メモを置きました");
  }
});

document.addEventListener("keydown", (event) => {
  const card = event.target.closest("[data-keyword]");
  if (card && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    navigate("keyword", card.dataset.keyword);
  }
});

window.addEventListener("popstate", () => {
  const state = routeFromUrl();
  navigate(state.route, state.id, state.query, { history: false, instant: true, page: state.page });
});

const initialRoute = routeFromUrl();
navigate(initialRoute.route, initialRoute.id, initialRoute.query, { replace: true, instant: true, page: initialRoute.page });
