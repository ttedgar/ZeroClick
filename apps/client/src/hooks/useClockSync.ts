import { useEffect } from "react"
import { socket } from "../socket.js"
import { useRoomStore } from "../store/roomStore.js"
import { C_PING, S_PONG } from "@zeroclick/shared"
import type { PongPayload } from "@zeroclick/shared"
import { CLOCK_SYNC_SAMPLES } from "@zeroclick/shared"

export function useClockSync() {
  const setClockOffset = useRoomStore((s) => s.setClockOffset)

  useEffect(() => {
    const offsets: number[] = []

    function sendPing() {
      socket.emit(C_PING, { clientTs: Date.now() })
    }

    function handlePong(payload: PongPayload) {
      const now = Date.now()
      const rtt = now - payload.clientTs
      const offset = payload.serverTs - payload.clientTs - rtt / 2
      offsets.push(offset)

      if (offsets.length < CLOCK_SYNC_SAMPLES) {
        setTimeout(sendPing, 50)
      } else {
        const avg = offsets.reduce((a, b) => a + b, 0) / offsets.length
        setClockOffset(avg)
      }
    }

    socket.on(S_PONG, handlePong)
    sendPing()

    return () => {
      socket.off(S_PONG, handlePong)
    }
  }, [setClockOffset])
}
