import { Link } from 'react-router-dom';
import type { Post } from '../types/blog';
import { getImageUrl } from '../lib/sanity';

interface BlogCardProps {
  post: Post;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mainImageUrl = getImageUrl(post.mainImage?.asset, 800, 450);
  const authorImageUrl = getImageUrl(post.author?.image?.asset, 48, 48);

  // Estimate reading time (average blog post is 5-10 min)
  const readingTime = post.readingTime || (featured ? 8 : 5);

  return (
    <Link
      to={`/post/${post.slug.current}`}
      className={`group block bg-card rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${
        featured ? 'md:col-span-2 md:grid md:grid-cols-2' : ''
      }`}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden ${featured ? 'h-64 md:h-full' : 'h-48'}`}>
        {mainImageUrl && (
          <img
            src={mainImageUrl}
            alt={post.mainImage?.alt || post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.08]"
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className={`p-6 ${featured ? 'flex flex-col justify-center' : ''}`}>
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.slice(0, 2).map((category) => (
              <span
                key={category._id}
                className="inline-block px-3 py-1 text-xs font-semibold text-badge-text bg-badge rounded-full"
              >
                {category.title}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3
          className={`font-bold text-card-foreground group-hover:text-primary transition-colors duration-200 line-clamp-3 ${
            featured ? 'text-2xl md:text-3xl mb-4' : 'text-lg mb-3'
          }`}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        {featured && post.excerpt && (
          <p className="text-foreground-muted line-clamp-2 mb-4">{post.excerpt}</p>
        )}

        {/* Author & Date */}
        <div className="flex items-center gap-3 mt-auto">
          {authorImageUrl && (
            <img
              src={authorImageUrl}
              alt={post.author?.name || 'Author'}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
            />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-card-foreground">
              {post.author?.name}
            </span>
            <div className="flex items-center gap-2 text-xs text-foreground-muted">
              <span>{formattedDate}</span>
              <span>·</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
