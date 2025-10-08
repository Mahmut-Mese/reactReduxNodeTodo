export const excerpt = (str: string, count: number): string => {
  if (str.length > count) {
    str = str.substring(0, count) + " ...";
  }
  return str;
};
