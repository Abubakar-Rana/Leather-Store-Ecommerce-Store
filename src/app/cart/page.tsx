'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem } from '@/types';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    const item = newCart[index];
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      newCart.splice(index, 1);
    } else {
      item.quantity = Math.min(newQty, item.product.stockQuantity);
    }
    updateCart(newCart);
  };

  const removeItem = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    updateCart(newCart);
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

  if (!mounted) return null;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-5 font-serif text-2xl font-bold text-foreground">
          Your cart is empty
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Looks like you have not added anything to your cart yet.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all"
        >
          Start Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Shopping Cart</span>
          </nav>
          <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {cart.reduce((s, i) => s + i.quantity, 0)} items in your cart
          </p>
        </div>
      </div>

      {/* Cart Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Items */}
          <div className="flex-1">
            <div className="flex flex-col gap-4">
              {cart.map((item, index) => {
                const price = item.product.discountPrice || item.product.price;
                return (
                  <div
                    key={item.product._id}
                    className="flex gap-4 rounded-xl border border-border bg-card p-4"
                  >
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                      <Image
                        src={item.product.images[0] || '/next.svg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/next.svg';
                        }}
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/product/${item.product._id}`}
                          className="text-sm font-semibold text-card-foreground hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.product.category}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-input">
                          <button
                            onClick={() => updateQuantity(index, -1)}
                            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="flex h-8 w-8 items-center justify-center text-xs font-semibold text-foreground border-x border-input">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(index, 1)}
                            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-foreground">
                          ${(price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors self-start"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
              <h3 className="text-base font-semibold text-card-foreground">
                Order Summary
              </h3>
              <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-card-foreground">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-success">Free</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="text-sm font-semibold text-card-foreground">
                    Total
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
              <button className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90">
                Proceed to Checkout
              </button>
              <Link
                href="/products"
                className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
