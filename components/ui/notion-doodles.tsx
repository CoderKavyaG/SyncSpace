import React from "react";

export function NotionAvatarStack({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center -space-x-2 select-none ${className}`}>
      {/* 1. Girl with black hair (Blue Ring) */}
      <div className="relative w-9 h-9 rounded-full bg-white border-2 border-[#0070F3] flex items-center justify-center shadow-xs overflow-hidden z-[7]">
        <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
          <circle cx="18" cy="18" r="17" fill="#FFFFFF" />
          <path d="M10 24C10 16 13 10 18 10C23 10 26 16 26 24" fill="#14171A" />
          <circle cx="18" cy="20" r="7" fill="#FDE2D2" />
          <path d="M12 18C12 14 15 11 18 11C21 11 24 14 24 18C22 18 20 16 18 16C16 16 14 18 12 18Z" fill="#14171A" />
          <circle cx="16" cy="19.5" r="0.8" fill="#14171A" />
          <circle cx="20" cy="19.5" r="0.8" fill="#14171A" />
          <path d="M17.5 22.5C18 23 18 23 18.5 22.5" stroke="#14171A" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* 2. Minimalist Face Profile (White Ring) */}
      <div className="relative w-9 h-9 rounded-full bg-white border-2 border-[#14171A] flex items-center justify-center shadow-xs z-[6]">
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7">
          {/* Eyebrow & eye */}
          <path d="M13 13C15 11 17 12 19 13" stroke="#14171A" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="15.5" cy="16" r="1.2" fill="#14171A" />
          {/* Nose profile */}
          <path d="M18 14L13 23H18" stroke="#14171A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 3. Directional Signpost Mascot (Red Ring) */}
      <div className="relative w-9 h-9 rounded-full bg-[#E5484D] border-2 border-[#14171A] flex items-center justify-center shadow-xs z-[5]">
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7">
          {/* Pole */}
          <path d="M18 8V28" stroke="#14171A" strokeWidth="2.5" strokeLinecap="round" />
          {/* Arrow Sign */}
          <path d="M11 12H21L26 16L21 20H11V12Z" fill="#FFFFFF" stroke="#14171A" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="15" cy="16" r="1" fill="#14171A" />
          <circle cx="18" cy="16" r="1" fill="#14171A" />
        </svg>
      </div>

      {/* 4. Boy with pencil over ear (Yellow Ring) */}
      <div className="relative w-9 h-9 rounded-full bg-white border-2 border-[#F5A623] flex items-center justify-center shadow-xs overflow-hidden z-[4]">
        <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
          <circle cx="18" cy="18" r="17" fill="#FFFFFF" />
          <path d="M10 18C10 12 14 8 18 8C22 8 26 12 26 18" fill="#14171A" />
          <circle cx="18" cy="20" r="7" fill="#F4EDE2" />
          <path d="M11 16C12 14 15 12 18 12C21 12 24 14 25 16C23 15 20 14 18 14C15 14 13 15 11 16Z" fill="#14171A" />
          <rect x="23" y="14" width="7" height="2.5" rx="0.5" transform="rotate(-25 23 14)" fill="#8A8F98" stroke="#14171A" strokeWidth="0.8" />
          <circle cx="16" cy="19.5" r="0.8" fill="#14171A" />
          <circle cx="20" cy="19.5" r="0.8" fill="#14171A" />
          <path d="M17.5 22.5C18 23 18 23 18.5 22.5" stroke="#14171A" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* 5. Minimalist Winking Profile (White Ring) */}
      <div className="relative w-9 h-9 rounded-full bg-white border-2 border-[#14171A] flex items-center justify-center shadow-xs z-[3]">
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7">
          <path d="M14 13C16 11 18 12 20 13" stroke="#14171A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M14 16C16 18 17 18 19 16" stroke="#14171A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M19 15L15 23H19" stroke="#14171A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 6. Folder with Eyes (Blue Ring) */}
      <div className="relative w-9 h-9 rounded-full bg-[#3B82F6] border-2 border-[#14171A] flex items-center justify-center shadow-xs z-[2]">
        <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7">
          <path d="M10 14H15L17 16H26V24H10V14Z" fill="#FFFFFF" stroke="#14171A" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="21" cy="19" r="1" fill="#14171A" />
          <circle cx="24" cy="19" r="1" fill="#14171A" />
        </svg>
      </div>

      {/* 7. Boy with Glasses (Red Ring) */}
      <div className="relative w-9 h-9 rounded-full bg-white border-2 border-[#EF4444] flex items-center justify-center shadow-xs overflow-hidden z-[1]">
        <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
          <circle cx="18" cy="18" r="17" fill="#FFFFFF" />
          <path d="M11 16C11 11 14 8 18 8C22 8 25 11 25 16" fill="#D1D5DB" />
          <circle cx="18" cy="20" r="7" fill="#F4EDE2" />
          {/* Glasses */}
          <rect x="13" y="17" width="4.5" height="4" rx="1" stroke="#14171A" strokeWidth="1" fill="#FFFFFF" />
          <rect x="18.5" y="17" width="4.5" height="4" rx="1" stroke="#14171A" strokeWidth="1" fill="#FFFFFF" />
          <path d="M17.5 19H18.5" stroke="#14171A" strokeWidth="1" />
          <circle cx="15.2" cy="19" r="0.7" fill="#14171A" />
          <circle cx="20.7" cy="19" r="0.7" fill="#14171A" />
        </svg>
      </div>
    </div>
  );
}

export function NotionFlyingBook({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Speed swoosh lines */}
      <svg
        width="42"
        height="28"
        viewBox="0 0 42 28"
        fill="none"
        className="absolute -left-7 -top-2 text-[#14171A]"
      >
        <path
          d="M2 10C12 8 24 14 34 22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 4C20 4 28 8 36 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Main Yellow Circle with Book */}
      <div className="relative w-12 h-12 rounded-full bg-[#F5A623] border-2 border-[#14171A] flex items-center justify-center shadow-md">
        <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
          {/* Open Book Pages */}
          <path
            d="M8 12C12 14 16 14 18 16C20 14 24 14 28 12L27 24C23 25 19 25 18 27C17 25 13 25 9 24L8 12Z"
            fill="#FFFFFF"
            stroke="#14171A"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Spine */}
          <path d="M18 16V27" stroke="#14171A" strokeWidth="1.5" />
          {/* Eyes on Book */}
          <circle cx="15" cy="18" r="1.2" fill="#14171A" />
          <circle cx="21" cy="18" r="1.2" fill="#14171A" />
        </svg>

        {/* Small floating checkmark pill badge */}
        <div className="absolute -bottom-1 -right-2 w-5 h-5 rounded-md bg-[#8A8F98] border border-white flex items-center justify-center shadow-xs">
          <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-white">
            <path
              d="M4 8L7 11L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function NotionAssistantMascot({ className = "" }: { className?: string }) {
  return (
    <div className={`w-10 h-10 rounded-2xl bg-[#F5A623] border-2 border-[#14171A] flex items-center justify-center shadow-sm select-none ${className}`}>
      <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7">
        {/* Robot Head */}
        <rect x="9" y="11" width="18" height="15" rx="4" fill="#FFFFFF" stroke="#14171A" strokeWidth="1.5" />
        {/* Antennas */}
        <path d="M7 16H9M27 16H29" stroke="#E5484D" strokeWidth="2" strokeLinecap="round" />
        {/* Screen / Visor */}
        <rect x="12" y="14" width="12" height="5" rx="1.5" fill="#14171A" />
        <circle cx="15" cy="16.5" r="1" fill="#3B82F6" />
        <circle cx="21" cy="16.5" r="1" fill="#3B82F6" />
        {/* Mouth */}
        <rect x="15" y="21" width="6" height="2" rx="0.5" fill="#14171A" />
      </svg>
    </div>
  );
}
