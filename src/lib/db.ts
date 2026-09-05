import path from "path";
import { promises as fs } from "fs";
import { Redis } from "@upstash/redis";
import seedDB from "../../data/db.json";

export interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  desc: string;
  price: number;
  discount: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  createdAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  userId: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  items: { productId: number; name: string; price: number; quantity: number }[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  shipping?: { fullName: string; address: string; city: string; phone: string };
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Wishlist {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
}

export interface DB {
  products: Product[];
  users: User[];
  cart: CartItem[];
  orders: Order[];
  reviews: Review[];
  wishlist: Wishlist[];
}

const filePath = path.join(process.cwd(), "data", "db.json");

const KV_KEY = "hamro-mart-db";

function getRedis(): Redis | null {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  try {
    return Redis.fromEnv();
  } catch {
    return null;
  }
}

function seedData(): DB {
  return {
    products: Array.isArray(seedDB.products) ? seedDB.products : [],
    users: Array.isArray(seedDB.users) ? seedDB.users : [],
    cart: Array.isArray(seedDB.cart) ? seedDB.cart : [],
    orders: Array.isArray(seedDB.orders) ? seedDB.orders : [],
    reviews: Array.isArray(seedDB.reviews) ? seedDB.reviews : [],
    wishlist: Array.isArray(seedDB.wishlist) ? seedDB.wishlist : [],
  } as DB;
}

export async function readDB(): Promise<DB> {
  const redis = getRedis();
  if (redis) {
    const raw = await redis.get<string>(KV_KEY);
    if (raw) return JSON.parse(raw) as DB;
    const seed = seedData();
    await redis.set(KV_KEY, JSON.stringify(seed));
    return seed;
  }
  const jsonData = await fs.readFile(filePath, "utf-8");
  return JSON.parse(jsonData);
}

export async function writeDB(data: DB): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(KV_KEY, JSON.stringify(data));
    return;
  }
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export function generateToken(user: { id: number; role: string; email: string; name: string }): string {
  const payload = { id: user.id, role: user.role, email: user.email, name: user.name };
  const base64 = Buffer.from(JSON.stringify(payload)).toString("base64");
  const sig = Buffer.from(`${base64}-hm-secret`).toString("base64");
  return `${base64}.${sig}`;
}

export function verifyToken(token: string): { id: number; role: string; email: string; name: string } | null {
  try {
    const [base64, sig] = token.split(".");
    if (!base64 || !sig) return null;
    const expectedSig = Buffer.from(`${base64}-hm-secret`).toString("base64");
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(base64, "base64").toString());
    if (!payload.id || !payload.role || !payload.email) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getUserIdFromToken(token: string): number | null {
  const payload = verifyToken(token);
  return payload?.id ?? null;
}