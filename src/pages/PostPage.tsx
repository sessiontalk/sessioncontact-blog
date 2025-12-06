import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import type { PortableTextComponents } from '@portabletext/react';
import { sanityClient, queries, getImageUrl, urlFor } from '../lib/sanity';
import type { Post } from '../types/blog';
import { SEO } from '../components/SEO';

// Custom components for PortableText rendering
const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const imageUrl = urlFor(value.asset).width(800).url();
      return (
        <figure className="my-8">
          <img
            src={imageUrl}
            alt={value.alt || ''}
            className="w-full rounded-2xl shadow-lg"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-foreground-muted mt-3">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const data = await sanityClient.fetch(queries.postBySlug(slug));
        console.log('Fetched post:', data);
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-64 bg-gray-200 rounded-[20px]" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">{error}</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to blog
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mainImageUrl = getImageUrl(post.mainImage?.asset, 1200, 630);
  const authorImageUrl = getImageUrl(post.author?.image?.asset, 80, 80);
  const authorBioImageUrl = getImageUrl(post.author?.image?.asset, 120, 120);

  return (
    <article className="min-h-screen">
      <SEO
        title={post.title}
        description={post.excerpt}
        image={mainImageUrl || undefined}
        url={window.location.href}
        type="article"
        publishedAt={post.publishedAt}
        author={post.author?.name}
      />
      {/* Hero Section */}
      <section className="bg-background-alt py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link to="/" className="text-primary hover:underline text-sm">
              Blog
            </Link>
            <span className="mx-2 text-foreground-muted">/</span>
            <span className="text-foreground-muted text-sm">{post.title}</span>
          </nav>

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/?category=${category.slug.current}`}
                  className="inline-block px-3 py-1 text-xs font-semibold text-badge-text bg-badge rounded-full hover:bg-primary/90 transition-colors"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-dark mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg md:text-xl text-foreground-muted mb-8">
              {post.excerpt}
            </p>
          )}

          {/* Author & Date */}
          <div className="flex items-center gap-4">
            {authorImageUrl && (
              <img
                src={authorImageUrl}
                alt={post.author?.name || 'Author'}
                className="w-14 h-14 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-semibold text-foreground">{post.author?.name}</p>
              {post.author?.title && (
                <p className="text-sm text-foreground-muted">{post.author.title}</p>
              )}
              <p className="text-sm text-foreground-muted">{formattedDate}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Image */}
      {mainImageUrl && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
          <img
            src={mainImageUrl}
            alt={post.mainImage?.alt || post.title}
            className="w-full h-auto rounded-[20px] shadow-xl"
          />
        </div>
      )}

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none prose-headings:text-primary-dark prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            {post.body && <PortableText value={post.body} components={portableTextComponents} />}
          </div>
        </div>
      </section>

      {/* Author Bio */}
      {post.author?.bio && (
        <section className="bg-background-alt py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start gap-6 p-6 bg-white rounded-[20px] shadow-sm">
              {authorBioImageUrl && (
                <img
                  src={authorBioImageUrl}
                  alt={post.author.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-sm text-primary font-medium mb-1">Written by</p>
                <p className="font-bold text-xl text-foreground mb-1">{post.author.name}</p>
                {post.author.title && (
                  <p className="text-foreground-muted mb-3">{post.author.title}</p>
                )}
                <p className="text-foreground-muted">{post.author.bio}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center text-primary hover:underline font-medium"
          >
            <svg
              className="mr-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to all posts
          </Link>
        </div>
      </section>
    </article>
  );
}
