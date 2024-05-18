export const getPoolAssetsFromType = (type: string) => {
  return type.substring(type.indexOf("<") + 1, type.lastIndexOf(">"));
};
