import type { Server as SocketIOServer } from "socket.io"
import type { GameSettings } from "@zeroclick/shared"
import { Room } from "./Room.js"

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export class RoomManager {
  private rooms: Map<string, Room> = new Map()
  private playerRoom: Map<string, string> = new Map() // socketId → roomCode
  private io: SocketIOServer

  constructor(io: SocketIOServer) {
    this.io = io
  }

  createRoom(creatorId: string, creatorName: string, settings?: Partial<GameSettings>): Room {
    let code: string
    do {
      code = generateCode()
    } while (this.rooms.has(code))

    const room = new Room(code, this.io, creatorId, creatorName, settings)
    room.onEmpty = () => this.rooms.delete(code)
    this.rooms.set(code, room)
    this.playerRoom.set(creatorId, code)
    return room
  }

  joinRoom(socketId: string, code: string, name: string): Room | null {
    const room = this.rooms.get(code.toUpperCase())
    if (!room) return null
    room.addPlayer(socketId, name)
    this.playerRoom.set(socketId, code.toUpperCase())
    return room
  }

  getRoom(code: string): Room | undefined {
    return this.rooms.get(code.toUpperCase())
  }

  getRoomForPlayer(socketId: string): Room | undefined {
    const code = this.playerRoom.get(socketId)
    if (!code) return undefined
    return this.rooms.get(code)
  }

  handleDisconnect(socketId: string) {
    const room = this.getRoomForPlayer(socketId)
    if (room) {
      room.removePlayer(socketId)
    }
    this.playerRoom.delete(socketId)
  }
}
