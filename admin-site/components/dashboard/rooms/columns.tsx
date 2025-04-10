"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClassRoom } from "@/components/interface/ClassRoom";

export const columns: ColumnDef<ClassRoom>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "buildingId",
    header: "BuildingId",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "building",
    header: "Building",
  },
  {
    accessorKey: "lectureClassRooms",
    header: "LectureClassRooms",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const room = row.original;

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
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit room</DropdownMenuItem>
            <DropdownMenuItem>View schedule</DropdownMenuItem>
            <DropdownMenuItem>Mark as maintenance</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
