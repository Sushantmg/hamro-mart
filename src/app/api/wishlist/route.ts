import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const data = await readDB();
  let wishlist = data.wishlist;

  if (userId) {
    wishlist = wishlist.filter((w) => w.userId === parseInt(userId, 10));
  }

  const enriched = wishlist.map((w) => {
    const product = data.products.find((p) => p.id === w.productId);
    return { ...w, product };
  });

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, productId } = body;

  if (userId == null || !productId) {
    return NextResponse.json({ error: "userId and productId are required" }, { status: 400 });
  }

  const data = await readDB();

  const exists = data.wishlist.find(
    (w) => w.userId === userId && w.productId === productId
  );
  if (exists) {
    return NextResponse.json({ error: "Already in wishlist" }, { status: 409 });
  }

  const newId = data.wishlist.length > 0 ? Math.max(...data.wishlist.map((w) => w.id)) + 1 : 1;

  const newWishlist = {
    id: newId,
    userId,
    productId,
    createdAt: new Date().toISOString(),
  };

  data.wishlist.push(newWishlist);
  await writeDB(data);

  return NextResponse.json(newWishlist, { status: 201 });
}
