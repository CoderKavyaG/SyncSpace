import React from "react";

export function BrandLogosGrid() {
  return (
    <div className="w-full space-y-6 text-[#14171A] select-none">
      <div className="text-center text-xs font-semibold text-[#8A8F98] uppercase tracking-wider font-display">
        Trusted by 50% of the Forbes Cloud 100
      </div>

      {/* Row 1 */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-8 text-xs font-semibold">
        {/* OpenAI */}
        <div className="flex items-center gap-1.5 hover:opacity-75 transition-opacity">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073z" />
          </svg>
          <span className="font-bold text-sm tracking-tight">OpenAI</span>
        </div>
        <span className="text-[#D0D4DC]">•</span>

        {/* Figma */}
        <div className="flex items-center gap-1.5 hover:opacity-75 transition-opacity">
          <svg className="w-3.5 h-3.5" viewBox="0 0 38 57" fill="currentColor">
            <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" />
            <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" />
            <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" />
            <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" />
            <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" />
          </svg>
          <span className="font-bold text-sm tracking-tight">Figma</span>
        </div>
        <span className="text-[#D0D4DC]">•</span>

        {/* Ramp */}
        <div className="flex items-center gap-1 hover:opacity-75 transition-opacity">
          <span className="font-bold text-sm tracking-tight">ramp</span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18C7 18 10 14 13 9C16 4 19 3 21 3V7C18 7 15 10 12 15C9 20 6 21 3 21V18Z" />
          </svg>
        </div>
        <span className="text-[#D0D4DC]">•</span>

        {/* Cursor */}
        <div className="flex items-center gap-1.5 hover:opacity-75 transition-opacity">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM12 4.2L19.5 8L12 11.8L4.5 8L12 4.2ZM4 9.5L11 13V20L4 16.5V9.5ZM13 20V13L20 9.5V16.5L13 20Z" />
          </svg>
          <span className="font-bold text-xs uppercase tracking-wider">CURSOR</span>
        </div>
        <span className="text-[#D0D4DC]">•</span>

        {/* Vercel */}
        <div className="flex items-center gap-1.5 hover:opacity-75 transition-opacity">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L24 22H0L12 1Z" />
          </svg>
          <span className="font-bold text-sm tracking-tight">Vercel</span>
        </div>
        <span className="text-[#D0D4DC]">•</span>

        {/* NVIDIA */}
        <div className="flex items-center gap-1.5 hover:opacity-75 transition-opacity">
          <span className="font-black text-xs tracking-wider">NVIDIA</span>
        </div>
        <span className="text-[#D0D4DC]">•</span>

        {/* VOLVO */}
        <div className="hover:opacity-75 transition-opacity font-mono font-bold text-xs tracking-widest">
          VOLVO
        </div>
        <span className="text-[#D0D4DC]">•</span>

        {/* L'OREAL */}
        <div className="hover:opacity-75 transition-opacity font-serif font-bold text-xs tracking-widest">
          L&apos;ORÉAL
        </div>
        <span className="text-[#D0D4DC]">•</span>

        {/* Discord */}
        <div className="flex items-center gap-1 hover:opacity-75 transition-opacity font-bold text-xs">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z" />
          </svg>
          <span>Discord</span>
        </div>
      </div>

      {/* Row 2 (Image 2 Match) */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8 text-xs font-semibold text-[#14171A]">
        {/* Lovable */}
        <div className="flex items-center gap-1 hover:opacity-75 transition-opacity font-bold">
          <span className="text-sm">♥</span>
          <span>Lovable</span>
        </div>
        <span className="text-[#D0D4DC]">•</span>

        {/* 1Password */}
        <div className="flex items-center gap-1.5 hover:opacity-75 transition-opacity font-bold">
          <div className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[10px]">
            1
          </div>
          <span>1Password</span>
        </div>
        <span className="text-[#D0D4DC]">•</span>

        {/* Affirm */}
        <div className="hover:opacity-75 transition-opacity font-display font-black text-xs tracking-tight">
          affīrm
        </div>
        <span className="text-[#D0D4DC]">•</span>

        {/* Riot Games */}
        <div className="hover:opacity-75 transition-opacity font-display font-black text-xs tracking-tight">
          RIOT GAMES
        </div>
        <span className="text-[#D0D4DC]">•</span>

        {/* Clay */}
        <div className="flex items-center gap-1 hover:opacity-75 transition-opacity font-bold text-sm">
          <span>clay</span>
        </div>
        <span className="text-[#D0D4DC]">•</span>

        {/* Remote */}
        <div className="hover:opacity-75 transition-opacity font-bold text-sm tracking-tight">
          remote
        </div>
        <span className="text-[#D0D4DC]">•</span>

        {/* FAIRE */}
        <div className="hover:opacity-75 transition-opacity font-serif text-xs tracking-widest">
          F A I R E
        </div>
        <span className="text-[#D0D4DC]">•</span>

        {/* TOYOTA */}
        <div className="hover:opacity-75 transition-opacity font-sans font-black text-xs tracking-widest">
          TOYOTA
        </div>
      </div>
    </div>
  );
}
