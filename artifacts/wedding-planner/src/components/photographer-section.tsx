import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Camera,
  Globe,
  Phone,
  Mail,
  User,
  FileText,
  CheckCircle,
  Pencil,
  ExternalLink,
  Link,
} from "lucide-react";
import { SectionAccordion } from "./section-accordion";
import { InspirationPhotos } from "./inspiration-photos";

const schema = z.object({
  name: z.string().min(1, "Photographer name is required"),
  website: z.string().optional().refine((v) => !v || /^https?:\/\/.+/.test(v), { message: "Must start with http:// or https://" }),
  portfolio: z.string().optional().refine((v) => !v || /^https?:\/\/.+/.test(v), { message: "Must start with http:// or https://" }),
  shootStyle: z.string().optional(),
  hours: z.string().optional(),
  secondShooter: z.string().optional(),
  mustHaveShots: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().optional().refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), { message: "Invalid email" }),
  contactPhone: z.string().optional(),
  deliveryTimeline: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
const STORAGE_KEY = "amore_vendor_photographer";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">{children}</label>;
}

function FieldInput({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <div>
      <input {...props} className={`w-full bg-transparent border-b ${error ? "border-destructive" : "border-border"} py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-secondary transition-colors duration-300`} />
      {error && <p className="mt-1 text-[11px] text-destructive font-sans">{error}</p>}
    </div>
  );
}

function FieldTextarea({ error, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <div>
      <textarea {...props} rows={3} className={`w-full bg-transparent border-b ${error ? "border-destructive" : "border-border"} py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-secondary transition-colors duration-300 resize-none`} />
      {error && <p className="mt-1 text-[11px] text-destructive font-sans">{error}</p>}
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-secondary mb-6">{children}</p>;
}

function SavedCard({ data, onEdit }: { data: FormData; onEdit: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative border border-secondary/30 bg-card p-10 md:p-14"
      data-testid="photographer-saved-card"
    >
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-center gap-3 text-secondary">
          <CheckCircle className="w-5 h-5 stroke-[1.5]" />
          <span className="font-sans text-xs uppercase tracking-[0.2em]">Photographer Saved</span>
        </div>
        <button onClick={onEdit} data-testid="button-edit-photographer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 font-sans text-xs uppercase tracking-widest">
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
      </div>

      <h3 className="font-serif text-4xl md:text-5xl text-foreground mb-8">{data.name}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {data.website && (
          <div className="flex gap-4">
            <Globe className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Website</p>
              <a href={data.website} target="_blank" rel="noopener noreferrer" data-testid="link-photographer-website" className="font-sans text-sm text-secondary hover:underline underline-offset-4 flex items-center gap-1.5">
                {data.website.replace(/^https?:\/\//, "")} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
        {data.portfolio && (
          <div className="flex gap-4">
            <Link className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Portfolio</p>
              <a href={data.portfolio} target="_blank" rel="noopener noreferrer" data-testid="link-photographer-portfolio" className="font-sans text-sm text-secondary hover:underline underline-offset-4 flex items-center gap-1.5">
                View Portfolio <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
        {data.shootStyle && (
          <div className="flex gap-4">
            <Camera className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Shoot Style</p>
              <p className="font-sans text-sm text-foreground">{data.shootStyle}</p>
            </div>
          </div>
        )}
        {data.hours && (
          <div className="flex gap-4">
            <FileText className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Hours / Coverage</p>
              <p className="font-sans text-sm text-foreground">{data.hours}</p>
            </div>
          </div>
        )}
        {data.contactName && (
          <div className="flex gap-4">
            <User className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Contact</p>
              <p className="font-sans text-sm text-foreground">{data.contactName}</p>
            </div>
          </div>
        )}
        {data.contactEmail && (
          <div className="flex gap-4">
            <Mail className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Email</p>
              <a href={`mailto:${data.contactEmail}`} data-testid="link-photographer-email" className="font-sans text-sm text-secondary hover:underline underline-offset-4">{data.contactEmail}</a>
            </div>
          </div>
        )}
        {data.contactPhone && (
          <div className="flex gap-4">
            <Phone className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Phone</p>
              <a href={`tel:${data.contactPhone}`} data-testid="link-photographer-phone" className="font-sans text-sm text-secondary hover:underline underline-offset-4">{data.contactPhone}</a>
            </div>
          </div>
        )}
        {data.deliveryTimeline && (
          <div className="flex gap-4">
            <FileText className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Delivery Timeline</p>
              <p className="font-sans text-sm text-foreground">{data.deliveryTimeline}</p>
            </div>
          </div>
        )}
      </div>

      {data.mustHaveShots && (
        <div className="pt-6 border-t border-border flex gap-4">
          <Camera className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Must-Have Shots</p>
            <p className="font-sans text-sm text-foreground leading-relaxed whitespace-pre-wrap">{data.mustHaveShots}</p>
          </div>
        </div>
      )}

      {data.notes && (
        <div className="pt-6 border-t border-border flex gap-4 mt-4">
          <FileText className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Notes</p>
            <p className="font-sans text-sm text-foreground leading-relaxed whitespace-pre-wrap">{data.notes}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function PhotographerSection() {
  const [saved, setSaved] = useState<FormData | null>(null);
  const [editing, setEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { const p = JSON.parse(stored) as FormData; setSaved(p); reset(p); } catch { /* ignore */ }
    }
  }, [reset]);

  const onSubmit = (data: FormData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaved(data);
    setEditing(false);
  };

  const showForm = !saved || editing;

  return (
    <SectionAccordion
      id="photographer"
      label="Your Photographer"
      title="The artist who captures"
      italicWord="forever."
      index="03 — Photography"
      subtitle="Store your photographer's details, style preferences, and must-have shot list — all in one place."
      icon={<Camera className="w-4 h-4" />}
      storageKey={STORAGE_KEY}
      bgClass="bg-background"
    >
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {saved && !editing ? (
            <SavedCard key="saved" data={saved} onEdit={() => setEditing(true)} />
          ) : (
            <motion.form key="form" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleSubmit(onSubmit)} className="border border-border bg-card p-10 md:p-14 space-y-12" data-testid="form-photographer">

              <div>
                <GroupLabel>Photographer Details</GroupLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><Label>Photographer / Studio Name *</Label><FieldInput {...register("name")} placeholder="McBeth Photography" error={errors.name?.message} data-testid="input-photographer-name" /></div>
                  <div><Label>Website</Label><FieldInput {...register("website")} placeholder="https://..." error={errors.website?.message} data-testid="input-photographer-website" /></div>
                </div>
                <div className="mt-8"><Label>Portfolio / Instagram</Label><FieldInput {...register("portfolio")} placeholder="https://instagram.com/..." error={errors.portfolio?.message} data-testid="input-photographer-portfolio" /></div>
              </div>

              <div>
                <GroupLabel>Coverage & Style</GroupLabel>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div><Label>Shoot Style</Label><FieldInput {...register("shootStyle")} placeholder="Editorial, documentary, fine-art..." data-testid="input-photographer-style" /></div>
                  <div><Label>Hours Booked</Label><FieldInput {...register("hours")} placeholder="8 hours, 2 shooters" data-testid="input-photographer-hours" /></div>
                  <div><Label>Second Shooter</Label><FieldInput {...register("secondShooter")} placeholder="Yes — included" data-testid="input-photographer-second-shooter" /></div>
                </div>
                <div className="mt-8"><Label>Must-Have Shots</Label>
                  <FieldTextarea {...register("mustHaveShots")} placeholder="First look, ring close-up, parents' reaction, full bridal party, sunset portraits..." data-testid="textarea-photographer-must-have" />
                </div>
              </div>

              <div>
                <GroupLabel>Delivery</GroupLabel>
                <div><Label>Photo Delivery Timeline</Label><FieldInput {...register("deliveryTimeline")} placeholder="6–8 weeks, online gallery link" data-testid="input-photographer-delivery" /></div>
              </div>

              <div>
                <GroupLabel>Contact</GroupLabel>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div><Label>Contact Name</Label><FieldInput {...register("contactName")} placeholder="McBeth" data-testid="input-photographer-contact-name" /></div>
                  <div><Label>Email</Label><FieldInput {...register("contactEmail")} type="email" placeholder="email@example.com" error={errors.contactEmail?.message} data-testid="input-photographer-email" /></div>
                  <div><Label>Phone</Label><FieldInput {...register("contactPhone")} type="tel" placeholder="+1 (555) 000-0000" data-testid="input-photographer-phone" /></div>
                </div>
              </div>

              <div>
                <GroupLabel>Additional Notes</GroupLabel>
                <FieldTextarea {...register("notes")} placeholder="Timeline, getting-ready location, specific moments, Pinterest board link..." data-testid="textarea-photographer-notes" />
              </div>

              <div className="flex items-center gap-6 pt-4">
                <button type="submit" data-testid="button-save-photographer" className="bg-foreground text-background px-10 py-4 font-sans uppercase tracking-widest text-xs hover:bg-secondary transition-colors duration-500">
                  Save Photographer
                </button>
                {editing && saved && (
                  <button type="button" onClick={() => setEditing(false)} data-testid="button-cancel-photographer" className="font-sans text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-300">
                    Cancel
                  </button>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        <InspirationPhotos storageKey="photographer" label="Photography Style" />
      </div>
    </SectionAccordion>
  );
}
