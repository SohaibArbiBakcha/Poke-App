import { Move } from './pokemon';

export interface BattlePokemon {
  id: number;
  name: string;
  translatedNames: {
    en: string;
    fr: string;
    ar: string;
  };
  level: number;
  types: string[];
  imageUrl: string;
  baseStats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  ivs: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  currentHp: number;
  maxHp: number;
  moves: Move[];
  heldItem?: string;
  status?: 'burn' | 'freeze' | 'paralysis' | 'poison' | 'sleep' | null;
}

export interface BattleTeam {
  pokemon: BattlePokemon[];
}

export interface BattleState {
  team1: BattleTeam;
  team2: BattleTeam;
  currentTurn: 1 | 2;
  battleLog: string[];
  winner: 1 | 2 | null;
  battleMode: '1v1' | '2v2';
  activeIndex1: number; // which pokemon is active for team 1
  activeIndex2: number; // which pokemon is active for team 2
}

export interface BattleAction {
  type: 'attack' | 'switch' | 'item';
  moveIndex?: number;
  switchTo?: number;
  item?: string;
}

export type TypeEffectiveness = {
  [key: string]: {
    [key: string]: number;
  };
};
