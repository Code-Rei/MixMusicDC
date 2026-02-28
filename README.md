<h1 align="center">🎵 MixMusicDC</h1>
<p align="center">A full-featured Discord music bot — YouTube, SoundCloud, Spotify links & more</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Discord.js-v14-5865F2?logo=discord&logoColor=white" />
  <img src="https://img.shields.io/badge/DisTube-v5-1DB954" />
  <img src="https://img.shields.io/badge/yt--dlp-powered-FF0000?logo=youtube&logoColor=white" />
  <img src="https://img.shields.io/badge/Hosted%20on-Render-46E3B7?logo=render&logoColor=white" />
</p>

---

## ✨ Features

- 🎵 **Multi-platform** — YouTube, SoundCloud, direct URLs & Spotify links (via yt-dlp)
- 🎛️ **18 Audio Filters** — Bassboost, Nightcore, Vaporwave, Karaoke, 3D & more
- 📋 **Full Queue Management** — Paginated queue, shuffle, loop, move, remove
- 📝 **Lyrics** — Fetch lyrics via Genius API
- 🔍 **Interactive Search** — Pick a result from a dropdown select menu
- 🤖 **Autoplay** — Auto-queue related songs when queue empties
- 🟢 **Keep-Alive** — Self-ping server to prevent Render free tier spin-down
- ⚡ **20 Slash Commands** — Modern Discord slash command interface

---

## 📋 Commands

| Command                  | Description                              |
| ------------------------ | ---------------------------------------- |
| `/play <query>`          | Play a song by name, URL, or playlist    |
| `/pause`                 | Pause playback                           |
| `/resume`                | Resume paused playback                   |
| `/stop`                  | Stop music and clear the queue           |
| `/skip`                  | Skip to the next song                    |
| `/seek <seconds>`        | Jump to a position in the current song   |
| `/queue [page]`          | Show the paginated queue                 |
| `/nowplaying`            | Current song with progress bar           |
| `/volume <1-100>`        | Set the playback volume                  |
| `/loop <mode>`           | Loop: off / song / queue                 |
| `/shuffle`               | Shuffle the queue                        |
| `/remove <position>`     | Remove a song from the queue             |
| `/move <from> <to>`      | Reorder a song in the queue              |
| `/filter set/clear/list` | Apply, remove, or list audio filters     |
| `/autoplay`              | Toggle autoplay on/off                   |
| `/search <query>`        | Search YouTube and pick from results     |
| `/playlist`              | View current queue as a playlist summary |
| `/lyrics [song]`         | Fetch lyrics (Genius API)                |
| `/ping`                  | Check bot latency                        |
| `/help`                  | List all commands                        |

---

## 🚀 Full Setup Guide

### Prerequisites

Make sure you have the following installed before starting:

- **[Node.js v18+](https://nodejs.org/)** — Check with `node -v`
- **npm** — Comes with Node.js, check with `npm -v`
- **Git** — [git-scm.com](https://git-scm.com/)

> FFmpeg and yt-dlp are **automatically bundled** via `ffmpeg-static` and `@distube/yt-dlp` — no manual install needed.

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/yourusername/MixMusicDC.git
cd MixMusicDC
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

---

### Step 3 — Create a Discord Bot

1. Go to the **[Discord Developer Portal](https://discord.com/developers/applications)**
2. Click **New Application** → give it a name
3. Go to the **Bot** tab → click **Add Bot** → confirm
4. Under **Token**, click **Reset Token** and copy it → this is your `DISCORD_TOKEN`
5. Scroll down and enable these **Privileged Gateway Intents**:
   - ✅ Server Members Intent
   - ✅ Message Content Intent
6. Go to **OAuth2 → General** → copy the **Client ID** → this is your `CLIENT_ID`

---

### Step 4 — Invite the Bot to Your Server

1. In the Developer Portal, go to **OAuth2 → URL Generator**
2. Under **Scopes**, select: `bot` and `applications.commands`
3. Under **Bot Permissions**, select:
   - `Send Messages`
   - `Embed Links`
   - `Connect`
   - `Speak`
   - `Use Voice Activity`
4. Copy the generated URL and open it in your browser
5. Select your server and click **Authorize**

---

### Step 5 — Configure Environment Variables

Copy the example env file:

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Open `.env` and fill in the values:

```env
# ── Required ──────────────────────────────────────────
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_client_id_here

# ── For /deploy-commands:guild (instant, for testing) ─
GUILD_ID=your_test_server_id_here

# ── Optional: Lyrics via /lyrics command ──────────────
GENIUS_API_KEY=your_genius_api_key_here

# ── Optional: Keep-alive on Render ────────────────────
PORT=3000
RENDER_URL=https://your-app.onrender.com
```

#### Where to get each value:

| Variable         | How to get it                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `DISCORD_TOKEN`  | Developer Portal → Your App → Bot → Reset Token                                                |
| `CLIENT_ID`      | Developer Portal → Your App → OAuth2 → Client ID                                               |
| `GUILD_ID`       | Discord: Right-click your server → Copy Server ID (enable Dev Mode first)                      |
| `GENIUS_API_KEY` | [genius.com/api-clients](https://genius.com/api-clients) → Create Client → Client Access Token |
| `RENDER_URL`     | Your Render.com app URL (set after deployment)                                                 |

> **How to find your Guild/Server ID in Discord:**
> Go to Discord Settings → Advanced → Enable **Developer Mode**. Then right-click your server icon → **Copy Server ID**.

---

### Step 6 — Register Slash Commands

You must register commands with Discord before they appear in your server. This only needs to be done once (or when you add new commands).

**Option A — Guild only (instant, recommended for testing):**

```bash
npm run deploy-commands:guild
```

> Requires `GUILD_ID` to be set in your `.env`

**Option B — Global (available in all servers, takes up to 1 hour):**

```bash
npm run deploy-commands
```

---

### Step 7 — Run the Bot

**Development mode** (auto-restarts on file changes):

```bash
npm run dev
```

**Production mode:**

```bash
npm start
# or
node src/index.js
```

You should see output like:

```
[CMD] Loaded: /help
[CMD] Loaded: /play
... (all 20 commands)
[EVT] Loaded: clientReady
[EVT] Loaded: interactionCreate
[DISTUBE] Loaded: playSong
... (all 6 DisTube events)
[SERVER] Keep-alive server running on port 3000
[BOT] ✅ YourBot#1234 is online and ready!
[BOT] Serving 1 guild(s)
```

---

## ☁️ Deploy to Render (Free Hosting)

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2 — Create a Web Service on Render

1. Go to **[render.com](https://render.com)** → Sign up / Log in
2. Click **New +** → **Web Service**
3. Connect your GitHub account and select your repository
4. Render will auto-detect `render.yaml` — the settings are pre-configured

### Step 3 — Set Environment Variables on Render

In the Render dashboard for your service, go to **Environment** and add:

| Key              | Value                                                       |
| ---------------- | ----------------------------------------------------------- |
| `DISCORD_TOKEN`  | Your bot token                                              |
| `CLIENT_ID`      | Your app's Client ID                                        |
| `GUILD_ID`       | _(optional)_ Your server ID                                 |
| `GENIUS_API_KEY` | _(optional)_ Genius API key                                 |
| `RENDER_URL`     | Your Render app URL, e.g. `https://mixmusicdc.onrender.com` |

### Step 4 — Deploy

Click **Deploy** — Render will install dependencies and start the bot automatically.

### Keep-Alive (Prevent Render Spin-Down)

Render's free tier spins down services after 15 minutes of inactivity. MixMusicDC has a built-in keep-alive system:

- **Internal self-ping**: `server.js` automatically pings `/health` every 14 minutes using `node-cron`
- **GitHub Actions** (optional extra layer): The workflow in `.github/workflows/` pings your Render URL on a schedule

> Set `RENDER_URL` to your actual Render URL (not `localhost`) to activate the self-ping.

---

## 📁 Project Structure

```
MixMusicDC/
├── src/
│   ├── index.js                # Entry point
│   ├── bot.js                  # Discord client + DisTube setup + loader
│   ├── config.js               # Colors, emojis, filters, defaults
│   ├── server.js               # Express keep-alive server
│   ├── deploy-commands.js      # Slash command registration script
│   ├── commands/
│   │   ├── general/
│   │   │   ├── help.js
│   │   │   └── ping.js
│   │   └── music/
│   │       ├── autoplay.js
│   │       ├── filter.js
│   │       ├── loop.js
│   │       ├── lyrics.js
│   │       ├── move.js
│   │       ├── nowplaying.js
│   │       ├── pause.js
│   │       ├── play.js
│   │       ├── playlist.js
│   │       ├── queue.js
│   │       ├── remove.js
│   │       ├── resume.js
│   │       ├── search.js
│   │       ├── seek.js
│   │       ├── shuffle.js
│   │       ├── skip.js
│   │       ├── stop.js
│   │       └── volume.js
│   ├── events/
│   │   ├── clientReady.js      # Bot ready event
│   │   ├── interactionCreate.js # Slash command router
│   │   └── distube/
│   │       ├── addList.js
│   │       ├── addSong.js
│   │       ├── disconnect.js
│   │       ├── error.js
│   │       ├── finish.js
│   │       └── playSong.js
│   └── utils/
│       ├── embed.js            # Embed builders
│       └── formatDuration.js   # Time formatter
├── .env                        # Your secrets (never commit this)
├── .env.example                # Template for .env
├── .github/workflows/          # GitHub Actions keep-alive
├── render.yaml                 # Render deployment config
└── package.json
```

---

## 🔧 npm Scripts

| Script                          | Command                               | Description                               |
| ------------------------------- | ------------------------------------- | ----------------------------------------- |
| `npm start`                     | `node src/index.js`                   | Run the bot                               |
| `npm run dev`                   | `nodemon src/index.js`                | Run with auto-restart                     |
| `npm run deploy-commands`       | `node src/deploy-commands.js`         | Register commands globally                |
| `npm run deploy-commands:guild` | `node src/deploy-commands.js --guild` | Register commands in one server (instant) |

---

## 🛠️ Troubleshooting

**Bot is online but slash commands don't appear**

> Run `npm run deploy-commands:guild` with your `GUILD_ID` set. Global registration can take up to 1 hour.

**`Error: Cannot find module '...'`**

> Run `npm install` to install all dependencies.

**Bot joins voice but no audio plays**

> - Make sure the bot has **Connect** and **Speak** permissions in the voice channel
> - Try a direct YouTube URL instead of a search term to isolate the issue
> - yt-dlp updates automatically on next start if it's outdated

**`Login failed: TOKEN_INVALID`**

> Your `DISCORD_TOKEN` in `.env` is wrong or expired. Reset it in the Developer Portal and update `.env`.

**`/lyrics` returns "API key not set"**

> Add your `GENIUS_API_KEY` to `.env`. Get one free at [genius.com/api-clients](https://genius.com/api-clients).

---

## 📄 License

MIT © MixMusicDC
