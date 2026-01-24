# GameOps - Sports Statistics Tracking Application

## Overview
GameOps is a professional sports statistics tracking application designed for booth operators. Built with the tagline "Built for the booth. Trusted by the game.", it provides real-time stat tracking with a focus on basketball, with architecture supporting ice hockey and other sports.

## Design System
- **Light Mode**: Haikyuu-inspired clean sports precision aesthetic with white backgrounds, bold line accents, and sharp geometric borders
- **Dark Mode**: Akira neo-Tokyo industrial style with deep blacks, crimson red accents, and neon glow effects
- **Typography**: Oxanium (primary/branding), Inter (body text), JetBrains Mono (data/numbers)
- **Primary Color**: Crimson red (#E53935 / 355 85% 52%)
- **Accent Color**: Electric blue (#1E88E5 / 200 90% 50%)

## Architecture

### Frontend (React + TypeScript)
- `client/src/pages/home.tsx` - Main game tracking interface
- `client/src/components/` - Reusable UI components:
  - `GameSetup.tsx` - Game configuration wizard
  - `Scoreboard.tsx` - Live scoreboard with team scores and clock
  - `PlayerRoster.tsx` - Player management with on-court/bench tracking
  - `StatTracker.tsx` - Quick stat entry buttons
  - `BoxScore.tsx` - Detailed statistics table with print support
  - `PlayByPlay.tsx` - Chronological play timeline
  - `GameControls.tsx` - Clock and game management controls
  - `ThemeToggle.tsx` - Dark/light mode toggle
  - `Logo.tsx` - Branded logo component

### Backend (Express + In-Memory Storage)
- `server/routes.ts` - API endpoints for game CRUD operations
- `server/storage.ts` - In-memory game state management

### Shared
- `shared/schema.ts` - TypeScript types and Zod schemas for Game, Team, Player, Play

## Key Features
1. **Basketball stat tracking**: Points (2PT/3PT/FT), rebounds, assists, steals, blocks, turnovers, fouls
2. **Real-time game clock** with period management
3. **Foul tracking** with visual warnings at 4-5 fouls
4. **Team timeout tracking**
5. **Print-optimized box score** for official scoresheets
6. **Dark mode toggle** in top-right corner

## Running the App
The application runs via `npm run dev` which starts both the Express backend and Vite frontend on port 5000.

## User Preferences
- Anime-inspired design (Haikyuu for sports precision, Akira for neo-Tokyo branding)
- Dark mode with instant toggle button
- Clean printable box scores
- Focus on basketball with awareness for hockey and other sports

## Recent Changes
- Initial MVP implementation (January 2026)
- Complete game setup wizard with team/player configuration
- Full stat tracking interface with live updates
- Print functionality for box scores
