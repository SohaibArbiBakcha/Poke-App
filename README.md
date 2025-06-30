# Pokédex React App

A modern, responsive Pokédex built with React, TypeScript, Vite and Tailwind CSS. Browse, search and filter Pokémon by region, types, legendary / mythical status, and more.

## Features

- 🔎 Search Pokémon by name
- 🏷️ Filter by region, type, generation, legendary / mythical status and special forms (Alolan, Galarian, Mega)
- 🌐 Multi-language support (via custom language context)
- 📱 Fully responsive UI built with Tailwind CSS
- ⚡ Fast Vite build with React + TypeScript
- 🔗 Deep-links to detailed Pokémon pages including evolution chains

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app runs on <http://localhost:5173> by default.

## Project Structure

```
project/
├─ public/            # Static assets (favicon, images, etc.)
├─ src/
│  ├─ components/     # Re-usable UI components
│  ├─ pages/          # Route components (PokemonList, PokemonDetail …)
│  ├─ contexts/       # React context providers (LanguageContext …)
│  ├─ types/          # Shared TypeScript types
│  └─ main.tsx        # Vite entry point
├─ index.html         # HTML template (title & favicon defined here)
├─ tailwind.config.js # Tailwind configuration
└─ vite.config.ts     # Vite configuration
```

## Favicon

A Poké Ball favicon ( `public/pokeball.png` ) is referenced in `index.html`. If you wish to change it, replace the file in `public/` and restart the dev server.

## Acknowledgements

- Data & sprites provided by [PokeAPI](https://pokeapi.co/)
- Icons by [Lucide](https://lucide.dev/)

---
Created with ❤️ by Sohaib Arbi Bakcha
