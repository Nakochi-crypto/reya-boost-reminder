export const now = new Date();

export const yesterday = (() => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
})();
