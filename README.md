# GameOps

**Built for the booth. Trusted by the game.**

A professional sports statistics tracking application designed for booth operators. GameOps provides real-time stat tracking with a primary focus on basketball, with architecture supporting ice hockey and other sports.

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

## Application Components

### Frontend Components

| Component | File | Description |
|-----------|------|-------------|
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

### Design Philosophy

- **Haikyuu-Inspired Light Mode**: Clean whites, bold line accents, sharp geometric borders, and sports precision aesthetics
- **Akira Neo-Tokyo Dark Mode**: Deep blacks, crimson red accents, neon glow effects, and industrial typography
- **Booth-First UX**: Quick-entry stat buttons, large touch targets, high-contrast displays for varied lighting conditions

---

## Supported Sports

| Sport | Status | Features |
|-------|--------|----------|
| **Basketball** | ✅ Full Support | Complete stat tracking, foul management, timeout tracking |
| **Ice Hockey** | 🔧 Architecture Ready | Positions and periods configured, stats to be expanded |
| **Football** | 🔧 Architecture Ready | Positions configured, stats to be expanded |
| **Baseball** | 🔧 Architecture Ready | Positions configured, stats to be expanded |
| **Volleyball** | 🔧 Architecture Ready | Positions configured, stats to be expanded |
| **Soccer** | 🔧 Architecture Ready | Positions configured, stats to be expanded |

---

## License

This project is proprietary software. All rights reserved.

---

## Authors

| Name | Role | Contribution |
|------|------|--------------|
| **You** | Project Owner & Designer | Vision, requirements, design direction (Haikyuu/Akira aesthetic), feature specifications |
| **Claude (Anthropic)** | AI Development Partner | Architecture design, implementation, code generation, documentation |
