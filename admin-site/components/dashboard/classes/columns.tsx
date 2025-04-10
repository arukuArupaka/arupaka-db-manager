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
import { Badge } from "@/components/ui/badge";
import { Lecture } from "@/components/interface/Lecture";

export const columns: ColumnDef<Lecture>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "classCode",
    header: "Class Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "credits",
    header: "Credits",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "field",
    header: "Field",
  },
  {
    accessorKey: "syllabus",
    header: "Syllabus",
  },
  {
    accessorKey: "teacher",
    header: "Teacher",
  },
  {
    accessorKey: "academic",
    header: "Academic",
  },
  {
    accessorKey: "schoolYear",
    header: "School Year",
  },
  {
    accessorKey: "semester",
    header: "Semester",
  },
  {
    accessorKey: "weekday",
    header: "Weekday",
  },
  {
    accessorKey: "period",
    header: "Period",
  },
  {
    accessorKey: "campus",
    header: "Campus",
  },
  {
    accessorKey: "rawClassroom",
    header: "Raw Classroom",
  },
  {
    accessorKey: "feedbacks",
    header: "Feedbacks",
  },
  {
    accessorKey: "lectureClassrooms",
    header: "Lecture Classrooms",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const classItem = row.original;

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
            <DropdownMenuItem>Edit class</DropdownMenuItem>
            <DropdownMenuItem>View roster</DropdownMenuItem>
            <DropdownMenuItem>Cancel class</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
