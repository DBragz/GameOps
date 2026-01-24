import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, UserMinus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Player, Team } from "@shared/schema";

interface PlayerRosterProps {
  team: Team;
  selectedPlayerId: string | null;
  onSelectPlayer: (playerId: string | null) => void;
  onToggleOnCourt: (playerId: string) => void;
  maxOnCourt?: number;
}

export function PlayerRoster({
  team,
  selectedPlayerId,
  onSelectPlayer,
  onToggleOnCourt,
  maxOnCourt = 5,
}: PlayerRosterProps) {
  const onCourtPlayers = team.players.filter((p) => p.isOnCourt);
  const benchPlayers = team.players.filter((p) => !p.isOnCourt);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-card-border">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: team.color }}
          />
          <span className="font-medium text-sm">{team.name}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {onCourtPlayers.length}/{maxOnCourt}
        </Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-3">
          <div>
            <div className="flex items-center gap-2 px-2 py-1 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-chart-4" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                On Court
              </span>
            </div>
            <div className="space-y-1">
              <AnimatePresence mode="popLayout">
                {onCourtPlayers.map((player) => (
                  <PlayerRow
                    key={player.id}
                    player={player}
                    teamColor={team.color}
                    isSelected={selectedPlayerId === player.id}
                    onSelect={() =>
                      onSelectPlayer(
                        selectedPlayerId === player.id ? null : player.id
                      )
                    }
                    onToggleOnCourt={() => onToggleOnCourt(player.id)}
                    isOnCourt={true}
                  />
                ))}
              </AnimatePresence>
              {onCourtPlayers.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-2">
                  No players on court
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 px-2 py-1 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Bench
              </span>
            </div>
            <div className="space-y-1">
              <AnimatePresence mode="popLayout">
                {benchPlayers.map((player) => (
                  <PlayerRow
                    key={player.id}
                    player={player}
                    teamColor={team.color}
                    isSelected={selectedPlayerId === player.id}
                    onSelect={() =>
                      onSelectPlayer(
                        selectedPlayerId === player.id ? null : player.id
                      )
                    }
                    onToggleOnCourt={() => onToggleOnCourt(player.id)}
                    isOnCourt={false}
                    disabled={onCourtPlayers.length >= maxOnCourt}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

interface PlayerRowProps {
  player: Player;
  teamColor: string;
  isSelected: boolean;
  onSelect: () => void;
  onToggleOnCourt: () => void;
  isOnCourt: boolean;
  disabled?: boolean;
}

function PlayerRow({
  player,
  teamColor,
  isSelected,
  onSelect,
  onToggleOnCourt,
  isOnCourt,
  disabled,
}: PlayerRowProps) {
  const foulWarning = player.fouls >= 4;
  const fouledOut = player.fouls >= 5;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`
        flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors
        ${isSelected ? "bg-primary/10 ring-1 ring-primary/30" : "hover-elevate"}
        ${fouledOut ? "opacity-50" : ""}
        ${foulWarning && !fouledOut ? "foul-warning" : ""}
      `}
      onClick={onSelect}
      data-testid={`player-row-${player.id}`}
    >
      <div
        className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm"
        style={{ backgroundColor: teamColor, color: "#fff" }}
      >
        {player.number}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-sm truncate">{player.name}</span>
          {foulWarning && (
            <AlertTriangle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{player.position}</span>
          <span className="tabular-nums">{player.stats.points} PTS</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Badge
          variant={player.fouls >= 4 ? "destructive" : "secondary"}
          className="text-xs px-1.5"
        >
          {player.fouls}F
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 no-print"
          onClick={(e) => {
            e.stopPropagation();
            onToggleOnCourt();
          }}
          disabled={disabled && !isOnCourt}
          data-testid={`button-toggle-court-${player.id}`}
        >
          {isOnCourt ? (
            <UserMinus className="h-3.5 w-3.5" />
          ) : (
            <UserPlus className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </motion.div>
  );
}
