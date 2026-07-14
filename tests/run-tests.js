/**
 * run-tests: file-smoke + contract 실행 후 결과를
 * ../../agent_shared/logs/practice2_test.log 에 저장.
 * 마지막 줄에 RESULT: PRACTICE2_TEST_PASS 또는 RESULT: PRACTICE2_TEST_FAIL 기록.
 * Node 기본 모듈만 사용(fs, path). 외부 npm 금지.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const LOG_PATH = path.join(__dirname, "..", "..", "agent_shared", "logs", "practice2_test.log");

const suites = [
  { name: "file-smoke", mod: require("./file-smoke.test.js") },
  { name: "contract", mod: require("./contract.test.js") }
];

const lines = [];
function log(msg) {
  lines.push(msg);
  console.log(msg);
}

let allPassed = true;

log("Practice2 Test Run (tests/run-tests.js)");
log("");

suites.forEach((suite) => {
  log("--- " + suite.name + " ---");
  try {
    suite.mod.run();
    log(suite.name + ": PASS");
  } catch (err) {
    allPassed = false;
    log(suite.name + ": FAIL");
    log("  " + (err && err.stack ? err.stack : String(err)));
  }
  log("");
});

log(allPassed ? "RESULT: PRACTICE2_TEST_PASS" : "RESULT: PRACTICE2_TEST_FAIL");

fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
fs.writeFileSync(LOG_PATH, lines.join("\n") + "\n", "utf8");

if (!allPassed) {
  process.exitCode = 1;
}
