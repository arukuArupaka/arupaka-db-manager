"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { columns } from "@/components/dashboard/line-bot/columns";
import { Schedule } from "@/components/dashboard/line-bot/columns";
import { ARUPAKA_DB_MANAGER_URL } from "@/env";
import { useEffect, useState } from "react";

export default function lineBotPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
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

    setSchedules(await response.json());
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">LINEBOT</h1>
        <p className="text-muted-foreground">
          Manage and edit carousel items displayed in the app.
        </p>
      </div>
      <DataTable<Schedule, unknown>
        columns={columns}
        data={schedules as unknown as Schedule[]}
      />
    </div>
  );
}
