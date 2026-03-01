export type TimerVisibility = "timer" | "hidden"
export type RoomPhase =
  | "LOBBY"
  | "STARTING"
  | "ROUND_ACTIVE"
  | "ROUND_RESULTS"
  | "GAME_OVER"

export type StartingBeat = "READY" | "SET" | "GO"

export interface GameSettings {
  rounds: number
  durationSeconds: number
  visibility: TimerVisibility
}

export interface Player {
  id: string
  name: string
  isReady: boolean
  isCreator: boolean
  roundScores: number[]
  totalScore: number
  hasClickedThisRound: boolean
}

export interface RoomState {
  code: string
  phase: RoomPhase
  settings: GameSettings
  players: Player[]
  currentRound: number
  totalRounds: number
}

// Socket payload types
export interface UpdateSettingsPayload {
  settings: Partial<GameSettings>
}

export interface CreateRoomPayload {
  name: string
  settings?: Partial<GameSettings>
}

export interface JoinRoomPayload {
  code: string
  name: string
}

export interface PingPayload {
  clientTs: number
}

export interface PongPayload {
  clientTs: number
  serverTs: number
}

export interface RoundStartingPayload {
  beat: StartingBeat
}

export interface RoundStartPayload {
  round: number
  startAt: number // server timestamp (ms)
  durationMs: number
  visibility: TimerVisibility
}

export interface PlayerClickedPayload {
  playerId: string
  playerName: string
}

export interface RoundScore {
  playerId: string
  playerName: string
  score: number // ms, MISS_PENALTY_MS if missed
  isMiss: boolean
  roundRank: number
}

export interface RoundEndPayload {
  round: number
  scores: RoundScore[]
}

export interface LeaderboardEntry {
  rank: number
  playerName: string
  totalScore: number
  rounds: number
  achievedAt: string
}

export interface BestRoundEntry {
  rank: number
  playerName: string
  roundScore: number
  achievedAt: string
}

export interface GameOverPayload {
  scores: RoundScore[]
  winnerId: string
  sessionLeaderboard: Array<{ playerId: string; playerName: string; totalScore: number }>
  globalBestGame: LeaderboardEntry[]
  globalBestRound: BestRoundEntry[]
}

export interface ErrorPayload {
  message: string
}
