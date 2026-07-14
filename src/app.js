/**
 * UI 배선: 입력 → evaluateItem(rules.js) 호출 → 결과 렌더링.
 * 판정 로직은 이 파일에 두지 않는다(계획서 4.2절).
 */
(function () {
  "use strict";

  var inputEl = document.getElementById("input-main");
  var buttonEl = document.getElementById("submit-button");
  var statusEl = document.getElementById("status-message");
  var resultListEl = document.getElementById("result-list");

  var PRIORITY_LABELS = {
    P0: "P0 (긴급)",
    P1: "P1 (높음)",
    P2: "P2 (일반)"
  };

  var REVIEW_LABELS = {
    true: "필요",
    false: "불필요"
  };

  function clearResult() {
    // 사용자 입력이 아닌 앱 내부 상태 초기화이므로 innerHTML 사용 없이 자식 노드를 비운다.
    while (resultListEl.firstChild) {
      resultListEl.removeChild(resultListEl.firstChild);
    }
  }

  function setStatus(message, isError) {
    statusEl.textContent = message;
    if (isError) {
      statusEl.classList.add("status-error");
    } else {
      statusEl.classList.remove("status-error");
    }
  }

  function appendResultItem(label, value, priorityClass) {
    var li = document.createElement("li");
    li.className = "result-item" + (priorityClass ? " " + priorityClass : "");

    var labelSpan = document.createElement("span");
    labelSpan.className = "result-label";
    labelSpan.textContent = label + ": ";

    var valueSpan = document.createElement("span");
    valueSpan.className = "result-value";
    valueSpan.textContent = value;

    li.appendChild(labelSpan);
    li.appendChild(valueSpan);
    resultListEl.appendChild(li);
  }

  function renderResult(result) {
    clearResult();
    var priorityClass = "priority-" + result.priority.toLowerCase();
    appendResultItem("우선순위", PRIORITY_LABELS[result.priority] || result.priority, priorityClass);
    appendResultItem("리뷰 필요 여부", REVIEW_LABELS[result.needsReview], priorityClass);
    appendResultItem("담당 역할", result.role, priorityClass);
    appendResultItem("다음 액션", result.nextAction, priorityClass);
  }

  function handleAnalyzeClick() {
    var value = inputEl.value;
    try {
      var result = window.evaluateItem(value);
      renderResult(result);
      setStatus("분석이 완료되었습니다.", false);
    } catch (err) {
      clearResult();
      setStatus(err && err.message ? err.message : "요청 내용을 입력해주세요.", true);
    }
  }

  buttonEl.addEventListener("click", handleAnalyzeClick);

  // TODO(adapter): 실제 백엔드/DB/로그인 연동이 필요해지면 이 지점에서
  // 결과 저장/이력 조회용 어댑터(fetch 등)를 연결한다.
  // 현재 MVP는 계획서(05_mvp_implementation_plan.md 3절)에 따라
  // 서버 영속화·인증을 범위에서 제외하고 mock 없이 순수 프론트엔드로만 동작한다.
})();
