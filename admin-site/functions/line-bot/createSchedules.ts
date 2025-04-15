import { ARUPAKA_DB_MANAGER_URL } from "@/env";

export const createSchedules = async (
  weekday: number,
  hour: number,
  minute: number,
  description: string,
  message: string,
  fetchSchedules: (method?: string) => Promise<void>
): Promise<void> => {
  const response = await fetch(
    `${ARUPAKA_DB_MANAGER_URL}/line-bot/create-schedule`,
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
