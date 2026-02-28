import type { Server as SocketIOServer } from "socket.io"
import { RoomManager } from "./game/RoomManager.js"
import { registerHandlers } from "./handlers/index.js"

export function setupSocket(io: SocketIOServer) {
  const rm = new RoomManager(io)

  io.on("connection", (socket) => {
    console.log(`[socket] connected: ${socket.id}`)
    registerHandlers(socket, io, rm)

    socket.on("disconnect", () => {
      console.log(`[socket] disconnected: ${socket.id}`)
      rm.handleDisconnect(socket.id)
    })
  })
}
