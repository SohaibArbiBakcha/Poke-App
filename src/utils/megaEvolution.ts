// Mega Evolution data
export interface MegaEvolutionData {
  pokemonId: number;
  pokemonName: string;
  megaStone: string;
  megaForm: string; // e.g., "mega", "mega-x", "mega-y"
  spriteUrl: string;
  typeChanges?: string[]; // New types if they change
  statChanges: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  abilityChange?: string;
}

export const megaEvolutions: MegaEvolutionData[] = [
  // Generation 1 Mega Evolutions
  {
    pokemonId: 3,
    pokemonName: 'venusaur',
    megaStone: 'Venusaurite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10033.png',
    statChanges: { hp: 0, attack: 20, defense: 23, specialAttack: 22, specialDefense: 15, speed: 0 }
  },
  {
    pokemonId: 6,
    pokemonName: 'charizard',
    megaStone: 'Charizardite X',
    megaForm: 'mega-x',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10034.png',
    typeChanges: ['fire', 'dragon'],
    statChanges: { hp: 0, attack: 64, defense: 47, specialAttack: -20, specialDefense: 14, speed: 0 }
  },
  {
    pokemonId: 6,
    pokemonName: 'charizard',
    megaStone: 'Charizardite Y',
    megaForm: 'mega-y',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10035.png',
    statChanges: { hp: 0, attack: -26, defense: 18, specialAttack: 78, specialDefense: 20, speed: 0 }
  },
  {
    pokemonId: 9,
    pokemonName: 'blastoise',
    megaStone: 'Blastoisinite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10036.png',
    statChanges: { hp: 0, attack: 16, defense: 51, specialAttack: 45, specialDefense: 25, speed: 0 }
  },
  {
    pokemonId: 15,
    pokemonName: 'beedrill',
    megaStone: 'Beedrillite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10090.png',
    statChanges: { hp: 0, attack: 60, defense: 20, specialAttack: -10, specialDefense: 0, speed: 40 }
  },
  {
    pokemonId: 18,
    pokemonName: 'pidgeot',
    megaStone: 'Pidgeotite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10073.png',
    statChanges: { hp: 0, attack: -20, defense: 0, specialAttack: 70, specialDefense: 0, speed: 30 }
  },
  {
    pokemonId: 65,
    pokemonName: 'alakazam',
    megaStone: 'Alakazite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10037.png',
    statChanges: { hp: 0, attack: 0, defense: 10, specialAttack: 40, specialDefense: 30, speed: 20 }
  },
  {
    pokemonId: 80,
    pokemonName: 'slowbro',
    megaStone: 'Slowbronite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10071.png',
    statChanges: { hp: 0, attack: 5, defense: 120, specialAttack: 15, specialDefense: -20, speed: -30 }
  },
  {
    pokemonId: 94,
    pokemonName: 'gengar',
    megaStone: 'Gengarite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10038.png',
    statChanges: { hp: 0, attack: 0, defense: 20, specialAttack: 50, specialDefense: 30, speed: 0 }
  },
  {
    pokemonId: 115,
    pokemonName: 'kangaskhan',
    megaStone: 'Kangaskhanite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10039.png',
    statChanges: { hp: 0, attack: 30, defense: 20, specialAttack: 0, specialDefense: 20, speed: 30 }
  },
  {
    pokemonId: 127,
    pokemonName: 'pinsir',
    megaStone: 'Pinsirite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10040.png',
    typeChanges: ['bug', 'flying'],
    statChanges: { hp: 0, attack: 35, defense: 30, specialAttack: 0, specialDefense: 15, speed: 20 }
  },
  {
    pokemonId: 130,
    pokemonName: 'gyarados',
    megaStone: 'Gyaradosite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10041.png',
    typeChanges: ['water', 'dark'],
    statChanges: { hp: 0, attack: 35, defense: 30, specialAttack: -10, specialDefense: 30, speed: 15 }
  },
  {
    pokemonId: 142,
    pokemonName: 'aerodactyl',
    megaStone: 'Aerodactylite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10042.png',
    statChanges: { hp: 0, attack: 30, defense: 30, specialAttack: 0, specialDefense: 10, speed: 30 }
  },
  {
    pokemonId: 150,
    pokemonName: 'mewtwo',
    megaStone: 'Mewtwonite X',
    megaForm: 'mega-x',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10043.png',
    typeChanges: ['psychic', 'fighting'],
    statChanges: { hp: 0, attack: 84, defense: 40, specialAttack: 0, specialDefense: 0, speed: -24 }
  },
  {
    pokemonId: 150,
    pokemonName: 'mewtwo',
    megaStone: 'Mewtwonite Y',
    megaForm: 'mega-y',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10044.png',
    statChanges: { hp: 0, attack: -40, defense: -30, specialAttack: 74, specialDefense: 40, speed: 56 }
  },
  // Generation 3 Mega Evolutions
  {
    pokemonId: 254,
    pokemonName: 'sceptile',
    megaStone: 'Sceptilite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10065.png',
    typeChanges: ['grass', 'dragon'],
    statChanges: { hp: 0, attack: 25, defense: 15, specialAttack: 35, specialDefense: 5, speed: 20 }
  },
  {
    pokemonId: 257,
    pokemonName: 'blaziken',
    megaStone: 'Blazikenite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10066.png',
    statChanges: { hp: 0, attack: 40, defense: 0, specialAttack: 30, specialDefense: 0, speed: 30 }
  },
  {
    pokemonId: 260,
    pokemonName: 'swampert',
    megaStone: 'Swampertite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10064.png',
    statChanges: { hp: 0, attack: 60, defense: 20, specialAttack: 0, specialDefense: 0, speed: 20 }
  },
  {
    pokemonId: 282,
    pokemonName: 'gardevoir',
    megaStone: 'Gardevoirite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10068.png',
    statChanges: { hp: 0, attack: -15, defense: 15, specialAttack: 65, specialDefense: 35, speed: 0 }
  },
  {
    pokemonId: 302,
    pokemonName: 'sableye',
    megaStone: 'Sablenite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10045.png',
    statChanges: { hp: 0, attack: 20, defense: 75, specialAttack: 20, specialDefense: 35, speed: -50 }
  },
  {
    pokemonId: 303,
    pokemonName: 'mawile',
    megaStone: 'Mawilite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10046.png',
    typeChanges: ['steel', 'fairy'],
    statChanges: { hp: 0, attack: 65, defense: 55, specialAttack: -10, specialDefense: 30, speed: -10 }
  },
  {
    pokemonId: 306,
    pokemonName: 'aggron',
    megaStone: 'Aggronite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10047.png',
    typeChanges: ['steel'],
    statChanges: { hp: 0, attack: 20, defense: 80, specialAttack: 0, specialDefense: 20, speed: -30 }
  },
  {
    pokemonId: 308,
    pokemonName: 'medicham',
    megaStone: 'Medichamite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10069.png',
    statChanges: { hp: 0, attack: 40, defense: 15, specialAttack: 0, specialDefense: 15, speed: 30 }
  },
  {
    pokemonId: 310,
    pokemonName: 'manectric',
    megaStone: 'Manectite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10048.png',
    statChanges: { hp: 0, attack: -10, defense: 10, specialAttack: 60, specialDefense: 10, speed: 30 }
  },
  {
    pokemonId: 319,
    pokemonName: 'sharpedo',
    megaStone: 'Sharpedonite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10070.png',
    statChanges: { hp: 0, attack: 50, defense: 20, specialAttack: 30, specialDefense: 0, speed: 0 }
  },
  {
    pokemonId: 323,
    pokemonName: 'camerupt',
    megaStone: 'Cameruptite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10087.png',
    statChanges: { hp: 0, attack: 40, defense: 0, specialAttack: 60, specialDefense: 0, speed: -20 }
  },
  {
    pokemonId: 334,
    pokemonName: 'altaria',
    megaStone: 'Altarianite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10067.png',
    typeChanges: ['dragon', 'fairy'],
    statChanges: { hp: 0, attack: 30, defense: 30, specialAttack: 30, specialDefense: 0, speed: 10 }
  },
  {
    pokemonId: 354,
    pokemonName: 'banette',
    megaStone: 'Banettite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10049.png',
    statChanges: { hp: 0, attack: 55, defense: 35, specialAttack: 5, specialDefense: 15, speed: -10 }
  },
  {
    pokemonId: 359,
    pokemonName: 'absol',
    megaStone: 'Absolite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10050.png',
    statChanges: { hp: 0, attack: 40, defense: 0, specialAttack: 20, specialDefense: 0, speed: 40 }
  },
  {
    pokemonId: 362,
    pokemonName: 'glalie',
    megaStone: 'Glalitite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10074.png',
    statChanges: { hp: 0, attack: 40, defense: 20, specialAttack: 40, specialDefense: 0, speed: 0 }
  },
  {
    pokemonId: 373,
    pokemonName: 'salamence',
    megaStone: 'Salamencite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10089.png',
    statChanges: { hp: 0, attack: 25, defense: 50, specialAttack: 0, specialDefense: 0, speed: 25 }
  },
  {
    pokemonId: 376,
    pokemonName: 'metagross',
    megaStone: 'Metagrossite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10051.png',
    statChanges: { hp: 0, attack: 35, defense: 30, specialAttack: 5, specialDefense: 10, speed: 20 }
  },
  {
    pokemonId: 380,
    pokemonName: 'latias',
    megaStone: 'Latiasite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10062.png',
    statChanges: { hp: 0, attack: 0, defense: 20, specialAttack: 40, specialDefense: 40, speed: 0 }
  },
  {
    pokemonId: 381,
    pokemonName: 'latios',
    megaStone: 'Latiosite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10063.png',
    statChanges: { hp: 0, attack: 30, defense: 0, specialAttack: 50, specialDefense: 20, speed: 0 }
  },
  {
    pokemonId: 384,
    pokemonName: 'rayquaza',
    megaStone: 'Dragon Ascent (Move)',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10079.png',
    statChanges: { hp: 0, attack: 35, defense: 10, specialAttack: 35, specialDefense: 10, speed: 10 }
  },
  // Generation 4 Mega Evolutions
  {
    pokemonId: 445,
    pokemonName: 'garchomp',
    megaStone: 'Garchompite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10052.png',
    statChanges: { hp: 0, attack: 30, defense: 20, specialAttack: 20, specialDefense: 10, speed: -10 }
  },
  {
    pokemonId: 448,
    pokemonName: 'lucario',
    megaStone: 'Lucarionite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10053.png',
    statChanges: { hp: 0, attack: 35, defense: 18, specialAttack: 57, specialDefense: 0, speed: 10 }
  },
  {
    pokemonId: 460,
    pokemonName: 'abomasnow',
    megaStone: 'Abomasite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10054.png',
    statChanges: { hp: 0, attack: 22, defense: 30, specialAttack: 42, specialDefense: 6, speed: -30 }
  },
  // Generation 6 Mega Evolutions
  {
    pokemonId: 719,
    pokemonName: 'diancie',
    megaStone: 'Diancite',
    megaForm: 'mega',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10101.png',
    statChanges: { hp: 0, attack: 50, defense: -60, specialAttack: 50, specialDefense: -60, speed: 120 }
  }
];

// Get mega evolution data for a specific Pokémon
export const getMegaEvolutions = (pokemonId: number): MegaEvolutionData[] => {
  return megaEvolutions.filter(mega => mega.pokemonId === pokemonId);
};

// Check if a Pokémon can mega evolve
export const canMegaEvolve = (pokemonId: number): boolean => {
  return megaEvolutions.some(mega => mega.pokemonId === pokemonId);
};

// Get mega evolution by Pokémon ID and mega stone
export const getMegaEvolutionByStone = (pokemonId: number, megaStone: string): MegaEvolutionData | undefined => {
  return megaEvolutions.find(mega => mega.pokemonId === pokemonId && mega.megaStone === megaStone);
};

// List of all mega stones
export const allMegaStones = Array.from(new Set(megaEvolutions.map(mega => mega.megaStone)));

// Apply mega evolution to a Pokémon's battle stats
export const applyMegaEvolution = (pokemon: any, megaData: MegaEvolutionData) => {
  // Store original data
  const originalImageUrl = pokemon.imageUrl;
  const originalTypes = [...pokemon.types];
  const originalBaseStats = { ...pokemon.baseStats };

  // Apply stat changes
  const newBaseStats = {
    hp: pokemon.baseStats.hp + megaData.statChanges.hp,
    attack: pokemon.baseStats.attack + megaData.statChanges.attack,
    defense: pokemon.baseStats.defense + megaData.statChanges.defense,
    specialAttack: pokemon.baseStats.specialAttack + megaData.statChanges.specialAttack,
    specialDefense: pokemon.baseStats.specialDefense + megaData.statChanges.specialDefense,
    speed: pokemon.baseStats.speed + megaData.statChanges.speed,
  };

  return {
    ...pokemon,
    imageUrl: megaData.spriteUrl,
    types: megaData.typeChanges || pokemon.types,
    baseStats: newBaseStats,
    isMegaEvolved: true,
    megaForm: megaData.megaForm,
    originalImageUrl,
    originalTypes,
    originalBaseStats,
  };
};

// Revert mega evolution
export const revertMegaEvolution = (pokemon: any) => {
  if (!pokemon.isMegaEvolved || !pokemon.originalImageUrl) {
    return pokemon;
  }

  return {
    ...pokemon,
    imageUrl: pokemon.originalImageUrl,
    types: pokemon.originalTypes || pokemon.types,
    baseStats: pokemon.originalBaseStats || pokemon.baseStats,
    isMegaEvolved: false,
    megaForm: undefined,
    originalImageUrl: undefined,
    originalTypes: undefined,
    originalBaseStats: undefined,
  };
};
