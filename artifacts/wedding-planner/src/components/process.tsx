import React from "react";
import { motion } from "framer-motion";

export function TheProcess() {
  const steps = [
    { num: "I", title: "Conversation", desc: "We begin by understanding your shared vision, personal style, and the feeling you want your guests to carry with them forever." },
    { num: "II", title: "Curation", desc: "A bespoke selection of venues, vendors, and design concepts — tailored to your aesthetic and your budget." },
    { num: "III", title: "Celebration", desc: "From the first deposit to the final dance, every detail is held with care so you can remain fully present." }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#2C1810]">
      <div className="max-w-7xl mx-auto px-8 md:px-12">

        <div className="flex flex-col md:flex-row gap-20 md:gap-32">

          {/* Left — sticky label + intro */}
          <div className="md:w-5/12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="md:sticky md:top-32"
            >
              <span className="block font-sans text-[10px] uppercase tracking-[0.28em] text-[#C9A89A] mb-8">Our Approach</span>
              <h2 className="text-4xl md:text-5xl font-serif text-white leading-[1.05] mb-8">
                How it <span className="italic text-[#C9A89A]">unfolds.</span>
              </h2>
              <p className="text-white/50 font-sans leading-relaxed text-sm max-w-sm">
                Planning a wedding should be one of the most joyful seasons of your life, not a second job. Our approach gives you back your time while ensuring every detail is held with intention.
              </p>
            </motion.div>
          </div>

          {/* Right — steps */}
          <div className="md:w-7/12 divide-y divide-white/10">
            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, delay: idx * 0.15 }}
                className="group py-10 first:pt-0 last:pb-0 flex gap-10"
              >
                <div className="font-serif text-[3.5rem] leading-none text-white/10 group-hover:text-[#C9A89A]/30 transition-colors duration-500 pt-1 shrink-0 w-10 text-right">
                  {step.num}
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-serif text-white mb-4 group-hover:text-[#C9A89A] transition-colors duration-400">{step.title}</h3>
                  <p className="text-white/50 font-sans leading-relaxed text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
