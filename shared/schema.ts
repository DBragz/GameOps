import { z } from "zod";

export const SportType = z.enum(["basketball", "hockey", "football", "baseball", "volleyball", "soccer"]);
export type SportType = z.infer<typeof SportType>;

export const GameRules = z.enum(["high_school", "college", "pro"]);
export type GameRules = z.infer<typeof GameRules>;

export const GameStatus = z.enum(["setup", "active", "paused", "completed"]);
export type GameStatus = z.infer<typeof GameStatus>;

export const playerSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  number: z.number().min(0).max(99),
  position: z.string(),
  isActive: z.boolean().default(true),
  isOnCourt: z.boolean().default(false),
  fouls: z.number().default(0),
  stats: z.object({
    points: z.number().default(0),
    fieldGoalsMade: z.number().default(0),
    fieldGoalsAttempted: z.number().default(0),
    threePointersMade: z.number().default(0),
    threePointersAttempted: z.number().default(0),
    freeThrowsMade: z.number().default(0),
    freeThrowsAttempted: z.number().default(0),
    offensiveRebounds: z.number().default(0),
    defensiveRebounds: z.number().default(0),
    assists: z.number().default(0),
    steals: z.number().default(0),
    blocks: z.number().default(0),
    turnovers: z.number().default(0),
  }).default({}),
});

export type Player = z.infer<typeof playerSchema>;

export const teamSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  abbreviation: z.string().max(4),
  color: z.string().default("#000000"),
  players: z.array(playerSchema).default([]),
  timeoutsRemaining: z.number().default(5),
  teamFouls: z.number().default(0),
  score: z.number().default(0),
});

export type Team = z.infer<typeof teamSchema>;

export const playSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  period: z.number(),
  gameTime: z.string(),
  playerId: z.string().optional(),
  playerName: z.string().optional(),
  teamId: z.string(),
  type: z.enum([
    "field_goal_2",
    "field_goal_3",
    "free_throw",
    "miss_2",
    "miss_3",
    "miss_ft",
    "offensive_rebound",
    "defensive_rebound",
    "assist",
    "steal",
    "block",
    "turnover",
    "foul",
    "timeout",
    "substitution",
  ]),
  description: z.string(),
});

export type Play = z.infer<typeof playSchema>;

export const gameSchema = z.object({
  id: z.string(),
  sport: SportType,
  rules: GameRules,
  status: GameStatus,
  homeTeam: teamSchema,
  awayTeam: teamSchema,
  currentPeriod: z.number().default(1),
  periodLength: z.number().default(12),
  totalPeriods: z.number().default(4),
  gameClockSeconds: z.number().default(720),
  isClockRunning: z.boolean().default(false),
  possession: z.enum(["home", "away"]).optional(),
  plays: z.array(playSchema).default([]),
  createdAt: z.number(),
});

export type Game = z.infer<typeof gameSchema>;

export const insertPlayerSchema = playerSchema.omit({ id: true, stats: true, fouls: true, isOnCourt: true });
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;

export const insertTeamSchema = teamSchema.omit({ id: true, players: true, score: true, teamFouls: true, timeoutsRemaining: true });
export type InsertTeam = z.infer<typeof insertTeamSchema>;

export const insertGameSchema = z.object({
  sport: SportType,
  rules: GameRules,
  homeTeam: insertTeamSchema,
  awayTeam: insertTeamSchema,
  periodLength: z.number().optional(),
  totalPeriods: z.number().optional(),
});
export type InsertGame = z.infer<typeof insertGameSchema>;

export const users = {
  id: "",
  username: "",
  password: "",
};

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users;
