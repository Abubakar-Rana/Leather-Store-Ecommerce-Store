'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';

interface Subcategory {
  name: string;
  description: string;
}

export default function NewCategory() {
  const [form, setForm] = useState({
    name: '',
    description: '',
  });
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [newSubcategory, setNewSubcategory] = useState({ name: '', description: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      subcategories: subcategories.length > 0 ? subcategories : undefined,
    };

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/categories');
      } else {
        alert('Failed to create category');
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Category</h1>
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
            <label className="block text-gray-700 mb-2">Subcategories (Optional)</label>
            <div className="space-y-2">
              {subcategories.map((sub, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <span className="flex-1">{sub.name}</span>
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
              Create Category
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