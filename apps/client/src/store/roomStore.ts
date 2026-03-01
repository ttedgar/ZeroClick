import { create } from "zustand"
import type {
  RoomState,
  RoundEndPayload,
  GameOverPayload,
  RoundStartPayload,
  StartingBeat,
} from "@zeroclick/shared"

interface RoomStore {
  room: RoomState | null
  mySocketId: string | null
  currentBeat: StartingBeat | null
  roundStartPayload: RoundStartPayload | null
  roundEndPayload: RoundEndPayload | null
  gameOverPayload: GameOverPayload | null
  clockOffset: number
  error: string | null

  setRoom: (room: RoomState) => void
  setMySocketId: (id: string) => void
  setCurrentBeat: (beat: StartingBeat | null) => void
  setRoundStart: (payload: RoundStartPayload) => void
  setRoundEnd: (payload: RoundEndPayload) => void
  setGameOver: (payload: GameOverPayload | null) => void
  setClockOffset: (offset: number) => void
  setError: (msg: string | null) => void
  reset: () => void
}

const initialState = {
  room: null,
  mySocketId: null,
  currentBeat: null,
  roundStartPayload: null,
  roundEndPayload: null,
  gameOverPayload: null,
  clockOffset: 0,
  error: null,
}

export const useRoomStore = create<RoomStore>((set) => ({
  ...initialState,
  setRoom: (room) => set({ room }),
  setMySocketId: (mySocketId) => set({ mySocketId }),
  setCurrentBeat: (currentBeat) => set({ currentBeat }),
  setRoundStart: (roundStartPayload) => set({ roundStartPayload }),
  setRoundEnd: (roundEndPayload) => set({ roundEndPayload }),
  setGameOver: (gameOverPayload) => set({ gameOverPayload }),
  setClockOffset: (clockOffset) => set({ clockOffset }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}))
