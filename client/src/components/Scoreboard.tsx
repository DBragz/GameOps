import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Clock, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Game } from "@shared/schema";

interface ScoreboardProps {
  game: Game;
  onToggleClock: () => void;
  onResetClock: () => void;
  onTogglePossession: () => void;
}

export function Scoreboard({
  game,
  onToggleClock,
  onResetClock,
  onTogglePossession,
}: ScoreboardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getPeriodLabel = () => {
    if (game.sport === "basketball") {
      if (game.currentPeriod <= 4) {
        return `Q${game.currentPeriod}`;
      }
      return `OT${game.currentPeriod - 4}`;
    }
    return `P${game.currentPeriod}`;
  };

  return (
    <div className="bg-card border border-card-border rounded-md overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />
        
        <div className="relative grid grid-cols-3 gap-4 p-4">
          <TeamScore
            team={game.awayTeam}
            isHome={false}
            hasPossession={game.possession === "away"}
            onPossessionClick={onTogglePossession}
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {getPeriodLabel()}
              </span>
            </div>
            
            <motion.div
              className="font-mono text-4xl font-bold tracking-tight tabular-nums"
              animate={{
                color: game.isClockRunning
                  ? "hsl(var(--foreground))"
                  : "hsl(var(--muted-foreground))",
              }}
            >
              {formatTime(game.gameClockSeconds)}
            </motion.div>

            <div className="flex items-center gap-1 no-print">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleClock}
                data-testid="button-toggle-clock"
                className="h-8 w-8"
              >
                {game.isClockRunning ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onResetClock}
                data-testid="button-reset-clock"
                className="h-8 w-8"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TeamScore
            team={game.homeTeam}
            isHome={true}
            hasPossession={game.possession === "home"}
            onPossessionClick={onTogglePossession}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-t border-card-border">
        <TimeoutDisplay
          label={game.awayTeam.abbreviation}
          remaining={game.awayTeam.timeoutsRemaining}
          total={game.rules === "pro" ? 7 : 5}
        />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Team Fouls: {game.awayTeam.teamFouls} - {game.homeTeam.teamFouls}</span>
        </div>
        <TimeoutDisplay
          label={game.homeTeam.abbreviation}
          remaining={game.homeTeam.timeoutsRemaining}
          total={game.rules === "pro" ? 7 : 5}
        />
      </div>
    </div>
  );
}

interface TeamScoreProps {
  team: Game["homeTeam"];
  isHome: boolean;
  hasPossession: boolean;
  onPossessionClick: () => void;
}

function TeamScore({ team, isHome, hasPossession, onPossessionClick }: TeamScoreProps) {
  return (
    <div
      className={`flex items-center gap-3 ${isHome ? "flex-row-reverse" : ""}`}
    >
      <button
        onClick={onPossessionClick}
        className="flex flex-col items-center gap-1 hover-elevate rounded-md p-2 transition-colors"
        data-testid={`button-possession-${isHome ? "home" : "away"}`}
      >
        <div
          className="w-12 h-12 rounded-md flex items-center justify-center text-lg font-bold"
          style={{ backgroundColor: team.color, color: "#fff" }}
        >
          {team.abbreviation}
        </div>
        <span className="text-sm font-medium truncate max-w-[100px]">
          {team.name}
        </span>
      </button>

      <div className="flex items-center gap-2">
        <AnimatePresence>
          {hasPossession && (
            <motion.div
              initial={{ opacity: 0, x: isHome ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isHome ? 10 : -10 }}
              className={`possession-indicator ${isHome ? "rotate-180" : ""}`}
            >
              <ChevronRight className="h-6 w-6 text-primary" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.span
          key={team.score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-5xl font-bold tabular-nums"
          data-testid={`text-score-${isHome ? "home" : "away"}`}
        >
          {team.score}
        </motion.span>
      </div>
    </div>
  );
}

interface TimeoutDisplayProps {
  label: string;
  remaining: number;
  total: number;
}

function TimeoutDisplay({ label, remaining, total }: TimeoutDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label} TO:</span>
      <div className="flex gap-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i < remaining ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
