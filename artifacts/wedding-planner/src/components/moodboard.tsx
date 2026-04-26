import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImagePlus, Trash2, ExternalLink, Check } from "lucide-react";

const STORAGE_PHOTOS = "amore_moodboard_photos";
const STORAGE_PINTEREST = "amore_pinterest_board";

declare global {
  interface Window {
    PinUtils?: { build: (root?: HTMLElement) => void };
  }
}

function loadPinterestScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.PinUtils) return resolve();
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://assets.pinterest.com/js/pinit.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const s = document.createElement("script");
    s.src = "https://assets.pinterest.com/js/pinit.js";
    s.async = true;
    s.defer = true;
    s.setAttribute("data-pin-build", "PinUtils");
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}

function isValidPinterestBoardUrl(url: string): boolean {
  try {
    const u = new URL(url.trim());
    if (!u.hostname.includes("pinterest.")) return false;
    const parts = u.pathname.split("/").filter(Boolean);
    return parts.length >= 2;
  } catch {
    return false;
  }
}

const MAX_PHOTOS = 20;
const MAX_WIDTH = 1400;
const QUALITY = 0.78;

interface Photo { id: string; src: string }

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => { img.src = e.target!.result as string; };
    img.onload = () => {
      const scale = Math.min(1, MAX_WIDTH / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", QUALITY));
    };
    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function Moodboard() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [dragging, setDragging] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [pinterestUrl, setPinterestUrl] = useState<string>("");
  const [pinterestDraft, setPinterestDraft] = useState<string>("");
  const [pinterestEditing, setPinterestEditing] = useState(false);
  const [pinterestError, setPinterestError] = useState<string | null>(null);
  const pinterestEmbedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE_PHOTOS); if (r) setPhotos(JSON.parse(r)); } catch { /**/ }
    try {
      const p = localStorage.getItem(STORAGE_PINTEREST);
      if (p) {
        const parsed = JSON.parse(p);
        if (typeof parsed === "string") setPinterestUrl(parsed);
      }
    } catch { /**/ }
  }, []);

  // Render / re-render the Pinterest embed when URL changes
  useEffect(() => {
    if (!pinterestUrl || !pinterestEmbedRef.current) return;
    let cancelled = false;
    loadPinterestScript().then(() => {
      if (cancelled || !pinterestEmbedRef.current) return;
      // Reset the data-pin-href processed flag so PinUtils.build re-renders
      const anchor = pinterestEmbedRef.current.querySelector<HTMLAnchorElement>("a[data-pin-do]");
      if (anchor) {
        anchor.removeAttribute("data-pin-href");
        // Clear any previously-injected embed nodes
        Array.from(pinterestEmbedRef.current.children).forEach((c) => {
          if (c !== anchor) c.remove();
        });
        anchor.style.display = "";
      }
      window.PinUtils?.build(pinterestEmbedRef.current);
    });
    return () => { cancelled = true; };
  }, [pinterestUrl]);

  function savePinterestUrl() {
    const trimmed = pinterestDraft.trim();
    if (!trimmed) {
      // Clearing
      setPinterestUrl("");
      localStorage.removeItem(STORAGE_PINTEREST);
      setPinterestEditing(false);
      setPinterestError(null);
      return;
    }
    if (!isValidPinterestBoardUrl(trimmed)) {
      setPinterestError("Please paste a Pinterest board URL — e.g. pinterest.com/yourname/wedding");
      return;
    }
    setPinterestUrl(trimmed);
    localStorage.setItem(STORAGE_PINTEREST, JSON.stringify(trimmed));
    setPinterestEditing(false);
    setPinterestError(null);
  }

  function disconnectPinterest() {
    setPinterestUrl("");
    setPinterestDraft("");
    localStorage.removeItem(STORAGE_PINTEREST);
    setPinterestEditing(false);
    setPinterestError(null);
  }

  function persistPhotos(p: Photo[]) {
    try {
      setPhotos(p);
      localStorage.setItem(STORAGE_PHOTOS, JSON.stringify(p));
    } catch {
      if (p.length > 1) persistPhotos(p.slice(1));
    }
  }

  const processFiles = useCallback(async (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith("image/")).slice(0, MAX_PHOTOS - photos.length);
    const results: Photo[] = [];
    for (const file of images) {
      try {
        const src = await compressImage(file);
        results.push({ id: crypto.randomUUID(), src });
      } catch { /**/ }
    }
    if (results.length) persistPhotos([...photos, ...results]);
  }, [photos]);

  function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) processFiles(Array.from(e.target.files));
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }

  function removePhoto(id: string) {
    const updated = photos.filter((p) => p.id !== id);
    persistPhotos(updated);
    if (lightbox !== null) setLightbox(null);
  }

  return (
    <section id="moodboard" className="py-16 md:py-24 bg-[#F5F1EB]">
      <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-14">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <span className="block font-sans text-[10px] uppercase tracking-[0.28em] text-[#C9A89A] mb-6">The Vision</span>
            <h2 className="font-serif text-5xl md:text-6xl text-[#2C1810]">
              Your moodboard.<br />
              <span className="italic text-[#8C7B74]">Your aesthetic.</span>
            </h2>
          </div>
          <p className="font-sans text-[#8C7B74] leading-relaxed max-w-sm md:pb-2 text-sm">
            Upload images, define your colour palette, and choose your aesthetic keywords — share with vendors so everyone is aligned from day one.
          </p>
        </div>

        {/* Pinterest board */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#8C7B74]">
              Pinterest Board
              {pinterestUrl && !pinterestEditing && (
                <span className="ml-2 inline-flex items-center gap-1 text-[#C9A89A] normal-case tracking-normal">
                  <Check className="w-3 h-3" /> linked
                </span>
              )}
            </p>
            {pinterestUrl && !pinterestEditing && (
              <div className="flex items-center gap-4">
                <a
                  href={pinterestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-widest text-[#8C7B74] hover:text-[#C9A89A] transition-colors duration-200"
                >
                  <ExternalLink className="w-3 h-3" /> Open on Pinterest
                </a>
                <button
                  onClick={() => { setPinterestDraft(pinterestUrl); setPinterestEditing(true); setPinterestError(null); }}
                  className="font-sans text-[11px] uppercase tracking-widest text-[#8C7B74] hover:text-[#C9A89A] transition-colors duration-200"
                >
                  Change
                </button>
                <button
                  onClick={disconnectPinterest}
                  className="flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-widest text-[#8C7B74]/60 hover:text-red-400 transition-colors duration-200"
                >
                  <Trash2 className="w-3 h-3" /> Unlink
                </button>
              </div>
            )}
          </div>

          {(!pinterestUrl || pinterestEditing) ? (
            <div className="border border-dashed border-[#D8CFC8] bg-[#FAF7F2]/50 p-6 md:p-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#E60023] flex items-center justify-center text-white shrink-0 font-serif italic text-lg">P</div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-lg text-[#2C1810] leading-tight">Bring your Pinterest pins here</p>
                  <p className="font-sans text-xs text-[#8C7B74] mt-1.5 leading-relaxed">
                    Paste the link to a <em>public</em> Pinterest board and every pin will appear below — no need to download and re-upload.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  inputMode="url"
                  value={pinterestDraft}
                  onChange={(e) => { setPinterestDraft(e.target.value); setPinterestError(null); }}
                  onKeyDown={(e) => { if (e.key === "Enter") savePinterestUrl(); }}
                  placeholder="https://www.pinterest.com/yourname/wedding-inspo"
                  className="flex-1 px-4 py-3 bg-white border border-[#E8E0D8] font-sans text-sm text-[#2C1810] placeholder:text-[#C9A89A] focus:outline-none focus:border-[#C9A89A] transition-colors"
                />
                <button
                  onClick={savePinterestUrl}
                  className="px-6 py-3 bg-[#2C1810] text-[#FAF7F2] font-sans text-[11px] uppercase tracking-[0.22em] hover:bg-[#8C7B74] transition-colors duration-300"
                >
                  {pinterestEditing && pinterestUrl ? "Update" : "Connect"}
                </button>
                {pinterestEditing && (
                  <button
                    onClick={() => { setPinterestEditing(false); setPinterestError(null); setPinterestDraft(""); }}
                    className="px-4 py-3 font-sans text-[11px] uppercase tracking-[0.22em] text-[#8C7B74] hover:text-[#2C1810] transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
              {pinterestError && (
                <p className="font-sans text-xs text-red-500/80">{pinterestError}</p>
              )}
              <p className="font-sans text-[10px] text-[#C9A89A] uppercase tracking-[0.2em]">
                Tip — open your board on Pinterest and copy the URL from the address bar
              </p>
            </div>
          ) : (
            <div className="bg-white border border-[#E8E0D8] p-4 md:p-6 flex justify-center overflow-hidden">
              <div ref={pinterestEmbedRef} key={pinterestUrl} className="w-full flex justify-center min-h-[300px]">
                <a
                  data-pin-do="embedBoard"
                  data-pin-board-width="800"
                  data-pin-scale-height="320"
                  data-pin-scale-width="115"
                  href={pinterestUrl}
                >
                  {/* Pinterest will replace this */}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Photo board */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#8C7B74]">
              Inspiration Board {photos.length > 0 && <span className="text-[#C9A89A]">· {photos.length}/{MAX_PHOTOS}</span>}
            </p>
            {photos.length > 0 && photos.length < MAX_PHOTOS && (
              <button onClick={() => inputRef.current?.click()} className="flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-widest text-[#8C7B74] hover:text-[#C9A89A] transition-colors duration-200">
                <ImagePlus className="w-3.5 h-3.5" /> Add photos
              </button>
            )}
          </div>

          <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={onInput} />

          {photos.length === 0 ? (
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`border-2 border-dashed cursor-pointer py-16 flex flex-col items-center justify-center gap-4 transition-colors duration-300 ${dragging ? "border-[#C9A89A] bg-[#FAF7F2]" : "border-[#D8CFC8] hover:border-[#C9A89A]"}`}
            >
              <div className="w-10 h-10 border border-[#E8E0D8] flex items-center justify-center text-[#C9A89A]">
                <ImagePlus className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className="font-serif text-lg text-[#2C1810]">Upload inspiration photos</p>
                <p className="font-sans text-xs text-[#8C7B74] mt-1">Drop images here, or tap to browse · Up to {MAX_PHOTOS} photos</p>
              </div>
            </div>
          ) : (
            <div
              className={`columns-2 md:columns-3 lg:columns-4 gap-3 space-y-0 transition-all duration-300 ${dragging ? "opacity-60" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              {photos.map((photo, idx) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group break-inside-avoid mb-3 overflow-hidden border border-[#E8E0D8]/60"
                >
                  <img
                    src={photo.src}
                    alt=""
                    onClick={() => setLightbox(idx)}
                    className="w-full block object-cover cursor-zoom-in hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500/80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Clear all */}
        {(photos.length > 0) && (
          <div className="pt-2 border-t border-[#E8E0D8] flex justify-end">
            <button
              onClick={() => { persistPhotos([]); }}
              className="flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-widest text-[#8C7B74]/60 hover:text-red-400 transition-colors duration-300"
            >
              <Trash2 className="w-3 h-3" /> Clear all photos
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors duration-200" onClick={() => setLightbox(null)}>
              <X className="w-6 h-6" />
            </button>
            <button className="absolute bottom-5 right-5 flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-white/70 hover:text-white font-sans text-[11px] uppercase tracking-widest px-4 py-2 transition-colors duration-200 border border-white/10" onClick={(e) => { e.stopPropagation(); removePhoto(photos[lightbox].id); }}>
              <Trash2 className="w-3 h-3" /> Remove
            </button>
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              src={photos[lightbox]?.src}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-full object-contain shadow-2xl"
            />
            {photos.length > 1 && (
              <>
                <button className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/20 text-white/60 hover:text-white hover:border-white/60 flex items-center justify-center transition-colors duration-200 font-serif text-xl" onClick={(e) => { e.stopPropagation(); setLightbox((l) => ((l! - 1 + photos.length) % photos.length)); }}>‹</button>
                <button className="absolute right-16 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/20 text-white/60 hover:text-white hover:border-white/60 flex items-center justify-center transition-colors duration-200 font-serif text-xl" onClick={(e) => { e.stopPropagation(); setLightbox((l) => ((l! + 1) % photos.length)); }}>›</button>
                <p className="absolute bottom-5 left-5 font-sans text-xs text-white/40">{lightbox + 1} / {photos.length}</p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
