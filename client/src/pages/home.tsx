import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Scoreboard } from "@/components/Scoreboard";
import { PlayerRoster } from "@/components/PlayerRoster";
import { StatTracker } from "@/components/StatTracker";
import { BoxScore } from "@/components/BoxScore";
import { PlayByPlay } from "@/components/PlayByPlay";
import { GameSetup } from "@/components/GameSetup";
import { GameControls } from "@/components/GameControls";
import { GameMenu } from "@/components/GameMenu";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Game, Player, Play, SportType, GameRules } from "@shared/schema";

type ViewState = "menu" | "setup" | "game" | "view";

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function createDefaultStats() {
  return {
    points: 0,
    fieldGoalsMade: 0,
    fieldGoalsAttempted: 0,
    threePointersMade: 0,
    threePointersAttempted: 0,
    freeThrowsMade: 0,
    freeThrowsAttempted: 0,
    offensiveRebounds: 0,
    defensiveRebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
  };
}

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>("menu");
  const [game, setGame] = useState<Game | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<"home" | "away" | null>(null);
  const [activeTab, setActiveTab] = useState("tracker");
  const clockInterval = useRef<NodeJS.Timeout | null>(null);

  const handleStartGame = useCallback(
    (config: {
      sport: SportType;
      rules: GameRules;
      homeTeam: {
        name: string;
        abbreviation: string;
        color: string;
        players: { name: string; number: number; position: string; isActive: boolean }[];
      };
      awayTeam: {
        name: string;
        abbreviation: string;
        color: string;
        players: { name: string; number: number; position: string; isActive: boolean }[];
      };
      periodLength: number;
      totalPeriods: number;
    }) => {
      const homeTeamId = generateId();
      const awayTeamId = generateId();

      const newGame: Game = {
        id: generateId(),
        sport: config.sport,
        rules: config.rules,
        status: "active",
        homeTeam: {
          id: homeTeamId,
          name: config.homeTeam.name,
          abbreviation: config.homeTeam.abbreviation,
          color: config.homeTeam.color,
          players: config.homeTeam.players.map((p, i) => ({
            id: generateId(),
            name: p.name,
            number: p.number,
            position: p.position,
            isActive: p.isActive,
            isOnCourt: i < 5,
            fouls: 0,
            stats: createDefaultStats(),
          })),
          timeoutsRemaining: config.rules === "pro" ? 7 : 5,
          teamFouls: 0,
          score: 0,
        },
        awayTeam: {
          id: awayTeamId,
          name: config.awayTeam.name,
          abbreviation: config.awayTeam.abbreviation,
          color: config.awayTeam.color,
          players: config.awayTeam.players.map((p, i) => ({
            id: generateId(),
            name: p.name,
            number: p.number,
            position: p.position,
            isActive: p.isActive,
            isOnCourt: i < 5,
            fouls: 0,
            stats: createDefaultStats(),
          })),
          timeoutsRemaining: config.rules === "pro" ? 7 : 5,
          teamFouls: 0,
          score: 0,
        },
        currentPeriod: 1,
        periodLength: config.periodLength,
        totalPeriods: config.totalPeriods,
        gameClockSeconds: config.periodLength * 60,
        isClockRunning: false,
        possession: undefined,
        plays: [],
        createdAt: Date.now(),
      };

      setGame(newGame);
      setViewState("game");
    },
    []
  );

  const handleJoinGame = useCallback((joinedGame: Game) => {
    setGame(joinedGame);
    setViewState("game");
  }, []);

  const handleViewGame = useCallback((viewedGame: Game) => {
    setGame(viewedGame);
    setActiveTab("boxscore");
    setViewState("view");
  }, []);

  const handleBackToMenu = useCallback(() => {
    setGame(null);
    setSelectedPlayerId(null);
    setSelectedTeam(null);
    setActiveTab("tracker");
    setViewState("menu");
  }, []);

  useEffect(() => {
    if (game?.isClockRunning && game.gameClockSeconds > 0) {
      clockInterval.current = setInterval(() => {
        setGame((prev) => {
          if (!prev || !prev.isClockRunning || prev.gameClockSeconds <= 0) {
            return prev;
          }
          return { ...prev, gameClockSeconds: prev.gameClockSeconds - 1 };
        });
      }, 1000);
    } else if (clockInterval.current) {
      clearInterval(clockInterval.current);
      clockInterval.current = null;
    }

    return () => {
      if (clockInterval.current) {
        clearInterval(clockInterval.current);
      }
    };
  }, [game?.isClockRunning, game?.gameClockSeconds]);

  const toggleClock = useCallback(() => {
    setGame((prev) => {
      if (!prev) return prev;
      return { ...prev, isClockRunning: !prev.isClockRunning };
    });
  }, []);

  const resetClock = useCallback(() => {
    setGame((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        gameClockSeconds: prev.periodLength * 60,
        isClockRunning: false,
      };
    });
  }, []);

  const togglePossession = useCallback(() => {
    setGame((prev) => {
      if (!prev) return prev;
      const newPossession =
        prev.possession === "home"
          ? "away"
          : prev.possession === "away"
          ? undefined
          : "home";
      return { ...prev, possession: newPossession };
    });
  }, []);

  const nextPeriod = useCallback(() => {
    setGame((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentPeriod: prev.currentPeriod + 1,
        gameClockSeconds: prev.periodLength * 60,
        isClockRunning: false,
        homeTeam: { ...prev.homeTeam, teamFouls: 0 },
        awayTeam: { ...prev.awayTeam, teamFouls: 0 },
      };
    });
  }, []);

  const callTimeout = useCallback((team: "home" | "away") => {
    setGame((prev) => {
      if (!prev) return prev;
      const teamKey = team === "home" ? "homeTeam" : "awayTeam";
      if (prev[teamKey].timeoutsRemaining <= 0) return prev;

      const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
      };

      const play: Play = {
        id: generateId(),
        timestamp: Date.now(),
        period: prev.currentPeriod,
        gameTime: formatTime(prev.gameClockSeconds),
        teamId: prev[teamKey].id,
        type: "timeout",
        description: `${prev[teamKey].abbreviation} timeout`,
      };

      return {
        ...prev,
        isClockRunning: false,
        [teamKey]: {
          ...prev[teamKey],
          timeoutsRemaining: prev[teamKey].timeoutsRemaining - 1,
        },
        plays: [...prev.plays, play],
      };
    });
  }, []);

  const endGame = useCallback(async () => {
    if (!game) return;
    
    const completedGame = { ...game, status: "completed" as const, isClockRunning: false };
    
    try {
      await apiRequest("POST", "/api/games", completedGame);
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
    } catch (error) {
      console.error("Failed to save completed game:", error);
    }
    
    setGame(null);
    setSelectedPlayerId(null);
    setSelectedTeam(null);
    setActiveTab("tracker");
    setViewState("menu");
  }, [game]);

  const togglePlayerOnCourt = useCallback(
    (playerId: string, team: "home" | "away") => {
      setGame((prev) => {
        if (!prev) return prev;
        const teamKey = team === "home" ? "homeTeam" : "awayTeam";
        const players = prev[teamKey].players.map((p) =>
          p.id === playerId ? { ...p, isOnCourt: !p.isOnCourt } : p
        );
        return { ...prev, [teamKey]: { ...prev[teamKey], players } };
      });
    },
    []
  );

  const recordStat = useCallback(
    (
      statType:
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
        | "foul"
    ) => {
      if (!selectedPlayerId || !selectedTeam || !game) return;

      setGame((prev) => {
        if (!prev) return prev;

        const teamKey = selectedTeam === "home" ? "homeTeam" : "awayTeam";
        const team = prev[teamKey];
        const playerIndex = team.players.findIndex(
          (p) => p.id === selectedPlayerId
        );
        if (playerIndex === -1) return prev;

        const player = team.players[playerIndex];
        const updatedStats = { ...player.stats };
        let points = 0;
        let fouls = player.fouls;
        let teamFouls = team.teamFouls;
        let description = "";

        switch (statType) {
          case "field_goal_2":
            updatedStats.fieldGoalsMade += 1;
            updatedStats.fieldGoalsAttempted += 1;
            updatedStats.points += 2;
            points = 2;
            description = `${player.name} 2PT made`;
            break;
          case "field_goal_3":
            updatedStats.threePointersMade += 1;
            updatedStats.threePointersAttempted += 1;
            updatedStats.fieldGoalsMade += 1;
            updatedStats.fieldGoalsAttempted += 1;
            updatedStats.points += 3;
            points = 3;
            description = `${player.name} 3PT made`;
            break;
          case "free_throw":
            updatedStats.freeThrowsMade += 1;
            updatedStats.freeThrowsAttempted += 1;
            updatedStats.points += 1;
            points = 1;
            description = `${player.name} FT made`;
            break;
          case "miss_2":
            updatedStats.fieldGoalsAttempted += 1;
            description = `${player.name} 2PT missed`;
            break;
          case "miss_3":
            updatedStats.threePointersAttempted += 1;
            updatedStats.fieldGoalsAttempted += 1;
            description = `${player.name} 3PT missed`;
            break;
          case "miss_ft":
            updatedStats.freeThrowsAttempted += 1;
            description = `${player.name} FT missed`;
            break;
          case "offensive_rebound":
            updatedStats.offensiveRebounds += 1;
            description = `${player.name} offensive rebound`;
            break;
          case "defensive_rebound":
            updatedStats.defensiveRebounds += 1;
            description = `${player.name} defensive rebound`;
            break;
          case "assist":
            updatedStats.assists += 1;
            description = `${player.name} assist`;
            break;
          case "steal":
            updatedStats.steals += 1;
            description = `${player.name} steal`;
            break;
          case "block":
            updatedStats.blocks += 1;
            description = `${player.name} block`;
            break;
          case "turnover":
            updatedStats.turnovers += 1;
            description = `${player.name} turnover`;
            break;
          case "foul":
            fouls += 1;
            teamFouls += 1;
            description = `${player.name} personal foul (${fouls})`;
            break;
        }

        const formatTime = (seconds: number) => {
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return `${mins}:${secs.toString().padStart(2, "0")}`;
        };

        const play: Play = {
          id: generateId(),
          timestamp: Date.now(),
          period: prev.currentPeriod,
          gameTime: formatTime(prev.gameClockSeconds),
          playerId: player.id,
          playerName: player.name,
          teamId: team.id,
          type: statType,
          description,
        };

        const updatedPlayers = [...team.players];
        updatedPlayers[playerIndex] = {
          ...player,
          stats: updatedStats,
          fouls,
        };

        return {
          ...prev,
          [teamKey]: {
            ...team,
            players: updatedPlayers,
            score: team.score + points,
            teamFouls,
          },
          plays: [...prev.plays, play],
        };
      });
    },
    [selectedPlayerId, selectedTeam, game]
  );

  const handleSelectPlayer = useCallback(
    (playerId: string | null, team: "home" | "away") => {
      if (playerId === selectedPlayerId) {
        setSelectedPlayerId(null);
        setSelectedTeam(null);
      } else {
        setSelectedPlayerId(playerId);
        setSelectedTeam(team);
      }
    },
    [selectedPlayerId]
  );

  const selectedPlayer =
    game && selectedPlayerId && selectedTeam
      ? (selectedTeam === "home" ? game.homeTeam : game.awayTeam).players.find(
          (p) => p.id === selectedPlayerId
        ) || null
      : null;

  const selectedTeamData =
    game && selectedTeam
      ? selectedTeam === "home"
        ? game.homeTeam
        : game.awayTeam
      : null;

  if (viewState === "menu") {
    return (
      <GameMenu
        onStartNew={() => setViewState("setup")}
        onJoinGame={handleJoinGame}
        onViewGame={handleViewGame}
      />
    );
  }

  if (viewState === "setup") {
    return <GameSetup onStartGame={handleStartGame} />;
  }

  if (viewState === "view" && game) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center justify-between px-4 py-2">
            <Logo size="sm" />
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleBackToMenu} data-testid="button-back-to-menu">
                Back to Menu
              </Button>
              <div className="h-6 w-px bg-border mx-2" />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 space-y-4">
          <div className="text-center py-2">
            <span className="text-lg font-heading font-semibold text-green-500">FINAL</span>
            <span className="mx-2 text-muted-foreground">|</span>
            <span className="font-mono text-xl font-bold">
              {game.awayTeam.abbreviation} {game.awayTeam.score} - {game.homeTeam.score} {game.homeTeam.abbreviation}
            </span>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="boxscore" data-testid="tab-boxscore">
                Box Score
              </TabsTrigger>
              <TabsTrigger value="plays" data-testid="tab-plays">
                Play-by-Play
              </TabsTrigger>
            </TabsList>

            <TabsContent value="boxscore" className="mt-0">
              <BoxScore game={game} />
            </TabsContent>

            <TabsContent value="plays" className="mt-0">
              <Card className="h-[500px] overflow-hidden">
                <PlayByPlay game={game} />
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }

  if (!game) {
    return (
      <GameMenu
        onStartNew={() => setViewState("setup")}
        onJoinGame={handleJoinGame}
        onViewGame={handleViewGame}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex items-center justify-between px-4 py-2">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <GameControls
              game={game}
              onToggleClock={toggleClock}
              onNextPeriod={nextPeriod}
              onTimeout={callTimeout}
              onResetClock={resetClock}
              onEndGame={endGame}
            />
            <div className="h-6 w-px bg-border mx-2" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4">
        <Scoreboard
          game={game}
          onToggleClock={toggleClock}
          onResetClock={resetClock}
          onTogglePossession={togglePossession}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="tracker" data-testid="tab-tracker">
              Stat Tracker
            </TabsTrigger>
            <TabsTrigger value="boxscore" data-testid="tab-boxscore">
              Box Score
            </TabsTrigger>
            <TabsTrigger value="plays" data-testid="tab-plays">
              Play-by-Play
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracker" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <Card className="lg:col-span-1 overflow-hidden">
                <PlayerRoster
                  team={game.awayTeam}
                  selectedPlayerId={
                    selectedTeam === "away" ? selectedPlayerId : null
                  }
                  onSelectPlayer={(id) => handleSelectPlayer(id, "away")}
                  onToggleOnCourt={(id) => togglePlayerOnCourt(id, "away")}
                />
              </Card>

              <div className="lg:col-span-2">
                <StatTracker
                  selectedPlayer={selectedPlayer}
                  team={selectedTeamData}
                  onRecordStat={recordStat}
                  onClearSelection={() => {
                    setSelectedPlayerId(null);
                    setSelectedTeam(null);
                  }}
                />
              </div>

              <Card className="lg:col-span-1 overflow-hidden">
                <PlayerRoster
                  team={game.homeTeam}
                  selectedPlayerId={
                    selectedTeam === "home" ? selectedPlayerId : null
                  }
                  onSelectPlayer={(id) => handleSelectPlayer(id, "home")}
                  onToggleOnCourt={(id) => togglePlayerOnCourt(id, "home")}
                />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="boxscore" className="mt-0">
            <BoxScore game={game} />
          </TabsContent>

          <TabsContent value="plays" className="mt-0">
            <Card className="h-[500px] overflow-hidden">
              <PlayByPlay game={game} />
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
