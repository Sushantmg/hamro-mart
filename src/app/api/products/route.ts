import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  desc: string;
  price: number;
  discount: number;
}

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "db.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  const data: { products: Product[] } = JSON.parse(jsonData);

  return NextResponse.json(data.products);
}
