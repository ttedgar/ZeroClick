import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { socket } from "../../socket.js"
import { useRoomStore } from "../../store/roomStore.js"
import { C_JOIN_ROOM, S_ERROR } from "@zeroclick/shared"
import type { ErrorPayload } from "@zeroclick/shared"

export function QuickPlayButton() {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [err, setErr] = useState("")
  const navigate = useNavigate()

  function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim() || !name.trim()) return
    setErr("")

    if (!socket.connected) socket.connect()

    socket.emit(C_JOIN_ROOM, { code: code.trim().toUpperCase(), name: name.trim() })

    socket.once("room_update", (state) => {
      socket.off(S_ERROR, onError)
      useRoomStore.getState().setMySocketId(socket.id ?? "")
      useRoomStore.getState().setRoom(state)
      navigate(`/room/${state.code}`)
    })

    function onError(payload: ErrorPayload) {
      setErr(payload.message)
      socket.off("room_update", () => {})
    }
    socket.once(S_ERROR, onError)
  }

  return (
    <form onSubmit={handleJoin} className="flex flex-col gap-3 w-full max-w-sm">
      <div>
        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">Room Code</label>
        <input
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 uppercase tracking-widest focus:outline-none focus:border-indigo-500"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          placeholder="ABC123"
          required
        />
      </div>
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
      {err && <p className="text-red-400 text-sm">{err}</p>}
      <button
        type="submit"
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded transition-colors"
      >
        Join Room
      </button>
    </form>
  )
}
