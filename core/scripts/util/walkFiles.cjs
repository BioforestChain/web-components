// @ts-check

const fs = require("node:fs");
const path = require("node:path");

/**
 *
 * @param {string} dir
 * @returns {Generator<string>}
 */
exports.walkFiles = function* walkFiles(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      yield* walkFiles(full);
    } else {
      yield full;
    }
  }
};

/**
 *
 * @param {string} dir
 * @returns {Generator<string>}
 */
exports.listDir = function* listDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      yield full;
    }
  }
};

/**
 *
 * @param {string} dir
 * @returns {Generator<string>}
 */
exports.listFile = function* listFile(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isFile()) {
      yield full;
    }
  }
};
