import type { Player } from "@zeroclick/shared"

export function PlayerList({ players, myId }: { players: Player[]; myId: string | null }) {
  return (
    <div className="w-full max-w-sm">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
        Players ({players.length})
      </p>
      <ul className="flex flex-col gap-2">
        {players.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between bg-gray-900 rounded px-4 py-2"
          >
            <span className="flex items-center gap-2">
              {p.isCreator && <span className="text-yellow-400 text-xs">👑</span>}
              <span className={p.id === myId ? "text-indigo-300 font-semibold" : ""}>
                {p.name}
                {p.id === myId && <span className="text-gray-500 text-xs ml-1">(you)</span>}
              </span>
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                p.isReady
                  ? "bg-green-900 text-green-300"
                  : "bg-gray-800 text-gray-500"
              }`}
            >
              {p.isReady ? "Ready" : "Waiting"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
