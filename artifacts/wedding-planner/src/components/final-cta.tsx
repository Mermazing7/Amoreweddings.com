import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export function FinalCta() {
  const [, navigate] = useLocation();
  return (
    <section className="relative py-52 bg-[#1A0E08] flex items-center justify-center overflow-hidden">
      {/* Background image overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/images/couple2.png"
          alt="Couple in garden"
          className="w-full h-full object-cover object-center grayscale opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A0E08]/60 via-transparent to-[#1A0E08]/80" />
      </div>

      {/* Thin ornamental rule */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-6 z-10">
        <div className="w-16 h-[1px] bg-white/20" />
        <div className="w-1.5 h-1.5 bg-[#C9A89A]/60 rotate-45" />
        <div className="w-16 h-[1px] bg-white/20" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1 }}
          className="bg-[#1A0E08]/55 backdrop-blur-md border border-white/10 px-8 py-14 md:px-16 md:py-20"
        >
          <span className="block font-sans text-[10px] uppercase tracking-[0.3em] text-[#C9A89A] mb-10">The Beginning</span>
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-[1.05]">
            Forever begins<br />
            <span className="italic text-white/85">with a single yes.</span>
          </h2>
          <p className="text-base font-sans text-white/75 mb-14 max-w-md mx-auto leading-relaxed">
            Every great love story deserves a planning experience as thoughtful as the day itself.
          </p>
          <button
            onClick={() => navigate("/sign-up")}
            className="border border-white/40 text-white px-14 py-4 font-sans uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-[#2C1810] transition-all duration-500"
          >
            Begin Planning
          </button>
        </motion.div>
      </div>

      {/* Bottom ornament */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-6 z-10">
        <div className="w-16 h-[1px] bg-white/20" />
        <div className="w-1.5 h-1.5 bg-[#C9A89A]/60 rotate-45" />
        <div className="w-16 h-[1px] bg-white/20" />
      </div>
    </section>
  );
}
