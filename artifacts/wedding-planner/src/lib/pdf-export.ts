import { jsPDF } from "jspdf";

const AMORE_PREFIX = "amore_";

type Section = {
  title: string;
  lines: string[];
};

function readJSON<T = unknown>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(value: unknown): string {
  if (typeof value !== "string" && typeof value !== "number") return "";
  const d = new Date(value as string | number);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function entriesToBullets(obj: Record<string, unknown>, labelMap?: Record<string, string>): string[] {
  return Object.entries(obj)
    .filter(([, v]) => v !== null && v !== undefined && v !== "" && v !== 0)
    .map(([k, v]) => {
      const label = labelMap?.[k] ?? k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();
      const value = typeof v === "object" ? JSON.stringify(v) : String(v);
      return `${label}: ${value}`;
    });
}

function buildSections(): Section[] {
  const sections: Section[] = [];

  // ── Wedding Date ───────────────────────────────────────
  const date = readJSON<string>("amore_wedding_date");
  if (date) {
    sections.push({ title: "Wedding Date", lines: [fmtDate(date)] });
  }

  // ── Venue ──────────────────────────────────────────────
  const venue = readJSON<Record<string, unknown>>("amore_venue_details");
  if (venue && Object.keys(venue).length > 0) {
    sections.push({
      title: "Venue",
      lines: entriesToBullets(venue, {
        name: "Name",
        address: "Address",
        city: "City",
        state: "State",
        capacity: "Capacity",
        phone: "Phone",
        email: "Email",
        website: "Website",
        notes: "Notes",
        type: "Type",
      }),
    });
  }

  // ── Vendors ────────────────────────────────────────────
  const photographer = readJSON<Record<string, unknown>>("amore_vendor_photographer");
  if (photographer && Object.keys(photographer).length > 0) {
    sections.push({
      title: "Photographer",
      lines: entriesToBullets(photographer),
    });
  }

  const music = readJSON<Record<string, unknown>>("amore_vendor_music");
  if (music && Object.keys(music).length > 0) {
    sections.push({
      title: "DJ / Music",
      lines: entriesToBullets(music),
    });
  }

  // Other vendors stored under amore_vendor_<key>
  const otherVendorKeys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("amore_vendor_") && k !== "amore_vendor_photographer" && k !== "amore_vendor_music") {
      otherVendorKeys.push(k);
    }
  }
  for (const k of otherVendorKeys) {
    const data = readJSON<Record<string, unknown>>(k);
    if (data && Object.keys(data).length > 0) {
      const niceName = k.replace("amore_vendor_", "").replace(/([A-Z])/g, " $1");
      sections.push({
        title: niceName.charAt(0).toUpperCase() + niceName.slice(1),
        lines: entriesToBullets(data),
      });
    }
  }

  // ── Themes & aesthetic ─────────────────────────────────
  const chosenTheme = readJSON<string>("amore_chosen_theme");
  const savedThemes = readJSON<string[]>("amore_saved_themes");
  const themeLines: string[] = [];
  if (chosenTheme) themeLines.push(`Chosen theme: ${chosenTheme}`);
  if (Array.isArray(savedThemes) && savedThemes.length > 0) {
    themeLines.push(`Saved themes: ${savedThemes.join(", ")}`);
  }
  if (themeLines.length > 0) {
    sections.push({ title: "Theme", lines: themeLines });
  }

  const palette = readJSON<{ name?: string; swatches?: { hex: string; name: string }[] }>("amore_moodboard_palette");
  if (palette?.swatches && palette.swatches.length > 0) {
    sections.push({
      title: `Color Palette${palette.name ? ` — ${palette.name}` : ""}`,
      lines: palette.swatches.map((s) => `${s.name || "Untitled"}  (${s.hex})`),
    });
  }

  const tags = readJSON<string[]>("amore_moodboard_tags");
  if (Array.isArray(tags) && tags.length > 0) {
    sections.push({ title: "Aesthetic", lines: tags });
  }

  // ── Budget ─────────────────────────────────────────────
  const budget = readJSON<Record<string, string>>("amore_budget");
  if (budget) {
    const lines: string[] = [];
    let total = 0;
    for (const [k, v] of Object.entries(budget)) {
      const n = parseFloat(v) || 0;
      if (n > 0) {
        lines.push(`${k.charAt(0).toUpperCase() + k.slice(1)}: ${fmtCurrency(n)}`);
        total += n;
      }
    }
    if (lines.length > 0) {
      lines.push(`──`);
      lines.push(`Total: ${fmtCurrency(total)}`);
      sections.push({ title: "Budget", lines });
    }
  }

  // ── Payments ───────────────────────────────────────────
  const payments = readJSON<Array<{ vendor: string; amount: number; dueDate?: string; paid?: boolean; notes?: string }>>("amore_payments");
  if (Array.isArray(payments) && payments.length > 0) {
    sections.push({
      title: "Payments",
      lines: payments.map((p) => {
        const status = p.paid ? "PAID" : "DUE";
        const due = p.dueDate ? `, due ${p.dueDate}` : "";
        const notes = p.notes ? ` — ${p.notes}` : "";
        return `[${status}] ${p.vendor || "Unnamed"}: ${fmtCurrency(p.amount || 0)}${due}${notes}`;
      }),
    });
  }

  // ── Guest list ─────────────────────────────────────────
  const guests = readJSON<Array<{ name: string; rsvp?: string; meal?: string; notes?: string }>>("amore_guest_list");
  if (Array.isArray(guests) && guests.length > 0) {
    sections.push({
      title: `Guest List (${guests.length})`,
      lines: guests.map((g) => {
        const rsvp = g.rsvp ? ` — ${g.rsvp}` : "";
        const meal = g.meal ? `, ${g.meal}` : "";
        const notes = g.notes ? ` (${g.notes})` : "";
        return `${g.name || "Unnamed"}${rsvp}${meal}${notes}`;
      }),
    });
  }

  // ── Timeline ───────────────────────────────────────────
  const timeline = readJSON<Array<{ time?: string; event?: string; notes?: string }>>("amore_timeline");
  if (Array.isArray(timeline) && timeline.length > 0) {
    sections.push({
      title: "Wedding Day Timeline",
      lines: timeline.map((t) => {
        const time = t.time ? `${t.time}  —  ` : "";
        const notes = t.notes ? ` (${t.notes})` : "";
        return `${time}${t.event || "Untitled"}${notes}`;
      }),
    });
  }

  // ── Checklist ──────────────────────────────────────────
  const checklist = readJSON<Record<string, boolean>>("amore_checklist");
  if (checklist) {
    const done = Object.entries(checklist).filter(([, v]) => v).map(([k]) => k);
    const todo = Object.entries(checklist).filter(([, v]) => !v).map(([k]) => k);
    const lines: string[] = [];
    if (done.length > 0) {
      lines.push(`Completed (${done.length}):`);
      done.forEach((d) => lines.push(`  ✓  ${d}`));
    }
    if (todo.length > 0) {
      if (done.length > 0) lines.push("");
      lines.push(`Outstanding (${todo.length}):`);
      todo.forEach((d) => lines.push(`  ○  ${d}`));
    }
    if (lines.length > 0) sections.push({ title: "Checklist", lines });
  }

  return sections;
}

export function downloadWeddingPlanPDF() {
  const sections = buildSections();

  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 60;
  const marginTop = 70;
  const marginBottom = 60;
  const contentWidth = pageWidth - marginX * 2;

  let y = marginTop;

  function ensureSpace(needed: number) {
    if (y + needed > pageHeight - marginBottom) {
      doc.addPage();
      y = marginTop;
    }
  }

  // ── Cover header ─────────────────────────────────────
  doc.setFont("times", "normal");
  doc.setFontSize(28);
  doc.setTextColor(44, 24, 16);
  doc.text("Amore", marginX, y);

  doc.setFontSize(10);
  doc.setTextColor(140, 123, 116);
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  doc.text(`Wedding Plan  ·  Exported ${today}`, marginX, y + 18);

  y += 50;
  doc.setDrawColor(232, 224, 216);
  doc.setLineWidth(0.5);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 28;

  // ── Empty state ──────────────────────────────────────
  if (sections.length === 0) {
    doc.setFont("times", "italic");
    doc.setFontSize(12);
    doc.setTextColor(140, 123, 116);
    doc.text("No data has been entered yet. Start filling in your details to build your plan.", marginX, y);
    doc.save(`Amore-Wedding-Plan-${new Date().toISOString().slice(0, 10)}.pdf`);
    return;
  }

  // ── Sections ─────────────────────────────────────────
  for (const section of sections) {
    ensureSpace(48);

    // Section title
    doc.setFont("times", "normal");
    doc.setFontSize(16);
    doc.setTextColor(44, 24, 16);
    doc.text(section.title, marginX, y);
    y += 8;

    // Underline
    doc.setDrawColor(201, 168, 154);
    doc.setLineWidth(0.6);
    doc.line(marginX, y, marginX + 40, y);
    y += 18;

    // Bullets
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(60, 50, 45);

    for (const line of section.lines) {
      const bullet = line.trim() === "" ? "" : "•  ";
      const prefix = line.startsWith("  ") ? "" : bullet;
      const indent = line.startsWith("  ") ? 18 : 12;
      const text = `${prefix}${line}`;
      const wrapped = doc.splitTextToSize(text, contentWidth - indent);

      ensureSpace(wrapped.length * 14 + 4);
      doc.text(wrapped, marginX + (line.startsWith("  ") ? indent : 0), y);
      y += wrapped.length * 14;
    }

    y += 18;
  }

  // ── Footer on each page ──────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(180, 165, 158);
    doc.text(`Amore  ·  ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 28, { align: "center" });
  }

  doc.save(`Amore-Wedding-Plan-${new Date().toISOString().slice(0, 10)}.pdf`);
}

// Returns true if there's any saved data worth exporting
export function hasAnyAmoreData(): boolean {
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith(AMORE_PREFIX)) {
      const v = localStorage.getItem(k);
      if (v && v !== "{}" && v !== "null" && v !== "[]" && v !== '""') return true;
    }
  }
  return false;
}
