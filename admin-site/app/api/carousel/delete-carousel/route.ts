import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (typeof id !== "number") {
      return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL}/carousel/delete?id=${id}`;

    const response = await fetch(apiUrl, { method: "DELETE" });

    if (response.ok) {
      return NextResponse.json({ success: true, message: "Carousel deleted successfully" });
    } else {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.message || "Failed to delete carousel" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error deleting carousel:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
