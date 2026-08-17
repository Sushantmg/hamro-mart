import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const data = await readDB();
  const user = data.users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = user.role === "admin" ? "admin" : `user-${user.id}`;

  return NextResponse.json({ token, user: { id: user.id, email: user.email, role: user.role } });
}
