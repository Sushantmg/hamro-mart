import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wishlistId = parseInt(id, 10);
  if (isNaN(wishlistId)) {
    return NextResponse.json({ error: "Invalid wishlist ID" }, { status: 400 });
  }

  const data = await readDB();
  const index = data.wishlist.findIndex((w) => w.id === wishlistId);
  if (index === -1) {
    return NextResponse.json({ error: "Wishlist item not found" }, { status: 404 });
  }

  data.wishlist.splice(index, 1);
  await writeDB(data);

  return NextResponse.json({ message: "Removed from wishlist" });
}
