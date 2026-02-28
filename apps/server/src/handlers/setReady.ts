import type { Socket, Server as SocketIOServer } from "socket.io"
import type { RoomManager } from "../game/RoomManager.js"
import { C_SET_READY } from "@zeroclick/shared"

export function registerSetReady(socket: Socket, _io: SocketIOServer, rm: RoomManager) {
  socket.on(C_SET_READY, (payload: { ready: boolean }) => {
    const room = rm.getRoomForPlayer(socket.id)
    if (!room) return
    room.setReady(socket.id, payload?.ready ?? true)
  })
}
