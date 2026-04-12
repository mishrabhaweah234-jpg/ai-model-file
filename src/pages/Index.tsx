import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import StatsRow from '@/components/StatsRow';
import TryOnStudio from '@/components/TryOnStudio';
import CatalogSection from '@/components/CatalogSection';
import NewArrivals from '@/components/NewArrivals';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import AuthModal from '@/components/AuthModal';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const Index = () => {
  const statsRef = useScrollReveal<HTMLDivElement>();
  const studioRef = useScrollReveal<HTMLDivElement>();
  const menRef = useScrollReveal<HTMLDivElement>();
  const womenRef = useScrollReveal<HTMLDivElement>();
  const arrivalsRef = useScrollReveal<HTMLDivElement>();
  const footerRef = useScrollReveal<HTMLDivElement>();

  return (
    <>
      <div className="page-glow top-24 -left-36" style={{ background: 'hsl(var(--sun) / 0.6)' }} />
      <div className="page-glow top-[28rem] -right-32" style={{ background: 'hsl(var(--teal) / 0.25)' }} />
      <div className="page-glow top-[60rem] left-1/2" style={{ background: 'hsl(var(--pink) / 0.2)' }} />

      <div className="w-full max-w-[1320px] mx-auto px-4">
        <Navbar />
        <HeroSection />
        <div ref={statsRef}><StatsRow /></div>
        <div ref={studioRef}><TryOnStudio /></div>
        <div ref={menRef}>
          <CatalogSection audience="Men" eyebrow="Men's Collection" title="Structured street & elevated basics" subtitle="Style cards with hover motion." />
        </div>
        <div ref={womenRef}>
          <CatalogSection audience="Women" eyebrow="Women's Collection" title="Fluid silhouettes with bold accents" subtitle="Softer editorial tone." />
        </div>
        <div ref={arrivalsRef}><NewArrivals /></div>
        <div ref={footerRef}><Footer /></div>
      </div>

      <CartSidebar />
      <AuthModal />
    </>
  );
};

export default Index;
