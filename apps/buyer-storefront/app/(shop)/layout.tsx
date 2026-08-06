'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Gift,
  Search,
  ShoppingCart,
  Menu,
  X,
  Home,
  Package,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  Heart,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

const navLinks = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Products', href: '/products', icon: Package },
  { label: 'Track Order', href: '/track', icon: MapPin },
];

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Press', href: '/press' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping Info', href: '/shipping' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Refund Policy', href: '/refunds' },
  ],
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ===== NAVBAR ===== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-nav shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#f5a623] to-[#ffd073] group-hover:shadow-lg group-hover:shadow-[#f5a623]/20 transition-all duration-300">
                <Gift size={20} className="text-[#1a1025]" />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">
                GiftFlow
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5f7a]"
                />
                <input
                  type="text"
                  placeholder="Search gifts, occasions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder-[#6b5f7a] focus:outline-none focus:border-[#f5a623]/50 focus:bg-white/10 transition-all duration-300"
                />
              </div>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    pathname === link.href
                      ? 'text-[#f5a623] bg-[#f5a623]/10'
                      : 'text-[#a89bb5] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 rounded-lg text-[#a89bb5] hover:text-white hover:bg-white/5 transition-all"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden sm:flex p-2 rounded-lg text-[#a89bb5] hover:text-[#ec4899] hover:bg-white/5 transition-all"
              >
                <Heart size={20} />
              </Link>

              {/* Cart */}
              <Link
                href="/checkout"
                className="relative p-2 rounded-lg text-[#a89bb5] hover:text-[#f5a623] hover:bg-white/5 transition-all"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-gradient-to-r from-[#f5a623] to-[#ffd073] text-[#1a1025] text-[10px] font-bold px-1 animate-scale-in">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-[#a89bb5] hover:text-white hover:bg-white/5 transition-all"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <div className="md:hidden pb-3 animate-slide-up">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5f7a]"
                />
                <input
                  type="text"
                  placeholder="Search gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-[#6b5f7a] focus:outline-none focus:border-[#f5a623]/50 transition-all"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 z-40">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative bg-[#1a1025] border-t border-white/10 animate-slide-up">
              <nav className="p-4 space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        pathname === link.href
                          ? 'text-[#f5a623] bg-[#f5a623]/10'
                          : 'text-[#a89bb5] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon size={18} />
                      {link.label}
                    </Link>
                  );
                })}
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#a89bb5] hover:text-white hover:bg-white/5 transition-all"
                >
                  <Heart size={18} />
                  Wishlist
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 pt-16 md:pt-18">{children}</main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#1a1025] border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#f5a623] to-[#ffd073]">
                  <Gift size={18} className="text-[#1a1025]" />
                </div>
                <span className="text-lg font-bold gradient-text">GiftFlow</span>
              </Link>
              <p className="text-[#6b5f7a] text-sm leading-relaxed mb-4">
                Premium gifting & delivery platform. Send joy, deliver happiness.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {[
                  { icon: Facebook, href: '#' },
                  { icon: Twitter, href: '#' },
                  { icon: Instagram, href: '#' },
                  { icon: Youtube, href: '#' },
                ].map((social, i) => {
                  const SocialIcon = social.icon;
                  return (
                    <a
                      key={i}
                      href={social.href}
                      className="p-2 rounded-lg bg-white/5 text-[#6b5f7a] hover:text-[#f5a623] hover:bg-white/10 transition-all duration-300"
                    >
                      <SocialIcon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                  {category}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[#6b5f7a] text-sm hover:text-[#f5a623] transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Column */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Connect
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:hello@giftflow.in"
                    className="flex items-center gap-2 text-[#6b5f7a] text-sm hover:text-[#f5a623] transition-colors"
                  >
                    <Mail size={14} />
                    hello@giftflow.in
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+911234567890"
                    className="flex items-center gap-2 text-[#6b5f7a] text-sm hover:text-[#f5a623] transition-colors"
                  >
                    <Phone size={14} />
                    +91 123 456 7890
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#6b5f7a] text-xs">
              © {new Date().getFullYear()} GiftFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-[#6b5f7a] text-xs">
              <span>Made with ❤️ in India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
