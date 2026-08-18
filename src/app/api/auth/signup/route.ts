import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { readDB, writeDB } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const data = await readDB();
    const exists = data.users.find((u) => u.email === email);
    if (exists) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const newId = data.users.length > 0 ? Math.max(...data.users.map((u) => u.id)) + 1 : 0;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: newId,
      name,
      email,
      password: hashedPassword,
      role: "user" as const,
      createdAt: new Date().toISOString(),
    };
    data.users.push(newUser);

    await writeDB(data);

    return NextResponse.json({ message: "Signup successful" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
