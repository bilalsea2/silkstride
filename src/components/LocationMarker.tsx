'use client';

import { Location } from '@/data/locations';

interface LocationMarkerProps {
  location: Location;
  onClick: (location: Location) => void;
  style?: React.CSSProperties;
}

export default function LocationMarker({ location, onClick, style }: LocationMarkerProps) {
  return (
    <div
      className="location-marker"
      style={{
        left: `${location.x}%`,
        top: `${location.y}%`,
        ...style,
      }}
      onClick={() => onClick(location)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(location);
        }
      }}
      aria-label={`View ${location.name} marathon photos`}
    >
      {/* Pin icon */}
      <div className="marker-pin">
        <svg viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      </div>

      {/* City name label */}
      <span className="marker-label">{location.name}</span>

      {/* Pulse animation ring */}
      <div className="marker-pulse" />
    </div>
  );
}

