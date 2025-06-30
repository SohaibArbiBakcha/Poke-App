import axios from 'axios';
import { EvolutionNode, EvolutionRequirement } from '../types/pokemon';

// Build a human-readable description from evolution_details provided by the PokeAPI
function buildRequirement(details: any): EvolutionRequirement {
  const req: EvolutionRequirement = {
    trigger: details.trigger?.name ?? 'level-up',
    detailsText: ''
  };

  if (details.min_level) {
    req.minLevel = details.min_level;
    req.detailsText = `Lv ${details.min_level}`;
  } else if (details.item) {
    req.item = details.item.name;
    req.detailsText = `Use ${details.item.name.replace('-', ' ')}`;
  } else if (details.held_item) {
    req.heldItem = details.held_item.name;
    req.detailsText = `Trade holding ${details.held_item.name.replace('-', ' ')}`;
  } else if (details.trigger?.name === 'trade') {
    req.detailsText = 'Trade';
  } else {
    // fallback generic text
    req.detailsText = req.trigger;
  }

  return req;
}

// Recursively map API chain node to our EvolutionNode type
function mapChainNode(apiNode: any): EvolutionNode {
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${apiNode.species.url.split('/').slice(-2, -1)[0]}.png`;

  // There may be multiple evolution details; we take the first one as primary
  const firstDetails = apiNode.evolution_details?.[0];
  const requirements = firstDetails ? buildRequirement(firstDetails) : undefined;

  return {
    speciesName: apiNode.species.name,
    spriteUrl,
    requirements,
    evolvesTo: apiNode.evolves_to.map(mapChainNode)
  };
}

/**
 * Fetch and parse the evolution chain for a given Pokémon species.
 * You can pass either a species API URL or the numeric species ID.
 */
export async function fetchEvolutionChain(speciesIdentifier: string | number): Promise<EvolutionNode> {
  // 1. Get species to obtain evolution_chain url if identifier is id/name
  let evolutionChainUrl: string;

  if (typeof speciesIdentifier === 'string' && speciesIdentifier.startsWith('http')) {
    // direct species URL
    const speciesResp = await axios.get(speciesIdentifier);
    evolutionChainUrl = speciesResp.data.evolution_chain.url;
  } else {
    // identifier is id|name|number
    const speciesResp = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${speciesIdentifier}/`);
    evolutionChainUrl = speciesResp.data.evolution_chain.url;
  }

  // 2. Fetch evolution chain
  const chainResp = await axios.get(evolutionChainUrl);
  const rootApiNode = chainResp.data.chain;
  return mapChainNode(rootApiNode);
}
