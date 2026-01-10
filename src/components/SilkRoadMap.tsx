'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { locations, Location } from '@/data/locations';
import LocationMarker from './LocationMarker';
import PhotoModal from './PhotoModal';
import ScrollSection from './ScrollSection';

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 2.5;
const DEFAULT_ZOOM = 0.75; // Used as fallback only; we auto-fit visited cities once the image is loaded.
const DEFAULT_POSITION = { x: 0, y: 0 }; // Used as fallback only.

export default function SilkRoadMap() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapPosition, setMapPosition] = useState(DEFAULT_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapImgRef = useRef<HTMLImageElement>(null);

  // "Home" view is computed to frame *our visited places* (locations[]).
  const [homeView, setHomeView] = useState<{
    zoom: number;
    position: { x: number; y: number };
  } | null>(null);

  const focusLocations = useMemo(() => {
    // Today: every location in locations[] is a Silk Stride expedition.
    // If we later add non-visited points, we can filter here.
    return locations;
  }, []);

  // Calculate max pan based on zoom level and map dimensions
  const getMaxPan = useCallback((currentZoom: number) => {
    if (!containerRef.current) {
      return { x: 500, y: 300 };
    }
    
    // Map image dimensions (use natural size when available; fall back to a safe estimate)
    const mapWidth = mapImgRef.current?.naturalWidth || 1800;
    const mapHeight = mapImgRef.current?.naturalHeight || 1200;
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    
    // Calculate scaled map dimensions
    const scaledWidth = mapWidth * currentZoom;
    const scaledHeight = mapHeight * currentZoom;
    
    // Allow panning to see edges of the map
    // Pan range is half the difference between scaled map and container
    const maxPanX = Math.max(0, (scaledWidth - containerWidth) / 2);
    const maxPanY = Math.max(0, (scaledHeight - containerHeight) / 2);
    
    return {
      x: maxPanX || 500, // Fallback if calculation fails
      y: maxPanY || 300,
    };
  }, []);

  const computeHomeView = useCallback(() => {
    const container = containerRef.current;
    const img = mapImgRef.current;
    if (!container || !img) return null;
    if (!img.naturalWidth || !img.naturalHeight) return null;

    const mapW = img.naturalWidth;
    const mapH = img.naturalHeight;
    const cw = container.offsetWidth;
    const ch = container.offsetHeight;
    if (!cw || !ch) return null;

    // Bounding box of our expedition points on the map (percent -> px)
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const loc of focusLocations) {
      const px = (loc.x / 100) * mapW;
      const py = (loc.y / 100) * mapH;
      minX = Math.min(minX, px);
      minY = Math.min(minY, py);
      maxX = Math.max(maxX, px);
      maxY = Math.max(maxY, py);
    }

    if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
      return null;
    }

    const bboxW = Math.max(1, maxX - minX);
    const bboxH = Math.max(1, maxY - minY);

    // Add comfortable padding so we see context around the visited cities.
    const paddedW = bboxW * 1.55;
    const paddedH = bboxH * 1.55;

    // Fit the padded box into the container
    const fitZoomRaw = Math.min(cw / paddedW, ch / paddedH);
    // Cap initial zoom so it doesn't feel overly zoomed-in even on large screens.
    const fitZoom = Math.max(MIN_ZOOM, Math.min(1.15, Math.min(MAX_ZOOM, fitZoomRaw)));

    const bboxCx = (minX + maxX) / 2;
    const bboxCy = (minY + maxY) / 2;

    // Our wrapper is centered at map center when position = {0,0}.
    // After scaling by zoom, a point's screen offset from center is (point - mapCenter) * zoom.
    // So to center bbox center, we translate by (mapCenter - bboxCenter) * zoom.
    const posX = (mapW / 2 - bboxCx) * fitZoom;
    const posY = (mapH / 2 - bboxCy) * fitZoom;

    // Clamp within pan bounds at this zoom
    const maxPan = getMaxPan(fitZoom);
    const clamped = {
      x: Math.max(-maxPan.x, Math.min(maxPan.x, posX)),
      y: Math.max(-maxPan.y, Math.min(maxPan.y, posY)),
    };

    return { zoom: fitZoom, position: clamped };
  }, [focusLocations, getMaxPan]);

  // Auto-fit the map once the image is loaded (and keep it sane on resize).
  useEffect(() => {
    if (homeView) return;
    const next = computeHomeView();
    if (!next) return;
    setHomeView(next);
    setZoom(next.zoom);
    setMapPosition(next.position);
  }, [computeHomeView, homeView]);

  useEffect(() => {
    if (!homeView) return;
    // Recompute home view on resize so it stays focused on our cities.
    const handleResize = () => {
      const next = computeHomeView();
      if (!next) return;
      setHomeView(next);
      setZoom(next.zoom);
      setMapPosition(next.position);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [computeHomeView, homeView]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.location-marker')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapPosition.x, y: e.clientY - mapPosition.y });
  }, [mapPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    const maxPan = getMaxPan(zoom);
    
    setMapPosition({
      x: Math.max(-maxPan.x, Math.min(maxPan.x, newX)),
      y: Math.max(-maxPan.y, Math.min(maxPan.y, newY)),
    });
  }, [isDragging, dragStart, zoom, getMaxPan]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1; // Slower zoom
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + delta));
    setZoom(newZoom);

    // Adjust position to stay within new bounds
    const maxPan = getMaxPan(newZoom);
    setMapPosition(prev => ({
      x: Math.max(-maxPan.x, Math.min(maxPan.x, prev.x)),
      y: Math.max(-maxPan.y, Math.min(maxPan.y, prev.y)),
    }));
  }, [zoom, getMaxPan]);

  const handleLocationClick = useCallback((location: Location) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => {
      const newZoom = Math.min(MAX_ZOOM, prev + 0.2);
      const maxPan = getMaxPan(newZoom);
      setMapPosition(current => ({
        x: Math.max(-maxPan.x, Math.min(maxPan.x, current.x)),
        y: Math.max(-maxPan.y, Math.min(maxPan.y, current.y)),
      }));
      return newZoom;
    });
  }, [getMaxPan]);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => {
      const newZoom = Math.max(MIN_ZOOM, prev - 0.2);
      const maxPan = getMaxPan(newZoom);
      setMapPosition(current => ({
        x: Math.max(-maxPan.x, Math.min(maxPan.x, current.x)),
        y: Math.max(-maxPan.y, Math.min(maxPan.y, current.y)),
      }));
      return newZoom;
    });
  }, [getMaxPan]);

  const handleReset = useCallback(() => {
    if (homeView) {
      setMapPosition(homeView.position);
      setZoom(homeView.zoom);
      return;
    }
    setMapPosition(DEFAULT_POSITION);
    setZoom(DEFAULT_ZOOM);
  }, [homeView]);

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - mapPosition.x, y: touch.clientY - mapPosition.y });
    }
  }, [mapPosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    const maxPan = getMaxPan(zoom);
    
    setMapPosition({
      x: Math.max(-maxPan.x, Math.min(maxPan.x, newX)),
      y: Math.max(-maxPan.y, Math.min(maxPan.y, newY)),
    });
  }, [isDragging, dragStart, zoom, getMaxPan]);

  return (
    <ScrollSection className="map-section">
      {/* Header */}
      <div className="map-header stagger-item">
        <h2 className="section-heading">Our Expeditions</h2>
        <p className="section-subheading">Click a marker to explore</p>
      </div>

      {/* Map container */}
      <div
        ref={containerRef}
        className="map-container stagger-item"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Vignette overlay */}
        <div className="map-vignette" />

        {/* Map image and markers */}
        <div
          className="map-wrapper"
          style={{
            transform: `translate(calc(-50% + ${mapPosition.x}px), calc(-50% + ${mapPosition.y}px)) scale(${zoom})`,
          }}
        >
          <img
            src="/silkroad.png"
            alt="Ancient Silk Road Map"
            className="map-image"
            ref={mapImgRef}
            draggable={false}
            onLoad={() => {
              // If we haven't computed the home view yet, do it as soon as the image is ready.
              if (homeView) return;
              const next = computeHomeView();
              if (!next) return;
              setHomeView(next);
              setZoom(next.zoom);
              setMapPosition(next.position);
            }}
          />

          {/* Location markers */}
          {locations.map((location, index) => (
            <LocationMarker
              key={location.id}
              location={location}
              onClick={handleLocationClick}
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            />
          ))}
        </div>

        {/* Map controls */}
        <div className="map-controls">
          <button
            className="map-control-btn"
            onClick={handleZoomIn}
            aria-label="Zoom in"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
            </svg>
          </button>
          <button
            className="map-control-btn"
            onClick={handleZoomOut}
            aria-label="Zoom out"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35M8 11h6" />
            </svg>
          </button>
          <button
            className="map-control-btn"
            onClick={handleReset}
            aria-label="Reset view"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>

        {/* Compass rose */}
        <div className="map-compass">
          <svg viewBox="0 0 100 100">
            <path d="M50 5L55 45L50 50L45 45Z" fill="#C67B5C" />
            <path d="M50 95L55 55L50 50L45 55Z" fill="#B8A88C" />
            <path d="M5 50L45 45L50 50L45 55Z" fill="#B8A88C" />
            <path d="M95 50L55 45L50 50L55 55Z" fill="#B8A88C" />
            <circle cx="50" cy="50" r="5" fill="#2C2416" />
            <text x="50" y="3" textAnchor="middle" fontSize="8" fill="#2C2416" fontFamily="serif">N</text>
          </svg>
        </div>
      </div>

      {/* Instructions */}
      <p className="map-instructions stagger-item">
        Drag to pan • Scroll to zoom • Click markers to see photos
      </p>

      {/* Photo modal */}
      <PhotoModal
        location={selectedLocation}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </ScrollSection>
  );
}

