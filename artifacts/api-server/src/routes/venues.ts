import { Router } from "express";

const router = Router();

interface YelpBusiness {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  location: {
    city: string;
    state: string;
    address1: string;
  };
  url: string;
  categories: { alias: string; title: string }[];
  image_url?: string;
}

interface YelpResponse {
  businesses: YelpBusiness[];
  total: number;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Historic Estate": ["estate", "manor", "mansion", "castle", "historic", "plantation", "villa", "hall", "chateau", "house"],
  "Botanical Garden": ["garden", "botanical", "arboretum", "floral", "greenhouse", "conservatory", "park"],
  "Vineyard": ["vineyard", "winery", "wine", "cellar", "barrel", "vines", "wineyard"],
  "Beach & Waterfront": ["beach", "waterfront", "bay", "ocean", "lake", "pier", "marina", "harbor", "seaside", "shore", "cove"],
  "Mountain & Outdoor": ["mountain", "ranch", "farm", "barn", "outdoor", "lodge", "rustic", "forest", "canyon", "meadow", "ridge"],
  "Hotel & Ballroom": ["hotel", "ballroom", "resort", "inn", "club", "country club", "golf", "spa"],
};

function guessCategory(name: string, categories: { title: string }[]): string {
  const text = [name, ...categories.map((c) => c.title)].join(" ").toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) return cat;
  }
  return "Hotel & Ballroom";
}

function guessCapacity(reviewCount: number): string {
  if (reviewCount > 200) return "300+";
  if (reviewCount > 100) return "150–300";
  if (reviewCount > 50) return "80–150";
  return "Up to 100";
}

router.get("/venues/search", async (req, res) => {
  const apiKey = process.env.YELP_API_KEY;
  const { state, category } = req.query as { state?: string; category?: string };

  if (!state) {
    return res.status(400).json({ error: "state is required" });
  }

  if (!apiKey) {
    return res.status(503).json({ error: "YELP_API_KEY not configured", fallback: true });
  }

  try {
    const params = new URLSearchParams({
      location: state,
      term: "wedding venue",
      categories: "venues,eventsservices,weddingplanning",
      sort_by: "rating",
      limit: "20",
    });

    const response = await fetch(
      `https://api.yelp.com/v3/businesses/search?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: "Yelp API error", details: text, fallback: true });
    }

    const data = (await response.json()) as YelpResponse;

    const venues = data.businesses
      .filter((b) => b.rating >= 4.0)
      .map((b) => ({
        name: b.name,
        city: b.location.city,
        state: b.location.state,
        address: b.location.address1,
        category: guessCategory(b.name, b.categories),
        rating: b.rating,
        reviewCount: b.review_count,
        capacity: guessCapacity(b.review_count),
        description: b.categories.map((c) => c.title).join(", "),
        website: b.url,
        imageUrl: b.image_url ?? null,
        source: "yelp" as const,
      }));

    // Filter by category if requested
    const filtered =
      category && category !== "All"
        ? venues.filter((v) => v.category === category)
        : venues;

    return res.json({ venues: filtered, total: filtered.length, source: "yelp" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch from Yelp", fallback: true });
  }
});

export default router;
