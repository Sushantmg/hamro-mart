import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET() {
  const data = await readDB();
  const safeUsers = data.users.map((u) => ({ id: u.id, email: u.email, role: u.role }));
  return NextResponse.json(safeUsers);
}
