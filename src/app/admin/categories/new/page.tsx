'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X } from 'lucide-react';

interface Subcategory {
  name: string;
  description: string;
}

export default function NewCategory() {
  const [form, setForm] = useState({ name: '', description: '' });
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [newSub, setNewSub] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          subcategories: subcategories.length > 0 ? subcategories : undefined,
        }),
      });
      if (response.ok) {
        router.push('/admin/categories');
      } else {
        alert('Failed to create category');
        setSaving(false);
      }
    } catch {
      alert('Network error');
      setSaving(false);
    }
  };

  const addSubcategory = () => {
    if (newSub.name.trim()) {
      setSubcategories([...subcategories, { ...newSub }]);
      setNewSub({ name: '', description: '' });
    }
  };

  const inputClass =
    'w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring';
  const labelClass = 'block text-sm font-medium text-foreground mb-1.5';

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Categories
        </Link>

        <h1 className="font-serif text-2xl font-bold text-foreground">Add New Category</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a new category and optionally add subcategories.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-5">
            <div>
              <label className={labelClass}>Category Name</label>
              <input
                type="text"
                placeholder="e.g., Leather Bags"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                placeholder="Describe this category..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputClass} h-24 resize-none`}
                required
              />
            </div>

            {/* Subcategories */}
            <div>
              <label className={labelClass}>
                Subcategories <span className="text-muted-foreground font-normal">- Optional</span>
              </label>

              {subcategories.length > 0 && (
                <div className="flex flex-col gap-2 mb-3">
                  {subcategories.map((sub, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-card-foreground">{sub.name}</p>
                        {sub.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {sub.description}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setSubcategories(subcategories.filter((_, i) => i !== index))}
                        className="ml-2 rounded p-1 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove subcategory"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Subcategory name"
                  value={newSub.name}
                  onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                  className={`${inputClass} flex-1`}
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newSub.description}
                  onChange={(e) => setNewSub({ ...newSub, description: e.target.value })}
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={addSubcategory}
                  className="flex-shrink-0 rounded-lg bg-secondary px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
                  aria-label="Add subcategory"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Category'}
            </button>
            <Link
              href="/admin/categories"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
