// List of Paradox Pokémon IDs (Pokémon Scarlet/Violet + DLC)
// Source: https://bulbapedia.bulbagarden.net/wiki/Paradox_Pok%C3%A9mon
// Keeping as IDs for fast lookup; update as new forms release.
export const paradoxIds: number[] = [
  // Scarlet exclusives
  984, // Great Tusk
  985, // Scream Tail
  986, // Brute Bonnet
  987, // Flutter Mane
  988, // Slither Wing
  989, // Sandy Shocks
  1005, // Roaring Moon
  1014, // Walking Wake (DLC)
  1025, // Gouging Fire (DLC)
  1026, // Raging Bolt (DLC)

  // Violet exclusives
  990, // Iron Treads
  991, // Iron Bundle
  992, // Iron Hands
  993, // Iron Jugulis
  994, // Iron Moth
  995, // Iron Thorns
  1006, // Iron Valiant
  1015, // Iron Leaves (DLC)
  1027, // Iron Boulder (DLC)
  1028, // Iron Crown (DLC)
];

export const isParadox = (id: number): boolean => paradoxIds.includes(id);
