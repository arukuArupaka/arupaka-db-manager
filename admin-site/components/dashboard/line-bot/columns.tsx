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

export interface Schedule {
  id: string;
  scheduleId: string;
  description: string;
  minute: number;
  hour: number;
  weekday: string;
  message: string;
}

export interface ScreenScheduleData extends Schedule {
  executeTime: string;
}

export const columns = (
  setIsOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>,
  setIsOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>,
  setTargetSchedule: React.Dispatch<
    React.SetStateAction<ScreenScheduleData | null>
  >,
  schedulesMap: Map<string, ScreenScheduleData>
): ColumnDef<ScreenScheduleData>[] => [
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
    accessorKey: "message",
    header: "Message",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const schedule = row.original;

      // アクション用の関数を定義
      const handleDelete = () => {
        console.log(
          "Delete action triggered for timetable:",
          schedule.scheduleId
        );
        setTargetSchedule(schedule);
        setIsOpenDeleteModal(true);
      };

      const handleEdit = () => {
        console.log(
          "Edit action triggered for timetable:",
          schedule.scheduleId
        );
        setTargetSchedule(schedulesMap.get(schedule.scheduleId) ?? null);
        setIsOpenUpdateModal(true);
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
