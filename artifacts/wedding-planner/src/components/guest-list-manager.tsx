import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check, Users } from "lucide-react";

const STORAGE_KEY = "amore_guest_list";

type RsvpStatus = "pending" | "attending" | "declined";
type Dietary = "none" | "vegetarian" | "vegan" | "gluten-free" | "halal" | "kosher" | "other";

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  rsvp: RsvpStatus;
  dietary: Dietary;
  dietaryNote: string;
  plusOne: boolean;
  plusOneName: string;
  table: string;
  notes: string;
}

const RSVP_LABELS: Record<RsvpStatus, string> = {
  pending: "Pending",
  attending: "Attending",
  declined: "Declined",
};

const RSVP_STYLES: Record<RsvpStatus, string> = {
  pending: "text-[#8C7B74] bg-[#FAF7F2] border-[#E8E0D8]",
  attending: "text-[#4A7C59] bg-[#F0F7F2] border-[#B8D9C4]",
  declined: "text-[#9B4B4B] bg-[#FDF4F4] border-[#E8C4C4]",
};

const DIETARY_OPTIONS: { value: Dietary; label: string }[] = [
  { value: "none", label: "No restrictions" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-free" },
  { value: "halal", label: "Halal" },
  { value: "kosher", label: "Kosher" },
  { value: "other", label: "Other (specify)" },
];

function emptyGuest(): Omit<Guest, "id"> {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
    rsvp: "pending",
    dietary: "none",
    dietaryNote: "",
    plusOne: false,
    plusOneName: "",
    table: "",
    notes: "",
  };
}

function formatAddress(g: Pick<Guest, "addressLine1" | "addressLine2" | "city" | "region" | "postalCode" | "country">): string {
  const cityLine = [g.city, g.region].filter(Boolean).join(", ");
  const lastLine = [cityLine, g.postalCode].filter(Boolean).join(" ");
  return [g.addressLine1, g.addressLine2, lastLine, g.country].filter(Boolean).join(", ");
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-sans text-[11px] uppercase tracking-[0.18em] text-[#8C7B74] mb-2">
      {children}
    </label>
  );
}

function FieldInput(props: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  const { error, ...rest } = props;
  return (
    <div>
      <input
        {...rest}
        className={`w-full bg-transparent border-b ${error ? "border-red-400" : "border-[#E8E0D8]"} py-2.5 font-sans text-sm text-[#2C1810] placeholder:text-[#8C7B74]/40 focus:outline-none focus:border-[#C9A89A] transition-colors duration-300`}
      />
      {error && <p className="mt-1 text-[11px] text-red-500 font-sans">{error}</p>}
    </div>
  );
}

function GuestForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<Guest, "id">;
  onSave: (g: Omit<Guest, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName.trim()) {
      setError("First name is required.");
      return;
    }
    onSave(form);
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      onSubmit={handleSubmit}
      className="border border-[#E8E0D8] bg-white p-6 md:p-8 space-y-8"
    >
      {/* Name */}
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A89A] mb-5">Guest Details</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>First Name *</Label>
            <FieldInput
              value={form.firstName}
              onChange={(e) => { set("firstName", e.target.value); setError(""); }}
              placeholder="First name"
              error={error && !form.firstName.trim() ? error : undefined}
            />
          </div>
          <div>
            <Label>Last Name</Label>
            <FieldInput
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              placeholder="Last name"
            />
          </div>
          <div>
            <Label>Email</Label>
            <FieldInput
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <Label>Phone</Label>
            <FieldInput
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
      </div>

      {/* Mailing Address */}
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A89A] mb-2">Mailing Address</p>
        <p className="font-sans text-xs text-[#8C7B74] mb-5 italic">For paper invitations, save-the-dates, and thank-you cards.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label>Street Address</Label>
            <FieldInput
              value={form.addressLine1}
              onChange={(e) => set("addressLine1", e.target.value)}
              placeholder="Street address"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Apt / Suite (optional)</Label>
            <FieldInput
              value={form.addressLine2}
              onChange={(e) => set("addressLine2", e.target.value)}
              placeholder="Apt, suite, etc."
            />
          </div>
          <div>
            <Label>City</Label>
            <FieldInput
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="City"
            />
          </div>
          <div>
            <Label>State / Region</Label>
            <FieldInput
              value={form.region}
              onChange={(e) => set("region", e.target.value)}
              placeholder="State / Region"
            />
          </div>
          <div>
            <Label>Postal / ZIP Code</Label>
            <FieldInput
              value={form.postalCode}
              onChange={(e) => set("postalCode", e.target.value)}
              placeholder="Postal code"
            />
          </div>
          <div>
            <Label>Country</Label>
            <FieldInput
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              placeholder="Country"
            />
          </div>
        </div>
      </div>

      {/* RSVP + Dietary */}
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A89A] mb-5">Attendance</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>RSVP Status</Label>
            <div className="flex gap-2 mt-1">
              {(["pending", "attending", "declined"] as RsvpStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => set("rsvp", status)}
                  className={`flex-1 py-2 font-sans text-[11px] uppercase tracking-widest border transition-colors duration-200 ${
                    form.rsvp === status
                      ? "bg-[#2C1810] text-white border-[#2C1810]"
                      : "bg-transparent text-[#8C7B74] border-[#E8E0D8] hover:border-[#C9A89A]"
                  }`}
                >
                  {RSVP_LABELS[status]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Dietary Requirements</Label>
            <select
              value={form.dietary}
              onChange={(e) => set("dietary", e.target.value as Dietary)}
              className="w-full bg-transparent border-b border-[#E8E0D8] py-2.5 font-sans text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A89A] transition-colors duration-300"
            >
              {DIETARY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          {form.dietary === "other" && (
            <div className="md:col-span-2">
              <Label>Dietary Note</Label>
              <FieldInput
                value={form.dietaryNote}
                onChange={(e) => set("dietaryNote", e.target.value)}
                placeholder="Nut allergy, low-FODMAP..."
              />
            </div>
          )}
        </div>
      </div>

      {/* Plus one */}
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A89A] mb-5">Plus One</p>
        <div className="flex items-center gap-4 mb-4">
          {[false, true].map((val) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => set("plusOne", val)}
              className={`px-5 py-2 font-sans text-[11px] uppercase tracking-widest border transition-colors duration-200 ${
                form.plusOne === val
                  ? "bg-[#2C1810] text-white border-[#2C1810]"
                  : "bg-transparent text-[#8C7B74] border-[#E8E0D8] hover:border-[#C9A89A]"
              }`}
            >
              {val ? "Yes" : "No"}
            </button>
          ))}
        </div>
        {form.plusOne && (
          <div>
            <Label>Plus-One Name</Label>
            <FieldInput
              value={form.plusOneName}
              onChange={(e) => set("plusOneName", e.target.value)}
              placeholder="Guest's name (if known)"
            />
          </div>
        )}
      </div>

      {/* Table + Notes */}
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A89A] mb-5">Seating</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Table Assignment</Label>
            <FieldInput
              value={form.table}
              onChange={(e) => set("table", e.target.value)}
              placeholder="Table 4, Magnolia..."
            />
          </div>
          <div>
            <Label>Notes</Label>
            <FieldInput
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Childhood friend, seat near entrance..."
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          className="bg-[#2C1810] text-white font-sans text-[11px] uppercase tracking-widest px-8 py-3 hover:bg-[#C9A89A] transition-colors duration-500"
        >
          Save Guest
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-sans text-[11px] uppercase tracking-widest text-[#8C7B74] hover:text-[#2C1810] border-b border-transparent hover:border-[#2C1810] transition-colors duration-300 pb-0.5"
        >
          Cancel
        </button>
      </div>
    </motion.form>
  );
}

export function GuestListManager() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setGuests(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  function persist(updated: Guest[]) {
    setGuests(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function addGuest(data: Omit<Guest, "id">) {
    const newGuest: Guest = { ...data, id: crypto.randomUUID() };
    persist([...guests, newGuest]);
    setAdding(false);
  }

  function updateGuest(id: string, data: Omit<Guest, "id">) {
    persist(guests.map((g) => (g.id === id ? { ...data, id } : g)));
    setEditing(null);
  }

  function deleteGuest(id: string) {
    persist(guests.filter((g) => g.id !== id));
    setConfirmDelete(null);
  }

  const attending = guests.filter((g) => g.rsvp === "attending").length;
  const declined = guests.filter((g) => g.rsvp === "declined").length;
  const pending = guests.filter((g) => g.rsvp === "pending").length;
  const totalWithPlusOnes = guests.filter((g) => g.rsvp === "attending" && g.plusOne).length + attending;

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      {guests.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#E8E0D8] border border-[#E8E0D8]"
        >
          {[
            { label: "Total Guests", value: guests.length },
            { label: "Attending", value: attending },
            { label: "Pending", value: pending },
            { label: "Declined", value: declined },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#FAF7F2] px-5 py-4 text-center">
              <p className="font-serif text-2xl text-[#2C1810]">{stat.value}</p>
              <p className="font-sans text-[10px] uppercase tracking-widest text-[#8C7B74] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Guest rows */}
      <AnimatePresence mode="popLayout">
        {guests.map((guest) => (
          <motion.div
            key={guest.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {editing === guest.id ? (
              <GuestForm
                initial={{ ...guest }}
                onSave={(data) => updateGuest(guest.id, data)}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <div className="border border-[#E8E0D8] bg-white group">
                <div className="px-5 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-serif text-lg text-[#2C1810]">
                        {guest.firstName} {guest.lastName}
                        {guest.plusOne && (
                          <span className="ml-2 font-sans text-xs text-[#8C7B74]">
                            +1{guest.plusOneName ? ` (${guest.plusOneName})` : ""}
                          </span>
                        )}
                      </p>
                      <span className={`font-sans text-[10px] uppercase tracking-widest px-2 py-0.5 border ${RSVP_STYLES[guest.rsvp]}`}>
                        {RSVP_LABELS[guest.rsvp]}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                      {guest.email && (
                        <p className="font-sans text-xs text-[#8C7B74]">{guest.email}</p>
                      )}
                      {guest.phone && (
                        <p className="font-sans text-xs text-[#8C7B74]">{guest.phone}</p>
                      )}
                      {formatAddress(guest) && (
                        <p className="font-sans text-xs text-[#8C7B74]">✉ {formatAddress(guest)}</p>
                      )}
                      {guest.dietary !== "none" && (
                        <p className="font-sans text-xs text-[#C9A89A]">
                          {DIETARY_OPTIONS.find((o) => o.value === guest.dietary)?.label}
                          {guest.dietary === "other" && guest.dietaryNote ? ` — ${guest.dietaryNote}` : ""}
                        </p>
                      )}
                      {guest.table && (
                        <p className="font-sans text-xs text-[#8C7B74]">Table: {guest.table}</p>
                      )}
                      {guest.notes && (
                        <p className="font-sans text-xs text-[#8C7B74] italic truncate max-w-xs">{guest.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => setEditing(guest.id)}
                      className="w-8 h-8 border border-[#E8E0D8] flex items-center justify-center text-[#8C7B74] hover:border-[#C9A89A] hover:text-[#C9A89A] transition-colors duration-200"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(guest.id)}
                      className="w-8 h-8 border border-[#E8E0D8] flex items-center justify-center text-[#8C7B74] hover:border-red-300 hover:text-red-400 transition-colors duration-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {/* Delete confirm */}
                <AnimatePresence>
                  {confirmDelete === guest.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-[#E8E0D8] bg-[#FDF4F4]"
                    >
                      <div className="px-5 py-3 flex items-center justify-between gap-4">
                        <p className="font-sans text-xs text-[#9B4B4B]">
                          Remove {guest.firstName} {guest.lastName} from your guest list?
                        </p>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => deleteGuest(guest.id)}
                            className="w-7 h-7 bg-[#9B4B4B] text-white flex items-center justify-center hover:bg-[#7A3939] transition-colors duration-200"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="w-7 h-7 border border-[#E8E0D8] text-[#8C7B74] flex items-center justify-center hover:border-[#8C7B74] transition-colors duration-200"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Empty state */}
      {guests.length === 0 && !adding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-dashed border-[#E8E0D8] py-12 text-center"
        >
          <div className="w-10 h-10 border border-[#E8E0D8] flex items-center justify-center text-[#C9A89A] mx-auto mb-4">
            <Users className="w-4 h-4" />
          </div>
          <p className="font-serif text-xl text-[#2C1810] mb-1">No guests yet</p>
          <p className="font-sans text-sm text-[#8C7B74]">Add your first guest below to get started.</p>
        </motion.div>
      )}

      {/* Add guest form */}
      <AnimatePresence>
        {adding && (
          <GuestForm
            initial={emptyGuest()}
            onSave={addGuest}
            onCancel={() => setAdding(false)}
          />
        )}
      </AnimatePresence>

      {/* Add button */}
      {!adding && (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-widest text-[#8C7B74] border border-[#E8E0D8] px-6 py-3 hover:border-[#C9A89A] hover:text-[#C9A89A] transition-colors duration-300"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Guest
        </button>
      )}

      {guests.length > 0 && attending > 0 && (
        <p className="font-sans text-[11px] text-[#8C7B74] uppercase tracking-widest">
          {totalWithPlusOnes} seat{totalWithPlusOnes !== 1 ? "s" : ""} confirmed
        </p>
      )}
    </div>
  );
}
