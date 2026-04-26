import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, PieChart as PieIcon, Banknote } from "lucide-react";
import { SectionAccordion } from "./section-accordion";
import { PaymentTracker } from "./payment-tracker";

const STORAGE_KEY = "amore_budget";

const CATEGORIES = [
  { key: "venue",         label: "Venue",              color: "#C9A89A" },
  { key: "catering",     label: "Catering",            color: "#B8967E" },
  { key: "photographer", label: "Photographer",        color: "#D4B8A8" },
  { key: "videographer", label: "Videographer",        color: "#A8856E" },
  { key: "florist",      label: "Florals",             color: "#C8B5A5" },
  { key: "music",        label: "DJ / Music",          color: "#9E7B6E" },
  { key: "attire",       label: "Attire & Accessories",color: "#E2D0C4" },
  { key: "hairMakeup",   label: "Hair & Makeup",       color: "#BFA99A" },
  { key: "cake",         label: "Cake & Desserts",     color: "#D9C4B5" },
  { key: "stationery",   label: "Stationery",          color: "#A89080" },
  { key: "transport",    label: "Transportation",      color: "#8E6E60" },
  { key: "rings",        label: "Rings",               color: "#CBB09F" },
  { key: "honeymoon",    label: "Honeymoon",           color: "#B5978A" },
  { key: "misc",         label: "Miscellaneous",       color: "#9C8070" },
];

type BudgetData = Record<string, string>;

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function CenterLabel({ total }: { total: number }) {
  return (
    <g>
      <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "13px", fill: "#8C7B74", letterSpacing: "0.15em", textTransform: "uppercase" }}>
        Total
      </text>
      <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fill: "#2C1810", fontWeight: 400 }}>
        {fmt(total)}
      </text>
    </g>
  );
}

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; payload: { color: string } }[];
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="bg-card border border-border px-4 py-3 shadow-lg">
      <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1">{entry.name}</p>
      <p className="font-serif text-xl text-foreground">{fmt(entry.value)}</p>
    </div>
  );
}

export function BudgetSection() {
  const [values, setValues] = useState<BudgetData>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : {};
    } catch { return {}; }
  });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [tab, setTab] = useState<"wheel" | "payments">("wheel");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  }, [values]);

  const handleChange = useCallback((key: string, raw: string) => {
    const cleaned = raw.replace(/[^0-9.]/g, "");
    setValues((prev) => ({ ...prev, [key]: cleaned }));
  }, []);

  const chartData = CATEGORIES.map((c) => ({
    name: c.label,
    value: parseFloat(values[c.key] || "0") || 0,
    color: c.color,
    key: c.key,
  })).filter((d) => d.value > 0);

  const total = chartData.reduce((s, d) => s + d.value, 0);

  const emptyData = [{ name: "Empty", value: 1, color: "#EDE8E3" }];

  return (
    <SectionAccordion
      id="budget"
      label="Your Budget"
      title="Every detail,"
      italicWord="accounted for."
      index="06 — Budget"
      subtitle="Enter your estimated spend for each category and watch your budget take shape."
      icon={<DollarSign className="w-4 h-4" />}
      storageKey={STORAGE_KEY}
      bgClass="bg-background"
    >
      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex border border-border bg-card">
            {[
              { key: "wheel" as const, label: "Budget Wheel", icon: <PieIcon className="w-3.5 h-3.5" /> },
              { key: "payments" as const, label: "Vendor Payments", icon: <Banknote className="w-3.5 h-3.5" /> },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2.5 px-7 py-3.5 font-sans text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  tab === t.key
                    ? "bg-[#2C1810] text-white"
                    : "text-[#8C7B74] hover:text-[#2C1810]"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {tab === "payments" ? (
          <motion.div
            key="payments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <PaymentTracker />
          </motion.div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── Inputs ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border border-border bg-card p-8 md:p-10"
          >
            <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-secondary mb-8">
              Expenses
            </p>

            <div className="space-y-0 divide-y divide-border">
              {CATEGORIES.map((cat, i) => (
                <div key={cat.key} className="flex items-center gap-4 py-4 group">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-300 group-hover:scale-125"
                    style={{ backgroundColor: cat.color }}
                  />
                  <label className="font-sans text-sm text-foreground flex-1 min-w-0 truncate">
                    {cat.label}
                  </label>
                  <div className="relative w-36 shrink-0">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 font-sans text-sm text-muted-foreground pointer-events-none">
                      $
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={values[cat.key] || ""}
                      onChange={(e) => handleChange(cat.key, e.target.value)}
                      placeholder="0"
                      data-testid={`input-budget-${cat.key}`}
                      className="w-full bg-transparent border-b border-border pl-4 py-2 font-sans text-sm text-right text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-secondary transition-colors duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total bar */}
            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary">
                <TrendingUp className="w-4 h-4 stroke-[1.5]" />
                <span className="font-sans text-[11px] uppercase tracking-[0.2em]">Total Budget</span>
              </div>
              <p className="font-serif text-2xl text-foreground">{fmt(total)}</p>
            </div>
          </motion.div>

          {/* ── Wheel + legend ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-10"
          >
            {/* Donut chart */}
            <div className="relative w-full aspect-square max-w-[460px] mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 24, right: 24, bottom: 24, left: 24 }}>
                  <Pie
                    data={chartData.length > 0 ? chartData : emptyData}
                    cx="50%"
                    cy="50%"
                    innerRadius="44%"
                    outerRadius="62%"
                    paddingAngle={chartData.length > 1 ? 2 : 0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    strokeWidth={0}
                    labelLine={false}
                    label={chartData.length > 0 ? (props: {
                      cx: number; cy: number; midAngle: number; outerRadius: number;
                      name: string; value: number; index: number;
                    }) => {
                      const { cx, cy, midAngle, outerRadius, name, value, index } = props;
                      if (total === 0 || value / total < 0.025) return <g key={`lbl-${index}`} />;
                      const RADIAN = Math.PI / 180;
                      const cos = Math.cos(-RADIAN * midAngle);
                      const sin = Math.sin(-RADIAN * midAngle);
                      const sx = cx + outerRadius * cos;
                      const sy = cy + outerRadius * sin;
                      const mx = cx + (outerRadius + 14) * cos;
                      const my = cy + (outerRadius + 14) * sin;
                      const ex = mx + (cos >= 0 ? 1 : -1) * 16;
                      const ey = my;
                      const textAnchor = cos >= 0 ? "start" : "end";
                      return (
                        <g key={`lbl-${index}`}>
                          <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="#C9A89A" fill="none" strokeWidth={1} opacity={0.7} />
                          <circle cx={ex} cy={ey} r={1.5} fill="#C9A89A" />
                          <text x={ex + (cos >= 0 ? 5 : -5)} y={ey} textAnchor={textAnchor} dominantBaseline="middle"
                            style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fill: "#2C1810", letterSpacing: "0.04em" }}>
                            {name}
                          </text>
                        </g>
                      );
                    } : false}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {(chartData.length > 0 ? chartData : emptyData).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.55}
                        style={{ cursor: "pointer", transition: "opacity 0.25s" }}
                      />
                    ))}
                    <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "13px", fill: "#8C7B74", letterSpacing: "0.15em" }}>
                      TOTAL
                    </text>
                    <text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fill: "#2C1810" }}>
                      {total > 0 ? fmt(total) : "—"}
                    </text>
                  </Pie>
                  {chartData.length > 0 && (
                    <Tooltip content={<CustomTooltip />} />
                  )}
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            {chartData.length > 0 && (
              <div className="border border-border bg-card p-6 md:p-8">
                <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-secondary mb-6">Breakdown</p>
                <div className="space-y-3">
                  {chartData
                    .slice()
                    .sort((a, b) => b.value - a.value)
                    .map((entry) => {
                      const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0";
                      return (
                        <div key={entry.key} className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                          <span className="font-sans text-sm text-foreground flex-1">{entry.name}</span>
                          <span className="font-sans text-xs text-muted-foreground w-12 text-right">{pct}%</span>
                          <span className="font-serif text-base text-foreground w-24 text-right">{fmt(entry.value)}</span>
                        </div>
                      );
                    })}
                </div>
                <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
                  <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-secondary">Total</span>
                  <span className="font-serif text-xl text-foreground">{fmt(total)}</span>
                </div>
              </div>
            )}

            {chartData.length === 0 && (
              <div className="text-center py-8">
                <DollarSign className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3 stroke-[1]" />
                <p className="font-sans text-sm text-muted-foreground">
                  Enter amounts on the left to see your budget wheel come to life.
                </p>
              </div>
            )}
          </motion.div>
        </div>
        )}
      </div>
    </SectionAccordion>
  );
}
