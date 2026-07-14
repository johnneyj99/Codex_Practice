/**
 * file-smoke: 필수 파일 존재 + index.html에 data-testid 5개 존재 확인.
 * Node 기본 모듈만 사용(fs, path, assert). 외부 npm 금지.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const ROOT = path.join(__dirname, "..");

const REQUIRED_FILES = [
  "index.html",
  "package.json",
  "src/app.js",
  "src/rules.js",
  "src/styles.css"
];

const REQUIRED_TEST_IDS = [
  "app-root",
  "input-main",
  "submit-button",
  "result-list",
  "status-message"
];

function run() {
  REQUIRED_FILES.forEach((relPath) => {
    const fullPath = path.join(ROOT, relPath);
    assert.ok(fs.existsSync(fullPath), "Required file missing: " + relPath);
  });

  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

  REQUIRED_TEST_IDS.forEach((testId) => {
    const pattern = new RegExp('data-testid=["\']' + testId + '["\']');
    assert.ok(pattern.test(html), 'Missing data-testid="' + testId + '" in index.html');
  });

  console.log("file-smoke: ALL TESTS PASSED");
}

if (require.main === module) {
  run();
}

module.exports = { run: run };
