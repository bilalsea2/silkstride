'use client';

import { useEffect, useState, useRef } from 'react';

const storyLines = [
  'Imagine a journey',
  'Along ancient paths',
  'Where merchants once walked',
  'Carrying silk and spices',
  'Across endless deserts',
  'We run these roads today',
];

export default function Hero() {
  const [visibleLines, setVisibleLines] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };

    const handleScroll = () => {
      if (!heroRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const heroHeight = heroRef.current.offsetHeight;
      const scrolled = -rect.top;
      // Extended scroll range for stages
      const progress = Math.max(0, Math.min(1, scrolled / (heroHeight * 0.85)));
      
      if (rect.bottom < 0) {
        setIsHeroVisible(false);
        setScrollProgress(1);
        setVisibleLines(0);
        return;
      }
      
      setIsHeroVisible(true);
      setScrollProgress(progress);
      
      // Stage 1 (0-0.25): Progressive story line reveal
      if (progress <= 0.25) {
        const lineIndex = Math.floor((progress / 0.25) * storyLines.length);
        setVisibleLines(Math.min(lineIndex + 1, storyLines.length));
      } else {
        setVisibleLines(storyLines.length);
      }
    };

    handleResize();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  // Smoothstep-ish easing, feels good for scroll interpolation
  const ease = (t: number) => {
    const x = clamp01(t);
    return x * x * (3 - 2 * x);
  };

  // When hero is offscreen, lock to final state
  const p = isHeroVisible ? scrollProgress : 1;
  const vw = viewport.w || 1200;
  const vh = viewport.h || 800;

  // Center emphasis -> move upward (still centered) -> move to corner (while anchor shifts)
  const centerX = vw * 0.5;
  const centerY = vh * 0.5;
  const topCenterY = vh * 0.16;

  const tCenterEmphasis = ease((p - 0.4) / 0.2); // 0.4 -> 0.6
  const tToTop = ease((p - 0.6) / 0.25); // 0.6 -> 0.85
  const tToCorner = ease((p - 0.85) / 0.15); // 0.85 -> 1

  const cornerX = 16; // 1rem-ish
  const cornerY = 16;

  const titleX = 
    p < 0.85 ? centerX : lerp(centerX, cornerX, tToCorner);
  
  const titleY = 
    p < 0.6 
      ? centerY 
      : p < 0.85 
        ? lerp(centerY, topCenterY, tToTop) 
        : lerp(topCenterY, cornerY, tToCorner);

  // Anchor shifts from centered (-50%, -50%) to top-left anchored (0, 0)
  const anchorPct = -50 * (1 - tToCorner);

  // Scale: shrink faster during movement to avoid clipping
  const emphasizeScale = 1 + 0.08 * tCenterEmphasis;
  const upScale = lerp(emphasizeScale, 0.6, tToTop); 
  const cornerScale = lerp(upScale, 0.35, tToCorner); 

  // Morph: as we go to the corner, text becomes logo (blur/fade) and logo sharpens (blur->0)
  const morph = tToCorner; // 0 -> 1 during 0.85 -> 1
  const textOpacity = clamp01(1 - morph * 2.5); 
  const logoOpacity = clamp01((morph - 0.2) * 2); 
  const subtitleOpacity = (1 - morph) * (p < 0.62 ? 1 : 1 - clamp01((p - 0.62) / 0.15));
  const textBlurPx = 15 * morph;
  const logoBlurPx = 10 * (1 - morph);
  const textSkewDeg = -12 * morph; 
  const textLetterSpacing = `${lerp(-0.02, 0.1, morph)}em`; 

  const isLogoMode = !isHeroVisible || morph > 0.4;

  return (
    <section ref={heroRef} className="hero-cinematic">
      {/* Full-bleed map background */}
      <div 
        className="hero-map-bg"
        style={{
          opacity: isHeroVisible ? Math.max(0, 1 - (p - 0.7) * 3.33) : 0,
          visibility: isHeroVisible ? 'visible' : 'hidden',
          pointerEvents: 'none',
        }}
      >
        <img 
          src="/silkroad.png" 
          alt="" 
          className="hero-map-image"
          style={{
            transform: `scale(${1.2 + p * 0.3}) translateY(${p * -50}px)`,
            opacity: 0.4 + p * 0.2,
          }}
        />
        <div className="hero-map-overlay" />
      </div>

      {/* Scattered artifacts */}
      <div 
        className="artifacts-container" 
        aria-hidden="true"
        style={{
          opacity: isHeroVisible ? Math.max(0, 1 - (p - 0.4) * 2) : 0,
          visibility: isHeroVisible ? 'visible' : 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* Compass */}
        <div 
          className="artifact artifact-compass"
          style={{ 
            transform: `rotate(${p * 45}deg) translateY(${p * -30}px)`,
            opacity: 1 - p * 0.5
          }}
        >
          <svg viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" stroke="#8B7355" strokeWidth="2" fill="#F5ECD7"/>
            <circle cx="50" cy="50" r="35" stroke="#C67B5C" strokeWidth="1"/>
            <path d="M50 15L55 45L50 50L45 45Z" fill="#C67B5C"/>
            <path d="M50 85L55 55L50 50L45 55Z" fill="#8B7355"/>
            <path d="M15 50L45 45L50 50L45 55Z" fill="#8B7355"/>
            <path d="M85 50L55 45L50 50L55 55Z" fill="#8B7355"/>
            <circle cx="50" cy="50" r="5" fill="#2C2416"/>
            <text x="50" y="10" textAnchor="middle" fontSize="8" fill="#2C2416">N</text>
            <text x="50" y="95" textAnchor="middle" fontSize="8" fill="#2C2416">S</text>
            <text x="8" y="53" textAnchor="middle" fontSize="8" fill="#2C2416">W</text>
            <text x="92" y="53" textAnchor="middle" fontSize="8" fill="#2C2416">E</text>
          </svg>
        </div>

        {/* Spice pouch */}
        <div 
          className="artifact artifact-spice"
          style={{ 
            transform: `translateY(${p * 40}px) rotate(${-5 + p * 10}deg)`,
            opacity: 1 - p * 0.6
          }}
        >
          <svg viewBox="0 0 60 80" fill="none">
            <path d="M10 25 Q5 30 8 70 Q10 78 30 78 Q50 78 52 70 Q55 30 50 25 Z" fill="#B8956A"/>
            <path d="M10 25 Q30 20 50 25 Q35 30 30 28 Q25 30 10 25" fill="#9A7B5B"/>
            <ellipse cx="30" cy="25" rx="20" ry="5" fill="#C4A77D"/>
            <path d="M25 20 L30 5 L35 20" stroke="#8B7355" strokeWidth="2" fill="none"/>
            <circle cx="30" cy="5" r="3" fill="#C67B5C"/>
          </svg>
        </div>

        {/* Old coin */}
        <div 
          className="artifact artifact-coin"
          style={{ 
            transform: `rotate(${p * 90}deg)`,
            opacity: 1 - p * 0.5
          }}
        >
          <svg viewBox="0 0 50 50" fill="none">
            <circle cx="25" cy="25" r="23" fill="#CC9544" stroke="#A67B28" strokeWidth="2"/>
            <circle cx="25" cy="25" r="18" stroke="#8B6914" strokeWidth="1"/>
            <text x="25" y="30" textAnchor="middle" fontSize="14" fill="#6B5114" fontFamily="serif">絲</text>
          </svg>
        </div>

        {/* Silk fabric swatch */}
        <div 
          className="artifact artifact-silk"
          style={{ 
            transform: `translateX(${p * -30}px) rotate(${12 + p * -15}deg)`,
            opacity: 1 - p * 0.6
          }}
        >
          <svg viewBox="0 0 80 60" fill="none">
            <path d="M5 10 Q40 5 75 10 Q78 30 75 50 Q40 55 5 50 Q2 30 5 10" fill="#A63D40" opacity="0.9"/>
            <path d="M10 15 Q40 12 70 15" stroke="#8B2E30" strokeWidth="0.5" opacity="0.5"/>
            <path d="M10 25 Q40 22 70 25" stroke="#8B2E30" strokeWidth="0.5" opacity="0.5"/>
            <path d="M10 35 Q40 32 70 35" stroke="#8B2E30" strokeWidth="0.5" opacity="0.5"/>
            <path d="M10 45 Q40 42 70 45" stroke="#8B2E30" strokeWidth="0.5" opacity="0.5"/>
          </svg>
        </div>

        {/* Vintage stamp */}
        <div 
          className="artifact artifact-stamp"
          style={{ 
            transform: `rotate(${-8 + p * 20}deg) translateY(${p * 50}px)`,
            opacity: 1 - p * 0.5
          }}
        >
          <svg viewBox="0 0 70 50" fill="none">
            <rect x="2" y="2" width="66" height="46" fill="#E8DCC4" stroke="#8B7355" strokeWidth="1" strokeDasharray="3 2"/>
            <rect x="6" y="6" width="58" height="38" stroke="#C67B5C" strokeWidth="0.5"/>
            <text x="35" y="22" textAnchor="middle" fontSize="6" fill="#5C5144" fontFamily="serif">SILK ROAD</text>
            <text x="35" y="32" textAnchor="middle" fontSize="8" fill="#2C2416" fontFamily="serif">TASHKENT</text>
            <text x="35" y="42" textAnchor="middle" fontSize="5" fill="#8B7355">EST. 2024</text>
          </svg>
        </div>

        {/* Running figure silhouette */}
        <div 
          className="artifact artifact-runner"
          style={{ 
            transform: `translateX(${p * 100}px)`,
            opacity: 0.3 + p * 0.4
          }}
        >
          <svg viewBox="0 0 40 50" fill="#2C2416" opacity="0.6">
            <circle cx="20" cy="8" r="5"/>
            <path d="M15 13 Q20 18 25 13 L28 25 L22 24 L20 35 L28 48 L24 48 L18 38 L12 48 L8 48 L15 35 L13 24 L8 25 L12 13 Z"/>
          </svg>
        </div>
      </div>

      {/* Story text - fades out completely before title moves to corner */}
      <div 
        className="hero-content"
        style={{
          opacity: isHeroVisible ? 1 : 0,
          visibility: isHeroVisible ? 'visible' : 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div 
          className="hero-story"
          style={{
            // Fade out story text before title moves to corner
            opacity: clamp01(1 - p * 3), 
            transform: p > 0.1 
              ? `scale(${1 - (p - 0.1) * 0.3}) translateY(${(p - 0.1) * -30}px)` 
              : 'scale(1)',
            transition: 'opacity 0.1s linear, transform 0.1s linear',
          }}
        >
          {storyLines.map((line, index) => (
            <p
              key={index}
              className={`story-line ${index < visibleLines ? 'visible' : ''}`}
              style={{
                transitionDelay: `${index * 0.03}s`,
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Independent Floating Title/Logo */}
      <div 
        className={`hero-title-floating ${isLogoMode ? 'is-logo' : ''}`}
        style={{
          opacity: p < 0.4 ? 0 : 1,
          left: `${titleX}px`,
          top: `${titleY}px`,
          transform: `translate(${anchorPct}%, ${anchorPct}%) scale(${cornerScale})`,
          zIndex: 100,
          transition: 'none', // Driven by manual interpolation for smoothness
        }}
      >
        <div style={{ 
          position: 'relative', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '100%',
          height: '100%'
        }}>
          {/* Text Title - Fades out */}
          <div style={{ 
            opacity: textOpacity,
            filter: `blur(${textBlurPx}px)`,
            transform: `skewX(${textSkewDeg}deg)`,
            letterSpacing: textLetterSpacing,
            position: p > 0.8 ? 'absolute' : 'relative', // Let logo take over sizing
            whiteSpace: 'nowrap'
          }}>
            <h1 className="hero-title display-heading">Silk Stride</h1>
            <p 
              className="hero-subtitle section-subheading"
              style={{
                opacity: subtitleOpacity,
                filter: `blur(${Math.min(6, textBlurPx)}px)`,
              }}
            >
              Running Club · Tashkent
            </p>
          </div>
          
          {/* Logo Image - Fades in */}
          <img 
            src="/logos/logo-dark.png" 
            alt="Silk Stride"
            className="hero-logo-image"
            style={{
              opacity: logoOpacity,
              filter: `blur(${logoBlurPx}px)`,
              height: 'clamp(6.5rem, 15vw, 9.5rem)',
              width: 'auto',
              display: p > 0.75 ? 'block' : 'none',
              position: p > 0.8 ? 'relative' : 'absolute', // Become sizing anchor in logo mode
              transform: p > 0.8 ? 'none' : 'translate(-50%, -50%)',
              top: p > 0.8 ? 'auto' : '50%',
              left: p > 0.8 ? 'auto' : '50%',
            }}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className="scroll-indicator"
        style={{ 
          opacity: isHeroVisible ? Math.max(0, 1 - p * 3) : 0,
          visibility: isHeroVisible ? 'visible' : 'hidden',
        }}
      >
        <span>Scroll to explore</span>
        <div className="scroll-indicator-mouse" />
      </div>
    </section>
  );
}
