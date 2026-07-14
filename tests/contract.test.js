/**
 * contract: src/rules.js의 evaluateItem(input) 계약 검증.
 * 근거: agent_shared/specs/05_mvp_implementation_plan.md 5절,
 *       agent_shared/reports/03A_test_answers.md.
 * Node 기본 모듈만 사용(assert). 외부 npm 금지.
 */
"use strict";

const assert = require("assert");
const { evaluateItem } = require("../src/rules.js");

function run() {
  // 빈/공백 입력 → 예외 (03A_test_answers.md 답변 5)
  assert.throws(() => evaluateItem(""), "Empty string should throw");
  assert.throws(() => evaluateItem("   "), "Whitespace-only input should throw");

  // P0 경계
  const p0 = evaluateItem("결제 서버 500 에러로 서비스 down");
  assert.strictEqual(p0.priority, "P0", "500/down should classify as P0");
  assert.strictEqual(p0.needsReview, true, "P0 requires review");
  assert.strictEqual(typeof p0.nextAction, "string");
  assert.ok(p0.nextAction.length > 0);

  // P1 경계
  const p1 = evaluateItem("로그인 버튼 클릭 시 간헐적 bug");
  assert.strictEqual(p1.priority, "P1", "bug keyword should classify as P1");
  assert.strictEqual(p1.needsReview, true, "P1 requires review");

  // P2 기본 (장애 키워드 없음)
  const p2 = evaluateItem("버튼 색상 변경 요청");
  assert.strictEqual(p2.priority, "P2", "no incident keywords should default to P2");
  assert.strictEqual(p2.needsReview, false, "P2 does not require review");

  // 역할 매핑
  const fe = evaluateItem("버튼 색상 변경(CSS)");
  assert.strictEqual(fe.role, "Frontend");

  const be = evaluateItem("DB 인덱스 추가 및 API 응답 개선");
  assert.strictEqual(be.role, "Backend");

  // 결과 필드 존재 확인 (ClassifyResult 계약)
  const result = evaluateItem("crash 발생");
  assert.ok(Object.prototype.hasOwnProperty.call(result, "priority"));
  assert.ok(Object.prototype.hasOwnProperty.call(result, "needsReview"));
  assert.ok(Object.prototype.hasOwnProperty.call(result, "role"));
  assert.ok(Object.prototype.hasOwnProperty.call(result, "nextAction"));

  // 결정성: 동일 입력 → 동일 결과
  const again = evaluateItem("crash 발생");
  assert.deepStrictEqual(result, again, "same input must yield same result");

  console.log("contract: ALL TESTS PASSED");
}

if (require.main === module) {
  run();
}

module.exports = { run: run };
