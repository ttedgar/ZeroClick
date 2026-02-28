import { MISS_PENALTY_MS } from "@zeroclick/shared"
import type { RoundScore } from "@zeroclick/shared"

/**
 * Calculate score for a click.
 * Score = |receiveTime - startAt - durationMs|
 */
export function calcClickScore(receiveTime: number, startAt: number, durationMs: number): number {
  return Math.abs(receiveTime - startAt - durationMs)
}

/**
 * Build ranked RoundScore array from a map of clicks.
 * Players who did not click receive MISS_PENALTY_MS.
 */
export function buildRoundScores(
  playerIds: string[],
  playerNames: Map<string, string>,
  clicks: Map<string, number>, // playerId → score ms
): RoundScore[] {
  const raw: RoundScore[] = playerIds.map((id) => {
    const score = clicks.get(id)
    if (score === undefined) {
      return {
        playerId: id,
        playerName: playerNames.get(id) ?? "Unknown",
        score: MISS_PENALTY_MS,
        isMiss: true,
        roundRank: 0,
      }
    }
    return {
      playerId: id,
      playerName: playerNames.get(id) ?? "Unknown",
      score,
      isMiss: false,
      roundRank: 0,
    }
  })

  // Rank by score ascending
  raw.sort((a, b) => a.score - b.score)
  raw.forEach((r, i) => {
    r.roundRank = i + 1
  })

  return raw
}
