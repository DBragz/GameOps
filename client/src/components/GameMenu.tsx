import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Plus, Users, Clock, Trophy, Eye, CheckCircle } from "lucide-react";
import type { Game } from "@shared/schema";

interface GameMenuProps {
  onStartNew: () => void;
  onJoinGame: (game: Game) => void;
  onViewGame: (game: Game) => void;
}

export function GameMenu({ onStartNew, onJoinGame, onViewGame }: GameMenuProps) {
  const { data: games = [], isLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
    refetchInterval: 5000,
  });

  const activeGames = games.filter((g) => g.status === "active");
  const completedGames = games.filter((g) => g.status === "completed");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo size="sm" />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Welcome to GameOps
            </h1>
            <p className="text-muted-foreground">
              Start a new game or join an active session
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card
                className="p-6 h-full hover-elevate cursor-pointer border-2 border-transparent hover:border-primary/50 transition-colors"
                onClick={onStartNew}
                data-testid="button-start-new-game"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-semibold text-foreground">
                      Start New Game
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create a fresh game with custom teams and settings
                    </p>
                  </div>
                  <Button className="w-full" data-testid="button-create-game">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Game
                  </Button>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-xl font-heading font-semibold text-foreground">
                        Join Active Game
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {activeGames.length} game{activeGames.length !== 1 ? "s" : ""} in progress
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto max-h-64">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8 text-muted-foreground">
                        Loading games...
                      </div>
                    ) : activeGames.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <Trophy className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm">No active games</p>
                        <p className="text-xs">Start a new game to begin tracking</p>
                      </div>
                    ) : (
                      activeGames.map((game) => (
                        <div
                          key={game.id}
                          className="p-3 rounded-md bg-muted/50 hover-elevate cursor-pointer border border-transparent hover:border-accent/50 transition-colors"
                          onClick={() => onJoinGame(game)}
                          data-testid={`button-join-game-${game.id}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-mono text-sm font-semibold truncate">
                                {game.awayTeam.abbreviation} vs {game.homeTeam.abbreviation}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <span className="font-mono">
                                  {game.awayTeam.score} - {game.homeTeam.score}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Q{game.currentPeriod} {formatTime(game.gameClockSeconds)}
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              data-testid={`button-join-${game.id}`}
                            >
                              Join
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Games Completed Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-semibold text-foreground">
                    Games Completed
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {completedGames.length} finished game{completedGames.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-64">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    Loading games...
                  </div>
                ) : completedGames.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Trophy className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">No completed games yet</p>
                    <p className="text-xs">Finished games will appear here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {completedGames.map((game) => (
                      <div
                        key={game.id}
                        className="p-3 rounded-md bg-muted/50 hover-elevate cursor-pointer border border-transparent hover:border-green-500/50 transition-colors"
                        onClick={() => onViewGame(game)}
                        data-testid={`button-view-game-${game.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-sm font-semibold truncate">
                              {game.awayTeam.abbreviation} vs {game.homeTeam.abbreviation}
                            </div>
                            <div className="flex items-center gap-2 text-xs mt-1">
                              <span className="font-mono font-bold text-foreground">
                                {game.awayTeam.score} - {game.homeTeam.score}
                              </span>
                              <span className="text-green-500 font-medium">FINAL</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            data-testid={`button-view-${game.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
