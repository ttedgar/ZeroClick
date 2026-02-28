interface Props {
  hasClicked: boolean
  isActive: boolean
  onClick: () => void
}

export function ClickButton({ hasClicked, isActive, onClick }: Props) {
  function handleClick() {
    if (!isActive || hasClicked) return
    onClick()
  }

  return (
    <button
      onClick={handleClick}
      disabled={hasClicked || !isActive}
      className={`
        w-64 h-64 rounded-full text-2xl font-bold transition-all select-none
        ${hasClicked
          ? "bg-green-800 text-green-300 cursor-default scale-95"
          : isActive
          ? "bg-indigo-600 hover:bg-indigo-500 active:scale-90 cursor-pointer shadow-lg shadow-indigo-900"
          : "bg-gray-800 text-gray-600 cursor-not-allowed"
        }
      `}
    >
      {hasClicked ? "Clicked!" : isActive ? "CLICK" : "Wait…"}
    </button>
  )
}
