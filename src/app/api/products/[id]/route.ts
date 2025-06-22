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

// The GET function has a typed context parameter that includes params
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const filePath = path.join(process.cwd(), "data", "db.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  const data: { products: Product[] } = JSON.parse(jsonData);

  const product = data.products.find((p) => p.id === parseInt(id, 10));

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
