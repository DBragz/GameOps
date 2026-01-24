import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Game, Play } from "@shared/schema";

interface PlayByPlayProps {
  game: Game;
}

export function PlayByPlay({ game }: PlayByPlayProps) {
  const sortedPlays = [...game.plays].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-card-border">
        <h3 className="font-medium text-sm">Play-by-Play</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          <AnimatePresence initial={false}>
            {sortedPlays.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No plays recorded yet
              </div>
            ) : (
              sortedPlays.map((play) => (
                <PlayItem
                  key={play.id}
                  play={play}
                  game={game}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}

interface PlayItemProps {
  play: Play;
  game: Game;
}

function PlayItem({ play, game }: PlayItemProps) {
  const team = play.teamId === game.homeTeam.id ? game.homeTeam : game.awayTeam;

  const getPlayTypeColor = (type: Play["type"]) => {
    switch (type) {
      case "field_goal_2":
      case "field_goal_3":
      case "free_throw":
        return "bg-chart-4";
      case "miss_2":
      case "miss_3":
      case "miss_ft":
        return "bg-muted";
      case "offensive_rebound":
      case "defensive_rebound":
        return "bg-chart-5";
      case "assist":
        return "bg-chart-2";
      case "steal":
      case "block":
        return "bg-chart-3";
      case "turnover":
      case "foul":
        return "bg-destructive/70";
      case "timeout":
        return "bg-muted-foreground";
      case "substitution":
        return "bg-accent";
      default:
        return "bg-muted";
    }
  };

  const getPlayIcon = (type: Play["type"]) => {
    switch (type) {
      case "field_goal_2":
        return "+2";
      case "field_goal_3":
        return "+3";
      case "free_throw":
        return "+1";
      case "miss_2":
      case "miss_3":
      case "miss_ft":
        return "X";
      case "offensive_rebound":
        return "OR";
      case "defensive_rebound":
        return "DR";
      case "assist":
        return "A";
      case "steal":
        return "S";
      case "block":
        return "B";
      case "turnover":
        return "TO";
      case "foul":
        return "PF";
      case "timeout":
        return "TO";
      case "substitution":
        return "SUB";
      default:
        return "•";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-start gap-2 p-2 rounded-md hover-elevate"
    >
      <div className="flex flex-col items-center gap-0.5 min-w-[40px]">
        <span className="text-[10px] text-muted-foreground font-mono">
          Q{play.period}
        </span>
        <span className="text-xs font-mono text-muted-foreground">
          {play.gameTime}
        </span>
      </div>

      <div
        className={`w-6 h-6 rounded-sm flex items-center justify-center text-[10px] font-bold text-white ${getPlayTypeColor(
          play.type
        )}`}
      >
        {getPlayIcon(play.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-sm flex-shrink-0"
            style={{ backgroundColor: team.color }}
          />
          <span className="text-sm truncate">{play.description}</span>
        </div>
        {play.playerName && (
          <span className="text-xs text-muted-foreground">
            {play.playerName}
          </span>
        )}
      </div>
    </motion.div>
  );
}
