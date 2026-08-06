'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import ProductCard from '@/components/shop/ProductCard';
import Button from '@/components/shop/Button';

// Mock product database
const allProducts: Record<string, {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription: string;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string;
  inStock: boolean;
  specifications: Record<string, string>;
}> = {
  '1': {
    id: '1',
    name: 'Premium Chocolate Box',
    price: 1299,
    originalPrice: 1699,
    description: 'Handcrafted Belgian chocolates in an elegant gift box',
    longDescription: 'Indulge in our exquisite collection of handcrafted Belgian chocolates. Each piece is carefully crafted by master chocolatiers using the finest cocoa beans sourced from sustainable farms. The elegant gift box features 24 assorted chocolates including dark, milk, and white varieties with unique fillings like hazelnut praline, salted caramel, raspberry ganache, and champagne truffle. Perfect for birthdays, anniversaries, or just to show someone you care.',
    images: [
      '/products/chocolate-box.png',
      '/products/chocolate-box.png',
      '/products/chocolate-box.png',
      '/products/chocolate-box.png',
    ],
    rating: 4.8,
    reviewCount: 234,
    category: 'Chocolates',
    inStock: true,
    specifications: {
      'Weight': '500g',
      'Pieces': '24 assorted',
      'Shelf Life': '6 months',
      'Allergens': 'Contains milk, nuts',
      'Origin': 'Belgium',
      'Packaging': 'Premium gift box',
    },
  },
  '2': {
    id: '2',
    name: 'Rose Gold Watch',
    price: 4999,
    originalPrice: 6999,
    description: 'Luxurious timepiece with genuine leather strap',
    longDescription: 'A stunning rose gold timepiece that combines classic elegance with modern design. Featuring a Japanese quartz movement, genuine Italian leather strap, and scratch-resistant sapphire crystal glass. The 38mm case is crafted from premium stainless steel with a rose gold PVD coating. Water-resistant up to 50 meters, making it perfect for everyday wear.',
    images: [
      '/products/watch.png',
      '/products/watch.png',
      '/products/watch.png',
      '/products/watch.png',
    ],
    rating: 4.6,
    reviewCount: 189,
    category: 'Accessories',
    inStock: true,
    specifications: {
      'Case Size': '38mm',
      'Movement': 'Japanese Quartz',
      'Material': 'Stainless Steel',
      'Strap': 'Italian Leather',
      'Water Resistance': '50m',
      'Warranty': '2 years',
    },
  },
};

// Default product for unknown IDs
const defaultProduct = {
  id: '0',
  name: 'Curated Gift Hamper',
  price: 2499,
  originalPrice: 3499,
  description: 'A beautifully curated gift hamper with premium items',
  longDescription: 'Our signature gift hamper is thoughtfully curated to bring joy to any occasion. Featuring a selection of premium artisanal products including gourmet treats, scented candles, and elegant accessories — all wrapped in sustainable luxury packaging. Each hamper is handpicked and assembled with care to create a memorable unboxing experience.',
  images: [
    '/products/tea.png',
    '/products/tea.png',
    '/products/tea.png',
    '/products/tea.png',
  ],
  rating: 4.7,
  reviewCount: 312,
  category: 'Hampers',
  inStock: true,
  specifications: {
    'Items': '8-10 premium items',
    'Packaging': 'Eco-friendly gift box',
    'Weight': '1.5kg approx',
    'Customizable': 'Yes',
    'Shelf Life': 'Varies by item',
    'Occasions': 'All occasions',
  },
};

const relatedProducts = [
  { id: '3', name: 'Aromatherapy Candle Set', price: 899, image: '/products/candles.png', rating: 4.9, description: 'Set of 6 premium scented soy candles' },
  { id: '4', name: 'Silk Flower Bouquet', price: 1999, image: '/products/bouquet.png', rating: 4.7, description: 'Everlasting silk roses in a luxury box' },
  { id: '5', name: 'Personalized Photo Frame', price: 799, image: '/products/frame.png', rating: 4.5, description: 'Custom engraved wooden photo frame' },
  { id: '6', name: 'Gourmet Tea Collection', price: 1499, image: '/products/tea.png', rating: 4.8, description: 'Curated selection of 12 exotic teas' },
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = allProducts[productId] || { ...defaultProduct, id: productId };

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      description: product.description,
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* ===== PRODUCT MAIN SECTION ===== */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden glass-card">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://placehold.co/600x600/2a1f35/f5a623?text=${encodeURIComponent(product.name)}`;
              }}
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
                -{discount}% OFF
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  selectedImage === i
                    ? 'border-[#f5a623] shadow-lg shadow-[#f5a623]/20'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://placehold.co/200x200/2a1f35/f5a623?text=${i + 1}`;
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Category */}
          <span className="text-[#f5a623] text-sm font-medium mb-2">
            {product.category}
          </span>

          {/* Name */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.floor(product.rating)
                      ? 'fill-[#f5a623] text-[#f5a623]'
                      : 'fill-transparent text-gray-500'
                  }
                />
              ))}
            </div>
            <span className="text-[#a89bb5] text-sm">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-[#f5a623]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-[#6b5f7a] line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {discount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold">
                Save ₹{((product.originalPrice || 0) - product.price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-[#a89bb5] text-sm leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Availability */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className={`text-sm font-medium ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-[#a89bb5]">Quantity:</span>
            <div className="flex items-center gap-0 border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-[#a89bb5] hover:text-white hover:bg-white/10 transition-all"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center text-white font-semibold text-sm">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 text-[#a89bb5] hover:text-white hover:bg-white/10 transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8">
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {addedToCart ? (
                <>
                  <Check size={18} />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  Add to Cart
                </>
              )}
            </Button>
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className={`p-3.5 rounded-xl border transition-all duration-300 ${
                wishlisted
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'border-white/10 text-[#a89bb5] hover:text-white hover:bg-white/5'
              }`}
            >
              <Heart size={20} className={wishlisted ? 'fill-current' : ''} />
            </button>
            <button className="p-3.5 rounded-xl border border-white/10 text-[#a89bb5] hover:text-white hover:bg-white/5 transition-all">
              <Share2 size={20} />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: 'Free Delivery', sub: 'Orders above ₹999' },
              { icon: Shield, label: 'Genuine Product', sub: '100% authentic' },
              { icon: RotateCcw, label: 'Easy Returns', sub: '30-day policy' },
            ].map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.label} className="glass-card p-3 text-center">
                  <Icon size={18} className="text-[#f5a623] mx-auto mb-1" />
                  <p className="text-white text-xs font-semibold">{badge.label}</p>
                  <p className="text-[#6b5f7a] text-[10px]">{badge.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== TABS SECTION ===== */}
      <div className="mb-16">
        <div className="flex border-b border-white/10 mb-6 overflow-x-auto">
          {[
            { key: 'description' as const, label: 'Description' },
            { key: 'specs' as const, label: 'Specifications' },
            { key: 'reviews' as const, label: `Reviews (${product.reviewCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-[1px] ${
                activeTab === tab.key
                  ? 'text-[#f5a623] border-[#f5a623]'
                  : 'text-[#6b5f7a] border-transparent hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="glass-card p-6 md:p-8 animate-fade-in">
          {activeTab === 'description' && (
            <div className="prose prose-invert max-w-none">
              <p className="text-[#a89bb5] leading-relaxed text-sm">
                {product.longDescription}
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/5"
                >
                  <span className="text-[#6b5f7a] text-sm">{key}</span>
                  <span className="text-white text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Review Summary */}
              <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#f5a623]">{product.rating}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < Math.floor(product.rating)
                            ? 'fill-[#f5a623] text-[#f5a623]'
                            : 'fill-transparent text-gray-500'
                        }
                      />
                    ))}
                  </div>
                  <p className="text-[#6b5f7a] text-xs mt-1">{product.reviewCount} reviews</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const percent = stars === 5 ? 65 : stars === 4 ? 22 : stars === 3 ? 8 : stars === 2 ? 3 : 2;
                    return (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-xs text-[#6b5f7a] w-3">{stars}</span>
                        <Star size={10} className="fill-[#f5a623] text-[#f5a623]" />
                        <div className="flex-1 h-1.5 rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-[#f5a623]"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#6b5f7a] w-8">{percent}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sample Reviews */}
              {[
                { name: 'Priya S.', rating: 5, date: '2 weeks ago', comment: 'Absolutely stunning quality! The packaging was beautiful and the chocolates were divine. Perfect gift for my husband\'s birthday.' },
                { name: 'Rahul M.', rating: 4, date: '1 month ago', comment: 'Great product, delivered on time. The gift box looks premium. Would have loved more variety in flavors though.' },
                { name: 'Anita K.', rating: 5, date: '1 month ago', comment: 'This is my go-to gift for every occasion now. The quality is consistently excellent and everyone loves receiving it!' },
              ].map((review, i) => (
                <div key={i} className="flex gap-4 py-4 border-b border-white/5 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#ec4899] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">{review.name[0]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm font-semibold">{review.name}</span>
                      <span className="text-[#6b5f7a] text-xs">• {review.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: 5 }, (_, j) => (
                        <Star
                          key={j}
                          size={12}
                          className={
                            j < review.rating
                              ? 'fill-[#f5a623] text-[#f5a623]'
                              : 'fill-transparent text-gray-500'
                          }
                        />
                      ))}
                    </div>
                    <p className="text-[#a89bb5] text-sm leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== RELATED PRODUCTS ===== */}
      <section>
        <h2 className="text-2xl font-bold mb-6">
          You May Also <span className="gradient-text">Like</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </section>
    </div>
  );
}
