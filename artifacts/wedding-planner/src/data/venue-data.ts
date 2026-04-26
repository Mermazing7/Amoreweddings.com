export interface Venue {
  name: string;
  city: string;
  state: string;
  country?: string;
  category: "Historic Estate" | "Botanical Garden" | "Vineyard" | "Beach & Waterfront" | "Mountain & Outdoor" | "Hotel & Ballroom";
  rating: number;
  capacity: string;
  description: string;
  website: string;
  source?: "static" | "yelp";
}

export const COUNTRIES = [
  "United States",
  "Italy",
  "France",
  "Mexico",
  "Spain",
  "Greece",
  "United Kingdom",
  "Portugal",
  "Caribbean",
] as const;

export const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
];

export const REGIONS_BY_COUNTRY: Record<string, string[]> = {
  "United States": US_STATES,
  "Italy": ["Tuscany", "Amalfi Coast", "Lake Como", "Sicily", "Rome", "Venice", "Puglia"],
  "France": ["Provence", "French Riviera", "Paris", "Loire Valley", "Bordeaux", "Champagne"],
  "Mexico": ["Riviera Maya", "Los Cabos", "Tulum", "Puerto Vallarta", "San Miguel de Allende"],
  "Spain": ["Mallorca", "Ibiza", "Barcelona", "Andalusia", "Marbella"],
  "Greece": ["Santorini", "Mykonos", "Crete", "Athens", "Corfu"],
  "United Kingdom": ["Cotswolds", "Lake District", "Scottish Highlands", "London", "Cornwall"],
  "Portugal": ["Algarve", "Lisbon", "Douro Valley", "Sintra"],
  "Caribbean": ["Bahamas", "Jamaica", "St. Lucia", "Turks & Caicos", "Barbados"],
};

export const VENUES: Venue[] = [
  // ── California ──────────────────────────────────────────────────────────────
  { name: "Filoli Historic House & Garden", city: "Woodside", state: "California", category: "Historic Estate", rating: 4.9, capacity: "200", description: "A magnificent 36,000 sq ft Georgian Revival house surrounded by 16 acres of formal gardens — one of California's most celebrated estate venues.", website: "https://filoli.org" },
  { name: "Huntington Library Gardens", city: "San Marino", state: "California", category: "Botanical Garden", rating: 4.9, capacity: "300", description: "Spectacular 120-acre botanical gardens including a rose garden, Japanese garden, and desert garden — a living masterpiece.", website: "https://huntington.org" },
  { name: "Sunstone Winery", city: "Santa Ynez", state: "California", category: "Vineyard", rating: 4.8, capacity: "250", description: "Tuscan-inspired winery estate in the Santa Ynez Valley with sweeping vineyard views and elegant stone architecture.", website: "https://sunstonewinery.com" },
  { name: "Calamigos Ranch", city: "Malibu", state: "California", category: "Mountain & Outdoor", rating: 4.8, capacity: "400", description: "A lush 32-acre estate in the mountains above Malibu with rustic elegance, oak trees, and multiple event spaces.", website: "https://calamigoranch.com" },
  { name: "The Greystone Mansion", city: "Beverly Hills", state: "California", category: "Historic Estate", rating: 4.9, capacity: "200", description: "A stunning 46,000 sq ft Tudor-style manor set on 18 manicured acres in Beverly Hills — one of the most iconic estate venues in the country.", website: "https://greystonemansion.org" },
  { name: "Holman Ranch", city: "Carmel Valley", state: "California", category: "Vineyard", rating: 4.9, capacity: "200", description: "A breathtaking 400-acre estate in Carmel Valley with a 1927 ranch house, private wine caves, and sweeping vineyard terraces.", website: "https://holmanranch.com" },
  { name: "Bel Air Bay Club", city: "Pacific Palisades", state: "California", category: "Beach & Waterfront", rating: 4.7, capacity: "300", description: "A private beachside club in the Pacific Palisades with sweeping ocean views, manicured gardens, and an iconic California setting.", website: "https://belairbayclubevents.com" },

  // ── New York ─────────────────────────────────────────────────────────────────
  { name: "The Foundry", city: "Long Island City", state: "New York", category: "Historic Estate", rating: 4.8, capacity: "300", description: "A beautifully restored 19th-century iron foundry with brick walls, skylights, and a lush garden courtyard just minutes from Manhattan.", website: "https://thefoundrynyc.com" },
  { name: "New York Botanical Garden", city: "Bronx", state: "New York", category: "Botanical Garden", rating: 4.9, capacity: "500", description: "250 acres of living collections and gardens in the heart of New York City, including a Victorian-era glasshouse and romantic rose garden.", website: "https://nybg.org" },
  { name: "Oheka Castle", city: "Cold Spring Hills", state: "New York", category: "Historic Estate", rating: 4.9, capacity: "350", description: "One of the grandest estates in America — a 23-acre French-inspired château that served as inspiration for The Great Gatsby.", website: "https://oheka.com" },
  { name: "The Ritz-Carlton New York", city: "New York City", state: "New York", category: "Hotel & Ballroom", rating: 4.8, capacity: "400", description: "Legendary five-star grandeur overlooking Central Park with ornate ballrooms and unparalleled white-glove service.", website: "https://ritzcarlton.com/new-york" },
  { name: "Whitby Castle", city: "Rye", state: "New York", category: "Historic Estate", rating: 4.7, capacity: "250", description: "A romantic 1852 Gothic Revival castle on Long Island Sound offering private ballrooms, seaside gardens, and incomparable history.", website: "https://ryegolfclub.com" },

  // ── Texas ─────────────────────────────────────────────────────────────────────
  { name: "The Olana", city: "Hickory Creek", state: "Texas", category: "Historic Estate", rating: 4.9, capacity: "500", description: "A lavish 22-acre estate with a European-inspired chateau, formal gardens, and a private lake — one of Texas's most luxurious venues.", website: "https://theolana.com" },
  { name: "Avant Garden", city: "Houston", state: "Texas", category: "Botanical Garden", rating: 4.8, capacity: "200", description: "An enchanting urban garden venue in Houston's vibrant Montrose neighborhood featuring lush botanical installations and romantic lighting.", website: "https://avantgardenhouston.com" },
  { name: "Ma Maison", city: "Dripping Springs", state: "Texas", category: "Historic Estate", rating: 4.8, capacity: "250", description: "A stunning French country estate nestled in the Texas Hill Country with sprawling vineyards, fountains, and European architecture.", website: "https://mamaison.net" },
  { name: "Pecan Springs Ranch", city: "Austin", state: "Texas", category: "Mountain & Outdoor", rating: 4.8, capacity: "300", description: "A picturesque 30-acre Hill Country ranch with limestone architecture, a spring-fed creek, and towering pecan trees.", website: "https://pecanspringsranch.com" },
  { name: "Camp Lucy", city: "Dripping Springs", state: "Texas", category: "Mountain & Outdoor", rating: 4.9, capacity: "300", description: "A 289-acre resort in the Texas Hill Country with a variety of stunning ceremony sites including chapel ruins, a grand barn, and riverside lawns.", website: "https://camplucy.com" },
  { name: "Vintner's Daughter", city: "Fredericksburg", state: "Texas", category: "Vineyard", rating: 4.8, capacity: "200", description: "A boutique vineyard and event estate in the heart of Fredericksburg wine country, with a stunning hilltop setting and handcrafted wines.", website: "https://vintnersdaughter.com" },

  // ── Florida ───────────────────────────────────────────────────────────────────
  { name: "Vizcaya Museum & Gardens", city: "Miami", state: "Florida", category: "Historic Estate", rating: 4.9, capacity: "400", description: "A National Historic Landmark with an Italian Renaissance villa set amid 10 acres of formal European gardens overlooking Biscayne Bay.", website: "https://vizcaya.org" },
  { name: "Bok Tower Gardens", city: "Lake Wales", state: "Florida", category: "Botanical Garden", rating: 4.9, capacity: "200", description: "A National Historic Landmark featuring 250 acres of gardens, a 205-ft singing tower, and serene reflecting pools.", website: "https://boktowergardens.org" },
  { name: "The Powel Crosley Estate", city: "Sarasota", state: "Florida", category: "Historic Estate", rating: 4.8, capacity: "300", description: "A stunning 1929 Mediterranean Revival estate on Sarasota Bay, one of the most celebrated historic venues in Florida.", website: "https://powelcrosleyestate.com" },
  { name: "Four Seasons Orlando", city: "Orlando", state: "Florida", category: "Hotel & Ballroom", rating: 4.9, capacity: "500", description: "Incomparable luxury at Walt Disney World with world-class ballrooms, manicured grounds, and legendary Four Seasons service.", website: "https://fourseasons.com/orlando" },
  { name: "The Breakers Palm Beach", city: "Palm Beach", state: "Florida", category: "Hotel & Ballroom", rating: 4.9, capacity: "600", description: "A legendary Italian Renaissance resort on the Palm Beach oceanfront, offering ornate grand ballrooms and a century of celebration.", website: "https://thebreakers.com" },

  // ── Georgia ───────────────────────────────────────────────────────────────────
  { name: "Barnsley Resort", city: "Adairsville", state: "Georgia", category: "Historic Estate", rating: 4.9, capacity: "300", description: "A 3,000-acre English manor estate in the rolling hills of North Georgia, complete with romantic gardens and European architecture.", website: "https://barnsleyresort.com" },
  { name: "Atlanta Botanical Garden", city: "Atlanta", state: "Georgia", category: "Botanical Garden", rating: 4.9, capacity: "500", description: "A world-class botanical garden in the heart of Atlanta's Piedmont Park, featuring the stunning Linenfold Pavilion and rose garden.", website: "https://atlantabg.org" },
  { name: "Foxhall Resort", city: "Atlanta", state: "Georgia", category: "Mountain & Outdoor", rating: 4.8, capacity: "400", description: "A 1,100-acre private resort just west of Atlanta with creekside venues, a lakefront chapel, and sweeping outdoor spaces.", website: "https://foxhallresort.com" },
  { name: "The Biltmore Ballrooms", city: "Atlanta", state: "Georgia", category: "Hotel & Ballroom", rating: 4.8, capacity: "500", description: "A breathtaking 1924 beaux-arts landmark in Midtown Atlanta featuring ornate ballrooms, soaring ceilings, and timeless elegance.", website: "https://biltmoreatlanta.com" },

  // ── Colorado ──────────────────────────────────────────────────────────────────
  { name: "Devils Thumb Ranch", city: "Tabernash", state: "Colorado", category: "Mountain & Outdoor", rating: 4.9, capacity: "200", description: "A 6,000-acre mountain ranch nestled in a glacial valley with the Continental Divide as a backdrop — pure Colorado wilderness.", website: "https://devilsthumbranch.com" },
  { name: "The Stanley Hotel", city: "Estes Park", state: "Colorado", category: "Historic Estate", rating: 4.8, capacity: "300", description: "The iconic historic hotel that inspired Stephen King's The Shining, set against spectacular Rocky Mountain scenery.", website: "https://stanleyhotel.com" },
  { name: "Della Terra Mountain Chateau", city: "Estes Park", state: "Colorado", category: "Historic Estate", rating: 4.9, capacity: "150", description: "A European-inspired mountain chateau perched at 8,000 feet with panoramic views of the Rocky Mountains and glowing stone architecture.", website: "https://dellaterraevents.com" },
  { name: "Denver Botanic Gardens", city: "Denver", state: "Colorado", category: "Botanical Garden", rating: 4.8, capacity: "400", description: "A stunning urban oasis in the heart of Denver featuring the romantic Monet Pool, Japanese garden, and tropical conservatory.", website: "https://botanicgardens.org" },
  { name: "Cielo at Castle Pines", city: "Castle Rock", state: "Colorado", category: "Mountain & Outdoor", rating: 4.8, capacity: "250", description: "A hilltop venue with panoramic Front Range views, set amid the rolling meadows and pine forests south of Denver.", website: "https://cieloatcastlepines.com" },

  // ── Virginia ──────────────────────────────────────────────────────────────────
  { name: "The Inn at Little Washington", city: "Washington", state: "Virginia", category: "Historic Estate", rating: 4.9, capacity: "100", description: "Patrick O'Connell's legendary inn in the foothills of the Blue Ridge Mountains — a James Beard Award backdrop for intimate celebrations.", website: "https://theinnatlittlewashington.com" },
  { name: "Morven Park", city: "Leesburg", state: "Virginia", category: "Historic Estate", rating: 4.8, capacity: "300", description: "A magnificent 1,000-acre estate in the heart of Virginia's hunt country with a Greek Revival mansion and sweeping pastoral views.", website: "https://morvenpark.org" },
  { name: "Lewis Ginter Botanical Garden", city: "Richmond", state: "Virginia", category: "Botanical Garden", rating: 4.9, capacity: "400", description: "A world-class botanical garden with a Victorian conservatory, rose garden, and lakeside terrace offering spectacular floral backdrops.", website: "https://lewisginter.org" },
  { name: "Pippin Hill Farm & Vineyards", city: "North Garden", state: "Virginia", category: "Vineyard", rating: 4.9, capacity: "200", description: "A celebrated vineyard and farm in the shadow of the Blue Ridge Mountains, known for its hilltop ceremony site and breathtaking views.", website: "https://pippinhillfarm.com" },
  { name: "The Tides Inn", city: "Irvington", state: "Virginia", category: "Beach & Waterfront", rating: 4.8, capacity: "250", description: "A beloved waterfront resort on the banks of the Chesapeake Bay offering romantic dock ceremonies and refined coastal hospitality.", website: "https://tidesinn.com" },

  // ── Tennessee ─────────────────────────────────────────────────────────────────
  { name: "Blackberry Farm", city: "Walland", state: "Tennessee", category: "Historic Estate", rating: 4.9, capacity: "200", description: "A legendary 4,200-acre farm resort in the Great Smoky Mountains, offering an intimate, world-class wedding experience unlike any other.", website: "https://blackberryfarm.com" },
  { name: "CJ's Off the Square", city: "Franklin", state: "Tennessee", category: "Historic Estate", rating: 4.8, capacity: "150", description: "A beautifully restored historic building in downtown Franklin, surrounded by lush gardens and vintage southern charm.", website: "https://cjsoffthesquare.com" },
  { name: "Cheekwood Estate & Gardens", city: "Nashville", state: "Tennessee", category: "Botanical Garden", rating: 4.9, capacity: "350", description: "A stunning 55-acre botanical garden estate featuring a 1930s Georgian Revival mansion and twelve distinct garden rooms.", website: "https://cheekwood.org" },
  { name: "The Inn at Tranquility Farm", city: "Leiper's Fork", state: "Tennessee", category: "Mountain & Outdoor", rating: 4.8, capacity: "150", description: "A serene countryside estate in the rolling hills of Williamson County with a restored farmhouse and sweeping meadow ceremony sites.", website: "https://tranquilityfarm.com" },

  // ── North Carolina ────────────────────────────────────────────────────────────
  { name: "Biltmore Estate", city: "Asheville", state: "North Carolina", category: "Historic Estate", rating: 4.9, capacity: "300", description: "America's largest private home — a French Renaissance-inspired château on 8,000 acres in the Blue Ridge Mountains, simply unrivaled.", website: "https://biltmore.com" },
  { name: "Daniel Stowe Botanical Garden", city: "Belmont", state: "North Carolina", category: "Botanical Garden", rating: 4.8, capacity: "300", description: "A stunning 380-acre botanical garden in the Piedmont with a breathtaking conservatory, fountain garden, and perennial border.", website: "https://dsbg.org" },
  { name: "The Fearrington House", city: "Pittsboro", state: "North Carolina", category: "Historic Estate", rating: 4.9, capacity: "150", description: "An award-winning country house hotel on a converted 1786 dairy farm, offering Relais & Châteaux elegance in the Carolina Piedmont.", website: "https://fearringtonhouse.com" },
  { name: "The Bradford", city: "Holly Springs", state: "North Carolina", category: "Mountain & Outdoor", rating: 4.8, capacity: "300", description: "A stunning outdoor venue in the heart of the Triangle area with sweeping pastoral views, a ceremony pavilion, and rustic-chic elegance.", website: "https://thebradfordnc.com" },

  // ── Hawaii ────────────────────────────────────────────────────────────────────
  { name: "Four Seasons Resort Hualalai", city: "Kailua-Kona", state: "Hawaii", category: "Beach & Waterfront", rating: 4.9, capacity: "200", description: "Nestled against ancient lava fields and turquoise Pacific waters on the Big Island, an unparalleled tropical luxury experience.", website: "https://fourseasons.com/hualalai" },
  { name: "Olowalu Plantation House", city: "Maui", state: "Hawaii", category: "Historic Estate", rating: 4.8, capacity: "120", description: "A historic 1920s plantation estate on Maui's west coast, surrounded by sugarcane fields with sweeping ocean and mountain views.", website: "https://olowaluplantationhouse.com" },
  { name: "Ho'omaluhia Botanical Garden", city: "Kaneohe", state: "Hawaii", category: "Botanical Garden", rating: 4.8, capacity: "200", description: "A dramatic 400-acre botanical garden on Oahu's windward side, set against towering Ko'olau mountains — breathtakingly beautiful.", website: "https://honolulu.gov/parks" },
  { name: "Haiku Mill", city: "Maui", state: "Hawaii", category: "Historic Estate", rating: 4.9, capacity: "80", description: "A breathtaking 19th-century sugar mill estate draped in wisteria, orchids, and lush tropical foliage in Maui's verdant upcountry.", website: "https://haikumill.com" },
  { name: "The Grand Wailea", city: "Wailea", state: "Hawaii", category: "Hotel & Ballroom", rating: 4.8, capacity: "1000", description: "Maui's legendary luxury resort set on 40 oceanfront acres with breathtaking ballrooms, cascading pools, and unmatched island splendor.", website: "https://grandwailea.com" },

  // ── South Carolina ────────────────────────────────────────────────────────────
  { name: "Middleton Place", city: "Charleston", state: "South Carolina", category: "Botanical Garden", rating: 4.9, capacity: "300", description: "America's oldest landscaped gardens dating to 1741, featuring butterfly lakes, terraced lawns, and a stunning plantation house.", website: "https://middletonplace.org" },
  { name: "Lowndes Grove", city: "Charleston", state: "South Carolina", category: "Historic Estate", rating: 4.9, capacity: "400", description: "A stunning antebellum estate on the banks of the Ashley River in Charleston, with sweeping live oaks and manicured grounds.", website: "https://lowndesgrove.com" },
  { name: "Magnolia Plantation & Gardens", city: "Charleston", state: "South Carolina", category: "Botanical Garden", rating: 4.8, capacity: "200", description: "America's oldest public garden, with over 500 varieties of azaleas, centuries-old cypress swamps, and a romantic antebellum setting.", website: "https://magnoliaplantation.com" },
  { name: "The William Aiken House", city: "Charleston", state: "South Carolina", category: "Historic Estate", rating: 4.9, capacity: "250", description: "A magnificent 1807 Greek Revival mansion in the heart of Charleston's Harleston Village, surrounded by pristine formal gardens.", website: "https://williamaikenhouse.com" },

  // ── Oregon ────────────────────────────────────────────────────────────────────
  { name: "Abernethy Center", city: "Oregon City", state: "Oregon", category: "Historic Estate", rating: 4.8, capacity: "300", description: "A stately Pacific Northwest manor set on manicured grounds with stunning mountain views and impeccable historic character.", website: "https://abernethycenter.com" },
  { name: "Portland Japanese Garden", city: "Portland", state: "Oregon", category: "Botanical Garden", rating: 4.9, capacity: "150", description: "Recognized as the most authentic Japanese garden outside Japan, perched in the West Hills of Portland with serene pavilions and koi ponds.", website: "https://japanesegarden.org" },
  { name: "The Allison Inn & Spa", city: "Newberg", state: "Oregon", category: "Vineyard", rating: 4.9, capacity: "200", description: "A luxurious wine country resort in the Willamette Valley, surrounded by Pinot Noir vineyards and the rolling Chehalem Mountains.", website: "https://theallison.com" },
  { name: "Mt. Hood Organic Farms", city: "Hood River", state: "Oregon", category: "Mountain & Outdoor", rating: 4.7, capacity: "150", description: "A spectacular organic orchard venue at the foot of Mt. Hood, with ceremony sites surrounded by fruit trees and panoramic mountain views.", website: "https://mthoodorganicfarms.com" },

  // ── Washington ────────────────────────────────────────────────────────────────
  { name: "Thornewood Castle", city: "Lakewood", state: "Washington", category: "Historic Estate", rating: 4.9, capacity: "150", description: "A stunning Gothic Tudor castle with a half-acre sunken English garden, built in 1908 from a 400-year-old Antwerp manor.", website: "https://thornewoodcastle.com" },
  { name: "Bloedel Reserve", city: "Bainbridge Island", state: "Washington", category: "Botanical Garden", rating: 4.9, capacity: "120", description: "A serene 150-acre woodland garden on Bainbridge Island with a stunning reflecting pool garden, Japanese garden, and bird sanctuary.", website: "https://bloedelreserve.org" },
  { name: "Willows Lodge", city: "Woodinville", state: "Washington", category: "Vineyard", rating: 4.8, capacity: "200", description: "A chic wine country lodge in the heart of Woodinville's renowned wine country corridor, with a private garden and rustic elegance.", website: "https://willowslodge.com" },
  { name: "The Edgewater Hotel", city: "Seattle", state: "Washington", category: "Beach & Waterfront", rating: 4.8, capacity: "250", description: "Seattle's iconic waterfront hotel built over Puget Sound, offering mountain and water views with legendary Pacific Northwest hospitality.", website: "https://edgewaterhotel.com" },

  // ── Massachusetts ─────────────────────────────────────────────────────────────
  { name: "The Great Hall at the Boston Public Library", city: "Boston", state: "Massachusetts", category: "Historic Estate", rating: 4.8, capacity: "300", description: "The grandest wedding backdrop in Boston — a soaring Renaissance Revival reading room with marble columns and arched ceilings.", website: "https://bpl.org" },
  { name: "Codman Estate", city: "Lincoln", state: "Massachusetts", category: "Historic Estate", rating: 4.8, capacity: "200", description: "A National Historic Landmark with a Federal-style mansion and exquisite formal gardens maintained by Historic New England.", website: "https://historicnewengland.org" },
  { name: "Tower Hill Botanic Garden", city: "Boylston", state: "Massachusetts", category: "Botanical Garden", rating: 4.8, capacity: "250", description: "A stunning hilltop garden with panoramic views of Wachusett Reservoir, featuring a Georgian Orangery and walled garden.", website: "https://towerhillbg.org" },
  { name: "The Crane Estate", city: "Ipswich", state: "Massachusetts", category: "Historic Estate", rating: 4.9, capacity: "200", description: "A breathtaking 2,100-acre estate on Castle Hill overlooking the Atlantic Ocean, featuring a Stuart-style mansion and sweeping formal allée.", website: "https://thetrustees.org" },

  // ── Illinois ──────────────────────────────────────────────────────────────────
  { name: "Cantigny Park", city: "Wheaton", state: "Illinois", category: "Historic Estate", rating: 4.8, capacity: "400", description: "A magnificent 500-acre estate and gardens — the former home of Colonel Robert McCormick — set amid manicured grounds outside Chicago.", website: "https://cantigny.org" },
  { name: "Chicago Botanic Garden", city: "Glencoe", state: "Illinois", category: "Botanical Garden", rating: 4.9, capacity: "500", description: "385 acres of living plant collections spread across 26 display gardens and four natural areas, offering unmatched natural beauty.", website: "https://chicagobotanic.org" },
  { name: "The Rookery Building", city: "Chicago", state: "Illinois", category: "Historic Estate", rating: 4.8, capacity: "200", description: "A National Historic Landmark designed by Burnham & Root in 1888, featuring a stunning Frank Lloyd Wright-redesigned light court.", website: "https://therookerybuilding.com" },
  { name: "Salvage One", city: "Chicago", state: "Illinois", category: "Historic Estate", rating: 4.8, capacity: "250", description: "A sprawling industrial loft filled with architectural salvage and antiques — one of Chicago's most unique and beloved event spaces.", website: "https://salvageone.com" },

  // ── Pennsylvania ──────────────────────────────────────────────────────────────
  { name: "Longwood Gardens", city: "Kennett Square", state: "Pennsylvania", category: "Botanical Garden", rating: 4.9, capacity: "500", description: "One of the world's greatest gardens — 1,100 acres of breathtaking outdoor gardens, meadows, and the spectacular Main Conservatory.", website: "https://longwoodgardens.org" },
  { name: "The Willowdale Estate", city: "Topsfield", state: "Pennsylvania", category: "Historic Estate", rating: 4.8, capacity: "300", description: "A magnificent New England estate on 130 private acres with elegant ballrooms, stone terraces, and award-winning cuisine.", website: "https://willowdaleestate.com" },
  { name: "Glen Foerd on the Delaware", city: "Philadelphia", state: "Pennsylvania", category: "Historic Estate", rating: 4.8, capacity: "200", description: "A stunning Victorian mansion on the banks of the Delaware River, with ornate interiors, a private carriage house, and lush river gardens.", website: "https://glenfoerd.org" },

  // ── Arizona ───────────────────────────────────────────────────────────────────
  { name: "El Chorro Lodge", city: "Paradise Valley", state: "Arizona", category: "Historic Estate", rating: 4.8, capacity: "200", description: "A legendary desert estate at the foot of Camelback Mountain, with lush gardens, a historic chapel, and sweeping mountain views.", website: "https://elchorro.com" },
  { name: "Desert Botanical Garden", city: "Phoenix", state: "Arizona", category: "Botanical Garden", rating: 4.9, capacity: "500", description: "140 acres of stunning desert landscapes with 50,000 plants from around the world, set against the iconic Papago Buttes at sunset.", website: "https://dbg.org" },
  { name: "The Sanctuary on Camelback Mountain", city: "Paradise Valley", state: "Arizona", category: "Mountain & Outdoor", rating: 4.9, capacity: "300", description: "A serene, spa-centric luxury resort perched on the north slope of Camelback Mountain with unobstructed desert valley panoramas.", website: "https://sanctuaryoncamelback.com" },
  { name: "Saguaro Lake Ranch", city: "Mesa", state: "Arizona", category: "Mountain & Outdoor", rating: 4.8, capacity: "200", description: "A secluded 175-acre ranch in the Tonto National Forest beside Saguaro Lake with dramatic desert mountain ceremony backdrops.", website: "https://saguarolakeranch.com" },

  // ── Nevada ────────────────────────────────────────────────────────────────────
  { name: "The Venetian Las Vegas", city: "Las Vegas", state: "Nevada", category: "Hotel & Ballroom", rating: 4.8, capacity: "1000", description: "Grand Venetian-inspired ballrooms and terraces on the Las Vegas Strip, with impeccable service and show-stopping grandeur.", website: "https://venetian.com" },
  { name: "Red Rock Country Club", city: "Las Vegas", state: "Nevada", category: "Mountain & Outdoor", rating: 4.8, capacity: "400", description: "A stunning private club nestled beneath the iconic Red Rock Canyon with sweeping desert mountain views and manicured grounds.", website: "https://redrockcountryclub.com" },
  { name: "Edgewood Tahoe Resort", city: "Lake Tahoe", state: "Nevada", category: "Beach & Waterfront", rating: 4.9, capacity: "300", description: "A breathtaking lakefront resort on the southern shores of Lake Tahoe with ceremony sites overlooking the clearest alpine waters in North America.", website: "https://edgewoodtahoe.com" },

  // ── New Jersey ────────────────────────────────────────────────────────────────
  { name: "Park Chateau Estate", city: "East Brunswick", state: "New Jersey", category: "Historic Estate", rating: 4.8, capacity: "500", description: "A stunning French château-inspired estate with grand ballrooms, manicured gardens, and opulent European décor in central New Jersey.", website: "https://parkchateau.com" },
  { name: "The Merion", city: "Cinnaminson", state: "New Jersey", category: "Hotel & Ballroom", rating: 4.7, capacity: "600", description: "A grand ballroom venue near Philadelphia with multiple event spaces, crystal chandeliers, and seamless all-inclusive packages.", website: "https://themerion.com" },
  { name: "The Inn at Fernwood Estate", city: "Wyckoff", state: "New Jersey", category: "Historic Estate", rating: 4.8, capacity: "200", description: "An enchanting 1922 Tudor-style manor set on six acres of gardens in northern New Jersey with a romantic intimate atmosphere.", website: "https://fernwoodinnatwyckoff.com" },

  // ── Maryland ──────────────────────────────────────────────────────────────────
  { name: "Historic London Town & Gardens", city: "Edgewater", state: "Maryland", category: "Botanical Garden", rating: 4.8, capacity: "200", description: "A magnificent 23-acre National Historic Landmark with woodland gardens on the South River and a beautifully preserved 1764 tavern.", website: "https://historiclondontown.org" },
  { name: "Belmont Manor", city: "Elkridge", state: "Maryland", category: "Historic Estate", rating: 4.9, capacity: "250", description: "A breathtaking 1738 Georgian manor on 70 acres with sweeping Patuxent River views, a stunning stone terrace, and manicured boxwood gardens.", website: "https://belmontmanor.com" },
  { name: "The Tidewater Inn", city: "Easton", state: "Maryland", category: "Hotel & Ballroom", rating: 4.7, capacity: "300", description: "A beloved colonial inn on Maryland's Eastern Shore serving as the gateway to the Chesapeake, with elegant ballrooms and warm Southern charm.", website: "https://tidewaterinn.com" },

  // ── Connecticut ───────────────────────────────────────────────────────────────
  { name: "Harkness Memorial State Park", city: "Waterford", state: "Connecticut", category: "Historic Estate", rating: 4.8, capacity: "250", description: "A stunning 230-acre estate on Long Island Sound with a 42-room mansion, Italian gardens, and sweeping coastal views.", website: "https://portal.ct.gov/DEEP/State-Parks/Parks/Harkness-Memorial-State-Park" },
  { name: "The Lighthouse at Chelsea Piers", city: "Stamford", state: "Connecticut", category: "Beach & Waterfront", rating: 4.7, capacity: "350", description: "A stunning waterfront venue in Stamford Harbor with panoramic water views, soaring ceilings, and industrial-chic elegance.", website: "https://chelseapierct.com" },
  { name: "Wickham Park", city: "Manchester", state: "Connecticut", category: "Botanical Garden", rating: 4.7, capacity: "200", description: "270 acres of manicured gardens, ponds, and woodlands including a stunning formal Japanese garden perfect for romantic ceremonies.", website: "https://wickhampark.org" },

  // ── Louisiana ─────────────────────────────────────────────────────────────────
  { name: "Oak Alley Plantation", city: "Vacherie", state: "Louisiana", category: "Historic Estate", rating: 4.8, capacity: "300", description: "An iconic antebellum plantation famous for its breathtaking canopy of 300-year-old live oaks creating a tunnel of natural grandeur.", website: "https://oakalleyplantation.org" },
  { name: "Nottoway Plantation", city: "White Castle", state: "Louisiana", category: "Historic Estate", rating: 4.8, capacity: "250", description: "The South's largest antebellum mansion, a stunning 53,000 sq ft Greek Revival and Italianate masterpiece on the Mississippi River.", website: "https://nottoway.com" },
  { name: "NOMA Sculpture Garden", city: "New Orleans", state: "Louisiana", category: "Botanical Garden", rating: 4.8, capacity: "400", description: "Five acres of beautifully landscaped gardens in City Park with more than 60 world-class sculptures in a lush, romantic setting.", website: "https://noma.org" },

  // ── Alabama ───────────────────────────────────────────────────────────────────
  { name: "The Twickenham Historic District", city: "Huntsville", state: "Alabama", category: "Historic Estate", rating: 4.7, capacity: "200", description: "A beautifully preserved antebellum district with gracious historic homes available for intimate wedding events.", website: "https://twickenhamtownpreservation.org" },
  { name: "The Huntsville Botanical Garden", city: "Huntsville", state: "Alabama", category: "Botanical Garden", rating: 4.8, capacity: "300", description: "A stunning 112-acre botanical garden with a serene lake, trellis garden, and North Alabama's most beloved outdoor wedding setting.", website: "https://hsvbg.org" },

  // ── Mississippi ───────────────────────────────────────────────────────────────
  { name: "Dunleith Historic Inn", city: "Natchez", state: "Mississippi", category: "Historic Estate", rating: 4.9, capacity: "200", description: "A spectacular antebellum plantation with 22 Greek Revival columns, manicured grounds, and a charming collection of courtyard cottages.", website: "https://dunleith.com" },
  { name: "The Ravines at Cedar Hill", city: "Brandon", state: "Mississippi", category: "Mountain & Outdoor", rating: 4.7, capacity: "250", description: "A lush outdoor venue set in the rolling hills east of Jackson with a stunning outdoor chapel, pond, and manicured garden terraces.", website: "https://theravinesatcedarhill.com" },

  // ── Kentucky ──────────────────────────────────────────────────────────────────
  { name: "Talon Winery & Vineyards", city: "Lexington", state: "Kentucky", category: "Vineyard", rating: 4.8, capacity: "200", description: "Kentucky's premiere wedding vineyard set on rolling horse country hills, featuring barrel rooms, a grand hall, and Bluegrass panoramas.", website: "https://talonwine.com" },
  { name: "The Frazier History Museum", city: "Louisville", state: "Kentucky", category: "Historic Estate", rating: 4.8, capacity: "400", description: "A grand 1888 Richardsonian Romanesque landmark on Louisville's Museum Row featuring dramatic stone architecture and opulent interior spaces.", website: "https://fraziermuseum.org" },
  { name: "Keeneland Race Course", city: "Lexington", state: "Kentucky", category: "Historic Estate", rating: 4.8, capacity: "500", description: "The most beautiful horse racing venue in America, with Georgian architecture, rolling paddocks, and a uniquely Bluegrass grandeur.", website: "https://keeneland.com" },

  // ── Ohio ──────────────────────────────────────────────────────────────────────
  { name: "Franklin Park Conservatory", city: "Columbus", state: "Ohio", category: "Botanical Garden", rating: 4.8, capacity: "400", description: "A stunning Victorian glass conservatory with indoor tropical gardens, Dale Chihuly glass sculptures, and an outdoor botanical garden.", website: "https://fpconservatory.org" },
  { name: "Landoll's Mohican Castle", city: "Loudonville", state: "Ohio", category: "Historic Estate", rating: 4.9, capacity: "200", description: "A hand-hewn limestone castle on 1,100 wooded acres in the Mohican Valley with towers, gardens, and a fairy-tale atmosphere.", website: "https://landollsmohicancastle.com" },
  { name: "Gervasi Vineyard", city: "Canton", state: "Ohio", category: "Vineyard", rating: 4.8, capacity: "300", description: "A Tuscan-inspired estate vineyard in Ohio with a stunning boutique hotel, winery, and lakeside ceremony sites.", website: "https://gervasivineyard.com" },

  // ── Michigan ──────────────────────────────────────────────────────────────────
  { name: "Castle Farms", city: "Charlevoix", state: "Michigan", category: "Historic Estate", rating: 4.9, capacity: "400", description: "A stunning 1918 Norman-style castle on 100 acres in northern Michigan, featuring gardens, a stone outdoor amphitheater, and romantic towers.", website: "https://castlefarms.com" },
  { name: "Frederik Meijer Gardens", city: "Grand Rapids", state: "Michigan", category: "Botanical Garden", rating: 4.9, capacity: "500", description: "A breathtaking 158-acre botanical and sculpture park featuring one of the world's most impressive tropical conservatories.", website: "https://meijergardens.org" },
  { name: "The Inn at Bay Harbor", city: "Bay Harbor", state: "Michigan", category: "Beach & Waterfront", rating: 4.8, capacity: "300", description: "A Shingle-style Victorian resort on the pristine shores of Little Traverse Bay with mountain views, marina access, and refined elegance.", website: "https://innatbayharbor.com" },

  // ── Minnesota ─────────────────────────────────────────────────────────────────
  { name: "Minnesota Landscape Arboretum", city: "Chaska", state: "Minnesota", category: "Botanical Garden", rating: 4.8, capacity: "300", description: "1,200 acres of breathtaking gardens and natural landscapes 25 miles from Minneapolis with stunning indoor and outdoor event spaces.", website: "https://arb.umn.edu" },
  { name: "The Nicollet Island Inn", city: "Minneapolis", state: "Minnesota", category: "Historic Estate", rating: 4.7, capacity: "200", description: "A charming 1893 Victorian inn on a private island in the Mississippi River in the heart of Minneapolis with sweeping riverfront views.", website: "https://nicolletislandinn.com" },

  // ── Wisconsin ─────────────────────────────────────────────────────────────────
  { name: "The American Club", city: "Kohler", state: "Wisconsin", category: "Historic Estate", rating: 4.9, capacity: "400", description: "A legendary Tudor-style luxury resort — the Midwest's only AAA Five Diamond property — set in the idyllic village of Kohler.", website: "https://americanclubresort.com" },
  { name: "Olbrich Botanical Gardens", city: "Madison", state: "Wisconsin", category: "Botanical Garden", rating: 4.8, capacity: "250", description: "16 acres of stunning gardens on the shores of Lake Monona, including a breathtaking glass pyramid conservatory and a Thai-style pavilion.", website: "https://olbrich.org" },

  // ── Missouri ──────────────────────────────────────────────────────────────────
  { name: "Missouri Botanical Garden", city: "St. Louis", state: "Missouri", category: "Botanical Garden", rating: 4.9, capacity: "500", description: "One of the oldest and most important botanical gardens in the world with 79 acres of breathtaking gardens, including a stunning Climatron.", website: "https://missouribotanicalgarden.org" },
  { name: "Leila's Hair Museum at Longview Farm", city: "Lee's Summit", state: "Missouri", category: "Historic Estate", rating: 4.7, capacity: "250", description: "An 1830s historic farm estate with beautifully preserved stone buildings, sweeping meadows, and an elegant barn reception space.", website: "https://longviewfarm.com" },

  // ── Iowa ──────────────────────────────────────────────────────────────────────
  { name: "Greater Des Moines Botanical Garden", city: "Des Moines", state: "Iowa", category: "Botanical Garden", rating: 4.8, capacity: "300", description: "A gorgeous botanical oasis in the heart of Des Moines with a 14,000 sq ft conservatory and stunning riverside setting.", website: "https://dmbotanicalgarden.com" },
  { name: "Bella Sala", city: "Johnston", state: "Iowa", category: "Hotel & Ballroom", rating: 4.8, capacity: "350", description: "An elegant Italian-inspired venue north of Des Moines featuring travertine floors, crystal chandeliers, and lush outdoor ceremony grounds.", website: "https://bellasalaevents.com" },

  // ── Indiana ───────────────────────────────────────────────────────────────────
  { name: "Newfields (Indianapolis Museum of Art)", city: "Indianapolis", state: "Indiana", category: "Botanical Garden", rating: 4.8, capacity: "400", description: "A stunning cultural campus with a world-class art museum, 152-acre park, greenhouse, and an Oldfields estate garden perfect for weddings.", website: "https://discovernewfields.org" },
  { name: "The Studebaker National Museum", city: "South Bend", state: "Indiana", category: "Historic Estate", rating: 4.7, capacity: "300", description: "An extraordinary industrial landmark in South Bend's historic core featuring dramatic architecture and an iconic automotive collection.", website: "https://studebakermuseum.org" },

  // ── Kansas ────────────────────────────────────────────────────────────────────
  { name: "Botanica Wichita", city: "Wichita", state: "Kansas", category: "Botanical Garden", rating: 4.8, capacity: "300", description: "A stunning 17-garden botanical showcase in Wichita featuring a Chinese scholar's garden, butterfly house, and elegant event pavilions.", website: "https://botanica.org" },
  { name: "Mildale Farm", city: "Louisburg", state: "Kansas", category: "Mountain & Outdoor", rating: 4.8, capacity: "250", description: "A beautiful working apple orchard and farm estate south of Kansas City with a charming barn, orchard ceremony sites, and rolling pastoral views.", website: "https://mildalefarm.com" },

  // ── Nebraska ──────────────────────────────────────────────────────────────────
  { name: "Lauritzen Gardens", city: "Omaha", state: "Nebraska", category: "Botanical Garden", rating: 4.8, capacity: "300", description: "A magnificent 100-acre botanical garden overlooking the Missouri River with English rose gardens, a model railroad garden, and an elegant conservatory.", website: "https://lauritzengardens.org" },
  { name: "Wilderness Ridge", city: "Lincoln", state: "Nebraska", category: "Mountain & Outdoor", rating: 4.7, capacity: "250", description: "A stunning golf resort and event venue in Lincoln's southwest hills with sweeping views, manicured grounds, and beautiful indoor spaces.", website: "https://wildernessridge.com" },

  // ── Oklahoma ──────────────────────────────────────────────────────────────────
  { name: "The Campbell Hotel", city: "Tulsa", state: "Oklahoma", category: "Historic Estate", rating: 4.8, capacity: "200", description: "A beautifully restored 1927 art deco boutique hotel in Tulsa's Cherry Street neighborhood with charming vintage character and garden spaces.", website: "https://thecampbellhotel.com" },
  { name: "Scissortail Park", city: "Oklahoma City", state: "Oklahoma", category: "Botanical Garden", rating: 4.8, capacity: "500", description: "A stunning 70-acre urban park in the heart of Oklahoma City featuring a butterfly garden, event lawn, and a stunning amphitheater.", website: "https://scissortailpark.org" },

  // ── Arkansas ──────────────────────────────────────────────────────────────────
  { name: "Garvan Woodland Gardens", city: "Hot Springs", state: "Arkansas", category: "Botanical Garden", rating: 4.9, capacity: "200", description: "A breathtaking 210-acre botanical garden on a peninsula in Lake Hamilton with native plant collections and sweeping lakeside ceremony sites.", website: "https://garvangardens.org" },
  { name: "Crystal Bridges Museum of American Art", city: "Bentonville", state: "Arkansas", category: "Botanical Garden", rating: 4.9, capacity: "400", description: "A stunning world-class museum nestled in 120 acres of natural park with sparkling creek-fed ponds and extraordinary architecture by Moshe Safdie.", website: "https://crystalbridges.org" },

  // ── New Mexico ────────────────────────────────────────────────────────────────
  { name: "El Monte Sagrado", city: "Taos", state: "New Mexico", category: "Mountain & Outdoor", rating: 4.8, capacity: "200", description: "A stunning eco-resort in the heart of Taos with lush garden casitas, a sacred circle, and breathtaking views of the Sangre de Cristo Mountains.", website: "https://elmontesagrado.com" },
  { name: "Casa de Benavidez", city: "Albuquerque", state: "New Mexico", category: "Historic Estate", rating: 4.7, capacity: "300", description: "A charming 1930s hacienda-style estate with lush courtyards, flowering gardens, and an authentic New Mexico cultural setting.", website: "https://casadebenavidez.com" },

  // ── Utah ──────────────────────────────────────────────────────────────────────
  { name: "Red Butte Garden", city: "Salt Lake City", state: "Utah", category: "Botanical Garden", rating: 4.8, capacity: "300", description: "A spectacular 100-acre botanical garden at the foot of the Wasatch Mountains with formal gardens, an amphitheater, and stunning mountain views.", website: "https://redbuttegarden.org" },
  { name: "Sundance Mountain Resort", city: "Sundance", state: "Utah", category: "Mountain & Outdoor", rating: 4.9, capacity: "200", description: "Robert Redford's legendary mountain retreat nestled beneath Mount Timpanogos with rustic-luxe ceremony sites and breathtaking alpine backdrops.", website: "https://sundanceresort.com" },
  { name: "Zion Ponderosa Ranch Resort", city: "Mount Carmel", state: "Utah", category: "Mountain & Outdoor", rating: 4.8, capacity: "150", description: "A stunning remote resort on the east rim of Zion National Park with panoramic canyon views and unique outdoor ceremony locations.", website: "https://zionponderosa.com" },

  // ── Idaho ─────────────────────────────────────────────────────────────────────
  { name: "Coeur d'Alene Resort", city: "Coeur d'Alene", state: "Idaho", category: "Beach & Waterfront", rating: 4.8, capacity: "400", description: "A world-famous resort on the shores of Coeur d'Alene Lake with a floating green golf course, stunning ballrooms, and unmatched lake scenery.", website: "https://cdaresort.com" },
  { name: "Chandler's Restaurant & Steakhouse", city: "Sun Valley", state: "Idaho", category: "Mountain & Outdoor", rating: 4.7, capacity: "150", description: "A beloved mountain venue in storied Sun Valley resort town with alpine meadow ceremony sites and elegant wine country-inspired dinners.", website: "https://sunvalley.com" },

  // ── Montana ───────────────────────────────────────────────────────────────────
  { name: "The Resort at Paws Up", city: "Greenough", state: "Montana", category: "Mountain & Outdoor", rating: 4.9, capacity: "200", description: "A stunning 37,000-acre luxury wilderness resort in the Blackfoot Valley with glamping, riverside ceremony sites, and rugged Montana splendor.", website: "https://pawsup.com" },
  { name: "Triple Creek Ranch", city: "Darby", state: "Montana", category: "Mountain & Outdoor", rating: 4.9, capacity: "100", description: "An ultra-exclusive adults-only wilderness retreat in the Bitterroot Mountains — Relais & Châteaux certified, offering intimate mountain celebrations.", website: "https://triplecreekranch.com" },

  // ── Wyoming ───────────────────────────────────────────────────────────────────
  { name: "Amangani", city: "Jackson Hole", state: "Wyoming", category: "Mountain & Outdoor", rating: 4.9, capacity: "100", description: "A stunning clifftop sanctuary above Jackson Hole with floor-to-ceiling views of the Tetons, raw stone architecture, and Aman's legendary serenity.", website: "https://aman.com/resorts/amangani" },
  { name: "The Cloudveil", city: "Jackson", state: "Wyoming", category: "Mountain & Outdoor", rating: 4.8, capacity: "150", description: "A boutique luxury hotel in downtown Jackson with stunning Teton views, intimate event spaces, and a refined mountain-modern design.", website: "https://cloudveil.com" },

  // ── North Dakota ──────────────────────────────────────────────────────────────
  { name: "The Rooftop Garden at The Jasper", city: "Fargo", state: "North Dakota", category: "Hotel & Ballroom", rating: 4.7, capacity: "200", description: "A chic boutique hotel in Fargo with a rooftop terrace, skyline views, and beautifully designed modern event spaces.", website: "https://thejasperfargo.com" },

  // ── South Dakota ──────────────────────────────────────────────────────────────
  { name: "Lodge at Deadwood", city: "Deadwood", state: "South Dakota", category: "Mountain & Outdoor", rating: 4.7, capacity: "300", description: "A stunning mountain lodge in the heart of the Black Hills with rustic elegance, spectacular views, and full-service event facilities.", website: "https://lodgeatdeadwood.com" },
  { name: "The Cabin at Thunderhead Falls", city: "Rapid City", state: "South Dakota", category: "Mountain & Outdoor", rating: 4.7, capacity: "150", description: "A romantic Black Hills venue with a waterfall ceremony site, pine forest backdrops, and intimate mountain lodge atmosphere.", website: "https://thunderheadfalls.com" },

  // ── Alaska ────────────────────────────────────────────────────────────────────
  { name: "Alyeska Resort", city: "Girdwood", state: "Alaska", category: "Mountain & Outdoor", rating: 4.8, capacity: "300", description: "Alaska's premier mountain resort nestled in Turnagain Arm with panoramic glacier and inlet views, tram access, and extraordinary alpine settings.", website: "https://alyeskaresort.com" },
  { name: "Seldovia Slough", city: "Seldovia", state: "Alaska", category: "Beach & Waterfront", rating: 4.7, capacity: "100", description: "A uniquely intimate coastal Alaskan setting in the remote fishing village of Seldovia, accessible by ferry or floatplane.", website: "https://seldovia.com" },

  // ── Rhode Island ──────────────────────────────────────────────────────────────
  { name: "The Rosecliff Mansion", city: "Newport", state: "Rhode Island", category: "Historic Estate", rating: 4.9, capacity: "200", description: "A stunning 1902 Gilded Age mansion modeled after Versailles' Grand Trianon, set on the Newport Cliff Walk with breathtaking ocean views.", website: "https://newportmansions.org/mansions/rosecliff" },
  { name: "Blithewold Mansion & Gardens", city: "Bristol", state: "Rhode Island", category: "Botanical Garden", rating: 4.8, capacity: "200", description: "A magnificent English manor on Narragansett Bay with 33 acres of historic grounds including a stunning walled rose garden.", website: "https://blithewold.org" },

  // ── New Hampshire ─────────────────────────────────────────────────────────────
  { name: "The Mountain View Grand Resort", city: "Whitefield", state: "New Hampshire", category: "Mountain & Outdoor", rating: 4.8, capacity: "300", description: "A breathtaking 1865 grand resort hotel atop a New Hampshire hillside with panoramic White Mountain views and Victorian elegance.", website: "https://mountainviewgrand.com" },
  { name: "Wentworth by the Sea", city: "New Castle", state: "New Hampshire", category: "Beach & Waterfront", rating: 4.8, capacity: "400", description: "A legendary 1874 seaside grand hotel on a New Hampshire island with stunning harbor views and restored Victorian grandeur.", website: "https://wentworth.com" },

  // ── Vermont ───────────────────────────────────────────────────────────────────
  { name: "Shelburne Farms", city: "Shelburne", state: "Vermont", category: "Historic Estate", rating: 4.9, capacity: "250", description: "A breathtaking 1,400-acre working farm estate on Lake Champlain, with a stunning 1899 Inn, barns, and sweeping Adirondack views.", website: "https://shelburnefarms.org" },
  { name: "Stoweflake Mountain Resort", city: "Stowe", state: "Vermont", category: "Mountain & Outdoor", rating: 4.8, capacity: "300", description: "A beloved Vermont resort nestled in the Green Mountains with sweeping valley views, a spa, and quintessential New England charm.", website: "https://stoweflake.com" },

  // ── Maine ─────────────────────────────────────────────────────────────────────
  { name: "The Inn By The Sea", city: "Cape Elizabeth", state: "Maine", category: "Beach & Waterfront", rating: 4.8, capacity: "200", description: "A beloved boutique inn perched above Crescent Beach with direct Atlantic Ocean access, wildflower meadows, and refined coastal elegance.", website: "https://innbythesea.com" },
  { name: "The Colony Hotel", city: "Kennebunkport", state: "Maine", category: "Beach & Waterfront", rating: 4.8, capacity: "250", description: "A cherished grand hotel on the coast of Kennebunkport with sweeping Atlantic views, a heated saltwater pool, and New England grace.", website: "https://thecolonymaine.com" },

  // ── Delaware ──────────────────────────────────────────────────────────────────
  { name: "Winterthur Museum, Garden & Library", city: "Wilmington", state: "Delaware", category: "Botanical Garden", rating: 4.9, capacity: "300", description: "The former home of Henry Francis du Pont on 1,000 woodland acres with stunning naturalistic gardens and an incomparable decorative arts collection.", website: "https://winterthur.org" },
  { name: "The Hotel du Pont", city: "Wilmington", state: "Delaware", category: "Hotel & Ballroom", rating: 4.8, capacity: "400", description: "A legendary 1913 Gold Ballroom jewel in Wilmington featuring Italian Renaissance architecture, carved oak paneling, and timeless luxury.", website: "https://hoteldupont.com" },

  // ── West Virginia ─────────────────────────────────────────────────────────────
  { name: "The Greenbrier", city: "White Sulphur Springs", state: "West Virginia", category: "Hotel & Ballroom", rating: 4.9, capacity: "1000", description: "America's legendary resort hotel — a 710-room National Historic Landmark with ornate ballrooms, mountain splendor, and 250 years of heritage.", website: "https://greenbrier.com" },
  { name: "Stonewall Resort", city: "Roanoke", state: "West Virginia", category: "Mountain & Outdoor", rating: 4.7, capacity: "300", description: "A stunning lakeside lodge in Stonewall Jackson State Park with Appalachian Mountain views, waterfront ceremony sites, and rustic elegance.", website: "https://stonewallresort.com" },

  // ── Expansion Pack ──────────────────────────────────────────────────────────
  // California (additional)
  { name: "Beaulieu Garden", city: "Rutherford", state: "California", category: "Vineyard", rating: 4.9, capacity: "250", description: "A romantic Napa Valley garden estate with a 100-year-old sycamore allée — the quintessential wine country ceremony setting.", website: "https://beaulieugarden.com" },
  { name: "Carmel Valley Ranch", city: "Carmel-by-the-Sea", state: "California", category: "Mountain & Outdoor", rating: 4.8, capacity: "300", description: "A 500-acre rolling resort tucked into the Santa Lucia foothills with vineyards, oak meadows, and an organic apiary.", website: "https://carmelvalleyranch.com" },
  { name: "Montage Laguna Beach", city: "Laguna Beach", state: "California", category: "Beach & Waterfront", rating: 4.9, capacity: "350", description: "A craftsman-inspired oceanfront resort perched above Treasure Island Beach with sweeping Pacific views and dramatic cliffside ceremony sites.", website: "https://montage.com/lagunabeach" },
  { name: "The Maybeck", city: "Berkeley", state: "California", category: "Historic Estate", rating: 4.8, capacity: "150", description: "A breathtaking 1907 Bernard Maybeck-designed estate in the Berkeley hills with hand-carved redwood interiors and bay views.", website: "https://themaybeck.com" },
  { name: "Carneros Resort & Spa", city: "Napa", state: "California", category: "Vineyard", rating: 4.9, capacity: "250", description: "A modern-farmhouse luxury resort on 27 acres of Napa Valley vineyards, gardens, and orchards.", website: "https://carnerosresort.com" },
  { name: "Cuvaison Estate", city: "Napa", state: "California", category: "Vineyard", rating: 4.8, capacity: "150", description: "An award-winning Carneros vineyard with sleek modern architecture and panoramic views across the rolling hills.", website: "https://cuvaison.com" },
  { name: "The Bel-Air", city: "Los Angeles", state: "California", category: "Hotel & Ballroom", rating: 4.9, capacity: "200", description: "A legendary pink stucco hideaway in Bel-Air with swan ponds, a private chapel, and Hollywood's most romantic gardens.", website: "https://dorchestercollection.com/los-angeles/hotel-bel-air" },
  { name: "San Ysidro Ranch", city: "Montecito", state: "California", category: "Mountain & Outdoor", rating: 4.9, capacity: "200", description: "JFK and Jackie's honeymoon destination — a 550-acre Montecito sanctuary with stone cottages, citrus groves, and a stunning stone chapel.", website: "https://sanysidroranch.com" },

  // New York (additional)
  { name: "Brooklyn Botanic Garden", city: "Brooklyn", state: "New York", category: "Botanical Garden", rating: 4.9, capacity: "350", description: "52 acres of breathtaking gardens in the heart of Brooklyn with the iconic Cherry Esplanade and Palm House conservatory.", website: "https://bbg.org" },
  { name: "Liberty Warehouse", city: "Brooklyn", state: "New York", category: "Historic Estate", rating: 4.8, capacity: "300", description: "An 1850s waterfront warehouse on Red Hook's pier with sweeping Statue of Liberty and Manhattan skyline views.", website: "https://libertywarehouse.com" },
  { name: "Tarrytown House Estate", city: "Tarrytown", state: "New York", category: "Historic Estate", rating: 4.8, capacity: "300", description: "Two 19th-century mansions on a 26-acre Hudson River estate just north of Manhattan, with sweeping valley views.", website: "https://tarrytownhouseestate.com" },
  { name: "The Garrison", city: "Garrison", state: "New York", category: "Mountain & Outdoor", rating: 4.8, capacity: "300", description: "A stunning Hudson Valley venue overlooking West Point with rolling lawns, a glass-walled great room, and Storm King Mountain backdrops.", website: "https://thegarrison.com" },
  { name: "Mohonk Mountain House", city: "New Paltz", state: "New York", category: "Historic Estate", rating: 4.9, capacity: "300", description: "A National Historic Landmark Victorian castle resort on 40,000 acres of Shawangunk Mountain wilderness.", website: "https://mohonk.com" },
  { name: "Blue Hill at Stone Barns", city: "Pocantico Hills", state: "New York", category: "Mountain & Outdoor", rating: 4.9, capacity: "150", description: "A working farm and renowned restaurant on a Rockefeller estate with stone barns, pastoral fields, and farm-to-table magic.", website: "https://bluehillfarm.com" },
  { name: "The Plaza Hotel", city: "New York City", state: "New York", category: "Hotel & Ballroom", rating: 4.8, capacity: "500", description: "Manhattan's most iconic landmark hotel since 1907 — the gilded Grand Ballroom is a New York wedding tradition.", website: "https://theplazany.com" },

  // Texas (additional)
  { name: "Brennan's of Houston", city: "Houston", state: "Texas", category: "Historic Estate", rating: 4.8, capacity: "300", description: "A Creole landmark in Midtown Houston with a romantic interior courtyard, magnolia trees, and gracious New Orleans charm.", website: "https://brennanshouston.com" },
  { name: "The Astorian", city: "Houston", state: "Texas", category: "Hotel & Ballroom", rating: 4.8, capacity: "500", description: "A glamorous Italian-inspired ballroom in the Houston Heights with sweeping skyline views and a stunning rooftop terrace.", website: "https://theastorian.com" },
  { name: "Marie Gabrielle", city: "Dallas", state: "Texas", category: "Botanical Garden", rating: 4.8, capacity: "350", description: "A romantic restaurant-and-garden venue in the Arts District with a tucked-away courtyard, fountains, and lush landscaping.", website: "https://mariegabrielle.com" },
  { name: "Mercury Hall", city: "Austin", state: "Texas", category: "Historic Estate", rating: 4.8, capacity: "200", description: "An 1904 wooden chapel relocated to South Austin and surrounded by oak groves and string lights — pure Austin charm.", website: "https://mercuryhall.com" },
  { name: "The Bowery House & Gardens", city: "Round Top", state: "Texas", category: "Historic Estate", rating: 4.8, capacity: "200", description: "A storybook estate in tiny Round Top with a curated collection of antique structures, lush gardens, and Texas Hill Country views.", website: "https://theboweryhouse.com" },
  { name: "Hotel Emma", city: "San Antonio", state: "Texas", category: "Hotel & Ballroom", rating: 4.9, capacity: "300", description: "A dazzling 19th-century brewhouse turned boutique hotel in the Pearl district, with industrial-chic ballrooms and riverwalk access.", website: "https://thehotelemma.com" },

  // Florida (additional)
  { name: "Bakers Cay Resort", city: "Key Largo", state: "Florida", category: "Beach & Waterfront", rating: 4.8, capacity: "250", description: "A serene Key Largo resort on 13 oceanfront acres with hammock palms, tiki torches, and impossibly turquoise water.", website: "https://bakerscayresort.com" },
  { name: "The Cloister at Sea Island", city: "Sea Island", state: "Florida", category: "Beach & Waterfront", rating: 4.9, capacity: "400", description: "A Forbes Five-Star coastal resort with Spanish Mediterranean architecture, private beaches, and legendary Southern hospitality.", website: "https://seaisland.com" },
  { name: "The Ringling", city: "Sarasota", state: "Florida", category: "Historic Estate", rating: 4.9, capacity: "300", description: "John Ringling's stunning 66-acre bayfront estate with the pink Cà d'Zan mansion, rose garden, and museum of art.", website: "https://ringling.org" },
  { name: "Casa Marina Key West", city: "Key West", state: "Florida", category: "Beach & Waterfront", rating: 4.8, capacity: "350", description: "A historic 1920s Flagler-era resort on Key West's only private beach with Atlantic ceremony sites and tropical pageantry.", website: "https://casamarinaresort.com" },
  { name: "Fairchild Tropical Botanic Garden", city: "Coral Gables", state: "Florida", category: "Botanical Garden", rating: 4.9, capacity: "400", description: "83 acres of tropical splendor in Miami with rare palms, bamboo groves, a butterfly conservatory, and lakeside ceremony lawns.", website: "https://fairchildgarden.org" },

  // Georgia (additional)
  { name: "Summerour Studio", city: "Atlanta", state: "Georgia", category: "Historic Estate", rating: 4.8, capacity: "350", description: "A renovated 1920s warehouse on Atlanta's Westside with floor-to-ceiling windows, exposed brick, and skyline views.", website: "https://summerourstudio.com" },
  { name: "Vinewood Plantation", city: "Newnan", state: "Georgia", category: "Historic Estate", rating: 4.9, capacity: "300", description: "A 154-acre estate south of Atlanta with a restored 1840s plantation home, oak allée, and lush pastoral grounds.", website: "https://vinewoodweddings.com" },
  { name: "King Plow Arts Center", city: "Atlanta", state: "Georgia", category: "Historic Estate", rating: 4.8, capacity: "400", description: "A converted 1900s plow factory in West Midtown with soaring industrial spaces, brick walls, and Atlanta's most artful aesthetic.", website: "https://kingplow.com" },

  // Colorado (additional)
  { name: "The Broadmoor", city: "Colorado Springs", state: "Colorado", category: "Hotel & Ballroom", rating: 4.9, capacity: "500", description: "A legendary 1918 Forbes Five-Star resort at the foot of Cheyenne Mountain with European-inspired ballrooms and Pikes Peak views.", website: "https://broadmoor.com" },
  { name: "Spruce Mountain Ranch", city: "Larkspur", state: "Colorado", category: "Mountain & Outdoor", rating: 4.9, capacity: "300", description: "A 230-acre Front Range ranch nestled between Denver and Colorado Springs with stone fireplaces and panoramic Rampart Range vistas.", website: "https://sprucemountainranch.com" },
  { name: "Chautauqua", city: "Boulder", state: "Colorado", category: "Mountain & Outdoor", rating: 4.8, capacity: "250", description: "A National Historic Landmark at the base of Boulder's Flatirons with a 1898 dining hall and storybook mountain backdrop.", website: "https://chautauqua.com" },
  { name: "Wedgewood on Boulder Creek", city: "Boulder", state: "Colorado", category: "Mountain & Outdoor", rating: 4.7, capacity: "200", description: "A creekside ceremony venue in the heart of Boulder with garden grounds and a rustic-elegant indoor reception space.", website: "https://wedgewoodweddings.com/venues/colorado/boulder-creek" },

  // North Carolina (additional)
  { name: "The Old Edwards Inn", city: "Highlands", state: "North Carolina", category: "Historic Estate", rating: 4.9, capacity: "200", description: "A Forbes Five-Star Blue Ridge mountain resort with stone cottages, manicured gardens, and AAA Five Diamond service.", website: "https://oldedwardsinn.com" },
  { name: "Duke Mansion", city: "Charlotte", state: "North Carolina", category: "Historic Estate", rating: 4.8, capacity: "250", description: "A National Historic Landmark Colonial Revival mansion on 4.5 acres in Charlotte's Myers Park with grand interiors and gardens.", website: "https://dukemansion.com" },
  { name: "The Umstead Hotel & Spa", city: "Cary", state: "North Carolina", category: "Hotel & Ballroom", rating: 4.9, capacity: "300", description: "A Forbes Five-Star Triangle-area boutique hotel with art-filled interiors, lakeside ceremony sites, and exquisite cuisine.", website: "https://theumstead.com" },

  // Tennessee (additional)
  { name: "Ravenswood Mansion", city: "Brentwood", state: "Tennessee", category: "Historic Estate", rating: 4.8, capacity: "300", description: "An 1825 Greek Revival plantation house on 426 acres of Williamson County farmland with grand columns and rolling pastures.", website: "https://ravenswoodmansion.com" },
  { name: "Mint Springs Farm", city: "Nolensville", state: "Tennessee", category: "Mountain & Outdoor", rating: 4.8, capacity: "300", description: "A 100-acre family farm just south of Nashville with a stunning glass conservatory, a barn, and panoramic Tennessee hills.", website: "https://mintspringsfarm.com" },
  { name: "The Hermitage Hotel", city: "Nashville", state: "Tennessee", category: "Hotel & Ballroom", rating: 4.9, capacity: "300", description: "Nashville's only Forbes Five-Star hotel — a 1910 Beaux-Arts landmark with the dazzling Grand Ballroom and refined Southern elegance.", website: "https://thehermitagehotel.com" },

  // Hawaii (additional)
  { name: "Loulu Palm Estate", city: "Haleiwa", state: "Hawaii", category: "Beach & Waterfront", rating: 4.9, capacity: "200", description: "A private 5-acre oceanfront estate on Oahu's North Shore with a beach ceremony site, palm groves, and an open-air pavilion.", website: "https://louluweddings.com" },
  { name: "Sugar Beach Events", city: "Maui", state: "Hawaii", category: "Beach & Waterfront", rating: 4.9, capacity: "200", description: "A private oceanfront estate on Maui's south shore with a tropical garden ceremony site and Pacific views.", website: "https://sugarbeachevents.com" },

  // Washington (additional)
  { name: "JM Cellars", city: "Woodinville", state: "Washington", category: "Vineyard", rating: 4.8, capacity: "200", description: "A boutique winery on a 7-acre Bramble Bump estate in Woodinville wine country with a stunning hilltop ceremony site.", website: "https://jmcellars.com" },
  { name: "Roche Harbor Resort", city: "Friday Harbor", state: "Washington", category: "Beach & Waterfront", rating: 4.8, capacity: "250", description: "A historic seaside resort on San Juan Island with a 1886 chapel, formal gardens, and a working marina.", website: "https://rocheharbor.com" },
  { name: "Sodo Park", city: "Seattle", state: "Washington", category: "Historic Estate", rating: 4.8, capacity: "400", description: "A converted 1907 industrial building in Seattle's Sodo district with soaring timber beams, exposed brick, and modern industrial elegance.", website: "https://sodopark.com" },

  // Oregon (additional)
  { name: "Domaine de Broglie", city: "Dayton", state: "Oregon", category: "Vineyard", rating: 4.9, capacity: "200", description: "A storybook hilltop château in the Dundee Hills with sweeping Willamette Valley vineyard views.", website: "https://domainedebroglie.com" },
  { name: "Timberline Lodge", city: "Mount Hood", state: "Oregon", category: "Mountain & Outdoor", rating: 4.8, capacity: "200", description: "A National Historic Landmark 1937 ski lodge perched at 6,000 ft on Mount Hood with hand-carved interiors and alpine grandeur.", website: "https://timberlinelodge.com" },

  // Massachusetts (additional)
  { name: "OceanCliff", city: "Newport", state: "Rhode Island", category: "Beach & Waterfront", rating: 4.8, capacity: "300", description: "A breathtaking 1864 mansion perched on Newport's Ocean Drive with panoramic Atlantic views and a Gilded Age ballroom.", website: "https://oceancliff.com" },
  { name: "Wheatleigh", city: "Lenox", state: "Massachusetts", category: "Historic Estate", rating: 4.9, capacity: "120", description: "An intimate 1893 Italian palazzo in the Berkshires designed in the manner of a 16th-century Florentine villa.", website: "https://wheatleigh.com" },
  { name: "Castle Hill Inn", city: "Newport", state: "Rhode Island", category: "Beach & Waterfront", rating: 4.9, capacity: "200", description: "A Relais & Châteaux 1875 mansion on a 40-acre Newport peninsula with sweeping Narragansett Bay views.", website: "https://castlehillinn.com" },

  // Illinois (additional)
  { name: "Bridgeport Art Center", city: "Chicago", state: "Illinois", category: "Historic Estate", rating: 4.8, capacity: "400", description: "A converted 1909 industrial building on Chicago's South Side with sky-lit galleries and stunning skyline views.", website: "https://bridgeportart.com" },
  { name: "Galleria Marchetti", city: "Chicago", state: "Illinois", category: "Hotel & Ballroom", rating: 4.8, capacity: "350", description: "A romantic Italian-inspired venue near the West Loop with a tented courtyard, fountain, and string-lit garden.", website: "https://galleriamarchetti.com" },
  { name: "Morton Arboretum", city: "Lisle", state: "Illinois", category: "Botanical Garden", rating: 4.8, capacity: "300", description: "A 1,700-acre living museum of trees with stunning ceremony lawns, woodland trails, and seasonal blooms.", website: "https://mortonarb.org" },

  // Pennsylvania (additional)
  { name: "Aldie Mansion", city: "Doylestown", state: "Pennsylvania", category: "Historic Estate", rating: 4.8, capacity: "200", description: "A stunning 1927 Tudor-Jacobean mansion on 10 acres in Bucks County with formal gardens and grand interiors.", website: "https://aldiemansion.com" },
  { name: "The Curtis", city: "Philadelphia", state: "Pennsylvania", category: "Historic Estate", rating: 4.8, capacity: "400", description: "A 1910 Beaux-Arts publishing landmark with the breathtaking Dream Garden mosaic by Maxfield Parrish and Tiffany.", website: "https://thecurtis.com" },

  // Michigan (additional)
  { name: "The Henry Ford", city: "Dearborn", state: "Michigan", category: "Historic Estate", rating: 4.8, capacity: "400", description: "A storied indoor museum and outdoor village with stunning event spaces among the world's most iconic Americana.", website: "https://thehenryford.org" },
  { name: "Cherry Republic Winery & Reserve", city: "Glen Arbor", state: "Michigan", category: "Vineyard", rating: 4.7, capacity: "200", description: "A romantic northern Michigan farm-vineyard near Sleeping Bear Dunes with cherry orchards and Lake Michigan accessibility.", website: "https://cherryrepublic.com" },

  // Virginia (additional)
  { name: "The Jefferson Hotel", city: "Richmond", state: "Virginia", category: "Hotel & Ballroom", rating: 4.9, capacity: "400", description: "A Forbes Five-Star 1895 Beaux-Arts grand dame with a sweeping marble staircase and dazzling rotunda.", website: "https://jeffersonhotel.com" },
  { name: "Salamander Resort", city: "Middleburg", state: "Virginia", category: "Historic Estate", rating: 4.9, capacity: "350", description: "A 340-acre luxury resort in horse country with a stately manor house, grand ballroom, and sweeping Blue Ridge views.", website: "https://salamanderresort.com" },

  // Arizona (additional)
  { name: "L'Auberge de Sedona", city: "Sedona", state: "Arizona", category: "Mountain & Outdoor", rating: 4.9, capacity: "150", description: "A serene creekside retreat at the base of Sedona's red rocks with cottages along Oak Creek and dramatic vortex backdrops.", website: "https://lauberge.com" },
  { name: "Hermosa Inn", city: "Paradise Valley", state: "Arizona", category: "Historic Estate", rating: 4.9, capacity: "200", description: "An intimate 1930s adobe hacienda hideaway in Paradise Valley with garden patios and Camelback Mountain views.", website: "https://hermosainn.com" },

  // Utah (additional)
  { name: "Stein Eriksen Lodge", city: "Park City", state: "Utah", category: "Mountain & Outdoor", rating: 4.9, capacity: "250", description: "A Forbes Five-Star Norwegian-inspired mountain lodge perched mid-mountain at Deer Valley with breathtaking Wasatch views.", website: "https://steinlodge.com" },

  // South Carolina (additional)
  { name: "The Ocean Course at Kiawah", city: "Kiawah Island", state: "South Carolina", category: "Beach & Waterfront", rating: 4.9, capacity: "300", description: "A Forbes Five-Star coastal resort on Kiawah Island with a stunning beachfront ballroom and PGA-acclaimed grounds.", website: "https://kiawahresort.com" },
  { name: "The Inn at Palmetto Bluff", city: "Bluffton", state: "South Carolina", category: "Historic Estate", rating: 4.9, capacity: "300", description: "A 20,000-acre Lowcountry sanctuary with a stunning Wilson Village chapel, oak allées, and the May River.", website: "https://montagepalmettobluff.com" },

  // Nevada (additional)
  { name: "Wynn Las Vegas", city: "Las Vegas", state: "Nevada", category: "Hotel & Ballroom", rating: 4.9, capacity: "1000", description: "Forbes Five-Star opulence on the Las Vegas Strip with grand ballrooms, lakeside ceremony gardens, and showstopping floral displays.", website: "https://wynnlasvegas.com" },

  // Vermont (additional)
  { name: "Topnotch Resort", city: "Stowe", state: "Vermont", category: "Mountain & Outdoor", rating: 4.8, capacity: "250", description: "A serene mountain resort on 120 acres at the foot of Mount Mansfield with valley views and a Nordic-inspired spa.", website: "https://topnotchresort.com" },

  // Maine (additional)
  { name: "Hidden Pond", city: "Kennebunkport", state: "Maine", category: "Mountain & Outdoor", rating: 4.9, capacity: "200", description: "A boutique Maine resort tucked into 60 acres of birch and balsam fir with private lodges and farm-to-table cuisine.", website: "https://hiddenpondmaine.com" },

  // Delaware (additional)
  { name: "Nemours Estate", city: "Wilmington", state: "Delaware", category: "Historic Estate", rating: 4.9, capacity: "300", description: "A 200-acre estate built by Alfred I. du Pont in 1909-10 — a French-inspired château with the largest formal French gardens in North America.", website: "https://nemoursestate.org" },

  // ══════════════════════════════════════════════════════════════════════════════
  // INTERNATIONAL — Top wedding destinations
  // ══════════════════════════════════════════════════════════════════════════════

  // ── Italy · Tuscany ──────────────────────────────────────────────────────────
  { name: "Borgo Santo Pietro", city: "Chiusdino", state: "Tuscany", country: "Italy", category: "Historic Estate", rating: 4.9, capacity: "150", description: "A 13th-century restored borgo set on 300 acres of Tuscan countryside — a Relais & Châteaux estate with frescoed villas and biodynamic gardens.", website: "https://borgosantopietro.com" },
  { name: "Castello di Vicarello", city: "Cinigiano", state: "Tuscany", country: "Italy", category: "Historic Estate", rating: 4.9, capacity: "120", description: "A 12th-century stone castle perched in the Maremma hills, surrounded by olive groves and vineyards — a private and romantic Italian sanctuary.", website: "https://castellodivicarello.com" },
  { name: "Villa Cetinale", city: "Sovicille", state: "Tuscany", country: "Italy", category: "Historic Estate", rating: 4.9, capacity: "200", description: "A 17th-century baroque villa near Siena designed by Carlo Fontana, set among formal Italian gardens, lemon groves, and ancient cypress avenues.", website: "https://villacetinale.com" },
  { name: "Castello di Velona", city: "Montalcino", state: "Tuscany", country: "Italy", category: "Vineyard", rating: 4.8, capacity: "180", description: "An 11th-century castle resort overlooking the Val d'Orcia with Brunello vineyards, thermal pools, and panoramic Tuscan vistas.", website: "https://castellodivelona.com" },

  // ── Italy · Amalfi Coast ─────────────────────────────────────────────────────
  { name: "Hotel Caruso", city: "Ravello", state: "Amalfi Coast", country: "Italy", category: "Hotel & Ballroom", rating: 4.9, capacity: "150", description: "An 11th-century palace perched 1,200 feet above the Amalfi Coast with the legendary infinity pool overlooking the Tyrrhenian Sea.", website: "https://hotelcaruso.com" },
  { name: "Villa Cimbrone", city: "Ravello", state: "Amalfi Coast", country: "Italy", category: "Historic Estate", rating: 4.9, capacity: "200", description: "An 11th-century villa with the iconic Terrace of Infinity — sweeping coastal views over centuries-old gardens carved into the cliffside.", website: "https://villacimbrone.com" },
  { name: "Belmond Hotel Caruso", city: "Positano", state: "Amalfi Coast", country: "Italy", category: "Hotel & Ballroom", rating: 4.9, capacity: "120", description: "A cliffside legend on the Amalfi Coast offering private terraces, antique frescoes, and sea-to-sky vistas.", website: "https://belmond.com" },

  // ── Italy · Lake Como ────────────────────────────────────────────────────────
  { name: "Villa del Balbianello", city: "Lenno", state: "Lake Como", country: "Italy", category: "Historic Estate", rating: 5.0, capacity: "150", description: "An 18th-century villa on a wooded promontory of Lake Como, made famous by Star Wars and Casino Royale — one of the most photographed venues on earth.", website: "https://fondoambiente.it" },
  { name: "Villa Erba", city: "Cernobbio", state: "Lake Como", country: "Italy", category: "Historic Estate", rating: 4.9, capacity: "400", description: "A 19th-century neoclassical villa on Lake Como with private gardens and a glass-domed pavilion overlooking the water.", website: "https://villaerba.it" },
  { name: "Grand Hotel Tremezzo", city: "Tremezzo", state: "Lake Como", country: "Italy", category: "Hotel & Ballroom", rating: 4.9, capacity: "200", description: "A belle époque palace hotel on the shores of Lake Como with panoramic terraces and an iconic floating pool.", website: "https://grandhoteltremezzo.com" },

  // ── Italy · Sicily / Rome / Venice / Puglia ──────────────────────────────────
  { name: "Verdura Resort", city: "Sciacca", state: "Sicily", country: "Italy", category: "Beach & Waterfront", rating: 4.9, capacity: "250", description: "A 230-acre Rocco Forte resort along Sicily's southern coast with olive groves, golf, and a mile of private Mediterranean beach.", website: "https://roccofortehotels.com" },
  { name: "Villa Igiea", city: "Palermo", state: "Sicily", country: "Italy", category: "Historic Estate", rating: 4.9, capacity: "200", description: "An art nouveau seaside palace in Palermo, recently restored by Rocco Forte — frescoes, fountains, and Mediterranean grandeur.", website: "https://roccofortehotels.com" },
  { name: "Villa Aurelia", city: "Rome", state: "Rome", country: "Italy", category: "Historic Estate", rating: 4.9, capacity: "300", description: "A 17th-century baroque villa atop the Janiculum Hill with sweeping panoramas of Rome and 10 acres of formal Italian gardens.", website: "https://villaaurelia.it" },
  { name: "Belmond Hotel Cipriani", city: "Venice", state: "Venice", country: "Italy", category: "Hotel & Ballroom", rating: 4.9, capacity: "200", description: "A legendary lagoon-side resort on Giudecca Island with private gardens, an Olympic-sized pool, and views of San Marco.", website: "https://belmond.com" },
  { name: "Borgo Egnazia", city: "Savelletri di Fasano", state: "Puglia", country: "Italy", category: "Beach & Waterfront", rating: 4.9, capacity: "300", description: "A whitewashed Apulian village built from local tufa stone with seaside chapels, olive groves, and Justin Timberlake's wedding venue.", website: "https://borgoegnazia.com" },
  { name: "Masseria Torre Maizza", city: "Fasano", state: "Puglia", country: "Italy", category: "Historic Estate", rating: 4.8, capacity: "150", description: "A 16th-century fortified farmhouse in Puglia with whitewashed courtyards, olive groves, and a private beach club.", website: "https://roccofortehotels.com" },

  // ── France · Provence ────────────────────────────────────────────────────────
  { name: "Château de Berne", city: "Lorgues", state: "Provence", country: "France", category: "Vineyard", rating: 4.9, capacity: "250", description: "A Relais & Châteaux estate on a 1,500-acre Provençal vineyard with stone chapels, formal gardens, and award-winning rosé.", website: "https://chateauberne.com" },
  { name: "Château La Coste", city: "Le Puy-Sainte-Réparade", state: "Provence", country: "France", category: "Vineyard", rating: 4.9, capacity: "200", description: "A 600-acre wine estate where art, architecture, and gastronomy meet — featuring works by Frank Gehry, Tadao Ando, and Louise Bourgeois.", website: "https://chateau-la-coste.com" },
  { name: "Le Mas des Poiriers", city: "Avignon", state: "Provence", country: "France", category: "Historic Estate", rating: 4.8, capacity: "180", description: "A romantic 19th-century Provençal mas surrounded by lavender fields, plane trees, and centuries-old gardens.", website: "https://lemasdespoiriers.com" },

  // ── France · French Riviera ──────────────────────────────────────────────────
  { name: "Hôtel du Cap-Eden-Roc", city: "Antibes", state: "French Riviera", country: "France", category: "Hotel & Ballroom", rating: 4.9, capacity: "300", description: "A storied 1870 palace on Cap d'Antibes with private cabanas, a clifftop infinity pool, and a century of legendary celebrations.", website: "https://hotel-du-cap-eden-roc.com" },
  { name: "Château Saint-Martin & Spa", city: "Vence", state: "French Riviera", country: "France", category: "Historic Estate", rating: 4.9, capacity: "150", description: "A medieval Templar estate above the Côte d'Azur with sweeping Mediterranean views, olive groves, and Michelin-starred cuisine.", website: "https://chateau-st-martin.com" },
  { name: "Villa Ephrussi de Rothschild", city: "Saint-Jean-Cap-Ferrat", state: "French Riviera", country: "France", category: "Historic Estate", rating: 4.9, capacity: "200", description: "A pink belle époque villa surrounded by nine themed gardens overlooking the Mediterranean — one of the Riviera's most romantic venues.", website: "https://villa-ephrussi.com" },

  // ── France · Paris / Loire / Bordeaux / Champagne ────────────────────────────
  { name: "Shangri-La Paris", city: "Paris", state: "Paris", country: "France", category: "Hotel & Ballroom", rating: 4.9, capacity: "200", description: "Napoleon's grand-nephew's former palace overlooking the Eiffel Tower, with three Michelin-starred restaurants and gilded ballrooms.", website: "https://shangri-la.com/paris" },
  { name: "Château de Chenonceau", city: "Chenonceaux", state: "Loire Valley", country: "France", category: "Historic Estate", rating: 5.0, capacity: "200", description: "The legendary Château des Dames spanning the River Cher — a Renaissance masterpiece with formal gardens of Catherine de Medici.", website: "https://chenonceau.com" },
  { name: "Château de Villette", city: "Bordeaux", state: "Bordeaux", country: "France", category: "Vineyard", rating: 4.8, capacity: "180", description: "A privately owned 18th-century château amidst Bordeaux vineyards with formal French gardens and a private chapel.", website: "https://chateaudevillette.com" },
  { name: "Domaine Les Crayères", city: "Reims", state: "Champagne", country: "France", category: "Historic Estate", rating: 4.9, capacity: "120", description: "A turn-of-the-century château at the heart of Champagne, surrounded by 17 acres of parkland and Michelin-starred dining.", website: "https://lescrayeres.com" },

  // ── Mexico · Riviera Maya / Tulum / Los Cabos / Puerto Vallarta / SMA ────────
  { name: "Rosewood Mayakoba", city: "Playa del Carmen", state: "Riviera Maya", country: "Mexico", category: "Beach & Waterfront", rating: 4.9, capacity: "300", description: "A jungle and lagoon resort along the Riviera Maya with private overwater suites, white-sand beaches, and cenote ceremonies.", website: "https://rosewoodhotels.com/mayakoba" },
  { name: "Banyan Tree Mayakoba", city: "Playa del Carmen", state: "Riviera Maya", country: "Mexico", category: "Beach & Waterfront", rating: 4.8, capacity: "250", description: "An Asian-inspired resort hidden in mangroves and lagoons of the Riviera Maya, with private villa pools and serene spa rituals.", website: "https://banyantree.com/mayakoba" },
  { name: "Azulik Tulum", city: "Tulum", state: "Tulum", country: "Mexico", category: "Beach & Waterfront", rating: 4.8, capacity: "150", description: "A bohemian eco-resort woven into the Tulum jungle with treehouse villas, ocean-view ceremonies, and barefoot luxury.", website: "https://azulik.com" },
  { name: "Esperanza Resort", city: "Cabo San Lucas", state: "Los Cabos", country: "Mexico", category: "Beach & Waterfront", rating: 4.9, capacity: "300", description: "An Auberge resort on a private cove of the Sea of Cortez with cliffside ceremony lawns and dramatic ocean panoramas.", website: "https://aubergeresorts.com/esperanza" },
  { name: "One&Only Palmilla", city: "San José del Cabo", state: "Los Cabos", country: "Mexico", category: "Hotel & Ballroom", rating: 4.9, capacity: "400", description: "A legendary hacienda-style resort on Cabo's Gold Coast with a private beach, white chapel, and seaside ballrooms.", website: "https://oneandonlyresorts.com/palmilla" },
  { name: "Hacienda San Angel", city: "Puerto Vallarta", state: "Puerto Vallarta", country: "Mexico", category: "Historic Estate", rating: 4.8, capacity: "200", description: "An intimate hilltop hacienda overlooking Banderas Bay — once Richard Burton's home, now a romantic boutique venue.", website: "https://haciendasanangel.com" },
  { name: "Rosewood San Miguel de Allende", city: "San Miguel de Allende", state: "San Miguel de Allende", country: "Mexico", category: "Hotel & Ballroom", rating: 4.9, capacity: "300", description: "A colonial-style luxury hotel in the historic heart of San Miguel with rooftop terraces overlooking the Parroquia.", website: "https://rosewoodhotels.com/sanmiguel" },

  // ── Spain · Mallorca / Ibiza / Barcelona / Andalusia / Marbella ──────────────
  { name: "Cap Rocat", city: "Cala Blava", state: "Mallorca", country: "Spain", category: "Historic Estate", rating: 4.9, capacity: "200", description: "A converted 19th-century military fortress on the cliffs of Mallorca with private coves, dramatic stone architecture, and Mediterranean views.", website: "https://caprocat.com" },
  { name: "Son Marroig", city: "Deià", state: "Mallorca", country: "Spain", category: "Historic Estate", rating: 4.9, capacity: "120", description: "Archduke Ludwig Salvator's 19th-century estate above the Tramuntana coast — a legendary cliffside venue with marble belvedere.", website: "https://sonmarroig.com" },
  { name: "Hacienda Na Xamena", city: "San Miguel", state: "Ibiza", country: "Spain", category: "Beach & Waterfront", rating: 4.8, capacity: "200", description: "A clifftop sanctuary on Ibiza's wild north coast with infinity pools cascading toward the sea — pure Mediterranean magic.", website: "https://hotelhacienda-ibiza.com" },
  { name: "Atzaró Agroturismo", city: "Santa Eulalia", state: "Ibiza", country: "Spain", category: "Historic Estate", rating: 4.8, capacity: "300", description: "A 300-year-old Ibicenco farmhouse on a working orange grove with bohemian gardens, palms, and outdoor ceremony spaces.", website: "https://atzaro.com" },
  { name: "Hotel Arts Barcelona", city: "Barcelona", state: "Barcelona", country: "Spain", category: "Hotel & Ballroom", rating: 4.8, capacity: "400", description: "A Ritz-Carlton property on Barcelona's beachfront with dramatic harbor views and Frank Gehry's golden fish overhead.", website: "https://hotelartsbarcelona.com" },
  { name: "Hacienda La Boticaria", city: "Seville", state: "Andalusia", country: "Spain", category: "Historic Estate", rating: 4.9, capacity: "300", description: "An 18th-century Andalusian hacienda with whitewashed courtyards, Moorish gardens, and private chapel near Seville.", website: "https://haciendalaboticaria.com" },
  { name: "Marbella Club Hotel", city: "Marbella", state: "Marbella", country: "Spain", category: "Hotel & Ballroom", rating: 4.9, capacity: "350", description: "A legendary beachfront resort founded by Prince Alfonso of Hohenlohe in 1954 — Andalusian villas and Mediterranean glamour.", website: "https://marbellaclub.com" },

  // ── Greece · Santorini / Mykonos / Crete / Athens / Corfu ────────────────────
  { name: "Le Ciel Wedding Santorini", city: "Imerovigli", state: "Santorini", country: "Greece", category: "Beach & Waterfront", rating: 5.0, capacity: "100", description: "A purpose-built clifftop wedding venue on Santorini's caldera edge with an open-air chapel framed by the Aegean sunset.", website: "https://leciel-santorini.com" },
  { name: "Canaves Oia", city: "Oia", state: "Santorini", country: "Greece", category: "Hotel & Ballroom", rating: 4.9, capacity: "120", description: "A boutique cliffside hotel in Oia with cycladic suites, infinity pools, and the most celebrated sunset vista in the world.", website: "https://canaves.com" },
  { name: "Cavo Tagoo Mykonos", city: "Mykonos Town", state: "Mykonos", country: "Greece", category: "Hotel & Ballroom", rating: 4.9, capacity: "200", description: "A whitewashed cliffside resort with private terraces, an aquarium-walled lounge, and panoramic Aegean ceremony spaces.", website: "https://cavotagoo.com" },
  { name: "Belvedere Mykonos", city: "Mykonos Town", state: "Mykonos", country: "Greece", category: "Beach & Waterfront", rating: 4.8, capacity: "150", description: "A boutique hotel above Mykonos Town with poolside celebrations and Matsuhisa restaurant by Nobu.", website: "https://belvederehotel.com" },
  { name: "Domes of Elounda", city: "Elounda", state: "Crete", country: "Greece", category: "Beach & Waterfront", rating: 4.9, capacity: "300", description: "An Autograph Collection resort on Crete's Mirabello Bay with private beach ceremonies and panoramic Aegean cliffsides.", website: "https://domesresorts.com/elounda" },
  { name: "Four Seasons Astir Palace Athens", city: "Vouliagmeni", state: "Athens", country: "Greece", category: "Hotel & Ballroom", rating: 4.9, capacity: "400", description: "A reborn icon on the Athenian Riviera with three private beaches, cypress-lined paths, and views of the Saronic Gulf.", website: "https://fourseasons.com/athens" },
  { name: "Grecotel Corfu Imperial", city: "Komeno", state: "Corfu", country: "Greece", category: "Beach & Waterfront", rating: 4.8, capacity: "300", description: "A private peninsula resort on Corfu with white-sand beaches, olive groves, and seaside chapel ceremonies.", website: "https://grecotel.com/corfu-imperial" },

  // ── United Kingdom · Cotswolds / Lake District / Highlands / London / Cornwall
  { name: "Soho Farmhouse", city: "Great Tew", state: "Cotswolds", country: "United Kingdom", category: "Historic Estate", rating: 4.9, capacity: "200", description: "A 100-acre Cotswolds members' retreat with restored barns, lakeside cabins, and Meghan Markle's hen-do venue.", website: "https://sohofarmhouse.com" },
  { name: "Daylesford Organic Farm", city: "Kingham", state: "Cotswolds", country: "United Kingdom", category: "Historic Estate", rating: 4.9, capacity: "150", description: "A 2,500-acre organic farm with restored stone barns, gardens, and a private chapel in the heart of the Cotswolds.", website: "https://daylesford.com" },
  { name: "Cliveden House", city: "Taplow", state: "Cotswolds", country: "United Kingdom", category: "Historic Estate", rating: 4.9, capacity: "300", description: "A 17th-century stately home above the Thames with 376 acres of National Trust gardens — once home to the Astors.", website: "https://clivedenhouse.co.uk" },
  { name: "Askham Hall", city: "Penrith", state: "Lake District", country: "United Kingdom", category: "Historic Estate", rating: 4.9, capacity: "120", description: "A 14th-century pele tower and country house in the Lake District with walled gardens and Michelin-starred dining.", website: "https://askhamhall.co.uk" },
  { name: "Inverlochy Castle", city: "Fort William", state: "Scottish Highlands", country: "United Kingdom", category: "Historic Estate", rating: 4.9, capacity: "120", description: "A 19th-century baronial castle in the shadow of Ben Nevis, surrounded by 500 acres of Highland forest and lochs.", website: "https://inverlochycastlehotel.com" },
  { name: "Glenapp Castle", city: "Ballantrae", state: "Scottish Highlands", country: "United Kingdom", category: "Historic Estate", rating: 4.9, capacity: "100", description: "A Relais & Châteaux Scottish baronial castle on 110 acres overlooking the Irish Sea — pure Highland fairytale.", website: "https://glenappcastle.com" },
  { name: "Claridge's", city: "London", state: "London", country: "United Kingdom", category: "Hotel & Ballroom", rating: 4.9, capacity: "300", description: "An art deco icon in Mayfair with the celebrated Ballroom — a century of royal weddings and old-world London elegance.", website: "https://claridges.co.uk" },
  { name: "Tregenna Castle", city: "St Ives", state: "Cornwall", country: "United Kingdom", category: "Historic Estate", rating: 4.7, capacity: "250", description: "An 18th-century granite castle perched above St Ives Bay with panoramic Cornish coastline views and 72 acres of grounds.", website: "https://tregenna-castle.co.uk" },

  // ── Portugal · Algarve / Lisbon / Douro / Sintra ─────────────────────────────
  { name: "Vila Vita Parc", city: "Porches", state: "Algarve", country: "Portugal", category: "Beach & Waterfront", rating: 4.9, capacity: "300", description: "A 22-hectare clifftop resort on the Algarve with private beach coves, subtropical gardens, and a Michelin-two-starred restaurant.", website: "https://vilavitaparc.com" },
  { name: "Quinta do Lago", city: "Almancil", state: "Algarve", country: "Portugal", category: "Beach & Waterfront", rating: 4.8, capacity: "250", description: "A 2,000-acre nature reserve resort along the Algarve with private beach access, lagoon ceremonies, and championship golf.", website: "https://quintadolago.com" },
  { name: "Palácio Belmonte", city: "Lisbon", state: "Lisbon", country: "Portugal", category: "Historic Estate", rating: 4.9, capacity: "120", description: "A restored 15th-century palace on the highest hill of Lisbon with hand-painted azulejos, private gardens, and Alfama views.", website: "https://palaciobelmonte.com" },
  { name: "The Yeatman", city: "Vila Nova de Gaia", state: "Douro Valley", country: "Portugal", category: "Vineyard", rating: 4.9, capacity: "200", description: "A wine hotel above the Douro with sweeping views of Porto, a Michelin-two-starred restaurant, and the world's largest port wine cellar.", website: "https://the-yeatman-hotel.com" },
  { name: "Tivoli Palácio de Seteais", city: "Sintra", state: "Sintra", country: "Portugal", category: "Historic Estate", rating: 4.9, capacity: "180", description: "An 18th-century neoclassical palace in the romantic mountains of Sintra with frescoed ceilings and formal gardens.", website: "https://tivolihotels.com/seteais" },

  // ── Caribbean · Bahamas / Jamaica / St. Lucia / Turks / Barbados ─────────────
  { name: "The Ocean Club, A Four Seasons Resort", city: "Paradise Island", state: "Bahamas", country: "Caribbean", category: "Beach & Waterfront", rating: 4.9, capacity: "250", description: "A legendary Four Seasons resort on Paradise Island with versailles-inspired cloister gardens and Bahamian beach ceremonies.", website: "https://fourseasons.com/oceanclub" },
  { name: "Round Hill Hotel & Villas", city: "Montego Bay", state: "Jamaica", country: "Caribbean", category: "Beach & Waterfront", rating: 4.9, capacity: "200", description: "A 110-acre cliffside resort with Ralph Lauren-designed interiors, private villa pools, and the Caribbean's most storied guest list.", website: "https://roundhill.com" },
  { name: "Jade Mountain Resort", city: "Soufrière", state: "St. Lucia", country: "Caribbean", category: "Mountain & Outdoor", rating: 5.0, capacity: "100", description: "An architectural masterpiece with open-walled sanctuaries facing St. Lucia's iconic Pitons — perhaps the most romantic hotel on earth.", website: "https://jademountain.com" },
  { name: "Sugar Beach, A Viceroy Resort", city: "Soufrière", state: "St. Lucia", country: "Caribbean", category: "Beach & Waterfront", rating: 4.9, capacity: "200", description: "A 100-acre beachfront resort nestled between St. Lucia's Pitons with rainforest villas and white-sand ceremony beaches.", website: "https://viceroyhotelsandresorts.com/sugarbeach" },
  { name: "COMO Parrot Cay", city: "Parrot Cay", state: "Turks & Caicos", country: "Caribbean", category: "Beach & Waterfront", rating: 4.9, capacity: "150", description: "A 1,000-acre private island with one mile of pristine beach — a barefoot-luxury sanctuary for intimate Caribbean weddings.", website: "https://comohotels.com/parrotcay" },
  { name: "Sandy Lane", city: "St. James", state: "Barbados", country: "Caribbean", category: "Hotel & Ballroom", rating: 4.9, capacity: "300", description: "A coral stone resort on Barbados's Platinum Coast with private beaches, three championship golf courses, and Old World grandeur.", website: "https://sandylane.com" },
];

export function getVenuesByState(state: string): Venue[] {
  return VENUES.filter((v) => v.state === state).sort((a, b) => b.rating - a.rating);
}

export function getVenuesByCountryRegion(country: string, region: string): Venue[] {
  return VENUES.filter((v) => {
    const venueCountry = v.country ?? "United States";
    return venueCountry === country && v.state === region;
  }).sort((a, b) => b.rating - a.rating);
}
