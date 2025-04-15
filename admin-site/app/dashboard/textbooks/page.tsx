import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/dashboard/data-table";
import { columns } from "@/components/dashboard/textbooks/columns";
import { ARUPAKA_DB_URL } from "@/env";

export default async function TextbooksPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  if (!token) {
    redirect("/");
  }

  try {
    const res = await fetch(`${ARUPAKA_DB_URL}/listing_item/get_all`, {
      headers: {
        Authorization: token,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch textbooks: ${res.status}`);
    }

    const textBooks = await res.json();

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Textbook Market</h1>
          <p className="text-muted-foreground">
            Manage and view all textbooks listed for sale.
          </p>
        </div>
        <DataTable columns={columns} data={textBooks} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching textbooks:", error);
  }
}
