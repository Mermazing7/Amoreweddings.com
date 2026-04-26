import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { VenueDiscovery } from "./venue-discovery";

export function VenueGallery() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const [discoveryOpen, setDiscoveryOpen] = useState(false);
  const [discoveryCategory, setDiscoveryCategory] = useState("All");

  function openDiscovery(category: string) {
    setDiscoveryCategory(category);
    setDiscoveryOpen(true);
  }

  return (
    <>
      <section className="py-16 md:py-24 bg-background overflow-hidden" id="venues">
        <div className="max-w-7xl mx-auto px-6 mb-10 md:mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#C9A89A] mb-5 block">Destinations</span>
            <h2 className="text-4xl md:text-6xl font-serif text-foreground">
              Spaces that <span className="italic text-[#8C7B74]">breathe</span>
            </h2>
          </motion.div>
        </div>

        <div className="px-6 md:px-12 h-[60vh] md:h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            onClick={() => openDiscovery("All")}
            className="w-full h-full relative overflow-hidden group cursor-pointer"
          >
            <motion.img
              style={{ y }}
              src="/images/venue.png"
              alt="Wedding venues"
              className="absolute inset-0 w-full h-[120%] object-cover object-center group-hover:scale-105 transition-transform duration-[2s] ease-out pointer-events-none"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors duration-500 pointer-events-none" />
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 text-white pointer-events-none">
              <h3 className="font-serif text-3xl md:text-5xl mb-2 md:mb-3">Discover Venues</h3>
              <p className="font-sans text-sm uppercase tracking-widest opacity-80 group-hover:opacity-100 flex items-center gap-2 transition-opacity duration-300">
                Browse by state
                <span className="inline-block w-4 h-[1px] bg-white/70 group-hover:w-10 transition-all duration-500" />
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <VenueDiscovery
        open={discoveryOpen}
        onClose={() => setDiscoveryOpen(false)}
        initialCategory={discoveryCategory}
      />
    </>
  );
}
