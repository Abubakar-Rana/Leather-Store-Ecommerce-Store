'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Plus, X } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  description: string;
  subcategories?: Subcategory[];
}

interface Subcategory {
  _id?: string;
  name: string;
  description: string;
}

export default function EditCategory() {
  const [form, setForm] = useState({
    name: '',
    description: '',
  });
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [newSubcategory, setNewSubcategory] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${id}`);
        if (response.ok) {
          const category: Category = await response.json();
          setForm({
            name: category.name,
            description: category.description,
          });
          setSubcategories(category.subcategories || []);
        }
      } catch (error) {
        console.error('Failed to fetch category:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      subcategories: subcategories.length > 0 ? subcategories : undefined,
    };

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/categories');
      } else {
        alert('Failed to update category');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const addSubcategory = () => {
    if (newSubcategory.name.trim()) {
      setSubcategories([...subcategories, { ...newSubcategory }]);
      setNewSubcategory({ name: '', description: '' });
    }
  };

  const removeSubcategory = (index: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="text-center">Loading category...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Category Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded h-24"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Subcategories</label>
            <div className="space-y-2">
              {subcategories.map((sub, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <input
                    type="text"
                    value={sub.name}
                    onChange={e => {
                      const updated = [...subcategories];
                      updated[index].name = e.target.value;
                      setSubcategories(updated);
                    }}
                    className="flex-1 p-1 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={sub.description}
                    onChange={e => {
                      const updated = [...subcategories];
                      updated[index].description = e.target.value;
                      setSubcategories(updated);
                    }}
                    className="flex-1 p-1 border border-gray-300 rounded"
                    placeholder="Description"
                  />
                  <button
                    type="button"
                    onClick={() => removeSubcategory(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex space-x-2 mt-2">
              <input
                type="text"
                placeholder="Subcategory name"
                value={newSubcategory.name}
                onChange={e => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Description"
                value={newSubcategory.description}
                onChange={e => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={addSubcategory}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Update Category
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/categories')}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}