import { notFound } from 'next/navigation';
import Link from 'next/link';
import { categories } from '@/data/categories';
import { ChevronRight, ArrowRight } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ main: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { main } = await params;
  const category = categories.find((cat) => cat.slug === main);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="border-b border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{category.name}</span>
          </nav>
          <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            {category.name}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {category.description}
          </p>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {category.subcategories && category.subcategories.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/category/${category.slug}/${sub.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div>
                  <h3 className="font-serif text-lg font-bold text-card-foreground group-hover:text-primary transition-colors">
                    {sub.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {sub.description}
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Browse
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
            <p className="text-sm text-muted-foreground">
              No subcategories found. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    main: category.slug,
  }));
}
