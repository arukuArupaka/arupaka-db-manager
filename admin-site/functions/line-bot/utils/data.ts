export const convertWeekdayToString = (weekday: string): string => {
  const map: Record<string, string> = {
    Sunday: "日",
    Monday: "月",
    Tuesday: "火",
    Wednesday: "水",
    Thursday: "木",
    Friday: "金",
    Saturday: "土",
  };
  return map[weekday] ?? "不明";
};

export const convertExecuteTime = (
  weekday?: string,
  hour?: number,
  minute?: number
): string => {
  const day = weekday ? `毎週${convertWeekdayToString(weekday)}曜日` : "";
  const time = [
    hour?.toString().padStart(2, "0"),
    minute?.toString().padStart(2, "0"),
  ]
    .filter((v) => v !== undefined)
    .join(":");
  return [day, time].filter(Boolean).join(" ");
};

export const formatTwoDigits = (n: number): string => {
  if (n < 0) {
    return "不明";
  }
  return n.toString().padStart(2, "0");
};
