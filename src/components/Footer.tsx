'use client';

export default function Footer() {
  return (
    <footer className="footer">
      <img 
        src="/logos/logo-dark.png" 
        alt="Silk Stride" 
        className="footer-logo-image"
      />
      <p className="footer-tagline">Running the ancient paths of the Silk Road</p>
      
      <div className="footer-links">
        <a 
          href="https://www.strava.com/clubs/silkstride" 
          target="_blank" 
          rel="noopener noreferrer"
          className="footer-link"
        >
          Strava Club
        </a>
        <a 
          href="https://t.me/silk_stride" 
          target="_blank" 
          rel="noopener noreferrer"
          className="footer-link"
        >
          Telegram
        </a>
      </div>

      <p className="footer-copyright">
        SILK STRIDE © {new Date().getFullYear()} · TASHKENT, UZBEKISTAN
      </p>
    </footer>
  );
}

