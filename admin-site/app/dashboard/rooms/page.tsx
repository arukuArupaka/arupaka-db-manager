import { DataTable } from "@/components/dashboard/data-table";
import { columns } from "@/components/dashboard/rooms/columns";
import { ClassRoom } from "@/components/interface/ClassRoom";
import { LOCAL_DATABASE_URL } from "@/env";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function RoomsPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    redirect("/");
  }
  //教室を取得するエンドポイントをfetch(まだないけど)
  try {
    const res = await fetch(`${LOCAL_DATABASE_URL}/`, {
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch textbooks: ${res.status}`);
    }

    const rooms: ClassRoom[] = await res.json();
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room List</h1>
          <p className="text-muted-foreground">Manage and view all rooms in the system.</p>
        </div>
        {/* fetchした教室をdataに入れる */}
        <DataTable columns={columns} data={rooms} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching textbooks:", error);
  }
}
