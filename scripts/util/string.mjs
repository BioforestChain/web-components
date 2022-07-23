export const toCamelCase = (name) => {
  return name.replace(/[\-\_]\w/g, (s) => s[1].toUpperCase()).replace(/^\w/, (s) => s.toUpperCase());
};
