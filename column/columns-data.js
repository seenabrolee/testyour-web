// TESTYOUR 칼럼 데이터베이스 및 게시 상태 설정
// 각 칼럼의 기본 게시 상태(defaultStatus: 'draft' | 'published')를 정의합니다.

const TESTYOUR_COLUMNS = [
  {
    id: "music-5",
    topic: "music",
    title: "[음악 감상 #1] 리센느 〈백화요란 (Inside Out)〉 감상평: 향기를 뚫고 나온 '쇠맛', 반음(#)의 세련미",
    title_en: "[Music Review #1] RESCENE 'Inside Out' Review: A Sleek Metallic Edge and Chromatic Sharp (#) Twist",
    category: "음악 | 주인장의 음악 감상 노트 #1",
    category_en: "Music | Creator's Listening Notes #1",
    url: "/column/5.html",
    url_en: "/en/column/5.html",
    description: "기존의 몽환적 플로럴 결을 비튼 리센느 미니 4집 《PULSE》의 쇠맛 전환과 더블 타이틀급 존재감. 심플한 비트 위, 후렴 뒤 짧은 브릿지에서 보컬이 샵(#) 반음으로 살짝 꺾이며 불협화음 대신 독보적 세련미를 빚어내는 순간을 짚어봅니다.",
    description_en: "Reviewing RESCENE's bold metallic pivot on mini-album PULSE, co-title promotion conviction, and how a delicate post-chorus sharp (#) vocal inflection shines cleanly over a restrained beat.",
    meta: "에디터: 테스트유어 주인장 · 읽는 시간 약 7분",
    meta_en: "Author: TESTYOUR Creator · 7 min read",
    badge: "음악 #1 🎧",
    borderColor: "#06b6d4",
    defaultStatus: "published",
    date: "2026-11-11"
  },
  {
    id: "leorio-love",
    topic: "manga",
    title: "[칼럼] 내가 <헌터×헌터>에서 레오리오를 최애로 꼽는 이유",
    title_en: "[Column] Why Leorio Paradinight Is My All-Time Favorite Character in Hunter x Hunter",
    category: "주인장 사심 에세이 | 캐릭터 애정 해부",
    category_en: "Owner's Personal Pick | Character Appreciation",
    url: "/column/leorio-love.html",
    url_en: "/en/column/leorio-love.html",
    description: "천재와 암살자, 괴물들이 득실거리는 헌터X헌터에서 주인장이 왜 하필 '레오리오'를 평생의 최애로 꼽을까? 속물 가면 뒤의 순수한 꿈, 8톤 시련의 문 피지컬, 원격 초음파 하츠와 진 프릭스 펀치의 감동을 기록한 에세이.",
    description_en: "Among child prodigies and terrifying monsters, why does the site creator rank Leorio #1? A love letter to his hidden medical dream, 8-ton grit, and Election arc warp punch.",
    meta: "에디터: 테스트유어 주인장 · 읽는 시간 약 7분",
    meta_en: "Author: TESTYOUR Creator · 7 min read",
    badge: "주인장 픽",
    borderColor: "#eab308",
    defaultStatus: "published",
    date: "2026-11-11"
  },
  {
    id: "gon-analysis",
    topic: "manga",
    title: "[칼럼] 곤은 왜 '곤육몬'이 되었을까? 카이토라는 결핍과 순수함이 낳은 잔혹한 괴물",
    title_en: "[Column] Why Did Gon Transform into 'Adult Gon'? The Cruel Monster Born of Absence and Pureness",
    category: "만화 | 서사 심리학 & 캐릭터 해부",
    category_en: "Manga | Narrative Psychology & Character Analysis",
    url: "/column/gon-analysis.html",
    url_en: "/en/column/gon-analysis.html",
    description: "더 이상 필요 없어... 끝이라도 좋아. 소년만화 클리셰를 산산조각 낸 곤의 자멸적 각성. 카이토가 곤에게 지녔던 아버지 이상의 무게, 선악의 구분이 없는 백지(白紙)의 광기, 그리고 스스로를 땔감으로 태워버린 강화계 넨의 종착지를 심층 분석합니다.",
    description_en: "I don't need it anymore... even if this is the end. Gon's self-destructive awakening that shattered shonen tropes.",
    meta: "에디터: 테스트유어 · 읽는 시간 약 9분",
    meta_en: "Editor: TESTYOUR · 9 min read",
    badge: "심층 분석",
    borderColor: "#ef4444",
    defaultStatus: "published", // 검수 완료 및 정식 공개 게시됨
    date: "2026-11-10"
  },
  {
    id: "mbti-nen",
    topic: "psychology",
    title: "[칼럼] 넨(念) 6대 계통과 MBTI 16가지 성격 유형의 심층 상관관계 분석",
    title_en: "[Column] The Correlation Between 6 Nen Categories and 16 MBTI Types",
    category: "심리 | 성격 심리학 & MBTI 비교",
    category_en: "Psychology | Personality Theory & MBTI",
    url: "/column/mbti-nen.html",
    url_en: "/en/column/mbti-nen.html",
    description: "히소카의 오오라 성격 진단은 단순한 만화적 허구일까? 칼 융의 인지기능과 16가지 성격 지표를 일상과 직장의 인간관계 관점에서 유쾌하고 날카롭게 풀어낸 비교 에세이.",
    description_en: "Is Hisoka's Nen personality test merely fictional? An essay exploring Carl Jung's cognitive functions and Nen.",
    meta: "에디터: 테스트유어 · 읽는 시간 약 7분",
    meta_en: "Editor: TESTYOUR · 7 min read",
    badge: "",
    borderColor: "#ff3b30",
    defaultStatus: "published",
    date: "2026-10-25"
  },
  {
    id: "leadership",
    topic: "psychology",
    title: "[칼럼] 직장인 시선으로 본 헌터X헌터의 4대 리더십 모델",
    title_en: "[Column] 4 Leadership Models from Hunter x Hunter Through an Office Worker's Lens",
    category: "심리 | 조직 심리학 · 직장인 리더십",
    category_en: "Psychology | Organizational & Workplace Leadership",
    url: "/column/leadership.html",
    url_en: "/en/column/leadership.html",
    description: "팀원 모두가 곤 같으면 그 팀은 한 달 안에 터집니다! 불나방형 곤, 팩폭형 참모 키르아, 시스템형 클로로, 성장형 군주 메르엠을 통해 본 현실 직장 생존 가이드.",
    description_en: "If all team members were like Gon, the team would implode in a month! Survival guide for modern workplaces.",
    meta: "에디터: 테스트유어 · 읽는 시간 약 8분",
    meta_en: "Editor: TESTYOUR · 8 min read",
    badge: "",
    borderColor: "#a855f7",
    defaultStatus: "published",
    date: "2026-10-18"
  }
];

// 로컬 오버라이드 및 현재 유효 칼럼 상태 반환
function getTestyourColumns() {
  let overrides = {};
  try {
    const raw = localStorage.getItem("testyour_column_status_overrides");
    if (raw) overrides = JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to parse status overrides:", e);
  }

  return TESTYOUR_COLUMNS.map(col => {
    return {
      ...col,
      status: overrides[col.id] || col.defaultStatus
    };
  });
}

// 특정 칼럼의 상태 반환 ('published' | 'draft')
function getColumnStatus(colId) {
  const cols = getTestyourColumns();
  const found = cols.find(c => c.id === colId);
  return found ? found.status : "draft";
}
