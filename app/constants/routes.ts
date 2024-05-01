const OUTBOUND_CITY_LIMIT: Point = [33.087033, -112.036442];
const INBOUND_CITY_LIMIT: Point = [33.087006, -112.0367];

export const ROUTES = [
  {
    key: "347",
    outbound: {
      description: "Maricopa to I-10",
      origin: OUTBOUND_CITY_LIMIT,
      destination: [33.255496, -111.948166],
    },
    inbound: {
      description: "I-10 to Maricopa",
      origin: [33.255604, -111.948299],
      destination: INBOUND_CITY_LIMIT,
    },
  },
  {
    key: "Tortosa",
    outbound: {
      description: "Tortosa to I-10",
      origin: [33.058148169311266, -111.9570060479114],
      destination: OUTBOUND_CITY_LIMIT,
    },
    inbound: {
      description: "I-10 to Tortosa",
      origin: INBOUND_CITY_LIMIT,
      destination: [33.05801754333691, -111.95697985357468],
    },
  },
] satisfies Route[];
