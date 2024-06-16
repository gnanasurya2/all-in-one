export const movieStartTime = (duration: string) => {
  const time = parseInt(duration.split(' ')[0]);
  const startDate = new Date();
  startDate.setMinutes(startDate.getMinutes() - time);
  return startDate;
};
