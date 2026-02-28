import type { FastifyInstance } from "fastify"
import { getLeaderboard } from "../leaderboard/leaderboard.js"

export async function leaderboardRoute(app: FastifyInstance) {
  app.get("/api/leaderboard", async (_req, reply) => {
    try {
      const [bestGames, bestRounds] = await Promise.all([
        getLeaderboard("game", 10),
        getLeaderboard("round", 10),
      ])
      return reply.send({ bestGames, bestRounds })
    } catch (err) {
      return reply.status(500).send({ error: "Failed to load leaderboard" })
    }
  })
}
