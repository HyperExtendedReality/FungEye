export interface MushroomSpecies {
  id: string;
  name: string;
  scientific: string;
  type: 'Edible' | 'Toxic' | 'Psychoactive' | 'Rare' | 'Deadly';
  description: string;
  details: string;
}

export const MUSHROOM_CATALOG: Record<string, MushroomSpecies> = {
  "common puffball": {
    id: "common_puffball",
    name: "Common Puffball",
    scientific: "Lycoperdon perlatum",
    type: "Edible",
    description: "A medium-sized puffball mushroom with a wide distribution.",
    details: "Must be pure white inside to be edible. Spiny texture on the skin."
  },
  "fly agaric": {
    id: "fly_agaric",
    name: "Fly Agaric",
    scientific: "Amanita muscaria",
    type: "Toxic",
    description: "The iconic red mushroom with white spots.",
    details: "Contains ibotenic acid. Highly recognizable but dangerous."
  },
  "death cap": {
    id: "death_cap",
    name: "Death Cap",
    scientific: "Amanita phalloides",
    type: "Toxic",
    description: "One of the most poisonous mushrooms in the world.",
    details: "Often mistaken for edible paddy straw mushrooms."
  }
};