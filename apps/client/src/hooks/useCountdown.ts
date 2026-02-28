import { useEffect, useRef, useState } from "react"
import { MISS_PENALTY_MS } from "@zeroclick/shared"

export function useCountdown(
  startAt: number | null,
  durationMs: number | null,
  clockOffset: number,
  stopped: boolean,
): number {
  const [remaining, setRemaining] = useState(durationMs ?? 0)
  const rafRef = useRef<number | null>(null)
  const stoppedRef = useRef(stopped)
  stoppedRef.current = stopped

  useEffect(() => {
    if (startAt === null || durationMs === null) return

    function tick() {
      if (stoppedRef.current) return

      const adjustedNow = Date.now() + clockOffset
      const left = Math.round(durationMs! - (adjustedNow - startAt!))
      const clamped = Math.max(-MISS_PENALTY_MS, left)
      setRemaining(clamped)

      if (clamped > -MISS_PENALTY_MS) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [startAt, durationMs, clockOffset])

  return remaining
}
