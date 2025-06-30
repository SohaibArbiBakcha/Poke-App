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
  legendary: boolean;
  mythical: boolean;
  form: 'alolan' | 'galarian' | 'mega' | 'normal';
  altForms?: ('alolan' | 'galarian' | 'mega')[];
}

export interface PokemonFilters {
  name: string;
  types: string[];
  generation: number | null;
  legendary: boolean | null; // true = only legendary, false = only non-legendary, null = ignore
  mythical: boolean | null;  // same logic
  forms: ('alolan' | 'galarian' | 'mega' | 'normal')[]; // empty = any
}