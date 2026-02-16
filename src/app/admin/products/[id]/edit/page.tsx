'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { categories } from '@/data/categories';

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  stockQuantity: number;
  images: string[];
  category: string;
  subcategory?: string;
  featured: boolean;
}

export default function EditProduct() {
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { id } = useParams();

  const selectedCategory = categories.find((c) => c.name === form.category);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const product: Product = await res.json();
      setForm({
        name: product.name,
        price: product.price.toString(),
        discountPrice: product.discountPrice?.toString() || '',
        description: product.description,
        stockQuantity: product.stockQuantity.toString(),
        images: product.images.join(', '),
        category: product.category,
        subcategory: product.subcategory || '',
        featured: product.featured,
      });
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...form,
      price: parseFloat(form.price),
      discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : undefined,
      stockQuantity: parseInt(form.stockQuantity),
      images: form.images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    router.push('/admin/products');
  };

  const inputClass =
    'w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring';
  const labelClass = 'block text-sm font-medium text-foreground mb-1.5';

  if (loading) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Back */}
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Products
        </Link>

        <h1 className="font-serif text-2xl font-bold text-foreground">Edit Product</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the product details below.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Product Name</label>
              <input
                type="text"
                placeholder="e.g., Leather Messenger Bag"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                Discount Price ($) <span className="text-muted-foreground font-normal">- Optional</span>
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.discountPrice}
                onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Stock Quantity</label>
              <input
                type="number"
                placeholder="0"
                value={form.stockQuantity}
                onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: '' })}
                className={inputClass}
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory?.subcategories && (
              <div className="sm:col-span-2">
                <label className={labelClass}>Subcategory</label>
                <select
                  value={form.subcategory}
                  onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select subcategory</option>
                  {selectedCategory.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                placeholder="Describe this product..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputClass} h-24 resize-none`}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>
                Image URLs <span className="text-muted-foreground font-normal">- Comma separated</span>
              </label>
              <input
                type="text"
                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                />
                <span className="text-sm font-medium text-foreground">
                  Featured Product
                </span>
                <span className="text-xs text-muted-foreground">
                  (shown on homepage)
                </span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Product'}
            </button>
            <Link
              href="/admin/products"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
