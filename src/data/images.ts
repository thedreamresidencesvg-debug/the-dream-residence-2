export type ImageCategory =
  | "exterior"
  | "living-room"
  | "kitchen"
  | "dining"
  | "bedrooms"
  | "bathrooms";

export interface PropertyImage {
  src: string;
  alt: string;
  category: ImageCategory;
  featured?: boolean;
}

export const CATEGORY_LABELS: Record<ImageCategory, string> = {
  exterior: "Exterior",
  "living-room": "Living Room",
  kitchen: "Kitchen",
  dining: "Dining",
  bedrooms: "Bedrooms",
  bathrooms: "Bathrooms",
};

export const images: PropertyImage[] = [
  // Exterior
  {
    src: "/images/exterior/exterior-front-full.jpg",
    alt: "The Dream Residence - full front view with green lawn and blue sky",
    category: "exterior",
    featured: true,
  },
  {
    src: "/images/exterior/exterior-front-angle.jpg",
    alt: "Front angle view showing the balcony and covered ground floor",
    category: "exterior",
  },
  {
    src: "/images/exterior/exterior-side-right.jpg",
    alt: "Side view of the residence showing multiple levels",
    category: "exterior",
  },
  {
    src: "/images/exterior/exterior-balcony-close.jpg",
    alt: "Close-up of the upper balcony with purple accents and decorative railing",
    category: "exterior",
  },
  {
    src: "/images/exterior/exterior-balcony-wide.jpg",
    alt: "Wide angle of the balcony and column structure",
    category: "exterior",
  },

  // Living Room
  {
    src: "/images/living-room/living-room-wide.jpg",
    alt: "Spacious living room with comfortable sofas and air conditioning",
    category: "living-room",
    featured: true,
  },
  {
    src: "/images/living-room/living-room-tv.jpg",
    alt: "Living room entertainment area with wall-mounted TV",
    category: "living-room",
  },
  {
    src: "/images/living-room/living-room-angle.jpg",
    alt: "Living room with natural light streaming through curtains",
    category: "living-room",
  },

  // Kitchen
  {
    src: "/images/kitchen/kitchen-full.jpg",
    alt: "Modern U-shaped kitchen with grey cabinets and stainless steel appliances",
    category: "kitchen",
    featured: true,
  },
  {
    src: "/images/kitchen/kitchen-dining-wide.jpg",
    alt: "Kitchen and dining area with vaulted ceiling and air conditioning",
    category: "kitchen",
  },

  // Dining
  {
    src: "/images/dining/dining-kitchen-combo.jpg",
    alt: "Open-plan kitchen and dining area with modern furnishings",
    category: "dining",
  },
  {
    src: "/images/dining/dining-indoor-table.jpg",
    alt: "Indoor dining table with elegant chrome chairs",
    category: "dining",
    featured: true,
  },
  {
    src: "/images/dining/dining-table-detail.jpg",
    alt: "Dining table with fresh tropical fruit centerpiece",
    category: "dining",
  },
  {
    src: "/images/dining/dining-outdoor-patio.jpg",
    alt: "Outdoor patio dining area with stone wall and wicker chairs",
    category: "dining",
  },

  // Bedrooms
  {
    src: "/images/bedrooms/bedroom-master-wide.jpg",
    alt: "Master bedroom with queen bed, grey furniture, and parquet floors",
    category: "bedrooms",
    featured: true,
  },
  {
    src: "/images/bedrooms/bedroom-master-angle.jpg",
    alt: "Master bedroom alternate view with dresser and en-suite door",
    category: "bedrooms",
  },
  {
    src: "/images/bedrooms/bedroom-purple.jpg",
    alt: "Cozy bedroom with lavender bedding and grey furniture",
    category: "bedrooms",
  },
  {
    src: "/images/bedrooms/bedroom-purple-close.jpg",
    alt: "Bedroom with upholstered headboard and purple linens",
    category: "bedrooms",
  },
  {
    src: "/images/bedrooms/bedroom-twin.jpg",
    alt: "Bedroom with two beds, air conditioning, and patterned curtains",
    category: "bedrooms",
  },
  {
    src: "/images/bedrooms/bedroom-white-wide.jpg",
    alt: "Bright bedroom with white bedding and air conditioning",
    category: "bedrooms",
  },
  {
    src: "/images/bedrooms/bedroom-white-angle.jpg",
    alt: "Bedroom with king-size bed and orange accent curtains",
    category: "bedrooms",
  },
  {
    src: "/images/bedrooms/bedroom-white-close.jpg",
    alt: "Close-up of comfortable king bed with decorative throw",
    category: "bedrooms",
  },

  // Bathrooms
  {
    src: "/images/bathrooms/bathroom-full.jpg",
    alt: "Modern bathroom with dark vanity, oval mirror, and towel storage",
    category: "bathrooms",
    featured: true,
  },
  {
    src: "/images/bathrooms/bathroom-vanity.jpg",
    alt: "Bathroom vanity with gold and white towels neatly arranged",
    category: "bathrooms",
  },
  {
    src: "/images/bathrooms/bathroom-toilet.jpg",
    alt: "Clean bathroom with wood-look tile walls and modern fixtures",
    category: "bathrooms",
  },
];

export const featuredImages = images.filter((img) => img.featured);
