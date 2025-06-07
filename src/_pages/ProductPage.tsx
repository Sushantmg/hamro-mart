"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ✅ useParams from next/navigation
import { useCart } from "@/context/CartContext"; // ✅ adjust path as needed
import toast from "react-hot-toast";

type Product = {
  id: number;
  name: string;
  desc: string;
  price: number;
  image: string;
  discount: number;
  discountedPrice?: number;
};

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3001/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        const discountedPrice = data.discount
          ? parseFloat((data.price - (data.price * data.discount) / 100).toFixed(2))
          : null;

        setProduct({ ...data, discountedPrice });
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
      });
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-600 dark:text-gray-300">
        Loading product...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b dark:from-gray-900 dark:to-[#0e1f33] dark:text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="grid md:grid-cols-2 gap-8">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-80 object-cover rounded"
          />
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-4">
                Fresh {product.name}
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{product.desc}</p>
              <div className="mb-4">
                {product.discount > 0 ? (
                  <div className="text-lg text-red-600 dark:text-red-400">
                    <span className="line-through mr-2">${product.price.toFixed(2)}</span>
                    <span className="font-bold text-green-800 dark:text-green-200">
                      ${product.discountedPrice?.toFixed(2)}
                    </span>
                    <span className="ml-2 text-sm">({product.discount}% OFF)</span>
                  </div>
                ) : (
                  <div className="text-xl text-green-700 dark:text-green-200 font-semibold">
                    ${product.price.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                addToCart(product);
                toast.success(`${product.name} added to cart!`);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-lg transition-all duration-200"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
