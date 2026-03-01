import { useNavigate } from "react-router-dom"
import { socket } from "../../socket.js"
import { useRoomStore } from "../../store/roomStore.js"
import { C_SET_READY, C_START_GAME, C_UPDATE_SETTINGS } from "@zeroclick/shared"
import type { RoomState } from "@zeroclick/shared"
import { ShareLink } from "./ShareLink.js"
import { PlayerList } from "./PlayerList.js"

interface Props {
  room: RoomState
  myId: string | null
}

export function LobbyView({ room, myId }: Props) {
  const me = room.players.find((p) => p.id === myId)
  const isCreator = me?.isCreator ?? false
  const navigate = useNavigate()
  const reset = useRoomStore((s) => s.reset)

  function toggleReady() {
    socket.emit(C_SET_READY, { ready: !me?.isReady })
  }

  function forceStart() {
    socket.emit(C_START_GAME)
  }

  function goHome() {
    socket.disconnect()
    reset()
    navigate("/")
  }

  return (
    <div className="flex flex-col items-center gap-8 py-12 px-4">
      <ShareLink code={room.code} />

      <PlayerList players={room.players} myId={myId} />

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={toggleReady}
          className={`w-full py-3 rounded font-bold transition-colors ${
            me?.isReady
              ? "bg-green-700 hover:bg-green-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          {me?.isReady ? "✓ Ready" : "Mark as Ready"}
        </button>

        {isCreator && (
          <button
            onClick={forceStart}
            className="w-full py-3 rounded font-bold bg-indigo-700 hover:bg-indigo-600 transition-colors text-sm"
          >
            Force Start (Skip Ready)
          </button>
        )}
      </div>

      {isCreator ? (
        <div className="w-full max-w-sm">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Settings</p>
          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Rounds</span>
              <select
                value={room.settings.rounds}
                onChange={(e) => socket.emit(C_UPDATE_SETTINGS, { settings: { rounds: Number(e.target.value) } })}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
              >
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Duration (s)</span>
              <select
                value={room.settings.durationSeconds}
                onChange={(e) => socket.emit(C_UPDATE_SETTINGS, { settings: { durationSeconds: Number(e.target.value) } })}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Hidden timer</span>
              <input
                type="checkbox"
                checked={room.settings.visibility === "hidden"}
                onChange={(e) => socket.emit(C_UPDATE_SETTINGS, { settings: { visibility: e.target.checked ? "hidden" : "timer" } })}
                className="w-4 h-4 accent-indigo-500"
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="text-gray-600 text-xs text-center">
          <p>{room.settings.rounds} rounds · {room.settings.durationSeconds}s · {room.settings.visibility === "hidden" ? "hidden timer" : "visible timer"}</p>
        </div>
      )}

      <button
        onClick={goHome}
        className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
      >
        ← Leave room
      </button>
    </div>
  )
}
