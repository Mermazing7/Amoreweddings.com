import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Music,
  Globe,
  Phone,
  Mail,
  User,
  FileText,
  CheckCircle,
  Pencil,
  ExternalLink,
} from "lucide-react";
import { SectionAccordion } from "./section-accordion";
import { InspirationPhotos } from "./inspiration-photos";

const schema = z.object({
  name: z.string().min(1, "DJ name is required"),
  website: z
    .string()
    .optional()
    .refine((v) => !v || /^https?:\/\/.+/.test(v), {
      message: "Must start with http:// or https://",
    }),
  genrePreferences: z.string().optional(),
  cocktailHourStyle: z.string().optional(),
  receptionStyle: z.string().optional(),
  equipment: z.string().optional(),
  setupTime: z.string().optional(),
  hoursBooked: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z
    .string()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Invalid email",
    }),
  contactPhone: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
const STORAGE_KEY = "amore_vendor_music";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
      {children}
    </label>
  );
}

function FieldInput({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <div>
      <input
        {...props}
        className={`w-full bg-transparent border-b ${
          error ? "border-destructive" : "border-border"
        } py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-secondary transition-colors duration-300`}
      />
      {error && (
        <p className="mt-1 text-[11px] text-destructive font-sans">{error}</p>
      )}
    </div>
  );
}

function FieldTextarea({
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <div>
      <textarea
        {...props}
        rows={3}
        className={`w-full bg-transparent border-b ${
          error ? "border-destructive" : "border-border"
        } py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-secondary transition-colors duration-300 resize-none`}
      />
      {error && (
        <p className="mt-1 text-[11px] text-destructive font-sans">{error}</p>
      )}
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-secondary mb-6">
      {children}
    </p>
  );
}

function SavedCard({ data, onEdit }: { data: FormData; onEdit: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative border border-secondary/30 bg-card p-10 md:p-14"
      data-testid="music-saved-card"
    >
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-center gap-3 text-secondary">
          <CheckCircle className="w-5 h-5 stroke-[1.5]" />
          <span className="font-sans text-xs uppercase tracking-[0.2em]">
            DJ Saved
          </span>
        </div>
        <button
          onClick={onEdit}
          data-testid="button-edit-music"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 font-sans text-xs uppercase tracking-widest"
        >
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
      </div>

      <h3 className="font-serif text-4xl md:text-5xl text-foreground mb-10">
        {data.name}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.website && (
          <div className="flex gap-4">
            <Globe className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                Website
              </p>
              <a
                href={data.website}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-music-website"
                className="font-sans text-sm text-secondary hover:underline underline-offset-4 flex items-center gap-1.5"
              >
                {data.website.replace(/^https?:\/\//, "")}{" "}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
        {data.genrePreferences && (
          <div className="flex gap-4">
            <Music className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                Genre Preferences
              </p>
              <p className="font-sans text-sm text-foreground">
                {data.genrePreferences}
              </p>
            </div>
          </div>
        )}
        {data.cocktailHourStyle && (
          <div className="flex gap-4">
            <Music className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                Cocktail Hour
              </p>
              <p className="font-sans text-sm text-foreground">
                {data.cocktailHourStyle}
              </p>
            </div>
          </div>
        )}
        {data.receptionStyle && (
          <div className="flex gap-4">
            <Music className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                Reception Style
              </p>
              <p className="font-sans text-sm text-foreground">
                {data.receptionStyle}
              </p>
            </div>
          </div>
        )}
        {data.hoursBooked && (
          <div className="flex gap-4">
            <FileText className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                Hours Booked
              </p>
              <p className="font-sans text-sm text-foreground">
                {data.hoursBooked}
              </p>
            </div>
          </div>
        )}
        {data.setupTime && (
          <div className="flex gap-4">
            <FileText className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                Setup Time
              </p>
              <p className="font-sans text-sm text-foreground">
                {data.setupTime}
              </p>
            </div>
          </div>
        )}
        {data.equipment && (
          <div className="flex gap-4">
            <FileText className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                Equipment
              </p>
              <p className="font-sans text-sm text-foreground">
                {data.equipment}
              </p>
            </div>
          </div>
        )}
        {data.contactName && (
          <div className="flex gap-4">
            <User className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                Contact
              </p>
              <p className="font-sans text-sm text-foreground">
                {data.contactName}
              </p>
            </div>
          </div>
        )}
        {data.contactEmail && (
          <div className="flex gap-4">
            <Mail className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                Email
              </p>
              <a
                href={`mailto:${data.contactEmail}`}
                data-testid="link-music-email"
                className="font-sans text-sm text-secondary hover:underline underline-offset-4"
              >
                {data.contactEmail}
              </a>
            </div>
          </div>
        )}
        {data.contactPhone && (
          <div className="flex gap-4">
            <Phone className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                Phone
              </p>
              <a
                href={`tel:${data.contactPhone}`}
                data-testid="link-music-phone"
                className="font-sans text-sm text-secondary hover:underline underline-offset-4"
              >
                {data.contactPhone}
              </a>
            </div>
          </div>
        )}
      </div>

      {data.notes && (
        <div className="mt-8 pt-8 border-t border-border flex gap-4">
          <FileText className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
              Notes
            </p>
            <p className="font-sans text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {data.notes}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function MusicSection() {
  const [saved, setSaved] = useState<FormData | null>(null);
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const p = JSON.parse(stored) as FormData;
        setSaved(p);
        reset(p);
      } catch {
        /* ignore */
      }
    }
  }, [reset]);

  const onSubmit = (data: FormData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaved(data);
    setEditing(false);
  };

  return (
    <SectionAccordion
      id="music"
      label="Your DJ"
      title="The soundtrack to"
      italicWord="your love story."
      index="04 — Music"
      subtitle="Store your DJ's details, coverage hours, and vibe preferences in one elegant place."
      icon={<Music className="w-4 h-4" />}
      storageKey={STORAGE_KEY}
      bgClass="bg-[#FAF7F2]"
    >
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {saved && !editing ? (
            <SavedCard
              key="saved"
              data={saved}
              onEdit={() => setEditing(true)}
            />
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleSubmit(onSubmit)}
              className="border border-border bg-card p-10 md:p-14 space-y-12"
              data-testid="form-music"
            >
              <div>
                <GroupLabel>DJ Details</GroupLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Label>DJ Name / Company *</Label>
                    <FieldInput
                      {...register("name")}
                      placeholder="DJ name"
                      error={errors.name?.message}
                      data-testid="input-music-name"
                    />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <FieldInput
                      {...register("website")}
                      placeholder="https://..."
                      error={errors.website?.message}
                      data-testid="input-music-website"
                    />
                  </div>
                </div>
              </div>

              <div>
                <GroupLabel>Music Style</GroupLabel>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <Label>Genre Preferences</Label>
                    <FieldInput
                      {...register("genrePreferences")}
                      placeholder="80s, R&B, Top 40, Motown..."
                      data-testid="input-music-genres"
                    />
                  </div>
                  <div>
                    <Label>Cocktail Hour Vibe</Label>
                    <FieldInput
                      {...register("cocktailHourStyle")}
                      placeholder="Jazz, acoustic, lounge..."
                      data-testid="input-music-cocktail"
                    />
                  </div>
                  <div>
                    <Label>Reception Style</Label>
                    <FieldInput
                      {...register("receptionStyle")}
                      placeholder="High-energy dance floor, laid-back..."
                      data-testid="input-music-reception-style"
                    />
                  </div>
                </div>
              </div>

              <div>
                <GroupLabel>Logistics</GroupLabel>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <Label>Hours Booked</Label>
                    <FieldInput
                      {...register("hoursBooked")}
                      placeholder="6 hours"
                      data-testid="input-music-hours"
                    />
                  </div>
                  <div>
                    <Label>Setup / Sound Check Time</Label>
                    <FieldInput
                      {...register("setupTime")}
                      placeholder="2 hours before ceremony"
                      data-testid="input-music-setup-time"
                    />
                  </div>
                  <div>
                    <Label>Equipment / AV Notes</Label>
                    <FieldInput
                      {...register("equipment")}
                      placeholder="Venue provides PA, DJ brings lights..."
                      data-testid="input-music-equipment"
                    />
                  </div>
                </div>
              </div>

              <div>
                <GroupLabel>Contact</GroupLabel>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <Label>Contact Name</Label>
                    <FieldInput
                      {...register("contactName")}
                      placeholder="Name"
                      data-testid="input-music-contact-name"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <FieldInput
                      {...register("contactEmail")}
                      type="email"
                      placeholder="email@example.com"
                      error={errors.contactEmail?.message}
                      data-testid="input-music-email"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <FieldInput
                      {...register("contactPhone")}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      data-testid="input-music-phone"
                    />
                  </div>
                </div>
              </div>

              <div>
                <GroupLabel>Additional Notes</GroupLabel>
                <FieldTextarea
                  {...register("notes")}
                  placeholder="MC duties, announcement scripts, breaks, do-not-play list..."
                  data-testid="textarea-music-notes"
                />
              </div>

              <div className="flex items-center gap-6 pt-4">
                <button
                  type="submit"
                  data-testid="button-save-music"
                  className="bg-foreground text-background px-10 py-4 font-sans uppercase tracking-widest text-xs hover:bg-secondary transition-colors duration-500"
                >
                  Save DJ Details
                </button>
                {editing && saved && (
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    data-testid="button-cancel-music"
                    className="font-sans text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        <InspirationPhotos storageKey="music" label="Music & Vibe" />
      </div>
    </SectionAccordion>
  );
}
