import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, category, image, desc, price, discount } = body;

  if (!name || !category || !price) {
    return NextResponse.json({ error: "Name, category, and price are required" }, { status: 400 });
  }

  const data = await readDB();
  const newId = data.products.length > 0 ? Math.max(...data.products.map((p) => p.id)) + 1 : 1;

  const newProduct = {
    id: newId,
    name,
    category,
    image: image || "",
    desc: desc || "",
    price: Number(price),
    discount: Number(discount) || 0,
  };

  data.products.push(newProduct);
  await writeDB(data);

  return NextResponse.json(newProduct, { status: 201 });
}
