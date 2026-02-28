import type { Socket, Server as SocketIOServer } from "socket.io"
import type { RoomManager } from "../game/RoomManager.js"
import type { JoinRoomPayload } from "@zeroclick/shared"
import { C_JOIN_ROOM, S_ERROR, MAX_PLAYERS } from "@zeroclick/shared"

export function registerJoinRoom(socket: Socket, _io: SocketIOServer, rm: RoomManager) {
  socket.on(C_JOIN_ROOM, (payload: JoinRoomPayload) => {
    const code = payload?.code?.trim().toUpperCase()
    const name = payload?.name?.trim()

    if (!code || !name) {
      socket.emit(S_ERROR, { message: "Code and name are required" })
      return
    }

    const existing = rm.getRoom(code)
    if (!existing) {
      socket.emit(S_ERROR, { message: "Room not found" })
      return
    }

    if (existing.getState().players.length >= MAX_PLAYERS) {
      socket.emit(S_ERROR, { message: "Room is full" })
      return
    }

    if (existing.getState().phase !== "LOBBY") {
      socket.emit(S_ERROR, { message: "Game already in progress" })
      return
    }

    // Leave any existing room
    const prev = rm.getRoomForPlayer(socket.id)
    if (prev) {
      prev.removePlayer(socket.id)
      socket.leave(prev.code)
    }

    const room = rm.joinRoom(socket.id, code, name)
    if (!room) {
      socket.emit(S_ERROR, { message: "Room not found" })
      return
    }

    socket.join(room.code)
    room.broadcastState()
  })
}
