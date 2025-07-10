import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Pokemon } from '../types/pokemon';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { EvolutionChain } from '../components/EvolutionChain';
import { EvolutionNode } from '../types/pokemon';
import { fetchEvolutionChain } from '../utils/evolution';
import { isParadox } from '../utils/paradoxList';
import { getOriginId } from '../utils/paradoxOrigins';

// Tailwind gradient classes for type backgrounds
export const typeColors: Record<string, string> = {
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

// Sword/Shield type icon URLs
export const typeIcons: Record<string, string> = {
  normal: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/1.png',
  fire: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/10.png',
  water: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/11.png',
  electric: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/13.png',
  grass: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/12.png',
  ice: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/15.png',
  fighting: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/2.png',
  poison: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/4.png',
  ground: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/5.png',
  flying: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/3.png',
  psychic: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/14.png',
  bug: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/7.png',
  rock: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/6.png',
  ghost: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/8.png',
  dragon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/16.png',
  dark: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/17.png',
  steel: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/9.png',
  fairy: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/18.png',
};

export const PokemonDetailFixed: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShiny, setIsShiny] = useState(false);
  const [abilitiesInfo, setAbilitiesInfo] = useState<AbilityInfo[]>([]);
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);
  const [evoChain, setEvoChain] = useState<EvolutionNode | null>(null);
  type AbilityInfo = { name: string; effect: string };
interface FormSprites {
  normal: { normal: string; shiny: string };
  mega?: { normal: string; shiny: string };
}

// currently only shiny toggle used; keeping formSprites reserved for future
const [currentForm] = useState<'normal' | 'mega'>('normal');
  const [formSprites] = useState<FormSprites>({ normal: { normal: '', shiny: '' } });
const [origin, setOrigin] = useState<{ id: number; name: string; image: string } | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const details = await resp.json();
        const speciesResp = await fetch(details.species.url);
        const species = await speciesResp.json();

        const translatedName = species.names.find((n: any) => n.language.name === language)?.name ?? details.name;

        

        setPokemon({
          id: details.id,
          name: details.name,
          translatedNames: { [language]: translatedName },
          imageUrl: details.sprites.other['official-artwork'].front_default,
          types: details.types.map((t: any) => t.type.name),
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
          generation: 1,
          legendary: species.is_legendary,
          mythical: species.is_mythical,
          form: 'normal',
          abilities: details.abilities.map((a: any) => a.ability.name),
        } as unknown as Pokemon);

        // Ability effects
        const abilityInfos: AbilityInfo[] = await Promise.all(
          details.abilities.map(async (ab: any) => {
            const abResp = await fetch(ab.ability.url);
            const abData = await abResp.json();
            const enEntry = abData.effect_entries.find((e: any) => e.language.name === 'en');
            return { name: ab.ability.name, effect: enEntry?.effect ?? '' };
          })
        );
        setAbilitiesInfo(abilityInfos);

        // Evolution chain
        try {
          const chain = await fetchEvolutionChain(details.species.url);
          setEvoChain(chain);
        } catch (err) {
          console.error('evo chain fetch failed', err);
        }

        // Origin Pokémon for paradox species
        if (isParadox(details.id)) {
          const originId = getOriginId(details.id);
          if (originId) {
            try {
              const oResp = await fetch(`https://pokeapi.co/api/v2/pokemon/${originId}`);
              const oData = await oResp.json();
              setOrigin({ id: originId, name: oData.name, image: oData.sprites.other['official-artwork'].front_default });
            } catch (err) {
              console.error('origin fetch failed', err);
            }
          }
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, language]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!pokemon) return null;

  // Determine display image
  const displayImage = isShiny
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemon.id}.png`
    : pokemon.imageUrl;

  return (
    <div className="min-h-screen bg-[#FF1C1C] py-8">
      <div className="container mx-auto px-4">
        {/* header */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="inline-flex items-center text-white hover:text-gray-200">
            <ArrowLeft size={20} className="mr-2" />
            {t('backToPokedex')}
          </Link>
          <LanguageSelector />
        </div>

        {/* card */}
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
          {/* animated type background */}
          <div className="absolute inset-0 flex">
            {pokemon.types.map((type, i) => (
              <div
                key={type}
                className={`flex-1 bg-gradient-to-br ${typeColors[type]} opacity-10 animate-pulse`}
                style={{ animationDelay: `${i * 0.4}s`, animationDuration: '3s' }}
              />
            ))}
          </div>

          <div className="relative z-10 p-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* left */}
              <div className="flex flex-col items-center relative">
                <button
                  onClick={() => setIsShiny((prev) => !prev)}
                  className="absolute top-2 left-2 bg-white rounded-full w-9 h-9 flex items-center justify-center shadow text-yellow-500"
                >
                  ✨
                </button>
                <img src={displayImage} alt={pokemon.name} className="w-4/5 max-w-md object-contain" />
                <div className="flex mt-4 space-x-2">
                  {pokemon.types.map((type) => (
                    <img key={type} src={typeIcons[type]} alt={type} className="w-6 h-6" />
                  ))}
                </div>
              </div>

              {/* right */}
              <div>
                {/* basic info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-600">{t('height')}</p>
                    <p className="text-lg font-semibold">{pokemon.height}m</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('weight')}</p>
                    <p className="text-lg font-semibold">{pokemon.weight}kg</p>
                  </div>
                </div>

                {/* abilities */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2 cursor-pointer" onClick={() => setSelectedAbility(null)}>
                    {t('abilities')}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {abilitiesInfo.map((ab) => (
                      <button
                        key={ab.name}
                        onClick={() => setSelectedAbility(selectedAbility === ab.name ? null : ab.name)}
                        className={`px-3 py-1 rounded-full text-sm capitalize shadow ${
                          selectedAbility === ab.name ? 'bg-blue-500 text-white' : 'bg-gray-100'
                        }`}
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

                {/* stats */}
                <h2 className="text-xl font-semibold mb-2">{t('baseStats')}</h2>
                {/* <StatsRadar stats={pokemon.stats} /> */}
              </div>
            </div>

            {origin && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">{t('originPokemon') ?? 'Origin Pokémon'}</h2>
                <Link to={`/pokemon/${origin.id}`} className="flex items-center gap-4 p-4 bg-gray-100 rounded hover:shadow">
                  <img src={origin.image} alt={origin.name} className="w-16 h-16 object-contain" />
                  <span className="capitalize font-medium">{origin.name.replace('-', ' ')}</span>
                </Link>
              </div>
            )}

            {/* evolution chain */}
            {evoChain && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold mb-4">{t('evolutionChain')}</h2>
                <EvolutionChain chain={evoChain} megaForms={[]} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailFixed;
