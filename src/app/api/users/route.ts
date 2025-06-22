import { readFileSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "db.json");
  const jsonData = readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData);
  return NextResponse.json(data.users);
}
