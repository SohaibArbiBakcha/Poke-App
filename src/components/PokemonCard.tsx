import React from 'react';
import { Link } from 'react-router-dom';
import { Pokemon } from '../types/pokemon';
import { useLanguage } from '../contexts/LanguageContext';

interface PokemonCardProps {
  pokemon: Pokemon;
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

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const { language } = useLanguage();
  
  const displayName = pokemon.translatedNames[language] || pokemon.name;

  return (
    <Link to={`/pokemon/${pokemon.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden">
        <div className="relative aspect-square p-4 bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={pokemon.imageUrl}
            alt={displayName}
            className="w-full h-full object-contain"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            loading="lazy"
            onError={(e) => {
              // Fallback to default sprite if official artwork fails
              const target = e.target as HTMLImageElement;
              target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
            }}
          />
          <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-xs font-medium text-gray-600">#{String(pokemon.id).padStart(3, '0')}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3 text-center capitalize">{displayName}</h3>
          <div className="flex gap-2 justify-center flex-wrap">
            {pokemon.types.map((type) => (
              <div
                key={type}
                className={`bg-gradient-to-br ${typeColors[type]} flex items-center gap-1 px-3 py-1 rounded-full shadow-sm`}
              >
                <img 
                  src={typeIcons[type]} 
                  alt={type}
                  className="w-4 h-4 object-contain"
                  onError={(e) => {
                    // Hide icon if it fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <span className="text-white text-sm capitalize font-medium">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};