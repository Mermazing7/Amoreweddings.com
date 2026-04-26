import React from "react";
import { motion } from "framer-motion";

export function Editorial() {
  return (
    <section className="py-36 bg-[#EDE8E1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">

          {/* Text column */}
          <div className="md:col-span-5 space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <span className="block font-sans text-[10px] uppercase tracking-[0.28em] text-[#C9A89A] mb-6">The Vision</span>
              <h2 className="text-5xl md:text-6xl font-serif leading-[1.05] text-foreground">
                Art direction<br />
                <span className="italic text-[#8C7B74]">for your love.</span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-muted-foreground font-sans leading-relaxed"
            >
              Amore isn't just a planning tool — it's your digital creative director. Build mood boards, match colour palettes, and seamlessly share your aesthetic vision with vendors to ensure absolute cohesion on the big day.
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.35 }}
              onClick={() => document.getElementById("planning")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex items-center gap-3 font-sans text-xs uppercase tracking-[0.2em] text-foreground hover:text-[#C9A89A] transition-colors duration-300"
            >
              Create Moodboard
              <span className="w-8 h-[1px] bg-current inline-block group-hover:w-14 transition-all duration-500" />
            </motion.button>
          </div>

          {/* Image column */}
          <div className="md:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, ease: "easeOut" }}
              className="aspect-[4/5] overflow-hidden"
            >
              <img
                src="/images/bride.png"
                alt="Editorial bride"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2.5s] ease-out"
              />
            </motion.div>

            {/* Secondary image — offset inset */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.5 }}
              className="absolute -bottom-10 -left-8 w-[45%] aspect-[4/3] border-4 border-[#EDE8E1] overflow-hidden hidden md:block pointer-events-none shadow-2xl"
            >
              <img
                src="/images/dining.png"
                alt="Table setting"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
