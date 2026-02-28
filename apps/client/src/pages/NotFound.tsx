import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-6">
      <h1 className="text-6xl font-bold text-gray-400">404</h1>
      <p className="text-gray-500">Page not found.</p>
      <Link to="/" className="text-indigo-400 hover:underline">
        Back to home
      </Link>
    </div>
  )
}
