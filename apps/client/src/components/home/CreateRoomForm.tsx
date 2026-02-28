import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { socket } from "../../socket.js"
import { useRoomStore } from "../../store/roomStore.js"
import { C_CREATE_ROOM } from "@zeroclick/shared"

export function CreateRoomForm() {
  const [name, setName] = useState("")
  const [rounds, setRounds] = useState(3)
  const [duration, setDuration] = useState(3)
  const [hidden, setHidden] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    if (!socket.connected) socket.connect()

    socket.emit(C_CREATE_ROOM, {
      name: name.trim(),
      settings: {
        rounds,
        durationSeconds: duration,
        visibility: hidden ? "hidden" : "timer",
      },
    })

    // Listen for room_update to get code — store state before navigating
    socket.once("room_update", (state) => {
      useRoomStore.getState().setMySocketId(socket.id ?? "")
      useRoomStore.getState().setRoom(state)
      navigate(`/room/${state.code}`)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <div>
        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">Your Name</label>
        <input
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          placeholder="Enter name"
          required
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">Rounds</label>
          <select
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">Duration (s)</label>
          <select
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-400">
        <input
          type="checkbox"
          checked={hidden}
          onChange={(e) => setHidden(e.target.checked)}
          className="rounded"
        />
        Hidden timer mode
      </label>
      <button
        type="submit"
        className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded transition-colors"
      >
        Create Room
      </button>
    </form>
  )
}
