import { useState } from "react"
import { Footer } from "../components/Footer.js"

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("https://formspree.io/f/maqdkozr", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        setSubmitted(true)
        e.currentTarget.reset()
      }
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col bg-gray-950">
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

        {submitted && (
          <div className="mb-8 p-4 bg-green-900 border border-green-700 rounded text-green-300">
            ✓ Thank you for your message! We'll get back to you soon.
          </div>
        )}

        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <p className="text-gray-400 mb-6">
            Have a question or feedback about ZeroClick? Fill out the form below and we'll respond as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="subject">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
                placeholder="What is this about?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-100 focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white font-bold py-3 rounded transition-colors"
            >
              {isLoading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
