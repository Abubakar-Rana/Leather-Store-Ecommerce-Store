'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, ChevronDown, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { categories } from '@/data/categories';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Header() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; max-age=0';
    setUser(null);
    router.push('/');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white">
          AbdurRaheem Store
        </Link>
        <nav className="flex space-x-4 items-center">
          <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
            Home
          </Link>
          <div className="relative">
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white flex items-center"
            >
              Categories
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {isCategoriesOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10">
                {categories.map((category) => (
                  <div key={category.id} className="px-4 py-2">
                    <Link
                      href={`/category/${category.slug}`}
                      className="font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      {category.name}
                    </Link>
                    {category.subcategories && (
                      <div className="ml-4 mt-1 space-y-1">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/category/${category.slug}/${sub.slug}`}
                            className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
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
            )}
          </div>
          <Link href="/products" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
            All Products
          </Link>
          <Link href="/cart" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white flex items-center">
            <ShoppingCart className="w-5 h-5 mr-1" />
            Cart
          </Link>
          {user ? (
            <div className="relative">
              <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white flex items-center">
                <User className="w-5 h-5 mr-1" />
                {user.name}
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10">
                {user.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white flex items-center">
              <User className="w-5 h-5 mr-1" />
              Login
            </Link>
          )}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}