"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";
import { HeartIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

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
  const [imgZoomed, setImgZoomed] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const productId = Number(id);

  const transformProduct = useCallback((item: RawProduct): Product => {
    const priceNum = typeof item.price === "string" ? parseFloat(item.price) : item.price;
    const discountedPrice = item.discount
      ? parseFloat(((priceNum * (100 - item.discount)) / 100).toFixed(2))
      : null;
    return {
      id: item.id,
      title: item.name,
      category: item.category,
      image: item.image,
      description: item.desc,
      price: priceNum,
      discount: item.discount,
      discountedPrice,
    };
  }, []);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((item: RawProduct) => {
        setProduct(transformProduct(item));
        fetch("/api/products")
          .then((res) => res.json())
          .then((all: RawProduct[]) => {
            const related = all
              .filter((p) => p.category === item.category && p.id !== item.id)
              .slice(0, 4)
              .map(transformProduct);
            setRelatedProducts(related);
          });
      });
  }, [id, transformProduct]);

  const fetchReviews = useCallback(() => {
    fetch(`/api/reviews?productId=${id}`)
      .then((res) => res.json())
      .then((data) => { setReviews(data); setLoadingReviews(false); });
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("ecom-token");
    if (!token) { toast.error("Please login to leave a review"); return; }

    let userId: number;
    try {
      const payload = JSON.parse(atob(token.split(".")[0]));
      userId = payload.id;
    } catch { toast.error("Invalid session"); return; }

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

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-80 animate-pulse" />
          <div className="space-y-4">
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-8 w-3/4 animate-pulse" />
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-1/2 animate-pulse" />
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const finalPrice = product.discountedPrice ?? product.price;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <Link href="/products" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Products</Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors capitalize">{product.category}</Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-gray-900 dark:text-gray-200 font-medium">{product.title}</span>
        </nav>

        <div className="card p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden group cursor-zoom-in" onClick={() => setImgZoomed(true)}>
              <Image src={product.image} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" priority />
              {product.discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{product.discount}%
                </span>
              )}
              <div className="absolute top-4 right-4 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <MagnifyingGlassIcon className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{product.title}</h1>
                  <span className="badge bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 mt-2 capitalize">
                    {product.category}
                  </span>
                </div>
                <button onClick={() => { toggleWishlist(product.id); toast.success(isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist"); }} className="p-2">
                  {isInWishlist(product.id)
                    ? <HeartSolidIcon className="h-6 w-6 text-red-500" />
                    : <HeartIcon className="h-6 w-6 text-gray-400 hover:text-red-500 transition-colors" />
                  }
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>

              <div className="flex items-center gap-3">
                {product.discount > 0 ? (
                  <>
                    <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">${finalPrice.toFixed(2)}</span>
                    <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">${product.price.toFixed(2)}</span>
                )}
              </div>

              {averageRating && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarSolidIcon key={s} className={`h-4 w-4 ${s <= Math.round(Number(averageRating)) ? "text-amber-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{averageRating} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-semibold text-sm min-w-[40px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) addToCart(product);
                  toast.success(`${quantity}x ${product.title} added to cart!`);
                }}
                className="btn-primary w-full text-lg"
              >
                Add to Cart — ${(finalPrice * quantity).toFixed(2)}
              </button>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-12 border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Customer Reviews ({reviews.length})</h2>

            <form onSubmit={handleReviewSubmit} className="card p-6 mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setRating(s)} className="focus:outline-none">
                      <StarSolidIcon className={`h-7 w-7 transition-colors ${s <= rating ? "text-amber-400" : "text-gray-300 hover:text-amber-200"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                  className="input-field"
                />
              </div>
              <button type="submit" className="btn-primary !py-2.5">Submit Review</button>
            </form>

            {loadingReviews ? (
              <div className="space-y-3">
                {[1, 2].map((n) => (
                  <div key={n} className="card p-5 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-sm font-bold text-emerald-600">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{review.userName}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <StarSolidIcon key={s} className={`h-3 w-3 ${s <= review.rating ? "text-amber-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    {review.comment && <p className="text-gray-600 dark:text-gray-400 text-sm">{review.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 border-t pt-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((p) => (
                  <Link key={p.id} href={`/products/${p.id}`} className="group card p-3 hover:shadow-md transition-all">
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
                      <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white text-center truncate">{p.title}</h4>
                    <p className="text-center text-sm font-bold text-emerald-600 dark:text-emerald-400">${(p.discountedPrice ?? p.price).toFixed(2)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Zoom Modal */}
      {imgZoomed && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setImgZoomed(false)}>
          <div className="relative w-full max-w-3xl aspect-square">
            <Image src={product.image} alt={product.title} fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
