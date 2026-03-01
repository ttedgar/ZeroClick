import { Footer } from "../components/Footer.js"

export default function About() {
  return (
    <div className="min-h-dvh flex flex-col bg-gray-950">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">About ZeroClick</h1>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">What is ZeroClick?</h2>
            <p>
              ZeroClick is a real-time multiplayer browser game where precision meets competition. Players race to stop a countdown as close to 0.000 seconds as possible. The closer your click, the lower your score. Across multiple rounds, the player with the lowest cumulative score wins the game.
            </p>
            <p>
              Every millisecond counts. Every click matters. Can you master the timing?
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">How It Works</h2>
            <p>
              Create or join a room with friends. Set the number of rounds (1-5) and duration per round (1-30 seconds). When the game starts, watch the countdown and click the big red button at exactly the right moment. Miss by 1 millisecond? That counts. Get it perfect? Even better.
            </p>
            <p>
              After each round, scores are calculated and displayed. After all rounds complete, the leaderboard reveals the winner—and your score is recorded in the global records if you're good enough.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Why We Built This</h2>
            <p>
              We wanted to create a game that is simple to understand but difficult to master. No complex mechanics. No pay-to-win elements. Just you, the timer, and your reflexes against other players in real-time.
            </p>
            <p>
              ZeroClick is built with modern web technology to ensure fair, synchronized gameplay across the globe. Precision timing is guaranteed—no matter where you or your opponents are located.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Technology</h2>
            <p>
              ZeroClick is built on a full-stack JavaScript architecture:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Frontend:</strong> React with Vite for a fast, responsive user interface
              </li>
              <li>
                <strong>Backend:</strong> Node.js with Fastify for high-performance server handling
              </li>
              <li>
                <strong>Real-Time Communication:</strong> WebSockets via Socket.IO for instant game synchronization
              </li>
              <li>
                <strong>Database:</strong> PostgreSQL with Prisma for reliable score persistence
              </li>
              <li>
                <strong>Hosting:</strong> Railway for seamless, automated deployment
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Fair Play & Timing Synchronization</h2>
            <p>
              One of the biggest challenges in multiplayer games is ensuring fair timing across different latencies and clock offsets. ZeroClick solves this through client-side timestamp submission:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                When you click, we record the exact moment using your device's clock
              </li>
              <li>
                We estimate the server's clock offset to account for time differences
              </li>
              <li>
                The server uses your submitted timestamp (not when it received the request) to calculate your score
              </li>
              <li>
                This removes network latency from scoring, ensuring everyone plays fairly
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Global Leaderboards</h2>
            <p>
              Every completed game is recorded. The global leaderboards track:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Best Games:</strong> Lowest cumulative scores across a full game
              </li>
              <li>
                <strong>Best Rounds:</strong> Best single-round performances
              </li>
            </ul>
            <p>
              Can you make it to the top?
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Contact & Feedback</h2>
            <p>
              Have feedback, bug reports, or feature requests? <a href="/contact" className="text-indigo-400 hover:underline">Get in touch</a> with our team.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
