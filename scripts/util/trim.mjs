/**
 *
 * @param {string} text
 * @returns
 */
export const trimLines = (text) => {
  return text
    .split("\n")
    .map((l) => l.trim())
    .join("\n");
};
