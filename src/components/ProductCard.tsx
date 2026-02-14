'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        <Image
          src={product.images[0] || '/next.svg'}
          alt={product.name}
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = '/next.svg'; // Fallback image
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              ${product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.price}
              </span>
            )}
          </div>
          <Link
            href={`/product/${product._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}