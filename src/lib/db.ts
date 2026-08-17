import path from "path";
import { promises as fs } from "fs";

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
  email: string;
  password: string;
  role: "admin" | "user";
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

export async function readDB(): Promise<DB> {
  const jsonData = await fs.readFile(filePath, "utf-8");
  return JSON.parse(jsonData);
}

export async function writeDB(data: DB): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}
