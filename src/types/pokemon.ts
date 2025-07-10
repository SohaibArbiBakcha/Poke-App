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
  paradox: boolean;
  form: 'alolan' | 'galarian' | 'mega' | 'normal';
  altForms?: ('alolan' | 'galarian' | 'mega')[];
}

// Evolution types --------------------------------------------------------------------------------------------------
export interface EvolutionRequirement {
  trigger: string;          // e.g. "level-up", "use-item", "trade" ...
  minLevel?: number;        // level needed if any
  item?: string;            // item name if applicable (stone, etc.)
  heldItem?: string;        // held item required when trading
  timeOfDay?: string;       // day / night
  gender?: number;          // 1 = female, 2 = male
  detailsText: string;      // pre-formatted human-readable requirements string
}

export interface EvolutionNode {
  speciesName: string;      // e.g. "charmander"
  spriteUrl: string;        // convenient sprite url for UI
  requirements?: EvolutionRequirement; // undefined for the root/base form
  evolvesTo: EvolutionNode[];           // list of next evolutions (can branch)
}

// ------------------------------------------------------------------------------------------------------------------

export interface PokemonFilters {
  name: string;
  types: string[];
  generation: number | null;
  legendary: boolean | null; // true = only legendary, false = only non-legendary, null = ignore
  mythical: boolean | null;  // same logic
  paradox: boolean | null; // true = only paradox, false = only non-paradox, null = ignore
  forms: ('alolan' | 'galarian' | 'mega' | 'normal')[]; // empty = any
}