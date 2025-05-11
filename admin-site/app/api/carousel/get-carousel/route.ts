import { NextResponse } from "next/server";
import { Carousel } from "@/components/interface/Carousel";

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL}/carousel/get_all`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch carousel data: ${response.statusText}`);
    }

    const data: Carousel[] = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching carousel data:", error);
    return NextResponse.json({ error: "Failed to fetch carousel data" }, { status: 500 });
  }
}
