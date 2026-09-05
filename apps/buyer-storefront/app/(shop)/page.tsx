'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Gift,
  Heart,
  Cake,
  PartyPopper,
  Crown,
  Building2,
  Palette,
  Truck,
  Package,
  RotateCcw,
  Star,
  Sparkles,
  Clock,
  Zap,
} from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import Button from '@/components/shop/Button';

const categories = [
  { name: 'Birthday', icon: Cake, color: 'from-pink-400 to-rose-400', shadow: 'shadow-pink-500/30' },
  { name: 'Anniversary', icon: Heart, color: 'from-red-400 to-rose-500', shadow: 'shadow-red-500/30' },
  { name: 'Wedding', icon: Crown, color: 'from-amber-300 to-orange-400', shadow: 'shadow-amber-500/30' },
  { name: 'Festival', icon: PartyPopper, color: 'from-purple-400 to-fuchsia-500', shadow: 'shadow-purple-500/30' },
  { name: 'Corporate', icon: Building2, color: 'from-blue-400 to-cyan-500', shadow: 'shadow-blue-500/30' },
  { name: 'Custom', icon: Palette, color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/30' },
  // Duplicate for seamless infinite marquee effect
  { name: 'Birthday ', icon: Cake, color: 'from-pink-400 to-rose-400', shadow: 'shadow-pink-500/30' },
  { name: 'Anniversary ', icon: Heart, color: 'from-red-400 to-rose-500', shadow: 'shadow-red-500/30' },
  { name: 'Wedding ', icon: Crown, color: 'from-amber-300 to-orange-400', shadow: 'shadow-amber-500/30' },
  { name: 'Festival ', icon: PartyPopper, color: 'from-purple-400 to-fuchsia-500', shadow: 'shadow-purple-500/30' },
  { name: 'Corporate ', icon: Building2, color: 'from-blue-400 to-cyan-500', shadow: 'shadow-blue-500/30' },
  { name: 'Custom ', icon: Palette, color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/30' },
];

const trendingProducts = [
  { id: '1', name: 'Premium Chocolate Box', price: 1299, image: '/products/chocolate-box.png', rating: 4.8, description: 'Handcrafted Belgian chocolates in an elegant gift box' },
  { id: '2', name: 'Rose Gold Watch', price: 4999, image: '/products/watch.png', rating: 4.6, description: 'Luxurious timepiece with genuine leather strap' },
  { id: '3', name: 'Aromatherapy Candle Set', price: 899, image: '/products/candles.png', rating: 4.9, description: 'Set of 6 premium scented soy candles' },
  { id: '4', name: 'Silk Flower Bouquet', price: 1999, image: '/products/bouquet.png', rating: 4.7, description: 'Everlasting silk roses in a luxury box' },
  { id: '5', name: 'Personalized Photo Frame', price: 799, image: '/products/frame.png', rating: 4.5, description: 'Custom engraved wooden photo frame' },
  { id: '6', name: 'Gourmet Tea Collection', price: 1499, image: '/products/tea.png', rating: 4.8, description: 'Curated selection of 12 exotic teas' },
  { id: '7', name: 'Crystal Perfume Bottle', price: 3499, image: '/products/perfume.png', rating: 4.4, description: 'Luxury fragrance in a hand-blown crystal bottle' },
  { id: '8', name: 'Leather Journal Set', price: 699, image: '/products/journal.png', rating: 4.6, description: 'Premium leather journal with brass pen' },
];

const features = [
  {
    icon: Truck,
    title: 'Express Delivery',
    description: 'Delivered fast, felt forever',
    accent: 'from-blue-500 to-cyan-400',
  },
  {
    icon: Package,
    title: 'Premium Wrapping',
    description: 'Every gift is wrapped with love using premium materials',
    accent: 'from-[#f5a623] to-[#ffd073]',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '30-day hassle-free return policy with full refund',
    accent: 'from-emerald-500 to-green-400',
  },
];

function useCountdown() {
  const DEADLINE_KEY = 'omigo_promo_deadline';

  const getDeadline = () => {
    if (typeof window === 'undefined') return Date.now() + 12 * 24 * 60 * 60 * 1000;
    const stored = localStorage.getItem(DEADLINE_KEY);
    if (stored) return parseInt(stored, 10);
    const deadline = Date.now() + 12 * 24 * 60 * 60 * 1000;
    localStorage.setItem(DEADLINE_KEY, String(deadline));
    return deadline;
  };

  const calcTime = (deadline: number) => {
    const diff = Math.max(0, deadline - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hrs: Math.floor((diff / (1000 * 60 * 60)) % 24),
      min: Math.floor((diff / (1000 * 60)) % 60),
      sec: Math.floor((diff / 1000) % 60),
    };
  };

  const [time, setTime] = useState({ days: 12, hrs: 0, min: 0, sec: 0 });

  useEffect(() => {
    const deadline = getDeadline();
    setTime(calcTime(deadline));
    const id = setInterval(() => setTime(calcTime(deadline)), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return time;
}

export default function HomePage() {
  const countdown = useCountdown();

  const timerBlocks = [
    { value: countdown.days, label: 'Days' },
    { value: countdown.hrs,  label: 'Hrs'  },
    { value: countdown.min,  label: 'Min'  },
    { value: countdown.sec,  label: 'Sec'  },
  ];

  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section 
        className="relative min-h-[85vh] flex items-center overflow-hidden"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5a623]/10 border border-[#f5a623]/20 text-[#f5a623] text-sm font-medium mb-6 animate-fade-in">
              <Sparkles size={14} />
              <span>Premium Gifting Experience</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
              OMIGO: Stories,
              <br />
              <span className="gradient-text">wrapped in gifts.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#a89bb5] mb-8 max-w-xl leading-relaxed animate-slide-up delay-200">
              Discover curated gifts for every occasion. From personalized treasures 
              to premium hampers — make every moment unforgettable.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-slide-up delay-300">
              <Link href="/products">
                <Button variant="primary" size="lg">
                  <span>Explore Gifts</span>
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 mt-10 animate-fade-in delay-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-[#1a1025] bg-gradient-to-br from-[#7c3aed] to-[#ec4899]"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-[#f5a623] text-[#f5a623]" />
                  ))}
                </div>
                <p className="text-[#6b5f7a] text-xs mt-0.5">
                  Loved by 50,000+ happy customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Shop by <span className="gradient-text">Occasion</span>
          </h2>
          <p className="text-[#a89bb5] text-base max-w-md mx-auto">
            Every occasion deserves a story worth wrapping.
          </p>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 0.75rem)); }
          }
          .animate-marquee {
            animation: marquee 25s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
        
        <div className="relative flex overflow-hidden group py-4 -mx-4 px-4 sm:mx-0 sm:px-0 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-6 animate-marquee whitespace-nowrap min-w-max">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={`${cat.name}-${index}`}
                  href={`/products?category=${cat.name.trim().toLowerCase()}`}
                  className="group/card flex-shrink-0"
                >
                  <div className={`relative w-48 h-56 rounded-3xl bg-gradient-to-br ${cat.color} p-6 flex flex-col items-center justify-center text-white overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg ${cat.shadow} hover:shadow-2xl`}>
                    {/* SVG Background Pattern or Big faded icon */}
                    <Icon size={120} className="absolute -bottom-6 -right-6 text-white opacity-20 group-hover/card:scale-110 transition-transform duration-500" />
                    
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl mb-4 group-hover/card:bg-white/30 transition-colors">
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-white text-lg font-bold tracking-wide">
                      {cat.name.trim()}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TRENDING PRODUCTS ===== */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Trending <span className="gradient-text">Gifts</span>
            </h2>
            <p className="text-[#a89bb5] text-base">
              Most loved gifts this season
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-1.5 text-[#f5a623] text-sm font-medium hover:gap-3 transition-all duration-300"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products">
            <Button variant="outline" size="md">
              View All Products <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7c3aed] via-[#9333ea] to-[#c026d3] p-8 md:p-12">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold mb-3">
                <Zap size={12} />
                LIMITED TIME OFFER
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Get 20% Off Your First OMIGO
              </h3>
              <p className="text-white/70 text-sm md:text-base">
                Use code <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded">GIFT20</span> at checkout
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {timerBlocks.map(({ value, label }) => (
                  <div key={label} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-white text-xl font-bold backdrop-blur-sm tabular-nums transition-all duration-300">
                      {String(value).padStart(2, '0')}
                    </div>
                    <span className="text-white/50 text-[10px] mt-1">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Why Choose <span className="gradient-text">OMIGO</span>
          </h2>
          <p className="text-[#a89bb5] text-base max-w-md mx-auto">
            We go the extra mile to make every gift feel personal
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-card p-8 text-center hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div
                  className={`w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${feature.accent} flex items-center justify-center opacity-90`}
                >
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#a89bb5] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-card p-8 md:p-12 text-center">
          <div className="flex items-center justify-center gap-1 mb-4">
            <Clock size={16} className="text-[#f5a623]" />
            <span className="text-[#f5a623] text-sm font-medium">Stay Updated</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            Never Miss a <span className="gradient-text">Perfect Gift</span>
          </h3>
          <p className="text-[#a89bb5] text-sm mb-6 max-w-md mx-auto">
            Subscribe to get exclusive offers, new arrivals, and gifting inspiration
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-5 py-3 rounded-xl glass-input text-sm"
            />
            <Button variant="primary" size="md" className="w-full sm:w-auto whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
