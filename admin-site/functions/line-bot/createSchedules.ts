export const createSchedules = async (
  weekday: number,
  hour: number,
  minute: number,
  description: string,
  message: string,
  category: string,
  fetchSchedules: (method?: string) => Promise<void>,
  resultSendWeekday?: number,
  resultSendHour?: number,
  resultSendMinute?: number
): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ARUPAKA_DB_MANAGER_URL}/line-bot/create-schedule`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        weekday,
        hour,
        minute,
        description,
        message,
        category,
        resultSendWeekday,
        resultSendHour,
        resultSendMinute,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP Error ${response.status}: ${errorText} ${weekday} ${hour} ${minute} ${description} ${message}`
    );
  }

  await fetchSchedules("create");
};
