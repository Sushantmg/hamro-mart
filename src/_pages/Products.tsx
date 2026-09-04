"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";
import Link from "next/link";
import { HeartIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface ApiProduct {
  id: number;
  name: string;
  category: string;
  image: string;
  desc: string;
  price: number | string;
  discount: number;
}

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

function ProductSkeleton() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="w-full h-44 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-4" />
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-full" />
    </div>
  );
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("category");
    if (q) setSearchTerm(q);
    if (cat) setCategoryFilter(cat);
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: ApiProduct[]) => {
        const updatedData: Product[] = data.map((item) => {
          const priceNum = Number(item.price);
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
        });
        setProducts(updatedData);
        setFilteredProducts(updatedData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filterSortSearchProducts = useCallback(() => {
    let tempProducts = [...products];
    if (categoryFilter !== "all") {
      tempProducts = tempProducts.filter((p) => p.category === categoryFilter);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      tempProducts = tempProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }
    if (sortOrder === "asc") {
      tempProducts.sort((a, b) => (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price));
    } else if (sortOrder === "desc") {
      tempProducts.sort((a, b) => (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price));
    }
    setFilteredProducts(tempProducts);
  }, [products, categoryFilter, searchTerm, sortOrder]);

  useEffect(() => {
    filterSortSearchProducts();
  }, [filterSortSearchProducts]);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title">
            {searchTerm ? `Results for "${searchTerm}"` : "All Products"}
          </h1>
          {!loading && (
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field !py-2.5 !text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field !py-2.5 !text-sm !w-auto"
            >
              <option value="all">All Categories</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="input-field !py-2.5 !text-sm !w-auto"
            >
              <option value="">Sort by Price</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-20">
            <FunnelIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No products found</p>
            <button
              onClick={() => { setSearchTerm(""); setCategoryFilter("all"); setSortOrder(""); }}
              className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : filteredProducts.map((product) => {
                const finalPrice = product.discountedPrice ?? product.price;
                return (
                  <div key={product.id} className="card group p-4 flex flex-col relative">
                    {/* Wishlist button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const wasIn = isInWishlist(product.id);
                        toggleWishlist(product.id);
                        toast.success(wasIn ? "Removed from wishlist" : "Added to wishlist");
                      }}
                      className="absolute top-6 right-6 z-10 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                      aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {isInWishlist(product.id) ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" />
                      )}
                    </button>

                    <Link href={`/products/${product.id}`} className="block">
                      <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.discount > 0 && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 flex flex-col">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                          {product.description}
                        </p>
                      </Link>

                      <div className="mt-auto">
                        <div className="flex items-center gap-2 mb-3">
                          {product.discount > 0 ? (
                            <>
                              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                ${finalPrice.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                ${product.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            addToCart(product);
                            toast.success(`${product.title} added to cart!`);
                          }}
                          className="w-full btn-primary !py-2.5 !text-sm"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
