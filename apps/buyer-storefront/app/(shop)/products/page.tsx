'use client';

import React, { useState, useEffect } from 'react';
import { Package, Search, Filter } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';

// Dummy data for products until API is ready
const dummyProducts = [
  {
    id: '1',
    name: 'Premium Chocolate Hamper',
    price: 2499,
    description: 'An exquisite collection of handcrafted dark and milk chocolates.',
    image: '/products/chocolate-box.png',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Luxury Spa Box',
    price: 3999,
    description: 'Relaxation in a box with organic bath salts, essential oils, and candles.',
    image: '/products/candles.png',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Artisan Coffee Collection',
    price: 1899,
    description: 'Single-origin coffee beans roasted to perfection.',
    image: '/products/tea.png',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Floral Delight Bouquet',
    price: 1499,
    description: 'Fresh seasonal flowers arranged beautifully.',
    image: '/products/bouquet.png',
    rating: 4.5,
  },
  {
    id: '5',
    name: 'Gourmet Snack Basket',
    price: 2199,
    description: 'A mix of sweet and savory gourmet snacks.',
    image: '/products/chocolate-box.png',
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Personalized Leather Wallet',
    price: 2999,
    description: 'Genuine leather wallet with custom engraving.',
    image: '/products/journal.png',
    rating: 4.8,
  }
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProducts = dummyProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#1a1025] pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Our Products</h1>
            <p className="text-[#a89bb5]">Explore our curated collection of premium gifts.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1 md:w-80">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5f7a]" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b5f7a] focus:outline-none focus:border-[#f5a623]/50 transition-all"
              />
            </div>
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#a89bb5] hover:text-white hover:bg-white/10 transition-all flex items-center gap-2">
              <Filter size={18} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Package size={48} className="mx-auto text-[#6b5f7a] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-[#a89bb5]">We couldn't find anything matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
