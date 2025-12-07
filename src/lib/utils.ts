// Calculate reading time from text content
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime); // Minimum 1 minute
}

// Extract plain text from Portable Text blocks
export function extractTextFromPortableText(blocks: unknown[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';

  return blocks
    .filter((block: unknown) => {
      const b = block as { _type?: string };
      return b._type === 'block';
    })
    .map((block: unknown) => {
      const b = block as { children?: Array<{ text?: string }> };
      if (!b.children) return '';
      return b.children
        .map((child) => child.text || '')
        .join('');
    })
    .join(' ');
}

// Extract headings from Portable Text for Table of Contents
export function extractHeadingsFromPortableText(blocks: unknown[]): Array<{ text: string; level: number; id: string }> {
  if (!blocks || !Array.isArray(blocks)) return [];

  return blocks
    .filter((block: unknown) => {
      const b = block as { _type?: string; style?: string };
      return b._type === 'block' && (b.style === 'h1' || b.style === 'h2' || b.style === 'h3');
    })
    .map((block: unknown) => {
      const b = block as { style?: string; children?: Array<{ text?: string }>; _key?: string };
      const text = b.children?.map((child) => child.text || '').join('') || '';
      const level = b.style === 'h1' ? 1 : b.style === 'h2' ? 2 : 3;
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return { text, level, id };
    });
}
