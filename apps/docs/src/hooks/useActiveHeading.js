import { useEffect, useState } from 'react';

/*
  Scroll spy for the docs table of contents. It watches the section headings
  and reports the one closest to the top of the viewport. No layout thrash:
  the observer only fires when a heading crosses the reading line.
*/
export function useActiveHeading(ids) {
  const [activeId, setActiveId] = useState(ids[0] || '');
  const key = ids.join('|');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -65% 0px', threshold: [0, 1] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [key]);

  return activeId;
}
