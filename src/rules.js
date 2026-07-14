/**
 * 규칙 상수 + 판정 순수 함수.
 * 근거: ../agent_shared/specs/05_mvp_implementation_plan.md 2·4·5절, 03A_test_answers.md.
 * 외부 npm 패키지 사용 금지 — 브라우저 내장 API만 사용.
 */
(function (root) {
  "use strict";

  var PRIORITY_RULES = [
    { level: "P0", keywords: ["crash", "500", "down", "보안"] },
    { level: "P1", keywords: ["bug", "error", "실패"] }
  ];

  var ROLE_RULES = [
    { role: "Frontend", keywords: ["버튼", "색상", "css"] },
    { role: "Backend", keywords: ["api", "db", "서버"] },
    { role: "QA", keywords: ["qa", "테스트", "검증"] },
    { role: "DevOps", keywords: ["배포", "인프라", "ci"] }
  ];

  // 계획서에 기본 역할이 명시되지 않아 임시로 Backend를 기본값으로 둔다(assumption).
  var DEFAULT_ROLE = "Backend";

  var ACTION_MAP = {
    P0: "즉시 대응 및 담당자 호출",
    P1: "24시간 내 처리 및 리뷰 배정",
    P2: "백로그 등록 후 일반 처리"
  };

  function normalize(text) {
    return String(text).trim().toLowerCase();
  }

  function determinePriority(normalizedText) {
    for (var i = 0; i < PRIORITY_RULES.length; i++) {
      var rule = PRIORITY_RULES[i];
      for (var j = 0; j < rule.keywords.length; j++) {
        if (normalizedText.indexOf(rule.keywords[j].toLowerCase()) !== -1) {
          return rule.level;
        }
      }
    }
    return "P2";
  }

  function determineRole(normalizedText) {
    for (var i = 0; i < ROLE_RULES.length; i++) {
      var rule = ROLE_RULES[i];
      for (var j = 0; j < rule.keywords.length; j++) {
        if (normalizedText.indexOf(rule.keywords[j].toLowerCase()) !== -1) {
          return rule.role;
        }
      }
    }
    return DEFAULT_ROLE;
  }

  function determineReview(priority) {
    return priority === "P0" || priority === "P1";
  }

  function buildNextAction(priority) {
    return ACTION_MAP[priority];
  }

  /**
   * evaluateItem(input) — 판정 순수 함수.
   * 빈 문자열/공백만 있는 입력은 예외를 던진다(03A_test_answers.md 답변 5 확정 사항).
   */
  function evaluateItem(input) {
    if (input === undefined || input === null) {
      throw new Error("요청 내용을 입력해주세요.");
    }
    var normalized = normalize(input);
    if (normalized.length === 0) {
      throw new Error("요청 내용을 입력해주세요.");
    }

    var priority = determinePriority(normalized);
    var role = determineRole(normalized);
    var needsReview = determineReview(priority);
    var nextAction = buildNextAction(priority);

    return {
      priority: priority,
      needsReview: needsReview,
      role: role,
      nextAction: nextAction
    };
  }

  var api = {
    evaluateItem: evaluateItem,
    PRIORITY_RULES: PRIORITY_RULES,
    ROLE_RULES: ROLE_RULES,
    ACTION_MAP: ACTION_MAP
  };

  // Node/브라우저 이중 노출 가드(계획서 4·6절 — 향후 테스트 재사용 목적).
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.evaluateItem = evaluateItem;
    root.rulesApi = api;
  }
})(typeof window !== "undefined" ? window : this);
