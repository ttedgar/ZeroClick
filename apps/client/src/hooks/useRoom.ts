import { useEffect } from "react"
import { socket } from "../socket.js"
import { useRoomStore } from "../store/roomStore.js"
import {
  S_ROOM_UPDATE,
  S_ROUND_STARTING,
  S_ROUND_START,
  S_ROUND_END,
  S_GAME_OVER,
  S_ERROR,
} from "@zeroclick/shared"
import type {
  RoomState,
  RoundStartingPayload,
  RoundStartPayload,
  RoundEndPayload,
  GameOverPayload,
  ErrorPayload,
} from "@zeroclick/shared"

export function useRoom() {
  const { setRoom, setMySocketId, setCurrentBeat, setRoundStart, setRoundEnd, setGameOver, setError } =
    useRoomStore()

  useEffect(() => {
    function onConnect() {
      setMySocketId(socket.id ?? "")
    }

    function onRoomUpdate(state: RoomState) {
      setRoom(state)
    }

    function onRoundStarting(payload: RoundStartingPayload) {
      setCurrentBeat(payload.beat)
    }

    function onRoundStart(payload: RoundStartPayload) {
      setCurrentBeat(null)
      setRoundStart(payload)
    }

    function onRoundEnd(payload: RoundEndPayload) {
      setRoundEnd(payload)
    }

    function onGameOver(payload: GameOverPayload) {
      setGameOver(payload)
    }

    function onError(payload: ErrorPayload) {
      setError(payload.message)
    }

    socket.on("connect", onConnect)
    socket.on(S_ROOM_UPDATE, onRoomUpdate)
    socket.on(S_ROUND_STARTING, onRoundStarting)
    socket.on(S_ROUND_START, onRoundStart)
    socket.on(S_ROUND_END, onRoundEnd)
    socket.on(S_GAME_OVER, onGameOver)
    socket.on(S_ERROR, onError)

    return () => {
      socket.off("connect", onConnect)
      socket.off(S_ROOM_UPDATE, onRoomUpdate)
      socket.off(S_ROUND_STARTING, onRoundStarting)
      socket.off(S_ROUND_START, onRoundStart)
      socket.off(S_ROUND_END, onRoundEnd)
      socket.off(S_GAME_OVER, onGameOver)
      socket.off(S_ERROR, onError)
    }
  }, [setRoom, setMySocketId, setCurrentBeat, setRoundStart, setRoundEnd, setGameOver, setError])
}
