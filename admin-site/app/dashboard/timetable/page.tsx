import { DataTable } from "@/components/dashboard/data-table"
import { columns } from "@/components/dashboard/timetable/columns"
import { timetables } from "@/components/dashboard/timetable/data"

export default function TimetablePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
        <p className="text-muted-foreground">Manage and view all timetables in the system.</p>
      </div>
      <DataTable columns={columns} data={timetables} />
    </div>
  )
}

