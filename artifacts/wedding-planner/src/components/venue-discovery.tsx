import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Users, ExternalLink, MapPin, ChevronDown, Loader2, Wifi, WifiOff, Globe } from "lucide-react";
import { COUNTRIES, REGIONS_BY_COUNTRY, getVenuesByState, getVenuesByCountryRegion, type Venue } from "@/data/venue-data";

const CATEGORIES = ["All", "Top 10", "Historic Estate", "Botanical Garden", "Vineyard", "Beach & Waterfront", "Mountain & Outdoor", "Hotel & Ballroom"] as const;

interface LiveVenue extends Venue {
  reviewCount?: number;
  address?: string;
  imageUrl?: string | null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3 h-3 fill-[#C9A89A] text-[#C9A89A]" />
      <span className="font-sans text-xs text-[#C9A89A] font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

function VenueCard({ venue, index }: { venue: LiveVenue; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="bg-[#FAF7F2] border border-[#E8E0D8] p-6 flex flex-col gap-4 group"
    >
      {venue.imageUrl && (
        <div className="w-full h-36 overflow-hidden">
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C9A89A]">{venue.category}</p>
            {venue.source === "yelp" && (
              <span className="font-sans text-[9px] uppercase tracking-widest text-white bg-[#C9A89A] px-1.5 py-0.5">Yelp</span>
            )}
          </div>
          <h3 className="font-serif text-xl text-[#2C1810] leading-snug">{venue.name}</h3>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StarRating rating={venue.rating} />
          {venue.reviewCount && (
            <span className="font-sans text-[10px] text-[#8C7B74]">{venue.reviewCount} reviews</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-[#8C7B74]">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="font-sans text-xs">{venue.address ?? `${venue.city}, ${venue.state}`}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3 h-3 shrink-0" />
          <span className="font-sans text-xs">
            {venue.capacity.includes("–") || venue.capacity.includes("+") || venue.capacity.includes("Up")
              ? venue.capacity
              : `Up to ${venue.capacity} guests`}
          </span>
        </div>
      </div>

      <p className="font-sans text-sm text-[#8C7B74] leading-relaxed flex-1 line-clamp-3">{venue.description}</p>

      <a
        href={venue.website}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest text-[#2C1810] hover:text-[#C9A89A] transition-colors duration-300 border-b border-[#E8E0D8] pb-0.5 self-start"
      >
        Visit Website <ExternalLink className="w-3 h-3" />
      </a>
    </motion.div>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  initialCategory?: string;
}

export function VenueDiscovery({ open, onClose, initialCategory }: Props) {
  const [selectedCountry, setSelectedCountry] = useState<string>("United States");
  const [selectedState, setSelectedState] = useState("California");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory ?? "All");
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [liveVenues, setLiveVenues] = useState<LiveVenue[]>([]);
  const [loading, setLoading] = useState(false);
  const [usingYelp, setUsingYelp] = useState<boolean | null>(null);

  const regions = REGIONS_BY_COUNTRY[selectedCountry] ?? [];
  const isUS = selectedCountry === "United States";

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const fetchVenues = useCallback(async (country: string, state: string) => {
    setLoading(true);
    try {
      // Yelp lookup only for US states
      if (country === "United States") {
        const res = await fetch(`/api/venues/search?state=${encodeURIComponent(state)}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("not ok");
        const data = await res.json();
        if (data.fallback) {
          setUsingYelp(false);
          const staticVenues: LiveVenue[] = getVenuesByState(state).map((v) => ({ ...v, source: "static" as const }));
          setLiveVenues(staticVenues);
        } else {
          setUsingYelp(true);
          const yelpVenues: LiveVenue[] = data.venues ?? [];
          const staticVenues: LiveVenue[] = getVenuesByState(state).map((v) => ({ ...v, source: "static" as const }));
          const yelpNames = new Set(yelpVenues.map((v: LiveVenue) => v.name.toLowerCase()));
          const uniqueStatic = staticVenues.filter((v) => !yelpNames.has(v.name.toLowerCase()));
          setLiveVenues([...yelpVenues, ...uniqueStatic]);
        }
      } else {
        // International: curated only
        setUsingYelp(false);
        const staticVenues: LiveVenue[] = getVenuesByCountryRegion(country, state).map((v) => ({ ...v, source: "static" as const }));
        setLiveVenues(staticVenues);
      }
    } catch {
      setUsingYelp(false);
      const staticVenues: LiveVenue[] = (country === "United States"
        ? getVenuesByState(state)
        : getVenuesByCountryRegion(country, state)
      ).map((v) => ({ ...v, source: "static" as const }));
      setLiveVenues(staticVenues);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchVenues(selectedCountry, selectedState);
    }
  }, [open, selectedCountry, selectedState, fetchVenues]);

  const showingTopTen = selectedCategory === "Top 10";
  const venues = showingTopTen
    ? [...liveVenues].sort((a, b) => b.rating - a.rating).slice(0, 10)
    : liveVenues.filter((v) => selectedCategory === "All" || v.category === selectedCategory);

  const availableCategories = new Set(liveVenues.map((v) => v.category));

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:top-[5vh] md:bottom-[5vh] md:w-[90vw] md:max-w-5xl z-[210] bg-white flex flex-col max-h-[92dvh] md:max-h-none"
          >
            {/* Header */}
            <div className="px-8 py-7 border-b border-[#E8E0D8] flex items-start justify-between shrink-0">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C9A89A] mb-2">Venue Discovery</p>
                <h2 className="font-serif text-3xl text-[#2C1810]">Find your perfect venue</h2>
              </div>
              <div className="flex items-center gap-3">
                {usingYelp !== null && (
                  <div className="flex items-center gap-1.5">
                    {usingYelp ? (
                      <>
                        <Wifi className="w-3.5 h-3.5 text-[#C9A89A]" />
                        <span className="font-sans text-[10px] uppercase tracking-widest text-[#C9A89A]">Live via Yelp</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3.5 h-3.5 text-[#8C7B74]" />
                        <span className="font-sans text-[10px] uppercase tracking-widest text-[#8C7B74]">Curated</span>
                      </>
                    )}
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-[#8C7B74] hover:text-[#2C1810] transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="px-8 py-5 border-b border-[#E8E0D8] flex flex-col sm:flex-row gap-4 shrink-0 flex-wrap">
              {/* Country selector */}
              <div className="relative">
                <button
                  onClick={() => { setCountryOpen((o) => !o); setStateOpen(false); }}
                  className="flex items-center gap-2 border border-[#E8E0D8] bg-[#FAF7F2] px-4 py-2.5 font-sans text-sm text-[#2C1810] hover:border-[#C9A89A] transition-colors duration-300 min-w-[180px] justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-[#C9A89A]" />
                    {selectedCountry}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#8C7B74] transition-transform duration-200 ${countryOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {countryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 2 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 bg-white border border-[#E8E0D8] shadow-xl z-20 w-56 max-h-72 overflow-y-auto"
                    >
                      {COUNTRIES.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setSelectedCountry(c);
                            const firstRegion = REGIONS_BY_COUNTRY[c]?.[0] ?? "";
                            setSelectedState(firstRegion);
                            setCountryOpen(false);
                            setSelectedCategory("All");
                          }}
                          className={`w-full text-left px-4 py-2.5 font-sans text-sm transition-colors duration-200 ${
                            selectedCountry === c
                              ? "bg-[#FAF7F2] text-[#2C1810] font-medium"
                              : "text-[#8C7B74] hover:bg-[#FAF7F2] hover:text-[#2C1810]"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* State / Region selector */}
              <div className="relative">
                <button
                  onClick={() => { setStateOpen((o) => !o); setCountryOpen(false); }}
                  className="flex items-center gap-2 border border-[#E8E0D8] bg-[#FAF7F2] px-4 py-2.5 font-sans text-sm text-[#2C1810] hover:border-[#C9A89A] transition-colors duration-300 min-w-[180px] justify-between"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A89A]" />
                    {selectedState || (isUS ? "Select state" : "Select region")}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#8C7B74] transition-transform duration-200 ${stateOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {stateOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 2 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 bg-white border border-[#E8E0D8] shadow-xl z-10 w-56 max-h-72 overflow-y-auto"
                    >
                      {regions.map((s) => (
                        <button
                          key={s}
                          onClick={() => { setSelectedState(s); setStateOpen(false); setSelectedCategory("All"); }}
                          className={`w-full text-left px-4 py-2.5 font-sans text-sm transition-colors duration-200 ${
                            selectedState === s
                              ? "bg-[#FAF7F2] text-[#2C1810] font-medium"
                              : "text-[#8C7B74] hover:bg-[#FAF7F2] hover:text-[#2C1810]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const available = cat === "All" || cat === "Top 10" || availableCategories.has(cat as Venue["category"]);
                  return (
                    <button
                      key={cat}
                      onClick={() => available && setSelectedCategory(cat)}
                      disabled={!available}
                      className={`px-3 py-1.5 font-sans text-[11px] uppercase tracking-widest border transition-colors duration-300 ${
                        selectedCategory === cat
                          ? "bg-[#2C1810] text-white border-[#2C1810]"
                          : available
                          ? "border-[#E8E0D8] text-[#8C7B74] hover:border-[#C9A89A] hover:text-[#2C1810]"
                          : "border-[#E8E0D8] text-[#E8E0D8] cursor-not-allowed"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Venue grid */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <Loader2 className="w-6 h-6 text-[#C9A89A] animate-spin" />
                  <p className="font-sans text-sm text-[#8C7B74]">Finding venues in {selectedState}…</p>
                </div>
              ) : venues.length > 0 ? (
                <>
                  <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#8C7B74] mb-6">
                    {venues.length} venue{venues.length !== 1 ? "s" : ""} in {selectedState}
                    {selectedCategory !== "All" ? ` · ${selectedCategory}` : ""}
                    {usingYelp && " · Live results"}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {venues.map((venue, i) => (
                      <VenueCard key={`${venue.name}-${i}`} venue={venue} index={i} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <p className="font-serif text-2xl text-[#2C1810] mb-3">No venues found</p>
                  <p className="font-sans text-sm text-[#8C7B74] max-w-sm">
                    Try selecting a different category or a nearby state.
                  </p>
                </div>
              )}
            </div>

            {/* Footer — Yelp setup prompt */}
            {usingYelp === false && (
              <div className="px-8 py-4 border-t border-[#E8E0D8] bg-[#FAF7F2] shrink-0">
                <p className="font-sans text-[11px] text-[#8C7B74] text-center">
                  Connect a free Yelp API key to unlock live venue search across all 50 states.{" "}
                  <a
                    href="https://fusion.yelp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C9A89A] underline underline-offset-2 hover:text-[#2C1810] transition-colors"
                  >
                    Get a free key →
                  </a>
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
