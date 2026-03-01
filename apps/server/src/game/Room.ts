import type { Server as SocketIOServer } from "socket.io"
import {
  type GameSettings,
  type Player,
  type RoomState,
  type RoundScore,
  DEFAULT_ROUNDS,
  DEFAULT_DURATION_SECONDS,
  MISS_PENALTY_MS,
  ROUND_RESULTS_PAUSE_MS,
  STARTING_BEAT_GAP_MS,
  S_ROOM_UPDATE,
  S_ROUND_STARTING,
  S_ROUND_START,
  S_ROUND_END,
  S_GAME_OVER,
} from "@zeroclick/shared"
import { calcClickScore, buildRoundScores } from "./scoring.js"
import { getLeaderboard, saveBestGame, saveBestRound } from "../leaderboard/leaderboard.js"

export class Room {
  readonly code: string
  private io: SocketIOServer
  private players: Map<string, Player> = new Map()
  private phase: RoomState["phase"] = "LOBBY"
  private settings: GameSettings
  private currentRound = 0
  private roundStartAt = 0
  private roundClicks: Map<string, number> = new Map() // playerId → score
  private roundTimer: ReturnType<typeof setTimeout> | null = null
  public onEmpty?: () => void

  constructor(code: string, io: SocketIOServer, creatorId: string, creatorName: string, settings?: Partial<GameSettings>) {
    this.code = code
    this.io = io
    this.settings = {
      rounds: settings?.rounds ?? DEFAULT_ROUNDS,
      durationSeconds: settings?.durationSeconds ?? DEFAULT_DURATION_SECONDS,
      visibility: settings?.visibility ?? "timer",
    }
    this.addPlayer(creatorId, creatorName, true)
  }

  // ─── Player management ───────────────────────────────────────────────────

  addPlayer(id: string, name: string, isCreator = false) {
    const player: Player = {
      id,
      name,
      isReady: false,
      isCreator,
      roundScores: [],
      totalScore: 0,
      hasClickedThisRound: false,
    }
    this.players.set(id, player)
    this.broadcastState()
  }

  removePlayer(id: string) {
    this.players.delete(id)
    if (this.players.size === 0) {
      this.cleanup()
      this.onEmpty?.()
      return
    }
    // If creator left, promote next player
    const hasCreator = [...this.players.values()].some((p) => p.isCreator)
    if (!hasCreator) {
      const first = this.players.values().next().value
      if (first) first.isCreator = true
    }
    this.broadcastState()
  }

  setReady(id: string, ready: boolean) {
    const player = this.players.get(id)
    if (!player) return
    player.isReady = ready
    this.broadcastState()
    this.checkAllReady()
  }

  // ─── Game flow ────────────────────────────────────────────────────────────

  startGame(requesterId: string) {
    const player = this.players.get(requesterId)
    if (!player?.isCreator) return
    if (this.phase !== "LOBBY") return
    this.runStartingSequence()
  }

  restartGame(): boolean {
    if (this.phase !== "GAME_OVER") return false

    // Reset to lobby state
    this.phase = "LOBBY"
    this.currentRound = 0
    this.roundClicks.clear()

    // Reset all players
    for (const player of this.players.values()) {
      player.isReady = false
      player.roundScores = []
      player.totalScore = 0
      player.hasClickedThisRound = false
    }

    this.broadcastState()
    return true
  }

  updateSettings(requesterId: string, settings: Partial<GameSettings>) {
    const player = this.players.get(requesterId)
    if (!player?.isCreator) return
    if (this.phase !== "LOBBY") return
    if (settings.rounds !== undefined) this.settings.rounds = settings.rounds
    if (settings.durationSeconds !== undefined) this.settings.durationSeconds = settings.durationSeconds
    if (settings.visibility !== undefined) this.settings.visibility = settings.visibility
    this.broadcastState()
  }

  private checkAllReady() {
    if (this.phase !== "LOBBY") return
    if (this.players.size < 1) return
    const all = [...this.players.values()].every((p) => p.isReady)
    if (all) this.runStartingSequence()
  }

  private runStartingSequence() {
    this.phase = "STARTING"
    this.broadcastState()

    const beats: Array<"READY" | "SET" | "GO"> = ["READY", "SET", "GO"]
    beats.forEach((beat, i) => {
      setTimeout(() => {
        this.io.to(this.code).emit(S_ROUND_STARTING, { beat })
        if (beat === "GO") {
          setTimeout(() => this.startRound(), STARTING_BEAT_GAP_MS)
        }
      }, i * STARTING_BEAT_GAP_MS)
    })
  }

  private startRound() {
    this.currentRound++
    this.roundClicks = new Map()
    this.phase = "ROUND_ACTIVE"

    // Reset click flags
    for (const p of this.players.values()) {
      p.hasClickedThisRound = false
    }

    this.roundStartAt = Date.now()
    const durationMs = this.settings.durationSeconds * 1000

    this.broadcastState()
    this.io.to(this.code).emit(S_ROUND_START, {
      round: this.currentRound,
      startAt: this.roundStartAt,
      durationMs,
      visibility: this.settings.visibility,
    })

    // Auto-end round after duration + 2s buffer for late clicks
    this.roundTimer = setTimeout(() => {
      this.endRound()
    }, durationMs + 2000)
  }

  recordClick(playerId: string, clientTs?: number): boolean {
    if (this.phase !== "ROUND_ACTIVE") return false
    const player = this.players.get(playerId)
    if (!player) return false
    if (player.hasClickedThisRound) return false

    player.hasClickedThisRound = true
    // Use client timestamp if provided (removes network latency from score).
    // Clamp to ±500ms of server receive time to prevent cheating.
    const receiveTime = Date.now()
    const clickTime = clientTs
      ? Math.max(receiveTime - 500, Math.min(receiveTime + 500, clientTs))
      : receiveTime
    const score = calcClickScore(clickTime, this.roundStartAt, this.settings.durationSeconds * 1000)
    this.roundClicks.set(playerId, score)

    this.broadcastState()

    // If all players clicked, end early
    const allClicked = [...this.players.values()].every((p) => p.hasClickedThisRound)
    if (allClicked) {
      if (this.roundTimer) clearTimeout(this.roundTimer)
      this.roundTimer = null
      this.endRound()
    }

    return true
  }

  private endRound() {
    if (this.phase !== "ROUND_ACTIVE") return
    this.phase = "ROUND_RESULTS"

    const playerIds = [...this.players.keys()]
    const nameMap = new Map([...this.players.entries()].map(([id, p]) => [id, p.name]))
    const scores = buildRoundScores(playerIds, nameMap, this.roundClicks)

    // Update player totals
    for (const score of scores) {
      const player = this.players.get(score.playerId)
      if (player) {
        player.roundScores.push(score.score)
        player.totalScore += score.score
      }
    }

    this.broadcastState()
    this.io.to(this.code).emit(S_ROUND_END, {
      round: this.currentRound,
      scores,
    })

    // Persist best rounds
    this.persistBestRounds(scores)

    setTimeout(() => {
      if (this.currentRound >= this.settings.rounds) {
        this.endGame(scores)
      } else {
        this.startRound()
      }
    }, ROUND_RESULTS_PAUSE_MS)
  }

  private async endGame(lastRoundScores: RoundScore[]) {
    this.phase = "GAME_OVER"
    this.broadcastState()

    const sessionLeaderboard = [...this.players.values()]
      .map((p) => ({ playerId: p.id, playerName: p.name, totalScore: p.totalScore }))
      .sort((a, b) => a.totalScore - b.totalScore)

    const winnerId = sessionLeaderboard[0]?.playerId ?? ""

    // Persist best games
    for (const entry of sessionLeaderboard) {
      await saveBestGame(entry.playerName, entry.totalScore, this.settings.rounds).catch(console.error)
    }

    const [globalBestGame, globalBestRound] = await Promise.all([
      getLeaderboard("game", 10),
      getLeaderboard("round", 10),
    ]).catch(() => [[], []] as [never[], never[]])

    this.io.to(this.code).emit(S_GAME_OVER, {
      scores: lastRoundScores,
      winnerId,
      sessionLeaderboard,
      globalBestGame,
      globalBestRound,
    })
  }

  private async persistBestRounds(scores: RoundScore[]) {
    for (const score of scores) {
      if (!score.isMiss) {
        await saveBestRound(score.playerName, score.score).catch(console.error)
      }
    }
  }

  // ─── Broadcast ────────────────────────────────────────────────────────────

  broadcastState() {
    this.io.to(this.code).emit(S_ROOM_UPDATE, this.getState())
  }

  getState(): RoomState {
    return {
      code: this.code,
      phase: this.phase,
      settings: this.settings,
      players: [...this.players.values()],
      currentRound: this.currentRound,
      totalRounds: this.settings.rounds,
    }
  }

  hasPlayer(id: string): boolean {
    return this.players.has(id)
  }

  getCreatorId(): string | undefined {
    return [...this.players.values()].find((p) => p.isCreator)?.id
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────────

  private cleanup() {
    if (this.roundTimer) {
      clearTimeout(this.roundTimer)
      this.roundTimer = null
    }
  }
}
