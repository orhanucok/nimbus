// Fisna brand logo
// Hexagonal mark with the "F" monogram and a blue→purple gradient.
import React from 'react';

export function FisnaLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Fisna logo"
      role="img"
    >
      <defs>
        <linearGradient id="fisnaGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <path
        d="M16 2L4 9v14l12 7 12-7V9L16 2z"
        stroke="url(#fisnaGrad)"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M11 13h10M11 13v9M16 13v6"
        stroke="url(#fisnaGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default FisnaLogo;
