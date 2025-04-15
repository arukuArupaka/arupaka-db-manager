import { DataTable } from "@/components/dashboard/data-table"
import { columns } from "@/components/dashboard/classes/columns"
import { classes } from "@/components/dashboard/classes/data"

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Class List</h1>
        <p className="text-muted-foreground">Manage and view all classes in the system.</p>
      </div>
      <DataTable columns={columns} data={classes} />
    </div>
  )
}

