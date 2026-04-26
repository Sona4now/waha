/**
 * English overlays for the 360° tour entries on /tours.
 * Keyed by tour id. Per-field fallback to the Arabic source.
 */

export interface TourEnFields {
  name?: string;
  subtitle?: string;
  destinationName?: string;
  description?: string;
}

export const TOURS_EN: Record<string, TourEnFields> = {
  "gara-cave": {
    name: "Gara Cave",
    subtitle: "Stone formations and Stone Age drawings",
    destinationName: "Bahariya",
    description:
      "Explore the Gara Cave with its unique rock formations and historic drawings in an immersive virtual tour.",
  },
  "oases-farms": {
    name: "Oasis Farms",
    subtitle: "Lush green farms in the heart of the desert",
    destinationName: "Bahariya",
    description:
      "A virtual stroll through the green oasis farms — palms, olives, and traditional desert life.",
  },
  "moon-cave": {
    name: "Moon Cave",
    subtitle: "A surreal natural formation",
    destinationName: "Bahariya",
    description:
      "Step into the Moon Cave with its otherworldly rock formations.",
  },
  "black-desert": {
    name: "Black Desert",
    subtitle: "Volcanic terrain of basalt and quartz",
    destinationName: "Bahariya",
    description:
      "Immerse yourself in the volcanic Black Desert — an exceptional visual experience that lowers stress and sharpens focus.",
  },
  "white-desert": {
    name: "White Desert",
    subtitle: "Wind-sculpted chalk formations",
    destinationName: "Bahariya",
    description:
      "Discover the White Desert and its surreal cosmic formations — a healing journey for body and mind.",
  },
  "siwa-palms": {
    name: "Siwa Palm Groves",
    subtitle: "300,000 palm trees at the heart of the oasis",
    destinationName: "Siwa",
    description:
      "Wander through Siwa's palm groves and the desert beauty around them.",
  },
  "cleopatra-spring": {
    name: "Cleopatra's Spring",
    subtitle: "The legendary archaeological spring",
    destinationName: "Siwa",
    description:
      "Visit the famous spring where the bride traditionally bathes before her wedding — a unique mineral and cultural site.",
  },
  "shali-fortress": {
    name: "Shali Fortress",
    subtitle: "Heritage and traditional architecture",
    destinationName: "Siwa",
    description:
      "Explore Shali Fortress, built from kershef — a witness to Siwa's ancient Amazigh heritage.",
  },
  "shagie-farms-1": {
    name: "Shagie Farms — Tour 1",
    subtitle: "The entrance and the wider farm view",
    destinationName: "Shagie Farms",
    description:
      "Enter the farm through its main gate and take in the wider view of the green land and crop variety.",
  },
  "shagie-farms-2": {
    name: "Shagie Farms — Tour 2",
    subtitle: "Mango groves and fruit trees",
    destinationName: "Shagie Farms",
    description:
      "Walk through the sukkari mango groves and other fruit trees — more than 10 organic varieties.",
  },
  "shagie-farms-3": {
    name: "Shagie Farms — Tour 3",
    subtitle: "Interactive activities and animals",
    destinationName: "Shagie Farms",
    description:
      "Discover the interactive area — animal pens, the horse stable, and the lived farming experience.",
  },
  "shagie-farms-4": {
    name: "Shagie Farms — Tour 4",
    subtitle: "The heritage village and accommodation",
    destinationName: "Shagie Farms",
    description:
      "Step into the heritage village — traditional houses, accommodation tents, and rural cooking.",
  },
};
