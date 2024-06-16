export const movieStartTime = (duration: string) => {
  if (duration === 'N/A') {
    duration = '0';
  }
  const time = parseInt(duration.split(' ')[0]);
  const startDate = new Date();
  startDate.setMinutes(startDate.getMinutes() - time);
  return startDate;
};
