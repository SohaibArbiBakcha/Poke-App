import { BattlePokemon } from '../types/battle';
import { Move } from '../types/pokemon';

// Type effectiveness chart
export const typeEffectiveness: { [key: string]: { [key: string]: number } } = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

// Calculate actual stats based on base stats, level, and IVs
export const calculateStat = (
  baseStat: number,
  level: number,
  iv: number,
  isHp: boolean = false
): number => {
  // Simplified stat calculation (Pokemon formula)
  // Formula: ((2 * Base + IV) * Level / 100) + modifier
  const base = ((2 * baseStat + iv) * level) / 100;
  if (isHp) {
    return Math.floor(base + level + 10);
  }
  return Math.floor(base + 5);
};

// Calculate damage
export const calculateDamage = (
  attacker: BattlePokemon,
  defender: BattlePokemon,
  move: Move
): { damage: number; effectiveness: number; critical: boolean } => {
  // If move has no power (status move), return 0
  if (!move.power) {
    return { damage: 0, effectiveness: 1, critical: false };
  }

  // Determine if physical or special
  const isPhysical = move.damageClass === 'physical';
  const attackStat = isPhysical ? attacker.baseStats.attack : attacker.baseStats.specialAttack;
  const defenseStat = isPhysical ? defender.baseStats.defense : defender.baseStats.specialDefense;

  // Critical hit (6.25% chance)
  const critical = Math.random() < 0.0625;
  const criticalMultiplier = critical ? 1.5 : 1;

  // STAB (Same Type Attack Bonus)
  const stab = attacker.types.includes(move.type) ? 1.5 : 1;

  // Type effectiveness
  let effectiveness = 1;
  defender.types.forEach(defenderType => {
    const typeChart = typeEffectiveness[move.type];
    if (typeChart && typeChart[defenderType] !== undefined) {
      effectiveness *= typeChart[defenderType];
    }
  });

  // Random factor (0.85 to 1.0)
  const random = 0.85 + Math.random() * 0.15;

  // Damage formula (simplified Pokemon damage calculation)
  const baseDamage = ((2 * attacker.level / 5 + 2) * move.power * (attackStat / defenseStat)) / 50 + 2;
  const damage = Math.floor(baseDamage * stab * effectiveness * criticalMultiplier * random);

  return { damage, effectiveness, critical };
};

// Get effectiveness text
export const getEffectivenessText = (effectiveness: number): string => {
  if (effectiveness === 0) return 'It has no effect...';
  if (effectiveness < 1) return "It's not very effective...";
  if (effectiveness > 1) return "It's super effective!";
  return '';
};

// Calculate speed (for turn order)
export const calculateSpeed = (pokemon: BattlePokemon): number => {
  let speed = pokemon.baseStats.speed;

  // Status effects
  if (pokemon.status === 'paralysis') {
    speed = Math.floor(speed * 0.5);
  }

  return speed;
};

// Apply status effect
export const applyStatusEffect = (pokemon: BattlePokemon): number => {
  let damage = 0;

  if (pokemon.status === 'burn') {
    damage = Math.floor(pokemon.maxHp / 16);
  } else if (pokemon.status === 'poison') {
    damage = Math.floor(pokemon.maxHp / 8);
  }

  return damage;
};

// Check if Pokemon can act (for sleep, freeze, paralysis)
export const canAct = (pokemon: BattlePokemon): boolean => {
  if (pokemon.status === 'sleep') {
    // 33% chance to wake up
    return Math.random() < 0.33;
  }
  if (pokemon.status === 'freeze') {
    // 20% chance to thaw
    return Math.random() < 0.2;
  }
  if (pokemon.status === 'paralysis') {
    // 25% chance to be fully paralyzed
    return Math.random() > 0.25;
  }
  return true;
};

// Initialize Pokemon stats based on level and IVs
export const initializePokemonStats = (
  pokemon: BattlePokemon
): BattlePokemon => {
  const maxHp = calculateStat(pokemon.baseStats.hp, pokemon.level, pokemon.ivs.hp, true);

  return {
    ...pokemon,
    maxHp,
    currentHp: maxHp,
    baseStats: {
      hp: calculateStat(pokemon.baseStats.hp, pokemon.level, pokemon.ivs.hp, true),
      attack: calculateStat(pokemon.baseStats.attack, pokemon.level, pokemon.ivs.attack),
      defense: calculateStat(pokemon.baseStats.defense, pokemon.level, pokemon.ivs.defense),
      specialAttack: calculateStat(pokemon.baseStats.specialAttack, pokemon.level, pokemon.ivs.specialAttack),
      specialDefense: calculateStat(pokemon.baseStats.specialDefense, pokemon.level, pokemon.ivs.specialDefense),
      speed: calculateStat(pokemon.baseStats.speed, pokemon.level, pokemon.ivs.speed)
    }
  };
};
