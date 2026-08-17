import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "data", "db.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  const exists = data.users.find((u: { email: string }) => u.email === email);
  if (exists) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const newUser = { id: data.users.length, email, password, role: "user" };
  data.users.push(newUser);

  await fs.writeFile(filePath, JSON.stringify(data, null, 2));

  return NextResponse.json({ message: "Signup successful" }, { status: 201 });
}
