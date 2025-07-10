/**
 * Mapping of Paradox Pokémon National Dex IDs to their original species' IDs.
 * Scarlet & Violet (+DLC) coverage.
 */

// export const paradoxOrigins: Record<number, number> = {
//   // Ancient forms (Pokémon Scarlet)
//   984: 232, // Great Tusk   ➜ Donphan
//   985: 39,  // Scream Tail  ➜ Jigglypuff
//   986: 591, // Brute Bonnet ➜ Amoonguss
//   987: 200, // Flutter Mane ➜ Misdreavus
//   988: 637, // Slither Wing ➜ Volcarona
//   989: 82,  // Sandy Shocks ➜ Magneton
//   1005: 373, // Roaring Moon ➜ Salamence
//   1014: 245, // Walking Wake ➜ Suicune
//   1025: 257, // Gouging Fire ➜ Blaziken
//   1026: 243, // Raging Bolt  ➜ Raikou

//   // Future forms (Pokémon Violet)
//   990: 232, // Iron Treads  ➜ Donphan
//   991: 225, // Iron Bundle  ➜ Delibird
//   992: 297, // Iron Hands   ➜ Hariyama
//   993: 635, // Iron Jugulis ➜ Hydreigon
//   994: 637, // Iron Moth    ➜ Volcarona
//   995: 248, // Iron Thorns  ➜ Tyranitar
//   1006: 282, // Iron Valiant ➜ Gardevoir
//   1015: 640, // Iron Leaves  ➜ Virizion
//   1027: 639, // Iron Boulder ➜ Terrakion
//   1028: 638, // Iron Crown   ➜ Cobalion
// };

// export const getOriginId = (paradoxId: number): number | undefined => paradoxOrigins[paradoxId];

export const paradoxOrigins: Record<number, number> = {
  // Ancient forms (Pokémon Scarlet)
  984: 232, // Great Tusk ➜ Donphan
  985: 39,  // Scream Tail ➜ Jigglypuff
  986: 591, // Brute Bonnet ➜ Amoonguss
  987: 200, // Flutter Mane ➜ Misdreavus
  988: 637, // Slither Wing ➜ Volcarona
  989: 82,  // Sandy Shocks ➜ Magneton
  1005: 373, // Roaring Moon ➜ Salamence
  1014: 245, // Walking Wake ➜ Suicune
  1025: 257, // Gouging Fire ➜ Blaziken
  1026: 243, // Raging Bolt ➜ Raikou

  // Future forms (Pokémon Violet)
  990: 232, // Iron Treads ➜ Donphan
  991: 225, // Iron Bundle ➜ Delibird
  992: 297, // Iron Hands ➜ Hariyama
  993: 635, // Iron Jugulis ➜ Hydreigon
  994: 637, // Iron Moth ➜ Volcarona
  995: 248, // Iron Thorns ➜ Tyranitar
  1006: 282, // Iron Valiant ➜ Gardevoir
  1015: 640, // Iron Leaves ➜ Virizion
  1027: 639, // Iron Boulder ➜ Terrakion
  1028: 638, // Iron Crown ➜ Cobalion
};
 
export const getOriginId = (paradoxId: number): number | undefined => paradoxOrigins[paradoxId];

