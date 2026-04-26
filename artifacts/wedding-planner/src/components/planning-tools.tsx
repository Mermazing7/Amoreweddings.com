import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, CalendarHeart, ListTodo, ChevronDown } from "lucide-react";
import { GuestListManager } from "./guest-list-manager";
import { TimelineBuilder } from "./timeline-builder";
import { UnifiedChecklist } from "./unified-checklist";

interface Tool {
  icon: React.ReactNode;
  label: string;
  title: string;
  italicWord: string;
  description: string;
  details: string[];
  storageKey: string;
  customContent?: React.ReactNode;
}

const tools: Tool[] = [
  {
    icon: <Users className="w-4 h-4" />,
    label: "Guest Management",
    title: "Guest List &",
    italicWord: "RSVP.",
    description: "Add guests, track RSVPs, dietary needs, plus-ones, and table assignments.",
    details: [],
    storageKey: "guests",
    customContent: <GuestListManager />,
  },
  {
    icon: <CalendarHeart className="w-4 h-4" />,
    label: "Day-Of Timeline",
    title: "Timeline",
    italicWord: "Builder.",
    description: "Add every event in your wedding day, sorted by time — from getting ready to grand send-off.",
    storageKey: "timeline",
    details: [],
    customContent: <TimelineBuilder />,
  },
  {
    icon: <ListTodo className="w-4 h-4" />,
    label: "Planning Roadmap",
    title: "Unified",
    italicWord: "Checklist.",
    description: "A month-by-month roadmap from 12 months out to the morning of — with custom tasks.",
    storageKey: "checklist",
    details: [],
    customContent: <UnifiedChecklist />,
  },
];

function ToolRow({ tool, index }: { tool: Tool; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.7, delay: index * 0.07 }}
      className="border-b border-[#E8E0D8] last:border-b-0"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-6 md:px-12 py-9 flex items-center justify-between gap-4 group hover:bg-white transition-colors duration-300 cursor-pointer"
      >
        <div className="flex items-center gap-5">
          <div
            className={`w-11 h-11 border flex items-center justify-center shrink-0 transition-colors duration-300 ${
              open
                ? "border-[#2C1810] text-[#2C1810]"
                : "border-[#E8E0D8] text-[#8C7B74] group-hover:border-[#C9A89A] group-hover:text-[#C9A89A]"
            }`}
          >
            {tool.icon}
          </div>
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#C9A89A] mb-1">
              {tool.label}
            </p>
            <h3 className="font-serif text-2xl md:text-3xl text-[#2C1810]" style={{ letterSpacing: "-0.01em" }}>
              {tool.title} <span className="italic text-[#8C7B74]">{tool.italicWord}</span>
            </h3>
            <p className="font-sans text-[11px] text-[#8C7B74] mt-1 hidden md:block max-w-md tracking-wide">
              {tool.description}
            </p>
          </div>
        </div>
        <div
          className={`w-8 h-8 border border-[#E8E0D8] flex items-center justify-center text-[#8C7B74] shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-12 pb-10 pt-6 bg-white border-t border-[#E8E0D8]">
              <p className="font-sans text-sm text-[#8C7B74] md:hidden mb-6 leading-relaxed">
                {tool.description}
              </p>

              {tool.customContent ? (
                tool.customContent
              ) : (
                <>
                  <ul className="space-y-3 max-w-2xl">
                    {tool.details.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-2 w-1 h-1 rounded-full bg-[#C9A89A] shrink-0" />
                        <p className="font-sans text-sm text-[#2C1810]/70 leading-relaxed">{point}</p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-8 font-sans text-[10px] uppercase tracking-[0.25em] text-[#C9A89A]">
                    Coming soon
                  </p>
                </>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function PlanningTools() {
  return (
    <section className="py-16 md:py-24 px-8 md:px-12 bg-[#F5F1EC]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <span className="block font-sans text-[10px] uppercase tracking-[0.28em] text-[#C9A89A] mb-6">
              Tools
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6 leading-tight">
              Intelligence meets <span className="italic text-[#8C7B74]">elegance.</span>
            </h2>
            <p className="text-muted-foreground font-sans leading-relaxed">
              Behind the beautiful aesthetics lies a powerful engine designed to manage the complexity of modern celebrations.
            </p>
          </motion.div>
        </div>

        <div className="border border-[#E8E0D8] bg-[#FAF7F2]">
          {tools.map((tool, idx) => (
            <ToolRow key={tool.title} tool={tool} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
