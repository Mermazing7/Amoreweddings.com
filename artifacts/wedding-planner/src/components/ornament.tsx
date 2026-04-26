import React from "react";

export function Ornament({ className = "", tone = "blush" }: { className?: string; tone?: "blush" | "sage" | "ivory" }) {
  const color = tone === "sage" ? "hsl(95 12% 42%)" : tone === "ivory" ? "rgba(255,255,255,0.45)" : "#C9A89A";
  return (
    <div className={`flex items-center justify-center gap-4 py-12 md:py-16 ${className}`}>
      <span className="block h-px w-16 md:w-24" style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="0.6">
        <circle cx="12" cy="12" r="2" />
        <path d="M12 2 C 8 6, 8 10, 12 12 C 16 10, 16 6, 12 2" />
        <path d="M12 22 C 8 18, 8 14, 12 12 C 16 14, 16 18, 12 22" />
        <path d="M2 12 C 6 8, 10 8, 12 12 C 10 16, 6 16, 2 12" />
        <path d="M22 12 C 18 8, 14 8, 12 12 C 14 16, 18 16, 22 12" />
      </svg>
      <span className="block h-px w-16 md:w-24" style={{ background: `linear-gradient(to left, transparent, ${color}, transparent)` }} />
    </div>
  );
}
