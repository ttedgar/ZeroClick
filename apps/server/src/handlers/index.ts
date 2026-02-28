import type { Socket, Server as SocketIOServer } from "socket.io"
import type { RoomManager } from "../game/RoomManager.js"
import { registerCreateRoom } from "./createRoom.js"
import { registerJoinRoom } from "./joinRoom.js"
import { registerSetReady } from "./setReady.js"
import { registerStartGame } from "./startGame.js"
import { registerClick } from "./click.js"
import { registerPing } from "./ping.js"

export function registerHandlers(socket: Socket, io: SocketIOServer, rm: RoomManager) {
  registerCreateRoom(socket, io, rm)
  registerJoinRoom(socket, io, rm)
  registerSetReady(socket, io, rm)
  registerStartGame(socket, io, rm)
  registerClick(socket, io, rm)
  registerPing(socket, io, rm)
}
