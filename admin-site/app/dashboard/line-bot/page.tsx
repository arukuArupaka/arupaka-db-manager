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
  const fetchSchedules = async (method?: string): Promise<void> => {
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

    console.log("data", data);

    const convertExecuteTime = (
      weekday: string,
      hour: number,
      minute: number
    ) => {
      if (hour === undefined || hour === null) {
        return `毎週${convertWeekdayToString(weekday)}曜日 ${minute
          .toString()
          .padStart(2, "0")}`;
      }
      if (minute === undefined || minute === null) {
        return `毎週${convertWeekdayToString(weekday)}曜日 ${hour
          .toString()
          .padStart(2, "0")}`;
      }
      if (weekday === undefined || weekday === null) {
        return `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
      }
      return `毎週${convertWeekdayToString(weekday)}曜日 ${hour
        .toString()
        .padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    };

    const formattedSchedules = data.map((el: Schedule) => ({
      id: el.id,
      scheduleId: el.scheduleId,
      description: el.description,
      executeTime: `毎週${convertWeekdayToString(el.weekday)}曜日 ${
        el.hour === undefined || el.hour === null
          ? null
          : el.hour.toString().padStart(2, "0")
      }:${el.minute.toString().padStart(2, "0")}`,
      message: el.message,
    }));

    if (method === "create") {
      setSchedules((prev) => {
        // 新旧のスケジュールを結合する
        const merged = [...prev, ...formattedSchedules];
        // scheduleId をキーとしてマップに格納（同じキーがあれば上書き）
        const uniqueMap = merged.reduce((map, schedule) => {
          map.set(schedule.scheduleId, schedule);
          return map;
        }, new Map<string, (typeof formattedSchedules)[0]>());
        // Map の値だけの配列を返す
        return Array.from(uniqueMap.values());
      });
    } else if (method === "delete" || method === null || method === undefined) {
      setSchedules(formattedSchedules);
    }
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
        fetchSchedules={fetchSchedules}
      />
    </div>
  );
}
