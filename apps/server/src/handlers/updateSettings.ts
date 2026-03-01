import type { Socket, Server as SocketIOServer } from "socket.io"
import type { RoomManager } from "../game/RoomManager.js"
import { C_UPDATE_SETTINGS } from "@zeroclick/shared"
import type { UpdateSettingsPayload } from "@zeroclick/shared"

export function registerUpdateSettings(socket: Socket, _io: SocketIOServer, rm: RoomManager) {
  socket.on(C_UPDATE_SETTINGS, (payload: UpdateSettingsPayload) => {
    const room = rm.getRoomForPlayer(socket.id)
    if (!room) return
    room.updateSettings(socket.id, payload.settings)
  })
}
