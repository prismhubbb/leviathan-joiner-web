import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { code } = req.body

  if (!code) {
    return res.status(400).json({ error: 'No code provided' })
  }

  try {
    // Exchange code for access token
    const tokenRes = await axios.post('https://discord.com/api/v10/oauth2/token', {
      client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.NEXTAUTH_URL}/login`,
      scope: 'identify email',
    })

    const { access_token } = tokenRes.data

    // Get user info from Discord
    const userRes = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    const discordUser = userRes.data

    // Check/create user in your backend API
    const backendRes = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      {
        discordId: discordUser.id,
        username: discordUser.username,
        avatar: discordUser.avatar,
      }
    )

    const apiKey = backendRes.data.apiKey
    const plan = backendRes.data.plan
    const balance = backendRes.data.balance

    // Return user data to be stored in localStorage
    res.json({
      discordId: discordUser.id,
      username: discordUser.username,
      avatar: discordUser.avatar,
      apiKey,
      plan,
      balance,
      delay: 0,
    })
  } catch (error) {
    console.error('Discord auth error:', error)
    res.status(500).json({ error: 'Authentication failed' })
  }
}
