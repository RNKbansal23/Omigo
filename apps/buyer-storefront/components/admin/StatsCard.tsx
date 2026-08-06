'use client';

import React from 'react';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend: number;
  trendLabel?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel = 'vs last month',
}) => {
  const isPositive = trend >= 0;

  return (
    <div className="glass-card p-6 hover-lift group">
      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#f5a623]/20 to-[#f5a623]/5 border border-[#f5a623]/10 group-hover:border-[#f5a623]/30 transition-colors duration-300">
          <Icon size={22} className="text-[#f5a623]" />
        </div>

        {/* Trend */}
        <div
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            isPositive
              ? 'bg-green-500/10 text-green-400'
              : 'bg-red-500/10 text-red-400'
          }`}
        >
          {isPositive ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}
          <span>{isPositive ? '+' : ''}{trend}%</span>
        </div>
      </div>

      {/* Value */}
      <p className="text-3xl font-bold text-white mb-1 tracking-tight">
        {value}
      </p>

      {/* Label and trend label */}
      <div className="flex items-center justify-between">
        <p className="text-[#a89bb5] text-sm font-medium">{label}</p>
        <p className="text-[#6b5f7a] text-xs">{trendLabel}</p>
      </div>
    </div>
  );
};

export default StatsCard;
