import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { sanityClient } from '../lib/sanity';
import type { Post } from '../types/blog';

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const searchQuery = `*[_type == "post" && (
          title match "*${query}*" ||
          excerpt match "*${query}*"
        )] | order(publishedAt desc)[0...5] {
          _id,
          title,
          slug,
          excerpt,
          publishedAt,
          categories[]->{
            _id,
            title,
            slug
          }
        }`;
        const data = await sanityClient.fetch(searchQuery);
        setResults(data || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-foreground hover:text-primary transition-colors"
        aria-label="Search"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {/* Search Modal/Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-[20px] shadow-xl border border-border overflow-hidden z-50">
          {/* Search Input */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 bg-background-alt rounded-full text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {loading && (
              <div className="p-4 text-center text-foreground-muted">
                <div className="animate-spin inline-block w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="p-4 text-center text-foreground-muted">
                No results found for "{query}"
              </div>
            )}

            {!loading && results.length > 0 && (
              <ul>
                {results.map((post) => (
                  <li key={post._id}>
                    <Link
                      to={`/post/${post.slug.current}`}
                      onClick={handleResultClick}
                      className="block p-4 hover:bg-background-alt transition-colors"
                    >
                      <h4 className="font-medium text-foreground line-clamp-1 mb-1">
                        {post.title}
                      </h4>
                      {post.excerpt && (
                        <p className="text-sm text-foreground-muted line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      {post.categories && post.categories.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {post.categories.slice(0, 2).map((cat) => (
                            <span
                              key={cat._id}
                              className="text-xs px-2 py-0.5 bg-badge text-badge-text rounded-full"
                            >
                              {cat.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {!loading && !query && (
              <div className="p-4 text-center text-foreground-muted text-sm">
                Start typing to search...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
