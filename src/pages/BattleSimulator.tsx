import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Swords, Heart, Zap, Search } from 'lucide-react';
import { Pokemon } from '../types/pokemon';
import { BattlePokemon, BattleState } from '../types/battle';
import { PokemonBattleSelector } from '../components/PokemonBattleSelector';
import { LanguageSelector } from '../components/LanguageSelector';
import { TypeDefenses } from '../components/TypeDefenses';
import { StatChangesDisplay } from '../components/StatChangeIndicator';
import { BattleStatsDisplay } from '../components/BattleStatsDisplay';
import { useLanguage } from '../contexts/LanguageContext';
import {
  calculateDamage,
  getEffectivenessText,
  calculateSpeed,
  canAct,
  applyStatusEffect,
  initializePokemonStats
} from '../utils/battleCalculations';
import { getMegaEvolutionByStone, applyMegaEvolution } from '../utils/megaEvolution';

export const BattleSimulator: React.FC = () => {
  const { t, language } = useLanguage();
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [battleMode, setBattleMode] = useState<'1v1' | '2v2'>('1v1');
  const [team1Pokemon, setTeam1Pokemon] = useState<BattlePokemon[]>([]);
  const [team2Pokemon, setTeam2Pokemon] = useState<BattlePokemon[]>([]);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [selectedMove1, setSelectedMove1] = useState<number | null>(null);
  const [selectedMove2, setSelectedMove2] = useState<number | null>(null);
  const [moveSearchTeam1, setMoveSearchTeam1] = useState('');
  const [moveSearchTeam2, setMoveSearchTeam2] = useState('');

  // Load Pokemon data
  useEffect(() => {
    const cachedStr = localStorage.getItem('pokemonData');
    if (cachedStr) {
      try {
        const cached: Pokemon[] = JSON.parse(cachedStr);
        setAllPokemon(cached);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const maxPokemon = battleMode === '1v1' ? 1 : 2;

  const handleAddPokemonTeam1 = (pokemon: BattlePokemon) => {
    // Pokemon already has moves selected from the selector
    const initialized = initializePokemonStats(pokemon);
    setTeam1Pokemon([...team1Pokemon, initialized]);
  };

  const handleAddPokemonTeam2 = (pokemon: BattlePokemon) => {
    // Pokemon already has moves selected from the selector
    const initialized = initializePokemonStats(pokemon);
    setTeam2Pokemon([...team2Pokemon, initialized]);
  };

  const handleRemovePokemonTeam1 = (index: number) => {
    setTeam1Pokemon(team1Pokemon.filter((_, i) => i !== index));
  };

  const handleRemovePokemonTeam2 = (index: number) => {
    setTeam2Pokemon(team2Pokemon.filter((_, i) => i !== index));
  };

  const startBattle = () => {
    if (team1Pokemon.length === 0 || team2Pokemon.length === 0) {
      return;
    }

    const initialState: BattleState = {
      team1: { pokemon: team1Pokemon },
      team2: { pokemon: team2Pokemon },
      currentTurn: 1,
      battleLog: ['Battle started!'],
      winner: null,
      battleMode,
      activeIndex1: 0,
      activeIndex2: 0
    };

    setBattleState(initialState);
    setBattleLog(['Battle started!']);
  };

  const executeTurn = () => {
    if (!battleState || battleState.winner) return;
    if (selectedMove1 === null || selectedMove2 === null) return;

    const newState = { ...battleState };
    const newLog = [...battleLog];

    const active1 = newState.team1.pokemon[newState.activeIndex1];
    const active2 = newState.team2.pokemon[newState.activeIndex2];

    // Determine turn order based on speed
    const speed1 = calculateSpeed(active1);
    const speed2 = calculateSpeed(active2);

    const firstAttacker = speed1 >= speed2 ? active1 : active2;
    const secondAttacker = speed1 >= speed2 ? active2 : active1;
    const firstMove = speed1 >= speed2 ? selectedMove1 : selectedMove2;
    const secondMove = speed1 >= speed2 ? selectedMove2 : selectedMove1;
    const firstIsTeam1 = speed1 >= speed2;

    // First attacker's turn
    if (canAct(firstAttacker)) {
      const move = firstAttacker.moves[firstMove];
      if (move) {
        const { damage, effectiveness, critical } = calculateDamage(firstAttacker, secondAttacker, move);

        newLog.push(`${firstAttacker.translatedNames[language]} used ${move.name.replace('-', ' ')}!`);

        if (damage > 0) {
          secondAttacker.currentHp = Math.max(0, secondAttacker.currentHp - damage);

          if (critical) newLog.push('Critical hit!');
          const effectText = getEffectivenessText(effectiveness);
          if (effectText) newLog.push(effectText);

          newLog.push(`${secondAttacker.translatedNames[language]} took ${damage} damage!`);
        }
      }
    } else {
      newLog.push(`${firstAttacker.translatedNames[language]} is unable to move!`);
    }

    // Check if second Pokemon fainted
    if (secondAttacker.currentHp <= 0) {
      newLog.push(`${secondAttacker.translatedNames[language]} fainted!`);
      newState.winner = firstIsTeam1 ? 1 : 2;
    } else {
      // Second attacker's turn
      if (canAct(secondAttacker)) {
        const move = secondAttacker.moves[secondMove];
        if (move) {
          const { damage, effectiveness, critical } = calculateDamage(secondAttacker, firstAttacker, move);

          newLog.push(`${secondAttacker.translatedNames[language]} used ${move.name.replace('-', ' ')}!`);

          if (damage > 0) {
            firstAttacker.currentHp = Math.max(0, firstAttacker.currentHp - damage);

            if (critical) newLog.push('Critical hit!');
            const effectText = getEffectivenessText(effectiveness);
            if (effectText) newLog.push(effectText);

            newLog.push(`${firstAttacker.translatedNames[language]} took ${damage} damage!`);
          }
        }
      } else {
        newLog.push(`${secondAttacker.translatedNames[language]} is unable to move!`);
      }

      // Check if first Pokemon fainted
      if (firstAttacker.currentHp <= 0) {
        newLog.push(`${firstAttacker.translatedNames[language]} fainted!`);
        newState.winner = firstIsTeam1 ? 2 : 1;
      }
    }

    // Apply status effects
    const statusDamage1 = applyStatusEffect(active1);
    if (statusDamage1 > 0) {
      active1.currentHp = Math.max(0, active1.currentHp - statusDamage1);
      newLog.push(`${active1.translatedNames[language]} is hurt by ${active1.status}!`);
    }

    const statusDamage2 = applyStatusEffect(active2);
    if (statusDamage2 > 0) {
      active2.currentHp = Math.max(0, active2.currentHp - statusDamage2);
      newLog.push(`${active2.translatedNames[language]} is hurt by ${active2.status}!`);
    }

    setBattleState(newState);
    setBattleLog(newLog);
    setSelectedMove1(null);
    setSelectedMove2(null);
    setMoveSearchTeam1('');
    setMoveSearchTeam2('');
  };

  const resetBattle = () => {
    setBattleState(null);
    setBattleLog([]);
    setSelectedMove1(null);
    setSelectedMove2(null);
    setMoveSearchTeam1('');
    setMoveSearchTeam2('');
    setTeam1Pokemon([]);
    setTeam2Pokemon([]);
  };

  const handleMegaEvolution = (team: 1 | 2, pokemonIndex: number) => {
    if (!battleState) return;

    const newState = { ...battleState };
    const pokemon = team === 1
      ? newState.team1.pokemon[pokemonIndex]
      : newState.team2.pokemon[pokemonIndex];

    // Check if already mega evolved
    if (pokemon.isMegaEvolved) {
      alert('This Pokémon is already Mega Evolved!');
      return;
    }

    // Check if has mega stone
    if (!pokemon.heldItem) {
      alert('This Pokémon is not holding a Mega Stone!');
      return;
    }

    // Get mega evolution data
    const megaData = getMegaEvolutionByStone(pokemon.id, pokemon.heldItem);
    if (!megaData) {
      alert('This item cannot trigger Mega Evolution!');
      return;
    }

    // Apply mega evolution
    const megaEvolvedPokemon = applyMegaEvolution(pokemon, megaData);

    // Update the pokemon in the team
    if (team === 1) {
      newState.team1.pokemon[pokemonIndex] = megaEvolvedPokemon;
    } else {
      newState.team2.pokemon[pokemonIndex] = megaEvolvedPokemon;
    }

    const newLog = [...battleLog];
    newLog.push(`${pokemon.translatedNames[language]} Mega Evolved into Mega ${pokemon.translatedNames[language]}!`);

    setBattleState(newState);
    setBattleLog(newLog);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>{t('loading')}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FF1C1C]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="inline-flex items-center text-white hover:text-gray-200">
            <ArrowLeft className="mr-2" size={20} />
            {t('backToPokedex')}
          </Link>
          <LanguageSelector />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Swords size={32} />
            {t('battleSimulator') ?? 'Battle Simulator'}
          </h1>

          {!battleState ? (
            <>
              {/* Battle Mode Selector */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">{t('selectBattleMode') ?? 'Select Battle Mode'}</h3>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setBattleMode('1v1');
                      setTeam1Pokemon([]);
                      setTeam2Pokemon([]);
                    }}
                    className={`flex-1 py-4 rounded-lg font-semibold transition-all ${
                      battleMode === '1v1'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    1 vs 1
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBattleMode('2v2');
                      setTeam1Pokemon([]);
                      setTeam2Pokemon([]);
                    }}
                    className={`flex-1 py-4 rounded-lg font-semibold transition-all ${
                      battleMode === '2v2'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    2 vs 2
                  </button>
                </div>
              </div>

              {/* Team Selection */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <PokemonBattleSelector
                  allPokemon={allPokemon}
                  selectedPokemon={team1Pokemon}
                  onPokemonSelect={handleAddPokemonTeam1}
                  onPokemonRemove={handleRemovePokemonTeam1}
                  maxPokemon={maxPokemon}
                  teamName={t('team1') ?? 'Team 1'}
                />
                <PokemonBattleSelector
                  allPokemon={allPokemon}
                  selectedPokemon={team2Pokemon}
                  onPokemonSelect={handleAddPokemonTeam2}
                  onPokemonRemove={handleRemovePokemonTeam2}
                  maxPokemon={maxPokemon}
                  teamName={t('team2') ?? 'Team 2'}
                />
              </div>

              {/* Start Battle Button */}
              <button
                type="button"
                onClick={startBattle}
                disabled={team1Pokemon.length === 0 || team2Pokemon.length === 0}
                className="w-full py-4 bg-green-500 text-white rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Swords size={24} />
                {t('startBattle') ?? 'Start Battle!'}
              </button>
            </>
          ) : (
            <div className="space-y-6">
              {/* Battle Arena */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Team 1 Pokemon */}
                <div className="bg-blue-50 rounded-lg p-6 border-4 border-blue-300">
                  <h3 className="text-xl font-bold mb-4 text-blue-700">{t('team1') ?? 'Team 1'}</h3>
                  {battleState.team1.pokemon.map((pokemon, idx) => (
                    <div key={idx} className={`mb-4 ${idx === battleState.activeIndex1 ? 'ring-4 ring-blue-500 rounded-lg p-2' : ''}`}>
                      <div className="flex items-center gap-4 mb-2">
                        <img src={pokemon.imageUrl} alt={pokemon.name} className="w-24 h-24 object-contain" />
                        <div className="flex-1">
                          <p className="font-bold text-lg">
                            {pokemon.isMegaEvolved && '⚡ Mega '}
                            {pokemon.translatedNames[language]}
                          </p>
                          <p className="text-sm text-gray-600">Lv. {pokemon.level}</p>
                          {pokemon.heldItem && !pokemon.isMegaEvolved && (
                            <p className="text-xs text-purple-600 font-semibold">📦 {pokemon.heldItem}</p>
                          )}
                          {pokemon.status && (
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded capitalize">{pokemon.status}</span>
                          )}
                          {/* Mega Evolution Button */}
                          {pokemon.heldItem && !pokemon.isMegaEvolved && getMegaEvolutionByStone(pokemon.id, pokemon.heldItem) && idx === battleState.activeIndex1 && (
                            <button
                              type="button"
                              onClick={() => handleMegaEvolution(1, idx)}
                              className="mt-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                            >
                              ⚡ MEGA EVOLVE
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="relative mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-semibold">HP</span>
                          <span>{pokemon.currentHp} / {pokemon.maxHp}</span>
                        </div>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              pokemon.currentHp / pokemon.maxHp > 0.5
                                ? 'bg-green-500'
                                : pokemon.currentHp / pokemon.maxHp > 0.2
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${(pokemon.currentHp / pokemon.maxHp) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Battle Stats */}
                      <div className="mb-3">
                        <BattleStatsDisplay stats={pokemon.baseStats} compact={true} />
                      </div>

                      {/* Type Defenses */}
                      {idx === battleState.activeIndex1 && (
                        <TypeDefenses types={pokemon.types} />
                      )}

                      {/* Stat Changes Display (if Mega Evolved) */}
                      {pokemon.isMegaEvolved && pokemon.originalBaseStats && (
                        <StatChangesDisplay
                          originalStats={pokemon.originalBaseStats}
                          newStats={pokemon.baseStats}
                          originalTypes={pokemon.originalTypes}
                          newTypes={pokemon.types}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Team 2 Pokemon */}
                <div className="bg-red-50 rounded-lg p-6 border-4 border-red-300">
                  <h3 className="text-xl font-bold mb-4 text-red-700">{t('team2') ?? 'Team 2'}</h3>
                  {battleState.team2.pokemon.map((pokemon, idx) => (
                    <div key={idx} className={`mb-4 ${idx === battleState.activeIndex2 ? 'ring-4 ring-red-500 rounded-lg p-2' : ''}`}>
                      <div className="flex items-center gap-4 mb-2">
                        <img src={pokemon.imageUrl} alt={pokemon.name} className="w-24 h-24 object-contain" />
                        <div className="flex-1">
                          <p className="font-bold text-lg">
                            {pokemon.isMegaEvolved && '⚡ Mega '}
                            {pokemon.translatedNames[language]}
                          </p>
                          <p className="text-sm text-gray-600">Lv. {pokemon.level}</p>
                          {pokemon.heldItem && !pokemon.isMegaEvolved && (
                            <p className="text-xs text-purple-600 font-semibold">📦 {pokemon.heldItem}</p>
                          )}
                          {pokemon.status && (
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded capitalize">{pokemon.status}</span>
                          )}
                          {/* Mega Evolution Button */}
                          {pokemon.heldItem && !pokemon.isMegaEvolved && getMegaEvolutionByStone(pokemon.id, pokemon.heldItem) && idx === battleState.activeIndex2 && (
                            <button
                              type="button"
                              onClick={() => handleMegaEvolution(2, idx)}
                              className="mt-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                            >
                              ⚡ MEGA EVOLVE
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="relative mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-semibold">HP</span>
                          <span>{pokemon.currentHp} / {pokemon.maxHp}</span>
                        </div>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              pokemon.currentHp / pokemon.maxHp > 0.5
                                ? 'bg-green-500'
                                : pokemon.currentHp / pokemon.maxHp > 0.2
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${(pokemon.currentHp / pokemon.maxHp) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Battle Stats */}
                      <div className="mb-3">
                        <BattleStatsDisplay stats={pokemon.baseStats} compact={true} />
                      </div>

                      {/* Type Defenses */}
                      {idx === battleState.activeIndex2 && (
                        <TypeDefenses types={pokemon.types} />
                      )}

                      {/* Stat Changes Display (if Mega Evolved) */}
                      {pokemon.isMegaEvolved && pokemon.originalBaseStats && (
                        <StatChangesDisplay
                          originalStats={pokemon.originalBaseStats}
                          newStats={pokemon.baseStats}
                          originalTypes={pokemon.originalTypes}
                          newTypes={pokemon.types}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Battle Controls */}
              {!battleState.winner && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Team 1 Moves */}
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                    <h4 className="font-semibold mb-3">{t('selectMove') ?? 'Select Move'} - {t('team1')}</h4>

                    {/* Search Input */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder={t('searchMoves') ?? 'Search moves...'}
                        value={moveSearchTeam1}
                        onChange={(e) => setMoveSearchTeam1(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {battleState.team1.pokemon[battleState.activeIndex1].moves
                        .map((move, idx) => ({ move, originalIdx: idx }))
                        .filter(({ move }) =>
                          move.name.toLowerCase().replace(/-/g, ' ').includes(moveSearchTeam1.toLowerCase()) ||
                          move.type.toLowerCase().includes(moveSearchTeam1.toLowerCase())
                        )
                        .map(({ move, originalIdx }) => (
                          <button
                            key={originalIdx}
                            type="button"
                            onClick={() => setSelectedMove1(originalIdx)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              selectedMove1 === originalIdx
                                ? 'border-blue-500 bg-blue-100'
                                : 'border-gray-300 hover:border-blue-300'
                            }`}
                          >
                            <p className="font-semibold text-sm capitalize">{move.name.replace(/-/g, ' ')}</p>
                            <p className="text-xs text-gray-600 capitalize">{move.type}</p>
                            {move.power && <p className="text-xs">Power: {move.power}</p>}
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Team 2 Moves */}
                  <div className="bg-white rounded-lg p-4 border-2 border-red-300">
                    <h4 className="font-semibold mb-3">{t('selectMove') ?? 'Select Move'} - {t('team2')}</h4>

                    {/* Search Input */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder={t('searchMoves') ?? 'Search moves...'}
                        value={moveSearchTeam2}
                        onChange={(e) => setMoveSearchTeam2(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {battleState.team2.pokemon[battleState.activeIndex2].moves
                        .map((move, idx) => ({ move, originalIdx: idx }))
                        .filter(({ move }) =>
                          move.name.toLowerCase().replace(/-/g, ' ').includes(moveSearchTeam2.toLowerCase()) ||
                          move.type.toLowerCase().includes(moveSearchTeam2.toLowerCase())
                        )
                        .map(({ move, originalIdx }) => (
                          <button
                            key={originalIdx}
                            type="button"
                            onClick={() => setSelectedMove2(originalIdx)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              selectedMove2 === originalIdx
                                ? 'border-red-500 bg-red-100'
                                : 'border-gray-300 hover:border-red-300'
                            }`}
                          >
                            <p className="font-semibold text-sm capitalize">{move.name.replace(/-/g, ' ')}</p>
                            <p className="text-xs text-gray-600 capitalize">{move.type}</p>
                            {move.power && <p className="text-xs">Power: {move.power}</p>}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Execute Turn / Winner */}
              <div className="flex gap-4">
                {!battleState.winner ? (
                  <button
                    type="button"
                    onClick={executeTurn}
                    disabled={selectedMove1 === null || selectedMove2 === null}
                    className="flex-1 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Zap size={20} />
                    {t('executeTurn') ?? 'Execute Turn'}
                  </button>
                ) : (
                  <div className="flex-1 bg-yellow-100 border-4 border-yellow-400 rounded-lg p-6 text-center">
                    <h2 className="text-2xl font-bold text-yellow-800 mb-2">
                      🏆 {battleState.winner === 1 ? t('team1') : t('team2')} {t('wins') ?? 'Wins'}! 🏆
                    </h2>
                  </div>
                )}
                <button
                  type="button"
                  onClick={resetBattle}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  {t('newBattle') ?? 'New Battle'}
                </button>
              </div>

              {/* Battle Log */}
              <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
                <h4 className="font-bold text-white mb-2">{t('battleLog') ?? 'Battle Log'}:</h4>
                {battleLog.map((log, idx) => (
                  <div key={idx} className="mb-1">
                    &gt; {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
