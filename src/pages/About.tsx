import { Link } from 'react-router-dom';
import logo from '@/assets/logo.jpeg';

const SimpleNav = () => (
  <header className="glass-surface sticky top-4 z-20 w-full max-w-[1320px] mx-auto px-5 py-4 rounded-3xl flex items-center justify-between">
    <Link to="/" className="flex items-center gap-3">
      <img src={logo} alt="ModeMuse Logo" className="w-10 h-10 rounded-xl object-cover" />
      <h1 className="text-lg font-bold font-display">ModeMuse</h1>
    </Link>
    <nav className="flex gap-4 font-bold text-sm">
      <Link to="/" className="hover:text-primary transition-colors">Home</Link>
      <Link to="/about" className="hover:text-primary transition-colors">About</Link>
      <Link to="/help" className="hover:text-primary transition-colors">Help</Link>
      <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
    </nav>
  </header>
);

const About = () => (
  <div className="w-full max-w-[1320px] mx-auto px-4">
    <SimpleNav />
    <section className="glass-surface !rounded-3xl p-8 mt-5">
      <p className="eyebrow">About us</p>
      <h2 className="font-display text-3xl sm:text-4xl mt-3">Redefining online fashion with virtual try-on.</h2>
      <p className="text-muted-foreground mt-4 max-w-2xl">
        ModeMuse is an AI-powered platform designed to transform the way people shop for clothes online. Using computer vision, users can preview outfits on themselves before purchasing.
      </p>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        Our mission is to reduce product returns and create a smarter, more interactive shopping experience.
      </p>
    </section>
  </div>
);

export default About;
