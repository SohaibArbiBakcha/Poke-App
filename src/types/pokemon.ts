export interface Pokemon {
  id: number;
  name: string;
  translatedNames: {
    en: string;
    fr: string;
    ar: string;
  };
  types: string[];
  generation: number;
  imageUrl: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  height: number;
  weight: number;
  abilities: string[];
}

export interface PokemonFilters {
  name: string;
  types: string[];
  generation: number | null;
}