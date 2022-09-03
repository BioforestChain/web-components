// @ts-check

import fs from "node:fs";
import path from "node:path";

/**
 *
 * @param {string} dir
 * @returns {Generator<string>}
 */
export function* walkFiles(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      yield* walkFiles(full);
    } else {
      yield full;
    }
  }
}

/**
 *
 * @param {string} dir
 * @returns {Generator<string>}
 */
export function* listDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      yield full;
    }
  }
}

/**
 *
 * @param {string} dir
 * @returns {Generator<string>}
 */
export function* listFile(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isFile()) {
      yield full;
    }
  }
}
