import { useLeaderboard } from "../../hooks/useLeaderboard.js"

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(3)}s`
}

export function LeaderboardTable() {
  const { bestGames, bestRounds, loading, error } = useLeaderboard()

  if (loading) return <p className="text-gray-500 text-sm">Loading leaderboard…</p>
  if (error) return <p className="text-red-400 text-sm">{error}</p>
  if (!bestGames.length && !bestRounds.length)
    return <p className="text-gray-600 text-sm">No records yet. Be the first!</p>

  return (
    <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-2">Best Games</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-gray-800">
              <th className="text-left py-1 pr-3">#</th>
              <th className="text-left py-1 pr-3">Player</th>
              <th className="text-right py-1">Score</th>
            </tr>
          </thead>
          <tbody>
            {bestGames.map((e) => (
              <tr key={e.rank} className="border-b border-gray-900">
                <td className="py-1 pr-3 text-gray-500">{e.rank}</td>
                <td className="py-1 pr-3 truncate max-w-[120px]">{e.playerName}</td>
                <td className="py-1 text-right text-indigo-300 tabular-nums">{formatMs(e.totalScore)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-2">Best Rounds</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-gray-800">
              <th className="text-left py-1 pr-3">#</th>
              <th className="text-left py-1 pr-3">Player</th>
              <th className="text-right py-1">Score</th>
            </tr>
          </thead>
          <tbody>
            {bestRounds.map((e) => (
              <tr key={e.rank} className="border-b border-gray-900">
                <td className="py-1 pr-3 text-gray-500">{e.rank}</td>
                <td className="py-1 pr-3 truncate max-w-[120px]">{e.playerName}</td>
                <td className="py-1 text-right text-indigo-300 tabular-nums">{formatMs(e.roundScore)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
