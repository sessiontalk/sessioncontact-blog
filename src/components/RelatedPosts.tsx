import { Link } from 'react-router-dom';
import type { Post } from '../types/blog';
import { getImageUrl } from '../lib/sanity';

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-12 bg-background-alt">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-primary-dark mb-8">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => {
            const imageUrl = getImageUrl(post.mainImage?.asset, 400, 225);
            return (
              <Link
                key={post._id}
                to={`/post/${post.slug.current}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                {imageUrl && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={post.mainImage?.alt || post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  {post.categories && post.categories.length > 0 && (
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-badge-text bg-badge rounded-full mb-2">
                      {post.categories[0].title}
                    </span>
                  )}
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
