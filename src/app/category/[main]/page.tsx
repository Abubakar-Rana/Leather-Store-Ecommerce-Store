import { notFound } from 'next/navigation';
import Link from 'next/link';
import { categories } from '@/data/categories';

interface CategoryPageProps {
  params: {
    main: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categories.find(cat => cat.slug === params.main);

  if (!category) {
    notFound();
  }

  // Main category page - show subcategories
  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{category.name}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">{category.description}</p>
      {category.subcategories && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.subcategories.map((sub) => (
            <div key={sub.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg dark:hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{sub.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{sub.description}</p>
              <Link
                href={`/category/${category.slug}/${sub.slug}`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                View Products →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    main: category.slug,
  }));
}