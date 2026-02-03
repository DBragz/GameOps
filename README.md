# GameOps

**Built for the booth. Trusted by the game.**

A professional sports statistics tracking application designed for booth operators. GameOps provides real-time stat tracking with a primary focus on basketball, with architecture supporting ice hockey and other sports.

---

## Key Features

1. **Game Menu**: Start new game or join existing active games
2. **Games Completed**: View finished games with box scores and play-by-play history
3. **Basketball Stat Tracking**: Points (2PT/3PT/FT), rebounds, assists, steals, blocks, turnovers, fouls
4. **Real-time Game Clock**: Period management with start/stop controls
5. **Foul Tracking**: Visual warnings at 4-5 fouls per player
6. **Team Timeout Tracking**: Monitor remaining timeouts per team
7. **Print-Optimized Box Score**: Clean layout for official scoresheets
8. **Dark Mode Toggle**: Instant theme switching in top-right corner

---

## Prerequisites

Before running GameOps, ensure you have the following software installed:

| Software | Version | Purpose |
|----------|---------|---------|
| **Node.js** | 20.x or higher | JavaScript runtime for server and build tools |
| **npm** | 9.x or higher | Package manager (comes with Node.js) |
| **Modern Web Browser** | Chrome, Firefox, Safari, Edge | Application frontend |

### Optional Tools

| Software | Purpose |
|----------|---------|
| **Git** | Version control and repository management |
| **VS Code** | Recommended code editor with TypeScript support |

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gameops
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5000`

---

## Design System

- **Light Mode**: Haikyuu-inspired clean sports precision aesthetic with white backgrounds, bold line accents, and sharp geometric borders
- **Dark Mode**: Akira neo-Tokyo industrial style with deep blacks, crimson red accents, and neon glow effects
- **Typography**: Oxanium (primary/branding), Inter (body text), JetBrains Mono (data/numbers)
- **Primary Color**: Crimson red (#E53935 / 355 85% 52%)
- **Accent Color**: Electric blue (#1E88E5 / 200 90% 50%)

---

## Application Components

### Frontend Components

| Component | File | Description |
|-----------|------|-------------|
| **GameMenu** | `client/src/components/GameMenu.tsx` | Start new game or join existing game menu with completed games section |
| **GameSetup** | `client/src/components/GameSetup.tsx` | Multi-step wizard for configuring new games. Allows selection of sport type, rules (high school/college/pro), team names, colors, and full roster management. |
| **Scoreboard** | `client/src/components/Scoreboard.tsx` | Live scoreboard display showing team names, current scores, game clock, period/quarter, possession indicator, and timeout tracking. |
| **PlayerRoster** | `client/src/components/PlayerRoster.tsx` | Team roster management with on-court/bench player tracking. Displays player numbers, names, positions, points, and foul counts with visual warnings at 4-5 fouls. |
| **StatTracker** | `client/src/components/StatTracker.tsx` | Quick-entry stat buttons for recording plays. Supports 2PT/3PT field goals, free throws, rebounds (offensive/defensive), assists, steals, blocks, turnovers, and fouls. |
| **BoxScore** | `client/src/components/BoxScore.tsx` | Comprehensive statistics table showing individual player stats and team totals. Includes print-optimized styling for official scoresheets. |
| **PlayByPlay** | `client/src/components/PlayByPlay.tsx` | Chronological timeline of all recorded plays with timestamps, period markers, and play descriptions. |
| **GameControls** | `client/src/components/GameControls.tsx` | Game management interface with clock start/stop, period advancement, timeout buttons, and end game functionality. |
| **ThemeToggle** | `client/src/components/ThemeToggle.tsx` | Dark/light mode toggle button with smooth animation transitions. |
| **Logo** | `client/src/components/Logo.tsx` | Branded GameOps logo with optional tagline display and neon glow effects. |

### Backend Services

| Service | File | Description |
|---------|------|-------------|
| **Storage** | `server/storage.ts` | In-memory storage system for game state management. Provides CRUD operations for games, teams, players, and plays. |
| **Routes** | `server/routes.ts` | RESTful API endpoints for game operations. Handles game creation, updates, player stat recording, and team management. |

### Shared Resources

| Resource | File | Description |
|----------|------|-------------|
| **Schema** | `shared/schema.ts` | TypeScript types and Zod validation schemas for Game, Team, Player, Play, and related data models. Ensures type safety across frontend and backend. |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  GameSetup  │  │  Scoreboard │  │ StatTracker │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │PlayerRoster │  │  BoxScore   │  │ PlayByPlay  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                           │                                      │
│                    State Management                              │
│                    (React useState)                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVER (Express)                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    API Routes                            │   │
│  │  POST /api/games          - Create new game              │   │
│  │  GET  /api/games          - List all games               │   │
│  │  GET  /api/games/:id      - Get game details             │   │
│  │  PUT  /api/games/:id      - Save complete game state     │   │
│  │  PATCH /api/games/:id     - Update game state            │   │
│  │  DELETE /api/games/:id    - Delete game                  │   │
│  │  POST /api/games/:id/plays - Record a play               │   │
│  │  PATCH /api/games/:id/teams/:teamType - Update team      │   │
│  │  PATCH /api/games/:id/teams/:teamType/players/:playerId  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                    ┌──────▼──────┐                              │
│                    │  MemStorage │                              │
│                    │ (In-Memory) │                              │
│                    └─────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SHARED (TypeScript)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Types: Game, Team, Player, Play, SportType, GameRules  │   │
│  │  Schemas: Zod validation for all data models            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, TypeScript | Component-based UI |
| **Styling** | Tailwind CSS, shadcn/ui | Utility-first CSS framework with pre-built components |
| **Animations** | Framer Motion | Smooth transitions and micro-interactions |
| **State** | React useState/useCallback | Local component state management |
| **Routing** | Wouter | Lightweight client-side routing |
| **Backend** | Express.js | RESTful API server |
| **Validation** | Zod | Runtime type validation |
| **Build** | Vite | Fast development server and bundler |

---

## Supported Sports

| Sport | Status | Features |
|-------|--------|----------|
| **Basketball** | Full Support | Complete stat tracking, foul management, timeout tracking |
| **Ice Hockey** | Architecture Ready | Positions and periods configured, stats to be expanded |
| **Football** | Architecture Ready | Positions configured, stats to be expanded |
| **Baseball** | Architecture Ready | Positions configured, stats to be expanded |
| **Volleyball** | Architecture Ready | Positions configured, stats to be expanded |
| **Soccer** | Architecture Ready | Positions configured, stats to be expanded |

---

## User Preferences

- Anime-inspired design (Haikyuu for sports precision, Akira for neo-Tokyo branding)
- Dark mode with instant toggle button (saved to localStorage)
- Clean printable box scores
- Focus on basketball with awareness for hockey and other sports

---

## Recent Changes

- End game now saves to "Games Completed" section for later viewing (January 2026)
- Added game menu with options to start new game or join existing games (January 2026)
- Initial MVP implementation (January 2026)
- Complete game setup wizard with team/player configuration
- Full stat tracking interface with live updates
- Print functionality for box scores

---

## License

This project is proprietary software. All rights reserved.

---

## Authors

- **[Daniel Ribeirinha-Braga](github.com/dbragz)** - Project Creator & Designer
- **Claude (Anthropic)** - AI Development Assistant
