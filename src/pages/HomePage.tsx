import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { sanityClient, queries } from '../lib/sanity';
import type { Post, Category } from '../types/blog';
import { BlogCard } from '../components/BlogCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { SEO } from '../components/SEO';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState(9);

  const selectedCategory = searchParams.get('category');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [postsData, categoriesData, featuredData] = await Promise.all([
          selectedCategory
            ? sanityClient.fetch(queries.postsByCategory(selectedCategory), { categorySlug: selectedCategory })
            : sanityClient.fetch(queries.allPosts),
          sanityClient.fetch(queries.allCategories),
          sanityClient.fetch(queries.featuredPosts),
        ]);

        setPosts(postsData || []);
        setCategories(categoriesData || []);
        setFeaturedPosts(featuredData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedCategory]);

  const handleCategorySelect = (categorySlug: string | null) => {
    if (categorySlug) {
      setSearchParams({ category: categorySlug });
    } else {
      setSearchParams({});
    }
    setVisiblePosts(9);
  };

  const handleShowMore = () => {
    setVisiblePosts((prev) => prev + 6);
  };

  const displayedPosts = posts.slice(0, visiblePosts);
  const hasMorePosts = visiblePosts < posts.length;

  const selectedCategoryData = categories.find(c => c.slug.current === selectedCategory);
  const seoTitle = selectedCategoryData ? `${selectedCategoryData.title} Articles` : undefined;
  const seoDescription = selectedCategoryData
    ? `Browse our ${selectedCategoryData.title.toLowerCase()} articles and insights.`
    : undefined;

  return (
    <div className="min-h-screen">
      <SEO
        title={seoTitle}
        description={seoDescription}
        url={window.location.href}
      />
      {/* Hero Section */}
      <section className="bg-background-alt py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-dark mb-6">
              Omnichannel Insights
            </h1>
            <p className="text-lg md:text-xl text-foreground-muted">
              Expert insights on customer experience, contact center operations,
              and AI-powered communication strategies.
            </p>
          </div>

          {/* Featured Post */}
          {!selectedCategory && featuredPosts.length > 0 && (
            <div className="animate-fade-in-up">
              <BlogCard post={featuredPosts[0]} featured />
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />

          {/* Posts Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-[20px] overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-6 bg-gray-200 rounded w-full" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="flex items-center gap-3 mt-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full" />
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-24" />
                        <div className="h-3 bg-gray-200 rounded w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground-muted text-lg">
                No posts found{selectedCategory ? ' in this category' : ''}.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedPosts.map((post, index) => (
                  <div
                    key={post._id}
                    className={`animate-fade-in-up stagger-${(index % 4) + 1}`}
                  >
                    <BlogCard post={post} />
                  </div>
                ))}
              </div>

              {/* Show More Button */}
              {hasMorePosts && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleShowMore}
                    className="inline-flex items-center px-8 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Show More Posts
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-white/80 mb-8">
            Get the latest insights on omnichannel customer experience delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-primary font-medium rounded-full hover:bg-white/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
