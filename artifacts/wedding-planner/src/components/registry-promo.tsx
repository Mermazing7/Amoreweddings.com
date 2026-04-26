import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, X, Upload } from "lucide-react";

const STORAGE_KEY = "amore_invitation_uploads";
const MAX_PHOTOS = 3;
const MAX_WIDTH = 1200;
const QUALITY = 0.82;

interface InvitationPhoto { id: string; src: string }

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

function InvitationUpload() {
  const [photos, setPhotos] = useState<InvitationPhoto[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE_KEY); if (r) setPhotos(JSON.parse(r)); } catch { /**/ }
  }, []);

  function persist(p: InvitationPhoto[]) {
    setPhotos(p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }

  async function processFiles(files: File[]) {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    const slots = MAX_PHOTOS - photos.length;
    const toProcess = imageFiles.slice(0, slots);
    const compressed = await Promise.all(toProcess.map(compressImage));
    persist([...photos, ...compressed.map((src) => ({ id: crypto.randomUUID(), src }))]);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  }

  function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) processFiles(Array.from(e.target.files));
    e.target.value = "";
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#C9A89A]">Your Invitation Design</p>
        {photos.length > 0 && photos.length < MAX_PHOTOS && (
          <button
            onClick={() => inputRef.current?.click()}
            className="font-sans text-[10px] uppercase tracking-widest text-[#8C7B74] hover:text-[#C9A89A] transition-colors duration-200 flex items-center gap-1.5"
          >
            <ImagePlus className="w-3 h-3" /> Add more
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onInput} />

      <AnimatePresence mode="wait">
        {photos.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-3 py-10 transition-all duration-300 ${
              dragging ? "border-[#C9A89A] bg-[#C9A89A]/5" : "border-[#E8E0D8] hover:border-[#C9A89A]/60"
            }`}
          >
            <div className="w-10 h-10 border border-[#E8E0D8] flex items-center justify-center text-[#C9A89A]">
              <Upload className="w-4 h-4" />
            </div>
            <div className="text-center">
              <p className="font-sans text-sm text-[#2C1810]">Upload your invitation design</p>
              <p className="font-sans text-xs text-[#8C7B74] mt-1">Drop images here or tap to browse · Up to {MAX_PHOTOS} photos</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`grid gap-2 ${photos.length === 1 ? "grid-cols-1" : photos.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            {photos.map((photo) => (
              <div key={photo.id} className="relative group aspect-[3/4] overflow-hidden border border-[#E8E0D8]/60">
                <img src={photo.src} alt="Invitation" className="w-full h-full object-cover" />
                <button
                  onClick={() => persist(photos.filter((p) => p.id !== photo.id))}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <button
                onClick={() => inputRef.current?.click()}
                className="aspect-[3/4] border-2 border-dashed border-[#E8E0D8] flex items-center justify-center text-[#8C7B74] hover:border-[#C9A89A] hover:text-[#C9A89A] transition-colors duration-200"
              >
                <ImagePlus className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function RegistryPromo() {
  return (
    <section className="py-16 md:py-24 px-8 md:px-12 overflow-hidden bg-background" id="registry">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-16 md:gap-24">

        {/* Invitation photo — no people, flat lay */}
        <div className="md:w-1/2 relative w-full shrink-0">
          <motion.div
            initial={{ opacity: 0, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
            whileInView={{ opacity: 1, clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-[60vh] md:h-[75vh]"
          >
            <img
              src="/images/ceremony.png"
              alt="Romantic outdoor wedding ceremony with floral arch"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Text + upload */}
        <div className="md:w-1/2 space-y-8 md:pt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <span className="block font-sans text-[10px] uppercase tracking-[0.28em] text-[#C9A89A] mb-6">Guest Experience</span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-[1.05]">
              Invitations &amp; Websites<br />
              <span className="italic text-[#8C7B74]">worthy of the occasion.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-sans text-muted-foreground leading-relaxed"
          >
            Your wedding website is the first glimpse guests have into your celebration. Collect RSVPs, share travel details, and host your unified registry — all in one flawless interface that pairs beautifully with your physical stationery.
          </motion.p>

          {/* Upload */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <InvitationUpload />
          </motion.div>

        </div>

      </div>
    </section>
  );
}
