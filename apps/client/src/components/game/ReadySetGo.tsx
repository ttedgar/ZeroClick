import type { StartingBeat } from "@zeroclick/shared"

const beatStyles: Record<StartingBeat, string> = {
  READY: "text-gray-400",
  SET: "text-yellow-400",
  GO: "text-green-400",
}

export function ReadySetGo({ beat }: { beat: StartingBeat | null }) {
  if (!beat) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 pointer-events-none">
      <span
        className={`text-7xl font-bold tracking-wider animate-pulse ${beatStyles[beat]}`}
      >
        {beat}
      </span>
    </div>
  )
}
