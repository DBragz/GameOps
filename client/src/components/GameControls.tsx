import { useState } from "react";
import {
  Clock,
  Pause,
  Play,
  SkipForward,
  Timer,
  RotateCcw,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import type { Game } from "@shared/schema";

interface GameControlsProps {
  game: Game;
  onToggleClock: () => void;
  onNextPeriod: () => void;
  onTimeout: (team: "home" | "away") => void;
  onResetClock: () => void;
  onEndGame: () => void;
}

export function GameControls({
  game,
  onToggleClock,
  onNextPeriod,
  onTimeout,
  onResetClock,
  onEndGame,
}: GameControlsProps) {
  const [showEndDialog, setShowEndDialog] = useState(false);

  const getPeriodLabel = () => {
    if (game.sport === "basketball") {
      return game.currentPeriod <= 4 ? "Quarter" : "Overtime";
    }
    return "Period";
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant={game.isClockRunning ? "destructive" : "default"}
        onClick={onToggleClock}
        data-testid="button-game-clock-toggle"
      >
        {game.isClockRunning ? (
          <>
            <Pause className="w-4 h-4 mr-2" />
            Stop Clock
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Start Clock
          </>
        )}
      </Button>

      <Button
        variant="outline"
        onClick={onResetClock}
        data-testid="button-reset-period-clock"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset
      </Button>

      <Button
        variant="outline"
        onClick={onNextPeriod}
        disabled={game.currentPeriod >= game.totalPeriods + 3}
        data-testid="button-next-period"
      >
        <SkipForward className="w-4 h-4 mr-2" />
        Next {getPeriodLabel()}
      </Button>

      <div className="h-6 w-px bg-border mx-2" />

      <Button
        variant="secondary"
        onClick={() => onTimeout("away")}
        disabled={game.awayTeam.timeoutsRemaining <= 0}
        data-testid="button-timeout-away"
      >
        <Timer className="w-4 h-4 mr-2" />
        {game.awayTeam.abbreviation} TO
      </Button>

      <Button
        variant="secondary"
        onClick={() => onTimeout("home")}
        disabled={game.homeTeam.timeoutsRemaining <= 0}
        data-testid="button-timeout-home"
      >
        <Timer className="w-4 h-4 mr-2" />
        {game.homeTeam.abbreviation} TO
      </Button>

      <div className="h-6 w-px bg-border mx-2" />

      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" data-testid="button-end-game">
            <Flag className="w-4 h-4 mr-2" />
            End Game
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Game?</DialogTitle>
            <DialogDescription>
              Are you sure you want to end this game? You can view and print the
              final box score afterwards.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                onEndGame();
                setShowEndDialog(false);
              }}
              data-testid="button-confirm-end-game"
            >
              End Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
