import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET() {
  const data = await readDB();
  const categories = [...new Set(data.products.map((p) => p.category))];
  return NextResponse.json(categories);
}
