"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/solid";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

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

interface RawProduct {
  id: number;
  name: string;
  category: string;
  image: string;
  desc: string;
  price: number | string;
  discount: number;
}

interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const productId = Number(id);

  useEffect(() => {
    fetch(`/api/products/${id}`)
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

        fetch("/api/products")
          .then((res) => res.json())
          .then((all: RawProduct[]) => {
            const related = all
              .filter((p) => p.category === item.category && p.id !== item.id)
              .slice(0, 4)
              .map((p) => {
                const price = typeof p.price === "string" ? parseFloat(p.price) : p.price;
                const disc = p.discount
                  ? parseFloat(((price * (100 - p.discount)) / 100).toFixed(2))
                  : null;
                return {
                  id: p.id,
                  title: `Fresh ${p.name}`,
                  category: p.category,
                  image: p.image,
                  description: p.desc,
                  price,
                  discount: p.discount,
                  discountedPrice: disc,
                };
              });
            setRelatedProducts(related);
          });
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
      });
  }, [id]);

  const fetchReviews = () => {
    fetch(`/api/reviews?productId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setLoadingReviews(false);
      });
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("ecom-token");
    if (!token || token === "admin") {
      toast.error("Please login to leave a review");
      return;
    }

    const userId = parseInt(token.replace("user-", ""), 10);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, userId, rating, comment }),
    });

    if (res.ok) {
      toast.success("Review submitted!");
      setComment("");
      setRating(5);
      fetchReviews();
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to submit review");
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto mt-20 p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-80 animate-pulse" />
          <div className="space-y-4">
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-8 w-3/4 animate-pulse" />
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-1/2 animate-pulse" />
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-full animate-pulse" />
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-6 w-1/3 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow mt-20 mb-10">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="relative w-full h-80 rounded-lg shadow-md overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold text-green-700 dark:text-green-300">
              {product.title}
            </h1>
            <button
              onClick={() => {
                toggleWishlist(product.id);
                toast.success(isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist");
              }}
              className="p-1 mt-1"
            >
              {isInWishlist(product.id) ? (
                <HeartSolidIcon className="h-7 w-7 text-red-500" />
              ) : (
                <HeartIcon className="h-7 w-7 text-gray-400 hover:text-red-500" />
              )}
            </button>
          </div>

          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full capitalize">
            {product.category}
          </span>

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

          {averageRating && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon
                    key={s}
                    className={`h-5 w-5 ${s <= Math.round(Number(averageRating)) ? "text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {averageRating} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-200 min-w-[40px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              for (let i = 0; i < quantity; i++) {
                addToCart(product);
              }
              toast.success(`${quantity}x ${product.title} added to cart!`);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition w-full text-lg"
          >
            Add to Cart — ${((product.discountedPrice ?? product.price) * quantity).toFixed(2)}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Customer Reviews ({reviews.length})
        </h2>

        <form onSubmit={handleReviewSubmit} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Write a Review</h3>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button" onClick={() => setRating(s)} className="focus:outline-none">
                  <StarIcon
                    className={`h-7 w-7 transition-colors ${s <= rating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Submit Review
          </button>
        </form>

        {loadingReviews ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="bg-gray-100 dark:bg-gray-800 rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-3" />
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-gray-800 border rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarIcon
                          key={s}
                          className={`h-4 w-4 ${s <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {review.userName}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 hover:scale-105 transition-all duration-150"
              >
                <div className="relative w-full h-28 rounded overflow-hidden mb-2">
                  <Image src={p.image} alt={p.title} fill sizes="25vw" style={{ objectFit: "cover" }} />
                </div>
                <h4 className="text-sm font-bold text-green-700 dark:text-green-300 text-center truncate">
                  {p.title}
                </h4>
                <p className="text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                  ${(p.discountedPrice ?? p.price).toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
