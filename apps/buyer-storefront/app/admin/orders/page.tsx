'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Clock,
  ChevronRight,
  User,
  ShoppingBag,
  MapPin,
  Calendar,
} from 'lucide-react';
import Button from '@/components/shop/Button';

interface Order {
  id: string;
  customer: string;
  items: string;
  itemCount: number;
  total: number;
  time: string;
  address: string;
  status: string;
}

type ColumnKey = 'pending' | 'confirmed' | 'preparing' | 'outForDelivery' | 'delivered';

interface ColumnConfig {
  key: ColumnKey;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  nextStatus: ColumnKey | null;
  nextLabel: string;
}

const columns: ColumnConfig[] = [
  { key: 'pending', label: 'Pending', color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30', nextStatus: 'confirmed', nextLabel: 'Confirm' },
  { key: 'confirmed', label: 'Confirmed', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', nextStatus: 'preparing', nextLabel: 'Start Preparing' },
  { key: 'preparing', label: 'Preparing', color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30', nextStatus: 'outForDelivery', nextLabel: 'Out for Delivery' },
  { key: 'outForDelivery', label: 'Out for Delivery', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30', nextStatus: 'delivered', nextLabel: 'Mark Delivered' },
  { key: 'delivered', label: 'Delivered', color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30', nextStatus: null, nextLabel: '' },
];

const initialOrders: Record<ColumnKey, Order[]> = {
  pending: [
    { id: '#GF-7830', customer: 'Meera Reddy', items: 'Birthday Cake, Candles', itemCount: 2, total: 1599, time: '2 mins ago', address: 'Koramangala, Bangalore', status: 'pending' },
    { id: '#GF-7829', customer: 'Kiran Shah', items: 'Premium Chocolate Box', itemCount: 1, total: 1299, time: '8 mins ago', address: 'Bandra, Mumbai', status: 'pending' },
    { id: '#GF-7828', customer: 'Nisha Gupta', items: 'Flower Bouquet, Card', itemCount: 3, total: 2499, time: '15 mins ago', address: 'Connaught Place, Delhi', status: 'pending' },
  ],
  confirmed: [
    { id: '#GF-7825', customer: 'Rohan Verma', items: 'Gift Hamper Deluxe', itemCount: 1, total: 3999, time: '20 mins ago', address: 'Jubilee Hills, Hyderabad', status: 'confirmed' },
    { id: '#GF-7824', customer: 'Sunita Patel', items: 'Perfume, Scarf Set', itemCount: 2, total: 4599, time: '35 mins ago', address: 'Andheri, Mumbai', status: 'confirmed' },
    { id: '#GF-7823', customer: 'Arun Kumar', items: 'Watch, Wallet Combo', itemCount: 2, total: 6499, time: '42 mins ago', address: 'T. Nagar, Chennai', status: 'confirmed' },
  ],
  preparing: [
    { id: '#GF-7820', customer: 'Priya Nair', items: 'Custom Photo Album', itemCount: 1, total: 2199, time: '1 hr ago', address: 'Indiranagar, Bangalore', status: 'preparing' },
    { id: '#GF-7819', customer: 'Deepak Joshi', items: 'Tea Collection, Cookies', itemCount: 3, total: 1899, time: '1.5 hrs ago', address: 'Salt Lake, Kolkata', status: 'preparing' },
  ],
  outForDelivery: [
    { id: '#GF-7815', customer: 'Aditi Sharma', items: 'Rose Gold Bracelet', itemCount: 1, total: 3299, time: '2 hrs ago', address: 'Sector 62, Noida', status: 'outForDelivery' },
    { id: '#GF-7814', customer: 'Rajesh Kapoor', items: 'Anniversary Special Set', itemCount: 4, total: 5999, time: '2.5 hrs ago', address: 'MG Road, Pune', status: 'outForDelivery' },
    { id: '#GF-7813', customer: 'Lakshmi Iyer', items: 'Gourmet Hamper', itemCount: 1, total: 2799, time: '3 hrs ago', address: 'Adyar, Chennai', status: 'outForDelivery' },
  ],
  delivered: [
    { id: '#GF-7810', customer: 'Vikram Malhotra', items: 'Crystal Vase, Flowers', itemCount: 2, total: 2499, time: '4 hrs ago', address: 'Defence Colony, Delhi', status: 'delivered' },
    { id: '#GF-7809', customer: 'Ananya Das', items: 'Leather Journal Set', itemCount: 1, total: 699, time: '5 hrs ago', address: 'Park Street, Kolkata', status: 'delivered' },
    { id: '#GF-7808', customer: 'Suresh Menon', items: 'Premium Wine Set', itemCount: 1, total: 4999, time: '6 hrs ago', address: 'Kochi', status: 'delivered' },
  ],
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [animatingCard, setAnimatingCard] = useState<string | null>(null);

  const moveOrder = (order: Order, fromCol: ColumnKey, toCol: ColumnKey) => {
    setAnimatingCard(order.id);

    setTimeout(() => {
      setOrders((prev) => ({
        ...prev,
        [fromCol]: prev[fromCol].filter((o) => o.id !== order.id),
        [toCol]: [{ ...order, status: toCol }, ...prev[toCol]],
      }));
      setAnimatingCard(null);
    }, 300);
  };

  const getFilteredOrders = (columnOrders: Order[]) => {
    if (!searchQuery.trim()) return columnOrders;
    const query = searchQuery.toLowerCase();
    return columnOrders.filter(
      (o) =>
        o.id.toLowerCase().includes(query) ||
        o.customer.toLowerCase().includes(query) ||
        o.items.toLowerCase().includes(query)
    );
  };

  const totalOrders = Object.values(orders).reduce((sum, col) => sum + col.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Orders</h1>
          <p className="text-[#6b5f7a] text-sm mt-1">
            {totalOrders} total orders · Manage and track all deliveries
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setOrders(initialOrders)}>
            <RefreshCw size={14} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5f7a]"
          />
          <input
            type="text"
            placeholder="Search orders by ID, customer, or items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#a89bb5] text-sm hover:bg-white/10 transition-all">
            <Calendar size={14} />
            Today
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#a89bb5] text-sm hover:bg-white/10 transition-all">
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
        {columns.map((col) => {
          const colOrders = getFilteredOrders(orders[col.key]);
          return (
            <div
              key={col.key}
              className="flex-shrink-0 w-[300px] md:flex-1 md:min-w-[250px]"
            >
              {/* Column Header */}
              <div className={`flex items-center justify-between mb-3 p-3 rounded-xl ${col.bgColor} border ${col.borderColor}`}>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-sm ${col.color}`}>
                    {col.label}
                  </span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.bgColor} ${col.color}`}>
                  {colOrders.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3 min-h-[200px]">
                {colOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`glass-card p-4 transition-all duration-300 hover:border-white/20 ${
                      animatingCard === order.id
                        ? 'opacity-50 scale-95'
                        : 'opacity-100 scale-100'
                    }`}
                  >
                    {/* Order ID & Time */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#f5a623] text-sm font-bold">{order.id}</span>
                      <div className="flex items-center gap-1 text-[#6b5f7a] text-xs">
                        <Clock size={10} />
                        {order.time}
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="flex items-center gap-2 mb-2">
                      <User size={12} className="text-[#6b5f7a]" />
                      <span className="text-white text-sm font-medium">{order.customer}</span>
                    </div>

                    {/* Items */}
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingBag size={12} className="text-[#6b5f7a]" />
                      <span className="text-[#a89bb5] text-xs truncate">{order.items}</span>
                      <span className="text-[#6b5f7a] text-xs flex-shrink-0">
                        ({order.itemCount} {order.itemCount === 1 ? 'item' : 'items'})
                      </span>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin size={12} className="text-[#6b5f7a]" />
                      <span className="text-[#6b5f7a] text-xs truncate">{order.address}</span>
                    </div>

                    {/* Total & Action */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-white font-bold text-sm">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                      {col.nextStatus && (
                        <button
                          onClick={() => moveOrder(order, col.key, col.nextStatus!)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${col.bgColor} ${col.color} hover:opacity-80`}
                        >
                          {col.nextLabel}
                          <ChevronRight size={12} />
                        </button>
                      )}
                      {!col.nextStatus && (
                        <span className="text-green-400 text-xs font-medium flex items-center gap-1">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {colOrders.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-[#6b5f7a] text-xs rounded-xl border border-dashed border-white/10">
                    No orders
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
