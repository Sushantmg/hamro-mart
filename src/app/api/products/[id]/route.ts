import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const data = await readDB();
  const product = data.products.find((p) => p.id === productId);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const body = await request.json();
  const data = await readDB();

  const index = data.products.findIndex((p) => p.id === productId);
  if (index === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  data.products[index] = { ...data.products[index], ...body, id: productId };
  await writeDB(data);

  return NextResponse.json(data.products[index]);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const data = await readDB();
  const index = data.products.findIndex((p) => p.id === productId);
  if (index === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  data.products.splice(index, 1);
  await writeDB(data);

  return NextResponse.json({ message: "Product deleted" });
}
