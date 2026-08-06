'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Gift,
  Trash2,
  Minus,
  Plus,
  Tag,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Lock,
  PartyPopper,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/shop/Button';

interface FormData {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  giftWrap: boolean;
  giftMessage: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotal } = useCartStore();
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [orderId, setOrderId] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    giftWrap: false,
    giftMessage: '',
  });

  const subtotal = getTotal();
  const deliveryFee = subtotal > 999 ? 0 : 99;
  const discount = couponApplied ? Math.round(subtotal * 0.2) : 0;
  const tax = Math.round((subtotal - discount) * 0.18);
  const giftWrapFee = formData.giftWrap ? 49 : 0;
  const total = subtotal - discount + deliveryFee + tax + giftWrapFee;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === 'GIFT20') {
      setCouponApplied(true);
    }
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.pincode) {
      alert('Please fill in all required fields.');
      return;
    }

    setPaymentLoading(true);

    try {
      // In production, this would call the backend to create an order
      // const response = await api.post('/orders/create', { amount: total, items, address: formData });
      // const { order } = response.data;

      const mockOrderId = `order_GF${Date.now()}`;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_xxxxx',
        amount: total * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'GiftFlow',
        description: `Order of ${items.length} item(s)`,
        order_id: mockOrderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#f5a623',
          backdrop_color: '#1a1025',
        },
        handler: function (response: Record<string, string>) {
          // In production, verify payment on backend
          // api.post('/orders/verify', { ...response })
          console.log('Payment successful:', response);
          const generatedId = `GF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          setOrderId(generatedId);
          clearCart();
          setStep('success');
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          },
        },
      };

      if (typeof window !== 'undefined' && window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        // Fallback: simulate success for development
        const generatedId = `GF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setOrderId(generatedId);
        clearCart();
        setStep('success');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // ===== SUCCESS STATE =====
  if (step === 'success') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-card p-8 md:p-12 text-center max-w-lg w-full animate-scale-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center animate-pulse-glow">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <PartyPopper size={20} className="text-[#f5a623]" />
            <span className="text-[#f5a623] text-sm font-medium">Order Confirmed!</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Thank You for Your Order!
          </h2>
          <p className="text-[#a89bb5] text-sm mb-6 leading-relaxed">
            Your order has been placed successfully. We&apos;ll send you a confirmation email shortly
            with tracking details.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 mb-8">
            <span className="text-[#6b5f7a] text-sm">Order ID:</span>
            <span className="text-[#f5a623] font-bold">#{orderId}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" size="md" className="flex-1" onClick={() => window.location.href = '/'}>
              Continue Shopping
            </Button>
            <Button variant="outline" size="md" className="flex-1" onClick={() => window.location.href = '/track'}>
              Track Order
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ===== EMPTY CART =====
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag size={64} className="text-[#6b5f7a]/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-[#6b5f7a] text-sm mb-6">
            Looks like you haven&apos;t added any gifts yet.
          </p>
          <Button variant="primary" size="md" onClick={() => window.location.href = '/'}>
            <Gift size={16} />
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        <span className="gradient-text">Checkout</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ===== LEFT: DELIVERY FORM ===== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard size={18} className="text-[#f5a623]" />
              <h3 className="text-lg font-semibold text-white">Contact Information</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[#a89bb5] text-xs font-medium mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 glass-input text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[#a89bb5] text-xs font-medium mb-1.5">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 glass-input text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[#a89bb5] text-xs font-medium mb-1.5">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 glass-input text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <MapPin size={18} className="text-[#f5a623]" />
              <h3 className="text-lg font-semibold text-white">Delivery Address</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[#a89bb5] text-xs font-medium mb-1.5">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="House/Flat No., Building, Street"
                  className="w-full px-4 py-3 glass-input text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[#a89bb5] text-xs font-medium mb-1.5">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full px-4 py-3 glass-input text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[#a89bb5] text-xs font-medium mb-1.5">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="w-full px-4 py-3 glass-input text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[#a89bb5] text-xs font-medium mb-1.5">PIN Code *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="6-digit PIN"
                  className="w-full px-4 py-3 glass-input text-sm"
                  maxLength={6}
                  required
                />
              </div>
            </div>
          </div>

          {/* Gift Options */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Gift size={18} className="text-[#f5a623]" />
              <h3 className="text-lg font-semibold text-white">Gift Options</h3>
            </div>
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                name="giftWrap"
                checked={formData.giftWrap}
                onChange={handleInputChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#f5a623] focus:ring-[#f5a623] focus:ring-offset-0"
              />
              <div>
                <span className="text-white text-sm font-medium">Premium Gift Wrapping</span>
                <span className="text-[#6b5f7a] text-xs ml-2">(+₹49)</span>
              </div>
            </label>
            {formData.giftWrap && (
              <div className="animate-slide-up">
                <label className="block text-[#a89bb5] text-xs font-medium mb-1.5">Gift Message</label>
                <textarea
                  name="giftMessage"
                  value={formData.giftMessage}
                  onChange={handleInputChange}
                  placeholder="Write a personal message for the recipient..."
                  rows={3}
                  className="w-full px-4 py-3 glass-input text-sm resize-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* ===== RIGHT: ORDER SUMMARY ===== */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-5">Order Summary</h3>

            {/* Cart Items */}
            <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://placehold.co/100x100/2a1f35/f5a623?text=${encodeURIComponent(item.name.substring(0, 6))}`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">{item.name}</h4>
                    <p className="text-[#f5a623] text-sm font-semibold">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-0.5 rounded text-[#6b5f7a] hover:text-white transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-white text-xs w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-0.5 rounded text-[#6b5f7a] hover:text-white transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto p-1 rounded text-[#6b5f7a] hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="mb-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5f7a]" />
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    className="w-full pl-9 pr-3 py-2.5 glass-input text-xs"
                    disabled={couponApplied}
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponApplied || !coupon}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#f5a623]/30 text-[#f5a623] hover:bg-[#f5a623] hover:text-[#1a1025] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {couponApplied ? 'Applied ✓' : 'Apply'}
                </button>
              </div>
              {couponApplied && (
                <p className="text-green-400 text-xs mt-1.5 animate-fade-in">
                  🎉 GIFT20 applied — 20% discount!
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 py-4 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-[#a89bb5]">Subtotal</span>
                <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">Discount (20%)</span>
                  <span className="text-green-400">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[#a89bb5]">Delivery</span>
                <span className={deliveryFee === 0 ? 'text-green-400' : 'text-white'}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              {giftWrapFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#a89bb5]">Gift Wrap</span>
                  <span className="text-white">₹{giftWrapFee}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[#a89bb5]">Tax (GST 18%)</span>
                <span className="text-white">₹{tax.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-4 border-t border-white/10 mb-6">
              <span className="text-white font-semibold">Total</span>
              <span className="text-2xl font-bold text-[#f5a623]">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Pay Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handlePayment}
              loading={paymentLoading}
            >
              <Lock size={16} />
              Pay ₹{total.toLocaleString('en-IN')}
              <ArrowRight size={16} />
            </Button>

            {/* Trust */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-1 text-[#6b5f7a] text-xs">
                <ShieldCheck size={14} />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-1 text-[#6b5f7a] text-xs">
                <Truck size={14} />
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
