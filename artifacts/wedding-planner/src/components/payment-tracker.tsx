import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Square } from "lucide-react";

const STORAGE_KEY = "amore_payments";

const VENDORS = [
  { key: "venue", label: "Venue" },
  { key: "caterer", label: "Catering" },
  { key: "photographer", label: "Photographer" },
  { key: "videographer", label: "Videographer" },
  { key: "florist", label: "Florals" },
  { key: "dj", label: "DJ / Music" },
  { key: "cake", label: "Cake & Desserts" },
  { key: "hairMakeup", label: "Hair & Makeup" },
  { key: "officiant", label: "Officiant" },
  { key: "transport", label: "Transportation" },
  { key: "attire", label: "Attire" },
  { key: "misc", label: "Miscellaneous" },
];

interface PaymentRow {
  vendorName: string;
  depositAmount: string;
  depositPaid: boolean;
  depositDate: string;
  finalAmount: string;
  finalDueDate: string;
  finalPaid: boolean;
}

type Payments = Record<string, PaymentRow>;

function fmt(val: string) {
  const n = parseFloat(val.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? "" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function totalNum(val: string) {
  const n = parseFloat(val.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

function FieldInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-transparent border-b border-[#E8E0D8] py-1.5 font-sans text-xs text-[#2C1810] placeholder:text-[#8C7B74]/40 focus:outline-none focus:border-[#C9A89A] transition-colors duration-300"
    />
  );
}

export function PaymentTracker() {
  const [payments, setPayments] = useState<Payments>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPayments(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  function getRow(key: string): PaymentRow {
    return payments[key] ?? { vendorName: "", depositAmount: "", depositPaid: false, depositDate: "", finalAmount: "", finalDueDate: "", finalPaid: false };
  }

  function setField<K extends keyof PaymentRow>(key: string, field: K, value: PaymentRow[K]) {
    const updated = { ...payments, [key]: { ...getRow(key), [field]: value } };
    setPayments(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  const rows = VENDORS.map((v) => ({ ...v, row: getRow(v.key) }));

  const totalDeposits = rows.reduce((s, v) => s + (v.row.depositPaid ? totalNum(v.row.depositAmount) : 0), 0);
  const totalFinal = rows.reduce((s, v) => s + (v.row.finalPaid ? totalNum(v.row.finalAmount) : 0), 0);
  const outstandingDeposits = rows.reduce((s, v) => s + (!v.row.depositPaid && v.row.depositAmount ? totalNum(v.row.depositAmount) : 0), 0);
  const outstandingFinal = rows.reduce((s, v) => s + (!v.row.finalPaid && v.row.finalAmount ? totalNum(v.row.finalAmount) : 0), 0);
  const totalPaid = totalDeposits + totalFinal;
  const totalOutstanding = outstandingDeposits + outstandingFinal;

  return (
    <div className="space-y-6">
      {/* Summary */}
      {totalPaid + totalOutstanding > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-px bg-[#E8E0D8] border border-[#E8E0D8]"
        >
          {[
            { label: "Total Paid", value: fmt(String(totalPaid)), positive: true },
            { label: "Outstanding", value: fmt(String(totalOutstanding)), positive: false },
          ].map((s) => (
            <div key={s.label} className="bg-[#FAF7F2] px-5 py-4 text-center">
              <p className={`font-serif text-2xl ${s.positive ? "text-[#4A7C59]" : "text-[#2C1810]"}`}>{s.value || "—"}</p>
              <p className="font-sans text-[10px] uppercase tracking-widest text-[#8C7B74] mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-[#E8E0D8]">
              <th className="text-left py-3 pr-4 font-sans text-[10px] uppercase tracking-[0.2em] text-[#8C7B74] w-28">Vendor</th>
              <th className="text-left py-3 pr-4 font-sans text-[10px] uppercase tracking-[0.2em] text-[#8C7B74]">Vendor Name</th>
              <th className="text-left py-3 pr-3 font-sans text-[10px] uppercase tracking-[0.2em] text-[#8C7B74]">Deposit</th>
              <th className="text-left py-3 pr-3 font-sans text-[10px] uppercase tracking-[0.2em] text-[#C9A89A] w-8">Paid</th>
              <th className="text-left py-3 pr-3 font-sans text-[10px] uppercase tracking-[0.2em] text-[#8C7B74]">Date Paid</th>
              <th className="text-left py-3 pr-3 font-sans text-[10px] uppercase tracking-[0.2em] text-[#8C7B74]">Final Amount</th>
              <th className="text-left py-3 pr-3 font-sans text-[10px] uppercase tracking-[0.2em] text-[#8C7B74]">Due Date</th>
              <th className="text-left py-3 font-sans text-[10px] uppercase tracking-[0.2em] text-[#C9A89A] w-8">Paid</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v.key} className="border-b border-[#E8E0D8]/60 group hover:bg-[#FAF7F2] transition-colors duration-200">
                <td className="py-3 pr-4">
                  <p className="font-sans text-xs text-[#2C1810] font-medium">{v.label}</p>
                </td>
                <td className="py-3 pr-4">
                  <FieldInput
                    value={v.row.vendorName}
                    onChange={(e) => setField(v.key, "vendorName", e.target.value)}
                    placeholder="Name…"
                  />
                </td>
                <td className="py-3 pr-3">
                  <FieldInput
                    value={v.row.depositAmount}
                    onChange={(e) => setField(v.key, "depositAmount", e.target.value)}
                    placeholder="$0"
                  />
                </td>
                <td className="py-3 pr-3">
                  <button
                    onClick={() => setField(v.key, "depositPaid", !v.row.depositPaid)}
                    className="text-[#C9A89A] hover:text-[#2C1810] transition-colors duration-200"
                  >
                    {v.row.depositPaid ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </button>
                </td>
                <td className="py-3 pr-3">
                  <FieldInput
                    type="date"
                    value={v.row.depositDate}
                    onChange={(e) => setField(v.key, "depositDate", e.target.value)}
                  />
                </td>
                <td className="py-3 pr-3">
                  <FieldInput
                    value={v.row.finalAmount}
                    onChange={(e) => setField(v.key, "finalAmount", e.target.value)}
                    placeholder="$0"
                  />
                </td>
                <td className="py-3 pr-3">
                  <FieldInput
                    type="date"
                    value={v.row.finalDueDate}
                    onChange={(e) => setField(v.key, "finalDueDate", e.target.value)}
                  />
                </td>
                <td className="py-3">
                  <button
                    onClick={() => setField(v.key, "finalPaid", !v.row.finalPaid)}
                    className="text-[#C9A89A] hover:text-[#2C1810] transition-colors duration-200"
                  >
                    {v.row.finalPaid ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="font-sans text-[11px] text-[#8C7B74] uppercase tracking-widest">
        All changes save automatically
      </p>
    </div>
  );
}
