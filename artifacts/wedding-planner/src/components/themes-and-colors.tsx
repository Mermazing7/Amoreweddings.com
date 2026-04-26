import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, ChevronRight, ChevronDown, Leaf, MapPin, Music, Shirt,
  X, Plus, Check, Tag, Palette,
} from "lucide-react";
import { WEDDING_THEMES, type WeddingTheme } from "@/data/theme-data";
import { ColorPaletteSection } from "./color-palette-section";
import { SectionAccordion } from "./section-accordion";

// ── Storage helpers ───────────────────────────────────────────────────────────

const STORAGE_KEY_THEMES = "amore_saved_themes";
const STORAGE_KEY_CHOSEN_THEME = "amore_chosen_theme";
const STORAGE_TAGS = "amore_moodboard_tags";

// Real ceremony / arch / aisle photographs — same shot type so the
// composition stays comparable, only the styling differs per aesthetic.
const AESTHETIC_TAGS: { name: string; photo: string }[] = [
  { name: "Garden Romance",  photo: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=650&fit=crop&auto=format&q=75" },
  { name: "Modern Minimal",  photo: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=500&h=650&fit=crop&auto=format&q=75" },
  { name: "Coastal",         photo: "https://images.unsplash.com/photo-1525772764200-be829a350797?w=500&h=650&fit=crop&auto=format&q=75" },
  { name: "Black Tie",       photo: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&h=650&fit=crop&auto=format&q=75" },
  { name: "Bohemian",        photo: "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=500&h=650&fit=crop&auto=format&q=75" },
  { name: "Vintage",         photo: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&h=650&fit=crop&auto=format&q=75" },
  { name: "Rustic",          photo: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&h=650&fit=crop&auto=format&q=75" },
  { name: "Tropical",        photo: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=500&h=650&fit=crop&auto=format&q=75" },
  { name: "Dark & Moody",    photo: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&h=650&fit=crop&auto=format&q=75" },
  { name: "Ethereal",        photo: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=650&fit=crop&auto=format&q=75" },
  { name: "Art Deco",        photo: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&h=650&fit=crop&auto=format&q=75&sat=-30" },
  { name: "Wildflower",      photo: "https://images.unsplash.com/photo-1444840535719-195841cb6e2c?w=500&h=650&fit=crop&auto=format&q=75" },
  { name: "Countryside",     photo: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=500&h=650&fit=crop&auto=format&q=75" },
  { name: "Industrial Chic", photo: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=650&fit=crop&auto=format&q=75&sat=-50" },
  { name: "Candlelit",       photo: "https://images.unsplash.com/photo-1544975735-cef9bcf36756?w=500&h=650&fit=crop&auto=format&q=75" },
];

function useSaved(storageKey: string) {
  const [saved, setSaved] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(storageKey) ?? "[]")); }
    catch { return new Set(); }
  });
  function toggle(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(storageKey, JSON.stringify([...next]));
      return next;
    });
  }
  return { saved, toggle };
}

function useLocalValue<T>(key: string, init: T) {
  const [val, setVal] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : init; }
    catch { return init; }
  });
  function set(v: T) { setVal(v); localStorage.setItem(key, JSON.stringify(v)); }
  return [val, set] as const;
}

// ── Theme Detail Modal ────────────────────────────────────────────────────────

function ThemeModal({ theme, open, onClose, isSaved, onSave, isChosen, onChoose }: {
  theme: WeddingTheme; open: boolean; onClose: () => void;
  isSaved: boolean; onSave: () => void; isChosen: boolean; onChoose: () => void;
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }} className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:top-[8vh] md:w-[90vw] md:max-w-2xl z-[210] bg-white flex flex-col max-h-[90dvh] md:max-h-[84vh] overflow-hidden"
          >
            <div className="flex h-12 shrink-0">
              {theme.palette.map((c, i) => <div key={i} className="flex-1" style={{ backgroundColor: c }} />)}
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#C9A89A] mb-1">Wedding Theme</p>
                  <h2 className="font-serif text-3xl text-[#2C1810]">{theme.name}</h2>
                  <p className="font-serif italic text-lg text-[#8C7B74] mt-1">{theme.tagline}</p>
                </div>
                <button onClick={onClose} className="p-2 text-[#8C7B74] hover:text-[#2C1810] transition-colors shrink-0"><X className="w-5 h-5" /></button>
              </div>
              <p className="font-sans text-sm text-[#8C7B74] leading-relaxed mb-8 border-l-2 pl-4" style={{ borderColor: theme.accent }}>
                {theme.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {theme.keywords.map((kw) => (
                  <span key={kw} className="font-sans text-[11px] uppercase tracking-widest text-[#8C7B74] border border-[#E8E0D8] px-3 py-1">{kw}</span>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-6">
                {[
                  { icon: <MapPin className="w-3.5 h-3.5" />, label: "Venues", value: theme.venues },
                  { icon: <Leaf className="w-3.5 h-3.5" />, label: "Florals", value: theme.florals },
                  { icon: <Shirt className="w-3.5 h-3.5" />, label: "Attire", value: theme.attire },
                  { icon: <Music className="w-3.5 h-3.5" />, label: "Music", value: theme.music },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="border-b border-[#E8E0D8] pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#C9A89A]">{icon}</span>
                      <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C9A89A]">{label}</p>
                    </div>
                    <p className="font-sans text-sm text-[#2C1810] leading-relaxed">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-8 py-5 border-t border-[#E8E0D8] flex items-center justify-between shrink-0 gap-3 flex-wrap">
              <button onClick={onChoose}
                className={`flex items-center gap-2 font-sans text-xs uppercase tracking-widest px-4 py-2.5 border transition-colors duration-300 ${
                  isChosen ? "bg-[#2C1810] text-white border-[#2C1810]" : "border-[#2C1810] text-[#2C1810] hover:bg-[#2C1810] hover:text-white"
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                {isChosen ? "Our theme" : "Choose this theme"}
              </button>
              <div className="flex items-center gap-4">
                <button onClick={onSave}
                  className={`flex items-center gap-2 font-sans text-xs uppercase tracking-widest transition-colors duration-300 ${isSaved ? "text-[#C9A89A]" : "text-[#8C7B74] hover:text-[#C9A89A]"}`}
                >
                  <Heart className={`w-4 h-4 transition-all ${isSaved ? "fill-[#C9A89A]" : ""}`} />
                  {isSaved ? "Saved" : "Save"}
                </button>
                <button onClick={onClose} className="font-sans text-xs uppercase tracking-widest text-[#8C7B74] hover:text-[#2C1810] transition-colors">Close</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Theme Card ────────────────────────────────────────────────────────────────

function ThemeCard({ theme, isSaved, onSave, onExpand, isChosen }: {
  theme: WeddingTheme; isSaved: boolean; onSave: () => void; onExpand: () => void; isChosen: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      className={`group bg-white border flex flex-col overflow-hidden cursor-pointer transition-colors duration-300 ${
        isChosen ? "border-[#2C1810]" : "border-[#E8E0D8] hover:border-[#C9A89A]"
      }`}
      onClick={onExpand}
    >
      <div className="flex h-10 shrink-0">
        {theme.palette.map((c, i) => <div key={i} className="flex-1 group-hover:h-12 transition-all duration-500" style={{ backgroundColor: c }} />)}
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            {isChosen && <span className="font-sans text-[9px] uppercase tracking-widest text-white bg-[#2C1810] px-2 py-0.5 mb-1.5 inline-block">Our theme</span>}
            <h3 className="font-serif text-lg text-[#2C1810] leading-snug">{theme.name}</h3>
            <p className="font-serif italic text-xs text-[#8C7B74] mt-0.5">{theme.tagline}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onSave(); }}
            className={`p-1 shrink-0 transition-colors duration-300 ${isSaved ? "text-[#C9A89A]" : "text-[#D4CAC4] hover:text-[#C9A89A]"}`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-[#C9A89A]" : ""}`} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {theme.keywords.slice(0, 3).map((kw) => (
            <span key={kw} className="font-sans text-[10px] uppercase tracking-widest text-[#8C7B74] border border-[#E8E0D8] px-2 py-0.5">{kw}</span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[#C9A89A] group-hover:gap-2 transition-all duration-300 mt-auto">
          <span className="font-sans text-[10px] uppercase tracking-widest">Explore</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Accordion wrapper ────────────────────────────────────────────────────────

function AccordionSection({ label, title, italicTitle, subtitle, previewColors, isOpen, onToggle, savedCount, children }: {
  label: string; title: string; italicTitle: string; subtitle: string;
  previewColors: string[]; isOpen: boolean; onToggle: () => void; savedCount: number; children: React.ReactNode;
}) {
  return (
    <div className="border border-[#E8E0D8]">
      {/* Clickable header */}
      <button
        onClick={onToggle}
        className="w-full text-left bg-white hover:bg-[#FAF7F2] transition-colors duration-300 group"
      >
        {/* Color preview strip */}
        <div className="flex h-8 overflow-hidden">
          {previewColors.map((c, i) => (
            <div key={i} className="flex-1 group-hover:h-10 transition-all duration-500" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="px-8 py-7 flex items-center justify-between gap-4">
          <div className="flex items-start gap-6">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#C9A89A] mb-2">{label}</p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#2C1810] leading-none">
                {title} <span className="italic text-[#8C7B74]">{italicTitle}</span>
              </h2>
              <p className="font-sans text-sm text-[#8C7B74] mt-2 max-w-md leading-relaxed">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {savedCount > 0 && (
              <div className="flex items-center gap-1.5 font-sans text-xs text-[#C9A89A] border border-[#C9A89A]/30 px-3 py-1">
                <Heart className="w-3 h-3 fill-[#C9A89A]" />
                {savedCount} saved
              </div>
            )}
            <div className={`w-8 h-8 border border-[#E8E0D8] flex items-center justify-center text-[#8C7B74] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#E8E0D8] px-8 py-8 bg-[#FAF7F2]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────

export function ThemesAndColors() {
  const { saved: savedThemes, toggle: toggleTheme } = useSaved(STORAGE_KEY_THEMES);
  const [chosenTheme, setChosenTheme] = useLocalValue<string | null>(STORAGE_KEY_CHOSEN_THEME, null);

  const [themesOpen, setThemesOpen] = useState(false);
  const [myPaletteOpen, setMyPaletteOpen] = useState(false);
  const [myAestheticOpen, setMyAestheticOpen] = useState(false);
  const [aestheticTags, setAestheticTags] = useLocalValue<string[]>(STORAGE_TAGS, []);
  const [customTag, setCustomTag] = useState("");
  const [activeTheme, setActiveTheme] = useState<WeddingTheme | null>(null);
  const [themeFilter, setThemeFilter] = useState<"all" | "saved">("all");

  const visibleThemes = themeFilter === "saved"
    ? WEDDING_THEMES.filter((t) => savedThemes.has(t.id))
    : WEDDING_THEMES;

  const themePreviewColors = WEDDING_THEMES.flatMap((t) => t.palette.slice(0, 1));
  const foundChosenTheme = WEDDING_THEMES.find((t) => t.id === chosenTheme);

  return (
    <SectionAccordion
      id="themes"
      label="Inspiration"
      title="Color palettes &"
      italicWord="themes"
      index="02 — Aesthetic"
      subtitle="Find your aesthetic and build your color story."
      icon={<Palette className="w-5 h-5 stroke-[1.5]" />}
      storageKeys={[STORAGE_KEY_THEMES, STORAGE_KEY_CHOSEN_THEME, STORAGE_TAGS]}
      bgClass="bg-[#FAF7F2]"
    >
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Chosen selections summary */}
        {foundChosenTheme && (
          <div className="bg-white border border-[#2C1810] px-8 py-5 flex flex-wrap gap-6 items-center">
            <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#C9A89A] shrink-0">Your selection</p>
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-20">
                {foundChosenTheme.palette.map((c, i) => <div key={i} className="flex-1" style={{ backgroundColor: c }} />)}
              </div>
              <span className="font-serif text-base text-[#2C1810]">{foundChosenTheme.name}</span>
              <button onClick={() => setChosenTheme(null)} className="text-[#8C7B74] hover:text-[#2C1810] transition-colors"><X className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )}

        {/* ── Themes accordion ── */}
        <AccordionSection
          label="Inspiration"
          title="Wedding"
          italicTitle="themes"
          subtitle="Twelve distinct aesthetics — from barefoot coastal to black-tie ballrooms. Click to explore."
          previewColors={themePreviewColors}
          isOpen={themesOpen}
          onToggle={() => setThemesOpen((o) => !o)}
          savedCount={savedThemes.size}
        >
          {/* Filter */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex border border-[#E8E0D8] bg-white">
              {(["all", "saved"] as const).map((f) => (
                <button key={f} onClick={() => setThemeFilter(f)}
                  className={`px-4 py-2 font-sans text-[11px] uppercase tracking-widest transition-colors ${
                    themeFilter === f ? "bg-[#2C1810] text-white" : "text-[#8C7B74] hover:text-[#2C1810]"
                  }`}
                >
                  {f === "all" ? `All (${WEDDING_THEMES.length})` : `Saved (${savedThemes.size})`}
                </button>
              ))}
            </div>
            {chosenTheme && (
              <span className="font-sans text-[11px] uppercase tracking-widest text-[#C9A89A] flex items-center gap-1.5">
                <Check className="w-3 h-3" /> Theme chosen
              </span>
            )}
          </div>

          {visibleThemes.length === 0 ? (
            <div className="border border-[#E8E0D8] py-16 text-center bg-white">
              <p className="font-serif text-xl text-[#2C1810] mb-2">No saved themes yet</p>
              <p className="font-sans text-sm text-[#8C7B74]">Heart any theme to save it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visibleThemes.map((theme) => (
                <ThemeCard key={theme.id} theme={theme}
                  isSaved={savedThemes.has(theme.id)} onSave={() => toggleTheme(theme.id)}
                  onExpand={() => setActiveTheme(theme)} isChosen={chosenTheme === theme.id}
                />
              ))}
            </div>
          )}
        </AccordionSection>

        {/* ── My Wedding Color Palette accordion ── */}
        <AccordionSection
          label="Your Colour Story"
          title="My wedding"
          italicTitle="color palette"
          subtitle="Build your exact colour story with custom hex swatches — load a preset or add individual colours."
          previewColors={["#F9EDE8", "#C9A89A", "#8C7B74", "#2C1810", "#E8E0D8"]}
          isOpen={myPaletteOpen}
          onToggle={() => setMyPaletteOpen((o) => !o)}
          savedCount={0}
        >
          <ColorPaletteSection />
        </AccordionSection>

        {false && (
        <AccordionSection
          label=""
          title=""
          italicTitle=""
          subtitle=""
          previewColors={[]}
          isOpen={false}
          onToggle={() => {}}
          savedCount={0}
        >
          <div className="space-y-6">
            {/* Photo grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {AESTHETIC_TAGS.map(({ name, photo }) => {
                const selected = aestheticTags.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => setAestheticTags(
                      selected
                        ? aestheticTags.filter((t) => t !== name)
                        : [...aestheticTags, name]
                    )}
                    className="group relative aspect-[3/4] overflow-hidden focus:outline-none"
                  >
                    <img
                      src={photo}
                      alt={name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    {/* always-visible gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    {/* selected overlay */}
                    {selected && (
                      <div className="absolute inset-0 bg-[#C9A89A]/30 ring-2 ring-[#C9A89A] ring-inset" />
                    )}
                    {/* checkmark */}
                    {selected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#C9A89A] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {/* label */}
                    <span className="absolute bottom-0 inset-x-0 px-2.5 pb-2.5 font-sans text-[10px] uppercase tracking-[0.18em] text-white text-left leading-tight">
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom tag input */}
            <div className="flex items-center gap-0 border-t border-[#E8E0D8] pt-4">
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#8C7B74] mr-4 shrink-0">Add your own</span>
              <input
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const t = customTag.trim();
                    if (t && !aestheticTags.includes(t)) setAestheticTags([...aestheticTags, t]);
                    setCustomTag("");
                  }
                }}
                placeholder="e.g. Cottagecore…"
                className="flex-1 border-b border-[#E8E0D8] bg-transparent font-sans text-sm text-[#2C1810] placeholder:text-[#8C7B74]/40 py-1.5 focus:outline-none focus:border-[#C9A89A] transition-colors duration-300"
              />
              <button
                onClick={() => {
                  const t = customTag.trim();
                  if (t && !aestheticTags.includes(t)) setAestheticTags([...aestheticTags, t]);
                  setCustomTag("");
                }}
                className="ml-3 border border-[#E8E0D8] px-3 py-1.5 text-[#8C7B74] hover:border-[#C9A89A] hover:text-[#C9A89A] transition-colors duration-200"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Custom tags */}
            {aestheticTags.filter((t) => !AESTHETIC_TAGS.some((a) => a.name === t)).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {aestheticTags.filter((t) => !AESTHETIC_TAGS.some((a) => a.name === t)).map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2C1810] text-white font-sans text-[11px] uppercase tracking-widest">
                    <Tag className="w-3 h-3" />
                    {tag}
                    <button onClick={() => setAestheticTags(aestheticTags.filter((t2) => t2 !== tag))} className="ml-0.5 hover:text-[#C9A89A] transition-colors duration-200"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </AccordionSection>
        )}

      </div>

      {/* Modals */}
      {activeTheme && (
        <ThemeModal theme={activeTheme} open={!!activeTheme} onClose={() => setActiveTheme(null)}
          isSaved={savedThemes.has(activeTheme.id)} onSave={() => toggleTheme(activeTheme.id)}
          isChosen={chosenTheme === activeTheme.id}
          onChoose={() => { setChosenTheme(chosenTheme === activeTheme.id ? null : activeTheme.id); setActiveTheme(null); }}
        />
      )}
    </SectionAccordion>
  );
}
