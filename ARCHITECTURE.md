# ZeroClick — Architecture & Deployment Guide

## What is ZeroClick?

ZeroClick is a **real-time multiplayer browser game** where players compete to stop a countdown as close to 0.000 seconds as possible. The closer you get, the lower your score. Across multiple rounds, the player with the lowest cumulative score wins.

**Key numbers:**
- 1-5 rounds per game
- 1-30 seconds per round
- 8 players max per room
- Scores recorded in milliseconds (0.000s precision)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     INTERNET                                 │
│              hitzero.click (your domain)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS + WSS (encrypted)
                       │
        ┌──────────────┴──────────────┐
        │                             │
   ┌────▼─────────┐            ┌──────▼──────────┐
   │              │            │                 │
   │   RAILWAY    │            │   PORKBUN DNS   │
   │  (Hosting)   │            │  (Domain)       │
   │              │            │                 │
   │  ┌────────┐  │            └─────────────────┘
   │  │ Server │  │               (Points to Railway)
   │  │ Node.js│  │
   │  └────┬───┘  │
   │       │      │
   │  ┌────▼────────────────┐
   │  │   Neon Database     │
   │  │  (PostgreSQL)       │
   │  │ Leaderboard records │
   │  └─────────────────────┘
   │
   └──────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  PLAYER'S BROWSER (Client)                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React App                                             │ │
│  │  - Timer countdown display                            │ │
│  │  - Click button                                        │ │
│  │  - Player list / lobby                                │ │
│  │  - Leaderboard                                         │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## The Three Main Parts

### 1. **Client** (Browser / React)
**Location:** `apps/client/`
**What it does:** The user interface. Shows the countdown, the big red CLICK button, player list, and leaderboard.

**Key files:**
- `App.tsx` — router (home page, room page)
- `pages/Home.tsx` — create room / join room form
- `pages/Room.tsx` — the game view
- `components/game/GameView.tsx` — countdown + click button
- `socket.ts` — connection to the server
- `store/roomStore.ts` — shared state (what round is it, who clicked, etc.)

**Technologies:**
- **React** — UI framework
- **Vite** — fast build tool
- **Socket.IO Client** — real-time communication (see WebSockets section)
- **Zustand** — lightweight state management
- **Tailwind CSS** — styling

### 2. **Server** (Node.js / Fastify)
**Location:** `apps/server/`
**What it does:** The game logic engine. Manages rooms, timers, scores, and broadcasts game state to all players.

**Key files:**
- `index.ts` — starts the server
- `socket.ts` — sets up Socket.IO (listens for events)
- `handlers/` — what to do when events arrive (click, join, ready, etc.)
- `game/Room.ts` — the state machine that runs a game (LOBBY → STARTING → ROUND_ACTIVE → ROUND_RESULTS → repeat or GAME_OVER)
- `game/RoomManager.ts` — keeps track of all active rooms
- `game/scoring.ts` — calculates scores based on click time vs target time

**Technologies:**
- **Node.js** — JavaScript runtime
- **Fastify** — lightweight HTTP server
- **Socket.IO** — real-time communication (see WebSockets section)
- **Prisma** — database ORM (maps JavaScript to SQL)

### 3. **Database** (Neon / PostgreSQL)
**Location:** `apps/server/prisma/schema.prisma`
**What it stores:**
- `BestGame` — records of the best games (lowest total score across all rounds)
- `BestRound` — records of the best individual rounds (lowest single-round score)

**Why it's needed:**
- Persists the global leaderboard so it survives server restarts
- Shows all-time champions on the home page

**Technologies:**
- **Neon** — managed PostgreSQL database
- **Prisma** — generates SQL queries from TypeScript code

---

## Understanding WebSockets (The Real-Time Part)

### What Problem Does WebSocket Solve?

Normally, HTTP works like this:
1. Browser sends request to server ("what's the game state?")
2. Server responds
3. Connection closes
4. If the state changes, browser has to ask again (polling)

**Problem:** In a multiplayer game, waiting for the client to ask is too slow. If Player A clicks, we need Player B to know *instantly*, not after a 5-second delay.

### WebSocket Solution

WebSocket opens a **persistent, two-way connection** between client and server:

```
Browser                          Server
  │                                │
  ├──── WebSocket connects ──────→ │
  │                                │
  │ ← Player B clicks! (event) ─── ┤  Instant!
  │                                │
  ├──── I clicked! (event) ───────→ │
  │                                │
  │ ← Round results! (update) ───── ┤  Instant!
  │                                │
  └─────────────────────────────────┘
```

### How ZeroClick Uses WebSocket

**Socket.IO** is a library that wraps WebSocket and adds features like automatic reconnection.

**Server → Client (broadcasts):**
- `room_update` — "the lobby has a new player" / "round started"
- `round_start` — "go! timer started at time X"
- `player_clicked` — "Player B just clicked"
- `round_end` — "scores: Player A 0.045s, Player B 0.089s"
- `game_over` — "final leaderboard and game complete"

**Client → Server (events):**
- `create_room` — "create a room for me to host"
- `join_room` — "let me in this room by code"
- `set_ready` — "I'm ready to start"
- `click` — "I just clicked!" (includes client timestamp)
- `ping` — "what time is it on your clock?" (for sync)

---

## The Game Flow (With Information Flow)

### 1. **Creating a Room**

```
Client: "Create room, I'm Alice"
  ↓ (HTTP REST call or Socket.IO)
Server: Creates room ABC123, adds Alice
Server: Broadcasts room_update to Alice with room state
Client: Navigates to /room/ABC123
Alice's browser shows: Lobby with "Room code: ABC123" and a "Copy link" button
```

### 2. **Joining a Room**

```
Client (Bob): "Join room ABC123, I'm Bob"
  ↓ (Socket.IO)
Server: Finds room ABC123, adds Bob as player
Server: Broadcasts room_update to BOTH Alice and Bob
  ├─ Alice's browser: Updates player list (Alice, Bob)
  └─ Bob's browser: Updates player list (Alice, Bob)
```

### 3. **Starting the Game**

```
Alice clicks "Mark as Ready"
Client: Sends set_ready true to server
Server: Updates room state, broadcasts room_update
Bob's browser sees Alice is ready now

Bob also clicks "Mark as Ready"
Server: Sees all players ready, auto-starts the game
Server: Broadcasts READY beat to all players
  ├─ Alice sees big "READY" text
  └─ Bob sees big "READY" text

Server: Waits 1 second, broadcasts SET beat
Server: Waits 1 second, broadcasts GO beat + initiates round
```

### 4. **The Countdown (Critical Timing Part)**

**Clock Synchronization Problem:**
- Alice's browser clock might say 10:00:00.000
- Bob's browser clock might say 10:00:00.445 (445ms off!)
- If they both click at the same *real moment*, Alice's timer will show a different value than Bob's

**Solution: Client Timestamp Sending**

On connect, each client does a `ping/pong` dance:
1. Client sends: `ping { clientTs: 1000 }` (my local time)
2. Server responds: `pong { clientTs: 1000, serverTs: 1500 }` (you said 1000, I see 1500)
3. Client calculates: offset = 1500 - 1000 = +500ms (server is 500ms ahead)
4. Repeat 5 times, average the offsets

Now Alice knows: "When my clock says 10:00:00.000, the server thinks it's 10:00:00.500"

**During the Countdown:**

Server sends:
```javascript
round_start {
  startAt: 1704067200000,      // server's epoch time when round started
  durationMs: 3000,            // round lasts 3 seconds
  visibility: "timer"          // or "hidden"
}
```

Both clients calculate remaining time like this:
```javascript
adjustedNow = Date.now() + clockOffset
remaining = startAt + durationMs - adjustedNow
```

Both clients see nearly identical countdowns!

### 5. **Clicking (The Score is Born)**

```
Alice's browser at 2.089s shows "2.089"
Alice clicks the big red button

Client captures:
  clientTs = Date.now() + clockOffset (her estimate of server time at click)
Client freezes display at 2.089
Client sends: click { clientTs: 1704067202089 }

Server receives:
  receiveTime = Date.now() (server's clock when request arrived)
  clickTime = clientTs clamped to ±500ms of receiveTime
  score = |clickTime - startAt - durationMs|
    = |1704067202089 - 1704067200000 - 3000|
    = |2089 - 3000|
    = 911ms

Server broadcasts: player_clicked { playerName: "Alice" }
All browsers show: "Alice has clicked ✓"

Server broadcasts: room_update with hasClickedThisRound: true for Alice
Alice's display still shows frozen 2.089 (she's done, can't click again)
```

**Why this design?**
- Client timestamp removes network latency from the score
- The ±500ms clamp prevents cheating (can't claim you clicked in the future)
- The frozen display matches the server's calculation, so no "surprise" score difference

### 6. **Round Results**

```
After 3 seconds OR all players clicked, server ends round:

Server calculates scores:
  Alice: 911ms (off by 911ms)
  Bob: 45ms (off by 45ms)

Server broadcasts: round_end {
  round: 1,
  scores: [
    { playerName: "Bob", score: 45, rank: 1 },
    { playerName: "Alice", score: 911, rank: 2 }
  ]
}

Client shows: Results table with scores and rankings
After 3 seconds, automatically starts next round
```

### 7. **Game Over**

```
After round 3 (assuming 3-round game):

Server broadcasts: game_over {
  scores: [...],
  sessionLeaderboard: [
    { playerName: "Bob", totalScore: 234 },
    { playerName: "Alice", totalScore: 1045 }
  ],
  globalBestGame: [...],      // from database
  globalBestRound: [...]      // from database
}

Server inserts into database:
  INSERT BestGame (playerName, totalScore, rounds, achievedAt)
  VALUES ("Bob", 234, 3, now())

Client shows: Final leaderboard + all-time records
Players see: "Bob Wins!" + links to go home or play again
```

---

## Deployment Pipeline

### What is DevOps?

DevOps = **Dev**elopment + **Op**erations. It's the practice of automating how code goes from your laptop → to production (live servers).

Manual DevOps: "Let me SSH into the server, git pull, run npm build..." — tedious and error-prone.

Automated DevOps: "I push to GitHub, the platform automatically tests, builds, and deploys." — fast and reliable.

### How ZeroClick Deploys

```
┌──────────────────┐
│   Your GitHub    │
│   Repository     │
└────────┬─────────┘
         │ (You push code)
         ▼
┌──────────────────────────┐
│    Railway Platform      │
│  (Hosting automation)    │
│                          │
│  1. Detects push         │
│  2. Pulls your code      │
│  3. Runs Dockerfile:     │
│     - npm install        │
│     - pnpm build         │
│     - prisma generate    │
│     - tsc (TypeScript)   │
│  4. Builds Docker image  │
│  5. Starts container     │
│  6. Health check: /health
│  7. Ready for traffic!   │
└──────────────┬───────────┘
               │
               ▼
         Your app is live!
```

### The Dockerfile (Build Instructions)

The `Dockerfile` is a recipe that tells Railway how to package your app:

```dockerfile
FROM node:20-alpine          # Start with Node.js 20
RUN apk add openssl          # Install OpenSSL (Prisma needs it)
COPY package.json .          # Copy dependency list
RUN pnpm install             # Download dependencies
COPY . .                      # Copy all code
RUN pnpm build               # Compile TypeScript
CMD node apps/server/dist/index.js  # Start the server
```

**The build happens in Railway's servers, not yours.** You don't need Node.js or pnpm locally to deploy — Railway handles it.

### Environment Variables (Secrets)

In Railway's **Settings → Variables**, you set:
```
DATABASE_URL=postgresql://user:pass@...
NODE_ENV=production
```

These are **not in GitHub** (they're secrets!). Railway injects them into the running container.

---

## The Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Opens                               │
│                     hitzero.click                               │
└────────────────┬────────────────────────────────────────────────┘
                 │
         ┌───────▼────────┐
         │  Browser loads │
         │  index.html    │
         │  (served by    │
         │   server)      │
         └───────┬────────┘
                 │
         ┌───────▼────────────────┐
         │  React app boots up    │
         │  Connects via          │
         │  Socket.IO to server   │
         └───────┬────────────────┘
                 │
    ┌────────────┼────────────────┐
    │            │                │
    ▼            ▼                ▼
 Create       Join          ping/pong
 room         room        (clock sync)
    │            │                │
    └────────────┼────────────────┘
                 │
         ┌───────▼────────────┐
         │  room_update       │
         │  round_start       │
         │  player_clicked    │
         │  round_end         │
         │  game_over         │
         │  (all via Socket)  │
         └───────┬────────────┘
                 │
                 ├─ Displays in browser
                 │
                 └─ On game_over:
                    Server saves to Neon DB
                    Client fetches leaderboard via REST
```

---

## Key Takeaways

1. **WebSocket = Real-Time Two-Way Messaging**
   - Server can push updates instantly (no polling)
   - Feels seamless and live

2. **Clock Synchronization = Fair Scoring**
   - ping/pong measures clock drift
   - Client and server agree on the click moment
   - Makes scores honest despite network latency

3. **Docker = Reproducible Deployment**
   - Same build process every time
   - No "it works on my machine" problems
   - Railway handles the infrastructure

4. **Leaderboard = Persistent State**
   - Neon PostgreSQL stores top scores
   - Survives server restarts
   - Global records across all games

5. **The Client and Server Working Together**
   - Client: UI, user input, local timing, display
   - Server: Game logic, truth keeper, broadcasting
   - Database: Long-term storage of scores
