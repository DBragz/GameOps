import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ChevronRight, Users, Settings, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "./Logo";
import type { SportType, GameRules, InsertPlayer } from "@shared/schema";

interface TeamSetup {
  name: string;
  abbreviation: string;
  color: string;
  players: InsertPlayer[];
}

interface GameSetupProps {
  onStartGame: (config: {
    sport: SportType;
    rules: GameRules;
    homeTeam: TeamSetup;
    awayTeam: TeamSetup;
    periodLength: number;
    totalPeriods: number;
  }) => void;
}

const defaultColors = [
  "#E53935", "#D81B60", "#8E24AA", "#5E35B1",
  "#3949AB", "#1E88E5", "#039BE5", "#00ACC1",
  "#00897B", "#43A047", "#7CB342", "#C0CA33",
  "#FDD835", "#FFB300", "#FB8C00", "#F4511E",
];

const positions = {
  basketball: ["PG", "SG", "SF", "PF", "C"],
  hockey: ["C", "LW", "RW", "D", "G"],
  football: ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "CB", "S", "K"],
  baseball: ["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH"],
  volleyball: ["S", "OH", "MB", "OPP", "L"],
  soccer: ["GK", "CB", "FB", "CM", "AM", "W", "ST"],
};

export function GameSetup({ onStartGame }: GameSetupProps) {
  const [step, setStep] = useState(1);
  const [sport, setSport] = useState<SportType>("basketball");
  const [rules, setRules] = useState<GameRules>("high_school");
  const [periodLength, setPeriodLength] = useState(8);
  const [totalPeriods, setTotalPeriods] = useState(4);

  const [homeTeam, setHomeTeam] = useState<TeamSetup>({
    name: "",
    abbreviation: "",
    color: "#1E88E5",
    players: [],
  });

  const [awayTeam, setAwayTeam] = useState<TeamSetup>({
    name: "",
    abbreviation: "",
    color: "#E53935",
    players: [],
  });

  const handleSportChange = (newSport: SportType) => {
    setSport(newSport);
    if (newSport === "basketball") {
      setTotalPeriods(4);
      setPeriodLength(rules === "pro" ? 12 : 8);
    } else if (newSport === "hockey") {
      setTotalPeriods(3);
      setPeriodLength(20);
    }
  };

  const handleRulesChange = (newRules: GameRules) => {
    setRules(newRules);
    if (sport === "basketball") {
      setPeriodLength(newRules === "pro" ? 12 : newRules === "college" ? 20 : 8);
      setTotalPeriods(newRules === "college" ? 2 : 4);
    }
  };

  const addPlayer = (team: "home" | "away") => {
    const newPlayer: InsertPlayer = {
      name: "",
      number: 0,
      position: positions[sport][0],
      isActive: true,
    };

    if (team === "home") {
      setHomeTeam({ ...homeTeam, players: [...homeTeam.players, newPlayer] });
    } else {
      setAwayTeam({ ...awayTeam, players: [...awayTeam.players, newPlayer] });
    }
  };

  const updatePlayer = (
    team: "home" | "away",
    index: number,
    updates: Partial<InsertPlayer>
  ) => {
    if (team === "home") {
      const players = [...homeTeam.players];
      players[index] = { ...players[index], ...updates };
      setHomeTeam({ ...homeTeam, players });
    } else {
      const players = [...awayTeam.players];
      players[index] = { ...players[index], ...updates };
      setAwayTeam({ ...awayTeam, players });
    }
  };

  const removePlayer = (team: "home" | "away", index: number) => {
    if (team === "home") {
      setHomeTeam({
        ...homeTeam,
        players: homeTeam.players.filter((_, i) => i !== index),
      });
    } else {
      setAwayTeam({
        ...awayTeam,
        players: awayTeam.players.filter((_, i) => i !== index),
      });
    }
  };

  const canProceedToStep2 = sport && rules;
  const canProceedToStep3 =
    awayTeam.name &&
    awayTeam.abbreviation &&
    awayTeam.players.length >= 5 &&
    awayTeam.players.every((p) => p.name && p.number >= 0);
  const canStart =
    homeTeam.name &&
    homeTeam.abbreviation &&
    homeTeam.players.length >= 5 &&
    homeTeam.players.every((p) => p.name && p.number >= 0);

  const handleStart = () => {
    onStartGame({
      sport,
      rules,
      homeTeam,
      awayTeam,
      periodLength,
      totalPeriods,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-6 py-4">
        <Logo size="md" showTagline />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    step === s
                      ? "bg-primary text-primary-foreground"
                      : step > s
                      ? "bg-chart-4 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>
                {s < 3 && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <StepCard
                key="step1"
                title="Game Settings"
                icon={Settings}
                description="Configure the sport and rules for this game"
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Sport</Label>
                      <Select
                        value={sport}
                        onValueChange={(v) => handleSportChange(v as SportType)}
                      >
                        <SelectTrigger data-testid="select-sport">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basketball">Basketball</SelectItem>
                          <SelectItem value="hockey">Ice Hockey</SelectItem>
                          <SelectItem value="football">Football</SelectItem>
                          <SelectItem value="baseball">Baseball</SelectItem>
                          <SelectItem value="volleyball">Volleyball</SelectItem>
                          <SelectItem value="soccer">Soccer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Rules</Label>
                      <Select
                        value={rules}
                        onValueChange={(v) => handleRulesChange(v as GameRules)}
                      >
                        <SelectTrigger data-testid="select-rules">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high_school">High School</SelectItem>
                          <SelectItem value="college">College</SelectItem>
                          <SelectItem value="pro">Professional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Period Length (minutes)</Label>
                      <Input
                        type="number"
                        value={periodLength}
                        onChange={(e) =>
                          setPeriodLength(parseInt(e.target.value) || 8)
                        }
                        min={1}
                        max={30}
                        data-testid="input-period-length"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Periods</Label>
                      <Input
                        type="number"
                        value={totalPeriods}
                        onChange={(e) =>
                          setTotalPeriods(parseInt(e.target.value) || 4)
                        }
                        min={1}
                        max={9}
                        data-testid="input-total-periods"
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    disabled={!canProceedToStep2}
                    onClick={() => setStep(2)}
                    data-testid="button-next-step1"
                  >
                    Continue to Away Team
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </StepCard>
            )}

            {step === 2 && (
              <StepCard
                key="step2"
                title="Away Team"
                icon={Users}
                description="Set up the visiting team roster"
              >
                <TeamSetupForm
                  team={awayTeam}
                  onTeamChange={setAwayTeam}
                  positions={positions[sport]}
                  defaultColors={defaultColors}
                  onAddPlayer={() => addPlayer("away")}
                  onUpdatePlayer={(i, u) => updatePlayer("away", i, u)}
                  onRemovePlayer={(i) => removePlayer("away", i)}
                  testIdPrefix="away"
                />

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    data-testid="button-back-step2"
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={!canProceedToStep3}
                    onClick={() => setStep(3)}
                    data-testid="button-next-step2"
                  >
                    Continue to Home Team
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </StepCard>
            )}

            {step === 3 && (
              <StepCard
                key="step3"
                title="Home Team"
                icon={Users}
                description="Set up the home team roster"
              >
                <TeamSetupForm
                  team={homeTeam}
                  onTeamChange={setHomeTeam}
                  positions={positions[sport]}
                  defaultColors={defaultColors}
                  onAddPlayer={() => addPlayer("home")}
                  onUpdatePlayer={(i, u) => updatePlayer("home", i, u)}
                  onRemovePlayer={(i) => removePlayer("home", i)}
                  testIdPrefix="home"
                />

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    data-testid="button-back-step3"
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={!canStart}
                    onClick={handleStart}
                    data-testid="button-start-game"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Game
                  </Button>
                </div>
              </StepCard>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface StepCardProps {
  title: string;
  description: string;
  icon: typeof Settings;
  children: React.ReactNode;
}

function StepCard({ title, description, icon: Icon, children }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {children}
      </Card>
    </motion.div>
  );
}

interface TeamSetupFormProps {
  team: TeamSetup;
  onTeamChange: (team: TeamSetup) => void;
  positions: string[];
  defaultColors: string[];
  onAddPlayer: () => void;
  onUpdatePlayer: (index: number, updates: Partial<InsertPlayer>) => void;
  onRemovePlayer: (index: number) => void;
  testIdPrefix: string;
}

function TeamSetupForm({
  team,
  onTeamChange,
  positions,
  defaultColors,
  onAddPlayer,
  onUpdatePlayer,
  onRemovePlayer,
  testIdPrefix,
}: TeamSetupFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-2">
          <Label>Team Name</Label>
          <Input
            value={team.name}
            onChange={(e) => onTeamChange({ ...team, name: e.target.value })}
            placeholder="Eagles"
            data-testid={`input-${testIdPrefix}-name`}
          />
        </div>
        <div className="space-y-2">
          <Label>Abbreviation</Label>
          <Input
            value={team.abbreviation}
            onChange={(e) =>
              onTeamChange({
                ...team,
                abbreviation: e.target.value.toUpperCase().slice(0, 4),
              })
            }
            placeholder="EGL"
            maxLength={4}
            data-testid={`input-${testIdPrefix}-abbr`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Team Color</Label>
        <div className="flex flex-wrap gap-2">
          {defaultColors.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-md transition-transform ${
                team.color === color ? "ring-2 ring-primary ring-offset-2 scale-110" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onTeamChange({ ...team, color })}
              data-testid={`button-color-${testIdPrefix}-${color}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Players ({team.players.length})</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddPlayer}
            data-testid={`button-add-player-${testIdPrefix}`}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Player
          </Button>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          <AnimatePresence initial={false}>
            {team.players.map((player, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-2 bg-muted/30 rounded-md"
              >
                <Input
                  className="w-16"
                  type="number"
                  placeholder="#"
                  value={player.number || ""}
                  onChange={(e) =>
                    onUpdatePlayer(index, {
                      number: parseInt(e.target.value) || 0,
                    })
                  }
                  min={0}
                  max={99}
                  data-testid={`input-player-number-${testIdPrefix}-${index}`}
                />
                <Input
                  className="flex-1"
                  placeholder="Player Name"
                  value={player.name}
                  onChange={(e) =>
                    onUpdatePlayer(index, { name: e.target.value })
                  }
                  data-testid={`input-player-name-${testIdPrefix}-${index}`}
                />
                <Select
                  value={player.position}
                  onValueChange={(v) => onUpdatePlayer(index, { position: v })}
                >
                  <SelectTrigger
                    className="w-20"
                    data-testid={`select-player-position-${testIdPrefix}-${index}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemovePlayer(index)}
                  data-testid={`button-remove-player-${testIdPrefix}-${index}`}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>

          {team.players.length === 0 && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Add at least 5 players to continue
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
