import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SECTIONS: Array<{ id: string; label: string }> = [
  { id: "tools", label: "The Suite" },
  { id: "venues", label: "Venues" },
  { id: "venue", label: "Venue Details" },
  { id: "themes", label: "Themes" },
  { id: "photographer", label: "Photography" },
  { id: "music", label: "Music" },
  { id: "planning", label: "Vendors" },
  { id: "budget", label: "Budget" },
  { id: "moodboard", label: "Moodboard" },
];

export function SectionRail() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const update = () => {
      let current: string | null = null;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.2) {
          current = s.label;
        }
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  return (
    <div className="hidden lg:flex fixed top-1/2 -translate-y-1/2 right-6 z-30 pointer-events-none">
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="ed-micro text-[#8C7B74] [writing-mode:vertical-rl] rotate-180 select-none"
          >
            <span className="inline-block mr-3 align-middle h-px w-6 bg-[#C9A89A]/60" />
            {active}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
