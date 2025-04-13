"use client";

import { useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ChevronDown, Delete } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateModal from "@/app/dashboard/line-bot/createModal";
import DetailModal from "@/app/dashboard/line-bot/detailModal";
import DeleteModal from "@/app/dashboard/line-bot/deleteModal";
import { ScreenScheduleData } from "./line-bot/columns";

interface DataTableProps<TData, TValue> {
  columns: (
    setIsOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>,
    setTargetDeleteScheduleId: React.Dispatch<
      React.SetStateAction<string | null>
    >
  ) => ColumnDef<TData, TValue>[];
  data: TData[];
  from?: string;
  fetchSchedules: (method?: string) => Promise<void>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  from,
  fetchSchedules,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [targetDeleteScheduleId, setTargetDeleteScheduleId] = useState<
    string | null
  >(null);

  const table = useReactTable({
    data,
    columns: columns(setIsDeleteModalOpen, setTargetDeleteScheduleId),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const nameColumn = table
    .getAllColumns()
    .find((column) => column.id === "name");

  return (
    <div>
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter..."
          value={
            nameColumn ? (nameColumn.getFilterValue() as string) ?? "" : ""
          }
          onChange={(event) => {
            // "name" 列が存在する場合のみ setFilterValue を呼ぶ
            if (nameColumn) {
              nameColumn.setFilterValue(event.target.value);
            }
          }}
          className="max-w-sm"
        />
        <div>
          {from === "line-bot" && (
            <Button
              variant="outline"
              size="sm"
              className="justify-self-end"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup, index) => (
              <TableRow
                key={headerGroup.id}
                onClick={
                  index !== 0 ? () => setIsDetailModalOpen(true) : undefined
                }
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <CreateModal
        isOpenModal={isCreateModalOpen}
        setIsOpenModal={setIsCreateModalOpen}
        fetchSchedules={fetchSchedules}
      />
      <DetailModal
        isOpenModal={isDetailModalOpen}
        setIsOpenModal={setIsDetailModalOpen}
      />
      <DeleteModal
        isOpenModal={isDeleteModalOpen}
        setIsOpenModal={setIsDeleteModalOpen}
        fetchSchedules={fetchSchedules}
        targetDeleteScheduleId={targetDeleteScheduleId}
      />
      <div className="flex items-center justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
