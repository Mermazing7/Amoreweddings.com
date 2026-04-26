import React from "react";
import { motion } from "framer-motion";

export function PullQuote({
  children,
  attribution,
  tone = "ivory",
  size = "default",
}: {
  children: React.ReactNode;
  attribution?: string;
  tone?: "ivory" | "dark";
  size?: "default" | "banner";
}) {
  const isDark = tone === "dark";
  const isBanner = size === "banner";

  return (
    <section
      className={`${
        isDark ? "bg-[#2C1810] paper-grain paper-grain-light" : "bg-[#FAF7F2] paper-grain"
      } ${isBanner ? "py-14 md:py-20" : "py-28 md:py-40"} px-8`}
    >
      <div className={`${isBanner ? "max-w-3xl" : "max-w-3xl"} mx-auto text-center`}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <p
            className={`font-serif italic font-light ${
              isBanner ? "text-xl md:text-2xl leading-[1.4]" : "text-2xl md:text-4xl leading-[1.3]"
            } ${isDark ? "text-white/90" : "text-[#2C1810]"}`}
            style={{ letterSpacing: "-0.01em" }}
          >
            <span
              aria-hidden
              className={`font-serif not-italic mr-1 align-baseline ${
                isDark ? "text-[#C9A89A]/55" : "text-[#C9A89A]"
              }`}
              style={{ fontSize: isBanner ? "1.6em" : "1.4em", lineHeight: 0 }}
            >
              &ldquo;
            </span>
            {children}
            <span
              aria-hidden
              className={`font-serif not-italic ml-0.5 align-baseline ${
                isDark ? "text-[#C9A89A]/55" : "text-[#C9A89A]"
              }`}
              style={{ fontSize: isBanner ? "1.6em" : "1.4em", lineHeight: 0 }}
            >
              &rdquo;
            </span>
          </p>
          {attribution && (
            <p className={`mt-6 ed-micro ${isDark ? "text-white/40" : "text-[#8C7B74]"}`}>
              {attribution}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
