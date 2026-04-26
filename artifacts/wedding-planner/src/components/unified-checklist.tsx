import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Square, Plus, ChevronDown, X } from "lucide-react";

const STORAGE_KEY = "amore_checklist";

interface CheckItem {
  id: string;
  text: string;
  done: boolean;
  custom: boolean;
}

interface Phase {
  key: string;
  label: string;
  subtitle: string;
  items: string[];
}

const DEFAULT_PHASES: Phase[] = [
  {
    key: "12mo",
    label: "12 Months Out",
    subtitle: "The essentials first",
    items: [
      "Set your total wedding budget",
      "Decide on approximate guest count",
      "Choose your wedding date",
      "Book your venue",
      "Hire a wedding planner or coordinator",
      "Get engagement photos taken",
      "Start your guest list",
      "Begin researching photographers",
    ],
  },
  {
    key: "9mo",
    label: "9 Months Out",
    subtitle: "Creative direction",
    items: [
      "Book your photographer and videographer",
      "Choose your wedding theme and colour palette",
      "Book your florist",
      "Begin dress or suit shopping",
      "Book your officiant",
      "Book your caterer",
      "Book your DJ or band",
      "Create your wedding website",
      "Send save-the-dates",
    ],
  },
  {
    key: "6mo",
    label: "6 Months Out",
    subtitle: "Details take shape",
    items: [
      "Book hair and makeup artists",
      "Book your cake designer",
      "Arrange accommodation for out-of-town guests",
      "Book transportation (car, shuttle)",
      "Plan your honeymoon",
      "Register for gifts",
      "Order wedding invitations",
      "Plan rehearsal dinner",
      "Order wedding rings",
    ],
  },
  {
    key: "3mo",
    label: "3 Months Out",
    subtitle: "Finalising the vision",
    items: [
      "Send wedding invitations",
      "Schedule dress/suit fittings",
      "Finalise floral arrangements",
      "Create wedding day timeline",
      "Book honeymoon flights and hotels",
      "Arrange marriage license",
      "Confirm all vendor bookings",
      "Plan ceremony details with officiant",
      "Choose and contact wedding party",
    ],
  },
  {
    key: "1mo",
    label: "1 Month Out",
    subtitle: "Almost there",
    items: [
      "Confirm guest RSVPs and finalise headcount",
      "Provide final guest count to caterer",
      "Create seating chart",
      "Final dress/suit fitting",
      "Write vows",
      "Prepare vendor payments and tips",
      "Break in your wedding shoes",
      "Confirm rehearsal dinner details",
      "Create day-of emergency kit",
    ],
  },
  {
    key: "1wk",
    label: "One Week Before",
    subtitle: "The final stretch",
    items: [
      "Confirm all vendors with final details",
      "Provide timeline to all vendors",
      "Pack for honeymoon",
      "Pick up wedding attire",
      "Attend rehearsal and dinner",
      "Delegate day-of tasks to wedding party",
      "Get a good night's sleep",
      "Prepare tips envelopes for vendors",
    ],
  },
  {
    key: "dayof",
    label: "Wedding Day",
    subtitle: "You've got this",
    items: [
      "Eat a good breakfast",
      "Arrive on time for hair and makeup",
      "Hand rings to best person or maid of honour",
      "Hand vendor tips to coordinator",
      "Enjoy every moment — it goes fast",
    ],
  },
];

function buildDefaults(): Record<string, CheckItem[]> {
  const out: Record<string, CheckItem[]> = {};
  for (const phase of DEFAULT_PHASES) {
    out[phase.key] = phase.items.map((text) => ({
      id: crypto.randomUUID(),
      text,
      done: false,
      custom: false,
    }));
  }
  return out;
}

export function UnifiedChecklist() {
  const [data, setData] = useState<Record<string, CheckItem[]>>({});
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState<Record<string, boolean>>({});
  const [newText, setNewText] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setData(raw ? JSON.parse(raw) : buildDefaults());
    } catch {
      setData(buildDefaults());
    }
  }, []);

  function persist(updated: Record<string, CheckItem[]>) {
    setData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function toggle(phaseKey: string, itemId: string) {
    const phase = data[phaseKey] ?? [];
    persist({ ...data, [phaseKey]: phase.map((i) => i.id === itemId ? { ...i, done: !i.done } : i) });
  }

  function addCustom(phaseKey: string) {
    const text = (newText[phaseKey] ?? "").trim();
    if (!text) return;
    const phase = data[phaseKey] ?? [];
    persist({ ...data, [phaseKey]: [...phase, { id: crypto.randomUUID(), text, done: false, custom: true }] });
    setNewText((p) => ({ ...p, [phaseKey]: "" }));
    setAdding((p) => ({ ...p, [phaseKey]: false }));
  }

  function deleteItem(phaseKey: string, itemId: string) {
    const phase = data[phaseKey] ?? [];
    persist({ ...data, [phaseKey]: phase.filter((i) => i.id !== itemId) });
  }

  const totalItems = Object.values(data).flat().length;
  const doneItems = Object.values(data).flat().filter((i) => i.done).length;
  const progress = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      {totalItems > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center justify-between mb-2">
            <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#8C7B74]">
              {doneItems} of {totalItems} complete
            </p>
            <p className="font-serif text-lg text-[#2C1810]">{progress}%</p>
          </div>
          <div className="h-1 bg-[#E8E0D8] w-full">
            <motion.div
              className="h-1 bg-[#C9A89A]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}

      {/* Phases */}
      {DEFAULT_PHASES.map((phase) => {
        const items = data[phase.key] ?? [];
        const done = items.filter((i) => i.done).length;
        const isOpen = open[phase.key] ?? false;
        const isAdding = adding[phase.key] ?? false;
        const allDone = items.length > 0 && done === items.length;

        return (
          <div key={phase.key} className="border border-[#E8E0D8]">
            <button
              onClick={() => setOpen((p) => ({ ...p, [phase.key]: !p[phase.key] }))}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#FAF7F2] transition-colors duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 border transition-colors duration-300 ${allDone ? "bg-[#C9A89A] border-[#C9A89A]" : "border-[#E8E0D8]"}`} />
                <div>
                  <p className="font-serif text-base text-[#2C1810]">{phase.label}</p>
                  <p className="font-sans text-xs text-[#8C7B74]">{phase.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-sans text-[11px] text-[#C9A89A] tabular-nums">{done}/{items.length}</span>
                <ChevronDown className={`w-4 h-4 text-[#8C7B74] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[#E8E0D8] px-5 py-4 space-y-1 bg-white">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 py-1.5 group/item">
                        <button
                          onClick={() => toggle(phase.key, item.id)}
                          className="shrink-0 text-[#C9A89A] hover:text-[#2C1810] transition-colors duration-200"
                        >
                          {item.done
                            ? <CheckSquare className="w-4 h-4" />
                            : <Square className="w-4 h-4" />}
                        </button>
                        <p className={`font-sans text-sm flex-1 transition-colors duration-200 ${item.done ? "line-through text-[#8C7B74]/50" : "text-[#2C1810]"}`}>
                          {item.text}
                          {item.custom && (
                            <span className="ml-2 font-sans text-[9px] uppercase tracking-widest text-[#C9A89A]">custom</span>
                          )}
                        </p>
                        <button
                          onClick={() => deleteItem(phase.key, item.id)}
                          aria-label={`Remove ${item.text}`}
                          className="opacity-0 group-hover/item:opacity-100 w-5 h-5 flex items-center justify-center text-[#8C7B74] hover:text-[#2C1810] transition-all duration-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* Add custom task */}
                    <AnimatePresence>
                      {isAdding ? (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 mt-2"
                        >
                          <Square className="w-4 h-4 text-[#E8E0D8] shrink-0" />
                          <input
                            autoFocus
                            value={newText[phase.key] ?? ""}
                            onChange={(e) => setNewText((p) => ({ ...p, [phase.key]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") addCustom(phase.key);
                              if (e.key === "Escape") setAdding((p) => ({ ...p, [phase.key]: false }));
                            }}
                            placeholder="Add a task… (Enter to save)"
                            className="flex-1 bg-transparent border-b border-[#C9A89A] py-1 font-sans text-sm text-[#2C1810] placeholder:text-[#8C7B74]/50 focus:outline-none"
                          />
                          <button onClick={() => addCustom(phase.key)} className="font-sans text-[10px] uppercase tracking-widest text-[#C9A89A] hover:text-[#2C1810] transition-colors duration-200">Save</button>
                          <button onClick={() => setAdding((p) => ({ ...p, [phase.key]: false }))} className="font-sans text-[10px] uppercase tracking-widest text-[#8C7B74] hover:text-[#2C1810] transition-colors duration-200">Cancel</button>
                        </motion.div>
                      ) : (
                        <button
                          onClick={() => setAdding((p) => ({ ...p, [phase.key]: true }))}
                          className="flex items-center gap-2 mt-2 font-sans text-[11px] text-[#8C7B74] hover:text-[#C9A89A] transition-colors duration-200"
                        >
                          <Plus className="w-3 h-3" /> Add custom task
                        </button>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
