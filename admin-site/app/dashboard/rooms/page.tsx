import { DataTable } from "@/components/dashboard/data-table"
import { columns } from "@/components/dashboard/rooms/columns"
import { rooms } from "@/components/dashboard/rooms/data"

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Room List</h1>
        <p className="text-muted-foreground">Manage and view all rooms in the system.</p>
      </div>
      <DataTable columns={columns} data={rooms} />
    </div>
  )
}

