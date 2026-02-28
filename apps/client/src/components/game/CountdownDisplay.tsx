import type { TimerVisibility } from "@zeroclick/shared"

interface Props {
  remainingMs: number
  visibility: TimerVisibility
  hasClicked: boolean
  durationSeconds?: number
}

function pad(n: number, digits: number): string {
  return n.toString().padStart(digits, "0")
}

function formatTime(ms: number): string {
  const rounded = Math.round(ms)
  const sign = rounded < 0 ? "-" : ""
  const abs = Math.abs(rounded)
  const secs = Math.floor(abs / 1000)
  const millis = abs % 1000
  return `${sign}${secs}.${pad(millis, 3)}`
}

export function CountdownDisplay({ remainingMs, visibility, hasClicked, durationSeconds }: Props) {
  if (visibility === "hidden" && !hasClicked) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="text-6xl font-bold text-gray-700">?.???</div>
        <p className="text-xs text-gray-600 uppercase tracking-widest">Timer hidden</p>
        {durationSeconds !== undefined && (
          <p className="text-xs text-gray-700 mt-1">Round is {durationSeconds}s long</p>
        )}
      </div>
    )
  }

  const color =
    remainingMs > 3000 ? "text-gray-100" : remainingMs > 0 ? "text-yellow-400" : "text-red-400"

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`text-7xl font-bold tabular-nums transition-colors ${color}`}>
        {formatTime(remainingMs)}
      </div>
      <p className="text-xs text-gray-500 uppercase tracking-widest">seconds remaining</p>
    </div>
  )
}
