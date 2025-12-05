import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'n3s7nj4t',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skgPlnRnZ7I0y0MyGV9MqI6IRftTkfSXOGlMPsygtL0RKCxZq2wckzX0ac3inFa3DZdB3fNVO4QZbYP5RFdacR2IqWvK2TJuIEnkP8JTPWg4mwfj5LdzDb17ybOravtWHRn5yjxvP7u7aA0Ms7ZFyQj9XuYOF3Y8NuwYrlyfUbZy4ElyWTUH',
  useCdn: false,
});

async function uploadImageFromUrl(imageUrl: string, filename: string) {
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const asset = await client.assets.upload('image', Buffer.from(buffer), {
    filename,
  });
  return asset;
}

async function seedContent() {
  console.log('Creating categories...');

  // Create categories
  const categories = [
    {
      _id: 'category-customer-experience',
      _type: 'category',
      title: 'Customer Experience',
      slug: { _type: 'slug', current: 'customer-experience' },
      description: 'Best practices for delivering exceptional customer experiences',
    },
    {
      _id: 'category-ai-automation',
      _type: 'category',
      title: 'AI & Automation',
      slug: { _type: 'slug', current: 'ai-automation' },
      description: 'Leveraging AI and automation in contact centers',
    },
    {
      _id: 'category-contact-center',
      _type: 'category',
      title: 'Contact Center',
      slug: { _type: 'slug', current: 'contact-center' },
      description: 'Contact center operations and management',
    },
    {
      _id: 'category-omnichannel',
      _type: 'category',
      title: 'Omnichannel',
      slug: { _type: 'slug', current: 'omnichannel' },
      description: 'Creating seamless omnichannel experiences',
    },
  ];

  for (const category of categories) {
    await client.createOrReplace(category);
    console.log(`Created category: ${category.title}`);
  }

  console.log('\nCreating author...');

  // Create author
  const authorImageUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop';
  const authorImage = await uploadImageFromUrl(authorImageUrl, 'author-avatar.jpg');

  const author = {
    _id: 'author-james-wilson',
    _type: 'author',
    name: 'James Wilson',
    title: 'Head of Customer Experience',
    bio: 'James has over 15 years of experience in customer experience and contact center operations. He specializes in implementing AI-powered solutions that enhance customer satisfaction.',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: authorImage._id,
      },
    },
  };

  await client.createOrReplace(author);
  console.log('Created author: James Wilson');

  console.log('\nUploading post images...');

  // Upload images for posts
  const postImages = await Promise.all([
    uploadImageFromUrl(
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=630&fit=crop',
      'ai-customer-service.jpg'
    ),
    uploadImageFromUrl(
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop',
      'omnichannel-strategy.jpg'
    ),
    uploadImageFromUrl(
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop',
      'contact-center-metrics.jpg'
    ),
  ]);

  console.log('\nCreating posts...');

  // Create posts
  const posts = [
    {
      _id: 'post-ai-transforming-customer-service',
      _type: 'post',
      title: 'How AI is Transforming Customer Service in 2024',
      slug: { _type: 'slug', current: 'ai-transforming-customer-service-2024' },
      excerpt: 'Discover how artificial intelligence is revolutionizing customer service operations, from chatbots to predictive analytics, and what it means for your business.',
      publishedAt: '2024-12-01T10:00:00Z',
      isFeatured: true,
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: postImages[0]._id,
        },
        alt: 'AI-powered customer service dashboard',
      },
      author: {
        _type: 'reference',
        _ref: 'author-james-wilson',
      },
      categories: [
        { _type: 'reference', _ref: 'category-ai-automation', _key: 'cat1' },
        { _type: 'reference', _ref: 'category-customer-experience', _key: 'cat2' },
      ],
      body: [
        {
          _type: 'block',
          _key: 'intro1',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: 'Artificial intelligence has moved from a futuristic concept to an essential tool in modern customer service. Organizations worldwide are leveraging AI to enhance customer experiences, reduce response times, and improve operational efficiency.',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'heading1',
          style: 'h2',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span2',
              text: 'The Rise of Intelligent Chatbots',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'para1',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span3',
              text: 'Modern AI chatbots have evolved far beyond simple rule-based systems. Today\'s conversational AI can understand context, sentiment, and intent, providing human-like interactions that resolve customer issues efficiently. These systems learn from every interaction, continuously improving their responses.',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'heading2',
          style: 'h2',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span4',
              text: 'Predictive Analytics for Proactive Service',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'para2',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span5',
              text: 'AI-powered predictive analytics enables businesses to anticipate customer needs before they arise. By analyzing patterns in customer behavior, companies can proactively reach out with solutions, turning potential problems into opportunities for exceptional service.',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'conclusion',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span6',
              text: 'As we move further into 2024, the integration of AI in customer service will only deepen. Organizations that embrace these technologies today will be well-positioned to deliver the seamless, personalized experiences that customers increasingly expect.',
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _id: 'post-building-omnichannel-strategy',
      _type: 'post',
      title: 'Building an Effective Omnichannel Strategy for Your Contact Center',
      slug: { _type: 'slug', current: 'building-omnichannel-strategy-contact-center' },
      excerpt: 'Learn how to create a seamless customer experience across all channels, from voice and email to chat and social media.',
      publishedAt: '2024-11-28T14:30:00Z',
      isFeatured: false,
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: postImages[1]._id,
        },
        alt: 'Team planning omnichannel strategy',
      },
      author: {
        _type: 'reference',
        _ref: 'author-james-wilson',
      },
      categories: [
        { _type: 'reference', _ref: 'category-omnichannel', _key: 'cat1' },
        { _type: 'reference', _ref: 'category-contact-center', _key: 'cat2' },
      ],
      body: [
        {
          _type: 'block',
          _key: 'intro1',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: 'In today\'s connected world, customers expect to interact with businesses on their preferred channels without losing context. An effective omnichannel strategy ensures that whether a customer starts on chat and moves to phone, their journey remains seamless.',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'heading1',
          style: 'h2',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span2',
              text: 'Understanding Your Customer Journey',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'para1',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span3',
              text: 'The first step in building an omnichannel strategy is mapping your customer journey. Identify all touchpoints where customers interact with your brand and understand how they move between channels. This insight forms the foundation of your strategy.',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'heading2',
          style: 'h2',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span4',
              text: 'Unified Customer Data',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'para2',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span5',
              text: 'A true omnichannel experience requires unified customer data. Every interaction, regardless of channel, should be logged in a central system. This gives agents complete visibility into customer history, enabling personalized and efficient service.',
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _id: 'post-contact-center-metrics',
      _type: 'post',
      title: '10 Essential Contact Center Metrics Every Manager Should Track',
      slug: { _type: 'slug', current: 'essential-contact-center-metrics' },
      excerpt: 'From first call resolution to customer satisfaction scores, discover the key metrics that drive contact center success.',
      publishedAt: '2024-11-25T09:00:00Z',
      isFeatured: false,
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: postImages[2]._id,
        },
        alt: 'Contact center analytics dashboard',
      },
      author: {
        _type: 'reference',
        _ref: 'author-james-wilson',
      },
      categories: [
        { _type: 'reference', _ref: 'category-contact-center', _key: 'cat1' },
      ],
      body: [
        {
          _type: 'block',
          _key: 'intro1',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: 'Measuring the right metrics is crucial for contact center success. While there are countless data points available, focusing on the metrics that truly matter can help you improve performance, reduce costs, and enhance customer satisfaction.',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'heading1',
          style: 'h2',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span2',
              text: '1. First Call Resolution (FCR)',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'para1',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span3',
              text: 'FCR measures the percentage of customer issues resolved on the first contact. High FCR rates correlate strongly with customer satisfaction and operational efficiency. Aim for an FCR rate of 70-75% or higher.',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'heading2',
          style: 'h2',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span4',
              text: '2. Average Handle Time (AHT)',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'para2',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span5',
              text: 'AHT includes talk time, hold time, and after-call work. While shorter isn\'t always better, monitoring AHT helps identify training opportunities and process inefficiencies. Balance speed with quality for optimal results.',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'heading3',
          style: 'h2',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span6',
              text: '3. Customer Satisfaction Score (CSAT)',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'para3',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span7',
              text: 'CSAT directly measures how satisfied customers are with their service experience. Regular surveys after interactions provide valuable feedback for continuous improvement. Industry benchmarks typically range from 75-85%.',
              marks: [],
            },
          ],
        },
      ],
    },
  ];

  for (const post of posts) {
    await client.createOrReplace(post);
    console.log(`Created post: ${post.title}`);
  }

  console.log('\n✅ Content seeded successfully!');
}

seedContent().catch(console.error);
