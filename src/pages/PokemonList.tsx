import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pokemon, PokemonFilters } from '../types/pokemon';
import { PokemonCard } from '../components/PokemonCard';
import { Filters } from '../components/Filters';
import { LanguageSelector } from '../components/LanguageSelector';
import { isParadox } from '../utils/paradoxList';
import { useLanguage } from '../contexts/LanguageContext';
import { Swords } from 'lucide-react';

const defaultFilters: PokemonFilters = {
  name: '',
  types: [],
  generation: null,
  legendary: null,
  mythical: null,
  paradox: null,
  forms: [],
};

export const PokemonList: React.FC = () => {
  const { t } = useLanguage();
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PokemonFilters>(() => {
    const stored = localStorage.getItem('pokemonFilters');
    return stored ? (JSON.parse(stored) as PokemonFilters) : defaultFilters;
  });
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Persist filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pokemonFilters', JSON.stringify(filters));
  }, [filters]);

  const regions = [
    { id: 'kanto', name: 'Kanto', generations: [1] },
    { id: 'johto', name: 'Johto', generations: [2] },
    { id: 'hoenn', name: 'Hoenn', generations: [3] },
    { id: 'sinnoh', name: 'Sinnoh', generations: [4] },
    { id: 'unova', name: 'Unova', generations: [5] },
    { id: 'kalos', name: 'Kalos', generations: [6] },
    { id: 'alola', name: 'Alola', generations: [7] },
    { id: 'galar', name: 'Galar', generations: [8] },
    { id: 'paldea', name: 'Paldea', generations: [9] },
  ];

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

  useEffect(() => {
    // If data is cached, use it and skip network request
    const cachedStr = localStorage.getItem('pokemonData');
    if (cachedStr) {
      try {
        const cached: Pokemon[] = JSON.parse(cachedStr);
        if (cached.length && cached[0] && (cached[0] as any).paradox !== undefined) {
          setPokemon(cached);
          setLoading(false);
          return;
        }
      } catch {
        // fallthrough to refetch
      }
      // If missing paradox property or parse error, clear cache so we refetch fresh data
      localStorage.removeItem('pokemonData');
    }

    // Fetch utility: process promises in small batches to avoid overwhelming browser & API
    const runBatches = async <T,>(tasks: (() => Promise<T>)[], batchSize = 25): Promise<T[]> => {
      const results: T[] = [];
      for (let i = 0; i < tasks.length; i += batchSize) {
        const batch = tasks.slice(i, i + batchSize).map((fn) => fn());
        const settled = await Promise.allSettled(batch);
        settled.forEach((res) => {
          if (res.status === 'fulfilled') {
            results.push(res.value);
          }
        });
      }
      return results;
    };

    const fetchPokemon = async () => {
      try {
        // Fetch first 1010 Pokemon to cover all generations
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1010');
        const data = await response.json();
        
        const tasks: Array<() => Promise<Pokemon>> = data.results.map((pokemon: { url: string }) => async () => {
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
          
          // Fetch species data to get official names in different languages
          let species;
          try {
            const speciesRes = await fetch(details.species.url);
            species = await speciesRes.json();
          } catch {
            species = { names: [] } as any;
          }
          const namesArray: Array<{ name: string; language: { name: string } }> = species.names;
          const findName = (lang: string) => {
            const entry = namesArray.find((n) => n.language.name === lang);
            return entry ? entry.name : details.name.charAt(0).toUpperCase() + details.name.slice(1);
          };
          const translations = {
            en: findName('en'),
            fr: findName('fr'),
            ar: findName('ar')
          };
          
          // Use official artwork if available, otherwise use front default sprite
          const imageUrl = details.sprites.other['official-artwork']?.front_default || 
                          details.sprites.front_default || 
                          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${details.id}.png`;

          // Determine form (Alolan/Galarian/Normal) from name
          const lowerName = details.name.toLowerCase();
          let form: 'alolan' | 'galarian' | 'mega' | 'normal' = 'normal';
          if (lowerName.includes('alola')) form = 'alolan';
          else if (lowerName.includes('galar')) form = 'galarian';
          else if (lowerName.includes('mega')) form = 'mega';
          
          // Extract alternate regional forms from species varieties
          const altForms = (species.varieties ?? []).reduce((arr: ('alolan' | 'galarian' | 'mega')[], v: any) => {
            const n = (v.pokemon?.name ?? '').toLowerCase();
            if (n.includes('alola')) arr.push('alolan');
            else if (n.includes('galar')) arr.push('galarian');
            else if (n.includes('mega')) arr.push('mega');
            return arr;
          }, [] as ('alolan' | 'galarian')[]);
          
          return {
            id: details.id,
            name: details.name,
            translatedNames: translations,
            types: details.types.map((type: { type: { name: string } }) => type.type.name),
            generation,
            legendary: species?.is_legendary ?? false,
            mythical: species?.is_mythical ?? false,
            paradox: isParadox(details.id),
            form,
            altForms,
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
            abilities: details.abilities.map((ability: { ability: { name: string } }) => ability.ability.name),
          };
        });
      
        const pokemonDetails = await runBatches<Pokemon>(tasks, 30);

        // Sort by ID to maintain proper order
        pokemonDetails.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        setPokemon(pokemonDetails);
        localStorage.setItem('pokemonData', JSON.stringify(pokemonDetails));
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
                     filters.types.every((type) => p.types.includes(type));
      
    // Match generation (single selection)
    const generationMatch = filters.generation === null || p.generation === filters.generation;
    
    const legendaryMatch = filters.legendary === null || p.legendary === filters.legendary;
    const mythicalMatch = filters.mythical === null || p.mythical === filters.mythical;
    const paradoxMatch = filters.paradox === null || p.paradox === filters.paradox;
    const formMatch =
      filters.forms.length === 0 ||
      (p.form !== 'normal' && filters.forms.includes(p.form as any)) ||
      (p.altForms && filters.forms.filter((f) => f !== 'normal').some((f) => p.altForms!.includes(f)));

    if (!selectedRegion) return nameMatch && typeMatch && generationMatch && legendaryMatch && mythicalMatch && paradoxMatch && formMatch;
    const region = regions.find(r => r.id === selectedRegion);
    if (!region) return nameMatch && typeMatch && legendaryMatch && mythicalMatch && paradoxMatch && formMatch;
    const generation = getGeneration(p.id);
    return region.generations.includes(generation) && nameMatch && typeMatch && generationMatch && legendaryMatch && mythicalMatch && paradoxMatch && formMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <img src="https://i.gifer.com/2iiJ.gif" alt="Loading" className="w-16 h-16 object-contain" />
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
          <div className="flex gap-3 items-center">
            <Link
              to="/battle"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-lg"
            >
              <Swords size={20} />
              {t('battleSimulator')}
            </Link>
            <LanguageSelector />
          </div>
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