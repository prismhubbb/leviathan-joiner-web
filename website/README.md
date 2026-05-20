# Leviathan Joiner - Website Dashboard

Professional dashboard with Discord OAuth, real-time hit feed, plan management, and marketplace.

## Features

- **Discord OAuth Login** — Users log in with Discord, get automatic API key
- **Live Hit Feed** — Shows top hits from scanners in real-time
- **Dashboard** — Stats, bots running chart, top 10 depositors
- **Settings** — Configure hit delay (0-10s)
- **Purchase Plan** — Free, Basic, Premium tiers
- **Marketplace** — Rent your plan to others by the hour
- **Connected Users** — See all accounts linked to your Discord

## Prerequisites

1. **Discord Application** (for OAuth)
   - Go to https://discord.com/developers/applications
   - Create New Application
   - OAuth2 → Redirects: Add `http://localhost:3000/login` (and your Vercel domain later)
   - Copy Client ID and Client Secret

2. **Backend API Running**
   - Your Node.js API server on your VPS/PC
   - Must have the `/api/auth/register` endpoint added (see `.setup-notes.txt`)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://YOUR_VPS_IP:3000
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
NEXTAUTH_SECRET=generate-a-long-random-string
NEXTAUTH_URL=http://localhost:3000
```

### 3. Update your API server
Add this endpoint to your `api/server.js`:

```javascript
app.post('/api/auth/register', botAuth, (req, res) => {
  const { discordId, username, avatar } = req.body
  if (!discordId || !username) {
    return res.status(400).json({ error: 'Missing fields' })
  }
  let plan = plans[discordId]
  if (!plan) {
    const apiKey = uuidv4()
    plan = {
      robloxUserId: discordId,
      discordId,
      username,
      avatar,
      tier: 'free',
      slots: 1,
      createdAt: Date.now(),
      expiresAt: Date.now() + (365 * 86400000),
      apiKey,
      balance: 0,
    }
    plans[discordId] = plan
    apiKeys[apiKey] = discordId
  }
  res.json({
    apiKey: plan.apiKey,
    plan: plan.tier,
    balance: plan.balance || 0,
  })
})
```

### 4. Run locally
```bash
npm run dev
```

Visit `http://localhost:3000` → Click "Login with Discord"

## Deployment on Vercel

### 1. Push to GitHub
```bash
cd website
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/brainrot-web.git
git push -u origin main
```

### 2. Import on Vercel
- Go to vercel.com
- Click "Import Project"
- Select your GitHub repo
- Root Directory: `website/`
- Environment Variables:
  - `NEXT_PUBLIC_API_URL`: Your API server IP/domain
  - `NEXT_PUBLIC_DISCORD_CLIENT_ID`: From Discord dev portal
  - `DISCORD_CLIENT_SECRET`: From Discord dev portal
  - `NEXTAUTH_SECRET`: Generate a random 32-char string
  - `NEXTAUTH_URL`: Your Vercel domain (e.g., `https://brainrot-web.vercel.app`)

### 3. Update Discord OAuth
In Discord dev portal → OAuth2 → Redirects:
- Add `https://YOUR_VERCEL_DOMAIN/login`

## Architecture

```
├── pages/
│   ├── index.jsx          → Redirects to login or dashboard
│   ├── login.jsx          → Discord OAuth login
│   ├── dashboard.jsx      → Main dashboard (after login)
│   └── api/
│       └── auth/
│           └── discord.js → Token exchange with Discord
├── styles/
│   └── globals.css        → Tailwind + custom styles
└── .env.local            → Environment variables
```

## Flow

1. User visits site → Redirected to `/login`
2. Click "Login with Discord" → Discord OAuth flow
3. User authorizes → Gets redirected back with `code`
4. Website exchanges `code` for Discord token
5. Fetch user info (username, avatar, ID)
6. POST to backend `/api/auth/register` to create/fetch user
7. Receive `apiKey`, `plan`, `balance`
8. Store in localStorage
9. Redirect to `/dashboard`

## Next Steps

- [ ] Add Stripe/payment integration for plan purchases
- [ ] Implement marketplace rentals (deduct/add balance)
- [ ] Add bot activity logs
- [ ] Create admin panel for managing users
- [ ] Add email notifications
