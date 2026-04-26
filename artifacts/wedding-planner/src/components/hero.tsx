import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { WeddingCountdown } from "./wedding-countdown";

const luxe = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <section
      ref={ref}
      className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-foreground paper-grain paper-grain-light"
    >
      <WeddingCountdown />

      {/* Parallax background image */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.65 }}
        transition={{ duration: 2.2, ease: luxe }}
        style={{ y, scale }}
        className="absolute inset-0 z-0 pointer-events-none will-change-transform"
      >
        <img
          src="/images/hero.png"
          alt="Lush wedding floral arrangement"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Dark scrim */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none z-[1]" />

      {/* Bottom gradient — blends hero into the next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#2C1810]/60 to-transparent pointer-events-none z-[2]" />

      {/* Content */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto mt-16"
      >
        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.95, ease: luxe }}
          className="ed-display text-white mb-12"
        >
          Curate your <br className="hidden md:block" />
          <span className="italic font-light">perfect</span> day.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.5, ease: luxe }}
          className="ed-body text-white/75 max-w-lg mx-auto mb-16"
        >
          Amore is the modern platform for couples who demand elegance, precision, and beauty in every detail.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.8, ease: luxe }}
        >
          <button
            onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-white text-foreground px-12 py-4 ed-micro hover:bg-[#C9A89A] hover:text-white transition-colors duration-700"
          >
            Begin Your Journey
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-2.5 z-10"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
