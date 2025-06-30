import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pokemon } from '../types/pokemon';
import { useLanguage } from '../contexts/LanguageContext';

interface PokemonCardProps {
  pokemon: Pokemon;
}

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

const getGeneration = (id: number): number => {
  if (id >= 152 && id <= 251) return 2;
  else if (id >= 252 && id <= 386) return 3;
  else if (id >= 387 && id <= 493) return 4;
  else if (id >= 494 && id <= 649) return 5;
  else if (id >= 650 && id <= 721) return 6;
  else if (id >= 722 && id <= 809) return 7;
  else if (id >= 810 && id <= 905) return 8;
  else if (id >= 906) return 9;
  return 1;
};

const getRegion = (generation: number): string => {
  switch(generation) {
    case 1: return 'Kanto';
    case 2: return 'Johto';
    case 3: return 'Hoenn';
    case 4: return 'Sinnoh';
    case 5: return 'Unova';
    case 6: return 'Kalos';
    case 7: return 'Alola';
    case 8: return 'Galar';
    case 9: return 'Paldea';
    default: return '';
  }
};

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const { language } = useLanguage();
  const [isShiny, setIsShiny] = useState(false);
  const imageUrl = isShiny
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemon.id}.png`
    : pokemon.imageUrl;
  
  const displayName = pokemon.translatedNames[language] || pokemon.name;

  return (
    <Link to={`/pokemon/${pokemon.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden">
        <div className="relative aspect-square p-4 bg-gradient-to-br from-gray-50 to-gray-100">
          <button
            onClick={(e) => { e.preventDefault(); setIsShiny(prev => !prev); }}
            className="absolute top-2 left-2 bg-white rounded-full w-10 h-10 flex items-center justify-center text-yellow-500 hover:bg-yellow-200 shadow transition z-10"
            title={isShiny ? 'Show normal' : 'Show shiny'}
          >
            ✨
          </button>
          <img
            src={imageUrl}
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
          {pokemon.altForms && pokemon.altForms.length > 0 && (
            <div className="absolute bottom-2 right-2 text-xl pointer-events-none">
              {pokemon.altForms.includes('alolan') && <span title="Alolan">🌴</span>}
              {pokemon.altForms.includes('galarian') && <span title="Galarian">🏴</span>}
              {pokemon.altForms.includes('mega') && <span title="Mega">💥</span>}
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex flex-col items-center">
            <div className="text-lg font-bold capitalize">{displayName}</div>
            <div className="text-xs text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</div>
            <div className="text-xs text-gray-500 mt-1">
              {getRegion(getGeneration(pokemon.id))}
            </div>
          </div>
          <div className="flex gap-3 justify-center flex-wrap mt-4">
            {pokemon.types.map((type) => (
              <img
                key={type}
                src={typeIcons[type]}
                alt={type}
                className="w-[30%] h-auto object-contain"
                onError={(e) => {
                  // Hide icon if it fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};