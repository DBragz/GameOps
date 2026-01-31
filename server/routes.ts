import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/games", async (req, res) => {
    try {
      const parsed = insertGameSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      const game = await storage.createGame(parsed.data);
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: "Failed to create game" });
    }
  });

  app.put("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.saveGame(req.params.id, req.body);
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: "Failed to save game" });
    }
  });

  app.get("/api/games", async (_req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch games" });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.getGame(req.params.id);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch game" });
    }
  });

  app.patch("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.updateGame(req.params.id, req.body);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: "Failed to update game" });
    }
  });

  app.delete("/api/games/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteGame(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete game" });
    }
  });

  app.post("/api/games/:id/plays", async (req, res) => {
    try {
      const play = await storage.recordPlay(req.params.id, req.body);
      if (!play) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json(play);
    } catch (error) {
      res.status(500).json({ error: "Failed to record play" });
    }
  });

  app.patch("/api/games/:id/teams/:teamType", async (req, res) => {
    try {
      const { teamType } = req.params;
      if (teamType !== "home" && teamType !== "away") {
        return res.status(400).json({ error: "Invalid team type" });
      }
      const team = await storage.updateTeam(req.params.id, teamType, req.body);
      if (!team) {
        return res.status(404).json({ error: "Game or team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to update team" });
    }
  });

  app.patch("/api/games/:id/teams/:teamType/players/:playerId", async (req, res) => {
    try {
      const { teamType, playerId } = req.params;
      if (teamType !== "home" && teamType !== "away") {
        return res.status(400).json({ error: "Invalid team type" });
      }
      const player = await storage.updatePlayerStats(
        req.params.id,
        teamType,
        playerId,
        req.body
      );
      if (!player) {
        return res.status(404).json({ error: "Game or player not found" });
      }
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: "Failed to update player" });
    }
  });

  return httpServer;
}
