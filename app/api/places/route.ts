import { getAllPlaces } from "@/lib/content";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const places = await getAllPlaces();
    return NextResponse.json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    return NextResponse.json({ error: "Failed to load places" }, { status: 500 });
  }
}
