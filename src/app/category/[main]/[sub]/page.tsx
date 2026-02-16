'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { categories } from '@/data/categories';
import { ChevronRight, PackageOpen } from 'lucide-react';

interface SubcategoryPageProps {
  params: Promise<{ main: string; sub: string }>;
}

export default function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { main, sub } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const mainCategory = categories.find((cat) => cat.slug === main);
  const subcategory = mainCategory?.subcategories?.find((s) => s.slug === sub);

  useEffect(() => {
    if (!mainCategory || !subcategory) return;

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/products?category=${encodeURIComponent(mainCategory.name)}`
        );
        if (response.ok) {
          const data = await response.json();
          const filtered = data.filter(
            (p: Product) => p.subcategory === subcategory.name
          );
          setProducts(filtered);
        } else {
          setError('Failed to load products');
        }
      } catch {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [mainCategory, subcategory]);

  if (!mainCategory || !subcategory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Category not found.</p>
        <Link
          href="/"
          className="mt-4 text-sm text-primary hover:underline"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="border-b border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/category/${mainCategory.slug}`}
              className="hover:text-primary transition-colors"
            >
              {mainCategory.name}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{subcategory.name}</span>
          </nav>
          <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {subcategory.name}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {subcategory.description}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-border bg-card">
                <div className="aspect-[4/5] bg-muted rounded-t-xl" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-3 w-20 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-24 rounded bg-muted mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-12 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20">
            <PackageOpen className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-base font-semibold text-card-foreground">
              No products yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Products in this subcategory will appear here soon.
            </p>
            <Link
              href="/products"
              className="mt-4 text-sm font-semibold text-primary hover:underline"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
