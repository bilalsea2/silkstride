'use client';

import { useState, useEffect, useCallback } from 'react';
import { Location } from '@/data/locations';
import { getPhotosForLocation } from '@/data/photos';

interface PhotoModalProps {
  location: Location | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PhotoModal({ location, isOpen, onClose }: PhotoModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState(true);

  // Load photos for the location from our data file
  useEffect(() => {
    if (!location) return;
    
    setCurrentIndex(0);
    setImageLoading(true);
    
    // Get photos from our data file - instant, no network requests
    const locationPhotos = getPhotosForLocation(location.id);
    setPhotos(locationPhotos);
  }, [location]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      setImageLoading(true);
      setCurrentIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1));
    } else if (e.key === 'ArrowRight') {
      setImageLoading(true);
      setCurrentIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0));
    }
  }, [isOpen, onClose, photos.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!location) return null;

  const hasPhotos = photos.length > 0;

  return (
    <div 
      className={`modal-overlay ${isOpen ? 'open' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 id="modal-title" className="modal-title">{location.name}</h2>
            {location.nameLocal && (
              <p className="modal-subtitle">{location.nameLocal}</p>
            )}
          </div>
          <button 
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Photo carousel */}
        <div className="photo-carousel">
          {hasPhotos ? (
            <>
              {imageLoading && (
                <div className="carousel-loading">
                  <span>Loading...</span>
                </div>
              )}
              <img
                src={photos[currentIndex]}
                alt={`${location.name} marathon - Photo ${currentIndex + 1}`}
                className="carousel-image"
                style={{ opacity: imageLoading ? 0 : 1 }}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
              
              {photos.length > 1 && (
                <>
                  <button
                    className="carousel-nav prev"
                    onClick={() => {
                      setImageLoading(true);
                      setCurrentIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1));
                    }}
                    aria-label="Previous photo"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    className="carousel-nav next"
                    onClick={() => {
                      setImageLoading(true);
                      setCurrentIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0));
                    }}
                    aria-label="Next photo"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="placeholder-image">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              <span>Photos coming soon</span>
            </div>
          )}
        </div>

        {/* Photo indicators */}
        {hasPhotos && photos.length > 1 && (
          <div className="photo-indicators">
            {photos.map((_, index) => (
              <button
                key={index}
                className={`photo-indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  setImageLoading(true);
                  setCurrentIndex(index);
                }}
                aria-label={`Go to photo ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Info section */}
        <div className="modal-info">
          <p className="modal-description">{location.description}</p>
          
          {(location.date || location.distance) && (
            <div className="modal-date">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              {location.distance && <span>{location.distance}</span>}
              {location.date && location.distance && <span>•</span>}
              {location.date && <span>{location.date}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

