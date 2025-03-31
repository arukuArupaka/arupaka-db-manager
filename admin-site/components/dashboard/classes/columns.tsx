"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export type Class = {
  id: string
  code: string
  name: string
  instructor: string
  department: string
  schedule: string
  room: string
  capacity: number
  enrolled: number
  status: "active" | "cancelled" | "full"
}

export const columns: ColumnDef<Class>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "instructor",
    header: "Instructor",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "schedule",
    header: "Schedule",
  },
  {
    accessorKey: "room",
    header: "Room",
  },
  {
    accessorKey: "enrollment",
    header: "Enrollment",
    cell: ({ row }) => {
      const enrolled = row.original.enrolled
      const capacity = row.original.capacity
      return <div>{`${enrolled}/${capacity}`}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "active" ? "default" : status === "full" ? "outline" : "secondary"}>{status}</Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const classItem = row.original

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
      )
    },
  },
]

