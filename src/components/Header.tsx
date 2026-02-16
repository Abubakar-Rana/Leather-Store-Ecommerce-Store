'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingCart,
  User,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { categories } from '@/data/categories';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Header() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const catRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setIsCategoriesOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoriesOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; max-age=0';
    setUser(null);
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-background border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              AbdurRaheem
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div ref={catRef} className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                  pathname.startsWith('/category')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Categories
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    isCategoriesOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isCategoriesOpen && (
                <div className="absolute left-1/2 top-full mt-2 w-[480px] -translate-x-1/2 animate-slide-down rounded-xl border border-border bg-card p-4 shadow-lg">
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((category) => (
                      <div key={category.id}>
                        <Link
                          href={`/category/${category.slug}`}
                          className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          {category.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {category.description}
                        </p>
                        {category.subcategories && (
                          <div className="mt-2 flex flex-col gap-1">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/category/${category.slug}/${sub.slug}`}
                                className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                onClick={() => setIsCategoriesOpen(false)}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/products"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/products')
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Products
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </button>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div ref={userRef} className="relative hidden lg:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden xl:inline">{user.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 animate-slide-down rounded-xl border border-border bg-card p-1.5 shadow-lg">
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-sm font-medium text-card-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-card-foreground hover:bg-secondary transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-secondary transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 lg:flex"
              >
                <User className="h-4 w-4" />
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-card lg:hidden animate-slide-down">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive('/') ? 'bg-secondary text-primary' : 'text-card-foreground hover:bg-secondary'
                }`}
              >
                Home
              </Link>

              {categories.map((category) => (
                <div key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-card-foreground hover:bg-secondary transition-colors"
                  >
                    {category.name}
                  </Link>
                  {category.subcategories && (
                    <div className="ml-4 flex flex-col gap-0.5">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/category/${category.slug}/${sub.slug}`}
                          className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link
                href="/products"
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive('/products') ? 'bg-secondary text-primary' : 'text-card-foreground hover:bg-secondary'
                }`}
              >
                All Products
              </Link>

              <div className="my-2 border-t border-border" />

              {user ? (
                <>
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-card-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-card-foreground hover:bg-secondary transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-destructive hover:bg-secondary transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-colors"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
