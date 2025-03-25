/* eslint-disable prettier/prettier */
/**
 * 文字列から日本語を削除する関数
 * @param input
 * @returns
 */
export const removeJapanese = (input: string): string => {
  const result = input.replace(/[一-龯ぁ-んァ-ンー・]/g, '');
  return result;
};
