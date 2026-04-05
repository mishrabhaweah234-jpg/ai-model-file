import { useStore } from '@/store/useStore';
import { heroSlides } from '@/data/products';
import { useEffect, useState } from 'react';
import bannerImg from '@/assets/fashion-banner.jpg';

const HeroSection = () => {
  const { surpriseMe } = useStore();
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setHeroIndex((i) => (i + 1) % heroSlides.length), 3200);
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
      <div className="glass-surface !rounded-3xl grid md:grid-cols-2 gap-5 items-center overflow-hidden">
        <div className="p-6 md:p-10">
          <p className="eyebrow">Single-page fashion experience</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mt-3">
            Shop bold looks and preview them in your virtual studio.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg">
            A premium storefront inspired by modern fashion platforms, built around discovery, quick shopping, and a playful try-on flow.
          </p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <a href="#studio" className="btn-primary text-sm">Explore Try-On Studio</a>
            <button onClick={handleTryNow} className="btn-secondary text-sm">Try Now</button>
          </div>
        </div>
        <div className="p-4 md:p-6">
          <img src={bannerImg} alt="Fashion Banner" className="w-full rounded-2xl object-cover max-h-[400px]" />
        </div>
      </div>

      <div className="flex gap-3 mt-4 flex-wrap">
        {['Interactive cards', 'Smooth transitions', 'Cart sidebar'].map((label) => (
          <span key={label} className="badge-tag text-sm">{label}</span>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <article className="min-h-[180px] rounded-3xl p-6 flex flex-col justify-end text-primary-foreground" style={{ background: 'var(--gradient-navy)' }}>
          <p className="eyebrow !text-mint">{primary.accent}</p>
          <strong className="font-display text-2xl">{primary.title}</strong>
          <p className="text-sm opacity-80 mt-1">{primary.detail}</p>
        </article>
        <article className="glass-surface min-h-[180px] !rounded-3xl p-6 flex flex-col justify-end" style={{ background: 'linear-gradient(140deg, rgba(255,255,255,0.7), rgba(132,220,198,0.34))' }}>
          <p className="eyebrow">{secondary.accent}</p>
          <strong className="font-display text-2xl">{secondary.title}</strong>
          <p className="text-sm text-muted-foreground mt-1">{secondary.detail}</p>
        </article>
      </div>
    </section>
  );
};

export default HeroSection;
