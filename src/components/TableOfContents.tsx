import { useState, useEffect } from 'react';

interface Heading {
  text: string;
  level: number;
  id: string;
}

interface TableOfContentsProps {
  headings: Heading[];
  contentRef?: React.RefObject<HTMLElement | null>;
}

export function TableOfContents({ headings, contentRef }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // Track active heading
  useEffect(() => {
    if (headings.length < 3) return;

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

  // Show/hide sidebar based on content visibility
  useEffect(() => {
    if (!contentRef?.current || headings.length < 3) return;

    const content = contentRef.current;

    const checkVisibility = () => {
      const rect = content.getBoundingClientRect();
      const headerHeight = 80;

      // Show sidebar when content is in view (top hasn't scrolled too far past, bottom hasn't entered yet)
      const contentTop = rect.top;
      const contentBottom = rect.bottom;

      // Show TOC when we're within the content area
      const shouldShow = contentTop < window.innerHeight - 200 && contentBottom > headerHeight + 100;
      setShowSidebar(shouldShow);
    };

    checkVisibility();
    window.addEventListener('scroll', checkVisibility, { passive: true });
    return () => window.removeEventListener('scroll', checkVisibility);
  }, [contentRef, headings]);

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
            className={`text-left text-sm leading-snug transition-colors hover:text-primary ${
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
        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[500px] pb-4 px-6' : 'max-h-0'}`}>
          {tocList}
        </div>
      </nav>

      {/* Desktop: Sticky sidebar TOC */}
      <aside
        className={`hidden lg:block fixed left-[max(1rem,calc((100vw-1200px)/2-220px))] top-28 w-52 max-h-[calc(100vh-150px)] overflow-y-auto transition-all duration-300 ${
          showSidebar ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
        }`}
      >
        <nav className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <h2 className="text-xs font-bold text-primary-dark mb-3 uppercase tracking-wider">On this page</h2>
          {tocList}
        </nav>
      </aside>
    </>
  );
}
