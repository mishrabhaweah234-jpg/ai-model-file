import { useStore } from '@/store/useStore';
import { heroSlides } from '@/data/products';
import { useEffect, useState } from 'react';
import bannerImg from '@/assets/fashion-banner.jpg';

const HeroSection = () => {
  const { surpriseMe } = useStore();
  const [heroIndex, setHeroIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setHeroIndex((i) => (i + 1) % heroSlides.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const primary = heroSlides[heroIndex];
  const secondary = heroSlides[(heroIndex + 1) % heroSlides.length];

  const handleTryNow = () => {
    surpriseMe();
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="mt-6">
      <div className="glass-surface !rounded-[2rem] grid md:grid-cols-2 gap-0 items-stretch overflow-hidden">
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <p className="eyebrow !text-primary !text-[10px]">Single-page fashion experience</p>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.05] tracking-tight">
            Shop bold looks
            <br />
            <span className="italic text-gradient-hero">and preview them</span>
            <br />
            in your virtual studio.
          </h2>
          <p className="text-muted-foreground mt-6 max-w-lg text-[15px] leading-relaxed">
            A premium storefront inspired by modern fashion platforms — built around discovery, quick shopping, and a playful try-on flow.
          </p>
          <div className="flex gap-3 mt-9 flex-wrap">
            <a href="#studio" className="btn-primary text-sm inline-flex items-center gap-2 group">
              Explore Try-On Studio
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <button onClick={handleTryNow} className="btn-secondary text-sm">Surprise me ✨</button>
          </div>
        </div>
        <div className="relative overflow-hidden min-h-[320px] md:min-h-full">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-card/40 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-card/30 to-transparent z-10 pointer-events-none" />
          <img 
            src={bannerImg} 
            alt="Fashion Banner" 
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.04]" 
          />
        </div>
      </div>

      <div className="flex gap-2.5 mt-6 flex-wrap">
        {['✦ Interactive cards', '⚡ Smooth transitions', '🛒 Cart sidebar', '🎨 5 Themes'].map((label) => (
          <span key={label} className="badge-tag text-xs hover:scale-105 hover:-translate-y-0.5 transition-all cursor-default">{label}</span>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        <article 
          className={`min-h-[220px] rounded-[1.75rem] p-8 flex flex-col justify-end text-primary-foreground relative overflow-hidden transition-all duration-500 ${isTransitioning ? 'opacity-80 scale-[0.99]' : 'opacity-100 scale-100'}`} 
          style={{ background: 'var(--gradient-navy)' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
          <p className="eyebrow !text-mint">{primary.accent}</p>
          <strong className="font-display text-2xl mt-1">{primary.title}</strong>
          <p className="text-sm opacity-80 mt-2">{primary.detail}</p>
        </article>
        <article className="glass-surface min-h-[220px] !rounded-[1.75rem] p-8 flex flex-col justify-end relative overflow-hidden group card-hover">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-mint/20 blur-3xl group-hover:bg-mint/30 transition-colors duration-500" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-peach/10 blur-3xl" />
          <p className="eyebrow relative">{secondary.accent}</p>
          <strong className="font-display text-2xl mt-1 relative">{secondary.title}</strong>
          <p className="text-sm text-muted-foreground mt-2 relative">{secondary.detail}</p>
        </article>
      </div>
    </section>
  );
};

export default HeroSection;
