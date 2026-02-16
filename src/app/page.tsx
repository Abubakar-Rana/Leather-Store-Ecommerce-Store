'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { categories } from '@/data/categories';
import { ArrowRight, Shield, Truck, Award, Sparkles } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true&limit=4');
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
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center px-4 py-16 sm:px-6 lg:flex-row lg:gap-12 lg:px-8 lg:py-24">
          <div className="mt-10 flex flex-1 flex-col items-center text-center lg:mt-0 lg:items-start lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Premium Leather & Lifestyle
            </p>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Crafted for Those Who Appreciate Quality
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Explore our curated collection of handcrafted leather goods and premium sports
              equipment, designed to elevate your everyday.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                Shop Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/category/leather-products"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-card-foreground transition-all hover:bg-secondary"
              >
                Explore Leather
              </Link>
            </div>
          </div>
          <div className="relative flex-1">
            <div className="relative aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl lg:max-w-none">
              <Image
                src="/images/hero-leather.jpg"
                alt="Premium leather goods collection"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-center text-sm font-medium text-foreground">
            Exclusive This Month &mdash;{' '}
            <span className="text-primary">15% off</span> on all products.{' '}
            <Link href="/products" className="underline underline-offset-4 hover:text-primary">
              Shop now
            </Link>
          </p>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Browse
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Shop by Category
          </h2>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            Discover our carefully organized collections, from artisan leather pieces to
            performance-driven sports gear.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative flex flex-col justify-end overflow-hidden rounded-xl border border-border bg-secondary p-6 transition-all hover:border-primary/30 hover:shadow-md sm:p-8 min-h-[200px]"
            >
              <div className="relative z-10">
                <h3 className="font-serif text-xl font-bold text-foreground sm:text-2xl group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{cat.description}</p>
                {cat.subcategories && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {cat.subcategories.slice(0, 4).map((sub) => (
                      <span
                        key={sub.id}
                        className="rounded-md bg-card px-2 py-0.5 text-xs text-muted-foreground border border-border"
                      >
                        {sub.name}
                      </span>
                    ))}
                    {cat.subcategories.length > 4 && (
                      <span className="rounded-md bg-card px-2 py-0.5 text-xs text-muted-foreground border border-border">
                        +{cat.subcategories.length - 4} more
                      </span>
                    )}
                  </div>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Explore
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Handpicked
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Featured Products
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:flex"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-8">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-xl border border-border bg-card"
                  >
                    <div className="aspect-[4/5] bg-muted rounded-t-xl" />
                    <div className="p-4 flex flex-col gap-2">
                      <div className="h-3 w-20 rounded bg-muted" />
                      <div className="h-4 w-full rounded bg-muted" />
                      <div className="h-4 w-24 rounded bg-muted mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <p className="text-muted-foreground">
                  No featured products available right now.{' '}
                  <Link href="/products" className="text-primary hover:underline">
                    Browse all products
                  </Link>
                </p>
              </div>
            )}
          </div>
          <Link
            href="/products"
            className="mt-6 flex items-center justify-center gap-1 text-sm font-semibold text-primary hover:underline sm:hidden"
          >
            View All Products
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Trust / Why Choose Us */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Why Choose AbdurRaheem
          </h2>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            We are committed to delivering exceptional products with integrity.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Award,
              title: 'Premium Quality',
              desc: 'Every product is sourced and inspected for the highest standards of craftsmanship.',
            },
            {
              icon: Shield,
              title: 'Genuine Materials',
              desc: 'Authentic leather and premium materials, guaranteed with every purchase.',
            },
            {
              icon: Truck,
              title: 'Fast Shipping',
              desc: 'Reliable delivery across the country with real-time order tracking.',
            },
            {
              icon: Sparkles,
              title: 'Curated Selection',
              desc: 'A thoughtfully curated collection that balances style, function, and value.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center transition-colors hover:border-primary/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-card-foreground">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-border bg-secondary">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl text-balance">
            Stay in the Loop
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Subscribe for exclusive offers, new arrivals, and style inspiration delivered to your
            inbox.
          </p>
          <form
            className="mt-6 flex w-full max-w-md flex-col gap-2 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
