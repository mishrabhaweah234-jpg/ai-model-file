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
    <section className="mt-5">
      <div className="glass-surface !rounded-3xl grid md:grid-cols-2 gap-0 items-stretch overflow-hidden">
        <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
          <p className="eyebrow animate-fade-in">Single-page fashion experience</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.2rem] leading-[1.1] mt-4 tracking-tight">
            Shop bold looks
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-hero)' }}>
              and preview them
            </span>
            <br />
            in your virtual studio.
          </h2>
          <p className="text-muted-foreground mt-5 max-w-lg text-base leading-relaxed">
            A premium storefront inspired by modern fashion platforms, built around discovery, quick shopping, and a playful try-on flow.
          </p>
          <div className="flex gap-3 mt-8 flex-wrap">
            <a href="#studio" className="btn-primary text-sm inline-flex items-center gap-2 group">
              Explore Try-On Studio
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <button onClick={handleTryNow} className="btn-secondary text-sm">Try Now</button>
          </div>
        </div>
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-card/30 z-10 pointer-events-none" />
          <img 
            src={bannerImg} 
            alt="Fashion Banner" 
            className="w-full h-full object-cover min-h-[280px] md:min-h-full transition-transform duration-700 hover:scale-105" 
          />
        </div>
      </div>

      <div className="flex gap-3 mt-5 flex-wrap">
        {['✦ Interactive cards', '⚡ Smooth transitions', '🛒 Cart sidebar', '🎨 5 Themes'].map((label) => (
          <span key={label} className="badge-tag text-sm hover:scale-105 transition-transform cursor-default">{label}</span>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        <article 
          className={`min-h-[200px] rounded-3xl p-7 flex flex-col justify-end text-primary-foreground relative overflow-hidden transition-all duration-500 ${isTransitioning ? 'opacity-80 scale-[0.99]' : 'opacity-100 scale-100'}`} 
          style={{ background: 'var(--gradient-navy)' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
          <p className="eyebrow !text-mint">{primary.accent}</p>
          <strong className="font-display text-2xl mt-1">{primary.title}</strong>
          <p className="text-sm opacity-80 mt-2">{primary.detail}</p>
        </article>
        <article className="glass-surface min-h-[200px] !rounded-3xl p-7 flex flex-col justify-end relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-mint/20 blur-3xl group-hover:bg-mint/30 transition-colors duration-500" />
          <p className="eyebrow">{secondary.accent}</p>
          <strong className="font-display text-2xl mt-1">{secondary.title}</strong>
          <p className="text-sm text-muted-foreground mt-2">{secondary.detail}</p>
        </article>
      </div>
    </section>
  );
};

export default HeroSection;
