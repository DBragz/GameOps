import { randomUUID } from "crypto";
import type { Game, Player, Team, Play, InsertGame, SportType, GameRules } from "@shared/schema";

export interface IStorage {
  createGame(config: InsertGame): Promise<Game>;
  getGame(id: string): Promise<Game | undefined>;
  updateGame(id: string, updates: Partial<Game>): Promise<Game | undefined>;
  getAllGames(): Promise<Game[]>;
  deleteGame(id: string): Promise<boolean>;
  recordPlay(gameId: string, play: Omit<Play, "id">): Promise<Play | undefined>;
  updatePlayerStats(
    gameId: string,
    teamType: "home" | "away",
    playerId: string,
    updates: Partial<Player>
  ): Promise<Player | undefined>;
  updateTeam(
    gameId: string,
    teamType: "home" | "away",
    updates: Partial<Team>
  ): Promise<Team | undefined>;
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

export class MemStorage implements IStorage {
  private games: Map<string, Game>;

  constructor() {
    this.games = new Map();
  }

  async createGame(config: InsertGame): Promise<Game> {
    const id = randomUUID();
    const homeTeamId = randomUUID();
    const awayTeamId = randomUUID();

    const periodLength = config.periodLength || (config.rules === "pro" ? 12 : 8);
    const totalPeriods = config.totalPeriods || (config.sport === "hockey" ? 3 : 4);
    const timeouts = config.rules === "pro" ? 7 : 5;

    const game: Game = {
      id,
      sport: config.sport,
      rules: config.rules,
      status: "active",
      homeTeam: {
        id: homeTeamId,
        name: config.homeTeam.name,
        abbreviation: config.homeTeam.abbreviation,
        color: config.homeTeam.color || "#1E88E5",
        players: [],
        timeoutsRemaining: timeouts,
        teamFouls: 0,
        score: 0,
      },
      awayTeam: {
        id: awayTeamId,
        name: config.awayTeam.name,
        abbreviation: config.awayTeam.abbreviation,
        color: config.awayTeam.color || "#E53935",
        players: [],
        timeoutsRemaining: timeouts,
        teamFouls: 0,
        score: 0,
      },
      currentPeriod: 1,
      periodLength,
      totalPeriods,
      gameClockSeconds: periodLength * 60,
      isClockRunning: false,
      possession: undefined,
      plays: [],
      createdAt: Date.now(),
    };

    this.games.set(id, game);
    return game;
  }

  async getGame(id: string): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async updateGame(id: string, updates: Partial<Game>): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;

    const updatedGame = { ...game, ...updates };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async deleteGame(id: string): Promise<boolean> {
    return this.games.delete(id);
  }

  async recordPlay(gameId: string, playData: Omit<Play, "id">): Promise<Play | undefined> {
    const game = this.games.get(gameId);
    if (!game) return undefined;

    const play: Play = {
      id: randomUUID(),
      ...playData,
    };

    game.plays.push(play);
    this.games.set(gameId, game);
    return play;
  }

  async updatePlayerStats(
    gameId: string,
    teamType: "home" | "away",
    playerId: string,
    updates: Partial<Player>
  ): Promise<Player | undefined> {
    const game = this.games.get(gameId);
    if (!game) return undefined;

    const teamKey = teamType === "home" ? "homeTeam" : "awayTeam";
    const team = game[teamKey];
    const playerIndex = team.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) return undefined;

    const updatedPlayer = { ...team.players[playerIndex], ...updates };
    team.players[playerIndex] = updatedPlayer;
    this.games.set(gameId, game);
    return updatedPlayer;
  }

  async updateTeam(
    gameId: string,
    teamType: "home" | "away",
    updates: Partial<Team>
  ): Promise<Team | undefined> {
    const game = this.games.get(gameId);
    if (!game) return undefined;

    const teamKey = teamType === "home" ? "homeTeam" : "awayTeam";
    const updatedTeam = { ...game[teamKey], ...updates };
    game[teamKey] = updatedTeam;
    this.games.set(gameId, game);
    return updatedTeam;
  }
}

export const storage = new MemStorage();
