import { readFileSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const filePath = path.join(process.cwd(), "data", "db.json");
  const jsonData = readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  const product = data.products.find((p: any) => p.id === parseInt(params.id));

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
