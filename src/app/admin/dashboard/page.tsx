'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, FolderOpen, ShoppingCart, ArrowRight, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, catRes, ordRes] = await Promise.allSettled([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/orders'),
        ]);
        setStats({
          products: prodRes.status === 'fulfilled' && prodRes.value.ok ? (await prodRes.value.json()).length : 0,
          categories: catRes.status === 'fulfilled' && catRes.value.ok ? (await catRes.value.json()).length : 0,
          orders: ordRes.status === 'fulfilled' && ordRes.value.ok ? (await ordRes.value.json()).length : 0,
        });
      } catch {
        // silently fail
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: 'Products',
      count: stats.products,
      icon: Package,
      href: '/admin/products',
      desc: 'Manage your product catalog',
    },
    {
      label: 'Categories',
      count: stats.categories,
      icon: FolderOpen,
      href: '/admin/categories',
      desc: 'Organize your collections',
    },
    {
      label: 'Orders',
      count: stats.orders,
      icon: ShoppingCart,
      href: '/admin/orders',
      desc: 'Track and fulfill orders',
    },
  ];

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back. Here is an overview of your store.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <card.icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="mt-4 text-2xl font-bold text-card-foreground">{card.count}</p>
              <p className="text-sm font-medium text-card-foreground">{card.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{card.desc}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground">
                <Package className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground">Add New Product</p>
                <p className="text-xs text-muted-foreground">
                  Create a new product listing
                </p>
              </div>
            </Link>
            <Link
              href="/admin/categories/new"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground">
                <FolderOpen className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground">Add New Category</p>
                <p className="text-xs text-muted-foreground">
                  Organize products into categories
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
