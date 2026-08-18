import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET() {
  const data = await readDB();
  const safeUsers = data.users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }));
  return NextResponse.json(safeUsers);
}
