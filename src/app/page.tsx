'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true&limit=3');
        if (response.ok) {
          const data = await response.json();
          setFeaturedProducts(data);
        }
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Promo Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Exclusive Deal!</h2>
        <p className="text-xl mb-6">Get 15% off on all products this month</p>
        <Link
          href="/products"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Shop All Products
        </Link>
      </section>

      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Welcome to AbdurRaheem Store
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Discover amazing products at unbeatable prices
        </p>
        <Link
          href="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Shop Now
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Featured Products
        </h2>
        {loading ? (
          <div className="text-center">Loading featured products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
