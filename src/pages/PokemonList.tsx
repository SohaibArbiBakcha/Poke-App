import React, { useState, useEffect } from 'react';
import { Pokemon, PokemonFilters } from '../types/pokemon';
import { PokemonCard } from '../components/PokemonCard';
import { Filters } from '../components/Filters';
import { LanguageSelector } from '../components/LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { pokemonNameTranslations } from '../utils/pokemonTranslations';
import { Loader2 } from 'lucide-react';

export const PokemonList: React.FC = () => {
  const { t } = useLanguage();
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PokemonFilters>({
    name: '',
    types: [],
    generation: null,
  });

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        // Fetch first 1010 Pokemon to cover all generations
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1010');
        const data = await response.json();
        
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: { url: string }) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            
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
            
            return {
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
              height: details.height,
              weight: details.weight,
              abilities: details.abilities.map((ability: { ability: { name: string } }) => 
                ability.ability.name
              ),
            };
          })
        );

        // Sort by ID to maintain proper order
        pokemonDetails.sort((a, b) => a.id - b.id);
        setPokemon(pokemonDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const filteredPokemon = pokemon.filter((p) => {
    const nameMatch = filters.name === '' || 
                     p.name.toLowerCase().includes(filters.name.toLowerCase()) ||
                     p.translatedNames.en.toLowerCase().includes(filters.name.toLowerCase()) ||
                     p.translatedNames.fr.toLowerCase().includes(filters.name.toLowerCase()) ||
                     p.translatedNames.ar.includes(filters.name);
    
    const typeMatch = filters.types.length === 0 ||
                     filters.types.some((type) => p.types.includes(type));
    
    const genMatch = filters.generation === null || p.generation === filters.generation;

    return nameMatch && typeMatch && genMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">{t('loading')}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FF1C1C]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex justify-center flex-1">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1200px-International_Pok%C3%A9mon_logo.svg.png"
              alt={t('pokemonLogo')}
              className="h-24 object-contain"
            />
          </div>
          <LanguageSelector />
        </div>
        <div className="mb-8">
          <Filters filters={filters} onFilterChange={setFilters} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredPokemon.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
        {filteredPokemon.length === 0 && (
          <div className="text-center text-white text-xl mt-8">
            No Pokémon found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};