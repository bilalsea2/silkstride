'use client';

import ScrollSection from './ScrollSection';

export default function StorySection() {
  return (
    <div className="story-section-wrapper">
      <ScrollSection className="story-section">
        <h2 className="section-heading stagger-item">Our Journey</h2>
        <div className="story-divider stagger-item" />
        <p className="body-text stagger-item">
          Silk Stride was born from a shared passion for running and discovery. 
          Based in Tashkent, we are a community of runners who believe that every 
          step tells a story. We organize marathon trips to the most breathtaking 
          locations along the ancient Silk Road — from the turquoise domes of 
          Samarkand to the remote wilderness of Barsa Kelmes.
        </p>
        <p className="body-text stagger-item" style={{ marginTop: '1.5rem' }}>
          Each expedition is more than a race — it&apos;s a journey through history, 
          culture, and the stunning landscapes of Central Asia. We run not just to 
          finish, but to experience the land beneath our feet as countless travelers 
          did centuries before us.
        </p>
      </ScrollSection>
    </div>
  );
}

