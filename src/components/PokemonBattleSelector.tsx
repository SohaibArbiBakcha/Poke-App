import React, { useState } from 'react';
import { Search, Plus, X, Loader2 } from 'lucide-react';
import { Pokemon } from '../types/pokemon';
import { BattlePokemon } from '../types/battle';
import { Move } from '../types/pokemon';
import { useLanguage } from '../contexts/LanguageContext';
import { getMegaEvolutions, canMegaEvolve } from '../utils/megaEvolution';

interface PokemonBattleSelectorProps {
  allPokemon: Pokemon[];
  selectedPokemon: BattlePokemon[];
  onPokemonSelect: (pokemon: BattlePokemon) => void;
  onPokemonRemove: (index: number) => void;
  maxPokemon: number;
  teamName: string;
}

const typeColors: Record<string, string> = {
  normal: 'from-gray-400 to-gray-300',
  fire: 'from-red-500 to-orange-400',
  water: 'from-blue-500 to-blue-400',
  electric: 'from-yellow-400 to-yellow-300',
  grass: 'from-green-500 to-green-400',
  ice: 'from-blue-200 to-blue-100',
  fighting: 'from-red-700 to-red-600',
  poison: 'from-purple-500 to-purple-400',
  ground: 'from-yellow-600 to-yellow-500',
  flying: 'from-indigo-400 to-indigo-300',
  psychic: 'from-pink-500 to-pink-400',
  bug: 'from-lime-500 to-lime-400',
  rock: 'from-yellow-800 to-yellow-700',
  ghost: 'from-purple-700 to-purple-600',
  dragon: 'from-indigo-700 to-indigo-600',
  dark: 'from-gray-800 to-gray-700',
  steel: 'from-gray-500 to-gray-400',
  fairy: 'from-pink-300 to-pink-200',
};

export const PokemonBattleSelector: React.FC<PokemonBattleSelectorProps> = ({
  allPokemon,
  selectedPokemon,
  onPokemonSelect,
  onPokemonRemove,
  maxPokemon,
  teamName
}) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const [selectedForConfig, setSelectedForConfig] = useState<Pokemon | null>(null);
  const [level, setLevel] = useState(50);
  const [ivs, setIvs] = useState({
    hp: 31,
    attack: 31,
    defense: 31,
    specialAttack: 31,
    specialDefense: 31,
    speed: 31
  });
  const [availableMoves, setAvailableMoves] = useState<Move[]>([]);
  const [selectedMoves, setSelectedMoves] = useState<Move[]>([]);
  const [loadingMoves, setLoadingMoves] = useState(false);
  const [showMoveSelection, setShowMoveSelection] = useState(false);
  const [moveSearchQuery, setMoveSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<string>('');

  const filteredPokemon = allPokemon.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.translatedNames.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.translatedNames.fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.translatedNames.ar.includes(searchQuery)
  );

  // Filter moves based on search query
  const filteredAvailableMoves = availableMoves.filter(move =>
    move.name.toLowerCase().replace(/-/g, ' ').includes(moveSearchQuery.toLowerCase()) ||
    move.type.toLowerCase().includes(moveSearchQuery.toLowerCase()) ||
    move.damageClass.toLowerCase().includes(moveSearchQuery.toLowerCase())
  );

  const handlePokemonClick = async (pokemon: Pokemon) => {
    setSelectedForConfig(pokemon);
    setLoadingMoves(true);
    setAvailableMoves([]);
    setSelectedMoves([]);

    // Fetch all available moves for this Pokemon
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
      const data = await response.json();

      const movePromises = data.moves.map(async (moveEntry: any) => {
        try {
          const moveRes = await fetch(moveEntry.move.url);
          const moveData = await moveRes.json();
          const effectEntry = moveData.effect_entries.find((e: any) => e.language.name === 'en');

          const versionDetails = moveEntry.version_group_details[0];
          const learnMethod = versionDetails.move_learn_method.name;
          const levelLearnedAt = versionDetails.level_learned_at;

          return {
            name: moveData.name,
            type: moveData.type.name,
            power: moveData.power,
            accuracy: moveData.accuracy,
            pp: moveData.pp,
            damageClass: moveData.damage_class.name,
            effect: effectEntry?.short_effect || effectEntry?.effect || 'No description available',
            learnMethod,
            levelLearnedAt: levelLearnedAt > 0 ? levelLearnedAt : undefined
          } as Move;
        } catch (err) {
          console.error('Error fetching move', err);
          return null;
        }
      });

      const allMoves = (await Promise.all(movePromises)).filter((m): m is Move => m !== null);
      setAvailableMoves(allMoves);
      setLoadingMoves(false);
    } catch (err) {
      console.error('Error fetching moves:', err);
      setLoadingMoves(false);
    }
  };

  const handleMoveToggle = (move: Move) => {
    if (selectedMoves.find(m => m.name === move.name)) {
      setSelectedMoves(selectedMoves.filter(m => m.name !== move.name));
    } else if (selectedMoves.length < 4) {
      setSelectedMoves([...selectedMoves, move]);
    }
  };

  const proceedToMoveSelection = () => {
    setShowMoveSelection(true);
  };

  const confirmSelection = () => {
    if (!selectedForConfig || selectedMoves.length === 0) return;

    const battlePokemon: BattlePokemon = {
      id: selectedForConfig.id,
      name: selectedForConfig.name,
      translatedNames: selectedForConfig.translatedNames,
      level,
      types: selectedForConfig.types,
      imageUrl: selectedForConfig.imageUrl,
      baseStats: selectedForConfig.stats,
      ivs,
      currentHp: 0, // Will be calculated
      maxHp: 0, // Will be calculated
      moves: selectedMoves,
      status: null,
      heldItem: selectedItem || undefined,
      isMegaEvolved: false
    };

    onPokemonSelect(battlePokemon);
    setSelectedForConfig(null);
    setShowSelector(false);
    setShowMoveSelection(false);
    setLevel(50);
    setIvs({
      hp: 31,
      attack: 31,
      defense: 31,
      specialAttack: 31,
      specialDefense: 31,
      speed: 31
    });
    setSelectedMoves([]);
    setAvailableMoves([]);
    setSelectedItem('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">{teamName}</h3>

      {/* Selected Pokemon */}
      <div className="grid grid-cols-1 gap-3 mb-4">
        {selectedPokemon.map((pokemon, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-3">
              <img src={pokemon.imageUrl} alt={pokemon.name} className="w-16 h-16 object-contain" />
              <div>
                <p className="font-semibold capitalize">{pokemon.translatedNames[language]}</p>
                <p className="text-sm text-gray-600">Lv. {pokemon.level}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onPokemonRemove(index)}
              className="p-2 hover:bg-red-100 rounded-full transition-colors"
            >
              <X size={20} className="text-red-500" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Pokemon Button */}
      {selectedPokemon.length < maxPokemon && (
        <button
          type="button"
          onClick={() => setShowSelector(!showSelector)}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          {t('addPokemon') ?? 'Add Pokémon'}
        </button>
      )}

      {/* Pokemon Selector Modal */}
      {showSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold">{t('selectPokemon') ?? 'Select Pokémon'}</h3>
              <button
                type="button"
                onClick={() => {
                  setShowSelector(false);
                  setSelectedForConfig(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            {!selectedForConfig ? (
              <>
                {/* Search */}
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder={t('searchPlaceholder')}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Pokemon Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filteredPokemon.slice(0, 50).map((pokemon) => (
                      <button
                        type="button"
                        key={pokemon.id}
                        onClick={() => handlePokemonClick(pokemon)}
                        className="bg-gray-50 rounded-lg p-3 hover:bg-blue-50 hover:shadow-md transition-all border border-gray-200"
                      >
                        <img src={pokemon.imageUrl} alt={pokemon.name} className="w-full h-24 object-contain mb-2" />
                        <p className="text-sm font-semibold capitalize text-center">{pokemon.translatedNames[language]}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : !showMoveSelection ? (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={selectedForConfig.imageUrl} alt={selectedForConfig.name} className="w-32 h-32 object-contain" />
                    <div>
                      <h3 className="text-2xl font-bold capitalize">{selectedForConfig.translatedNames[language]}</h3>
                      <p className="text-gray-600">#{selectedForConfig.id}</p>
                    </div>
                  </div>

                  {/* Level Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">{t('level') ?? 'Level'}: {level}</label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={level}
                      onChange={(e) => setLevel(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>1</span>
                      <span>50</span>
                      <span>100</span>
                    </div>
                  </div>

                  {/* IV Sliders */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">{t('ivs') ?? 'Individual Values (IVs)'}</h4>
                    <div className="space-y-3">
                      {Object.entries(ivs).map(([stat, value]) => (
                        <div key={stat}>
                          <label className="block text-sm font-medium mb-1 capitalize">
                            {stat === 'specialAttack' ? 'Sp. Atk' : stat === 'specialDefense' ? 'Sp. Def' : stat}: {value}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="31"
                            value={value}
                            onChange={(e) => setIvs({ ...ivs, [stat]: Number(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIvs({ hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 })}
                      className="mt-3 text-sm text-blue-500 hover:underline"
                    >
                      {t('maxAllIVs') ?? 'Max All IVs (31)'}
                    </button>
                  </div>

                  {/* Held Item Selection */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Held Item (Optional)</h4>
                    <select
                      value={selectedItem}
                      onChange={(e) => setSelectedItem(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Select held item"
                    >
                      <option value="">No Item</option>
                      <optgroup label="Mega Stones">
                        {canMegaEvolve(selectedForConfig.id) && getMegaEvolutions(selectedForConfig.id).map((mega) => (
                          <option key={mega.megaStone} value={mega.megaStone}>
                            {mega.megaStone}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Battle Items">
                        <option value="Leftovers">Leftovers</option>
                        <option value="Life Orb">Life Orb</option>
                        <option value="Choice Band">Choice Band</option>
                        <option value="Choice Specs">Choice Specs</option>
                        <option value="Choice Scarf">Choice Scarf</option>
                        <option value="Focus Sash">Focus Sash</option>
                        <option value="Assault Vest">Assault Vest</option>
                      </optgroup>
                    </select>
                    {selectedItem && getMegaEvolutions(selectedForConfig.id).find(m => m.megaStone === selectedItem) && (
                      <p className="text-sm text-purple-600 mt-2 font-semibold">
                        ⚡ This Pokémon can Mega Evolve during battle!
                      </p>
                    )}
                  </div>

                  {/* Next Button */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedForConfig(null);
                        setShowMoveSelection(false);
                      }}
                      className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      {t('back') ?? 'Back'}
                    </button>
                    <button
                      type="button"
                      onClick={proceedToMoveSelection}
                      disabled={loadingMoves}
                      className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {loadingMoves ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin" size={20} />
                          {t('loading') ?? 'Loading...'}
                        </span>
                      ) : (
                        t('next') ?? 'Next: Select Moves'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={selectedForConfig.imageUrl} alt={selectedForConfig.name} className="w-24 h-24 object-contain" />
                    <div>
                      <h3 className="text-xl font-bold capitalize">{selectedForConfig.translatedNames[language]}</h3>
                      <p className="text-gray-600">Lv. {level} | {t('selectMoves') ?? 'Select 1-4 Moves'}</p>
                      <p className="text-sm text-blue-600 font-semibold">{selectedMoves.length}/4 moves selected</p>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder={t('searchMoves') ?? 'Search moves by name, type, or class...'}
                        className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={moveSearchQuery}
                        onChange={(e) => setMoveSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Available Moves Grid */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">{t('availableMoves') ?? 'Available Moves'} ({filteredAvailableMoves.length} {moveSearchQuery && `/ ${availableMoves.length}`})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto p-2 bg-gray-50 rounded-lg">
                      {filteredAvailableMoves.map((move, idx) => {
                        const isSelected = selectedMoves.find(m => m.name === move.name);
                        return (
                          <button
                            key={`${move.name}-${idx}`}
                            type="button"
                            onClick={() => handleMoveToggle(move)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                                : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-md'
                            } ${selectedMoves.length >= 4 && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={selectedMoves.length >= 4 && !isSelected}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h3 className="font-bold text-base capitalize">{move.name.replace(/-/g, ' ')}</h3>
                                {move.levelLearnedAt && (
                                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                                    Level {move.levelLearnedAt}
                                  </span>
                                )}
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize bg-gradient-to-r ${typeColors[move.type]} text-white shadow-md`}>
                                {move.type}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              {move.damageClass === 'physical' && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-semibold">
                                  Physical
                                </span>
                              )}
                              {move.damageClass === 'special' && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                                  Special
                                </span>
                              )}
                              {move.damageClass === 'status' && (
                                <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs font-semibold">
                                  Status
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
                              {move.power ? (
                                <div className="bg-gray-100 rounded px-2 py-1 text-center">
                                  <div className="text-gray-600 font-medium">Power</div>
                                  <div className="font-bold text-gray-800">{move.power}</div>
                                </div>
                              ) : <div></div>}
                              {move.accuracy ? (
                                <div className="bg-gray-100 rounded px-2 py-1 text-center">
                                  <div className="text-gray-600 font-medium">Acc</div>
                                  <div className="font-bold text-gray-800">{move.accuracy}%</div>
                                </div>
                              ) : <div></div>}
                              <div className="bg-gray-100 rounded px-2 py-1 text-center">
                                <div className="text-gray-600 font-medium">PP</div>
                                <div className="font-bold text-gray-800">{move.pp}</div>
                              </div>
                            </div>

                            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{move.effect}</p>

                            {isSelected && (
                              <div className="mt-2 text-xs font-bold text-blue-600 flex items-center gap-1">
                                ✓ Selected
                              </div>
                            )}
                          </button>
                        );
                      })}
                      {filteredAvailableMoves.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-8">
                          {moveSearchQuery ? `No moves found matching "${moveSearchQuery}"` : 'No moves available'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected Moves Summary */}
                  {selectedMoves.length > 0 && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <h4 className="font-semibold mb-3">{t('selectedMoves') ?? 'Selected Moves'}</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMoves.map((move, idx) => (
                          <div key={idx} className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium capitalize flex items-center gap-2">
                            {move.name.replace('-', ' ')}
                            <button
                              type="button"
                              onClick={() => handleMoveToggle(move)}
                              className="hover:bg-blue-600 rounded-full p-0.5"
                              title="Remove move"
                              aria-label="Remove move"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Confirm Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMoveSelection(false);
                        setSelectedMoves([]);
                      }}
                      className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      {t('back') ?? 'Back'}
                    </button>
                    <button
                      type="button"
                      onClick={confirmSelection}
                      disabled={selectedMoves.length === 0}
                      className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {t('confirm') ?? `Confirm (${selectedMoves.length} moves)`}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
