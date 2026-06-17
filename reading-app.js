const STORAGE_KEY = "yohaku-reading-app-v1";
const AUTH_SESSION_KEY = "yohaku-reading-auth-session-v1";
const JOURNAL_AVERAGE_KEY = "yohaku-show-average-rating";
const CATALOG_VERSION = "2026-06-demo";
const LOCAL_CATALOG_INDEX = "./data/books/catalog-index.json?v=20260617-3";
const LOCAL_CATALOG_FALLBACK = "./data/books/japanese-fiction.json?v=20260617-3";
let BOOK_CATALOG = [];
let activeView = "";
let remoteSyncReady = false;
let remoteSyncTimer = null;
let authSession = loadAuthSession();

const STATUS_LABELS = {
  owned: "所有・未読",
  reading: "読書中",
  read: "読了",
  wishlist: "あとで読みたい"
};

const CATEGORY_LABELS = {
  "general-fiction": "一般文芸",
  "literary-fiction": "文学",
  mystery: "ミステリ",
  "modern-classics": "近代文学",
  "world-classics": "海外文学",
  "science-fiction": "SF",
  fantasy: "幻想文学"
};

const COLORS = ["#dbe1e6", "#d2d9e1", "#c9d1dc", "#dddde5", "#cfd9dc", "#e0e3e6"];

const newBooks = [
  {
    title: "ファイア・ドーム 上",
    author: "辻村深月",
    genre: "小説",
    date: "2026-06-05",
    tone: "緊張 物語",
    description: "2026年6月刊行の単行本。大きな物語をゆっくり追いたい日に。",
    color: "#d5dce1"
  },
  {
    title: "わたしを庇わないで",
    author: "石田夏穂",
    genre: "小説",
    date: "2026-06-05",
    tone: "現代 鋭い",
    description: "2026年6月刊行の単行本。言葉の角度が気になる人へ。",
    color: "#c8d2dc"
  },
  {
    title: "怪談小説という名の小説怪談",
    author: "澤村伊智",
    genre: "ホラー",
    date: "2026-06-16",
    tone: "不穏 怪談",
    description: "角川ホラー文庫の6月新刊。静かな怖さを読みたい夜に。",
    color: "#cfd0dc"
  },
  {
    title: "三鬼",
    author: "小林恭二",
    genre: "小説",
    date: "2026-06-25",
    tone: "文学 余韻",
    description: "講談社の6月文芸単行本。少し重心の低い小説を探す日に。",
    color: "#d8dee2"
  }
];

const recommendationPool = [
  {
    title: "イン・ザ・メガチャーチ",
    author: "朝井リョウ",
    genre: "小説",
    tone: "現代 鋭い",
    reason: "2026年本屋大賞。いま読む空気の強さがあります。",
    color: "#d9e1e6"
  },
  {
    title: "地雷グリコ",
    author: "青崎有吾",
    genre: "ミステリー",
    tone: "知的 鋭い",
    reason: "文庫化でも手に取りやすい、遊び心のある頭脳戦。",
    color: "#cbd4dc"
  },
  {
    title: "777 トリプルセブン",
    author: "伊坂幸太郎",
    genre: "小説",
    tone: "軽やか 不穏",
    reason: "伊坂幸太郎の疾走感を、読書記録の外側から一冊。",
    color: "#dde3e6"
  },
  {
    title: "かたばみ",
    author: "木内昇",
    genre: "小説",
    tone: "家族 静か",
    reason: "文庫化で手に取りやすい、時間の厚みが残る家族小説。",
    color: "#c5ced8"
  },
  {
    title: "旅の短篇集 春夏",
    author: "原田宗典",
    genre: "短編集",
    tone: "遠く 静か",
    reason: "2026年本屋大賞の超発掘本。少し前の本をいま読む余白。",
    color: "#d0d4df"
  },
  {
    title: "海霧 -ジリー",
    author: "馳星周",
    genre: "小説",
    tone: "重い 遠く",
    reason: "2026年6月刊行。荒さと静けさの両方が欲しいときに。",
    color: "#dadde4"
  }
];

function isoDate(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function seedState() {
  return {
    version: 2,
    books: [],
    records: [],
    reviews: [],
    activity: []
  };
}

function migrateState(saved) {
  const demoBookIds = new Set(["book-1", "book-2", "book-3", "book-4"]);
  const demoRecordIds = new Set(["record-1", "record-2"]);
  const demoReviewIds = new Set(["review-1"]);
  const books = (saved.books || []).filter(book => !demoBookIds.has(book.id));
  const records = (saved.records || []).filter(record => !demoRecordIds.has(record.id) && !demoBookIds.has(record.bookId));
  const reviews = (saved.reviews || []).filter(review => !demoReviewIds.has(review.id) && !demoBookIds.has(review.bookId));
  const activity = (saved.activity || []).filter(item => !/^activity-1$/.test(item.id));
  return { ...saved, version: 2, books, records, reviews, activity };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.books) && Array.isArray(saved.reviews)) return migrateState(saved);
  } catch (error) {
    console.warn("保存データを読み込めませんでした。", error);
  }
  return seedState();
}

function loadAuthSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(AUTH_SESSION_KEY));
    const now = Math.floor(Date.now() / 1000);
    if (saved?.access_token && saved?.expires_at && saved.expires_at > now) return saved;
  } catch (error) {
    console.warn("ログイン情報を読み込めませんでした。", error);
  }
  localStorage.removeItem(AUTH_SESSION_KEY);
  return null;
}

let state = loadState();
let currentFilter = "all";
let recommendationOffset = 0;
let catalogDiscoveryOffset = 0;
let modalInitialFormState = "";
let toastTimer;
let selectedMood = "";
let currentFortuneBook = null;
let fortuneTimer;
let showAverageRating = localStorage.getItem(JOURNAL_AVERAGE_KEY) === "true";

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  queueRemoteSync();
}

function supabaseConfig() {
  const config = window.YOHAKU_SUPABASE || {};
  return {
    enabled: Boolean(config.enabled),
    url: String(config.url || "").replace(/\/$/, ""),
    anonKey: config.anonKey || "",
    ownerId: config.ownerId || "personal-library",
    authRequired: config.authRequired !== false
  };
}

function hasSupabaseConfig() {
  const config = supabaseConfig();
  return config.enabled && config.url && config.anonKey;
}

function sessionUserId() {
  if (!authSession?.access_token) return "";
  try {
    const payload = JSON.parse(atob(authSession.access_token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.sub || authSession.user?.id || "";
  } catch {
    return authSession.user?.id || "";
  }
}

function activeOwnerId(config = supabaseConfig()) {
  return config.authRequired ? sessionUserId() : config.ownerId;
}

function syncHeaders(config, { allowAnon = false } = {}) {
  const token = authSession?.access_token || (allowAnon ? config.anonKey : "");
  return {
    apikey: config.anonKey,
    authorization: `Bearer ${token || config.anonKey}`,
    "content-type": "application/json"
  };
}

function setSyncStatus(message) {
  const status = $("#sync-status");
  if (status) status.textContent = message;
}

async function loadRemoteState() {
  if (!hasSupabaseConfig()) {
    setSyncStatus("この端末に保存されています");
    return null;
  }
  const config = supabaseConfig();
  const ownerId = activeOwnerId(config);
  if (config.authRequired && !ownerId) {
    remoteSyncReady = false;
    setSyncStatus("端末間の同期は未設定です");
    return null;
  }
  setSyncStatus("読書記録を同期しています");
  try {
    const endpoint = `${config.url}/rest/v1/yohaku_app_states?owner_id=eq.${encodeURIComponent(ownerId)}&select=state&limit=1`;
    const response = await fetch(endpoint, { headers: syncHeaders(config) });
    if (!response.ok) throw new Error(`Supabase read failed: ${response.status}`);
    const rows = await response.json();
    const remoteState = rows?.[0]?.state;
    if (remoteState && Array.isArray(remoteState.books) && Array.isArray(remoteState.records) && Array.isArray(remoteState.reviews)) {
      setSyncStatus("ほかの端末と同期されています");
      return remoteState;
    }
    remoteSyncReady = true;
    queueRemoteSync(80);
    setSyncStatus("端末間の同期を開始しました");
    return null;
  } catch (error) {
    console.warn("Supabaseから読み込めませんでした。ブラウザ内の保存を使います。", error);
    setSyncStatus("この端末には保存済みです");
    return null;
  }
}

async function persistStateRemote() {
  if (!hasSupabaseConfig() || !remoteSyncReady) return;
  const config = supabaseConfig();
  const ownerId = activeOwnerId(config);
  if (!ownerId) {
    setSyncStatus("端末間の同期は未設定です");
    return;
  }
  try {
    const endpoint = `${config.url}/rest/v1/yohaku_app_states?on_conflict=owner_id`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        ...syncHeaders(config),
        prefer: "resolution=merge-duplicates"
      },
      body: JSON.stringify({
        owner_id: ownerId,
        state,
        catalog_version: CATALOG_VERSION
      })
    });
    if (!response.ok) throw new Error(`Supabase write failed: ${response.status}`);
    setSyncStatus("ほかの端末と同期されています");
  } catch (error) {
    console.warn("Supabaseへ保存できませんでした。ブラウザ内には保存済みです。", error);
    setSyncStatus("この端末には保存済みです");
  }
}

function queueRemoteSync(delay = 450) {
  if (!hasSupabaseConfig() || !remoteSyncReady) return;
  clearTimeout(remoteSyncTimer);
  remoteSyncTimer = setTimeout(persistStateRemote, delay);
}

async function loadCatalogFromSupabase() {
  if (!hasSupabaseConfig()) return false;
  const config = supabaseConfig();
  try {
    const endpoint = `${config.url}/rest/v1/yohaku_books?select=*&order=id.asc`;
    const response = await fetch(endpoint, { headers: syncHeaders(config, { allowAnon: true }) });
    if (!response.ok) throw new Error(`Supabase catalog read failed: ${response.status}`);
    const rows = await response.json();
    if (!Array.isArray(rows) || !rows.length) return false;
    BOOK_CATALOG = rows.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      authorKana: book.author_kana || "",
      category: book.category || "general-fiction",
      publishedYear: book.published_year || "",
      publisher: book.publisher || "",
      tones: Array.isArray(book.tones) ? book.tones : []
    }));
    return true;
  } catch (error) {
    console.warn("Supabaseの本カタログを読み込めませんでした。同梱カタログを使います。", error);
    return false;
  }
}

function parseAuthCallback() {
  if (!location.hash.includes("access_token=")) return;
  const params = new URLSearchParams(location.hash.slice(1));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const expiresIn = Number(params.get("expires_in")) || 3600;
  if (!accessToken) return;
  authSession = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: Math.floor(Date.now() / 1000) + expiresIn - 60
  };
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(authSession));
  history.replaceState({ view: "home" }, "", "#home");
  showToast("ログインしました。DB同期を開始します。");
}

async function requestMagicLink(event) {
  event.preventDefault();
  const config = supabaseConfig();
  if (!hasSupabaseConfig()) {
    showToast("端末間の同期は現在準備中です。この端末には保存されています。");
    return;
  }
  const email = $("#auth-email").value.trim();
  try {
    const response = await fetch(`${config.url}/auth/v1/otp`, {
      method: "POST",
      headers: syncHeaders(config, { allowAnon: true }),
      body: JSON.stringify({
        email,
        create_user: true,
        options: {
          email_redirect_to: `${location.origin}${location.pathname}#home`
        }
      })
    });
    if (!response.ok) throw new Error(`Auth request failed: ${response.status}`);
    showToast("ログインリンクを送りました。メールを確認してください。");
  } catch (error) {
    console.warn("ログインリンクを送れませんでした。", error);
    showToast("ログインリンクを送れませんでした。設定を確認してください。");
  }
}

async function signOut() {
  const config = supabaseConfig();
  if (hasSupabaseConfig() && authSession?.access_token) {
    fetch(`${config.url}/auth/v1/logout`, {
      method: "POST",
      headers: syncHeaders(config)
    }).catch(error => console.warn("ログアウト通知に失敗しました。", error));
  }
  authSession = null;
  remoteSyncReady = false;
  localStorage.removeItem(AUTH_SESSION_KEY);
  setSyncStatus(hasSupabaseConfig() ? "端末間の同期は未設定です" : "この端末に保存されています");
  updateAuthUi();
  closeModal(true);
  showToast("ログアウトしました。");
}

function updateAuthUi() {
  const buttons = $$('[data-open-auth]');
  const signout = $("#auth-signout");
  if (!buttons.length) return;
  if (!hasSupabaseConfig()) {
    buttons.forEach(button => {
      if (button.classList.contains("auth-button")) button.textContent = "端末間で同期";
    });
    if (signout) signout.hidden = true;
    return;
  }
  const loggedIn = Boolean(activeOwnerId());
  buttons.forEach(button => {
    if (button.classList.contains("auth-button")) button.textContent = loggedIn ? "同期中" : "端末間で同期";
  });
  if (signout) signout.hidden = !loggedIn;
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function monthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function stableHash(value = "") {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x7feb352d);
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x846ca68b);
  return (hash ^ (hash >>> 16)) >>> 0;
}

function monthlyOrder(items, offset = 0) {
  const ordered = [...items].sort((a, b) => {
    const aKey = a.id || `${a.title}-${a.author}`;
    const bKey = b.id || `${b.title}-${b.author}`;
    return stableHash(`${monthKey()}-${aKey}`) - stableHash(`${monthKey()}-${bKey}`);
  });
  if (!ordered.length) return [];
  const shift = offset % ordered.length;
  return [...ordered.slice(shift), ...ordered.slice(0, shift)];
}

function monthlyCatalogBooks(limit = 8) {
  const unread = BOOK_CATALOG.filter(book => {
    const libraryBook = findDuplicateByTitleAuthor(book.title, book.author);
    return libraryBook?.status !== "read" || libraryBook?.readMarkedFromShortcut;
  });
  const source = unread.length >= limit ? unread : BOOK_CATALOG;
  return monthlyOrder(source, catalogDiscoveryOffset).slice(0, limit);
}

function distinctAuthors(items, limit) {
  const authors = new Set();
  const selected = [];
  for (const item of items) {
    const author = normalize(item.author);
    if (!author || authors.has(author)) continue;
    authors.add(author);
    selected.push(item);
    if (selected.length === limit) break;
  }
  return selected;
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
  return toHiragana(String(value).normalize("NFKC").toLowerCase())
    .replace(/[ーｰ]/g, "")
    .replace(/[^\p{Letter}\p{Number}]/gu, "");
}

function toHiragana(value = "") {
  return value.replace(/[ァ-ン]/g, char =>
    String.fromCharCode(char.charCodeAt(0) - 0x60)
  );
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
  if (!value) return "評価なし";
  return `${"★".repeat(value)}${"☆".repeat(5 - value)}`;
}

function bookById(id) {
  return state.books.find(book => book.id === id);
}

function catalogById(id) {
  return BOOK_CATALOG.find(book => book.id === id);
}

function enrichBookFromCatalog(book) {
  const catalog = book.catalogId ? catalogById(book.catalogId) : null;
  return catalog ? { ...catalog, ...book } : book;
}

function searchableText(book) {
  return normalize([
    book.title,
    book.author,
    book.authorKana,
    book.isbn,
    book.isbn13,
    book.publisher,
    book.category,
    ...(book.tones || [])
  ].filter(Boolean).join(" "));
}

function catalogIdentity(book) {
  return normalize(`${book.title || ""}${book.author || ""}`) || normalize(book.id || "");
}

function editDistance(a, b) {
  if (!a || !b) return Math.max(a.length, b.length);
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[b.length];
}

function fuzzyFieldScore(query, value, weight) {
  const normalizedValue = normalize(value);
  if (!query || !normalizedValue) return 0;
  if (normalizedValue === query) return weight;
  if (normalizedValue.startsWith(query)) return Math.round(weight * 0.82);
  if (normalizedValue.includes(query)) return Math.round(weight * 0.66);
  if (query.includes(normalizedValue) && normalizedValue.length >= 2) return Math.round(weight * 0.5);
  const distance = editDistance(query, normalizedValue);
  const ratio = 1 - distance / Math.max(query.length, normalizedValue.length);
  return ratio >= 0.58 ? Math.round(weight * ratio * 0.56) : 0;
}

function fuzzyTitleAuthorScore(query, book) {
  const normalizedQuery = normalize(query);
  const title = normalize(book.title);
  const author = normalize(book.author);
  const authorKana = normalize(book.authorKana);
  const combined = normalize(`${book.title || ""}${book.author || ""}`);
  let score = fuzzyFieldScore(normalizedQuery, title, 160)
    + fuzzyFieldScore(normalizedQuery, author, 128)
    + fuzzyFieldScore(normalizedQuery, authorKana, 118)
    + fuzzyFieldScore(normalizedQuery, combined, 72);
  String(query).trim().split(/\s+/).map(normalize).filter(Boolean).forEach(term => {
    score += fuzzyFieldScore(term, title, 76);
    score += fuzzyFieldScore(term, author, 64);
    score += fuzzyFieldScore(term, authorKana, 56);
  });
  return score;
}

function searchBooks(query, { limit = 8, includeUserBooks = true } = {}) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];
  const terms = String(query).trim().split(/\s+/).map(normalize).filter(Boolean);
  const sources = [
    ...BOOK_CATALOG.map(book => ({ ...book, source: "catalog" })),
    ...(includeUserBooks ? state.books.map(book => ({ ...enrichBookFromCatalog(book), source: "library" })) : [])
  ];
  const unique = new Map();
  sources.forEach(book => {
    const key = book.catalogId || catalogIdentity(book);
    if (!unique.has(key) || book.source === "library") unique.set(key, book);
  });
  return [...unique.values()]
    .map(book => {
      const haystack = searchableText(book);
      let score = fuzzyTitleAuthorScore(query, book);
      if (book.isbn && normalize(book.isbn) === normalizedQuery) score += 90;
      if (book.isbn13 && normalize(book.isbn13) === normalizedQuery) score += 90;
      if (terms.length > 1 && terms.every(term => haystack.includes(term))) score += 44;
      if (score === 0 && haystack.includes(normalizedQuery)) score += 22;
      return { ...book, score };
    })
    .filter(book => normalizedQuery.length <= 1 ? book.score > 0 : book.score >= 40)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "ja"))
    .slice(0, limit);
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

function openView(viewName, { replace = false } = {}) {
  const validView = ["home", "library", "journal", "reviews"].includes(viewName) ? viewName : "home";
  const nextHash = `#${validView}`;
  $$(".app-view").forEach(view => view.classList.toggle("active", view.id === `view-${validView}`));
  $$(".site-header .nav-link").forEach(button => button.classList.toggle("active", button.dataset.view === validView));
  if (activeView !== validView) window.scrollTo({ top: 0, behavior: "smooth" });
  activeView = validView;
  if (location.hash !== nextHash || replace) {
    const method = replace ? "replaceState" : "pushState";
    history[method]({ view: validView }, "", nextHash);
  }
}

function showViewFromHistory(viewName) {
  const validView = ["home", "library", "journal", "reviews"].includes(viewName) ? viewName : "home";
  $$(".app-view").forEach(view => view.classList.toggle("active", view.id === `view-${validView}`));
  $$(".site-header .nav-link").forEach(button => button.classList.toggle("active", button.dataset.view === validView));
  activeView = validView;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openModal(id) {
  const layer = $("#modal-layer");
  layer.classList.add("open");
  layer.setAttribute("aria-hidden", "false");
  $$(".modal").forEach(modal => modal.classList.toggle("active", modal.id === id));
  document.body.classList.add("modal-open");
  modalInitialFormState = serializeActiveModalForm();
  setTimeout(() => $(`#${id} input:not([type="hidden"]), #${id} select`)?.focus(), 80);
}

function serializeActiveModalForm() {
  const form = $(".modal.active form");
  if (!form || form.id === "auth-form") return "";
  return JSON.stringify([...form.elements]
    .filter(field => field.name !== "" || field.id)
    .map(field => [field.id || field.name, field.type === "checkbox" ? field.checked : field.value]));
}

function refreshModalInitialState() {
  modalInitialFormState = serializeActiveModalForm();
}

function closeModal(force = false) {
  const currentFormState = serializeActiveModalForm();
  if (!force && modalInitialFormState && currentFormState !== modalInitialFormState) {
    if (!window.confirm("入力した内容を破棄して閉じますか？")) return false;
  }
  clearTimeout(fortuneTimer);
  $("#modal-layer").classList.remove("open");
  $("#modal-layer").setAttribute("aria-hidden", "true");
  $$(".modal").forEach(modal => modal.classList.remove("active"));
  document.body.classList.remove("modal-open");
  modalInitialFormState = "";
  return true;
}

function bookOptions(selected = "") {
  return state.books
    .map(book => {
      const enriched = enrichBookFromCatalog(book);
      return `<option value="${book.id}" ${book.id === selected ? "selected" : ""}>${escapeHtml(enriched.title)} — ${escapeHtml(enriched.author)}</option>`;
    })
    .join("");
}

function renderHome() {
  const recordCount = state.records.length;
  $("#hero-read-count").textContent = recordCount;
  $("#hero-record-label").textContent = "件の記録が、ここに残っています";

  const latestRecord = [...state.records].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const latestBook = latestRecord && bookById(latestRecord.bookId);
  const latestEnriched = latestBook ? enrichBookFromCatalog(latestBook) : null;
  $("#last-note-content").innerHTML = latestRecord ? `
    <h2>『${escapeHtml(latestEnriched?.title || "削除された本")}』</h2>
    <p>${escapeHtml(latestEnriched?.author || "")}</p>
    <small>${formatDate(latestRecord.date)} / ${STATUS_LABELS[latestRecord.status] || "記録"}</small>
    <button class="text-button" data-action="view-journal">これまでの記録を見る</button>
  ` : `
    <div class="empty-copy"><h2>まだ記録はありません。</h2><p>読み終えた本を一冊入れると、ここに最近の記録が出ます。</p></div>
  `;

  renderRecommendations();
  renderCatalogResults($("#catalog-search")?.value || "");
  $("#new-book-list").innerHTML = newBooks.map((book, index) => {
    const owned = findDuplicate(book.title);
    return `
      <article class="new-item">
        <div class="new-cover" style="--cover:${book.color}"></div>
        <div><h3>${escapeHtml(book.title)}</h3><span>${formatDate(book.date)} 発売 / ${escapeHtml(book.author)}</span></div>
        <p>${escapeHtml(book.description)}</p>
        <button data-action="save-new" data-index="${index}">${shelfShortcutLabel(owned, "気になる本へ ＋")}</button>
      </article>
    `;
  }).join("");
}

function renderCatalogResults(query = "") {
  const results = query ? searchBooks(query, { limit: 10 }) : monthlyCatalogBooks(8);
  $("#catalog-section-title").textContent = `${new Date().getMonth() + 1}月にひらく棚`;
  $("#catalog-discovery-title").textContent = query ? "検索結果" : "今月の八冊";
  $("#catalog-discovery-description").textContent = query
    ? `「${query}」に近いタイトルと著者を表示しています。`
    : "この棚は毎月入れ替わります。";
  $("#refresh-catalog-discovery").hidden = Boolean(query);
  $("#catalog-results").innerHTML = results.length ? results.map(book => {
    const isLibraryResult = book.source === "library";
    const owned = isLibraryResult ? bookById(book.id) : findDuplicateByTitleAuthor(book.title, book.author);
    return `
      <article class="catalog-item">
        <button class="catalog-book-main" data-action="open-catalog-detail" data-id="${book.id}">
          <h3>${escapeHtml(book.title)}</h3>
          <span>${escapeHtml(book.author)} / ${escapeHtml(CATEGORY_LABELS[book.category] || book.category || "小説")}${book.publishedYear ? ` / ${book.publishedYear}` : ""}</span>
        </button>
        <div class="catalog-actions">
          <button data-action="${isLibraryResult ? "record-library" : "record-catalog"}" data-id="${book.id}">記録をつける</button>
          <button data-action="${isLibraryResult ? canUndoShelfAdd(owned) ? "cancel-library-shortcut" : "open-library" : "save-catalog"}" data-id="${book.id}" ${owned && !canUndoShelfAdd(owned) ? "aria-label=\"本棚にある本を開く\"" : ""}>${shelfShortcutLabel(owned)}</button>
          <button class="subtle-check ${owned?.status === "read" ? "checked" : ""} ${owned?.readMarkedFromShortcut ? "undoable" : ""}" data-action="mark-catalog-read" data-id="${book.id}">${readShortcutLabel(owned)}</button>
        </div>
      </article>
    `;
  }).join("") : `<div class="empty-state compact-empty"><h2>近い本は見つかりませんでした。</h2><p>タイトルと作者を少し短くして探してください。</p></div>`;
}

function renderRecommendations() {
  const ordered = monthlyOrder(recommendationPool.filter(book => normalize(book.author) !== normalize("村上春樹")), recommendationOffset);
  const recommendations = distinctAuthors(ordered, 3);
  $("#recommendation-list").innerHTML = recommendations.map((book, index) => {
    const owned = findDuplicate(book.title);
    return `
      <article class="book-card">
        <button class="book-card-main" data-action="recommendation" data-index="${recommendationPool.indexOf(book)}">
          <div class="book-cover" style="--cover:${book.color}">
          ${owned ? `<span class="owned-mark">${canUndoShelfAdd(owned) ? "本棚登録を取り消せます" : "IN YOUR SHELF"}</span>` : ""}
            <strong>${escapeHtml(book.title)}</strong>
          </div>
          <p>0${index + 1} / ${escapeHtml(book.genre.toUpperCase())}</p>
          <h3>${escapeHtml(book.title)}</h3>
          <span>${escapeHtml(book.author)}</span>
          <small class="reason">${escapeHtml(book.reason)}</small>
        </button>
        <button class="recommend-read-check ${owned?.status === "read" ? "checked" : ""} ${owned?.readMarkedFromShortcut ? "undoable" : ""}" data-action="mark-recommendation-read" data-index="${recommendationPool.indexOf(book)}">
          ${readShortcutLabel(owned)}
        </button>
      </article>
    `;
  }).join("");
}

function openCatalogDetail(book) {
  if (!book) return;
  const libraryBook = book.source === "library" ? bookById(book.id) : null;
  const sourceBook = libraryBook ? enrichBookFromCatalog(libraryBook) : book;
  const owned = libraryBook || findDuplicateByTitleAuthor(sourceBook.title, sourceBook.author);
  const category = CATEGORY_LABELS[sourceBook.category] || sourceBook.category || "小説";
  $("#catalog-detail-content").innerHTML = `
    <div class="catalog-detail-heading">
      <span>${escapeHtml(category)}${sourceBook.publishedYear ? ` / ${sourceBook.publishedYear}` : ""}</span>
      <h2 id="catalog-detail-title">${escapeHtml(sourceBook.title)}</h2>
      <p>${escapeHtml(sourceBook.author)}</p>
    </div>
    <div class="catalog-detail-actions" aria-label="この本ですること">
      <button data-action="detail-record" data-id="${sourceBook.id}">
        <small>読書記録</small><strong>記録をつける</strong><span>読み終えた日や感想を残す</span>
      </button>
      <button data-action="detail-wishlist" data-id="${sourceBook.id}">
        <small>読みたい本</small><strong>${shelfShortcutLabel(owned, "本棚に入れる")}</strong><span>${canUndoShelfAdd(owned) ? "ワンタッチで追加した登録を戻す" : owned ? "本棚の登録内容を確認する" : "あとで読む本として覚えておく"}</span>
      </button>
      <button data-action="detail-read" data-id="${sourceBook.id}">
        <small>読了</small><strong>${owned?.readMarkedFromShortcut ? "読了を取り消す" : owned?.status === "read" ? "読了済み ✓" : "読んだ本にする"}</strong><span>感想は後から追加できます</span>
      </button>
    </div>
  `;
  openModal("catalog-detail-modal");
}

function findDuplicate(query, excludeId = "") {
  const target = normalize(query);
  if (!target) return null;
  return state.books.find(book => {
    if (book.id === excludeId) return false;
    const enriched = enrichBookFromCatalog(book);
    return normalize(enriched.title) === target
      || normalize(`${enriched.title}${enriched.author}`).includes(target)
      || (enriched.isbn && normalize(enriched.isbn) === target)
      || (enriched.isbn13 && normalize(enriched.isbn13) === target);
  }) || null;
}

function findDuplicateByTitleAuthor(title, author = "", excludeId = "") {
  const normalizedTitle = normalize(title);
  const normalizedAuthor = normalize(author);
  const exact = state.books.find(book => {
    if (book.id === excludeId) return false;
    const enriched = enrichBookFromCatalog(book);
    return normalize(enriched.title) === normalizedTitle
      && (!normalizedAuthor || normalize(enriched.author) === normalizedAuthor);
  });
  if (exact) return exact;
  const candidates = state.books
    .filter(book => book.id !== excludeId)
    .map(book => ({ book, score: fuzzyTitleAuthorScore(`${title} ${author}`.trim(), enrichBookFromCatalog(book)) }))
    .sort((a, b) => b.score - a.score);
  return candidates[0]?.score >= 118 ? candidates[0].book : findDuplicate(title, excludeId);
}

function hasSavedBookHistory(bookId) {
  return state.records.some(record => record.bookId === bookId)
    || state.reviews.some(review => review.bookId === bookId);
}

function canUndoShelfAdd(book) {
  return Boolean(book?.addedFromShortcut && !hasSavedBookHistory(book.id));
}

function shelfShortcutLabel(book, emptyLabel = "読みたい本へ") {
  if (!book) return emptyLabel;
  if (canUndoShelfAdd(book)) return "本棚登録を取り消す";
  return `${STATUS_LABELS[book.status]} ✓`;
}

function readShortcutLabel(book) {
  if (book?.readMarkedFromShortcut) return "読了を取り消す";
  if (book?.status === "read") return "読了済み ✓";
  return "読んだことがある";
}

function findBestLibraryMatch(query, excludeId = "") {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return null;
  const direct = state.books.find(book => {
    if (book.id === excludeId) return false;
    const enriched = enrichBookFromCatalog(book);
    return searchableText(enriched).includes(normalizedQuery);
  });
  if (direct) return direct;
  const candidates = state.books
    .filter(book => book.id !== excludeId)
    .map(book => {
      const enriched = enrichBookFromCatalog(book);
      return {
        book,
        score: fuzzyTitleAuthorScore(query, enriched)
      };
    })
    .sort((a, b) => b.score - a.score);
  return candidates[0]?.score >= 92 ? candidates[0].book : null;
}

function renderLibrary() {
  const query = normalize($("#library-search")?.value);
  const filtered = state.books.filter(book => {
    const enriched = enrichBookFromCatalog(book);
    const matchesFilter = currentFilter === "all" || book.status === currentFilter;
    const haystack = searchableText(enriched);
    return matchesFilter && (!query || haystack.includes(query));
  });
  const counts = Object.fromEntries(Object.keys(STATUS_LABELS).map(status => [status, state.books.filter(book => book.status === status).length]));
  $("#library-summary").innerHTML = `
    <span><b>${state.books.length}</b>冊</span>
    <span><b>${counts.read}</b>読了</span>
    <span><b>${counts.reading}</b>読書中</span>
    <span><b>${counts.wishlist}</b>読みたい</span>
  `;
  $("#library-list").innerHTML = filtered.map(book => {
    const enriched = enrichBookFromCatalog(book);
    const primaryAction = book.status === "wishlist"
      ? "所有にする"
      : book.status === "read"
        ? "再読を記録"
        : "読了を記録";
    return `
    <article class="shelf-card">
      <div class="shelf-cover" style="--cover:${book.color || COLORS[0]}">
        <span class="status-tag">${STATUS_LABELS[book.status]}</span>
        <strong>${escapeHtml(enriched.title)}</strong>
      </div>
      <h2>${escapeHtml(enriched.title)}</h2>
      <p>${escapeHtml(enriched.author)} / ${escapeHtml(CATEGORY_LABELS[enriched.category] || enriched.genre || "小説")}</p>
      <small>${enriched.isbn13 || enriched.isbn ? `ISBN ${escapeHtml(enriched.isbn13 || enriched.isbn)}` : escapeHtml(book.tone || "メモはまだありません")}</small>
      <div class="shelf-actions">
        <button data-action="quick-status" data-id="${book.id}">${primaryAction}</button>
        ${book.status !== "wishlist" ? `<button data-action="mark-wishlist" data-id="${book.id}">読みたいへ戻す</button>` : ""}
        <button data-action="edit-book" data-id="${book.id}">情報を編集</button>
      </div>
    </article>
  `;
  }).join("");
  $("#library-empty").hidden = filtered.length > 0;
}

function renderJournal() {
  const records = [...state.records].sort((a, b) => new Date(b.date) - new Date(a.date));
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthly = records.filter(record => record.date.startsWith(thisMonth)).length;
  const ratings = records.map(record => Number(record.rating)).filter(Boolean);
  const average = ratings.length ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1) : "—";
  $("#journal-overview").classList.toggle("show-average", showAverageRating);
  $("#journal-overview").innerHTML = `
    <article class="metric"><span>ALL RECORDS</span><strong>${records.length}<small>件の記録</small></strong></article>
    <article class="metric"><span>THIS MONTH</span><strong>${monthly}<small>冊を記録</small></strong></article>
    ${showAverageRating ? `<article class="metric"><span>AVERAGE</span><strong>${average}<small>/ 5</small></strong></article>` : ""}
  `;
  $("#toggle-average-rating").textContent = showAverageRating ? "平均評価を隠す" : "平均評価も表示";
  $("#journal-timeline").innerHTML = records.length ? records.map(record => {
    const book = bookById(record.bookId);
    const enriched = book ? enrichBookFromCatalog(book) : null;
    return `
      <article class="timeline-item">
        <time class="timeline-date">${formatDate(record.date)}</time>
        <div class="timeline-copy">
          <h3>${escapeHtml(enriched?.title || "削除された本")}</h3>
          <span>${escapeHtml(enriched?.author || "")} / ${STATUS_LABELS[record.status] || "記録"}</span>
          ${record.note ? `<blockquote>「${escapeHtml(record.note)}」</blockquote>` : ""}
          <div class="stars">${stars(record.rating)}　${escapeHtml(record.tone || "")}</div>
          <div class="timeline-actions">
            <button class="text-button" data-action="edit-record" data-id="${record.id}">記録を編集</button>
            <button class="text-button danger-link" data-action="delete-record" data-id="${record.id}">削除</button>
          </div>
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
    const enriched = book ? enrichBookFromCatalog(book) : null;
    const content = `
      <h3>${escapeHtml(review.heading)}</h3>
      <p>${escapeHtml(review.body)}</p>
    `;
    return `
      <article class="review-item">
        <div class="review-top">
          <div class="review-book">
            <h2>${escapeHtml(enriched?.title || "削除された本")}</h2>
            <span>${escapeHtml(enriched?.author || "")}</span>
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
  const author = $("#book-author").value.trim();
  const isbn = $("#book-isbn").value.trim();
  const duplicate = isbn ? findDuplicate(isbn, id) : findDuplicateByTitleAuthor(title, author, id);
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
    author,
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
  closeModal(true);
  renderAll();
  showToast(existing ? "本の情報を更新しました。" : "本棚に一冊追加しました。");
}

function addBookFromCatalog(catalogBook, status = "wishlist") {
  const duplicate = findDuplicateByTitleAuthor(catalogBook.title, catalogBook.author);
  if (duplicate) return duplicate;
  const book = {
    id: uid("book"),
    catalogId: catalogBook.id,
    title: catalogBook.title,
    author: catalogBook.author,
    genre: "小説",
    isbn: catalogBook.isbn13 || "",
    status,
    pages: 0,
    progress: 0,
    tone: "",
    color: COLORS[state.books.length % COLORS.length],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  state.books.unshift(book);
  addActivity("book-created", `『${book.title}』を本棚に追加`);
  return book;
}

function findOrCreateBookFromRecord({ title, author, catalogId, status }) {
  const selectedBook = bookById($("#record-book-id").value);
  if (selectedBook) return selectedBook;
  const catalogBook = catalogId ? catalogById(catalogId) : null;
  const duplicate = findDuplicateByTitleAuthor(catalogBook?.title || title, catalogBook?.author || author);
  if (duplicate) return duplicate;
  if (catalogBook) return addBookFromCatalog(catalogBook, status);
  const book = {
    id: uid("book"),
    title,
    author,
    genre: "小説",
    isbn: "",
    status,
    pages: 0,
    progress: 0,
    tone: "",
    color: COLORS[state.books.length % COLORS.length],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  state.books.unshift(book);
  addActivity("book-created", `『${book.title}』を本棚に追加`);
  return book;
}

function deleteCurrentBook() {
  const id = $("#book-id").value;
  const book = bookById(id);
  if (!book) return;
  if (!window.confirm(`『${book.title}』を本棚から削除しますか？ 読書記録とレビューは履歴として残ります。`)) return;
  state.books = state.books.filter(item => item.id !== id);
  addActivity("book-deleted", `『${book.title}』を本棚から削除`);
  saveState();
  closeModal(true);
  renderAll();
  showToast("本棚から削除しました。記録の履歴は残っています。");
}

function prepareRecordForm(bookId = "", record = null) {
  $("#record-form").reset();
  const book = record ? bookById(record.bookId) : bookById(bookId);
  const enriched = book ? enrichBookFromCatalog(book) : null;
  $("#record-id").value = record?.id || "";
  $("#record-book-id").value = book?.id || "";
  $("#record-catalog-id").value = book?.catalogId || "";
  $("#record-title").value = enriched?.title || "";
  $("#record-author").value = enriched?.author || "";
  $("#record-date").value = record?.date || isoDate();
  $("#record-status").value = record?.status || "read";
  $("#record-rating").value = record?.rating ? String(record.rating) : "";
  $("#record-tone").value = record?.tone || "";
  $("#record-note").value = record?.note || "";
  $("#record-modal-title").textContent = record ? "読書記録を編集する" : "読書の記録を残す";
  $("#delete-record").hidden = !record;
  openModal("record-modal");
}

function prepareRecordFromCatalog(catalogBook) {
  prepareRecordForm();
  $("#record-catalog-id").value = catalogBook.id;
  $("#record-title").value = catalogBook.title;
  $("#record-author").value = catalogBook.author;
  refreshModalInitialState();
}

function saveRecord(event) {
  event.preventDefault();
  const title = $("#record-title").value.trim();
  const author = $("#record-author").value.trim();
  const status = $("#record-status").value;
  const existingRecordId = $("#record-id").value;
  const book = findOrCreateBookFromRecord({
    title,
    author,
    catalogId: $("#record-catalog-id").value,
    status
  });
  const record = {
    id: existingRecordId || uid("record"),
    bookId: book.id,
    date: $("#record-date").value,
    status,
    rating: Number($("#record-rating").value),
    tone: $("#record-tone").value.trim(),
    note: $("#record-note").value.trim(),
    createdAt: state.records.find(item => item.id === existingRecordId)?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (existingRecordId) {
    state.records[state.records.findIndex(item => item.id === existingRecordId)] = record;
  } else {
    state.records.unshift(record);
  }
  book.status = status;
  delete book.addedFromShortcut;
  delete book.readMarkedFromShortcut;
  delete book.shortcutPreviousStatus;
  if (!book.author && author) book.author = author;
  if (status === "read" && book.pages) book.progress = book.pages;
  book.updatedAt = new Date().toISOString();
  addActivity(existingRecordId ? "record-updated" : "record-created", `『${book.title}』の読書記録を保存`);
  saveState();
  closeModal(true);
  renderAll();
  showToast(existingRecordId ? "読書記録を更新しました。" : "読書記録を保存しました。");
}

function deleteRecord(id = $("#record-id").value) {
  const record = state.records.find(item => item.id === id);
  if (!record) return;
  const book = bookById(record.bookId);
  const enriched = book ? enrichBookFromCatalog(book) : null;
  const label = enriched?.title ? `『${enriched.title}』の記録` : "この記録";
  if (!window.confirm(`${label}を削除しますか？ 本棚に登録した本そのものは残ります。`)) return;
  state.records = state.records.filter(item => item.id !== id);
  addActivity("record-deleted", `${label}を削除`);
  saveState();
  closeModal(true);
  renderAll();
  showToast("読書記録を削除しました。");
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
  if (book) {
    delete book.addedFromShortcut;
    delete book.readMarkedFromShortcut;
    delete book.shortcutPreviousStatus;
  }
  if (existing) {
    state.reviews[state.reviews.findIndex(item => item.id === id)] = review;
    addActivity("review-updated", `『${book?.title || "本"}』のレビューを編集`);
  } else {
    state.reviews.unshift(review);
    addActivity("review-created", `『${book?.title || "本"}』のレビューを投稿`);
  }
  saveState();
  closeModal(true);
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
  const duplicate = findDuplicateByTitleAuthor(book.title, book.author);
  if (duplicate) {
    if (canUndoShelfAdd(duplicate)) {
      state.books = state.books.filter(item => item.id !== duplicate.id);
      addActivity("book-shortcut-cancelled", `『${duplicate.title}』の本棚登録を取り消し`);
      saveState();
      renderAll();
      showToast(`『${duplicate.title}』の本棚登録を取り消しました。`);
      return;
    }
    showToast(`『${duplicate.title}』はすでに本棚にあります。`);
    openView("library");
    return;
  }
  state.books.unshift({
    id: uid("book"),
    catalogId: BOOK_CATALOG.some(item => item.id === book.id) ? book.id : "",
    title: book.title,
    author: book.author,
    genre: book.genre || "小説",
    isbn: book.isbn13 || "",
    status: "wishlist",
    pages: 0,
    progress: 0,
    tone: book.tone,
    color: book.color,
    addedFromShortcut: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  addActivity("book-created", `『${book.title}』を「読みたい」に追加`);
  saveState();
  renderAll();
  showToast("「読みたい本」に追加しました。");
}

function markSuggestedAsRead(book) {
  if (!book) return;
  let libraryBook = bookById(book.id) || findDuplicateByTitleAuthor(book.title, book.author);
  if (libraryBook?.readMarkedFromShortcut) {
    const previousStatus = libraryBook.shortcutPreviousStatus;
    if (libraryBook.addedFromShortcut && previousStatus == null && !hasSavedBookHistory(libraryBook.id)) {
      state.books = state.books.filter(item => item.id !== libraryBook.id);
    } else {
      libraryBook.status = previousStatus || "wishlist";
      delete libraryBook.readMarkedFromShortcut;
      delete libraryBook.shortcutPreviousStatus;
      libraryBook.updatedAt = new Date().toISOString();
    }
    addActivity("book-read-shortcut-cancelled", `『${libraryBook.title}』の読了を取り消し`);
    saveState();
    renderAll();
    showToast(`『${libraryBook.title}』の読了を取り消しました。`);
    return;
  }
  if (libraryBook?.status === "read") {
    showToast(`『${libraryBook.title}』は読書記録に読了として残っています。`);
    return;
  }
  if (!libraryBook) {
    libraryBook = {
      id: uid("book"),
      catalogId: BOOK_CATALOG.some(item => item.id === book.id) ? book.id : "",
      title: book.title,
      author: book.author,
      genre: book.genre || "小説",
      isbn: book.isbn13 || "",
      status: "read",
      pages: 0,
      progress: 0,
      tone: book.tone || "",
      color: book.color || COLORS[state.books.length % COLORS.length],
      addedFromShortcut: true,
      readMarkedFromShortcut: true,
      shortcutPreviousStatus: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    state.books.unshift(libraryBook);
  } else {
    libraryBook.shortcutPreviousStatus = libraryBook.status;
    libraryBook.readMarkedFromShortcut = true;
    libraryBook.status = "read";
    libraryBook.updatedAt = new Date().toISOString();
  }
  addActivity("book-status-updated", `『${libraryBook.title}』を「読了」に変更`);
  saveState();
  renderAll();
  showToast(`『${libraryBook.title}』を読了済みにしました。`);
}

function updateBookStatus(id, status) {
  const book = bookById(id);
  if (!book) return;
  book.status = status;
  delete book.addedFromShortcut;
  delete book.readMarkedFromShortcut;
  delete book.shortcutPreviousStatus;
  if (status === "read" && book.pages) book.progress = book.pages;
  book.updatedAt = new Date().toISOString();
  addActivity("book-status-updated", `『${book.title}』を「${STATUS_LABELS[status]}」に変更`);
  saveState();
  renderAll();
  showToast(`『${book.title}』を「${STATUS_LABELS[status]}」にしました。`);
}

function openExistingBook(book) {
  openView("library");
  showToast(`『${book.title}』は「${STATUS_LABELS[book.status]}」にあります。`);
}

function prepareFortune() {
  selectedMood = "";
  currentFortuneBook = null;
  clearTimeout(fortuneTimer);
  $("#draw-select-step").classList.add("active");
  $("#draw-ready-step").classList.remove("active");
  $(".draw-window").classList.remove("drawing", "revealed");
  $("#fortune-result").innerHTML = "";
  $$("#mood-options button").forEach(button => button.classList.remove("active"));
  openModal("mood-modal");
}

function selectMood(mood) {
  selectedMood = mood;
  $$("#mood-options button").forEach(button => button.classList.toggle("active", button.dataset.mood === mood));
  $("#selected-mood-label").textContent = `${mood}な一冊`;
  setTimeout(() => {
    $("#draw-select-step").classList.remove("active");
    $("#draw-ready-step").classList.add("active");
  }, 260);
}

function chooseFortuneBook(mood) {
  const excludeOwned = $("#fortune-exclude-owned")?.checked;
  const catalogCandidates = BOOK_CATALOG
    .filter(book => normalize(book.author) !== normalize("村上春樹"))
    .filter(book => !book.tones?.length || book.tones.includes(mood))
    .map(book => ({
      ...book,
      genre: CATEGORY_LABELS[book.category] || "小説",
      reason: `${book.author}の作品。読んだあとすぐ記録をつけられます。`,
      color: COLORS[Math.abs(book.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) % COLORS.length]
    }));
  const candidates = [...catalogCandidates, ...recommendationPool, ...newBooks]
    .filter(book => normalize(book.author) !== normalize("村上春樹"))
    .filter(book => !book.tone || book.tone.includes(mood));
  const visibleCandidates = excludeOwned
    ? candidates.filter(book => !findDuplicate(book.title))
    : candidates;
  const source = visibleCandidates.length ? visibleCandidates : candidates;
  const alternatives = source.filter(book => book.title !== currentFortuneBook?.title);
  const pool = alternatives.length ? alternatives : source;
  return pool[Math.floor(Math.random() * pool.length)] || recommendationPool[0];
}

function renderFortuneBookResult() {
  if (!currentFortuneBook) return;
  const owned = findDuplicateByTitleAuthor(currentFortuneBook.title, currentFortuneBook.author);
  $("#fortune-result").innerHTML = `
    <div class="fortune-cover" style="--cover:${currentFortuneBook.color}">
      <strong>${escapeHtml(currentFortuneBook.title)}</strong>
    </div>
    <div class="fortune-copy">
      <p class="eyebrow">TODAY'S BOOK FORTUNE / ${escapeHtml(selectedMood)}</p>
      <h3>${escapeHtml(currentFortuneBook.title)}</h3>
      <span>${escapeHtml(currentFortuneBook.author)} / ${escapeHtml(currentFortuneBook.genre)}</span>
      <p>${escapeHtml(currentFortuneBook.reason || currentFortuneBook.description)}</p>
      <div class="fortune-actions">
        <button class="primary-button" data-action="fortune-save">${shelfShortcutLabel(owned, "読みたい本へ ＋")}</button>
        <button class="text-button subtle-check ${owned?.status === "read" ? "checked" : ""} ${owned?.readMarkedFromShortcut ? "undoable" : ""}" data-action="fortune-read">${readShortcutLabel(owned)}</button>
        <button class="text-button" data-action="draw-again">もう一度引く</button>
      </div>
    </div>
  `;
}

function drawFortune() {
  if (!selectedMood) return;
  const windowElement = $(".draw-window");
  currentFortuneBook = chooseFortuneBook(selectedMood);
  renderFortuneBookResult();
  windowElement.classList.remove("revealed");
  windowElement.classList.add("drawing");
  $("#draw-fortune").disabled = true;
  fortuneTimer = setTimeout(() => {
    windowElement.classList.remove("drawing");
    windowElement.classList.add("revealed");
    $("#draw-fortune").disabled = false;
  }, 1850);
}

function handleAction(target) {
  const actionTarget = target.closest("[data-action]");
  if (!actionTarget) return;
  const { action, id, index } = actionTarget.dataset;
  if (action === "add-book") prepareBookForm();
  if (action === "record-new") prepareRecordForm();
  if (action === "view-journal") openView("journal");
  if (action === "toggle-average-rating") {
    showAverageRating = !showAverageRating;
    localStorage.setItem(JOURNAL_AVERAGE_KEY, String(showAverageRating));
    renderJournal();
  }
  if (action === "edit-book") prepareBookForm(bookById(id));
  if (action === "quick-status") {
    const book = bookById(id);
    if (book?.status === "wishlist") updateBookStatus(id, "owned");
    else if (book) prepareRecordForm(id);
  }
  if (action === "mark-wishlist") updateBookStatus(id, "wishlist");
  if (action === "save-new") saveSuggestedBook(newBooks[Number(index)]);
  if (action === "recommendation") saveSuggestedBook(recommendationPool[Number(index)]);
  if (action === "mark-recommendation-read") markSuggestedAsRead(recommendationPool[Number(index)]);
  if (action === "open-catalog-detail") openCatalogDetail(bookById(id) || catalogById(id));
  if (action === "detail-record") {
    const libraryBook = bookById(id);
    const catalogBook = catalogById(id);
    if (libraryBook) prepareRecordForm(libraryBook.id);
    else if (catalogBook) prepareRecordFromCatalog(catalogBook);
  }
  if (action === "detail-wishlist") {
    const libraryBook = bookById(id);
    const catalogBook = catalogById(id);
    if (libraryBook && canUndoShelfAdd(libraryBook)) {
      const sourceBook = enrichBookFromCatalog(libraryBook);
      saveSuggestedBook(sourceBook);
      openCatalogDetail(sourceBook);
    } else if (libraryBook) {
      closeModal(true);
      openExistingBook(libraryBook);
    }
    else if (catalogBook) {
      const existing = findDuplicateByTitleAuthor(catalogBook.title, catalogBook.author);
      if (existing && !canUndoShelfAdd(existing)) {
        closeModal(true);
        openExistingBook(existing);
      } else {
        saveSuggestedBook(catalogBook);
        openCatalogDetail(catalogBook);
      }
    }
  }
  if (action === "detail-read") {
    const book = bookById(id) || catalogById(id);
    if (book) {
      markSuggestedAsRead(book);
      openCatalogDetail(book);
    }
  }
  if (action === "record-catalog") {
    const book = catalogById(id);
    if (book) prepareRecordFromCatalog(book);
  }
  if (action === "record-library") prepareRecordForm(id);
  if (action === "open-library") {
    const book = bookById(id);
    if (book) openExistingBook(book);
  }
  if (action === "cancel-library-shortcut") {
    const book = bookById(id);
    if (book) saveSuggestedBook(enrichBookFromCatalog(book));
  }
  if (action === "save-catalog") {
    const book = catalogById(id);
    if (book) {
      saveSuggestedBook(book);
      renderCatalogResults($("#catalog-search").value);
    }
  }
  if (action === "mark-catalog-read") markSuggestedAsRead(bookById(id) || catalogById(id));
  if (action === "edit-record") {
    const record = state.records.find(item => item.id === id);
    if (record) prepareRecordForm(record.bookId, record);
  }
  if (action === "delete-record") deleteRecord(id);
  if (action === "edit-review") prepareReviewForm(state.reviews.find(review => review.id === id));
  if (action === "delete-review") deleteReview(id);
  if (action === "show-spoiler") {
    actionTarget.parentElement.hidden = true;
    $(`#spoiler-${id}`).hidden = false;
  }
  if (action === "fortune-save" && currentFortuneBook) {
    const existing = findDuplicateByTitleAuthor(currentFortuneBook.title, currentFortuneBook.author);
    saveSuggestedBook(currentFortuneBook);
    if (existing && !canUndoShelfAdd(existing)) closeModal(true);
    else renderFortuneBookResult();
  }
  if (action === "fortune-read" && currentFortuneBook) {
    markSuggestedAsRead(currentFortuneBook);
    renderFortuneBookResult();
  }
  if (action === "draw-again") {
    drawFortune();
  }
}

$$(".nav-link").forEach(button => button.addEventListener("click", () => openView(button.dataset.view)));
$("#open-add-book").addEventListener("click", () => prepareBookForm());
$("#library-add-book").addEventListener("click", () => prepareBookForm());
$("#hero-add-record").addEventListener("click", () => prepareRecordForm());
$("#journal-add-record").addEventListener("click", () => prepareRecordForm());
$("#open-review").addEventListener("click", () => prepareReviewForm());
$("#open-mood").addEventListener("click", prepareFortune);
$$('[data-open-auth]').forEach(button => button.addEventListener("click", () => {
  updateAuthUi();
  openModal("auth-modal");
}));
$$("[data-close-modal]").forEach(button => button.addEventListener("click", () => closeModal()));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && $("#modal-layer").classList.contains("open")) closeModal();
});
document.addEventListener("click", event => handleAction(event.target));

$("#book-form").addEventListener("submit", saveBook);
$("#record-form").addEventListener("submit", saveRecord);
$("#review-form").addEventListener("submit", saveReview);
$("#auth-form").addEventListener("submit", requestMagicLink);
$("#auth-signout").addEventListener("click", signOut);
$("#delete-book").addEventListener("click", deleteCurrentBook);
$("#delete-record").addEventListener("click", () => deleteRecord());
$("#book-status").addEventListener("change", updateProgressField);
$("#review-sort").addEventListener("change", renderReviews);
$("#library-search").addEventListener("input", renderLibrary);
$("#catalog-search").addEventListener("input", event => renderCatalogResults(event.target.value));
$("#record-title").addEventListener("input", () => {
  $("#record-catalog-id").value = "";
});
$("#record-author").addEventListener("input", () => {
  $("#record-catalog-id").value = "";
});
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
$("#refresh-catalog-discovery").addEventListener("click", () => {
  catalogDiscoveryOffset += 3;
  renderCatalogResults("");
});
$("#duplicate-form").addEventListener("submit", event => {
  event.preventDefault();
  const query = $("#duplicate-query").value.trim();
  const match = findBestLibraryMatch(query);
  const result = $("#duplicate-result");
  result.classList.toggle("found", Boolean(match));
  result.innerHTML = match
    ? `本棚にあります：『${escapeHtml(enrichBookFromCatalog(match).title)}』 / ${STATUS_LABELS[match.status]}`
    : "本棚には見つかりませんでした。読みたい本として登録できます。";
});
$("#mood-options").addEventListener("click", event => {
  const button = event.target.closest("[data-mood]");
  if (button) selectMood(button.dataset.mood);
});
$("#draw-fortune").addEventListener("click", drawFortune);
$("#back-to-moods").addEventListener("click", () => {
  clearTimeout(fortuneTimer);
  $(".draw-window").classList.remove("drawing", "revealed");
  $("#draw-ready-step").classList.remove("active");
  $("#draw-select-step").classList.add("active");
  currentFortuneBook = null;
});
window.addEventListener("popstate", () => {
  if ($("#modal-layer").classList.contains("open")) {
    const closed = closeModal();
    if (!closed) history.pushState({ view: activeView }, "", `#${activeView || "home"}`);
    return;
  }
  const view = ["home", "library", "journal", "reviews"].includes(location.hash.slice(1))
    ? location.hash.slice(1)
    : "home";
  showViewFromHistory(view);
});

const initialView = ["home", "library", "journal", "reviews"].includes(location.hash.slice(1))
  ? location.hash.slice(1)
  : "home";

async function loadCatalog() {
  if (Array.isArray(window.YOHAKU_BOOK_CATALOG)) {
    BOOK_CATALOG = window.YOHAKU_BOOK_CATALOG;
  }
  if (!window.fetch) return;
  try {
    let sources = [{ path: LOCAL_CATALOG_FALLBACK }];
    const indexResponse = await fetch(LOCAL_CATALOG_INDEX);
    if (indexResponse.ok) {
      const index = await indexResponse.json();
      if (Array.isArray(index) && index.length) sources = index;
    }
    const catalogs = await Promise.all(sources.map(async source => {
      const response = await fetch(source.path);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${source.path}`);
      const catalog = await response.json();
      return Array.isArray(catalog) ? catalog : [];
    }));
    const merged = catalogs.flat();
    if (merged.length) {
      const unique = new Map();
      merged.forEach(book => unique.set(book.id || catalogIdentity(book), book));
      BOOK_CATALOG = [...unique.values()];
    }
  } catch (error) {
    console.info("JSONカタログを読み込めなかったため、内蔵カタログを使います。", error);
  }
  await loadCatalogFromSupabase();
}

async function initApp() {
  parseAuthCallback();
  await loadCatalog();
  const remoteState = await loadRemoteState();
  if (remoteState) {
    state = migrateState(remoteState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    remoteSyncReady = true;
  } else {
    remoteSyncReady = hasSupabaseConfig() && Boolean(activeOwnerId());
  }
  updateAuthUi();
  renderAll();
  openView(initialView, { replace: true });
}

initApp();
