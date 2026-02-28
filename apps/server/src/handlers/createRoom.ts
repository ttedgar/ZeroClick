import type { Socket, Server as SocketIOServer } from "socket.io"
import type { RoomManager } from "../game/RoomManager.js"
import type { CreateRoomPayload } from "@zeroclick/shared"
import { C_CREATE_ROOM, S_ERROR } from "@zeroclick/shared"

export function registerCreateRoom(socket: Socket, _io: SocketIOServer, rm: RoomManager) {
  socket.on(C_CREATE_ROOM, (payload: CreateRoomPayload) => {
    const name = payload?.name?.trim()
    if (!name) {
      socket.emit(S_ERROR, { message: "Name is required" })
      return
    }

    // Leave any existing room first
    const existing = rm.getRoomForPlayer(socket.id)
    if (existing) {
      existing.removePlayer(socket.id)
      socket.leave(existing.code)
    }

    const room = rm.createRoom(socket.id, name, payload.settings)
    socket.join(room.code)
    room.broadcastState()
  })
}
