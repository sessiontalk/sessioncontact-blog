import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Helper to get image URL - handles both direct URLs and Sanity references
export function getImageUrl(asset: { _ref?: string; url?: string } | null | undefined, width?: number, height?: number): string | null {
  if (!asset) return null;

  // If there's a direct URL, use it
  if (asset.url) {
    return asset.url;
  }

  // If there's a valid _ref, use the image builder
  if (asset._ref) {
    let img = builder.image(asset);
    if (width) img = img.width(width);
    if (height) img = img.height(height);
    return img.url();
  }

  return null;
}

// GROQ Queries
export const queries = {
  // Get all posts
  allPosts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage {
      asset->{
        _ref,
        url
      },
      alt
    },
    author->{
      _id,
      name,
      title,
      image {
        asset->{
          _ref,
          url
        }
      }
    },
    categories[]->{
      _id,
      title,
      slug
    },
    publishedAt
  }`,

  // Get featured posts
  featuredPosts: `*[_type == "post" && isFeatured == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    mainImage {
      asset->{
        _ref,
        url
      },
      alt
    },
    author->{
      _id,
      name,
      title,
      image {
        asset->{
          _ref,
          url
        }
      }
    },
    categories[]->{
      _id,
      title,
      slug
    },
    publishedAt
  }`,

  // Get posts by category
  postsByCategory: (_categorySlug: string) => `*[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage {
      asset->{
        _ref,
        url
      },
      alt
    },
    author->{
      _id,
      name,
      title,
      image {
        asset->{
          _ref,
          url
        }
      }
    },
    categories[]->{
      _id,
      title,
      slug
    },
    publishedAt
  }`,

  // Get single post by slug
  postBySlug: (slug: string) => `*[_type == "post" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage {
      asset->{
        _ref,
        url
      },
      alt
    },
    author->{
      _id,
      name,
      title,
      bio,
      image {
        asset->{
          _ref,
          url
        }
      }
    },
    categories[]->{
      _id,
      title,
      slug
    },
    publishedAt,
    body
  }`,

  // Get all categories
  allCategories: `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }`,
};
