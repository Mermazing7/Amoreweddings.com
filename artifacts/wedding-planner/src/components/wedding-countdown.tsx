import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "amore_wedding_date";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);
  return { days, hours, minutes, seconds, passed: false };
}

export function WeddingCountdown() {
  const [weddingDate, setWeddingDate] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, passed: false });
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const d = new Date(stored);
      if (!isNaN(d.getTime())) {
        setWeddingDate(d);
        setInputValue(stored);
      }
    }
  }, []);

  useEffect(() => {
    if (!weddingDate) return;
    setTimeLeft(getTimeLeft(weddingDate));
    const interval = setInterval(() => setTimeLeft(getTimeLeft(weddingDate)), 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  const handleSave = useCallback(() => {
    if (!inputValue) return;
    const d = new Date(inputValue);
    if (isNaN(d.getTime())) return;
    localStorage.setItem(STORAGE_KEY, inputValue);
    setWeddingDate(d);
    setEditing(false);
  }, [inputValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3 }}
      className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center pt-24 pointer-events-none"
    >
      <div className="pointer-events-auto">
        <AnimatePresence mode="wait">
          {weddingDate && !editing ? (
            <motion.div
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-end gap-6 md:gap-10"
            >
              {[
                { value: timeLeft.passed ? "—" : String(timeLeft.days), label: "Days" },
                { value: timeLeft.passed ? "—" : pad(timeLeft.hours), label: "Hours" },
                { value: timeLeft.passed ? "—" : pad(timeLeft.minutes), label: "Min" },
                { value: timeLeft.passed ? "—" : pad(timeLeft.seconds), label: "Sec" },
              ].map(({ value, label }, i) => (
                <div key={label} className="flex flex-col items-center">
                  <span className="font-serif text-4xl md:text-6xl text-white leading-none tabular-nums drop-shadow-lg">
                    {value}
                  </span>
                  <span className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/60 mt-1.5">
                    {label}
                  </span>
                </div>
              ))}

              <button
                onClick={() => setEditing(true)}
                className="mb-1 ml-2 font-sans text-[9px] uppercase tracking-widest text-white/40 hover:text-white/80 transition-colors duration-300 border-b border-white/20 hover:border-white/60 pb-px leading-none"
              >
                Edit date
              </button>
            </motion.div>
          ) : editing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <input
                type="date"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                autoFocus
                className="bg-transparent border-b border-white/40 text-white font-sans text-sm py-1 px-1 focus:outline-none focus:border-white/80 transition-colors duration-300 [color-scheme:dark]"
              />
              <button
                onClick={handleSave}
                className="font-sans text-xs uppercase tracking-widest text-white/80 hover:text-white border-b border-white/30 hover:border-white pb-px transition-colors duration-300"
              >
                Save
              </button>
              {weddingDate && (
                <button
                  onClick={() => setEditing(false)}
                  className="font-sans text-xs uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors duration-300"
                >
                  Cancel
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                onClick={() => setEditing(true)}
                className="font-sans text-[11px] uppercase tracking-[0.25em] text-white/50 hover:text-white/90 border-b border-white/20 hover:border-white/60 pb-px transition-colors duration-300"
              >
                Set your wedding date
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
