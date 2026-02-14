'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { categories } from '@/data/categories';

interface SubcategoryPageProps {
  params: {
    main: string;
    sub: string;
  };
}

export default function SubcategoryPage({ params }: SubcategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const mainCategory = categories.find(cat => cat.slug === params.main);

  if (!mainCategory || !mainCategory.subcategories) {
    notFound();
  }

  const subcategory = mainCategory.subcategories.find(sub => sub.slug === params.sub);

  if (!subcategory) {
    notFound();
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?category=${encodeURIComponent(mainCategory.name)}`);
        if (response.ok) {
          const data = await response.json();
          // Filter by subcategory if needed, but since category is main, and products have subcategory field
          const filtered = data.filter((p: Product) => p.subcategory === subcategory.name);
          setProducts(filtered);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [mainCategory.name, subcategory.name]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="text-center text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{subcategory.name}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">{subcategory.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No products found in this subcategory.</p>
      )}
    </div>
  );
}