export const updateSchedules = async (
  id: string,
  weekday: number,
  hour: number,
  minute: number,
  description: string,
  message: string,
  fetchSchedules: (method?: string) => Promise<void>
): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ARUPAKA_DB_MANAGER_URL}/line-bot/update-schedule`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        id,
        weekday,
        hour,
        minute,
        description,
        message,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP Error ${response.status}: ${errorText} ${weekday} ${hour} ${minute} ${description} ${message}`
    );
  }

  await fetchSchedules("update");
};
