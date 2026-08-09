import React from "react";

interface SyncSpaceLogoProps {
  size?: number;
  className?: string;
}

export function SyncSpaceLogo({ size = 32, className = "" }: SyncSpaceLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none flex-shrink-0 ${className}`}
    >
      {/* Notion-style isometric soft-rounded black tile with subtle inner depth */}
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        rx="7"
        fill="#14171A"
        stroke="#000000"
        strokeWidth="1.5"
      />
      {/* Subtle inner highlight border */}
      <rect
        x="2.5"
        y="2.5"
        width="27"
        height="27"
        rx="6"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="1"
        fill="none"
      />
      {/* Notion-inspired geometric S path */}
      <path
        d="M21.5 10.5C21.5 8.84315 19.8 7.5 16.5 7.5C12.8 7.5 10.5 9.2 10.5 11.8C10.5 16.2 21.5 14.8 21.5 19.8C21.5 22.8 18.8 24.5 15.5 24.5C11.8 24.5 9.8 22.8 9.5 20.2M10.5 10.5L9.5 8M21.5 21.5L22.5 24"
        stroke="#FFFFFF"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Accent dot */}
      <circle cx="21" cy="8" r="1.25" fill="#0070F3" />
    </svg>
  );
}
