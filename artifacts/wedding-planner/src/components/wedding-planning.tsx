import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Flower2,
  UtensilsCrossed,
  Camera,
  Music,
  Heart,
  Scissors,
  Cake,
  Car,
  ChevronDown,
  CheckCircle,
  Pencil,
  Globe,
  Phone,
  Mail,
  User,
  FileText,
  ExternalLink,
  Sparkles,
  LayoutList,
} from "lucide-react";
import { SectionAccordion } from "./section-accordion";
import { InspirationPhotos } from "./inspiration-photos";

/* ─── Shared field types ─── */
const baseVendorSchema = z.object({
  name: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine((v) => !v || /^https?:\/\/.+/.test(v), {
      message: "Must start with http:// or https://",
    }),
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

const floristSchema = baseVendorSchema.extend({
  style: z.string().optional(),
  flowers: z.string().optional(),
  deliverables: z.string().optional(),
});

const catererSchema = baseVendorSchema.extend({
  cuisine: z.string().optional(),
  dietaryOptions: z.string().optional(),
  serviceStyle: z.string().optional(),
});

const photographerSchema = baseVendorSchema.extend({
  portfolio: z.string().optional(),
  shootStyle: z.string().optional(),
  hours: z.string().optional(),
});

const videographerSchema = baseVendorSchema.extend({
  portfolio: z.string().optional(),
  deliverables: z.string().optional(),
});

const musicSchema = baseVendorSchema.extend({
  type: z.string().optional(),
  firstDance: z.string().optional(),
  doNotPlay: z.string().optional(),
});

const officiantSchema = baseVendorSchema.extend({
  ceremonyStyle: z.string().optional(),
  rehearsalDate: z.string().optional(),
});

const hairMakeupSchema = baseVendorSchema.extend({
  trialDate: z.string().optional(),
  look: z.string().optional(),
  numberOfPeople: z.string().optional(),
});

const cakeSchema = baseVendorSchema.extend({
  flavors: z.string().optional(),
  tiers: z.string().optional(),
  design: z.string().optional(),
  deliveryDate: z.string().optional(),
});

const transportationSchema = baseVendorSchema.extend({
  vehicleType: z.string().optional(),
  pickupLocations: z.string().optional(),
  dropoffLocations: z.string().optional(),
});

const miscSchema = baseVendorSchema.extend({
  items: z.string().optional(),
  vendor: z.string().optional(),
  budget: z.string().optional(),
  dueDate: z.string().optional(),
});

type FloristData = z.infer<typeof floristSchema>;
type CatererData = z.infer<typeof catererSchema>;
type PhotographerData = z.infer<typeof photographerSchema>;
type VideographerData = z.infer<typeof videographerSchema>;
type MusicData = z.infer<typeof musicSchema>;
type OfficiantData = z.infer<typeof officiantSchema>;
type HairMakeupData = z.infer<typeof hairMakeupSchema>;
type CakeData = z.infer<typeof cakeSchema>;
type TransportationData = z.infer<typeof transportationSchema>;
type MiscData = z.infer<typeof miscSchema>;

type CategoryKey =
  | "florist"
  | "caterer"
  | "photographer"
  | "videographer"
  | "music"
  | "officiant"
  | "hairMakeup"
  | "cake"
  | "transportation"
  | "misc";

const STORAGE_PREFIX = "amore_vendor_";

/* ─── Shared field components ─── */
function FieldLabel({ children }: { children: React.ReactNode }) {
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
        } py-2.5 font-sans text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-secondary transition-colors duration-300`}
      />
      {error && <p className="mt-1 text-[11px] text-destructive font-sans">{error}</p>}
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
        rows={2}
        className={`w-full bg-transparent border-b ${
          error ? "border-destructive" : "border-border"
        } py-2.5 font-sans text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-secondary transition-colors duration-300 resize-none`}
      />
      {error && <p className="mt-1 text-[11px] text-destructive font-sans">{error}</p>}
    </div>
  );
}

/* ─── Section label ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-secondary mb-6 mt-8 first:mt-0">
      {children}
    </p>
  );
}

/* ─── Saved summary row ─── */
function SavedRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="text-secondary mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">{label}</p>
        {href ? (
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="font-sans text-sm text-secondary hover:underline underline-offset-4 flex items-center gap-1"
          >
            {value}
            {href.startsWith("http") && <ExternalLink className="w-3 h-3" />}
          </a>
        ) : (
          <p className="font-sans text-sm text-foreground">{value}</p>
        )}
      </div>
    </div>
  );
}

/* ─── Category config ─── */
const categories: {
  key: CategoryKey;
  label: string;
  icon: React.ReactNode;
  tagline: string;
}[] = [
  {
    key: "florist",
    label: "Florist",
    icon: <Flower2 className="w-5 h-5 stroke-[1.5]" />,
    tagline: "Flowers, arrangements & floral design",
  },
  {
    key: "caterer",
    label: "Caterer",
    icon: <UtensilsCrossed className="w-5 h-5 stroke-[1.5]" />,
    tagline: "Food, drink & service style",
  },
  {
    key: "videographer",
    label: "Videographer",
    icon: <Sparkles className="w-5 h-5 stroke-[1.5]" />,
    tagline: "Film, edits & final deliverables",
  },
  {
    key: "officiant",
    label: "Officiant",
    icon: <Heart className="w-5 h-5 stroke-[1.5]" />,
    tagline: "Ceremony style & vow details",
  },
  {
    key: "hairMakeup",
    label: "Hair & Makeup",
    icon: <Scissors className="w-5 h-5 stroke-[1.5]" />,
    tagline: "Artists, trial date & look inspiration",
  },
  {
    key: "cake",
    label: "Cake & Baker",
    icon: <Cake className="w-5 h-5 stroke-[1.5]" />,
    tagline: "Flavors, tiers & cake design",
  },
  {
    key: "transportation",
    label: "Transportation",
    icon: <Car className="w-5 h-5 stroke-[1.5]" />,
    tagline: "Vehicles, routes & pickup details",
  },
  {
    key: "misc",
    label: "Miscellaneous",
    icon: <LayoutList className="w-5 h-5 stroke-[1.5]" />,
    tagline: "Favours, signage, décor details & everything else",
  },
];

/* ─── Individual form renderers ─── */

function FloristForm({
  onSave,
  initial,
  onCancel,
}: {
  onSave: (d: FloristData) => void;
  initial?: FloristData;
  onCancel: () => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<FloristData>({
    resolver: zodResolver(floristSchema),
    defaultValues: initial,
  });
  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <SectionLabel>Florist Details</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><FieldLabel>Florist / Studio Name</FieldLabel><FieldInput {...register("name")} placeholder="Florist or studio" data-testid="input-florist-name" /></div>
        <div><FieldLabel>Website</FieldLabel><FieldInput {...register("website")} placeholder="https://..." error={errors.website?.message} data-testid="input-florist-website" /></div>
      </div>
      <SectionLabel>Floral Vision</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><FieldLabel>Style / Aesthetic</FieldLabel><FieldInput {...register("style")} placeholder="Garden-romantic, lush, wild" data-testid="input-florist-style" /></div>
        <div><FieldLabel>Favourite Flowers</FieldLabel><FieldInput {...register("flowers")} placeholder="Peonies, garden roses, ranunculus" data-testid="input-florist-flowers" /></div>
      </div>
      <div><FieldLabel>Deliverables (bouquets, centrepieces, arch...)</FieldLabel><FieldTextarea {...register("deliverables")} placeholder="Bridal bouquet, 10 centrepieces, ceremony arch, buttonholes x8" data-testid="textarea-florist-deliverables" /></div>
      <SectionLabel>Contact</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><FieldLabel>Contact Name</FieldLabel><FieldInput {...register("contactName")} placeholder="Name" data-testid="input-florist-contact-name" /></div>
        <div><FieldLabel>Email</FieldLabel><FieldInput {...register("contactEmail")} type="email" placeholder="email@example.com" error={errors.contactEmail?.message} data-testid="input-florist-email" /></div>
        <div><FieldLabel>Phone</FieldLabel><FieldInput {...register("contactPhone")} type="tel" placeholder="+1 (555) 000-0000" data-testid="input-florist-phone" /></div>
      </div>
      <div><FieldLabel>Notes</FieldLabel><FieldTextarea {...register("notes")} placeholder="Delivery time, setup instructions, colour palette..." data-testid="textarea-florist-notes" /></div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}

function CatererForm({ onSave, initial, onCancel }: { onSave: (d: CatererData) => void; initial?: CatererData; onCancel: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<CatererData>({ resolver: zodResolver(catererSchema), defaultValues: initial });
  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <SectionLabel>Caterer Details</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><FieldLabel>Caterer / Company Name</FieldLabel><FieldInput {...register("name")} placeholder="Caterer or company" data-testid="input-caterer-name" /></div>
        <div><FieldLabel>Website</FieldLabel><FieldInput {...register("website")} placeholder="https://..." error={errors.website?.message} data-testid="input-caterer-website" /></div>
      </div>
      <SectionLabel>Food & Service</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><FieldLabel>Cuisine Style</FieldLabel><FieldInput {...register("cuisine")} placeholder="French-Mediterranean" data-testid="input-caterer-cuisine" /></div>
        <div><FieldLabel>Service Style</FieldLabel><FieldInput {...register("serviceStyle")} placeholder="Plated, buffet, family-style..." data-testid="input-caterer-service-style" /></div>
        <div><FieldLabel>Dietary Options</FieldLabel><FieldInput {...register("dietaryOptions")} placeholder="Vegan, gluten-free, nut-free..." data-testid="input-caterer-dietary" /></div>
      </div>
      <SectionLabel>Contact</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><FieldLabel>Contact Name</FieldLabel><FieldInput {...register("contactName")} placeholder="Name" data-testid="input-caterer-contact-name" /></div>
        <div><FieldLabel>Email</FieldLabel><FieldInput {...register("contactEmail")} type="email" error={errors.contactEmail?.message} data-testid="input-caterer-email" /></div>
        <div><FieldLabel>Phone</FieldLabel><FieldInput {...register("contactPhone")} type="tel" data-testid="input-caterer-phone" /></div>
      </div>
      <div><FieldLabel>Notes</FieldLabel><FieldTextarea {...register("notes")} placeholder="Tasting date, special requests, service timeline..." data-testid="textarea-caterer-notes" /></div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}

function PhotographerForm({ onSave, initial, onCancel }: { onSave: (d: PhotographerData) => void; initial?: PhotographerData; onCancel: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<PhotographerData>({ resolver: zodResolver(photographerSchema), defaultValues: initial });
  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <SectionLabel>Photographer Details</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><FieldLabel>Photographer Name / Studio</FieldLabel><FieldInput {...register("name")} placeholder="McBeth Photography" data-testid="input-photographer-name" /></div>
        <div><FieldLabel>Website</FieldLabel><FieldInput {...register("website")} placeholder="https://..." error={errors.website?.message} data-testid="input-photographer-website" /></div>
      </div>
      <div><FieldLabel>Portfolio / Instagram</FieldLabel><FieldInput {...register("portfolio")} placeholder="https://instagram.com/..." data-testid="input-photographer-portfolio" /></div>
      <SectionLabel>Coverage</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><FieldLabel>Shoot Style</FieldLabel><FieldInput {...register("shootStyle")} placeholder="Editorial, documentary, fine-art..." data-testid="input-photographer-style" /></div>
        <div><FieldLabel>Hours Booked</FieldLabel><FieldInput {...register("hours")} placeholder="8 hours, 2 photographers" data-testid="input-photographer-hours" /></div>
      </div>
      <SectionLabel>Contact</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><FieldLabel>Contact Name</FieldLabel><FieldInput {...register("contactName")} data-testid="input-photographer-contact-name" /></div>
        <div><FieldLabel>Email</FieldLabel><FieldInput {...register("contactEmail")} type="email" error={errors.contactEmail?.message} data-testid="input-photographer-email" /></div>
        <div><FieldLabel>Phone</FieldLabel><FieldInput {...register("contactPhone")} type="tel" data-testid="input-photographer-phone" /></div>
      </div>
      <div><FieldLabel>Notes</FieldLabel><FieldTextarea {...register("notes")} placeholder="Must-have shots, timeline, second shooter details..." data-testid="textarea-photographer-notes" /></div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}

function VideographerForm({ onSave, initial, onCancel }: { onSave: (d: VideographerData) => void; initial?: VideographerData; onCancel: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<VideographerData>({ resolver: zodResolver(videographerSchema), defaultValues: initial });
  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <SectionLabel>Videographer Details</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><FieldLabel>Videographer / Studio Name</FieldLabel><FieldInput {...register("name")} placeholder="Videographer or studio" data-testid="input-videographer-name" /></div>
        <div><FieldLabel>Website</FieldLabel><FieldInput {...register("website")} placeholder="https://..." error={errors.website?.message} data-testid="input-videographer-website" /></div>
      </div>
      <div><FieldLabel>Portfolio / Vimeo / YouTube</FieldLabel><FieldInput {...register("portfolio")} placeholder="https://vimeo.com/..." data-testid="input-videographer-portfolio" /></div>
      <div><FieldLabel>Deliverables (highlight reel, full ceremony edit...)</FieldLabel><FieldTextarea {...register("deliverables")} placeholder="3–5 min highlight, full ceremony & speeches, raw footage..." data-testid="textarea-videographer-deliverables" /></div>
      <SectionLabel>Contact</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><FieldLabel>Contact Name</FieldLabel><FieldInput {...register("contactName")} data-testid="input-videographer-contact-name" /></div>
        <div><FieldLabel>Email</FieldLabel><FieldInput {...register("contactEmail")} type="email" error={errors.contactEmail?.message} data-testid="input-videographer-email" /></div>
        <div><FieldLabel>Phone</FieldLabel><FieldInput {...register("contactPhone")} type="tel" data-testid="input-videographer-phone" /></div>
      </div>
      <div><FieldLabel>Notes</FieldLabel><FieldTextarea {...register("notes")} placeholder="Drone footage, delivery timeline, music licensing..." data-testid="textarea-videographer-notes" /></div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}

function MusicForm({ onSave, initial, onCancel }: { onSave: (d: MusicData) => void; initial?: MusicData; onCancel: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<MusicData>({ resolver: zodResolver(musicSchema), defaultValues: initial });
  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <SectionLabel>Music Details</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><FieldLabel>DJ / Band Name</FieldLabel><FieldInput {...register("name")} placeholder="DJ or band name" data-testid="input-music-name" /></div>
        <div><FieldLabel>Website</FieldLabel><FieldInput {...register("website")} placeholder="https://..." error={errors.website?.message} data-testid="input-music-website" /></div>
      </div>
      <SectionLabel>Setlist & Songs</SectionLabel>
      <div><FieldLabel>Type (DJ, live band, string quartet...)</FieldLabel><FieldInput {...register("type")} placeholder="DJ for reception, string quartet for ceremony" data-testid="input-music-type" /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><FieldLabel>First Dance Song</FieldLabel><FieldInput {...register("firstDance")} placeholder="Can't Help Falling in Love" data-testid="input-music-first-dance" /></div>
        <div><FieldLabel>Do Not Play List</FieldLabel><FieldInput {...register("doNotPlay")} placeholder="Any songs to avoid..." data-testid="input-music-do-not-play" /></div>
      </div>
      <SectionLabel>Contact</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><FieldLabel>Contact Name</FieldLabel><FieldInput {...register("contactName")} data-testid="input-music-contact-name" /></div>
        <div><FieldLabel>Email</FieldLabel><FieldInput {...register("contactEmail")} type="email" error={errors.contactEmail?.message} data-testid="input-music-email" /></div>
        <div><FieldLabel>Phone</FieldLabel><FieldInput {...register("contactPhone")} type="tel" data-testid="input-music-phone" /></div>
      </div>
      <div><FieldLabel>Notes</FieldLabel><FieldTextarea {...register("notes")} placeholder="Setup time, equipment needs, cocktail hour music style..." data-testid="textarea-music-notes" /></div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}

function OfficiantForm({ onSave, initial, onCancel }: { onSave: (d: OfficiantData) => void; initial?: OfficiantData; onCancel: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<OfficiantData>({ resolver: zodResolver(officiantSchema), defaultValues: initial });
  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <SectionLabel>Officiant Details</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><FieldLabel>Officiant Name</FieldLabel><FieldInput {...register("name")} placeholder="Name" data-testid="input-officiant-name" /></div>
        <div><FieldLabel>Website</FieldLabel><FieldInput {...register("website")} placeholder="https://..." error={errors.website?.message} data-testid="input-officiant-website" /></div>
      </div>
      <SectionLabel>Ceremony</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><FieldLabel>Ceremony Style</FieldLabel><FieldInput {...register("ceremonyStyle")} placeholder="Non-denominational, religious, civil..." data-testid="input-officiant-ceremony-style" /></div>
        <div><FieldLabel>Rehearsal Date</FieldLabel><FieldInput {...register("rehearsalDate")} type="date" data-testid="input-officiant-rehearsal-date" /></div>
      </div>
      <SectionLabel>Contact</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><FieldLabel>Contact Name</FieldLabel><FieldInput {...register("contactName")} data-testid="input-officiant-contact-name" /></div>
        <div><FieldLabel>Email</FieldLabel><FieldInput {...register("contactEmail")} type="email" error={errors.contactEmail?.message} data-testid="input-officiant-email" /></div>
        <div><FieldLabel>Phone</FieldLabel><FieldInput {...register("contactPhone")} type="tel" data-testid="input-officiant-phone" /></div>
      </div>
      <div><FieldLabel>Notes</FieldLabel><FieldTextarea {...register("notes")} placeholder="Custom vows, readings, unity ceremony details..." data-testid="textarea-officiant-notes" /></div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}

function HairMakeupForm({ onSave, initial, onCancel }: { onSave: (d: HairMakeupData) => void; initial?: HairMakeupData; onCancel: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<HairMakeupData>({ resolver: zodResolver(hairMakeupSchema), defaultValues: initial });
  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <SectionLabel>Hair & Makeup Details</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><FieldLabel>Artist / Studio Name</FieldLabel><FieldInput {...register("name")} placeholder="Artist or studio" data-testid="input-hair-makeup-name" /></div>
        <div><FieldLabel>Website</FieldLabel><FieldInput {...register("website")} placeholder="https://..." error={errors.website?.message} data-testid="input-hair-makeup-website" /></div>
      </div>
      <SectionLabel>Services</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><FieldLabel>Look Inspiration</FieldLabel><FieldInput {...register("look")} placeholder="Soft glam, natural glow, old Hollywood..." data-testid="input-hair-makeup-look" /></div>
        <div><FieldLabel>Number of People</FieldLabel><FieldInput {...register("numberOfPeople")} placeholder="Bride + 4 bridesmaids" data-testid="input-hair-makeup-number" /></div>
        <div><FieldLabel>Trial Date</FieldLabel><FieldInput {...register("trialDate")} type="date" data-testid="input-hair-makeup-trial-date" /></div>
      </div>
      <SectionLabel>Contact</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><FieldLabel>Contact Name</FieldLabel><FieldInput {...register("contactName")} data-testid="input-hair-makeup-contact-name" /></div>
        <div><FieldLabel>Email</FieldLabel><FieldInput {...register("contactEmail")} type="email" error={errors.contactEmail?.message} data-testid="input-hair-makeup-email" /></div>
        <div><FieldLabel>Phone</FieldLabel><FieldInput {...register("contactPhone")} type="tel" data-testid="input-hair-makeup-phone" /></div>
      </div>
      <div><FieldLabel>Notes</FieldLabel><FieldTextarea {...register("notes")} placeholder="Start time, location (on-site or salon), Pinterest board link..." data-testid="textarea-hair-makeup-notes" /></div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}

function CakeForm({ onSave, initial, onCancel }: { onSave: (d: CakeData) => void; initial?: CakeData; onCancel: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<CakeData>({ resolver: zodResolver(cakeSchema), defaultValues: initial });
  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <SectionLabel>Baker Details</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><FieldLabel>Bakery / Baker Name</FieldLabel><FieldInput {...register("name")} placeholder="Bakery or baker" data-testid="input-cake-name" /></div>
        <div><FieldLabel>Website</FieldLabel><FieldInput {...register("website")} placeholder="https://..." error={errors.website?.message} data-testid="input-cake-website" /></div>
      </div>
      <SectionLabel>Cake Design</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><FieldLabel>Flavours</FieldLabel><FieldInput {...register("flavors")} placeholder="Vanilla & raspberry, lemon & elderflower..." data-testid="input-cake-flavors" /></div>
        <div><FieldLabel>Tiers / Servings</FieldLabel><FieldInput {...register("tiers")} placeholder="3 tiers, 120 servings" data-testid="input-cake-tiers" /></div>
        <div><FieldLabel>Delivery / Setup Date</FieldLabel><FieldInput {...register("deliveryDate")} type="date" data-testid="input-cake-delivery-date" /></div>
      </div>
      <div><FieldLabel>Design Description</FieldLabel><FieldTextarea {...register("design")} placeholder="Textured buttercream, cascading fresh flowers, gold leaf accents..." data-testid="textarea-cake-design" /></div>
      <SectionLabel>Contact</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><FieldLabel>Contact Name</FieldLabel><FieldInput {...register("contactName")} data-testid="input-cake-contact-name" /></div>
        <div><FieldLabel>Email</FieldLabel><FieldInput {...register("contactEmail")} type="email" error={errors.contactEmail?.message} data-testid="input-cake-email" /></div>
        <div><FieldLabel>Phone</FieldLabel><FieldInput {...register("contactPhone")} type="tel" data-testid="input-cake-phone" /></div>
      </div>
      <div><FieldLabel>Notes</FieldLabel><FieldTextarea {...register("notes")} placeholder="Tasting appointment, allergen info, extra cutting cake..." data-testid="textarea-cake-notes" /></div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}

function TransportationForm({ onSave, initial, onCancel }: { onSave: (d: TransportationData) => void; initial?: TransportationData; onCancel: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<TransportationData>({ resolver: zodResolver(transportationSchema), defaultValues: initial });
  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <SectionLabel>Transportation Details</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><FieldLabel>Company Name</FieldLabel><FieldInput {...register("name")} placeholder="Transportation company" data-testid="input-transport-name" /></div>
        <div><FieldLabel>Website</FieldLabel><FieldInput {...register("website")} placeholder="https://..." error={errors.website?.message} data-testid="input-transport-website" /></div>
      </div>
      <SectionLabel>Routes</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><FieldLabel>Vehicle Type</FieldLabel><FieldInput {...register("vehicleType")} placeholder="Vintage Rolls Royce, white limo, shuttle bus..." data-testid="input-transport-vehicle-type" /></div>
        <div><FieldLabel>Pickup Location(s)</FieldLabel><FieldInput {...register("pickupLocations")} placeholder="Hotel lobby, bridal suite..." data-testid="input-transport-pickup" /></div>
        <div><FieldLabel>Drop-off Location(s)</FieldLabel><FieldInput {...register("dropoffLocations")} placeholder="Venue, reception hall..." data-testid="input-transport-dropoff" /></div>
      </div>
      <SectionLabel>Contact</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><FieldLabel>Contact Name</FieldLabel><FieldInput {...register("contactName")} data-testid="input-transport-contact-name" /></div>
        <div><FieldLabel>Email</FieldLabel><FieldInput {...register("contactEmail")} type="email" error={errors.contactEmail?.message} data-testid="input-transport-email" /></div>
        <div><FieldLabel>Phone</FieldLabel><FieldInput {...register("contactPhone")} type="tel" data-testid="input-transport-phone" /></div>
      </div>
      <div><FieldLabel>Notes</FieldLabel><FieldTextarea {...register("notes")} placeholder="Schedule, guest shuttle runs, gratuity included..." data-testid="textarea-transport-notes" /></div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}

function MiscForm({ onSave, initial, onCancel }: { onSave: (d: MiscData) => void; initial?: MiscData; onCancel: () => void }) {
  const { register, handleSubmit } = useForm<MiscData>({ resolver: zodResolver(miscSchema), defaultValues: initial });
  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <SectionLabel>What to Track</SectionLabel>
      <div><FieldLabel>Items / Description</FieldLabel><FieldTextarea {...register("items")} placeholder="Wedding favours, guest book, ring pillow, unity candle, card box, signage..." data-testid="textarea-misc-items" /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><FieldLabel>Vendor / Supplier</FieldLabel><FieldInput {...register("vendor")} placeholder="Etsy shop, local craft store..." data-testid="input-misc-vendor" /></div>
        <div><FieldLabel>Estimated Budget</FieldLabel><FieldInput {...register("budget")} placeholder="$500" data-testid="input-misc-budget" /></div>
      </div>
      <div><FieldLabel>Due / Needed By</FieldLabel><FieldInput {...register("dueDate")} placeholder="Two weeks before the wedding..." data-testid="input-misc-due-date" /></div>
      <SectionLabel>Contact</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><FieldLabel>Contact Name</FieldLabel><FieldInput {...register("contactName")} data-testid="input-misc-contact-name" /></div>
        <div><FieldLabel>Email</FieldLabel><FieldInput {...register("contactEmail")} type="email" data-testid="input-misc-email" /></div>
        <div><FieldLabel>Phone</FieldLabel><FieldInput {...register("contactPhone")} type="tel" data-testid="input-misc-phone" /></div>
      </div>
      <div><FieldLabel>Notes</FieldLabel><FieldTextarea {...register("notes")} placeholder="Links, order numbers, delivery tracking, anything else..." data-testid="textarea-misc-notes" /></div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}

function FormActions({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex items-center gap-6 pt-4 border-t border-border">
      <button
        type="submit"
        data-testid="button-save-vendor"
        className="bg-foreground text-background px-8 py-3.5 font-sans uppercase tracking-widest text-xs hover:bg-secondary transition-colors duration-500"
      >
        Save Details
      </button>
      <button
        type="button"
        onClick={onCancel}
        data-testid="button-cancel-vendor"
        className="font-sans text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-300"
      >
        Cancel
      </button>
    </div>
  );
}

/* ─── Saved summary display for any vendor ─── */
function VendorSummary({ data, onEdit }: { data: Record<string, string | undefined>; onEdit: () => void }) {
  const fields = [
    { key: "name", label: "Name", icon: <User className="w-3.5 h-3.5" /> },
    { key: "website", label: "Website", icon: <Globe className="w-3.5 h-3.5" /> },
    { key: "contactName", label: "Contact", icon: <User className="w-3.5 h-3.5" /> },
    { key: "contactEmail", label: "Email", icon: <Mail className="w-3.5 h-3.5" /> },
    { key: "contactPhone", label: "Phone", icon: <Phone className="w-3.5 h-3.5" /> },
    { key: "notes", label: "Notes", icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  const extraFields = Object.entries(data).filter(
    ([k, v]) => v && !["name","website","contactName","contactEmail","contactPhone","notes"].includes(k)
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(({ key, label, icon }) =>
          data[key] ? (
            <SavedRow
              key={key}
              icon={icon}
              label={label}
              value={data[key] as string}
              href={key === "website" ? data[key] : key === "contactEmail" ? `mailto:${data[key]}` : key === "contactPhone" ? `tel:${data[key]}` : undefined}
            />
          ) : null
        )}
        {extraFields.map(([k, v]) => (
          <SavedRow key={k} icon={<Sparkles className="w-3.5 h-3.5" />} label={k.replace(/([A-Z])/g, " $1")} value={v as string} />
        ))}
      </div>
      <button
        onClick={onEdit}
        data-testid="button-edit-vendor"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 font-sans text-xs uppercase tracking-widest mt-4"
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit Details
      </button>
    </div>
  );
}

/* ─── Category accordion card ─── */
function VendorCard({ category }: { category: typeof categories[number] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [saved, setSaved] = useState<Record<string, string | undefined> | null>(null);
  const [editing, setEditing] = useState(false);

  const storageKey = `${STORAGE_PREFIX}${category.key}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try { setSaved(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, [storageKey]);

  const handleSave = (data: Record<string, string | undefined>) => {
    localStorage.setItem(storageKey, JSON.stringify(data));
    setSaved(data);
    setEditing(false);
    setIsOpen(false);
  };

  const handleEdit = () => {
    setEditing(true);
    setIsOpen(true);
  };

  const handleCancel = () => {
    setEditing(false);
    if (!saved) setIsOpen(false);
  };

  const showForm = isOpen && (!saved || editing);
  const showSummary = isOpen && saved && !editing;

  const renderForm = () => {
    const common = { onCancel: handleCancel };
    switch (category.key) {
      case "florist": return <FloristForm onSave={handleSave} initial={saved as FloristData} {...common} />;
      case "caterer": return <CatererForm onSave={handleSave} initial={saved as CatererData} {...common} />;
      case "photographer": return <PhotographerForm onSave={handleSave} initial={saved as PhotographerData} {...common} />;
      case "videographer": return <VideographerForm onSave={handleSave} initial={saved as VideographerData} {...common} />;
      case "music": return <MusicForm onSave={handleSave} initial={saved as MusicData} {...common} />;
      case "officiant": return <OfficiantForm onSave={handleSave} initial={saved as OfficiantData} {...common} />;
      case "hairMakeup": return <HairMakeupForm onSave={handleSave} initial={saved as HairMakeupData} {...common} />;
      case "cake": return <CakeForm onSave={handleSave} initial={saved as CakeData} {...common} />;
      case "transportation": return <TransportationForm onSave={handleSave} initial={saved as TransportationData} {...common} />;
      case "misc": return <MiscForm onSave={handleSave} initial={saved as MiscData} {...common} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className="border border-border bg-card"
    >
      {/* Header */}
      <button
        onClick={() => {
          if (saved && !editing) {
            setIsOpen((o) => !o);
          } else if (!saved) {
            setIsOpen((o) => !o);
          } else {
            setIsOpen((o) => !o);
          }
        }}
        data-testid={`button-toggle-${category.key}`}
        className="w-full flex items-center justify-between px-8 py-6 text-left hover:bg-muted/30 transition-colors duration-300 group"
      >
        <div className="flex items-center gap-5">
          <div className={`w-9 h-9 flex items-center justify-center transition-colors duration-300 border ${saved ? "border-[#C9A89A]/40 text-[#C9A89A]" : "border-[#E8E0D8] text-muted-foreground group-hover:border-[#C9A89A]/50 group-hover:text-[#C9A89A]"}`}>
            {saved ? <CheckCircle className="w-4 h-4 stroke-[1.5]" /> : category.icon}
          </div>
          <div>
            <p className="font-serif text-xl text-foreground">{category.label}</p>
            <p className="font-sans text-xs text-muted-foreground mt-0.5">{category.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {saved && (
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C9A89A] border border-[#C9A89A]/30 px-3 py-1">
              Saved
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 pt-2 border-t border-border">
              {showSummary && <VendorSummary data={saved!} onEdit={handleEdit} />}
              {showForm && renderForm()}
              <InspirationPhotos storageKey={`vendor_${category.key}`} label={category.label} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main export ─── */
export function WeddingPlanning() {
  const savedCount = categories.filter((c) =>
    localStorage.getItem(`${STORAGE_PREFIX}${c.key}`)
  ).length;

  const vendorStorageKeys = categories.map((c) => `${STORAGE_PREFIX}${c.key}`);

  return (
    <SectionAccordion
      id="planning"
      label="Your Wedding Team"
      title="Every vendor,"
      italicWord="beautifully kept."
      index="05 — Vendors"
      subtitle="Store your florist, caterer, photographer, and every vendor in one place."
      icon={<LayoutList className="w-4 h-4" />}
      storageKeys={vendorStorageKeys}
      bgClass="bg-background"
    >
      <div className="max-w-5xl mx-auto">
        {savedCount > 0 && (
          <p className="font-sans text-sm text-[#C9A89A] mb-8 text-center">
            {savedCount} of {categories.length} vendors saved
          </p>
        )}
        <div className="space-y-3">
          {categories.map((category) => (
            <VendorCard key={category.key} category={category} />
          ))}
        </div>

      </div>
    </SectionAccordion>
  );
}
