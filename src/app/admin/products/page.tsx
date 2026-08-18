"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

type Product = { id: number; name: string; category: string; image: string; desc: string; price: number; discount: number };

export default function ManageProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", category: "fruits", image: "", desc: "", price: "", discount: "" });

  useEffect(() => {
    const token = Cookies.get("ecom-token");
    let isAdmin = false;
    if (token) {
      try {
        if (token === "admin") isAdmin = true;
        else { const p = JSON.parse(atob(token.split(".")[0])); isAdmin = p.role === "admin"; }
      } catch { /* not admin */ }
    }
    if (!isAdmin) { router.push("/login"); return; }
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ name: "", category: "fruits", image: "", desc: "", price: "", discount: "" });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (p: Product) => {
    setForm({ name: p.name, category: p.category, image: p.image, desc: p.desc, price: String(p.price), discount: String(p.discount) });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, price: Number(form.price), discount: Number(form.discount) };
    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/products/${editId}` : "/api/products";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { toast.success(editId ? "Product updated!" : "Product added!"); fetchProducts(); }
    else { toast.error("Failed to save"); }
    resetForm();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted!"); fetchProducts(); }
    else { toast.error("Failed to delete"); }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{products.length} products in store</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary !text-sm flex items-center gap-1.5">
          <PlusIcon className="h-4 w-4" /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editId ? "Edit Product" : "Add Product"}</h2>
            <button onClick={resetForm} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><XMarkIcon className="h-5 w-5 text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
            </select>
            <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input-field" />
            <input placeholder="Description" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className="input-field" />
            <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="input-field" />
            <input type="number" placeholder="Discount %" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className="input-field" />
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary !text-sm">{editId ? "Update" : "Add"}</button>
              <button type="button" onClick={resetForm} className="btn-secondary !text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Final</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {products.map((p) => {
                const finalPrice = p.discount > 0 ? p.price - (p.price * p.discount) / 100 : null;
                return (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{p.name}</td>
                    <td className="px-6 py-4"><span className="badge bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 capitalize">{p.category}</span></td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">${p.price.toFixed(2)}</td>
                    <td className="px-6 py-4">{p.discount > 0 ? <span className="text-emerald-600 font-medium">{p.discount}%</span> : <span className="text-gray-400">-</span>}</td>
                    <td className="px-6 py-4">{finalPrice !== null ? <span className="font-medium text-gray-900 dark:text-white">${finalPrice.toFixed(2)}</span> : <span className="text-gray-400">-</span>}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"><PencilIcon className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"><TrashIcon className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
