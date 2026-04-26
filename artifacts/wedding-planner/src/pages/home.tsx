import React from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { VenueGallery } from "@/components/venue-gallery";
import { VenueDetails } from "@/components/venue-details";
import { ThemesAndColors } from "@/components/themes-and-colors";
import { PhotographerSection } from "@/components/photographer-section";
import { MusicSection } from "@/components/music-section";
import { WeddingPlanning } from "@/components/wedding-planning";
import { BudgetSection } from "@/components/budget-section";
import { Moodboard } from "@/components/moodboard";
import { PlanningTools } from "@/components/planning-tools";
import { TheProcess } from "@/components/process";
import { RegistryPromo } from "@/components/registry-promo";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { Ornament } from "@/components/ornament";
import { PullQuote } from "@/components/pull-quote";

export default function Home() {
  return (
    <div className="bg-background min-h-[100dvh] w-full overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <main>
        <Hero />
        <Features />

        <PullQuote attribution="The Amore promise" size="banner">
          Every detail <span className="text-[#C9A89A]">matters</span> — and we are here to make it happen.
        </PullQuote>

        <VenueGallery />
        <Ornament />

        <VenueDetails />
        <ThemesAndColors />

        <PhotographerSection />
        <MusicSection />
        <WeddingPlanning />
        <BudgetSection />
        <PlanningTools />

        <Ornament tone="sage" />

        <Moodboard />
        <TheProcess />

        <RegistryPromo />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
