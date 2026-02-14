'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProduct() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    discountPrice: '',
    description: '',
    stockQuantity: '',
    images: '',
    category: '',
    subcategory: '',
    featured: false,
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      price: parseFloat(form.price),
      discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : undefined,
      stockQuantity: parseInt(form.stockQuantity),
      images: form.images.split(',').map(s => s.trim()),
    };
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    router.push('/admin/products');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Discount Price"
            value={form.discountPrice}
            onChange={e => setForm({ ...form, discountPrice: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Stock Quantity"
            value={form.stockQuantity}
            onChange={e => setForm({ ...form, stockQuantity: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Subcategory"
            value={form.subcategory}
            onChange={e => setForm({ ...form, subcategory: e.target.value })}
            className="p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="p-2 border rounded col-span-2"
            required
          />
          <input
            type="text"
            placeholder="Images (comma separated URLs)"
            value={form.images}
            onChange={e => setForm({ ...form, images: e.target.value })}
            className="p-2 border rounded col-span-2"
          />
          <label className="col-span-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={e => setForm({ ...form, featured: e.target.checked })}
            />
            Featured
          </label>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Create Product</button>
      </form>
    </div>
  );
}