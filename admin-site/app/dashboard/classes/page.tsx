import { DataTable } from "@/components/dashboard/data-table";
import { columns } from "@/components/dashboard/classes/columns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LOCAL_DATABASE_URL } from "@/env";
import { Lecture } from "@/components/interface/Lecture";

export default async function ClassesPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    redirect("/");
  }
  //授業を取得するエンドポイントをfetch(まだないけど)
  try {
    /*     const res = await fetch(`${LOCAL_DATABASE_URL}/`, {
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch textbooks: ${res.status}`);
    }

    const classes: Lecture[] = await res.json(); */
    const mockLectures: Lecture[] = [
      {
        id: 1,
        classCode: 101,
        name: "Introduction to Liberal Arts",
        credits: 3,
        category: "Core",
        field: "Humanities",
        syllabus: "https://example.com/syllabus/101",
        teacher: "John Doe",
        academic: "LiberalArts",
        schoolYear: 1,
        semester: "Spring",
        weekday: "Monday",
        period: 1,
        feedbacks: ["Engaging lectures", "Very informative"],
        campus: "KIC",
        rawClassroom: "Room 101",
        lectureClassrooms: ["Room 101", "Room 102"],
      },
      {
        id: 2,
        classCode: 102,
        name: "Business Management Basics",
        credits: 4,
        category: "Elective",
        field: "Business",
        syllabus: "https://example.com/syllabus/102",
        teacher: "Jane Smith",
        academic: "Business",
        schoolYear: 2,
        semester: "Autumn",
        weekday: "Wednesday",
        period: 3,
        feedbacks: ["Practical examples", "Great teacher"],
        campus: "OIC",
        rawClassroom: "Room 202",
        lectureClassrooms: ["Room 202"],
      },
      {
        id: 3,
        classCode: 103,
        name: "Science and Technology Overview",
        credits: 3,
        category: "Core",
        field: "Science",
        syllabus: "https://example.com/syllabus/103",
        teacher: "Albert Newton",
        academic: "ScienceAndTechnology",
        schoolYear: 1,
        semester: "Spring",
        weekday: "Friday",
        period: 2,
        feedbacks: ["Very practical", "Good examples"],
        campus: "BKC",
        rawClassroom: "Room 303",
        lectureClassrooms: ["Room 303", "Room 304"],
      },
      {
        id: 4,
        classCode: 104,
        name: "Introduction to Psychology",
        credits: 2,
        category: "Core",
        field: "Psychology",
        syllabus: "https://example.com/syllabus/104",
        teacher: "Sarah Connor",
        academic: "Psychology",
        schoolYear: 3,
        semester: "Autumn",
        weekday: "Tuesday",
        period: 4,
        feedbacks: ["Insightful", "Well-structured"],
        campus: "KIC",
        rawClassroom: "Room 401",
        lectureClassrooms: ["Room 401"],
      },
    ];
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class List</h1>
          <p className="text-muted-foreground">Manage and view all classes in the system.</p>
        </div>
        <DataTable columns={columns} data={mockLectures} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching textbooks:", error);
  }
}
