// Nimbus brand logo — cumulus cloud with a sun sparkle
// Replaces FisnaLogo with a cloud-and-sun motif that fits the
// "nimbus" name (Latin for cloud / rain cloud).
import React from 'react';

export function NimbusLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Nimbus logo"
      role="img"
    >
      <defs>
        <linearGradient
          id="nimbusGrad"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>

      {/* Cloud silhouette */}
      <path
        d="M9 22c-2.5 0-4.5-2-4.5-4.5 0-2 1.3-3.7 3-4.3-.2-.5-.3-1-.3-1.5 0-3 2.5-5.5 5.5-5.5 2.5 0 4.7 1.7 5.4 4 .5-.2 1-.3 1.5-.3 3 0 5.5 2.5 5.5 5.5 0 2.7-2 5-4.6 5.4z"
        stroke="url(#nimbusGrad)"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Sun sparkle (behind the cloud, top-right) */}
      <circle cx="24" cy="9" r="2.5" fill="url(#nimbusGrad)" opacity="0.95" />

      {/* Tiny AI sparkle (top-left, decorative) */}
      <path
        d="M5 7l0.7 1.7 1.7 0.7-1.7 0.7L5 11.8 4.3 10.1 2.6 9.4 4.3 8.7z"
        fill="url(#nimbusGrad)"
        opacity="0.85"
      />
    </svg>
  );
}

export default NimbusLogo;
