/**
 *
 * @param {string} workspaceName
 *
 */
export const genPackageNamePrefix = (workspaceName) => {
  if (workspaceName.startsWith("@")) {
    return workspaceName + "-";
  } else {
    return `@${workspaceName}/`;
  }
};

export const getPackageNameFromPath = (importPath) => {
  if (importPath.startsWith("@")) {
    return importPath.split("/", 2).join("/");
  } else {
    return importPath.split("/", 1)[0];
  }
};
