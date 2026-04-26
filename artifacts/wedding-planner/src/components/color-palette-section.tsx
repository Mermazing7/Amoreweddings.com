import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Palette, X } from "lucide-react";

const STORAGE_KEY = "amore_moodboard_palette";

const PRESET_PALETTES = [
  { name: "Blush & Ivory",     colors: ["#F9EDE8", "#E8C4B8", "#C9A89A", "#8C7B74", "#2C1810"] },
  { name: "Sage & Terracotta", colors: ["#F5F2EE", "#B5C4B1", "#8DAF89", "#C4714A", "#3D2B1F"] },
  { name: "Navy & Gold",       colors: ["#F4F1EB", "#B8A96A", "#8C7535", "#2A3F5F", "#0D1F33"] },
  { name: "Lavender & Cream",  colors: ["#FAF8F5", "#D9CFE8", "#A69BC0", "#7B6B9A", "#2C1F3A"] },
  { name: "Black & Champagne", colors: ["#F7F3EC", "#D4BFA0", "#A8926E", "#4A3728", "#111111"] },
  { name: "Dusty Rose & Mauve",colors: ["#FBF5F3", "#DEAD9D", "#C2877A", "#9B6B63", "#3E2828"] },
  { name: "Forest & Cream",    colors: ["#F4F0EB", "#C8D8C0", "#7D9E7A", "#4A6741", "#1E2F1C"] },
  { name: "Peach & Rust",      colors: ["#FDF5F0", "#F0C4A8", "#D98C62", "#B86035", "#3A2014"] },
];

interface Swatch { id: string; hex: string; label: string }

export function ColorPaletteSection() {
  const [swatches, setSwatches] = useState<Swatch[]>([]);
  const [newHex, setNewHex] = useState("#C9A89A");
  const [newLabel, setNewLabel] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    try {
      const r = localStorage.getItem(STORAGE_KEY);
      if (r) setSwatches(JSON.parse(r));
    } catch { /**/ }
  }, []);

  function persist(s: Swatch[]) {
    setSwatches(s);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }

  function addSwatch() {
    const hex = newHex.trim();
    if (!hex) return;
    persist([...swatches, { id: crypto.randomUUID(), hex, label: newLabel.trim() || hex }]);
    setNewLabel("");
    setShowAdd(false);
  }

  function loadPreset(colors: string[], name: string) {
    const news = colors.map((c) => ({ id: crypto.randomUUID(), hex: c, label: c }));
    persist(news);
    setShowPresets(false);
    setShowAdd(false);
  }

  function copySwatch(hex: string) {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(hex);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <div className="space-y-6">
      {/* Preset & Add controls */}
      <div className="flex items-center justify-between">
        <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#8C7B74]">
          {swatches.length > 0 ? `${swatches.length} swatch${swatches.length !== 1 ? "es" : ""}` : "No swatches yet"}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => { setShowPresets((p) => !p); setShowAdd(false); }}
            className="font-sans text-[10px] uppercase tracking-widest text-[#C9A89A] hover:text-[#2C1810] transition-colors duration-200 flex items-center gap-1.5"
          >
            <Palette className="w-3 h-3" /> Presets
          </button>
          <button
            onClick={() => { setShowAdd((p) => !p); setShowPresets(false); }}
            className="font-sans text-[10px] uppercase tracking-widest text-[#8C7B74] hover:text-[#C9A89A] transition-colors duration-200 flex items-center gap-1.5"
          >
            <Plus className="w-3 h-3" /> Add colour
          </button>
        </div>
      </div>

      {/* Preset palette picker */}
      <AnimatePresence>
        {showPresets && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border border-[#E8E0D8] bg-white"
          >
            <div className="p-5 space-y-3">
              <p className="font-sans text-[10px] uppercase tracking-widest text-[#8C7B74] mb-4">Choose a preset palette</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_PALETTES.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => loadPreset(preset.colors, preset.name)}
                    className="flex items-center gap-3 group text-left px-3 py-2.5 border border-transparent hover:border-[#E8E0D8] hover:bg-[#FAF7F2] transition-all duration-200"
                  >
                    <div className="flex gap-0.5 shrink-0">
                      {preset.colors.map((c) => (
                        <div key={c} className="w-5 h-5 border border-[#E8E0D8]/40" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="font-sans text-xs text-[#2C1810] group-hover:text-[#C9A89A] transition-colors duration-200">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Custom add */}
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border border-[#E8E0D8] bg-white"
          >
            <div className="p-5 flex items-end gap-4 flex-wrap">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-widest text-[#8C7B74] mb-2">Pick colour</p>
                <input
                  type="color"
                  value={newHex}
                  onChange={(e) => setNewHex(e.target.value)}
                  className="w-12 h-10 border border-[#E8E0D8] cursor-pointer p-0 bg-transparent"
                  style={{ borderRadius: 0 }}
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <p className="font-sans text-[10px] uppercase tracking-widest text-[#8C7B74] mb-2">Label (optional)</p>
                <input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSwatch()}
                  placeholder="e.g. Blush, Ivory…"
                  className="w-full border-b border-[#E8E0D8] bg-transparent font-sans text-sm text-[#2C1810] placeholder:text-[#8C7B74]/40 py-1.5 focus:outline-none focus:border-[#C9A89A] transition-colors duration-300"
                />
              </div>
              <div className="flex gap-3 pb-0.5">
                <button
                  onClick={addSwatch}
                  className="font-sans text-[10px] uppercase tracking-widest bg-[#2C1810] text-white px-5 py-2.5 hover:bg-[#C9A89A] transition-colors duration-500"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="font-sans text-[10px] uppercase tracking-widest text-[#8C7B74] border-b border-transparent hover:border-[#8C7B74] transition-colors duration-300 pb-0.5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swatch display */}
      {swatches.length > 0 ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            {swatches.map((s) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
                className="group relative"
              >
                {/* Swatch block */}
                <div
                  className="w-14 h-14 border border-[#E8E0D8] cursor-pointer relative overflow-hidden"
                  style={{ backgroundColor: s.hex }}
                  onClick={() => copySwatch(s.hex)}
                >
                  <div className="absolute inset-0 bg-black/25 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-white font-sans text-[8px] uppercase tracking-widest leading-tight px-1 text-center">
                      {copied === s.hex ? "Copied" : s.hex.toUpperCase()}
                    </span>
                  </div>
                </div>
                {/* Remove button */}
                <button
                  onClick={() => persist(swatches.filter((x) => x.id !== s.id))}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#2C1810] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
                {/* Label */}
                <p className="font-sans text-[9px] text-center text-[#8C7B74] mt-1.5 max-w-[56px] truncate">{s.label}</p>
              </motion.div>
            ))}
          </div>
          <p className="font-sans text-[10px] uppercase tracking-widest text-[#8C7B74]/50">
            Click to copy hex · Hover to remove
          </p>
        </div>
      ) : (
        <div className="border border-dashed border-[#E8E0D8] py-8 text-center">
          <p className="font-sans text-xs text-[#8C7B74]">
            Load a preset or add individual colours to build your palette.
          </p>
        </div>
      )}
    </div>
  );
}
