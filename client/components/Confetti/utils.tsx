export const getRandomValues = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export function pickRandomItem<T>(arr: Array<T>): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
