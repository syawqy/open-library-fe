# Open Library (Vue 3 + TypeScript + Vite)

A simple web app to search books on Open Library, add them to a local Reading List, and track reading progress. Built with Vue 3 and Vuetify.

## Features
- Search books via the Open Library API
- Responsive card grid with covers, title, author, and first publish year
- Add/remove books to your Reading List
- Adjustable reading progress slider with persistent storage (localStorage)
- Separate Search and Reading List views
- Fast skeleton loading states for a smooth UX

## Tech Stack
- Vue 3 + TypeScript + Vite
- Vuetify 3 (Material Design components)
- Material Design Icons (mdi)

## Getting Started
1. Install dependencies:
   - `npm install`
2. Start the dev server:
   - `npm run dev`
   - Vite will open on `http://localhost:5173/` (or a nearby port if busy)
3. Build for production:
   - `npm run build`
4. Preview the production build locally:
   - `npm run preview`

## Notes
- No API keys required; the app uses public Open Library endpoints.
- Reading progress and list state are saved in `localStorage` under `openlib-reading-list`.

## Project Structure (high level)
- `src/App.vue` — App shell and navigation between Search and Reading List
- `src/components/SearchPage.vue` — Search input and results grid
- `src/components/ReadingListPage.vue` — Your saved books and progress controls
- `src/components/BookCard.vue` — Book card UI and actions
- `src/components/SkeletonCard.vue` — Loading placeholder matching card layout
- `src/main.ts` — App bootstrap and Vuetify setup
