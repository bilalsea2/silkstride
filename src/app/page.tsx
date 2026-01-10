import Hero from '@/components/Hero';
import StorySection from '@/components/StorySection';
import SilkRoadMap from '@/components/SilkRoadMap';
import MembersSection from '@/components/MembersSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      {/* Hero - First impression */}
      <Hero />

      {/* Story - About the club */}
      <StorySection />

      {/* Interactive Map - Main feature */}
      <SilkRoadMap />

      {/* Members - The runners */}
      <MembersSection />

      {/* Footer */}
      <Footer />
    </>
  );
}
