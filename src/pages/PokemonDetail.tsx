import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Pokemon } from '../types/pokemon';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { pokemonNameTranslations } from '../utils/pokemonTranslations';

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

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const details = await response.json();
        
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
          abilities: details.abilities.map((ability: { ability: { name: string } }) => 
            ability.ability.name
          ),
        });
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
              <div className="flex justify-center">
                <img
                  src={pokemon.imageUrl}
                  alt={displayName}
                  className="w-full max-w-md h-auto"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))' }}
                  onError={(e) => {
                    // Fallback to default sprite if official artwork fails
                    const target = e.target as HTMLImageElement;
                    target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                  }}
                />
              </div>
              
              <div>
                <div className="mb-6">
                  <p className="text-gray-500 text-lg mb-2">#{String(pokemon.id).padStart(3, '0')}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-4xl font-bold capitalize">{displayName}</h1>
                    <div className="flex gap-2">
                      {pokemon.types.map((type) => (
                        <img
                          key={type}
                          src={typeIcons[type]}
                          alt={type}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            // Hide icon if it fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {pokemon.types.map((type) => (
                      <span
                        key={type}
                        className={`bg-gradient-to-br ${typeColors[type]} px-4 py-2 rounded-full text-white text-sm capitalize font-medium shadow-md`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
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
                  <h2 className="text-xl font-semibold mb-2">{t('abilities')}</h2>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.abilities.map((ability) => (
                      <span
                        key={ability}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm capitalize"
                      >
                        {ability.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};