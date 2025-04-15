import { ARUPAKA_DB_MANAGER_URL } from "@/env";
import { Schedule } from "@/components/dashboard/line-bot/columns";

export async function getAllSchedules(): Promise<Schedule[]> {
  const res = await fetch(
    `${ARUPAKA_DB_MANAGER_URL}/line-bot/get-all-schedule`
  );
  if (!res.ok) throw new Error("ネットワーク応答に問題がありました");

  const data: Schedule[] = await res.json();
  return data;
}
