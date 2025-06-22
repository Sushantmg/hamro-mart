import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

interface User {
  id: number;
  email: string;
  password: string;
}

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "db.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  const data: { users: User[] } = JSON.parse(jsonData);

  return NextResponse.json(data.users);
}
