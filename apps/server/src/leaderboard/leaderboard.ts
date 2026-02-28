import type { LeaderboardEntry, BestRoundEntry } from "@zeroclick/shared"
import { prisma } from "../db/prismaClient.js"

export async function saveBestGame(playerName: string, totalScore: number, rounds: number) {
  if (!prisma) return
  await prisma.bestGame.create({ data: { playerName, totalScore, rounds } })
}

export async function saveBestRound(playerName: string, roundScore: number) {
  if (!prisma) return
  await prisma.bestRound.create({ data: { playerName, roundScore } })
}

export async function getLeaderboard(type: "game", limit?: number): Promise<LeaderboardEntry[]>
export async function getLeaderboard(type: "round", limit?: number): Promise<BestRoundEntry[]>
export async function getLeaderboard(
  type: "game" | "round",
  limit = 10,
): Promise<LeaderboardEntry[] | BestRoundEntry[]> {
  if (!prisma) return []

  if (type === "game") {
    const rows = await prisma.bestGame.findMany({
      orderBy: { totalScore: "asc" },
      take: limit,
    })
    return rows.map((r, i) => ({
      rank: i + 1,
      playerName: r.playerName,
      totalScore: r.totalScore,
      rounds: r.rounds,
      achievedAt: r.achievedAt.toISOString(),
    }))
  } else {
    const rows = await prisma.bestRound.findMany({
      orderBy: { roundScore: "asc" },
      take: limit,
    })
    return rows.map((r, i) => ({
      rank: i + 1,
      playerName: r.playerName,
      roundScore: r.roundScore,
      achievedAt: r.achievedAt.toISOString(),
    }))
  }
}
