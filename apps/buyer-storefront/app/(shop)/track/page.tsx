'use client';

import React, { useState } from 'react';
import { Package, Search, MapPin, Truck, CheckCircle, Clock } from 'lucide-react';
import Button from '@/components/shop/Button';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState<'idle' | 'tracking' | 'found' | 'error'>('idle');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setStatus('tracking');
    setTracking(true);
    
    // Simulate API call
    setTimeout(() => {
      if (orderId.length > 5) {
        setStatus('found');
      } else {
        setStatus('error');
      }
      setTracking(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#1a1025] pt-12 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#f5a623] to-[#ffd073] mb-6">
            <Package size={32} className="text-[#1a1025]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Track Your Order</h1>
          <p className="text-[#a89bb5] text-lg">
            Enter your order ID below to get real-time updates on your delivery.
          </p>
        </div>

        <div className="glass-card p-6 md:p-8 rounded-2xl mb-12">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b5f7a]" />
              <input 
                type="text" 
                placeholder="Enter Order ID (e.g., ORD-12345)" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b5f7a] focus:outline-none focus:border-[#f5a623]/50 transition-all text-lg"
                required
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              isLoading={tracking}
              className="md:w-auto w-full"
            >
              Track Now
            </Button>
          </form>
        </div>

        {status === 'error' && (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center animate-fade-in">
            <p className="text-red-400">Order not found. Please check your Order ID and try again.</p>
          </div>
        )}

        {status === 'found' && (
          <div className="glass-card rounded-2xl p-6 md:p-8 animate-slide-up">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
              <div>
                <p className="text-[#a89bb5] text-sm mb-1">Order Number</p>
                <p className="text-xl font-bold text-white">{orderId.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-[#a89bb5] text-sm mb-1">Estimated Delivery</p>
                <p className="text-xl font-bold text-[#f5a623]">Today, 4:30 PM</p>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="relative pl-6 md:pl-8 space-y-10">
              {/* Vertical Line */}
              <div className="absolute left-[15px] md:left-[23px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#f5a623] via-white/20 to-white/10"></div>

              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[35px] md:-left-[43px] w-10 h-10 rounded-full bg-[#f5a623] flex items-center justify-center border-4 border-[#1a1025] shadow-lg shadow-[#f5a623]/20">
                  <CheckCircle size={18} className="text-[#1a1025]" />
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold mb-1">Order Confirmed</h4>
                  <p className="text-[#a89bb5] text-sm">We have received your order.</p>
                  <p className="text-[#6b5f7a] text-xs mt-1">10:00 AM</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-[35px] md:-left-[43px] w-10 h-10 rounded-full bg-[#f5a623] flex items-center justify-center border-4 border-[#1a1025] shadow-lg shadow-[#f5a623]/20">
                  <Package size={18} className="text-[#1a1025]" />
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold mb-1">Order Prepared</h4>
                  <p className="text-[#a89bb5] text-sm">Your items have been packed and are ready.</p>
                  <p className="text-[#6b5f7a] text-xs mt-1">11:30 AM</p>
                </div>
              </div>

              {/* Step 3 (Current) */}
              <div className="relative">
                <div className="absolute -left-[35px] md:-left-[43px] w-10 h-10 rounded-full bg-[#f5a623] flex items-center justify-center border-4 border-[#1a1025] shadow-lg shadow-[#f5a623]/40 animate-pulse">
                  <Truck size={18} className="text-[#1a1025]" />
                </div>
                <div className="ml-4">
                  <h4 className="text-[#f5a623] font-semibold mb-1">Out for Delivery</h4>
                  <p className="text-white text-sm">Your order is on its way!</p>
                  <p className="text-[#a89bb5] text-xs mt-1">2:15 PM</p>
                </div>
              </div>

              {/* Step 4 (Pending) */}
              <div className="relative opacity-50">
                <div className="absolute -left-[35px] md:-left-[43px] w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border-4 border-[#1a1025]">
                  <MapPin size={18} className="text-[#a89bb5]" />
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold mb-1">Delivered</h4>
                  <p className="text-[#a89bb5] text-sm">Waiting for delivery confirmation.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
