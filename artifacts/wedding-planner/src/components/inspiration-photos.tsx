import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface Photo {
  id: string;
  dataUrl: string;
  name: string;
}

const MAX_PHOTOS = 12;
const MAX_WIDTH = 1200;
const QUALITY = 0.78;

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, MAX_WIDTH / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("canvas")); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", QUALITY));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("load")); };
    img.src = url;
  });
}

interface InspirationPhotosProps {
  storageKey: string;
  label?: string;
}

export function InspirationPhotos({ storageKey, label = "Inspiration" }: InspirationPhotosProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const key = `amore_inspo_${storageKey}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setPhotos(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [key]);

  function persist(updated: Photo[]) {
    setPhotos(updated);
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {
      // localStorage full — remove oldest photo and retry
      const trimmed = updated.slice(1);
      setPhotos(trimmed);
      try { localStorage.setItem(key, JSON.stringify(trimmed)); } catch { /* ignore */ }
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const remaining = MAX_PHOTOS - photos.length;
    const toProcess = Array.from(files).slice(0, remaining);
    const newPhotos: Photo[] = [];
    for (const file of toProcess) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const dataUrl = await compressImage(file);
        newPhotos.push({ id: crypto.randomUUID(), dataUrl, name: file.name });
      } catch { /* skip bad file */ }
    }
    if (newPhotos.length > 0) persist([...photos, ...newPhotos]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removePhoto(id: string) {
    persist(photos.filter((p) => p.id !== id));
    if (lightbox !== null) setLightbox(null);
  }

  function lightboxNav(dir: 1 | -1) {
    if (lightbox === null) return;
    const next = (lightbox + dir + photos.length) % photos.length;
    setLightbox(next);
  }

  return (
    <div className="mt-10 pt-8 border-t border-[#E8E0D8]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#C9A89A]">
            {label} Photos
          </p>
          {photos.length > 0 && (
            <p className="font-sans text-xs text-[#8C7B74] mt-0.5">
              {photos.length} of {MAX_PHOTOS} photos
            </p>
          )}
        </div>
        {photos.length < MAX_PHOTOS && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-widest text-[#8C7B74] border border-[#E8E0D8] px-4 py-2 hover:border-[#C9A89A] hover:text-[#C9A89A] transition-colors duration-300 disabled:opacity-50"
          >
            <ImagePlus className="w-3.5 h-3.5" />
            {uploading ? "Adding…" : "Upload"}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {photos.length === 0 ? (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border border-dashed border-[#E8E0D8] py-8 flex flex-col items-center gap-3 hover:border-[#C9A89A] hover:bg-[#FAF7F2] transition-colors duration-300 group disabled:opacity-50"
        >
          <div className="w-9 h-9 border border-[#E8E0D8] flex items-center justify-center text-[#C9A89A] group-hover:border-[#C9A89A] transition-colors duration-300">
            <ImagePlus className="w-4 h-4" />
          </div>
          <p className="font-sans text-xs text-[#8C7B74]">
            {uploading ? "Processing…" : "Upload inspiration photos"}
          </p>
        </button>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <AnimatePresence mode="popLayout">
            {photos.map((photo, idx) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.25 }}
                className="relative aspect-square group"
              >
                <img
                  src={photo.dataUrl}
                  alt={photo.name}
                  className="w-full h-full object-cover cursor-pointer border border-[#E8E0D8]"
                  onClick={() => setLightbox(idx)}
                />
                <div className="absolute inset-0 bg-[#2C1810]/0 group-hover:bg-[#2C1810]/20 transition-colors duration-200 flex items-center justify-center gap-1">
                  <button
                    onClick={() => setLightbox(idx)}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 bg-white/90 flex items-center justify-center text-[#2C1810] transition-opacity duration-200"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 bg-white/90 flex items-center justify-center text-[#9B4B4B] transition-opacity duration-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <motion.button
                layout
                key="add-more"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="aspect-square border border-dashed border-[#E8E0D8] flex flex-col items-center justify-center gap-1.5 hover:border-[#C9A89A] hover:bg-[#FAF7F2] transition-colors duration-300 disabled:opacity-50"
              >
                <ImagePlus className="w-4 h-4 text-[#C9A89A]" />
                <span className="font-sans text-[9px] uppercase tracking-widest text-[#8C7B74]">Add</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && photos[lightbox] && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#2C1810]/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); lightboxNav(-1); }}
              className="absolute left-4 md:left-8 w-10 h-10 border border-white/30 flex items-center justify-center text-white hover:border-white/70 transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <motion.img
              key={photos[lightbox].id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              src={photos[lightbox].dataUrl}
              alt={photos[lightbox].name}
              className="max-h-[85vh] max-w-[85vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => { e.stopPropagation(); lightboxNav(1); }}
              className="absolute right-4 md:right-8 w-10 h-10 border border-white/30 flex items-center justify-center text-white hover:border-white/70 transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute top-4 right-4 flex items-center gap-3">
              <span className="font-sans text-[11px] uppercase tracking-widest text-white/50">
                {lightbox + 1} / {photos.length}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); removePhoto(photos[lightbox].id); }}
                className="w-9 h-9 border border-white/30 flex items-center justify-center text-white/70 hover:border-red-400/60 hover:text-red-400 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLightbox(null)}
                className="w-9 h-9 border border-white/30 flex items-center justify-center text-white hover:border-white/70 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
