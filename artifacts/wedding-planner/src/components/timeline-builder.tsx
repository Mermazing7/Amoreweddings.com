import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check, Clock } from "lucide-react";

const STORAGE_KEY = "amore_timeline";

const EVENT_TYPES = [
  { value: "getting-ready", label: "Getting Ready", color: "#D4B8A8" },
  { value: "first-look", label: "First Look", color: "#C9A89A" },
  { value: "ceremony", label: "Ceremony", color: "#2C1810" },
  { value: "cocktail", label: "Cocktail Hour", color: "#B8967E" },
  { value: "reception", label: "Reception", color: "#8C7B74" },
  { value: "dinner", label: "Dinner", color: "#A8856E" },
  { value: "speeches", label: "Speeches / Toasts", color: "#9E7B6E" },
  { value: "dancing", label: "Dancing", color: "#C8B5A5" },
  { value: "send-off", label: "Grand Send-off", color: "#2C1810" },
  { value: "vendor", label: "Vendor Arrival", color: "#E8E0D8" },
  { value: "transport", label: "Transportation", color: "#BFA99A" },
  { value: "other", label: "Other", color: "#8C7B74" },
] as const;

type EventType = typeof EVENT_TYPES[number]["value"];

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  type: EventType;
  duration: string;
  assignee: string;
  notes: string;
}

function emptyEvent(): Omit<TimelineEvent, "id"> {
  return { time: "12:00", title: "", type: "ceremony", duration: "30", assignee: "", notes: "" };
}

function parseTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
}

function formatTime12(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block font-sans text-[11px] uppercase tracking-[0.18em] text-[#8C7B74] mb-2">{children}</label>;
}

function FieldInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} className="w-full bg-transparent border-b border-[#E8E0D8] py-2.5 font-sans text-sm text-[#2C1810] placeholder:text-[#8C7B74]/40 focus:outline-none focus:border-[#C9A89A] transition-colors duration-300" />
  );
}

function EventForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<TimelineEvent, "id">;
  onSave: (e: Omit<TimelineEvent, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Event title is required."); return; }
    onSave(form);
  }

  const selectedType = EVENT_TYPES.find((t) => t.value === form.type);

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="border border-[#E8E0D8] bg-white p-6 space-y-6"
    >
      <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A89A]">Add Event</p>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label>Time</Label>
          <FieldInput type="time" value={form.time} onChange={(e) => set("time", e.target.value)} />
        </div>
        <div>
          <Label>Duration (minutes)</Label>
          <FieldInput
            type="number"
            min="5"
            step="5"
            value={form.duration}
            onChange={(e) => set("duration", e.target.value)}
            placeholder="30"
          />
        </div>
      </div>

      <div>
        <Label>Event Title *</Label>
        <FieldInput
          value={form.title}
          onChange={(e) => { set("title", e.target.value); setError(""); }}
          placeholder="Ceremony begins"
        />
        {error && <p className="mt-1 font-sans text-[11px] text-red-500">{error}</p>}
      </div>

      <div>
        <Label>Event Type</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {EVENT_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => set("type", t.value)}
              className={`px-3 py-1.5 font-sans text-[10px] uppercase tracking-widest border transition-colors duration-200 ${
                form.type === t.value
                  ? "bg-[#2C1810] text-white border-[#2C1810]"
                  : "text-[#8C7B74] border-[#E8E0D8] hover:border-[#C9A89A]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label>Assigned To</Label>
          <FieldInput
            value={form.assignee}
            onChange={(e) => set("assignee", e.target.value)}
            placeholder="Photographer, coordinator…"
          />
        </div>
        <div>
          <Label>Notes</Label>
          <FieldInput
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Location, instructions…"
          />
        </div>
      </div>

      {selectedType && (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border" style={{ backgroundColor: selectedType.color }} />
          <p className="font-sans text-xs text-[#8C7B74]">{selectedType.label}</p>
        </div>
      )}

      <div className="flex items-center gap-4 pt-1">
        <button type="submit" className="bg-[#2C1810] text-white font-sans text-[11px] uppercase tracking-widest px-7 py-3 hover:bg-[#C9A89A] transition-colors duration-500">
          Save Event
        </button>
        <button type="button" onClick={onCancel} className="font-sans text-[11px] uppercase tracking-widest text-[#8C7B74] border-b border-transparent hover:border-[#8C7B74] transition-colors duration-300 pb-0.5">
          Cancel
        </button>
      </div>
    </motion.form>
  );
}

export function TimelineBuilder() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEvents(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  function persist(updated: TimelineEvent[]) {
    const sorted = [...updated].sort((a, b) => parseTime(a.time) - parseTime(b.time));
    setEvents(sorted);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  }

  function addEvent(data: Omit<TimelineEvent, "id">) {
    persist([...events, { ...data, id: crypto.randomUUID() }]);
    setAdding(false);
  }

  function updateEvent(id: string, data: Omit<TimelineEvent, "id">) {
    persist(events.map((e) => (e.id === id ? { ...data, id } : e)));
    setEditing(null);
  }

  function deleteEvent(id: string) {
    persist(events.filter((e) => e.id !== id));
    setConfirmDelete(null);
  }

  return (
    <div className="space-y-3">
      {events.length === 0 && !adding && (
        <div className="border border-dashed border-[#E8E0D8] py-10 text-center">
          <div className="w-9 h-9 border border-[#E8E0D8] flex items-center justify-center text-[#C9A89A] mx-auto mb-3">
            <Clock className="w-4 h-4" />
          </div>
          <p className="font-serif text-lg text-[#2C1810] mb-1">No events yet</p>
          <p className="font-sans text-xs text-[#8C7B74]">Add your first timeline event below.</p>
        </div>
      )}

      {/* Timeline list */}
      <AnimatePresence mode="popLayout">
        {events.map((event) => {
          const typeInfo = EVENT_TYPES.find((t) => t.value === event.type);
          return (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              {editing === event.id ? (
                <EventForm
                  initial={{ ...event }}
                  onSave={(d) => updateEvent(event.id, d)}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <div className="border border-[#E8E0D8] bg-white group flex items-stretch">
                  <div className="w-1 shrink-0" style={{ backgroundColor: typeInfo?.color ?? "#E8E0D8" }} />
                  <div className="flex-1 px-4 py-3 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 text-right min-w-[52px]">
                        <p className="font-sans text-xs font-medium text-[#2C1810]">{formatTime12(event.time)}</p>
                        {event.duration && (
                          <p className="font-sans text-[10px] text-[#8C7B74]">{event.duration} min</p>
                        )}
                      </div>
                      <div>
                        <p className="font-serif text-base text-[#2C1810]">{event.title}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                          {event.assignee && <p className="font-sans text-xs text-[#8C7B74]">{event.assignee}</p>}
                          {event.notes && <p className="font-sans text-xs text-[#8C7B74] italic">{event.notes}</p>}
                          <p className="font-sans text-[10px] uppercase tracking-widest text-[#C9A89A]">{typeInfo?.label}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button onClick={() => setEditing(event.id)} className="w-7 h-7 border border-[#E8E0D8] flex items-center justify-center text-[#8C7B74] hover:border-[#C9A89A] hover:text-[#C9A89A] transition-colors duration-200">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => setConfirmDelete(event.id)} className="w-7 h-7 border border-[#E8E0D8] flex items-center justify-center text-[#8C7B74] hover:border-red-300 hover:text-red-400 transition-colors duration-200">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {confirmDelete === event.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-[#E8E0D8] bg-[#FDF4F4]">
                        <div className="px-4 py-2.5 flex items-center justify-between gap-4">
                          <p className="font-sans text-xs text-[#9B4B4B]">Remove this event?</p>
                          <div className="flex gap-2">
                            <button onClick={() => deleteEvent(event.id)} className="w-6 h-6 bg-[#9B4B4B] text-white flex items-center justify-center"><Check className="w-3 h-3" /></button>
                            <button onClick={() => setConfirmDelete(null)} className="w-6 h-6 border border-[#E8E0D8] text-[#8C7B74] flex items-center justify-center"><X className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {adding && (
          <EventForm initial={emptyEvent()} onSave={addEvent} onCancel={() => setAdding(false)} />
        )}
      </AnimatePresence>

      {!adding && (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-widest text-[#8C7B74] border border-[#E8E0D8] px-5 py-3 hover:border-[#C9A89A] hover:text-[#C9A89A] transition-colors duration-300"
        >
          <Plus className="w-3.5 h-3.5" /> Add Event
        </button>
      )}

      {events.length > 0 && (
        <p className="font-sans text-[11px] text-[#8C7B74] uppercase tracking-widest">
          {events.length} event{events.length !== 1 ? "s" : ""} · Sorted by time
        </p>
      )}
    </div>
  );
}
