import type { Socket, Server as SocketIOServer } from "socket.io"
import type { RoomManager } from "../game/RoomManager.js"
import { C_RESTART_GAME } from "@zeroclick/shared"

export function registerRestartGame(socket: Socket, _io: SocketIOServer, rm: RoomManager) {
  socket.on(C_RESTART_GAME, () => {
    const room = rm.getRoomForPlayer(socket.id)
    if (!room) return
    room.restartGame()
  })
}
