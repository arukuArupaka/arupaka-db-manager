import { DataTable } from "@/components/dashboard/data-table"
import { columns } from "@/components/dashboard/users/columns"
import { users } from "@/components/dashboard/users/data"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Info</h1>
        <p className="text-muted-foreground">Manage and view all users registered in the app.</p>
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  )
}

