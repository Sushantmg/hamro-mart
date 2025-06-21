"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

interface Product {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  price: number;
  discount: number;
  discountedPrice: number | null;
}

// Define the API response shape for better typing
interface RawProduct {
  id: number;
  name: string;
  category: string;
  image: string;
  desc: string;
  price: number | string;  // sometimes APIs return numbers as strings
  discount: number;
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`http://localhost:3007/products/${id}`)
      .then((res) => res.json())
      .then((item: RawProduct) => {
        const priceNum = typeof item.price === "string" ? parseFloat(item.price) : item.price;
        const discountedPrice = item.discount
          ? parseFloat((priceNum - (priceNum * item.discount) / 100).toFixed(2))
          : null;

        setProduct({
          id: item.id,
          title: `Fresh ${item.name}`,
          category: item.category,
          image: item.image,
          description: item.desc,
          price: priceNum,
          discount: item.discount,
          discountedPrice,
        });
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
      });
  }, [id]);

  if (!product) {
    return <div className="text-center py-20 text-gray-600 dark:text-gray-300">Loading product...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow mt-20">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-80 object-cover rounded-lg shadow-md"
        />
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-300">{product.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{product.description}</p>

          <div className="text-xl font-semibold text-green-800 dark:text-green-200">
            {product.discount > 0 ? (
              <div>
                <span className="line-through mr-2 text-red-500">${product.price.toFixed(2)}</span>
                <span>${product.discountedPrice?.toFixed(2)}</span>
                <span className="ml-1 text-sm text-red-500">({product.discount}% OFF)</span>
              </div>
            ) : (
              <span>${product.price.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={() => {
              addToCart(product);
              toast.success(`${product.title} added to cart!`);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
