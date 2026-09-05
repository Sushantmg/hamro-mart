import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const data = await readDB();
  let orders = data.orders;

  if (userId) {
    orders = orders.filter((o) => o.userId === parseInt(userId, 10));
  }

  return NextResponse.json(orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, items, total } = body;

  if (userId == null || !items || !items.length || total == null || Number.isNaN(Number(total))) {
    return NextResponse.json({ error: "userId, items, and total are required" }, { status: 400 });
  }

  const data = await readDB();
  const newId = data.orders.length > 0 ? Math.max(...data.orders.map((o) => o.id)) + 1 : 1;

  const newOrder = {
    id: newId,
    userId,
    items,
    total: Number(total),
    status: "pending" as const,
    createdAt: new Date().toISOString(),
    shipping: body.shipping || null,
  };

  data.orders.push(newOrder);
  await writeDB(data);

  return NextResponse.json(newOrder, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { orderId, status } = body;

  if (!orderId || !status) {
    return NextResponse.json({ error: "orderId and status are required" }, { status: 400 });
  }

  const data = await readDB();
  const order = data.orders.find((o) => o.id === orderId);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  order.status = status;
  await writeDB(data);

  return NextResponse.json(order);
}
