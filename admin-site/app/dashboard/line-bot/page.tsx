"use client";
import { useEffect, useState } from "react";
import {
  columns,
  Schedule,
  ScreenScheduleData,
} from "@/components/dashboard/line-bot/columns";
import { getAllSchedules } from "@/lib/api/lineBot";
import {
  convertWeekdayToString,
  formatTwoDigits,
} from "@/functions/line-bot/utils/data";
import { DataTable } from "./data-table";

export default function LineBotPage() {
  const [schedulesMap, setSchedulesMap] = useState<
    Map<string, ScreenScheduleData>
  >(new Map());

  const fetchSchedules = async () => {
    const schedules = await getAllSchedules();
    const formattedSchedules: Map<string, ScreenScheduleData> = new Map(
      schedules.map((schedule) => {
        const weekday = schedule.weekday ?? "不明";
        const hour = schedule.hour ?? "不明";
        const minute = schedule.minute ?? "不明";

        return [
          schedule.scheduleId,
          {
            ...schedule,
            executeTime: `毎週${convertWeekdayToString(
              weekday
            )}曜日 ${formatTwoDigits(hour)}:${formatTwoDigits(minute)}`,
          },
        ];
      })
    );
    setSchedulesMap(formattedSchedules);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="relative h-full w-full p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">LINEBOT</h1>
        <p className="text-muted-foreground">
          Manage carousel items in the app.
        </p>
      </div>
      <DataTable<ScreenScheduleData, unknown>
        columns={columns}
        data={Array.from(schedulesMap.values())}
        schedulesMap={schedulesMap}
        from="line-bot"
        fetchSchedules={fetchSchedules}
      />
    </div>
  );
}
