"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

type Product = {
  id: number;
  name: string;
  category: string;
  image: string;
  desc: string;
  price: number;
  discount: number;
};

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", category: "fruits", image: "", desc: "", price: "", discount: "" });

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

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

    if (editId) {
      const res = await fetch(`/api/products/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) { toast.success("Product updated!"); fetchProducts(); }
      else { toast.error("Failed to update"); }
    } else {
      const res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) { toast.success("Product added!"); fetchProducts(); }
      else { toast.error("Failed to add"); }
    }
    resetForm();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted!"); fetchProducts(); }
    else { toast.error("Failed to delete"); }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><p className="text-gray-500 animate-pulse">Loading...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800">Manage Products</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold">
          <PlusIcon className="h-5 w-5" /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow-xl rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{editId ? "Edit Product" : "Add Product"}</h2>
            <button onClick={resetForm}><XMarkIcon className="h-6 w-6 text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="border rounded-lg px-4 py-2" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border rounded-lg px-4 py-2">
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
            </select>
            <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="border rounded-lg px-4 py-2" />
            <input placeholder="Description" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className="border rounded-lg px-4 py-2" />
            <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="border rounded-lg px-4 py-2" />
            <input type="number" placeholder="Discount %" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className="border rounded-lg px-4 py-2" />
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold">{editId ? "Update" : "Add"}</button>
              <button type="button" onClick={resetForm} className="border border-gray-300 px-6 py-2 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Discount</th>
                <th className="px-6 py-4 text-left">Final Price</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const discountedPrice = p.discount > 0 ? p.price - (p.price * p.discount) / 100 : null;
                return (
                  <tr key={p.id} className={`hover:bg-gray-50 transition duration-150 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="px-6 py-4 font-semibold truncate max-w-[200px]">{p.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">{p.category}</span>
                    </td>
                    <td className="px-6 py-4">${p.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {p.discount > 0 ? <span className="text-green-600 font-semibold">{p.discount}%</span> : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-4">
                      {discountedPrice !== null ? <span className="text-purple-600 font-medium">${discountedPrice.toFixed(2)}</span> : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700"><PencilIcon className="h-5 w-5" /></button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5" /></button>
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
