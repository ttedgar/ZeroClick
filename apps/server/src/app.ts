import Fastify from "fastify"
import cors from "@fastify/cors"
import fastifyStatic from "@fastify/static"
import { Server as SocketIOServer } from "socket.io"
import path from "node:path"
import { fileURLToPath } from "node:url"
import fs from "node:fs"
import { healthRoute } from "./routes/health.js"
import { leaderboardRoute } from "./routes/leaderboard.js"
import { setupSocket } from "./socket.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function buildApp() {
  const app = Fastify({ logger: process.env.NODE_ENV !== "production" })

  const isProd = process.env.NODE_ENV === "production"
  await app.register(cors, {
    origin: isProd ? true : (process.env.CLIENT_ORIGIN ?? "http://localhost:5173"),
    methods: ["GET", "POST"],
  })

  // Serve built client in production
  const clientDist = path.join(__dirname, "../../client/dist")
  if (fs.existsSync(clientDist)) {
    await app.register(fastifyStatic, {
      root: clientDist,
      prefix: "/",
    })
    // SPA fallback
    app.setNotFoundHandler((_req, reply) => {
      reply.sendFile("index.html")
    })
  }

  await app.register(healthRoute)
  await app.register(leaderboardRoute)

  // Attach Socket.IO
  const io = new SocketIOServer(app.server, {
    cors: {
      origin: isProd ? true : (process.env.CLIENT_ORIGIN ?? "http://localhost:5173"),
      methods: ["GET", "POST"],
    },
  })

  setupSocket(io)

  return app
}
