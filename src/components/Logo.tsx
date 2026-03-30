'use client';

import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 64, className = '' }: LogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circular gold border */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="#d4a574"
          strokeWidth="3"
        />
        
        {/* Dark brown background circle */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="#3d2314"
        />
        
        {/* Small crown icon above the N */}
        <g transform="translate(50, 22)">
          <path
            d="M-8 0 L-6 -8 L-3 -4 L0 -10 L3 -4 L6 -8 L8 0 Z"
            fill="#d4a574"
            stroke="#d4a574"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* Crown points */}
          <circle cx="-6" cy="-8" r="2" fill="#d4a574" />
          <circle cx="0" cy="-10" r="2" fill="#d4a574" />
          <circle cx="6" cy="-8" r="2" fill="#d4a574" />
        </g>
        
        {/* Elegant serif "N" letter in gold */}
        <text
          x="50"
          y="58"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#d4a574"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="36"
          fontWeight="bold"
          fontStyle="italic"
        >
          N
        </text>
        
        {/* Small decorative line below N */}
        <line
          x1="35"
          y1="65"
          x2="65"
          y2="65"
          stroke="#d4a574"
          strokeWidth="1"
        />
        
        {/* "NICKI BEAUTY" text in small caps below */}
        <text
          x="50"
          y="78"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#d4a574"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="8"
          fontWeight="normal"
          letterSpacing="2"
        >
          NICKI BEAUTY
        </text>
      </svg>
    </div>
  );
}
