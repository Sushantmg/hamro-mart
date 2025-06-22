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

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const filePath = path.join(process.cwd(), "data", "db.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  const product = data.products.find((p: Product) => p.id === parseInt(params.id));

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
