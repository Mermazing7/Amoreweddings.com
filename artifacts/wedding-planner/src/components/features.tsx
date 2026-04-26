import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Venues, curated",
    description: "Estates, botanical gardens, vineyards, and breathtaking destinations — gathered with care and matched to your aesthetic.",
    number: "01"
  },
  {
    title: "Vendors you'll love",
    description: "Photographers, florists, and designers who understand modern romance and bring your vision to life with quiet excellence.",
    number: "02"
  },
  {
    title: "The guest list",
    description: "RSVPs, dietary notes, and seating arrangements — handled with grace, all in one beautifully simple place.",
    number: "03"
  },
  {
    title: "Budget, made easy",
    description: "Keep your vision grounded with intuitive, beautifully designed tools that take the stress out of every figure.",
    number: "04"
  }
];

export function Features() {
  return (
    <section className="py-16 md:py-24 px-8 md:px-12 bg-background" id="tools">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12 md:mb-16">
          <div className="md:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9 }}
            >
              <h2 className="text-5xl md:text-6xl font-serif text-foreground">
                A love story,<br />
                <span className="italic text-[#8C7B74]">beautifully planned.</span>
              </h2>
            </motion.div>
          </div>
          <div className="md:w-5/12 md:pt-8">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="text-lg text-muted-foreground font-sans leading-relaxed"
            >
              We've stripped away the clutter of traditional wedding planning. What remains is a thoughtful, refined suite designed to let you focus on what matters most: each other.
            </motion.p>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0 divide-y divide-border">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: idx * 0.08 }}
              className={`group cursor-default py-11 flex gap-8 items-start ${
                idx < 2 ? "border-t border-border" : ""
              }`}
            >
              <span className="font-sans text-[11px] text-[#C9A89A] tracking-widest pt-1 shrink-0 w-8">
                {feature.number}
              </span>
              <div className="flex-1">
                <h3 className="text-2xl font-serif text-foreground mb-3 group-hover:text-[#C9A89A] transition-colors duration-400">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-sans leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
