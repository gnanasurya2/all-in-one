export const changeMonth = (
  currentMonth: {month: number; year: number},
  dir: 1 | -1,
) => {
  if (dir === -1) {
    return {
      month: currentMonth.month === 0 ? 12 : currentMonth.month - 1,
      year:
        currentMonth.month === 0 ? currentMonth.year - 1 : currentMonth.year,
    };
  }
  return {
    month: currentMonth.month === 12 ? 1 : currentMonth.month + 1,
    year: currentMonth.month === 12 ? currentMonth.year + 1 : currentMonth.year,
  };
};
