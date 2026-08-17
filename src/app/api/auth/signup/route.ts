import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const data = await readDB();

  const exists = data.users.find((u) => u.email === email);
  if (exists) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const newId = data.users.length > 0 ? Math.max(...data.users.map((u) => u.id)) + 1 : 0;

  const newUser = { id: newId, email, password, role: "user" as const };
  data.users.push(newUser);

  await writeDB(data);

  return NextResponse.json({ message: "Signup successful" }, { status: 201 });
}
