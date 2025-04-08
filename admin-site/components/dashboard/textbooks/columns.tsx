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
import { TextBook } from "@/components/interface/TextBook";

export const columns: ColumnDef<TextBook>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "documentId",
    header: "DocumentId",
  },
  {
    accessorKey: "purchasedAt",
    header: "PurchasedAt",
  },
  {
    accessorKey: "purchasedUserId",
    header: "PurchasedUserId",
  },
  {
    accessorKey: "condition",
    header: "Condition",
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "firebaseUserId",
    header: "FirebaseUserId",
  },
  {
    accessorKey: "imageUrls",
    header: "ImageUrls",
    cell: ({ row }) => {
      const imageUrls = row.getValue("imageUrls") as string[];
      return <img src={imageUrls[0]} style={{ height: 150 }} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
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
      );
    },
  },
];
