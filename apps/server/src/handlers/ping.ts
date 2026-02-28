import type { Socket, Server as SocketIOServer } from "socket.io"
import type { RoomManager } from "../game/RoomManager.js"
import type { PingPayload } from "@zeroclick/shared"
import { C_PING, S_PONG } from "@zeroclick/shared"

export function registerPing(socket: Socket, _io: SocketIOServer, _rm: RoomManager) {
  socket.on(C_PING, (payload: PingPayload) => {
    socket.emit(S_PONG, {
      clientTs: payload?.clientTs ?? 0,
      serverTs: Date.now(),
    })
  })
}
