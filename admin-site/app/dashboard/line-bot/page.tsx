"use client";

import { DataTable } from "@/components/dashboard/data-table";
import {
  columns,
  ScreenScheduleData,
} from "@/components/dashboard/line-bot/columns";
import { Schedule } from "@/components/dashboard/line-bot/columns";
import { ARUPAKA_DB_MANAGER_URL } from "@/env";
import { useEffect, useState } from "react";

export default function lineBotPage() {
  const [schedules, setSchedules] = useState<ScreenScheduleData[]>([]);
  const convertWeekdayToString = (weekday: string): string => {
    switch (weekday) {
      case "Sunday":
        return "日";
      case "Monday":
        return "月";
      case "Tuesday":
        return "火";
      case "Wednesday":
        return "水";
      case "Thursday":
        return "木";
      case "Friday":
        return "金";
      case "Saturday":
        return "土";
      default:
        return "不明";
    }
  };
  const fetchSchedules = async (): Promise<void> => {
    const response = await fetch(
      `${ARUPAKA_DB_MANAGER_URL}/line-bot/get-all-schedule`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        },
      }
    );

    if (!response.ok) {
      throw new Error("ネットワーク応答に問題がありました");
    }

    const data: Schedule[] = await response.json();

    const formattedSchedules = data.map((el: Schedule) => ({
      id: el.id,
      scheduleId: el.scheduleId,
      description: el.description,
      executeTime: `毎週${convertWeekdayToString(el.weekday)}曜日 ${el.hour}:${
        el.minute
      }`,
      message: el.message,
    }));
    setSchedules(formattedSchedules);
  };
  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="relative h-full w-full p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">LINEBOT</h1>
        <p className="text-muted-foreground">
          Manage and edit carousel items displayed in the app.
        </p>
      </div>
      <DataTable<Schedule, unknown>
        columns={columns}
        data={schedules as unknown as Schedule[]}
        from="line-bot"
      />
    </div>
  );
}
