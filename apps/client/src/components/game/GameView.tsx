import { useState } from "react"
import { socket } from "../../socket.js"
import { useRoomStore } from "../../store/roomStore.js"
import { useCountdown } from "../../hooks/useCountdown.js"
import { C_CLICK } from "@zeroclick/shared"
import { ReadySetGo } from "./ReadySetGo.js"
import { CountdownDisplay } from "./CountdownDisplay.js"
import { ClickButton } from "./ClickButton.js"

export function GameView() {
  const { room, mySocketId, currentBeat, roundStartPayload, clockOffset } = useRoomStore()
  const [frozenRemaining, setFrozenRemaining] = useState<number | null>(null)

  if (!room) return null

  const me = room.players.find((p) => p.id === mySocketId)
  const hasClicked = frozenRemaining !== null || (me?.hasClickedThisRound ?? false)
  const isRoundActive = room.phase === "ROUND_ACTIVE"

  const rawRemaining = useCountdown(
    roundStartPayload?.startAt ?? null,
    roundStartPayload?.durationMs ?? null,
    clockOffset,
    hasClicked,
  )

  const displayRemaining = frozenRemaining ?? rawRemaining

  function handleClick() {
    if (!roundStartPayload) return
    // Compute our best estimate of server time right now
    const clientTs = Date.now() + clockOffset
    // Freeze display at this same value — matches what server will use for scoring
    const frozen = roundStartPayload.durationMs - (clientTs - roundStartPayload.startAt)
    setFrozenRemaining(frozen)
    socket.emit(C_CLICK, { clientTs })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-10 px-4">
      <ReadySetGo beat={currentBeat} />

      <div className="text-center">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
          Round {room.currentRound} of {room.totalRounds}
        </p>
      </div>

      <CountdownDisplay
        remainingMs={displayRemaining}
        visibility={roundStartPayload?.visibility ?? "timer"}
        hasClicked={hasClicked}
        durationSeconds={room.settings.durationSeconds}
      />

      <ClickButton
        hasClicked={hasClicked}
        isActive={isRoundActive}
        onClick={handleClick}
      />

      <div className="flex gap-6">
        {room.players.map((p) => (
          <div key={p.id} className="text-center">
            <p className={`text-xs ${p.id === mySocketId ? "text-indigo-300" : "text-gray-400"}`}>
              {p.name}
            </p>
            <p className="text-xs text-gray-600">
              {p.hasClickedThisRound ? "✓" : "…"}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
