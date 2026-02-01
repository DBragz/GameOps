# GameOps

## Overview

GameOps is a professional sports statistics tracking application designed for booth operators. It provides real-time stat tracking with a primary focus on basketball, with architecture supporting future expansion to ice hockey and other sports.

The application enables operators to:
- Create and manage games with configurable rules (high school, college, pro)
- Track player statistics in real-time (points, rebounds, assists, steals, blocks, turnovers, fouls)
- Manage game clock and period progression
- Monitor team timeouts and foul tracking with visual warnings
- Generate print-optimized box scores for official scoresheets
- View play-by-play history for completed games

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React useState for local UI state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode support)
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite with React plugin

The frontend follows a component-based architecture with:
- Page components in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/` (shadcn primitives)
- Feature components in `client/src/components/` (GameSetup, Scoreboard, StatTracker, etc.)
- Custom hooks in `client/src/hooks/`

### Backend Architecture
- **Framework**: Express 5 with TypeScript
- **Runtime**: Node.js with tsx for development
- **API Design**: RESTful JSON API with `/api/` prefix
- **Storage**: In-memory storage (MemStorage class) with interface designed for database migration

Key API endpoints:
- `POST /api/games` - Create new game
- `GET /api/games` - List all games
- `GET /api/games/:id` - Get specific game
- `PUT /api/games/:id` - Update game state
- `DELETE /api/games/:id` - Delete game

### Data Model
Defined in `shared/schema.ts` using Zod for validation:
- **Game**: Contains sport type, rules, teams, plays, clock state, periods
- **Team**: Name, players, score, timeouts, team fouls
- **Player**: Personal info, position, stats object, foul count, on-court status
- **Play**: Timestamped events with type, player, team references

### Development vs Production
- Development: Vite dev server with HMR, proxied through Express
- Production: Static file serving from `dist/public/`, bundled with esbuild

## External Dependencies

### Database
- **Drizzle ORM**: Configured for PostgreSQL in `drizzle.config.ts`
- **Current State**: Using in-memory storage; database schema ready in `shared/schema.ts`
- **Migration Path**: Storage interface (`IStorage`) allows swapping MemStorage for database implementation

### UI Framework
- **Radix UI**: Accessible component primitives (dialog, dropdown, tabs, etc.)
- **shadcn/ui**: Pre-configured component variants with consistent styling
- **Lucide React**: Icon library

### Build & Development
- **Vite**: Frontend bundler with React plugin
- **esbuild**: Server-side bundling for production
- **tsx**: TypeScript execution for development

### Fonts (External CDN)
- Google Fonts: Oxanium (headings), Inter (body), JetBrains Mono (monospace)

### Replit-Specific Plugins
- `@replit/vite-plugin-runtime-error-modal`: Development error overlay
- `@replit/vite-plugin-cartographer`: Development tooling
- `@replit/vite-plugin-dev-banner`: Development banner