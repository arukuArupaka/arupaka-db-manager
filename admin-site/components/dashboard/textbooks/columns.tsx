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

export type Textbook = {
  id: string
  title: string
  author: string
  course: string
  price: number
  condition: "new" | "like new" | "good" | "fair"
  seller: string
  listedDate: string
  status: "available" | "sold" | "pending"
}

export const columns: ColumnDef<Textbook>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "course",
    header: "Course",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)

      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "condition",
    header: "Condition",
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("condition")}</div>
    },
  },
  {
    accessorKey: "seller",
    header: "Seller",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "available" ? "default" : status === "pending" ? "outline" : "secondary"}>
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const textbook = row.original

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
            <DropdownMenuItem>Contact seller</DropdownMenuItem>
            <DropdownMenuItem>Mark as sold</DropdownMenuItem>
            <DropdownMenuItem>Remove listing</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

