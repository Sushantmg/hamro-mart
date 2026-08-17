import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "data", "db.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  const user = data.users.find(
    (u: { email: string; password: string }) => u.email === email && u.password === password
  );

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = user.role === "admin" ? "admin" : `user-${user.id}`;

  return NextResponse.json({ token, user: { id: user.id, email: user.email, role: user.role } });
}
