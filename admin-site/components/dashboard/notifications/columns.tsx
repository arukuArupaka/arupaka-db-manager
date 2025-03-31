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

export type Notification = {
  id: string
  title: string
  message: string
  target: "all" | "students" | "faculty" | "admins"
  sentAt: string
  status: "sent" | "scheduled" | "draft"
  sentBy: string
}

export const columns: ColumnDef<Notification>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const message = row.getValue("message") as string
      return <div className="max-w-[300px] truncate">{message}</div>
    },
  },
  {
    accessorKey: "target",
    header: "Target",
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("target")}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "sent" ? "default" : status === "scheduled" ? "outline" : "secondary"}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "sentAt",
    header: "Sent At",
  },
  {
    accessorKey: "sentBy",
    header: "Sent By",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const notification = row.original

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
            <DropdownMenuItem>Edit notification</DropdownMenuItem>
            <DropdownMenuItem>Send again</DropdownMenuItem>
            <DropdownMenuItem>Delete notification</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

