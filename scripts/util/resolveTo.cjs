const path = require("node:path");
/**
 *
 * @param {string} baseUrl
 */
const createResolveTo = dirname => {
  /**
   *
   * @param {string} somepath
   */
  const resolveTo = somepath => {
    return path.resolve(dirname, somepath);
  };
  return resolveTo;
};
exports.createResolveTo = createResolveTo;
