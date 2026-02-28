import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { socket } from "../socket.js"
import { useRoom } from "../hooks/useRoom.js"
import { useClockSync } from "../hooks/useClockSync.js"
import { useRoomStore } from "../store/roomStore.js"
import { C_JOIN_ROOM } from "@zeroclick/shared"
import { LobbyView } from "../components/lobby/LobbyView.js"
import { GameView } from "../components/game/GameView.js"
import { RoundResults } from "../components/results/RoundResults.js"
import { GameOver } from "../components/results/GameOver.js"

export default function Room() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [pendingName, setPendingName] = useState("")
  const [joining, setJoining] = useState(false)

  useRoom()
  useClockSync()

  const { room, mySocketId, roundEndPayload, gameOverPayload, error, setMySocketId } = useRoomStore()

  // Connect socket on mount
  useEffect(() => {
    if (!socket.connected) socket.connect()
    socket.on("connect", () => setMySocketId(socket.id ?? ""))
    return () => { socket.off("connect") }
  }, [setMySocketId])

  useEffect(() => {
    if (error && !room) navigate("/")
  }, [error, room, navigate])

  // If we have no room state, we arrived via direct URL — need to join
  function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!pendingName.trim()) return
    setJoining(true)
    if (!socket.connected) socket.connect()
    socket.emit(C_JOIN_ROOM, { code, name: pendingName.trim() })
  }

  if (error && !room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-4">
        <p className="text-red-400">{error}</p>
        <button onClick={() => navigate("/")} className="text-indigo-400 hover:underline">
          Back to home
        </button>
      </div>
    )
  }

  // No room state yet — show name prompt for direct URL visitors
  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-6 px-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Joining room</p>
          <p className="text-3xl font-bold tracking-widest text-indigo-300">{code}</p>
        </div>
        {joining ? (
          <p className="text-gray-500">Connecting…</p>
        ) : (
          <form onSubmit={handleJoin} className="flex flex-col gap-3 w-full max-w-xs">
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
              value={pendingName}
              onChange={(e) => setPendingName(e.target.value)}
              maxLength={24}
              placeholder="Enter your name"
              autoFocus
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded transition-colors"
            >
              Join Room
            </button>
          </form>
        )}
      </div>
    )
  }

  if (gameOverPayload) {
    return <GameOver payload={gameOverPayload} myId={mySocketId} />
  }

  if (room.phase === "ROUND_RESULTS" && roundEndPayload) {
    return <RoundResults payload={roundEndPayload} myId={mySocketId} />
  }

  if (room.phase === "ROUND_ACTIVE" || room.phase === "STARTING") {
    return <GameView />
  }

  return <LobbyView room={room} myId={mySocketId} />
}
