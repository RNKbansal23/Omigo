'use client';

import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Truck,
  ArrowRight,
  Plus,
  ClipboardList,
  BarChart3,
} from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import Button from '@/components/shop/Button';

const recentOrders = [
  { id: '#GF-7823', customer: 'Priya Sharma', items: 'Chocolate Box, Candles', total: 2198, status: 'Delivered', date: 'May 22, 2026', statusColor: 'badge-success' },
  { id: '#GF-7822', customer: 'Rahul Mehta', items: 'Rose Gold Watch', total: 4999, status: 'Preparing', date: 'May 22, 2026', statusColor: 'badge-warning' },
  { id: '#GF-7821', customer: 'Anita Kapoor', items: 'Gift Hamper, Tea Set', total: 3998, status: 'Out for Delivery', date: 'May 22, 2026', statusColor: 'badge-info' },
  { id: '#GF-7820', customer: 'Vikram Singh', items: 'Silk Bouquet', total: 1999, status: 'Pending', date: 'May 21, 2026', statusColor: 'badge-gold' },
  { id: '#GF-7819', customer: 'Deepa Nair', items: 'Photo Frame, Journal', total: 1498, status: 'Delivered', date: 'May 21, 2026', statusColor: 'badge-success' },
  { id: '#GF-7818', customer: 'Arjun Patel', items: 'Premium Perfume', total: 3499, status: 'Delivered', date: 'May 21, 2026', statusColor: 'badge-success' },
];

const salesData = [
  { day: 'Mon', value: 65 },
  { day: 'Tue', value: 45 },
  { day: 'Wed', value: 78 },
  { day: 'Thu', value: 52 },
  { day: 'Fri', value: 90 },
  { day: 'Sat', value: 85 },
  { day: 'Sun', value: 72 },
];

export default function AdminDashboard() {
  const maxSale = Math.max(...salesData.map((d) => d.value));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-[#6b5f7a] text-sm mt-1">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm">
            <ClipboardList size={16} />
            View Reports
          </Button>
          <Button variant="primary" size="sm">
            <Plus size={16} />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={DollarSign}
          label="Total Revenue"
          value="₹1,24,500"
          trend={12.5}
          trendLabel="vs last month"
        />
        <StatsCard
          icon={ShoppingBag}
          label="Orders Today"
          value="48"
          trend={8.2}
          trendLabel="vs yesterday"
        />
        <StatsCard
          icon={Package}
          label="Active Products"
          value="156"
          trend={3.1}
          trendLabel="vs last month"
        />
        <StatsCard
          icon={Truck}
          label="Pending Deliveries"
          value="23"
          trend={-5.4}
          trendLabel="vs yesterday"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold text-lg">Sales Overview</h3>
              <p className="text-[#6b5f7a] text-xs mt-0.5">This Week&apos;s Performance</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f5a623]" />
                <span className="text-[#a89bb5]">Revenue</span>
              </div>
            </div>
          </div>

          {/* CSS Bar Chart */}
          <div className="flex items-end justify-between gap-3 h-52 px-2">
            {salesData.map((item, i) => {
              const height = (item.value / maxSale) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[#a89bb5] text-xs font-medium">
                    ₹{(item.value * 178).toLocaleString('en-IN')}
                  </span>
                  <div className="w-full max-w-[48px] relative group">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-[#f5a623] to-[#ffd073] transition-all duration-700 ease-out group-hover:from-[#ffd073] group-hover:to-[#f5a623] group-hover:shadow-lg group-hover:shadow-[#f5a623]/20"
                      style={{ height: `${height * 2}px` }}
                    />
                  </div>
                  <span className="text-[#6b5f7a] text-xs">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Add New Product', icon: Plus, desc: 'List a new gift item', color: 'from-[#f5a623]/20 to-[#f5a623]/5' },
              { label: 'Process Orders', icon: Package, desc: 'Review pending orders', color: 'from-purple-500/20 to-purple-500/5' },
              { label: 'View Reports', icon: BarChart3, desc: 'Analytics & insights', color: 'from-blue-500/20 to-blue-500/5' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group text-left"
                >
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${action.color}`}>
                    <Icon size={18} className="text-[#f5a623]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{action.label}</p>
                    <p className="text-[#6b5f7a] text-xs">{action.desc}</p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-[#6b5f7a] group-hover:text-[#f5a623] group-hover:translate-x-1 transition-all"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">Recent Orders</h3>
          <a
            href="/admin/orders"
            className="text-[#f5a623] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ArrowRight size={14} />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b5f7a] uppercase tracking-wider">
                  Order ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b5f7a] uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b5f7a] uppercase tracking-wider hidden md:table-cell">
                  Items
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b5f7a] uppercase tracking-wider">
                  Total
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b5f7a] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b5f7a] uppercase tracking-wider hidden sm:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-[#f5a623] font-medium">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{order.customer}</td>
                  <td className="px-4 py-3 text-sm text-[#a89bb5] hidden md:table-cell">
                    {order.items}
                  </td>
                  <td className="px-4 py-3 text-sm text-white font-medium">
                    ₹{order.total.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6b5f7a] hidden sm:table-cell">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
