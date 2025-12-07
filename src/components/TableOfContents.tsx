import { useState, useEffect } from 'react';

interface Heading {
  text: string;
  level: number;
  id: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setIsExpanded(false);
    }
  };

  const tocList = (
    <ul className="space-y-2">
      {headings.map(({ text, level, id }) => (
        <li
          key={id}
          className={level === 3 ? 'ml-4' : ''}
        >
          <button
            onClick={() => scrollToHeading(id)}
            className={`text-left text-sm transition-colors hover:text-primary ${
              activeId === id
                ? 'text-primary font-medium'
                : 'text-foreground-muted'
            }`}
          >
            {text}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile: Collapsible TOC at top of content */}
      <nav className="lg:hidden bg-background-alt rounded-2xl mb-8 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between text-left"
        >
          <span className="text-lg font-bold text-primary-dark">Table of Contents</span>
          <svg
            className={`w-5 h-5 text-foreground-muted transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 pb-4 px-6' : 'max-h-0'}`}>
          {tocList}
        </div>
      </nav>

      {/* Desktop: Sticky sidebar TOC on the left */}
      <aside className="hidden lg:block fixed left-8 xl:left-[calc((100vw-768px)/2-280px)] top-32 w-56 max-h-[calc(100vh-160px)] overflow-y-auto">
        <nav className="bg-background-alt rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-primary-dark mb-3 uppercase tracking-wide">On this page</h2>
          {tocList}
        </nav>
      </aside>
    </>
  );
}
