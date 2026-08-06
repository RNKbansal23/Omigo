'use client';

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1025] active:scale-[0.97]';

  const variantStyles: Record<string, string> = {
    primary:
      'bg-gradient-to-r from-[#f5a623] to-[#ffd073] text-[#1a1025] hover:shadow-lg hover:shadow-[#f5a623]/25 focus:ring-[#f5a623]',
    secondary:
      'bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white hover:shadow-lg hover:shadow-[#7c3aed]/25 focus:ring-[#7c3aed]',
    outline:
      'bg-transparent border-2 border-[#f5a623] text-[#f5a623] hover:bg-[#f5a623] hover:text-[#1a1025] focus:ring-[#f5a623]',
    ghost:
      'bg-transparent text-white hover:bg-white/10 focus:ring-white/20',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-8 py-3.5 text-lg gap-2.5',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled || loading ? disabledStyles : ''}
        ${className}
      `}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
