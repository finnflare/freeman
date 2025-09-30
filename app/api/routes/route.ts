import { getAllRoutes } from "@/lib/content";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const routes = await getAllRoutes();
    return NextResponse.json(routes);
  } catch (error) {
    console.error("Error fetching routes:", error);
    return NextResponse.json({ error: "Failed to load routes" }, { status: 500 });
  }
}
