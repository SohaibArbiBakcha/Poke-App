import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Pokemon } from '../types/pokemon';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { pokemonNameTranslations } from '../utils/pokemonTranslations';
import { EvolutionNode } from '../types/pokemon';
import { fetchEvolutionChain } from '../utils/evolution';
import { EvolutionChain } from '../components/EvolutionChain';

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

// Updated type icons with working URLs
const typeIcons: Record<string, string> = {
  normal: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/1.png",
  fire: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/10.png",
  water: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/11.png",
  electric: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/13.png",
  grass: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/12.png",
  ice: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/15.png",
  fighting: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/2.png",
  poison: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/4.png",
  ground: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/5.png",
  flying: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/3.png",
  psychic: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/14.png",
  bug: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/7.png",
  rock: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/6.png",
  ghost: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/8.png",
  dragon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/16.png",
  dark: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/17.png",
  steel: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/9.png",
  fairy: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/18.png"
};

export const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShiny, setIsShiny] = useState(false);
  const [currentForm, setCurrentForm] = useState<'normal' | 'alolan' | 'galarian' | 'mega'>('normal');
  type AbilityInfo = { name: string; effect: string };
  const [abilitiesInfo, setAbilitiesInfo] = useState<AbilityInfo[]>([]);
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);
  const [formSprites, setFormSprites] = useState<Partial<Record<'alolan' | 'galarian' | 'mega', { normal: string; shiny: string | null }>>>({});
  const [evoChain, setEvoChain] = useState<EvolutionNode | null>(null);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const details = await response.json();
        
        // Fetch species data for extra flags and evolution chain
        const speciesRes = await fetch(details.species.url);
        const species = await speciesRes.json();

        // Calculate generation based on Pokemon ID ranges
        let generation = 1;
        if (details.id >= 152 && details.id <= 251) generation = 2;
        else if (details.id >= 252 && details.id <= 386) generation = 3;
        else if (details.id >= 387 && details.id <= 493) generation = 4;
        else if (details.id >= 494 && details.id <= 649) generation = 5;
        else if (details.id >= 650 && details.id <= 721) generation = 6;
        else if (details.id >= 722 && details.id <= 809) generation = 7;
        else if (details.id >= 810 && details.id <= 905) generation = 8;
        else if (details.id >= 906) generation = 9;
        
        // Get translated names - fallback to English name if not available
        const translations = pokemonNameTranslations[details.id] || {
          en: details.name.charAt(0).toUpperCase() + details.name.slice(1),
          fr: details.name.charAt(0).toUpperCase() + details.name.slice(1),
          ar: details.name.charAt(0).toUpperCase() + details.name.slice(1)
        };
        
        // Use official artwork if available, otherwise use front default sprite
        const imageUrl = details.sprites.other['official-artwork']?.front_default || 
                        details.sprites.front_default || 
                        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${details.id}.png`;

        // Determine form (Alolan/Galarian/Normal) from name
        const lowerName = details.name.toLowerCase();
        let form: 'alolan' | 'galarian' | 'normal' = 'normal';
        if (lowerName.includes('alola')) form = 'alolan';
        else if (lowerName.includes('galar')) form = 'galarian';

        // Collect sprites for alternate regional forms
        const spritesMap: Record<'alolan' | 'galarian', { normal: string; shiny: string | null }> = {} as any;
        if (species.varieties?.length) {
          for (const variety of species.varieties) {
            const vName: string = variety.pokemon.name.toLowerCase();
            let key: 'alolan' | 'galarian' | undefined;
            if (vName.includes('alola')) key = 'alolan';
            else if (vName.includes('galar')) key = 'galarian';

            if (key) {
              try {
                const vResp = await fetch(variety.pokemon.url);
                const vDetails = await vResp.json();
                const normalArt = vDetails.sprites?.other?.['official-artwork']?.front_default || vDetails.sprites?.front_default;
                const shinyArt = vDetails.sprites?.other?.['official-artwork']?.front_shiny || vDetails.sprites?.front_shiny || null;
                if (normalArt) {
                  spritesMap[key] = { normal: normalArt, shiny: shinyArt };
                }
              } catch (err) {
                console.error('Variety fetch error', err);
              }
            }
          }
        }
        setFormSprites(spritesMap);
        setCurrentForm(form);
        
        setPokemon({
          id: details.id,
          name: details.name,
          translatedNames: translations,
          types: details.types.map((type: { type: { name: string } }) => type.type.name),
          generation,
          imageUrl,
          stats: {
            hp: details.stats[0].base_stat,
            attack: details.stats[1].base_stat,
            defense: details.stats[2].base_stat,
            specialAttack: details.stats[3].base_stat,
            specialDefense: details.stats[4].base_stat,
            speed: details.stats[5].base_stat,
          },
          height: details.height / 10,
          weight: details.weight / 10,
          legendary: species?.is_legendary ?? false,
          mythical: species?.is_mythical ?? false,
          form,
          abilities: details.abilities.map((ability: { ability: { name: string } }) => ability.ability.name),
        });

        // Fetch ability details
        try {
          const infos = await Promise.all(
            details.abilities.map(async (ab: { ability: { name: string; url: string } }) => {
              const resp = await fetch(ab.ability.url);
              const data = await resp.json();
              const enEntry = data.effect_entries.find((e: any) => e.language.name === 'en');
              return { name: ab.ability.name, effect: enEntry ? enEntry.effect : '' };
            })
          );
          setAbilitiesInfo(infos);
        } catch (err) {
          console.error('ability fetch error', err);
        }

        // Fetch mega form sprites from species varieties
        const megaVariety = species.varieties?.find((v: any) => v.pokemon.name.includes('mega'));
        if (megaVariety) {
          try {
            const megaRes = await fetch(megaVariety.pokemon.url);
            const megaDetails = await megaRes.json();
            const megaNormal = megaDetails.sprites.other['official-artwork']?.front_default ?? megaDetails.sprites.front_default;
            const megaShiny = megaDetails.sprites.other['official-artwork']?.front_shiny ?? megaDetails.sprites.front_shiny;
            setFormSprites((prev) => ({ ...prev, mega: { normal: megaNormal, shiny: megaShiny } }));
          } catch (err) {
            console.error('mega fetch error', err);
          }
        }

        // Fetch evolution chain
        try {
          const chainTyped = await fetchEvolutionChain(details.species.url);
          setEvoChain(chainTyped);
        } catch (err) {
          console.error('typed evo fetch error', err);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
        setLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <img src="https://i.gifer.com/2iiJ.gif" alt="Loading" className="w-16 h-16 object-contain" />
        <span className="ml-2">{t('loading')}</span>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('pokemonNotFound')}</h2>
          <Link to="/" className="text-blue-500 hover:underline">
            {t('backToPokedex')}
          </Link>
        </div>
      </div>
    );
  }

  const displayName = pokemon.translatedNames[language] || pokemon.name;
  // Choose correct artwork based on selected form and shiny toggle
  const displayImage = currentForm === 'normal'
    ? (isShiny
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemon.id}.png`
        : pokemon.imageUrl)
    : (() => {
        const sprite = formSprites[currentForm];
        if (!sprite) return pokemon.imageUrl;
        if (isShiny && sprite.shiny) return sprite.shiny;
        return sprite.normal;
      })();

  return (
    <div className="min-h-screen bg-[#FF1C1C] py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="inline-flex items-center text-white hover:text-gray-200">
            <ArrowLeft className="mr-2" size={20} />
            {t('backToPokedex')}
          </Link>
          <LanguageSelector />
        </div>
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Animated type backgrounds */}
          <div className="absolute inset-0 flex">
            {pokemon.types.map((type, index) => (
              <div
                key={type}
                className={`flex-1 bg-gradient-to-br ${typeColors[type]} opacity-10 animate-pulse`}
                style={{
                  animationDelay: `${index * 0.5}s`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>

          <div className="relative z-10 p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                {/* Shiny toggle */}
                <button
                  onClick={(e) => { e.preventDefault(); setIsShiny((prev) => !prev); }}
                  className="absolute top-2 left-2 bg-white rounded-full w-10 h-10 flex items-center justify-center text-yellow-500 hover:bg-yellow-200 shadow z-20"
                  title={isShiny ? 'Show normal' : 'Show shiny'}
                >
                  ✨
                </button>

                {/* Form buttons */}
                <div className="absolute left-2 top-14 flex flex-col gap-2 z-20">
                  {/* Alolan toggle */}
                  {formSprites.alolan && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentForm((prev) => (prev === 'alolan' ? 'normal' : 'alolan'));
                        setIsShiny(false);
                      }}
                      className={`bg-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-green-100 shadow ${currentForm === 'alolan' ? 'ring-2 ring-green-400' : ''}`}
                      title="Alolan form"
                    >
                      🌴
                    </button>
                  )}
                  {/* Galarian toggle */}
                  {formSprites.galarian && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentForm((prev) => (prev === 'galarian' ? 'normal' : 'galarian'));
                        setIsShiny(false);
                      }}
                      className={`bg-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-100 shadow ${currentForm === 'galarian' ? 'ring-2 ring-gray-400' : ''}`}
                      title="Galarian form"
                    >
                      🏴
                    </button>
                  )}
                  {/* Mega toggle */}
                  {formSprites.mega && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentForm((prev) => (prev === 'mega' ? 'normal' : 'mega'));
                        setIsShiny(false);
                      }}
                      className={`bg-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-red-100 shadow ${currentForm === 'mega' ? 'ring-2 ring-red-400' : ''}`}
                      title="Mega form"
                    >
                      🔥
                    </button>
                  )}
                </div>

                {/* Pokémon artwork */}
                <img
                  src={displayImage}
                  alt={displayName}
                  className="w-4/5 max-w-md h-auto object-contain"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                  }}
                />
              </div>
              <div className="md:col-span-1">
                <h1 className="text-4xl font-bold capitalize mb-4">{displayName}</h1>
                <div className="flex gap-3 flex-wrap">
                  {pokemon.types.map((type) => (
                    <img
                      key={type}
                      src={typeIcons[type]}
                      alt={type}
                      className="h-8 w-auto object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-600">{t('height')}</p>
                    <p className="text-xl font-semibold">{pokemon.height}m</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('weight')}</p>
                    <p className="text-xl font-semibold">{pokemon.weight}kg</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2 cursor-pointer" onClick={() => setSelectedAbility(null)}>
                    {t('abilities')}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {abilitiesInfo.map((ab) => (
                      <button
                        key={ab.name}
                        onClick={() => setSelectedAbility(selectedAbility === ab.name ? null : ab.name)}
                        className={`px-3 py-1 rounded-full text-sm capitalize shadow ${selectedAbility === ab.name ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                      >
                        {ab.name.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                  {selectedAbility && (
                    <div className="mt-3 p-3 border rounded bg-gray-50 text-sm">
                      {abilitiesInfo.find((a) => a.name === selectedAbility)?.effect}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">{t('baseStats')}</h2>
                  <div className="space-y-3">
                    {Object.entries(pokemon.stats).map(([stat, value]) => {
                      const statTranslations: Record<string, string> = {
                        hp: t('hp'),
                        attack: t('attack'),
                        defense: t('defense'),
                        specialAttack: t('specialAttack'),
                        specialDefense: t('specialDefense'),
                        speed: t('speed')
                      };
                      
                      return (
                        <div key={stat}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">{statTranslations[stat]}</span>
                            <span className="text-sm font-semibold">{value}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000"
                              style={{ width: `${Math.min((value / 255) * 100, 100)}%` }}
                            />
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Evolution Chain */}
              {evoChain && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold mb-4">{t('evolutionChain') ?? 'Evolution Chain'}</h2>
                  <EvolutionChain chain={evoChain} megaForms={formSprites.mega ? [{ spriteUrl: formSprites.mega.normal, detailsText: 'Mega Stone' }] : []} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
     </div>
    </div>
  );
};

// const getGeneration = (id: number): number => {
//   if (id >= 152 && id <= 251) return 2;
//   else if (id >= 252 && id <= 386) return 3;
//   else if (id >= 387 && id <= 493) return 4;
//   else if (id >= 494 && id <= 649) return 5;
//   else if (id >= 650 && id <= 721) return 6;
//   else if (id >= 722 && id <= 809) return 7;
//   else if (id >= 810 && id <= 905) return 8;
//   else if (id >= 906) return 9;
//   return 1;
// };

// const getRegion = (generation: number): string => {
//   switch(generation) {
//     case 1: return 'Kanto';
//     case 2: return 'Johto';
//     case 3: return 'Hoenn';
//     case 4: return 'Sinnoh';
//     case 5: return 'Unova';
//     case 6: return 'Kalos';
//     case 7: return 'Alola';
//     case 8: return 'Galar';
//     case 9: return 'Paldea';
//     default: return '';
//   }
// };