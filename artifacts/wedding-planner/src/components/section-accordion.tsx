import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle } from "lucide-react";

interface SectionAccordionProps {
  id: string;
  label: string;
  title: string;
  italicWord: string;
  subtitle: string;
  icon: React.ReactNode;
  storageKey?: string;
  storageKeys?: string[];
  bgClass?: string;
  index?: string;
  children: React.ReactNode;
}

function hasAnyData(key?: string, keys?: string[]): boolean {
  try {
    const all = keys ?? (key ? [key] : []);
    return all.some((k) => {
      const raw = localStorage.getItem(k);
      return !!raw && raw !== "{}" && raw !== "null" && raw !== "[]";
    });
  } catch {
    return false;
  }
}

export function SectionAccordion({
  id,
  label,
  title,
  italicWord,
  subtitle,
  icon,
  storageKey,
  storageKeys,
  bgClass = "bg-background",
  index,
  children,
}: SectionAccordionProps) {
  const [open, setOpen] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);

  useEffect(() => {
    setHasSavedData(hasAnyData(storageKey, storageKeys));
  }, [storageKey, storageKeys, open]);

  return (
    <section id={id} className={`${bgClass} border-b border-[#E8E0D8]`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-6 md:px-16 py-9 flex items-center justify-between gap-4 group hover:bg-[#FAF7F2] transition-colors duration-300 cursor-pointer"
      >
        <div className="flex items-center gap-5">
          <div className={`w-11 h-11 border flex items-center justify-center shrink-0 transition-colors duration-300 ${
            open ? "border-[#2C1810] text-[#2C1810]" : "border-[#E8E0D8] text-[#C9A89A] group-hover:border-[#C9A89A]"
          }`}>
            {icon}
          </div>
          <div>
            <p className="ed-micro text-[#C9A89A] mb-1.5">{label}</p>
            <div className="relative inline-block">
              <h2 className="font-serif text-2xl md:text-3xl text-[#2C1810]" style={{ letterSpacing: "-0.01em" }}>
                {title} <span className="italic text-[#8C7B74]">{italicWord}</span>
              </h2>
              <span
                aria-hidden
                className={`absolute -bottom-1 left-0 h-px bg-[#C9A89A] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  open ? "w-full opacity-100" : "w-0 opacity-0"
                }`}
              />
            </div>
            <p className="font-sans text-[11px] text-[#8C7B74] mt-2 hidden md:block tracking-wide">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {index && (
            <span className="ed-micro text-[#C9A89A]/70 hidden sm:block tabular-nums">{index}</span>
          )}
          {hasSavedData && (
            <div className="flex items-center gap-1.5 text-[#C9A89A]">
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="ed-micro hidden sm:block">Saved</span>
            </div>
          )}
          <div className={`w-8 h-8 border border-[#E8E0D8] flex items-center justify-center text-[#8C7B74] transition-transform duration-500 ${open ? "rotate-180" : ""}`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className={`border-t border-[#E8E0D8] px-6 md:px-16 py-14 ${bgClass}`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
