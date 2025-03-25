/* eslint-disable prettier/prettier */
export function convertFullwidthDigitsToHalfwidth(input: string): string {
  return input.replace(/[０-９]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
  });
}
