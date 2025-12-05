import type { Category } from '../types/blog';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categorySlug: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {/* All Posts Button */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
          selectedCategory === null
            ? 'bg-primary text-white shadow-md'
            : 'bg-background-alt text-foreground hover:bg-primary/10 hover:text-primary'
        }`}
      >
        All Posts
      </button>

      {/* Category Buttons */}
      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => onSelectCategory(category.slug.current)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategory === category.slug.current
              ? 'bg-primary text-white shadow-md'
              : 'bg-background-alt text-foreground hover:bg-primary/10 hover:text-primary'
          }`}
        >
          {category.title}
        </button>
      ))}
    </div>
  );
}
