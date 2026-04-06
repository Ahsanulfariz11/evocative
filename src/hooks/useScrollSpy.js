import { useState, useEffect } from 'react';

export const useScrollSpy = (ids, offset = 80) => {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const handleScroll = () => {
      const pos = window.scrollY + offset;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          const bottom = top + el.offsetHeight;
          if (pos >= top && pos < bottom) {
            setActiveId(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ids, offset]);

  return activeId;
};
