import { useEffect, useState } from "react"
import type { LeaderboardEntry, BestRoundEntry } from "@zeroclick/shared"

interface LeaderboardData {
  bestGames: LeaderboardEntry[]
  bestRounds: BestRoundEntry[]
  loading: boolean
  error: string | null
}

export function useLeaderboard(): LeaderboardData {
  const [bestGames, setBestGames] = useState<LeaderboardEntry[]>([])
  const [bestRounds, setBestRounds] = useState<BestRoundEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        setBestGames(data.bestGames ?? [])
        setBestRounds(data.bestRounds ?? [])
      })
      .catch(() => setError("Failed to load leaderboard"))
      .finally(() => setLoading(false))
  }, [])

  return { bestGames, bestRounds, loading, error }
}
