'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  description?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id = '0',
  name = 'Product',
  price = 0,
  image = '',
  rating = 0,
  description,
}) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      name,
      price,
      image,
      description,
    });
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={
          i < Math.floor(rating)
            ? 'fill-[#f5a623] text-[#f5a623]'
            : 'fill-transparent text-gray-500'
        }
      />
    ));
  };

  return (
    <Link href={`/products/${id}`} className="block group">
      <div className="glass-card overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 hover:border-white/20">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-square bg-white/5">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://placehold.co/400x400/2a1f35/f5a623?text=${encodeURIComponent(name)}`;
            }}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1025]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick add button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 p-3 rounded-full gradient-gold text-[#1a1025] 
                       opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 
                       transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
            aria-label={`Add ${name} to cart`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {renderStars()}
            <span className="text-xs text-[#a89bb5] ml-1">
              ({rating.toFixed(1)})
            </span>
          </div>

          {/* Name */}
          <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-1 group-hover:text-[#f5a623] transition-colors duration-300">
            {name}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-[#a89bb5] text-xs mb-3 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Price and action */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[#f5a623] font-bold text-lg">
              ₹{price.toLocaleString('en-IN')}
            </span>
            <button
              onClick={handleAddToCart}
              className="text-xs px-3 py-1.5 rounded-full border border-[#f5a623]/30 text-[#f5a623] 
                         hover:bg-[#f5a623] hover:text-[#1a1025] transition-all duration-300
                         md:hidden"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
