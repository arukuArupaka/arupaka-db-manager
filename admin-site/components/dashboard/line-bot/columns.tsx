"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export type Schedule = {
  id: string;
  scheduleId: string;
  description: string;
  minute: number;
  hour: number;
  weekday: string;
  message: string;
};

export const columns: ColumnDef<Schedule>[] = [
  {
    accessorKey: "scheduleId",
    header: "Schedule ID",
  },
  {
    accessorKey: "description",
    header: "description",
  },
  {
    accessorKey: "executeTime",
    header: "Execute Time",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const timetable = row.original;

      // アクション用の関数を定義
      const handleDelete = () => {
        console.log("Delete action triggered for timetable:", timetable.id);
        // ここで削除処理を実装（例: API呼び出し、状態更新など）
      };

      const handleEdit = () => {
        console.log("Edit action triggered for timetable:", timetable.id);
        // ここで編集処理を実装（例: モーダルを表示、フォームへ遷移など）
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
