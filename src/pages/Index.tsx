import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import StatsRow from '@/components/StatsRow';
import TryOnStudio from '@/components/TryOnStudio';
import CatalogSection from '@/components/CatalogSection';
import NewArrivals from '@/components/NewArrivals';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import AuthModal from '@/components/AuthModal';

const Index = () => {
  return (
    <>
      <div className="page-glow top-24 -left-36" style={{ background: 'rgba(255,199,95,0.84)' }} />
      <div className="page-glow top-[28rem] -right-32" style={{ background: 'rgba(20,108,127,0.34)' }} />

      <div className="w-full max-w-[1320px] mx-auto px-4">
        <Navbar />
        <HeroSection />
        <StatsRow />
        <TryOnStudio />
        <CatalogSection audience="Men" eyebrow="Men" title="Structured street and elevated basics" subtitle="Quick view style cards with hover motion." />
        <CatalogSection audience="Women" eyebrow="Women" title="Fluid silhouettes with bold accents" subtitle="Designed with a softer editorial tone." />
        <NewArrivals />
        <Footer />
      </div>

      <CartSidebar />
      <AuthModal />
    </>
  );
};

export default Index;
