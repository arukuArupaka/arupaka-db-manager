export const chunkArray = <T>(chunkSize: number): ((array: T[]) => T[][]) => {
  return (array: any[]) => {
    return Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, i) =>
      array.slice(i * chunkSize, (i + 1) * chunkSize),
    );
  };
};
