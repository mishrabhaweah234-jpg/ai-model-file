import { useStore } from '@/store/useStore';
import { heroSlides } from '@/data/products';
import { useEffect, useMemo, useRef, useState } from 'react';
import bannerImg from '@/assets/fashion-banner.jpg';
import bannerImg2 from '@/assets/fashion-banner-2.jpg';
import bannerImg3 from '@/assets/fashion-banner-3.jpg';
import bannerImg4 from '@/assets/fashion-banner-4.jpg';
import bannerImg5 from '@/assets/fashion-banner-5.jpg';
import bannerImg6 from '@/assets/fashion-banner-6.jpg';
import bannerImg7 from '@/assets/fashion-banner-7.jpg';
import bannerImg8 from '@/assets/fashion-banner-8.jpg';

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const rawBannerImages = [bannerImg, bannerImg2, bannerImg3, bannerImg4, bannerImg5, bannerImg6, bannerImg7, bannerImg8];

const HeroSection = () => {
  const { surpriseMe } = useStore();
  const [heroIndex, setHeroIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((i) => (i + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const bannerImages = useMemo(() => shuffle(rawBannerImages), []);

  const primary = heroSlides[heroIndex];
  const secondary = heroSlides[(heroIndex + 1) % heroSlides.length];

  const goTo = (i: number) => setBannerIndex((i + bannerImages.length) % bannerImages.length);

  const handleTryNow = () => {
    surpriseMe();
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    }
  };
  const onTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 50) {
      goTo(bannerIndex + (touchDeltaX.current < 0 ? 1 : -1));
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
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
        <div
          className="relative overflow-hidden min-h-[320px] md:min-h-full group/carousel select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-card/40 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-card/30 to-transparent z-10 pointer-events-none" />
          <div
            className="flex h-full w-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${bannerIndex * 100}%)` }}
          >
            {bannerImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Fashion Banner ${i + 1}`}
                draggable={false}
                className="w-full h-full object-cover flex-shrink-0"
                style={{ width: '100%' }}
                loading={i === 0 ? undefined : 'lazy'}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(bannerIndex - 1)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-card/70 backdrop-blur border border-border/60 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-card"
          >
            ‹
          </button>
          <button
            onClick={() => goTo(bannerIndex + 1)}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-card/70 backdrop-blur border border-border/60 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-card"
          >
            ›
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {bannerImages.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === bannerIndex ? 'w-6 bg-foreground' : 'w-1.5 bg-foreground/40 hover:bg-foreground/70'}`}
              />
            ))}
          </div>
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
