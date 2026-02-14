'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="text-center">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="text-center text-red-600 dark:text-red-400">{error || 'Product not found'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          <Image
            src={product.images[0] || '/next.svg'}
            alt={product.name}
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = '/next.svg';
            }}
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{product.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{product.description}</p>
          <div className="mb-4">
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              ${product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-lg text-gray-500 line-through ml-2">
                ${product.price}
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Category: {product.category}
            {product.subcategory && ` > ${product.subcategory}`}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Stock: {product.stockQuantity}
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}