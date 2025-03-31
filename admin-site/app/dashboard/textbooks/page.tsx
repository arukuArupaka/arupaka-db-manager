import { DataTable } from "@/components/dashboard/data-table"
import { columns } from "@/components/dashboard/textbooks/columns"
import { textbooks } from "@/components/dashboard/textbooks/data"

export default function TextbooksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Textbook Market</h1>
        <p className="text-muted-foreground">Manage and view all textbooks listed for sale.</p>
      </div>
      <DataTable columns={columns} data={textbooks} />
    </div>
  )
}

