export const chunkArray = <T>(chunkSize: number, array: T[]): T[][] => {
  return Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, i) => {
    return array.slice(i * chunkSize, (i + 1) * chunkSize);
  });
};
