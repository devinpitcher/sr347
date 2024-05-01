export const CAMERAS = [
  {
    name: "I-10 @ Queen Creek",
    id: "074",
  },
  {
    name: "Riggs Rd.",
    id: "2099",
  },
  {
    name: "Cement Plant",
    id: "2098",
  },
  {
    name: "Casa Blanca Rd.",
    id: "2097",
  },
  {
    name: "Cobblestone / Lakeview",
    id: "2096",
  },
  {
    name: "Smith Enke Rd.",
    id: "2095",
    note: "I suspect this camera may have been decommissioned or is now managed by the city. I am investigating if there will be a way to access it again.",
  },
  {
    name: "Edison Rd.",
    id: "2094",
    note: "I suspect this camera may have been decommissioned or is now managed by the city. I am investigating if there will be a way to access it again.",
  },
] satisfies {
  name: string;
  id: string;
  note?: string;
}[];
