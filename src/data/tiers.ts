export interface BookingTier {
  id: string;
  name: string;
  price: number;
  description: string;
  shortDescription: string;
  features: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  popular?: boolean;
}

export const tiers: BookingTier[] = [
  {
    id: "private-suite",
    name: "Private Suite",
    price: 200,
    description:
      "Enjoy your own private retreat with a spacious air-conditioned bedroom, cozy living room, fully equipped kitchen, and en-suite bathroom. Perfect for couples or solo travelers seeking comfort and privacy.",
    shortDescription:
      "Private 1-bedroom suite with living room, kitchen, and en-suite bathroom",
    features: [
      "1 air-conditioned bedroom",
      "Private living room",
      "Full kitchen access",
      "En-suite bathroom",
      "Free Wi-Fi",
      "TV with streaming",
      "Free parking",
    ],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    image: "/images/bedrooms/bedroom-master-wide.jpg",
  },
  {
    id: "full-house",
    name: "Full House",
    price: 300,
    description:
      "Have the entire Dream Residence all to yourself. Three air-conditioned bedrooms, a fully equipped modern kitchen, two bathrooms, spacious living room, and outdoor patio dining. Ideal for families or groups wanting the full Caribbean experience.",
    shortDescription:
      "Entire property with 3 bedrooms, full kitchen, and 2 bathrooms",
    features: [
      "3 air-conditioned bedrooms",
      "Full modern kitchen",
      "2 bathrooms",
      "Spacious living room with TV",
      "Outdoor patio dining",
      "Free Wi-Fi",
      "Free parking",
      "Entire property to yourself",
    ],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    image: "/images/exterior/exterior-front-full.jpg",
    popular: true,
  },
  {
    id: "shared-space",
    name: "Shared Space",
    price: 150,
    description:
      "An affordable way to experience The Dream Residence. You get your own private bedroom with a secure lock, while sharing the kitchen and living room with other guests. Great for budget-conscious travelers and solo adventurers.",
    shortDescription:
      "Private lockable bedroom with shared kitchen and living room",
    features: [
      "Private bedroom with lock",
      "Shared kitchen access",
      "Shared living room",
      "Free Wi-Fi",
      "Free parking",
      "Meet other travelers",
    ],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    image: "/images/bedrooms/bedroom-white-wide.jpg",
  },
];

export const getTierById = (id: string) => tiers.find((t) => t.id === id);
