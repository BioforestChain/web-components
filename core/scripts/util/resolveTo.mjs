import { fileURLToPath } from "node:url";
import path from "node:path";
/**
 *
 * @param {string} baseUrl
 */
export const createResolveTo = (baseUrl) => {
  /**
   *
   * @param {string} somepath
   */
  const resolveTo = (somepath) => {
    return path.resolve(path.dirname(fileURLToPath(baseUrl)), somepath);
  };
  return resolveTo;
};
