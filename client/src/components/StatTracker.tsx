import { motion } from "framer-motion";
import {
  Target,
  Circle,
  Crosshair,
  ArrowUp,
  ArrowDown,
  Handshake,
  Shield,
  Ban,
  RotateCcw,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Player, Team } from "@shared/schema";

type StatType =
  | "field_goal_2"
  | "field_goal_3"
  | "free_throw"
  | "miss_2"
  | "miss_3"
  | "miss_ft"
  | "offensive_rebound"
  | "defensive_rebound"
  | "assist"
  | "steal"
  | "block"
  | "turnover"
  | "foul";

interface StatTrackerProps {
  selectedPlayer: Player | null;
  team: Team | null;
  onRecordStat: (statType: StatType) => void;
  onClearSelection: () => void;
}

const statButtons: {
  type: StatType;
  label: string;
  shortLabel: string;
  icon: typeof Target;
  color: string;
  points?: number;
}[] = [
  {
    type: "field_goal_2",
    label: "2PT Made",
    shortLabel: "2PT",
    icon: Target,
    color: "bg-chart-4",
    points: 2,
  },
  {
    type: "field_goal_3",
    label: "3PT Made",
    shortLabel: "3PT",
    icon: Crosshair,
    color: "bg-chart-2",
    points: 3,
  },
  {
    type: "free_throw",
    label: "FT Made",
    shortLabel: "FT",
    icon: Circle,
    color: "bg-chart-3",
    points: 1,
  },
  {
    type: "miss_2",
    label: "2PT Miss",
    shortLabel: "2M",
    icon: X,
    color: "bg-muted",
  },
  {
    type: "miss_3",
    label: "3PT Miss",
    shortLabel: "3M",
    icon: X,
    color: "bg-muted",
  },
  {
    type: "miss_ft",
    label: "FT Miss",
    shortLabel: "FTM",
    icon: X,
    color: "bg-muted",
  },
  {
    type: "offensive_rebound",
    label: "Off Rebound",
    shortLabel: "OREB",
    icon: ArrowUp,
    color: "bg-chart-1",
  },
  {
    type: "defensive_rebound",
    label: "Def Rebound",
    shortLabel: "DREB",
    icon: ArrowDown,
    color: "bg-chart-5",
  },
  {
    type: "assist",
    label: "Assist",
    shortLabel: "AST",
    icon: Handshake,
    color: "bg-chart-2",
  },
  {
    type: "steal",
    label: "Steal",
    shortLabel: "STL",
    icon: Shield,
    color: "bg-chart-4",
  },
  {
    type: "block",
    label: "Block",
    shortLabel: "BLK",
    icon: Ban,
    color: "bg-chart-3",
  },
  {
    type: "turnover",
    label: "Turnover",
    shortLabel: "TO",
    icon: RotateCcw,
    color: "bg-destructive/70",
  },
  {
    type: "foul",
    label: "Foul",
    shortLabel: "PF",
    icon: AlertCircle,
    color: "bg-destructive",
  },
];

export function StatTracker({
  selectedPlayer,
  team,
  onRecordStat,
  onClearSelection,
}: StatTrackerProps) {
  if (!selectedPlayer || !team) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center h-full bg-card/50">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-muted-foreground">
            Select a Player
          </h3>
          <p className="text-sm text-muted-foreground/70">
            Click on a player from the roster to record stats
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-md flex items-center justify-center font-bold text-lg"
            style={{ backgroundColor: team.color, color: "#fff" }}
          >
            {selectedPlayer.number}
          </div>
          <div>
            <h3 className="font-semibold">{selectedPlayer.name}</h3>
            <p className="text-sm text-muted-foreground">
              {selectedPlayer.position} • {selectedPlayer.stats.points} PTS
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearSelection}
          data-testid="button-clear-selection"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-3 gap-2">
          {statButtons.map((stat) => (
            <StatButton
              key={stat.type}
              stat={stat}
              onClick={() => onRecordStat(stat.type)}
              disabled={stat.type === "foul" && selectedPlayer.fouls >= 5}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-card-border">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <StatMini
            label="FG"
            value={`${selectedPlayer.stats.fieldGoalsMade}/${selectedPlayer.stats.fieldGoalsAttempted}`}
          />
          <StatMini
            label="3PT"
            value={`${selectedPlayer.stats.threePointersMade}/${selectedPlayer.stats.threePointersAttempted}`}
          />
          <StatMini
            label="FT"
            value={`${selectedPlayer.stats.freeThrowsMade}/${selectedPlayer.stats.freeThrowsAttempted}`}
          />
          <StatMini
            label="REB"
            value={
              selectedPlayer.stats.offensiveRebounds +
              selectedPlayer.stats.defensiveRebounds
            }
          />
          <StatMini label="AST" value={selectedPlayer.stats.assists} />
          <StatMini label="STL" value={selectedPlayer.stats.steals} />
          <StatMini label="BLK" value={selectedPlayer.stats.blocks} />
          <StatMini label="TO" value={selectedPlayer.stats.turnovers} />
        </div>
      </div>
    </Card>
  );
}

interface StatButtonProps {
  stat: (typeof statButtons)[0];
  onClick: () => void;
  disabled?: boolean;
}

function StatButton({ stat, onClick, disabled }: StatButtonProps) {
  const Icon = stat.icon;

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        stat-button flex flex-col items-center justify-center gap-1 p-3 rounded-md
        ${stat.color} text-white font-medium
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-transform
      `}
      data-testid={`button-stat-${stat.type}`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs">{stat.shortLabel}</span>
      {stat.points && (
        <span className="text-[10px] opacity-80">+{stat.points}</span>
      )}
    </motion.button>
  );
}

interface StatMiniProps {
  label: string;
  value: string | number;
}

function StatMini({ label, value }: StatMiniProps) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium">{value}</span>
    </div>
  );
}
