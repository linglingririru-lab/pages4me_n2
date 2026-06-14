const STORAGE_KEY = "yohaku-reading-app-v1";

const STATUS_LABELS = {
  owned: "所有・未読",
  reading: "読書中",
  read: "読了",
  wishlist: "読みたい"
};

const COLORS = ["#dbe1e6", "#d2d9e1", "#c9d1dc", "#dddde5", "#cfd9dc", "#e0e3e6"];

const newBooks = [
  {
    title: "薄明の庭",
    author: "水瀬 冴",
    genre: "小説",
    date: "2026-06-18",
    tone: "静か やさしい",
    description: "薄暗い庭と、家族の記憶をめぐる連作。",
    color: "#d5dce1"
  },
  {
    title: "雪解け以前",
    author: "鷺沢 透",
    genre: "短編集",
    date: "2026-06-21",
    tone: "静か 鋭い",
    description: "言葉になる直前の感情をたどる短編集。",
    color: "#c8d2dc"
  },
  {
    title: "静かな回路",
    author: "白間 伊織",
    genre: "小説",
    date: "2026-06-24",
    tone: "考える 不穏",
    description: "人と機械の距離を描く、冷たい近未来小説。",
    color: "#cfd0dc"
  },
  {
    title: "遠い灯りの方へ",
    author: "有沢 凪",
    genre: "エッセイ",
    date: "2026-06-28",
    tone: "遠く やさしい",
    description: "知らない町を歩くための、短い文章と写真。",
    color: "#d8dee2"
  }
];

const recommendationPool = [
  {
    title: "白い岸辺",
    author: "柊木 景",
    genre: "短編集",
    tone: "静か 鋭い",
    reason: "余白の多い文章を、急がず読みたい夜に。",
    color: "#d9e1e6"
  },
  {
    title: "灯台は眠らない",
    author: "須賀野 澪",
    genre: "ミステリー",
    tone: "不穏 静か",
    reason: "謎よりも、誰もいない場所の気配が残ります。",
    color: "#cbd4dc"
  },
  {
    title: "透明な午後",
    author: "李 夏遠",
    genre: "エッセイ",
    tone: "考える やさしい",
    reason: "答えではなく、静かな視点が欲しい午後に。",
    color: "#dde3e6"
  },
  {
    title: "冬の骨",
    author: "深森 透",
    genre: "小説",
    tone: "鋭い 不穏",
    reason: "短く鋭い文章と、説明されない空白を楽しむ一冊。",
    color: "#c5ced8"
  },
  {
    title: "遠雷の図書室",
    author: "高瀬 文",
    genre: "小説",
    tone: "遠く 静か",
    reason: "派手な冒険ではなく、静かに遠くへ行きたい日に。",
    color: "#d0d4df"
  },
  {
    title: "眠りの手前で",
    author: "有川 冬",
    genre: "短編集",
    tone: "やさしい 静か",
    reason: "眠る前の短い時間に、記憶をほどく物語。",
    color: "#dadde4"
  }
];

function isoDate(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function seedState() {
  const books = [
    {
      id: "book-1", title: "遠い部屋、近い声", author: "久住 澄",
      genre: "小説", isbn: "9784000000001", status: "reading",
      pages: 326, progress: 182, tone: "静か 読後に残る", color: "#cbd3de",
      createdAt: "2026-05-29T10:00:00.000Z", updatedAt: "2026-06-13T14:18:00.000Z"
    },
    {
      id: "book-2", title: "霧のなかの家", author: "小泉 冬子",
      genre: "小説", isbn: "9784000000002", status: "read",
      pages: 248, progress: 248, tone: "不穏 冷たい", color: "#d6dce2",
      createdAt: "2026-05-18T09:00:00.000Z", updatedAt: "2026-06-08T11:00:00.000Z"
    },
    {
      id: "book-3", title: "水面の手紙", author: "森野 灯",
      genre: "短編集", isbn: "9784000000003", status: "read",
      pages: 216, progress: 216, tone: "やさしい 静か", color: "#d4dce0",
      createdAt: "2026-04-12T09:00:00.000Z", updatedAt: "2026-05-30T11:00:00.000Z"
    },
    {
      id: "book-4", title: "夜をほどく", author: "成瀬 周",
      genre: "エッセイ", isbn: "", status: "wishlist",
      pages: 192, progress: 0, tone: "考える", color: "#d3d4df",
      createdAt: "2026-06-03T09:00:00.000Z", updatedAt: "2026-06-03T09:00:00.000Z"
    }
  ];
  const records = [
    {
      id: "record-1", bookId: "book-2", date: "2026-06-08", status: "read",
      rating: 4, tone: "冷たい静けさ", note: "静かだけれど、最後の数ページだけ温度が違った。",
      createdAt: "2026-06-08T14:18:00.000Z"
    },
    {
      id: "record-2", bookId: "book-3", date: "2026-05-30", status: "read",
      rating: 5, tone: "水のような余韻", note: "読み終えてから、窓の外の音が少し近くなった。",
      createdAt: "2026-05-30T12:05:00.000Z"
    }
  ];
  const reviews = [
    {
      id: "review-1", bookId: "book-3", name: "mio", rating: 5,
      heading: "言葉の外側まで静かでした",
      body: "大きな出来事はないのに、短い話の間にある余白まで記憶に残ります。急いで読まない方がいい本でした。",
      spoiler: false, createdAt: "2026-06-01T08:12:00.000Z", updatedAt: "2026-06-01T08:12:00.000Z"
    }
  ];
  return {
    version: 1,
    books,
    records,
    reviews,
    activity: [
      { id: "activity-1", action: "review-created", label: "『水面の手紙』のレビューを投稿", createdAt: "2026-06-01T08:12:00.000Z" }
    ]
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.books) && Array.isArray(saved.reviews)) return saved;
  } catch (error) {
    console.warn("保存データを読み込めませんでした。", error);
  }
  return seedState();
}

let state = loadState();
let currentFilter = "all";
let recommendationOffset = 0;
let toastTimer;

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(value = "") {
  return value.toLowerCase().replace(/[\s　\-ー・]/g, "");
}

function formatDate(value, includeTime = false) {
  if (!value) return "";
  const date = new Date(value);
  return new Intl.DateTimeFormat("ja-JP", includeTime
    ? { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    : { year: "numeric", month: "short", day: "numeric" }
  ).format(date);
}

function stars(rating) {
  const value = Number(rating) || 0;
  return `${"★".repeat(value)}${"☆".repeat(5 - value)}`;
}

function bookById(id) {
  return state.books.find(book => book.id === id);
}

function addActivity(action, label) {
  state.activity.unshift({ id: uid("activity"), action, label, createdAt: new Date().toISOString() });
  state.activity = state.activity.slice(0, 60);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openView(viewName) {
  $$(".app-view").forEach(view => view.classList.toggle("active", view.id === `view-${viewName}`));
  $$(".site-header .nav-link").forEach(button => button.classList.toggle("active", button.dataset.view === viewName));
  window.scrollTo({ top: 0, behavior: "smooth" });
  history.replaceState(null, "", `#${viewName}`);
}

function openModal(id) {
  const layer = $("#modal-layer");
  layer.classList.add("open");
  layer.setAttribute("aria-hidden", "false");
  $$(".modal").forEach(modal => modal.classList.toggle("active", modal.id === id));
  document.body.classList.add("modal-open");
  setTimeout(() => $(`#${id} input:not([type="hidden"]), #${id} select`)?.focus(), 80);
}

function closeModal() {
  $("#modal-layer").classList.remove("open");
  $("#modal-layer").setAttribute("aria-hidden", "true");
  $$(".modal").forEach(modal => modal.classList.remove("active"));
  document.body.classList.remove("modal-open");
}

function bookOptions(selected = "") {
  return state.books
    .map(book => `<option value="${book.id}" ${book.id === selected ? "selected" : ""}>${escapeHtml(book.title)} — ${escapeHtml(book.author)}</option>`)
    .join("");
}

function renderHome() {
  const readCount = state.books.filter(book => book.status === "read").length;
  $("#hero-read-count").textContent = readCount;

  const reading = state.books.find(book => book.status === "reading");
  $("#reading-now-content").innerHTML = reading ? `
    <div class="reading-book">
      <div class="mini-spine"></div>
      <div>
        <h2>${escapeHtml(reading.title)}</h2>
        <span>${reading.progress || 0} / ${reading.pages || "—"}ページ</span>
        <div class="progress-track"><i style="width:${reading.pages ? Math.min(100, (reading.progress / reading.pages) * 100) : 0}%"></i></div>
      </div>
      <em>${reading.pages ? Math.round((reading.progress / reading.pages) * 100) : 0}%</em>
    </div>
  ` : `
    <div class="empty-copy">
      <h2>今は、栞を挟んだ本がありません。</h2>
      <p>読書中の本を登録すると進み具合が見えます。</p>
      <button class="text-button" data-action="add-book">本を登録する</button>
    </div>
  `;

  const latestRecord = [...state.records].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const latestBook = latestRecord && bookById(latestRecord.bookId);
  $("#last-note-content").innerHTML = latestRecord ? `
    <blockquote>「${escapeHtml(latestRecord.note || latestRecord.tone || "記録を残しました。")}」</blockquote>
    <small>『${escapeHtml(latestBook?.title || "削除された本")}』 / ${formatDate(latestRecord.date)}</small>
  ` : `
    <div class="empty-copy"><h2>最初の余韻を残す。</h2><p>短い一言から始められます。</p></div>
  `;

  renderRecommendations();
  $("#new-book-list").innerHTML = newBooks.map((book, index) => {
    const owned = findDuplicate(book.title);
    return `
      <article class="new-item">
        <div class="new-cover" style="--cover:${book.color}"></div>
        <div><h3>${escapeHtml(book.title)}</h3><span>${formatDate(book.date)} 発売 / ${escapeHtml(book.author)}</span></div>
        <p>${escapeHtml(book.description)}</p>
        <button data-action="save-new" data-index="${index}">${owned ? "本棚に登録済み ✓" : "気になる本へ ＋"}</button>
      </article>
    `;
  }).join("");
}

function renderRecommendations() {
  const ordered = [...recommendationPool.slice(recommendationOffset), ...recommendationPool.slice(0, recommendationOffset)];
  $("#recommendation-list").innerHTML = ordered.slice(0, 3).map((book, index) => {
    const owned = findDuplicate(book.title);
    return `
      <button class="book-card" data-action="recommendation" data-index="${recommendationPool.indexOf(book)}">
        <div class="book-cover" style="--cover:${book.color}">
          ${owned ? `<span class="owned-mark">IN YOUR SHELF</span>` : ""}
          <strong>${escapeHtml(book.title)}</strong>
        </div>
        <p>0${index + 1} / ${escapeHtml(book.genre.toUpperCase())}</p>
        <h3>${escapeHtml(book.title)}</h3>
        <span>${escapeHtml(book.author)}</span>
        <small class="reason">${escapeHtml(book.reason)}</small>
      </button>
    `;
  }).join("");
}

function findDuplicate(query, excludeId = "") {
  const target = normalize(query);
  if (!target) return null;
  return state.books.find(book => {
    if (book.id === excludeId) return false;
    return normalize(book.title) === target || (book.isbn && normalize(book.isbn) === target);
  }) || null;
}

function renderLibrary() {
  const query = normalize($("#library-search")?.value);
  const filtered = state.books.filter(book => {
    const matchesFilter = currentFilter === "all" || book.status === currentFilter;
    const haystack = normalize(`${book.title}${book.author}${book.isbn}${book.genre}`);
    return matchesFilter && (!query || haystack.includes(query));
  });
  const counts = Object.fromEntries(Object.keys(STATUS_LABELS).map(status => [status, state.books.filter(book => book.status === status).length]));
  $("#library-summary").innerHTML = `
    <span><b>${state.books.length}</b>冊</span>
    <span><b>${counts.read}</b>読了</span>
    <span><b>${counts.reading}</b>読書中</span>
    <span><b>${counts.wishlist}</b>読みたい</span>
  `;
  $("#library-list").innerHTML = filtered.map(book => `
    <button class="shelf-card" data-action="edit-book" data-id="${book.id}">
      <div class="shelf-cover" style="--cover:${book.color || COLORS[0]}">
        <span class="status-tag">${STATUS_LABELS[book.status]}</span>
        <strong>${escapeHtml(book.title)}</strong>
      </div>
      <h2>${escapeHtml(book.title)}</h2>
      <p>${escapeHtml(book.author)} / ${escapeHtml(book.genre)}</p>
      <small>${book.isbn ? `ISBN ${escapeHtml(book.isbn)}` : escapeHtml(book.tone || "気配はまだ未記録")}</small>
    </button>
  `).join("");
  $("#library-empty").hidden = filtered.length > 0;
}

function renderJournal() {
  const records = [...state.records].sort((a, b) => new Date(b.date) - new Date(a.date));
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthly = records.filter(record => record.date.startsWith(thisMonth)).length;
  const ratings = records.map(record => Number(record.rating)).filter(Boolean);
  const average = ratings.length ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1) : "—";
  $("#journal-overview").innerHTML = `
    <article class="metric"><span>ALL RECORDS</span><strong>${records.length}<small>件の記録</small></strong></article>
    <article class="metric"><span>THIS MONTH</span><strong>${monthly}<small>冊を記録</small></strong></article>
    <article class="metric"><span>AVERAGE</span><strong>${average}<small>/ 5</small></strong></article>
  `;
  $("#journal-timeline").innerHTML = records.length ? records.map(record => {
    const book = bookById(record.bookId);
    return `
      <article class="timeline-item">
        <time class="timeline-date">${formatDate(record.date)}</time>
        <div class="timeline-copy">
          <h3>${escapeHtml(book?.title || "削除された本")}</h3>
          <span>${escapeHtml(book?.author || "")} / ${STATUS_LABELS[record.status] || "記録"}</span>
          ${record.note ? `<blockquote>「${escapeHtml(record.note)}」</blockquote>` : ""}
          <div class="stars">${stars(record.rating)}　${escapeHtml(record.tone || "")}</div>
        </div>
      </article>
    `;
  }).join("") : `<div class="empty-state"><h2>まだ記録がありません。</h2><p>一行の感想から始められます。</p></div>`;

  const tones = records.flatMap(record => (record.tone || "").split(/[、,\s]+/)).filter(Boolean);
  const toneCounts = tones.reduce((map, tone) => map.set(tone, (map.get(tone) || 0) + 1), new Map());
  const sortedTones = [...toneCounts].sort((a, b) => b[1] - a[1]).slice(0, 10);
  $("#tone-cloud").innerHTML = sortedTones.length
    ? sortedTones.map(([tone, count]) => `<span>${escapeHtml(tone)} ${count > 1 ? `<small>${count}</small>` : ""}</span>`).join("")
    : "<span>まだ気配はありません</span>";
}

function renderReviews() {
  const sort = $("#review-sort")?.value || "newest";
  const reviews = [...state.reviews].sort((a, b) => sort === "rating"
    ? b.rating - a.rating
    : new Date(b.createdAt) - new Date(a.createdAt));
  $("#review-count").textContent = `${reviews.length}件のレビュー`;
  $("#review-list").innerHTML = reviews.length ? reviews.map(review => {
    const book = bookById(review.bookId);
    const content = `
      <h3>${escapeHtml(review.heading)}</h3>
      <p>${escapeHtml(review.body)}</p>
    `;
    return `
      <article class="review-item">
        <div class="review-top">
          <div class="review-book">
            <h2>${escapeHtml(book?.title || "削除された本")}</h2>
            <span>${escapeHtml(book?.author || "")}</span>
          </div>
          <div class="stars">${stars(review.rating)}</div>
        </div>
        ${review.spoiler ? `
          <div class="spoiler-cover" data-spoiler="${review.id}">
            内容に触れるレビューです。<button data-action="show-spoiler" data-id="${review.id}">表示する</button>
          </div>
          <div id="spoiler-${review.id}" hidden>${content}</div>
        ` : content}
        <div class="review-meta">
          <span>${escapeHtml(review.name)} / ${formatDate(review.createdAt)}</span>
          <button data-action="edit-review" data-id="${review.id}">編集</button>
          <button data-action="delete-review" data-id="${review.id}">削除</button>
        </div>
      </article>
    `;
  }).join("") : `<div class="empty-state"><h2>まだレビューはありません。</h2><p>読み終えた人の言葉を、ここに残せます。</p></div>`;

  $("#activity-list").innerHTML = state.activity.length ? state.activity.slice(0, 12).map(item => `
    <div class="history-item">
      <strong>${escapeHtml(item.label)}</strong>
      <span>${formatDate(item.createdAt, true)}</span>
    </div>
  `).join("") : `<p>送信履歴はまだありません。</p>`;
}

function renderAll() {
  renderHome();
  renderLibrary();
  renderJournal();
  renderReviews();
}

function prepareBookForm(book = null) {
  $("#book-form").reset();
  $("#book-id").value = book?.id || "";
  $("#book-modal-title").textContent = book ? "本の情報を整える" : "本を記録する";
  $("#book-title").value = book?.title || "";
  $("#book-author").value = book?.author || "";
  $("#book-genre").value = book?.genre || "小説";
  $("#book-isbn").value = book?.isbn || "";
  $("#book-status").value = book?.status || "owned";
  $("#book-pages").value = book?.pages || "";
  $("#book-progress").value = book?.progress || "";
  $("#book-tone").value = book?.tone || "";
  $("#delete-book").hidden = !book;
  $("#book-duplicate-warning").hidden = true;
  updateProgressField();
  openModal("book-modal");
}

function updateProgressField() {
  $("#progress-field").hidden = $("#book-status").value !== "reading";
}

function saveBook(event) {
  event.preventDefault();
  const id = $("#book-id").value;
  const title = $("#book-title").value.trim();
  const isbn = $("#book-isbn").value.trim();
  const duplicate = findDuplicate(isbn || title, id);
  if (duplicate) {
    const warning = $("#book-duplicate-warning");
    warning.textContent = `『${duplicate.title}』はすでに「${STATUS_LABELS[duplicate.status]}」として本棚にあります。`;
    warning.hidden = false;
    return;
  }
  const existing = id ? bookById(id) : null;
  const book = {
    id: id || uid("book"),
    title,
    author: $("#book-author").value.trim(),
    genre: $("#book-genre").value,
    isbn,
    status: $("#book-status").value,
    pages: Number($("#book-pages").value) || 0,
    progress: Number($("#book-progress").value) || 0,
    tone: $("#book-tone").value.trim(),
    color: existing?.color || COLORS[state.books.length % COLORS.length],
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (existing) {
    state.books[state.books.findIndex(item => item.id === id)] = book;
    addActivity("book-updated", `『${book.title}』の本棚情報を更新`);
  } else {
    state.books.unshift(book);
    addActivity("book-created", `『${book.title}』を本棚に追加`);
  }
  saveState();
  closeModal();
  renderAll();
  showToast(existing ? "本の情報を更新しました。" : "本棚に一冊追加しました。");
}

function deleteCurrentBook() {
  const id = $("#book-id").value;
  const book = bookById(id);
  if (!book) return;
  if (!window.confirm(`『${book.title}』を本棚から削除しますか？ 読書記録とレビューは履歴として残ります。`)) return;
  state.books = state.books.filter(item => item.id !== id);
  addActivity("book-deleted", `『${book.title}』を本棚から削除`);
  saveState();
  closeModal();
  renderAll();
  showToast("本棚から削除しました。記録の履歴は残っています。");
}

function prepareRecordForm(bookId = "") {
  if (!state.books.length) {
    showToast("先に本を一冊登録してください。");
    prepareBookForm();
    return;
  }
  $("#record-form").reset();
  $("#record-book").innerHTML = bookOptions(bookId);
  $("#record-date").value = isoDate();
  openModal("record-modal");
}

function saveRecord(event) {
  event.preventDefault();
  const book = bookById($("#record-book").value);
  if (!book) return;
  const status = $("#record-status").value;
  const record = {
    id: uid("record"),
    bookId: book.id,
    date: $("#record-date").value,
    status,
    rating: Number($("#record-rating").value),
    tone: $("#record-tone").value.trim(),
    note: $("#record-note").value.trim(),
    createdAt: new Date().toISOString()
  };
  state.records.unshift(record);
  book.status = status;
  if (status === "read" && book.pages) book.progress = book.pages;
  book.updatedAt = new Date().toISOString();
  addActivity("record-created", `『${book.title}』の読書記録を保存`);
  saveState();
  closeModal();
  renderAll();
  showToast("読書の余韻を保存しました。");
}

function prepareReviewForm(review = null, bookId = "") {
  if (!state.books.length) {
    showToast("レビューする本を先に登録してください。");
    prepareBookForm();
    return;
  }
  $("#review-form").reset();
  $("#review-id").value = review?.id || "";
  $("#review-modal-title").textContent = review ? "レビューを整える" : "レビューを書く";
  $("#review-book").innerHTML = bookOptions(review?.bookId || bookId);
  $("#review-name").value = review?.name || "わたし";
  $("#review-rating").value = review?.rating || "4";
  $("#review-heading").value = review?.heading || "";
  $("#review-body").value = review?.body || "";
  $("#review-spoiler").checked = Boolean(review?.spoiler);
  openModal("review-modal");
}

function saveReview(event) {
  event.preventDefault();
  const id = $("#review-id").value;
  const existing = state.reviews.find(review => review.id === id);
  const book = bookById($("#review-book").value);
  const review = {
    id: id || uid("review"),
    bookId: $("#review-book").value,
    name: $("#review-name").value.trim(),
    rating: Number($("#review-rating").value),
    heading: $("#review-heading").value.trim(),
    body: $("#review-body").value.trim(),
    spoiler: $("#review-spoiler").checked,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (existing) {
    state.reviews[state.reviews.findIndex(item => item.id === id)] = review;
    addActivity("review-updated", `『${book?.title || "本"}』のレビューを編集`);
  } else {
    state.reviews.unshift(review);
    addActivity("review-created", `『${book?.title || "本"}』のレビューを投稿`);
  }
  saveState();
  closeModal();
  renderAll();
  openView("reviews");
  showToast(existing ? "レビューを更新しました。" : "レビューを送信し、履歴に保存しました。");
}

function deleteReview(id) {
  const review = state.reviews.find(item => item.id === id);
  if (!review) return;
  const book = bookById(review.bookId);
  if (!window.confirm("このレビューを削除しますか？ 送信した履歴は残ります。")) return;
  state.reviews = state.reviews.filter(item => item.id !== id);
  addActivity("review-deleted", `『${book?.title || "削除された本"}』のレビューを削除`);
  saveState();
  renderReviews();
  showToast("レビューを削除しました。送信履歴は残っています。");
}

function saveSuggestedBook(book) {
  const duplicate = findDuplicate(book.title);
  if (duplicate) {
    showToast(`『${duplicate.title}』はすでに本棚にあります。`);
    openView("library");
    return;
  }
  state.books.unshift({
    id: uid("book"),
    title: book.title,
    author: book.author,
    genre: book.genre,
    isbn: "",
    status: "wishlist",
    pages: 0,
    progress: 0,
    tone: book.tone,
    color: book.color,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  addActivity("book-created", `『${book.title}』を「読みたい」に追加`);
  saveState();
  renderAll();
  showToast("「読みたい本」に追加しました。");
}

function showMoodResult(mood) {
  $$("#mood-options button").forEach(button => button.classList.toggle("active", button.dataset.mood === mood));
  const candidates = [...recommendationPool, ...newBooks].filter(book => book.tone.includes(mood));
  const book = candidates[Math.floor(Math.random() * candidates.length)] || recommendationPool[0];
  const owned = findDuplicate(book.title);
  $("#mood-result").innerHTML = `
    <p class="eyebrow">ONE BOOK FOR THIS FEELING</p>
    <h3>${escapeHtml(book.title)}</h3>
    <span>${escapeHtml(book.author)} / ${escapeHtml(book.genre)}</span>
    <p>${escapeHtml(book.reason || book.description)}</p>
    <button class="text-button" data-action="mood-save" data-title="${escapeHtml(book.title)}">${owned ? "本棚にあります ✓" : "気になる本へ ＋"}</button>
  `;
  $("#mood-result").classList.add("visible");
}

function handleAction(target) {
  const actionTarget = target.closest("[data-action]");
  if (!actionTarget) return;
  const { action, id, index } = actionTarget.dataset;
  if (action === "add-book") prepareBookForm();
  if (action === "edit-book") prepareBookForm(bookById(id));
  if (action === "save-new") saveSuggestedBook(newBooks[Number(index)]);
  if (action === "recommendation") saveSuggestedBook(recommendationPool[Number(index)]);
  if (action === "edit-review") prepareReviewForm(state.reviews.find(review => review.id === id));
  if (action === "delete-review") deleteReview(id);
  if (action === "show-spoiler") {
    actionTarget.parentElement.hidden = true;
    $(`#spoiler-${id}`).hidden = false;
  }
  if (action === "mood-save") {
    const book = [...recommendationPool, ...newBooks].find(item => item.title === actionTarget.dataset.title);
    if (book) saveSuggestedBook(book);
  }
}

$$(".nav-link").forEach(button => button.addEventListener("click", () => openView(button.dataset.view)));
$("#open-add-book").addEventListener("click", () => prepareBookForm());
$("#library-add-book").addEventListener("click", () => prepareBookForm());
$("#hero-add-record").addEventListener("click", () => prepareRecordForm());
$("#journal-add-record").addEventListener("click", () => prepareRecordForm());
$("#open-review").addEventListener("click", () => prepareReviewForm());
$("#open-mood").addEventListener("click", () => openModal("mood-modal"));
$$("[data-close-modal]").forEach(button => button.addEventListener("click", closeModal));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && $("#modal-layer").classList.contains("open")) closeModal();
});
document.addEventListener("click", event => handleAction(event.target));

$("#book-form").addEventListener("submit", saveBook);
$("#record-form").addEventListener("submit", saveRecord);
$("#review-form").addEventListener("submit", saveReview);
$("#delete-book").addEventListener("click", deleteCurrentBook);
$("#book-status").addEventListener("change", updateProgressField);
$("#review-sort").addEventListener("change", renderReviews);
$("#library-search").addEventListener("input", renderLibrary);
$("#library-filters").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  currentFilter = button.dataset.filter;
  $$("#library-filters button").forEach(item => item.classList.toggle("active", item === button));
  renderLibrary();
});
$("#refresh-recommendations").addEventListener("click", () => {
  recommendationOffset = (recommendationOffset + 3) % recommendationPool.length;
  renderRecommendations();
});
$("#duplicate-form").addEventListener("submit", event => {
  event.preventDefault();
  const query = $("#duplicate-query").value.trim();
  const match = state.books.find(book => {
    const target = normalize(query);
    return normalize(book.title).includes(target) || (book.isbn && normalize(book.isbn) === target);
  });
  const result = $("#duplicate-result");
  result.classList.toggle("found", Boolean(match));
  result.innerHTML = match
    ? `本棚にあります：『${escapeHtml(match.title)}』 / ${STATUS_LABELS[match.status]}`
    : "同じ本は見つかりませんでした。購入候補に追加できます。";
});
$("#mood-options").addEventListener("click", event => {
  const button = event.target.closest("[data-mood]");
  if (button) showMoodResult(button.dataset.mood);
});

const initialView = ["home", "library", "journal", "reviews"].includes(location.hash.slice(1))
  ? location.hash.slice(1)
  : "home";
renderAll();
openView(initialView);
