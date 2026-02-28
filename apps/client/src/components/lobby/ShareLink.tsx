import { useState } from "react"

export function ShareLink({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const url = `${window.location.origin}/room/${code}`

  function copy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col gap-1 items-center">
      <p className="text-xs text-gray-500 uppercase tracking-widest">Room Code</p>
      <div className="flex items-center gap-3">
        <span className="text-4xl font-bold tracking-[0.3em] text-indigo-300">{code}</span>
        <button
          onClick={copy}
          className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded transition-colors"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  )
}
