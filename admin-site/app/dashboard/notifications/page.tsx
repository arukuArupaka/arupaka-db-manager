import { DataTable } from "@/components/dashboard/data-table"
import { columns } from "@/components/dashboard/notifications/columns"
import { notifications } from "@/components/dashboard/notifications/data"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Push Notifications</h1>
        <p className="text-muted-foreground">Manage and send push notifications to app users.</p>
      </div>
      <DataTable columns={columns} data={notifications} />
    </div>
  )
}

