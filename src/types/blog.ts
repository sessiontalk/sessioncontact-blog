export interface Author {
  _id: string;
  name: string;
  title: string;
  image?: {
    asset: {
      _ref: string;
      url?: string;
    };
  };
  bio?: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  mainImage?: {
    asset: {
      _ref: string;
      url?: string;
    };
    alt?: string;
  };
  author: Author;
  categories: Category[];
  publishedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any; // Portable Text blocks
  readingTime?: number;
}

export interface FeaturedPost extends Post {
  isFeatured: true;
}
