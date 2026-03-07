import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
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
  const pageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const pokeballRef = useRef<HTMLImageElement>(null);
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingTotal, setLoadingTotal] = useState(0);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState<PokemonFilters>(() => {
    const stored = localStorage.getItem('pokemonFilters');
    return stored ? (JSON.parse(stored) as PokemonFilters) : defaultFilters;
  });

  // Page fade-in and logo/filter entrance on mount
  useEffect(() => {
    gsap.from(pageRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' });
    gsap.from(logoRef.current, { scale: 0, opacity: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)', delay: 0.1 });
    gsap.from(filtersRef.current, { y: -20, opacity: 0, duration: 0.5, delay: 0.3, ease: 'power2.out' });
  }, []);

  // Spin the pokeball while loading
  useEffect(() => {
    if (loading && pokeballRef.current) {
      gsap.to(pokeballRef.current, {
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: 'none',
      });
    }
  }, [loading, loadingProgress]); // re-check when progress updates ensure ref is mounted

  // Stagger cards when data finishes loading
  useEffect(() => {
    if (!loading && gridRef.current) {
      const cards = gridRef.current.querySelectorAll(':scope > a');
      if (cards.length > 0) {
        gsap.from(cards, {
          y: 30, opacity: 0, duration: 0.4,
          stagger: { amount: 0.5 },
          ease: 'power2.out',
          clearProps: 'all',
        });
      }
    }
  }, [loading]);

  // Persist filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pokemonFilters', JSON.stringify(filters));
  }, [filters]);

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
        setLoadingProgress(results.length);
      }
      return results;
    };

    const fetchPokemon = async () => {
      try {
        // Fetch first 1010 Pokemon to cover all generations
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1010');
        const data = await response.json();
        setLoadingTotal(data.results.length);

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
      } catch (err) {
        console.error('Error fetching Pokemon:', err);
        setError(true);
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

    const generationMatch = filters.generation === null || p.generation === filters.generation;

    const legendaryMatch = filters.legendary === null || p.legendary === filters.legendary;
    const mythicalMatch = filters.mythical === null || p.mythical === filters.mythical;
    const paradoxMatch = filters.paradox === null || p.paradox === filters.paradox;
    const formMatch =
      filters.forms.length === 0 ||
      (p.form !== 'normal' && filters.forms.includes(p.form as any)) ||
      (p.altForms && filters.forms.filter((f) => f !== 'normal').some((f) => p.altForms!.includes(f)));

    return nameMatch && typeMatch && generationMatch && legendaryMatch && mythicalMatch && paradoxMatch && formMatch;
  });

  if (loading) {
    const progressPercent = loadingTotal > 0 ? Math.round((loadingProgress / loadingTotal) * 100) : 0;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FF1C1C] gap-8">
        {/* Pokémon Logo */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1200px-International_Pok%C3%A9mon_logo.svg.png"
          alt="Pokémon"
          className="h-20 object-contain drop-shadow-lg"
        />

        {/* Spinning Pokéball */}
        <img
          ref={pokeballRef}
          src="/pokeball.svg"
          alt="Loading"
          className="w-24 h-24 drop-shadow-xl"
        />

        {/* Counter */}
        <p className="text-white font-bold text-lg tracking-wide">
          {loadingTotal > 0 ? `${loadingProgress} / ${loadingTotal} Pokémon` : 'Connecting...'}
        </p>

        {/* HP-bar style progress */}
        <div className="w-72">
          <div className="flex justify-between text-white/80 text-sm mb-2">
            <span>{t('loading')}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-5 bg-gray-900 rounded-full border-2 border-gray-950 overflow-hidden shadow-inner">
            <div
              className="progress-bar-fill h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FF1C1C] flex flex-col items-center justify-center gap-4">
        <p className="text-white text-2xl font-bold">Failed to load Pokémon data.</p>
        <p className="text-white/80">Check your connection and try again.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#FF1C1C]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 items-center mb-8">
          <div />
          <div className="flex justify-center">
            <img
              ref={logoRef}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1200px-International_Pok%C3%A9mon_logo.svg.png"
              alt={t('pokemonLogo')}
              className="h-24 object-contain"
            />
          </div>
          <div className="flex gap-3 items-center justify-end">
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

        <div ref={filtersRef} className="mb-4">
          <Filters filters={filters} onFilterChange={setFilters} />
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-white/80 text-sm font-medium">
            Showing {filteredPokemon.length} of {pokemon.length} Pokémon
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredPokemon.map((p) => (
            <PokemonCard key={p.id} pokemon={p} />
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
