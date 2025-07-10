import React from 'react';
import { Search, Filter, Crown, Sparkles } from 'lucide-react';
import { PokemonFilters } from '../types/pokemon';
import { useLanguage } from '../contexts/LanguageContext';

interface FiltersProps {
  filters: PokemonFilters;
  onFilterChange: (filters: PokemonFilters) => void;
}

const pokemonTypes = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const generations = [
  {
    number: 1,
    logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
  },
  {
    number: 2,
    logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png"
  },
  {
    number: 3,
    logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png"
  },
  {
    number: 4,
    logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
  },
  {
    number: 5,
    logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/premier-ball.png"
  },
  {
    number: 6,
    logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/luxury-ball.png"
  },
  {
    number: 7,
    logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dusk-ball.png"
  },
  {
    number: 8,
    logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/quick-ball.png"
  },
  {
    number: 9,
    logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/repeat-ball.png"
  }
];

const regionNames: Record<number, string> = {
  1: 'Kanto',
  2: 'Johto',
  3: 'Hoenn',
  4: 'Sinnoh',
  5: 'Unova',
  6: 'Kalos',
  7: 'Alola',
  8: 'Galar',
  9: 'Paldea'
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

export const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange }) => {
  const { t } = useLanguage();

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    onFilterChange({ ...filters, types: newTypes });
  };

  const handleLegendaryToggle = () => {
    const value = filters.legendary === true ? null : true;
    onFilterChange({ ...filters, legendary: value, mythical: null });
  };
  const handleMythicalToggle = () => {
    const value = filters.mythical === true ? null : true;
    onFilterChange({ ...filters, mythical: value, legendary: null });
  };
  const handleFormToggle = (form: 'alolan' | 'galarian' | 'mega') => {
    const newForms = filters.forms.includes(form)
      ? filters.forms.filter(f => f !== form)
      : [...filters.forms, form];
    onFilterChange({ ...filters, forms: newForms });
  };

  const clearAllFilters = () => {
    onFilterChange({
      name: '',
      types: [],
      generation: null,
      legendary: null,
      mythical: null,
    paradox: null,
      forms: []
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={filters.name}
            onChange={(e) => onFilterChange({ ...filters, name: e.target.value })}
          />
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h3 className="flex items-center gap-2 font-semibold text-xl">
          <Filter size={24} />
          Filters
        </h3>
        <button
          onClick={clearAllFilters}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Special status filters */}
      <div className="mb-6">
        <h3 className="flex items-center gap-2 font-semibold mb-4 text-lg">
          {t('special') ?? 'Special'}
        </h3>
        <div className="grid grid-cols-6 gap-3 justify-items-center">
          <button
            className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center transition-all ${filters.legendary ? 'bg-red-200 shadow-lg' : 'hover:bg-gray-100'}`}
            onClick={handleLegendaryToggle}
            title="Legendary"
          >
            <Crown className="w-6 h-6 text-yellow-600" />
            <span className="text-[10px] mt-1">Legendary</span>
          </button>
          <button
            className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center transition-all ${filters.mythical ? 'bg-red-200 shadow-lg' : 'hover:bg-gray-100'}`}
            onClick={handleMythicalToggle}
            title="Mythical"
          >
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span className="text-[10px] mt-1">Mythical</span>
          </button>
          <button
            className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center transition-all ${filters.paradox ? 'bg-red-200 shadow-lg' : 'hover:bg-gray-100'}`}
            onClick={() => onFilterChange({ ...filters, paradox: filters.paradox ? null : true })}
            title="Paradox"
          >
            🌀
            <span className="text-[10px] mt-1">Paradox</span>
          </button>
          <button
            className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center transition-all ${filters.forms.includes('alolan') ? 'bg-red-200 shadow-lg' : 'hover:bg-gray-100'}`}
            onClick={() => handleFormToggle('alolan')}
            title="Alolan"
          >
            🌴
            <span className="text-[10px] mt-1">Alolan</span>
          </button>
          <button
            className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center transition-all ${filters.forms.includes('galarian') ? 'bg-red-200 shadow-lg' : 'hover:bg-gray-100'}`}
            onClick={() => handleFormToggle('galarian')}
            title="Galarian"
          >
            🏴
            <span className="text-[10px] mt-1">Galarian</span>
          </button>
          <button
            className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center transition-all ${filters.forms.includes('mega') ? 'bg-red-200 shadow-lg' : 'hover:bg-gray-100'}`}
            onClick={() => handleFormToggle('mega')}
            title="Mega"
          >
            💥
            <span className="text-[10px] mt-1">Mega</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="flex items-center gap-2 font-semibold mb-4 text-lg">
          {t('generation')}
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3 justify-items-center">
          {generations.map((gen) => (
            <button
              key={gen.number}
              className={`w-14 h-16 p-1 rounded-lg transition-all flex flex-col items-center justify-center ${
                filters.generation === gen.number
                  ? 'bg-red-200 shadow-lg'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => {
                const newGeneration = filters.generation === gen.number ? null : gen.number;
                onFilterChange({ 
                  ...filters, 
                  generation: newGeneration
                });
              }}
            >
              <img 
                src={gen.logo} 
                alt={`${t('generation')} ${gen.number}`}
                className="w-full h-6 object-contain"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <span className="text-[10px] mt-1">{regionNames[gen.number]}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="flex items-center gap-2 font-semibold mb-4 text-lg">
          {t('types')}
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-3 justify-items-center">
          {pokemonTypes.map((type) => (
            <button
              key={type}
              className={`w-16 h-8 p-0 rounded-lg transition-all flex items-center justify-center ${
                filters.types.includes(type)
                  ? 'bg-red-200 shadow-lg'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handleTypeToggle(type)}
            >
              <img 
                src={typeIcons[type]} 
                alt={type}
                className="w-full h-6 object-contain"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />

            </button>
          ))}
        </div>
      </div>
    </div>
  );
};