import { NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/");
  const idStr = segments[segments.length - 1];

  if (!idStr) {
    return NextResponse.json({ error: "Product ID is missing" }, { status: 400 });
  }

  const id = parseInt(idStr, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "data", "db.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  const data: { products: Product[] } = JSON.parse(jsonData);

  const product = data.products.find((p) => p.id === id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
