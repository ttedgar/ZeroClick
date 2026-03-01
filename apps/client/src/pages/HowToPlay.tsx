import { Footer } from "../components/Footer.js"

export default function HowToPlay() {
  return (
    <div className="min-h-dvh flex flex-col bg-gray-950">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">How to Play ZeroClick</h1>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">The Goal</h2>
            <p>
              Stop a countdown timer as close to <span className="text-indigo-300 font-mono">0.000</span> seconds as possible. Your score is how many milliseconds you're off from zero. The lower your score, the better. Across multiple rounds, whoever has the lowest total score wins.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Step 1: Create or Join a Room</h2>
            <p>
              <strong>Creating a Room:</strong> On the home page, fill in your name, choose the number of rounds (1–5) and how long each round lasts (1–30 seconds). Click "Create Room" to get a 6-character room code. Share this code with friends.
            </p>
            <p>
              <strong>Joining a Room:</strong> Switch to the "Join Room" tab, enter the room code and your name, then hit "Join Room." You'll be added to the lobby.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Step 2: The Lobby</h2>
            <p>
              Once in the room, you'll see:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>The room code (so you can share the link with others)</li>
              <li>A list of players currently in the room</li>
              <li>Game settings (rounds, duration, timer visibility)</li>
              <li>A "Mark as Ready" button</li>
            </ul>
            <p>
              Click "Mark as Ready" when you're prepared to play. If you're the room creator, you can also click "Force Start" to begin the game without waiting for everyone to be ready.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Step 3: The Starting Sequence</h2>
            <p>
              Once all players are ready (or the creator forces start), you'll see a 3-beat countdown:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><span className="text-gray-400">READY</span> (1 second)</li>
              <li><span className="text-yellow-400">SET</span> (1 second)</li>
              <li><span className="text-green-400">GO</span> (round starts!)</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Step 4: The Countdown</h2>
            <p>
              The countdown displays in the format <span className="text-indigo-300 font-mono">M.NNN</span> where M is seconds and NNN is milliseconds. The timer counts down from your chosen duration (e.g., 3.000 seconds) toward 0.000.
            </p>
            <p>
              <strong>Timer Modes:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Visible Timer:</strong> You can see the countdown. Use it to judge when to click.
              </li>
              <li>
                <strong>Hidden Timer:</strong> The timer is hidden until you click. You have to feel the timing by instinct. After you click, the timer reveals your score.
              </li>
            </ul>
            <p>
              Watch the color:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><span className="text-gray-300">Gray</span> = Plenty of time (more than 3 seconds)</li>
              <li><span className="text-yellow-300">Yellow</span> = Getting close (1-3 seconds)</li>
              <li><span className="text-red-400">Red</span> = Very close or past zero</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Step 5: Click!</h2>
            <p>
              When you think the timer is at (or as close as possible to) 0.000 seconds, click the big red <strong>CLICK</strong> button. Your score is calculated as the absolute difference between where you clicked and 0.000.
            </p>
            <p>
              <strong>Examples:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You click at 0.001s → score = 1ms (excellent!)</li>
              <li>You click at 0.045s → score = 45ms (good)</li>
              <li>You click at 1.234s → score = 1234ms (oops, too early)</li>
            </ul>
            <p>
              If you don't click before the timer ends (2 seconds after zero), you'll get a miss penalty of 2000ms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Step 6: Round Results</h2>
            <p>
              After all players click (or the timer expires), you'll see the round results:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Each player's score for that round</li>
              <li>Rankings (who did best/worst)</li>
              <li>Running total scores</li>
            </ul>
            <p>
              After 3 seconds, the next round automatically starts. You can play up to 5 rounds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Step 7: Game Over & Leaderboard</h2>
            <p>
              Once all rounds are complete, you'll see:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Final game rankings with cumulative scores</li>
              <li>The game winner 🏆</li>
              <li>All-time global best games and best rounds (if your score made the list)</li>
            </ul>
            <p>
              Click "Play Again" to go back to the home page and start a new game.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Gaming Tips</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Practice:</strong> Play solo rounds to get a feel for your reaction time and the rhythm of the timer.
              </li>
              <li>
                <strong>Focus:</strong> Concentrate on the countdown. Mental distractions = sloppy clicks.
              </li>
              <li>
                <strong>Hidden Mode Challenge:</strong> If the timer is hidden, rely on your instincts and muscle memory. It's harder but more rewarding.
              </li>
              <li>
                <strong>Consistency:</strong> Aim for consistent scores across rounds rather than chasing one perfect click.
              </li>
              <li>
                <strong>Watch Others:</strong> On the player list, you'll see who's already clicked. Don't let peer pressure rush you!
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Scoring Explained</h2>
            <p>
              Your score for each round is calculated as:
            </p>
            <p className="text-center text-indigo-300 font-mono text-lg my-4">
                Score = |Your Click Time - Zero|
            </p>
            <p>
              Lower scores are better. After all rounds, your total score is the sum of all individual round scores. The player with the lowest total score at the end wins the game.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Fair Play & Timing</h2>
            <p>
              ZeroClick uses advanced clock synchronization to ensure fair timing for all players, regardless of ping or network latency. Your click time is recorded on your device and sent to the server, not the other way around. This means:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Players with higher ping aren't penalized</li>
              <li>Scores are based on your actual click moment, not when the server received it</li>
              <li>Everyone experiences the game fairly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Questions?</h2>
            <p>
              If you run into issues or have feedback, <a href="/contact" className="text-indigo-400 hover:underline">contact us</a>. We're always improving ZeroClick!
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
