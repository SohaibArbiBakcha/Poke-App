// Type colors for UI
export const typeColors: { [key: string]: string } = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC'
};

// Type abbreviations for compact display
export const typeAbbreviations: { [key: string]: string } = {
  normal: 'NOR',
  fire: 'FIR',
  water: 'WAT',
  electric: 'ELE',
  grass: 'GRA',
  ice: 'ICE',
  fighting: 'FIG',
  poison: 'POI',
  ground: 'GRO',
  flying: 'FLY',
  psychic: 'PSY',
  bug: 'BUG',
  rock: 'ROC',
  ghost: 'GHO',
  dragon: 'DRA',
  dark: 'DAR',
  steel: 'STE',
  fairy: 'FAI'
};

// Defensive type effectiveness (what types deal x damage to this type)
export const defensiveEffectiveness: { [key: string]: { weak: string[], resist: string[], immune: string[] } } = {
  normal: {
    weak: ['fighting'],
    resist: [],
    immune: ['ghost']
  },
  fire: {
    weak: ['water', 'ground', 'rock'],
    resist: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
    immune: []
  },
  water: {
    weak: ['electric', 'grass'],
    resist: ['fire', 'water', 'ice', 'steel'],
    immune: []
  },
  electric: {
    weak: ['ground'],
    resist: ['electric', 'flying', 'steel'],
    immune: []
  },
  grass: {
    weak: ['fire', 'ice', 'poison', 'flying', 'bug'],
    resist: ['water', 'electric', 'grass', 'ground'],
    immune: []
  },
  ice: {
    weak: ['fire', 'fighting', 'rock', 'steel'],
    resist: ['ice'],
    immune: []
  },
  fighting: {
    weak: ['flying', 'psychic', 'fairy'],
    resist: ['bug', 'rock', 'dark'],
    immune: []
  },
  poison: {
    weak: ['ground', 'psychic'],
    resist: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
    immune: []
  },
  ground: {
    weak: ['water', 'grass', 'ice'],
    resist: ['poison', 'rock'],
    immune: ['electric']
  },
  flying: {
    weak: ['electric', 'ice', 'rock'],
    resist: ['grass', 'fighting', 'bug'],
    immune: ['ground']
  },
  psychic: {
    weak: ['bug', 'ghost', 'dark'],
    resist: ['fighting', 'psychic'],
    immune: []
  },
  bug: {
    weak: ['fire', 'flying', 'rock'],
    resist: ['grass', 'fighting', 'ground'],
    immune: []
  },
  rock: {
    weak: ['water', 'grass', 'fighting', 'ground', 'steel'],
    resist: ['normal', 'fire', 'poison', 'flying'],
    immune: []
  },
  ghost: {
    weak: ['ghost', 'dark'],
    resist: ['poison', 'bug'],
    immune: ['normal', 'fighting']
  },
  dragon: {
    weak: ['ice', 'dragon', 'fairy'],
    resist: ['fire', 'water', 'electric', 'grass'],
    immune: []
  },
  dark: {
    weak: ['fighting', 'bug', 'fairy'],
    resist: ['ghost', 'dark'],
    immune: ['psychic']
  },
  steel: {
    weak: ['fire', 'fighting', 'ground'],
    resist: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'],
    immune: ['poison']
  },
  fairy: {
    weak: ['poison', 'steel'],
    resist: ['fighting', 'bug', 'dark'],
    immune: ['dragon']
  }
};

// Calculate combined defensive effectiveness for dual-type Pokemon
export const calculateCombinedDefenses = (types: string[]): {
  weak4x: string[],
  weak2x: string[],
  resist2x: string[],
  resist4x: string[],
  immune: string[]
} => {
  const effectivenessMap: { [key: string]: number } = {};

  // Start with all types at 1x effectiveness
  Object.keys(typeColors).forEach(attackingType => {
    effectivenessMap[attackingType] = 1;
  });

  // Apply each defensive type's modifiers
  types.forEach(defendingType => {
    const defenses = defensiveEffectiveness[defendingType];
    if (!defenses) return;

    defenses.weak.forEach(type => {
      effectivenessMap[type] = (effectivenessMap[type] || 1) * 2;
    });

    defenses.resist.forEach(type => {
      effectivenessMap[type] = (effectivenessMap[type] || 1) * 0.5;
    });

    defenses.immune.forEach(type => {
      effectivenessMap[type] = 0;
    });
  });

  // Categorize the results
  const weak4x: string[] = [];
  const weak2x: string[] = [];
  const resist2x: string[] = [];
  const resist4x: string[] = [];
  const immune: string[] = [];

  Object.entries(effectivenessMap).forEach(([type, effectiveness]) => {
    if (effectiveness === 0) {
      immune.push(type);
    } else if (effectiveness === 4) {
      weak4x.push(type);
    } else if (effectiveness === 2) {
      weak2x.push(type);
    } else if (effectiveness === 0.5) {
      resist2x.push(type);
    } else if (effectiveness === 0.25) {
      resist4x.push(type);
    }
  });

  return { weak4x, weak2x, resist2x, resist4x, immune };
};
