// TESTYOUR 관리자 모드 & 칼럼 게시 관리 시스템
// (Admin Mode & Column Publication Controller)

const ADMIN_CONFIG = {
  // 기본 비밀번호: testyour777! (SHA-256 해시)
  defaultHash: "52b01c619e1507dfb15c66bd5dd6bea8256b464679687aedced8332a314f92d1",
  sessionKey: "testyour_admin_session",
  customHashKey: "testyour_admin_custom_hash",
  overrideKey: "testyour_column_status_overrides"
};

// SHA-256 해시 계산 함수 (Web Crypto API)
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// 관리자 로그인 여부 확인
function isAdminLoggedIn() {
  return sessionStorage.getItem(ADMIN_CONFIG.sessionKey) === "true" ||
         localStorage.getItem(ADMIN_CONFIG.sessionKey) === "true";
}

// 관리자 로그인 처리
async function adminLogin(password, rememberMe = false) {
  const inputHash = await sha256(password);
  const targetHash = localStorage.getItem(ADMIN_CONFIG.customHashKey) || ADMIN_CONFIG.defaultHash;

  if (inputHash === targetHash) {
    if (rememberMe) {
      localStorage.setItem(ADMIN_CONFIG.sessionKey, "true");
    } else {
      sessionStorage.setItem(ADMIN_CONFIG.sessionKey, "true");
    }
    return true;
  }
  return false;
}

// 관리자 로그아웃
function adminLogout() {
  sessionStorage.removeItem(ADMIN_CONFIG.sessionKey);
  localStorage.removeItem(ADMIN_CONFIG.sessionKey);
  window.location.reload();
}

// 칼럼 게시 상태 토글 및 저장 ('published' <-> 'draft')
function setColumnPublishStatus(colId, newStatus) {
  let overrides = {};
  try {
    const raw = localStorage.getItem(ADMIN_CONFIG.overrideKey);
    if (raw) overrides = JSON.parse(raw);
  } catch (e) {
    overrides = {};
  }

  overrides[colId] = newStatus;
  localStorage.setItem(ADMIN_CONFIG.overrideKey, JSON.stringify(overrides));
  
  // 상태 변경 이벤트 디스패치
  window.dispatchEvent(new CustomEvent("testyour:columnStatusChanged", {
    detail: { columnId: colId, status: newStatus }
  }));
}

// 현재 칼럼 상태 확인
function getEffectiveColumnStatus(colId, defaultStatus = "draft") {
  try {
    const raw = localStorage.getItem(ADMIN_CONFIG.overrideKey);
    if (raw) {
      const overrides = JSON.parse(raw);
      if (overrides[colId]) return overrides[colId];
    }
  } catch (e) {}

  if (typeof getColumnStatus === "function") {
    return getColumnStatus(colId);
  }
  return defaultStatus;
}

// ==========================================
// 1. 칼럼 목록 페이지 관리자 UI 초기화 (/column/index.html)
// ==========================================
function initColumnIndexPage() {
  const isEn = window.location.pathname.includes("/en/");
  const cards = document.querySelectorAll("[data-column-id]");
  const loggedIn = isAdminLoggedIn();

  if (loggedIn) {
    renderAdminTopBar();
  }

  cards.forEach(card => {
    const colId = card.getAttribute("data-column-id");
    if (!colId) return;

    const status = getEffectiveColumnStatus(colId);

    if (!loggedIn && status === "draft") {
      // 일반 방문자에게 비공개 초안은 숨김
      card.style.display = "none";
    } else if (loggedIn) {
      // 관리자에게는 상태 배지 및 원클릭 게시/비공개 토글 버튼 노출
      card.style.display = "block";
      enhanceCardWithAdminControls(card, colId, status, isEn);
    }

    if (loggedIn || status !== "draft") {
      attachIndexLikeCounter(card, colId, isEn);
    }
  });
}

// ==========================================
// 1-B. 칼럼 좋아요 카운터 (Abacus 글로벌 + localStorage 폴백)
// ==========================================
const ABACUS_BASE = "https://abacus.jasoncameron.dev";
const ABACUS_NS = "testyour-uk";
const LIKED_COLS_KEY = "testyour_liked_columns_v1";
const LIKED_CACHE_KEY = "testyour_like_counts_v1";

function readJsonStore(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function writeJsonStore(key, obj) {
  try {
    localStorage.setItem(key, JSON.stringify(obj));
  } catch (e) {}
}

async function fetchGlobalLikeCount(colId) {
  const res = await fetch(`${ABACUS_BASE}/get/${ABACUS_NS}/col-${encodeURIComponent(colId)}`);
  if (res.status === 404) return 0;
  if (!res.ok) throw new Error("Counter fetch failed");
  const data = await res.json();
  return typeof data.value === "number" ? data.value : 0;
}

async function incrementGlobalLikeCount(colId) {
  const res = await fetch(`${ABACUS_BASE}/hit/${ABACUS_NS}/col-${encodeURIComponent(colId)}`);
  if (!res.ok) throw new Error("Counter hit failed");
  const data = await res.json();
  return typeof data.value === "number" ? data.value : null;
}

function attachIndexLikeCounter(card, colId, isEn) {
  if (card.querySelector(".col-card-like-pill")) return;
  const metaSpan = card.querySelector("span:last-of-type");
  const cache = readJsonStore(LIKED_CACHE_KEY);
  const pill = document.createElement("span");
  pill.className = "col-card-like-pill";
  pill.style.cssText = "display:inline-flex; align-items:center; gap:4px; margin-left:10px; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:11.5px; color:#94a3b8; background:rgba(148,163,184,0.08); border:1px solid #2d3748; padding:2px 8px; border-radius:999px; vertical-align:middle;";
  const cachedVal = typeof cache[colId] === "number" ? cache[colId] : 0;
  pill.innerHTML = `<span style="color:#fb7185;">&hearts;</span> <span class="col-card-like-num">${cachedVal}</span>`;
  if (metaSpan && metaSpan.parentNode === card) {
    metaSpan.appendChild(pill);
  } else {
    card.appendChild(pill);
  }
  fetchGlobalLikeCount(colId).then(val => {
    const nextCache = readJsonStore(LIKED_CACHE_KEY);
    nextCache[colId] = val;
    writeJsonStore(LIKED_CACHE_KEY, nextCache);
    const numEl = pill.querySelector(".col-card-like-num");
    if (numEl) numEl.textContent = String(val);
  }).catch(() => {});
}

function renderColumnLikeWidget(colId, isEn) {
  if (document.getElementById("testyour-column-like-box")) return;
  const article = document.querySelector("article");
  if (!article) return;

  const likedMap = readJsonStore(LIKED_COLS_KEY);
  const countCache = readJsonStore(LIKED_CACHE_KEY);
  let alreadyLiked = Boolean(likedMap[colId]);
  let currentCount = typeof countCache[colId] === "number" ? countCache[colId] : 0;

  const box = document.createElement("div");
  box.id = "testyour-column-like-box";
  box.style.cssText = `
    margin: 28px 0 34px;
    padding: 18px 20px;
    background: #141824;
    border: 1px solid #2d3748;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
  `;

  box.innerHTML = `
    <div style="text-align:left;">
      <div style="font-size:14.5px; font-weight:700; color:#f8fafc; margin-bottom:3px;">
        ${isEn ? "Did this column resonate with you?" : "오늘 칼럼이 재미있거나 공감되셨나요?"}
      </div>
      <div id="col-like-status" style="font-size:12.5px; color:#94a3b8; font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">
        ${alreadyLiked
          ? (isEn ? "Thanks! Your endorsement is recorded." : "공감해 주셔서 감사합니다 · 좋아요 반영됨")
          : (isEn ? "Tap Like to check and add to the live reader count." : "좋아요를 눌러 누적 공감 수를 바로 확인해 보세요.")
        }
      </div>
    </div>
    <button type="button" id="col-like-btn" aria-pressed="${alreadyLiked ? "true" : "false"}" style="display:inline-flex; align-items:center; gap:9px; padding:10px 18px; border-radius:10px; border:1px solid ${alreadyLiked ? "#fb7185" : "#334155"}; background:${alreadyLiked ? "rgba(244,63,94,0.16)" : "#1e293b"}; color:${alreadyLiked ? "#fda4af" : "#f8fafc"}; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.18s ease;">
      <svg id="col-like-heart" width="17" height="17" viewBox="0 0 24 24" fill="${alreadyLiked ? "#f43f5e" : "none"}" stroke="${alreadyLiked ? "#f43f5e" : "currentColor"}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      <span id="col-like-label">${alreadyLiked ? (isEn ? "Liked" : "좋아요 완료") : (isEn ? "Like" : "좋아요")}</span>
      <span id="col-like-count" style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:13px; background:rgba(15,23,42,0.75); border:1px solid #334155; padding:2px 9px; border-radius:999px; color:#22d3ee;">${currentCount}</span>
    </button>
  `;

  const cta = article.querySelector(".cta-banner");
  if (cta) {
    article.insertBefore(box, cta);
  } else {
    article.appendChild(box);
  }

  const btn = document.getElementById("col-like-btn");
  const heart = document.getElementById("col-like-heart");
  const label = document.getElementById("col-like-label");
  const countEl = document.getElementById("col-like-count");
  const statusEl = document.getElementById("col-like-status");

  fetchGlobalLikeCount(colId).then(val => {
    currentCount = val;
    countEl.textContent = String(val);
    const nextCache = readJsonStore(LIKED_CACHE_KEY);
    nextCache[colId] = val;
    writeJsonStore(LIKED_CACHE_KEY, nextCache);
  }).catch(() => {});

  btn.addEventListener("click", async () => {
    if (alreadyLiked) {
      statusEl.textContent = isEn
        ? `Already liked in this browser (total: ${currentCount}).`
        : `이미 좋아요를 누른 글입니다 (현재 누적 ${currentCount}개).`;
      return;
    }

    alreadyLiked = true;
    btn.setAttribute("aria-pressed", "true");
    btn.style.borderColor = "#fb7185";
    btn.style.background = "rgba(244,63,94,0.16)";
    btn.style.color = "#fda4af";
    heart.setAttribute("fill", "#f43f5e");
    heart.setAttribute("stroke", "#f43f5e");
    label.textContent = isEn ? "Liked" : "좋아요 완료";

    currentCount += 1;
    countEl.textContent = String(currentCount);

    const nextLiked = readJsonStore(LIKED_COLS_KEY);
    nextLiked[colId] = true;
    writeJsonStore(LIKED_COLS_KEY, nextLiked);

    try {
      const serverVal = await incrementGlobalLikeCount(colId);
      if (typeof serverVal === "number") {
        currentCount = serverVal;
        countEl.textContent = String(serverVal);
      }
      const nextCache = readJsonStore(LIKED_CACHE_KEY);
      nextCache[colId] = currentCount;
      writeJsonStore(LIKED_CACHE_KEY, nextCache);
      statusEl.textContent = isEn
        ? `Liked! Live global count updated to ${currentCount}.`
        : `좋아요 반영 완료 · 현재 누적 ${currentCount}명 공감`;
    } catch (err) {
      const nextCache = readJsonStore(LIKED_CACHE_KEY);
      nextCache[colId] = currentCount;
      writeJsonStore(LIKED_CACHE_KEY, nextCache);
      statusEl.textContent = isEn
        ? `Saved locally (${currentCount}).`
        : `이 브라우저에 좋아요가 저장되었습니다 (${currentCount}).`;
    }
  });
}

function enhanceCardWithAdminControls(card, colId, status, isEn) {
  // 이미 관리자 컨트롤이 삽입되어 있다면 업데이트만 수행
  let controlBox = card.querySelector(".admin-card-control");
  if (!controlBox) {
    controlBox = document.createElement("div");
    controlBox.className = "admin-card-control";
    controlBox.style.cssText = `
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px dashed #334155;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    `;
    card.appendChild(controlBox);
  }

  const isDraft = status === "draft";
  const badgeHtml = isDraft
    ? `<span style="background: rgba(234, 179, 8, 0.2); color: #facc15; border: 1px solid #eab308; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold;">🟡 ${isEn ? "Draft (Hidden from public)" : "비공개 초안 (일반 방문자 미공개)"}</span>`
    : `<span style="background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid #10b981; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold;">🟢 ${isEn ? "Live (Public to all)" : "전체 공개 중 (일반인 열람 가능)"}</span>`;

  const btnHtml = isDraft
    ? `<button type="button" class="admin-toggle-btn" style="background: #10b981; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12.5px; font-weight: bold; cursor: pointer; transition: 0.2s;">🚀 ${isEn ? "Publish to Public" : "일반인에게 지금 게시하기"}</button>`
    : `<button type="button" class="admin-toggle-btn" style="background: #475569; color: #e2e8f0; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12.5px; font-weight: bold; cursor: pointer; transition: 0.2s;">🔒 ${isEn ? "Unpublish (Set to Draft)" : "비공개 초안으로 내리기"}</button>`;

  controlBox.innerHTML = `
    <div>${badgeHtml}</div>
    <div>${btnHtml}</div>
  `;

  const btn = controlBox.querySelector(".admin-toggle-btn");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = isDraft ? "published" : "draft";
    setColumnPublishStatus(colId, newStatus);
    showAdminToast(
      newStatus === "published"
        ? (isEn ? "🎉 Published! This column is now visible to everyone." : "🎉 성공적으로 게시되었습니다! 이제 모든 일반 방문자가 볼 수 있습니다.")
        : (isEn ? "🔒 Unchecked. Column changed to private draft." : "🔒 비공개 초안으로 전환되었습니다. 관리자에게만 보입니다.")
    );
    // UI 갱신
    enhanceCardWithAdminControls(card, colId, newStatus, isEn);
  });
}

// ==========================================
// 2. 개별 칼럼 본문 페이지 게이트 제어 (/column/gon-analysis.html 등)
// ==========================================
function initColumnArticlePage(colId, defaultStatus = "draft") {
  const isEn = window.location.pathname.includes("/en/");
  const status = getEffectiveColumnStatus(colId, defaultStatus);
  const loggedIn = isAdminLoggedIn();
  const article = document.querySelector("article");

  if (!article) return;

  if (loggedIn) {
    // 관리자 탑바 렌더링
    renderAdminTopBar();
    // 관리자 전용 아티클 상단 배너 표시
    renderArticleAdminBanner(colId, status, isEn);
  } else if (status === "draft") {
    // 일반 방문자이며 비공개 초안인 경우: 본문 숨기고 잠금 게이트 화면 노출
    article.style.display = "none";
    renderDraftGate(colId, isEn);
    return;
  }

  renderColumnLikeWidget(colId, isEn);
}

function renderArticleAdminBanner(colId, status, isEn) {
  const isDraft = status === "draft";
  const existing = document.getElementById("admin-article-banner");
  if (existing) existing.remove();

  const banner = document.createElement("div");
  banner.id = "admin-article-banner";
  banner.style.cssText = `
    background: ${isDraft ? "linear-gradient(90deg, #3a2e12, #1f1b0e)" : "linear-gradient(90deg, #0f2e1e, #0e1e17)"};
    border: 1px solid ${isDraft ? "#eab308" : "#10b981"};
    border-radius: 12px;
    padding: 14px 20px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  `;

  banner.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="font-size:20px;">${isDraft ? "🟡" : "🟢"}</span>
      <span style="font-size:14px; color:#f8fafc; font-weight:600;">
        ${isEn
          ? (isDraft ? "Admin Preview: This column is currently in <strong>Private Draft</strong> (Hidden from public)." : "Admin View: This column is currently <strong>Live & Public</strong> to all visitors.")
          : (isDraft ? "관리자 사전 검토 모드: 현재 이 칼럼은 <strong>비공개 초안</strong> 상태입니다 (일반인 미공개)." : "관리자 모드: 현재 이 칼럼은 <strong>전체 공개(게시됨)</strong> 상태입니다.")
        }
      </span>
    </div>
    <div style="display:flex; gap:10px;">
      <button id="admin-banner-toggle-btn" style="background:${isDraft ? "#10b981" : "#475569"}; color:#fff; border:none; padding:8px 16px; border-radius:8px; font-weight:bold; font-size:13px; cursor:pointer;">
        ${isDraft
          ? (isEn ? "🚀 Publish to Everyone" : "🚀 지금 전체 공개로 게시하기")
          : (isEn ? "🔒 Revert to Draft" : "🔒 비공개 초안으로 내리기")
        }
      </button>
      <a href="/admin.html" style="background:#334155; color:#cbd5e1; text-decoration:none; padding:8px 14px; border-radius:8px; font-size:13px; font-weight:bold; display:inline-flex; align-items:center;">
        ⚙️ ${isEn ? "Admin Console" : "관리자 콘솔"}
      </a>
    </div>
  `;

  const container = document.querySelector(".container");
  if (container) {
    container.insertBefore(banner, container.firstChild);
  }

  document.getElementById("admin-banner-toggle-btn").addEventListener("click", () => {
    const newStatus = isDraft ? "published" : "draft";
    setColumnPublishStatus(colId, newStatus);
    showAdminToast(
      newStatus === "published"
        ? (isEn ? "🎉 Successfully Published to everyone!" : "🎉 성공적으로 전체 공개 게시되었습니다!")
        : (isEn ? "🔒 Reverted to private draft." : "🔒 비공개 초안으로 전환되었습니다.")
    );
    renderArticleAdminBanner(colId, newStatus, isEn);
  });
}

function renderDraftGate(colId, isEn) {
  const container = document.querySelector(".container");
  if (!container) return;

  const gate = document.createElement("div");
  gate.id = "testyour-draft-lock-gate";
  gate.style.cssText = `
    text-align: center;
    padding: 70px 24px;
    background: #161a24;
    border-radius: 16px;
    border: 1px solid #334155;
    margin: 40px auto;
    max-width: 620px;
  `;

  gate.innerHTML = `
    <div style="font-size: 52px; margin-bottom: 18px;">🔒</div>
    <h2 style="color: #f8fafc; font-size: 24px; margin: 0 0 12px 0;">
      ${isEn ? "This Column is in Private Draft Review" : "비공개 검토 중인 칼럼입니다"}
    </h2>
    <p style="color: #94a3b8; font-size: 15px; line-height: 1.7; margin: 0 0 28px 0;">
      ${isEn
        ? "This article is currently under editorial review and has not yet been publicly released.<br>Please check back soon after official publication!"
        : "본 칼럼은 현재 관리자 검토 단계에 있으며 아직 일반 독자에게 공개되지 않았습니다.<br>정식 게시된 후 다시 방문해 주시기 바랍니다!"
      }
    </p>
    <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
      <a href="${isEn ? '/en/column/' : '/column/'}" style="background: #334155; color: #f1f5f9; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 14.5px; font-weight: bold;">
        ${isEn ? "← Back to Columns" : "← 칼럼 목록으로 돌아가기"}
      </a>
      <button onclick="openAdminLoginModal()" style="background: #ef4444; color: #fff; border: none; padding: 12px 24px; border-radius: 10px; font-size: 14.5px; font-weight: bold; cursor: pointer;">
        🔑 ${isEn ? "Admin Login" : "관리자 로그인"}
      </button>
    </div>
  `;

  container.appendChild(gate);
}

// ==========================================
// 3. 관리자 상단 고정 바 (Admin TopBar)
// ==========================================
function renderAdminTopBar() {
  if (document.getElementById("testyour-admin-topbar")) return;

  const topbar = document.createElement("div");
  topbar.id = "testyour-admin-topbar";
  topbar.style.cssText = `
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99999;
    background: #111827;
    border-bottom: 2px solid #ef4444;
    color: #f3f4f6;
    padding: 9px 20px;
    font-size: 13.5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  `;

  topbar.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="background:#ef4444; color:#fff; font-size:11px; font-weight:900; padding:2px 7px; border-radius:4px;">ADMIN</span>
      <span>🛡️ <strong>TESTYOUR 관리자 모드</strong> (초안 열람 및 실시간 게시 가능)</span>
    </div>
    <div style="display:flex; align-items:center; gap:14px;">
      <a href="/admin.html" style="color:#f87171; text-decoration:none; font-weight:bold; font-size:13px; display:inline-flex; align-items:center; gap:4px;">
        ⚙️ 관리자 콘솔
      </a>
      <button onclick="adminLogout()" style="background:#374151; color:#e5e7eb; border:none; padding:4px 12px; border-radius:6px; font-size:12px; cursor:pointer; font-weight:bold;">
        로그아웃
      </button>
    </div>
  `;

  document.body.insertBefore(topbar, document.body.firstChild);
}

// ==========================================
// 4. 관리자 로그인 모달 다이얼로그
// ==========================================
function openAdminLoginModal() {
  const existing = document.getElementById("admin-login-modal-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "admin-login-modal-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;

  overlay.innerHTML = `
    <div style="background: #161a24; border: 1px solid #334155; border-radius: 16px; padding: 32px 28px; width: 100%; max-width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); position: relative;">
      <button onclick="document.getElementById('admin-login-modal-overlay').remove()" style="position: absolute; top: 16px; right: 16px; background: transparent; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">✕</button>
      <div style="text-align: center; margin-bottom: 22px;">
        <div style="font-size: 36px; margin-bottom: 8px;">🛡️</div>
        <h3 style="color: #f8fafc; margin: 0 0 6px 0; font-size: 20px;">관리자 로그인</h3>
        <p style="color: #94a3b8; font-size: 13px; margin: 0;">칼럼 게시 관리 및 비공개 초안 열람</p>
      </div>
      <form id="admin-modal-form">
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 12.5px; color: #cbd5e1; margin-bottom: 6px; font-weight: 600;">관리자 비밀번호</label>
          <input type="password" id="admin-modal-password" placeholder="비밀번호를 입력하세요" required style="width: 100%; padding: 12px 14px; background: #0f1117; border: 1px solid #334155; border-radius: 8px; color: #fff; font-size: 14px; box-sizing: border-box; outline: none;">
        </div>
        <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" id="admin-modal-remember" style="accent-color: #ef4444; cursor: pointer;">
          <label for="admin-modal-remember" style="font-size: 13px; color: #94a3b8; cursor: pointer;">로그인 상태 유지</label>
        </div>
        <button type="submit" style="width: 100%; background: #ef4444; color: #fff; border: none; padding: 13px; border-radius: 8px; font-size: 15px; font-weight: bold; cursor: pointer;">로그인</button>
        <div id="admin-modal-error" style="color: #f87171; font-size: 12.5px; margin-top: 12px; text-align: center; display: none;">비밀번호가 올바르지 않습니다.</div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  const form = document.getElementById("admin-modal-form");
  const input = document.getElementById("admin-modal-password");
  input.focus();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pw = input.value.trim();
    const remember = document.getElementById("admin-modal-remember").checked;
    const ok = await adminLogin(pw, remember);
    if (ok) {
      overlay.remove();
      showAdminToast("🎉 관리자로 성공적으로 로그인되었습니다!");
      setTimeout(() => window.location.reload(), 400);
    } else {
      document.getElementById("admin-modal-error").style.display = "block";
    }
  });
}

// 토스트 메시지 알림
function showAdminToast(msg) {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    bottom: 28px;
    right: 28px;
    background: #1e293b;
    color: #f8fafc;
    border-left: 4px solid #ef4444;
    padding: 14px 22px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    z-index: 9999999;
    animation: fadeIn 0.3s ease;
  `;
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.4s";
    setTimeout(() => toast.remove(), 400);
  }, 2600);
}
