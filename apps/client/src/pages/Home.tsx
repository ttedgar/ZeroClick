import { useState } from "react"
import { CreateRoomForm } from "../components/home/CreateRoomForm.js"
import { QuickPlayButton } from "../components/home/QuickPlayButton.js"
import { LeaderboardTable } from "../components/home/LeaderboardTable.js"

type Tab = "create" | "join"

export default function Home() {
  const [tab, setTab] = useState<Tab>("create")

  return (
    <div className="flex flex-col items-center min-h-dvh px-4 py-12 gap-10">
      <header className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          zero<span className="text-indigo-400">.</span>click
        </h1>
        <p className="mt-2 text-gray-400">Stop the countdown as close to 0.000 as possible.</p>
        <p className="text-gray-500 text-sm mt-1">Lowest cumulative score wins.</p>
      </header>

      <div className="w-full max-w-sm">
        <div className="flex border-b border-gray-800 mb-6">
          <button
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              tab === "create" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-500 hover:text-gray-300"
            }`}
            onClick={() => setTab("create")}
          >
            Create Room
          </button>
          <button
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              tab === "join" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-500 hover:text-gray-300"
            }`}
            onClick={() => setTab("join")}
          >
            Join Room
          </button>
        </div>
        {tab === "create" ? <CreateRoomForm /> : <QuickPlayButton />}
      </div>

      <section className="w-full max-w-2xl">
        <h2 className="text-xs text-gray-500 uppercase tracking-widest mb-4 text-center">Global Leaderboard</h2>
        <LeaderboardTable />
      </section>
    </div>
  )
}
