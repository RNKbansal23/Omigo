'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  Shield,
  User,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: Package },
  { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#1a1025] flex">
      {/* ===== SIDEBAR ===== */}
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed top-0 left-0 h-full z-40 bg-[#1a1025] border-r border-white/10 transition-all duration-300 ${
          sidebarCollapsed ? 'w-[72px]' : 'w-[250px]'
        }`}
      >
        {/* Logo */}
        <div className="p-4 h-16 flex items-center gap-3 border-b border-white/10">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#f5a623] to-[#ffd073] flex-shrink-0">
            <Shield size={18} className="text-[#1a1025]" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-lg font-bold gradient-text whitespace-nowrap">
              GiftFlow Admin
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  active
                    ? 'bg-[#f5a623]/10 text-[#f5a623] border-l-2 border-[#f5a623]'
                    : 'text-[#a89bb5] hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  size={20}
                  className={`flex-shrink-0 ${
                    active ? 'text-[#f5a623]' : 'text-[#6b5f7a] group-hover:text-white'
                  } transition-colors`}
                />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[#6b5f7a] hover:text-white hover:bg-white/5 transition-all text-sm"
          >
            {sidebarCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[260px] bg-[#1a1025] border-r border-white/10 animate-slide-up flex flex-col">
            <div className="p-4 h-16 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#f5a623] to-[#ffd073]">
                  <Shield size={16} className="text-[#1a1025]" />
                </div>
                <span className="font-bold gradient-text">GiftFlow Admin</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-[#6b5f7a] hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-[#f5a623]/10 text-[#f5a623]'
                        : 'text-[#a89bb5] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-white/10">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-400/10 transition-all text-sm">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ===== MAIN AREA ===== */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-[250px]'
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#1a1025]/80 backdrop-blur-xl border-b border-white/10 flex items-center px-4 md:px-6 gap-4">
          {/* Mobile Menu */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg text-[#a89bb5] hover:text-white hover:bg-white/5 transition-all"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5f7a]"
              />
              <input
                type="text"
                placeholder="Search orders, products..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-[#6b5f7a] focus:outline-none focus:border-[#f5a623]/40 transition-all"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-[#a89bb5] hover:text-white hover:bg-white/5 transition-all">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#ec4899] flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-white text-xs font-semibold">Admin User</p>
                <p className="text-[#6b5f7a] text-[10px]">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
