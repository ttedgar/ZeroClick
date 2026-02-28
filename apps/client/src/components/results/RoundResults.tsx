import type { RoundEndPayload } from "@zeroclick/shared"
import { MISS_PENALTY_MS } from "@zeroclick/shared"

function formatMs(ms: number): string {
  return `${ms}ms`
}

export function RoundResults({
  payload,
  myId,
}: {
  payload: RoundEndPayload
  myId: string | null
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-12 px-4">
      <h2 className="text-xs text-gray-400 uppercase tracking-widest">Round {payload.round} Results</h2>
      <div className="w-full max-w-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-gray-800">
              <th className="text-left py-1 pr-3">#</th>
              <th className="text-left py-1 pr-3">Player</th>
              <th className="text-right py-1">Off by</th>
            </tr>
          </thead>
          <tbody>
            {payload.scores.map((s) => (
              <tr
                key={s.playerId}
                className={`border-b border-gray-900 ${s.playerId === myId ? "text-indigo-300" : ""}`}
              >
                <td className="py-2 pr-3 text-gray-500">{s.roundRank}</td>
                <td className="py-2 pr-3">{s.playerName}{s.playerId === myId && <span className="text-gray-500 text-xs ml-1">(you)</span>}</td>
                <td className="py-2 text-right tabular-nums">
                  {s.isMiss ? (
                    <span className="text-red-400">MISS +{MISS_PENALTY_MS}ms</span>
                  ) : (
                    <span className={s.score < 100 ? "text-green-400" : s.score < 500 ? "text-yellow-400" : "text-red-400"}>
                      {formatMs(s.score)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-gray-600 text-xs">Next round starting soon…</p>
    </div>
  )
}
