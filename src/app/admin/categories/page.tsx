'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  description: string;
  subcategories?: Subcategory[];
}

interface Subcategory {
  _id: string;
  name: string;
  description: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        setError('Failed to load categories');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setCategories(categories.filter((cat) => cat._id !== id));
      } else {
        setError('Failed to delete category');
      }
    } catch {
      setError('Network error');
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Categories</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Manage your product categories and subcategories
            </p>
          </div>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Category Cards */}
        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
              <FolderOpen className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium text-card-foreground">No categories yet</p>
              <p className="text-xs text-muted-foreground">Create your first category to get started</p>
              <Link
                href="/admin/categories/new"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-card-foreground">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                    <div className="ml-3 flex items-center gap-0.5">
                      <Link
                        href={`/admin/categories/${category._id}/edit`}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        aria-label="Edit category"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Delete category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="mt-3 border-t border-border pt-3">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                        Subcategories
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {category.subcategories.map((sub) => (
                          <span
                            key={sub._id}
                            className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                          >
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
