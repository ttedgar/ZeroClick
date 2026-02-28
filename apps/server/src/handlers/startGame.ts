import type { Socket, Server as SocketIOServer } from "socket.io"
import type { RoomManager } from "../game/RoomManager.js"
import { C_START_GAME, S_ERROR } from "@zeroclick/shared"

export function registerStartGame(socket: Socket, _io: SocketIOServer, rm: RoomManager) {
  socket.on(C_START_GAME, () => {
    const room = rm.getRoomForPlayer(socket.id)
    if (!room) {
      socket.emit(S_ERROR, { message: "Not in a room" })
      return
    }
    room.startGame(socket.id)
  })
}
