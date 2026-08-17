import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  const data = await readDB();
  let reviews = data.reviews;

  if (productId) {
    reviews = reviews.filter((r) => r.productId === parseInt(productId, 10));
  }

  const enriched = reviews.map((r) => {
    const user = data.users.find((u) => u.id === r.userId);
    return { ...r, userName: user?.email || "Unknown" };
  });

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, userId, rating, comment } = body;

  if (!productId || !userId || !rating) {
    return NextResponse.json({ error: "productId, userId, and rating are required" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  const data = await readDB();
  const newId = data.reviews.length > 0 ? Math.max(...data.reviews.map((r) => r.id)) + 1 : 1;

  const newReview = {
    id: newId,
    productId,
    userId,
    rating: Number(rating),
    comment: comment || "",
    createdAt: new Date().toISOString(),
  };

  data.reviews.push(newReview);
  await writeDB(data);

  return NextResponse.json(newReview, { status: 201 });
}
