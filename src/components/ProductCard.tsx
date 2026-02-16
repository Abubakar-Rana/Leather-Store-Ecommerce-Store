'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <Link
      href={`/product/${product._id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/20"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <Image
          src={product.images[0] || '/next.svg'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/next.svg';
          }}
        />
        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-md bg-destructive px-2 py-0.5 text-xs font-semibold text-destructive-foreground">
            -{discountPercent}%
          </span>
        )}
        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <div className="flex items-center justify-center gap-2 bg-primary/95 px-4 py-2.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
            <ShoppingCart className="h-4 w-4" />
            View Details
          </div>
        </div>
        {/* Out of Stock */}
        {product.stockQuantity === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <span className="rounded-md bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold leading-snug text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-base font-bold text-foreground">
            ${(hasDiscount ? product.discountPrice! : product.price).toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
