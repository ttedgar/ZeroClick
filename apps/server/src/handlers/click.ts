import type { Socket, Server as SocketIOServer } from "socket.io"
import type { RoomManager } from "../game/RoomManager.js"
import { C_CLICK, S_PLAYER_CLICKED } from "@zeroclick/shared"

export function registerClick(socket: Socket, io: SocketIOServer, rm: RoomManager) {
  socket.on(C_CLICK, (payload?: { clientTs?: number }) => {
    const room = rm.getRoomForPlayer(socket.id)
    if (!room) return

    const recorded = room.recordClick(socket.id, payload?.clientTs)
    if (recorded) {
      const state = room.getState()
      const player = state.players.find((p) => p.id === socket.id)
      if (player) {
        io.to(room.code).emit(S_PLAYER_CLICKED, {
          playerId: socket.id,
          playerName: player.name,
        })
      }
    }
  })
}
