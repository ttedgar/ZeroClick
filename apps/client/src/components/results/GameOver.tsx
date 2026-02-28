import { useNavigate } from "react-router-dom"
import type { GameOverPayload } from "@zeroclick/shared"
import { socket } from "../../socket.js"
import { useRoomStore } from "../../store/roomStore.js"

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(3)}s`
}

export function GameOver({
  payload,
  myId,
}: {
  payload: GameOverPayload
  myId: string | null
}) {
  const navigate = useNavigate()
  const reset = useRoomStore((s) => s.reset)

  function goHome() {
    socket.disconnect()
    reset()
    navigate("/")
  }

  const winner = payload.sessionLeaderboard[0]
  const isWinner = winner?.playerId === myId

  return (
    <div className="flex flex-col items-center gap-8 py-12 px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-1">
          {isWinner ? "🏆 You Win!" : "Game Over"}
        </h2>
        {!isWinner && winner && (
          <p className="text-gray-400">
            Winner: <span className="text-indigo-300">{winner.playerName}</span>
          </p>
        )}
      </div>

      <div className="w-full max-w-sm">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Final Scores</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-gray-800">
              <th className="text-left py-1 pr-3">#</th>
              <th className="text-left py-1 pr-3">Player</th>
              <th className="text-right py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {payload.sessionLeaderboard.map((e, i) => (
              <tr
                key={e.playerId}
                className={`border-b border-gray-900 ${e.playerId === myId ? "text-indigo-300" : ""}`}
              >
                <td className="py-2 pr-3 text-gray-500">{i + 1}</td>
                <td className="py-2 pr-3">{e.playerName}{e.playerId === myId && <span className="text-gray-500 text-xs ml-1">(you)</span>}</td>
                <td className="py-2 text-right tabular-nums">{formatMs(e.totalScore)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payload.globalBestGame.length > 0 && (
        <div className="w-full max-w-sm">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">All-Time Best Games</p>
          <table className="w-full text-sm">
            <tbody>
              {payload.globalBestGame.slice(0, 5).map((e) => (
                <tr key={e.rank} className="border-b border-gray-900">
                  <td className="py-1 pr-3 text-gray-500">{e.rank}</td>
                  <td className="py-1 pr-3">{e.playerName}</td>
                  <td className="py-1 text-right tabular-nums text-indigo-300">{formatMs(e.totalScore)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={goHome}
        className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded transition-colors"
      >
        Play Again
      </button>
    </div>
  )
}
