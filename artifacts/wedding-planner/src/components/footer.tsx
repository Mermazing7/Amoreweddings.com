import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import aboutPhoto from "@assets/DC17E956-D8BD-40B5-B88A-56B460142444_1776990974783.jpeg";

const SUPPORT_EMAIL = "Amoresupport@gmail.com";

export function Footer() {
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <footer className="bg-[#FAF7F2] border-t border-[#E8E0D8]">

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-8 md:px-12 py-20 grid grid-cols-2 md:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="col-span-2">
          <h2 className="font-serif text-3xl text-[#2C1810] tracking-[0.08em] mb-5">Amore</h2>
          <p className="text-[#8C7B74] font-sans text-sm leading-relaxed max-w-xs">
            Elevating the art of wedding planning for the modern romantic. Every detail, beautifully considered.
          </p>
        </div>

        {/* Platform */}
        <div>
          <h4 className="font-sans text-[9px] uppercase tracking-[0.22em] text-[#8C7B74] mb-6">Platform</h4>
          <ul className="space-y-4">
            {["Planning Tools", "Venues", "Vendors"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="font-sans text-sm text-[#2C1810] hover:text-[#C9A89A] transition-colors duration-300"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-sans text-[9px] uppercase tracking-[0.22em] text-[#8C7B74] mb-6">Company</h4>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => { setShowAbout((v) => !v); setShowContact(false); }}
                className="font-sans text-sm text-[#2C1810] hover:text-[#C9A89A] transition-colors duration-300"
              >
                About us
              </button>
            </li>
            <li>
              <button
                onClick={() => { setShowContact((v) => !v); setShowAbout(false); }}
                className="font-sans text-sm text-[#2C1810] hover:text-[#C9A89A] transition-colors duration-300"
              >
                Contact us
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* About reveal */}
      {showAbout && (
        <div className="border-t border-[#E8E0D8] max-w-7xl mx-auto px-8 md:px-12 py-12 bg-white grid md:grid-cols-2 gap-10 md:gap-14 items-start">
          <div className="relative overflow-hidden shadow-[0_30px_60px_-25px_rgba(44,24,16,0.45)] paper-grain paper-grain-light">
            <img
              src={aboutPhoto}
              alt="The couple behind Amore at Alki Beach, Seattle"
              className="w-full h-auto object-cover opacity-95"
              style={{ filter: "sepia(0.18) saturate(0.9) contrast(1.02)" }}
            />
            <div className="absolute inset-0 bg-[#2C1810]/15 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#2C1810]/45 to-transparent pointer-events-none" />
          </div>
          <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#C9A89A] mb-4">
            Our Story
          </p>
          <h3 className="font-serif text-3xl text-[#2C1810] mb-5">
            About <em className="italic">Amore</em>
          </h3>
          <div className="font-sans text-sm leading-relaxed text-[#5C4A42] space-y-4">
            <p>
              Amore began on a quiet evening at Alki Beach in Seattle, where the
              waves rolled in like a slow, romantic refrain — each one whispering
              against the shore as one woman knelt in the sand to ask the love of
              her life to marry her. She said yes — and with that single word,
              two lives, two stories, and two futures folded gently into one.
            </p>
            <p>
              In the days that followed, she went looking for a place to hold it
              all — the dreaming, the lists, the small sacred details that make a
              wedding feel like <em className="italic">yours</em>. She couldn't
              find one that felt the way her love did: tender, thoughtful, with
              a spark of beauty. So she decided to build it herself, pouring in
              every ounce of care she'd give her own day, determined to perfect it
              for the brides and grooms and couples who would come after her.
            </p>
            <p>
              Amore is that love letter, made into a workspace. It is for every
              couple writing the opening lines of their forever — may your
              planning feel as gentle, and as full of wonder, as the moment you
              first said yes.
            </p>
          </div>
          </div>
        </div>
      )}

      {/* Contact reveal */}
      {showContact && (
        <div className="border-t border-[#E8E0D8] max-w-7xl mx-auto px-8 md:px-12 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white">
          <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#8C7B74]">
            Reach us at
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-serif text-lg text-[#2C1810] hover:text-[#C9A89A] transition-colors duration-300"
          >
            {SUPPORT_EMAIL}
          </a>
          <button
            onClick={copyEmail}
            className="ml-auto inline-flex items-center gap-1.5 border border-[#E8E0D8] px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.18em] text-[#8C7B74] hover:border-[#C9A89A] hover:text-[#C9A89A] transition-colors duration-300"
          >
            {copied ? (
              <><Check className="w-3 h-3" /> Copied</>
            ) : (
              <><Copy className="w-3 h-3" /> Copy</>
            )}
          </button>
        </div>
      )}

      {/* Bottom bar */}
      <div className="border-t border-[#E8E0D8] max-w-7xl mx-auto px-8 md:px-12 py-7 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8C7B74]/60">
          © {new Date().getFullYear()} Amore. All rights reserved.
        </p>
        <button
          onClick={() => { setShowContact((v) => !v); setShowAbout(false); }}
          className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8C7B74]/60 hover:text-[#2C1810] transition-colors duration-300"
        >
          Contact us
        </button>
      </div>

    </footer>
  );
}
