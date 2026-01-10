'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export default function ScrollSection({
  children,
  className = '',
  threshold = 0.15,
  rootMargin = '0px 0px -50px 0px',
}: ScrollSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, stop observing
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return (
    <section
      ref={ref}
      className={`scroll-section ${isVisible ? 'visible' : ''} ${className}`}
    >
      {children}
    </section>
  );
}

