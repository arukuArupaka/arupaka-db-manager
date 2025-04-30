import { DataTable } from "@/components/dashboard/data-table";
import { columns } from "@/components/dashboard/rooms/columns";
import { ClassRoom } from "@/components/interface/ClassRoom";
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
    const mockClassRooms: ClassRoom[] = [
      {
        id: 1,
        buildingId: 101,
        name: "101A",
        building: "Main Building",
        lectureClassRooms: ["Math 101", "Physics 201"],
      },
      {
        id: 2,
        buildingId: 102,
        name: "102B",
        building: "Science Hall",
        lectureClassRooms: ["Biology 101", "Chemistry 102"],
      },
      {
        id: 3,
        buildingId: 103,
        name: "103C",
        building: "Engineering Complex",
        lectureClassRooms: ["Mechanics 201", "Thermodynamics"],
      },
      {
        id: 4,
        buildingId: 104,
        name: "104D",
        building: "Liberal Arts",
        lectureClassRooms: ["History 101", "Philosophy 110"],
      },
      {
        id: 5,
        buildingId: 105,
        name: "105E",
        building: "Business School",
        lectureClassRooms: ["Marketing 101", "Finance 201"],
      },
    ];

    return (
      <div className="relative h-full w-full p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room List</h1>
          <p className="text-muted-foreground">
            Manage and view all rooms in the system.
          </p>
        </div>
        {/* fetchした教室をdataに入れる */}
        <DataTable columns={columns} data={mockClassRooms} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching textbooks:", error);
  }
}
