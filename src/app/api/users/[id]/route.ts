import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const body = await request.json();
  const data = await readDB();

  const index = data.users.findIndex((u) => u.id === userId);
  if (index === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  data.users[index] = { ...data.users[index], ...body, id: userId };
  await writeDB(data);

  const user = data.users[index];
  return NextResponse.json({ id: user.id, email: user.email, role: user.role });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const data = await readDB();
  const index = data.users.findIndex((u) => u.id === userId);
  if (index === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  data.users.splice(index, 1);
  await writeDB(data);

  return NextResponse.json({ message: "User deleted" });
}
