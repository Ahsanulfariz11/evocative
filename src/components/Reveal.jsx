import React, { useState, useEffect, useRef } from 'react';

const useIntersectionObserver = (options = { threshold: 0.1, triggerOnce: true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options.triggerOnce && ref.current) observer.unobserve(ref.current);
      }
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options.threshold, options.triggerOnce]);

  return [ref, isVisible];
};

const Reveal = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const [ref, isVisible] = useIntersectionObserver();

  const transforms = {
    up: isVisible ? 'translateY(0)' : 'translateY(40px)',
    down: isVisible ? 'translateY(0)' : 'translateY(-40px)',
    left: isVisible ? 'translateX(0)' : 'translateX(40px)',
    right: isVisible ? 'translateX(0)' : 'translateX(-40px)',
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: transforms[direction] || transforms.up,
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default Reveal;
