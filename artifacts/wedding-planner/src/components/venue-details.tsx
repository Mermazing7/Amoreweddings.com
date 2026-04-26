import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Globe, Phone, Mail, User, FileText, CheckCircle, Pencil, ExternalLink } from "lucide-react";
import { SectionAccordion } from "./section-accordion";
import { InspirationPhotos } from "./inspiration-photos";

const venueSchema = z.object({
  name: z.string().min(1, "Venue name is required"),
  website: z
    .string()
    .optional()
    .refine((val) => !val || val === "" || /^https?:\/\/.+/.test(val), {
      message: "Please enter a valid URL starting with http:// or https://",
    }),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  contactName: z.string().optional(),
  contactEmail: z
    .string()
    .optional()
    .refine((val) => !val || val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Please enter a valid email address",
    }),
  contactPhone: z.string().optional(),
  notes: z.string().optional(),
});

type VenueFormData = z.infer<typeof venueSchema>;

const STORAGE_KEY = "amore_venue_details";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
      {children}
    </label>
  );
}

function InputField({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <div>
      <input
        {...props}
        className={`w-full bg-transparent border-b ${
          error ? "border-destructive" : "border-border"
        } py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary transition-colors duration-300`}
      />
      {error && (
        <p className="mt-1 text-[11px] font-sans text-destructive">{error}</p>
      )}
    </div>
  );
}

function TextareaField({
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
        } py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary transition-colors duration-300 resize-none`}
      />
      {error && (
        <p className="mt-1 text-[11px] font-sans text-destructive">{error}</p>
      )}
    </div>
  );
}

function SavedCard({
  data,
  onEdit,
}: {
  data: VenueFormData;
  onEdit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative border border-secondary/30 bg-card p-10 md:p-14"
      data-testid="venue-saved-card"
    >
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-center gap-3 text-secondary">
          <CheckCircle className="w-5 h-5 stroke-[1.5]" />
          <span className="font-sans text-xs uppercase tracking-[0.2em]">Venue Saved</span>
        </div>
        <button
          onClick={onEdit}
          data-testid="button-edit-venue"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 font-sans text-xs uppercase tracking-widest"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>

      <h3 className="font-serif text-4xl md:text-5xl text-foreground mb-8">{data.name}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {(data.address || data.city || data.state) && (
            <div className="flex gap-4">
              <MapPin className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Address</p>
                <p className="font-sans text-sm text-foreground leading-relaxed">
                  {data.address}
                  {data.city || data.state ? (
                    <>
                      <br />
                      {[data.city, data.state].filter(Boolean).join(", ")}
                    </>
                  ) : null}
                </p>
              </div>
            </div>
          )}

          {data.website && (
            <div className="flex gap-4">
              <Globe className="w-4 h-4 text-secondary mt-0.5 shrink-0 stroke-[1.5]" />
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Website</p>
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-venue-website"
                  className="font-sans text-sm text-secondary hover:underline underline-offset-4 flex items-center gap-1.5"
                >
                  {data.website.replace(/^https?:\/\//, "")}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
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
                <a
                  href={`mailto:${data.contactEmail}`}
                  data-testid="link-venue-email"
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
                <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Phone</p>
                <a
                  href={`tel:${data.contactPhone}`}
                  data-testid="link-venue-phone"
                  className="font-sans text-sm text-secondary hover:underline underline-offset-4"
                >
                  {data.contactPhone}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {data.notes && (
        <div className="mt-8 pt-8 border-t border-border flex gap-4">
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

export function VenueDetails() {
  const [saved, setSaved] = useState<VenueFormData | null>(null);
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as VenueFormData;
        setSaved(parsed);
        reset(parsed);
      } catch {
        // ignore corrupt storage
      }
    }
  }, [reset]);

  const onSubmit = (data: VenueFormData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaved(data);
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const showForm = !saved || editing;

  return (
    <SectionAccordion
      id="venue"
      label="Your Venue"
      title="The place where it"
      italicWord="all begins."
      index="01 — Venue"
      subtitle="Save your venue details — address, contacts, and website, all in one beautiful place."
      icon={<MapPin className="w-4 h-4" />}
      storageKey={STORAGE_KEY}
      bgClass="bg-[#FAF7F2]"
    >
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {saved && !editing ? (
            <SavedCard key="saved" data={saved} onEdit={handleEdit} />
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleSubmit(onSubmit)}
              className="border border-border bg-card p-10 md:p-14 space-y-12"
              data-testid="form-venue-details"
            >
              {/* Venue Identity */}
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-secondary mb-8">Venue Identity</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <FieldLabel>Venue Name *</FieldLabel>
                    <InputField
                      {...register("name")}
                      placeholder="The Grand Estate"
                      error={errors.name?.message}
                      data-testid="input-venue-name"
                    />
                  </div>
                  <div>
                    <FieldLabel>Venue Website</FieldLabel>
                    <InputField
                      {...register("website")}
                      placeholder="https://yourvenue.com"
                      type="url"
                      error={errors.website?.message}
                      data-testid="input-venue-website"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-secondary mb-8">Address</p>
                <div className="space-y-8">
                  <div>
                    <FieldLabel>Street Address *</FieldLabel>
                    <InputField
                      {...register("address")}
                      placeholder="123 Garden Lane"
                      error={errors.address?.message}
                      data-testid="input-venue-address"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <FieldLabel>City *</FieldLabel>
                      <InputField
                        {...register("city")}
                        placeholder="Seattle"
                        error={errors.city?.message}
                        data-testid="input-venue-city"
                      />
                    </div>
                    <div>
                      <FieldLabel>State *</FieldLabel>
                      <InputField
                        {...register("state")}
                        placeholder="California"
                        error={errors.state?.message}
                        data-testid="input-venue-state"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-secondary mb-8">Venue Contact</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <FieldLabel>Contact Name</FieldLabel>
                    <InputField
                      {...register("contactName")}
                      placeholder="Name"
                      error={errors.contactName?.message}
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div>
                    <FieldLabel>Contact Email</FieldLabel>
                    <InputField
                      {...register("contactEmail")}
                      placeholder="email@example.com"
                      type="email"
                      error={errors.contactEmail?.message}
                      data-testid="input-contact-email"
                    />
                  </div>
                  <div>
                    <FieldLabel>Contact Phone</FieldLabel>
                    <InputField
                      {...register("contactPhone")}
                      placeholder="+1 (415) 000-0000"
                      type="tel"
                      error={errors.contactPhone?.message}
                      data-testid="input-contact-phone"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-secondary mb-8">Additional Notes</p>
                <div>
                  <FieldLabel>Notes & Details</FieldLabel>
                  <TextareaField
                    {...register("notes")}
                    placeholder="Parking info, access codes, setup hours, any special requirements..."
                    error={errors.notes?.message}
                    data-testid="textarea-venue-notes"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="button-save-venue"
                  className="bg-foreground text-background px-10 py-4 font-sans uppercase tracking-widest text-xs hover:bg-secondary transition-colors duration-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Venue"}
                </button>
                {editing && saved && (
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    data-testid="button-cancel-edit"
                    className="font-sans text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        <InspirationPhotos storageKey="venue" label="Venue" />
      </div>
    </SectionAccordion>
  );
}
