import { useEffect } from 'react'

export default function Login() {
  useEffect(() => {
    // Check if we're coming back from Discord auth
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code) {
      // Exchange code for user data
      exchangeCodeForToken(code)
    }
  }, [])

  const exchangeCodeForToken = async (code) => {
    try {
      const res = await fetch('/api/auth/discord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      if (res.ok) {
        const user = await res.json()
        localStorage.setItem('user', JSON.stringify(user))
        window.location.href = '/dashboard'
      }
    } catch (err) {
      console.error('Auth failed:', err)
    }
  }

  const handleDiscordLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
    const redirectUri = `${window.location.origin}/login`
    const scopes = ['identify', 'email'].join('%20')
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 flex items-center justify-center">
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-12 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🧠</div>
          <h1 className="text-3xl font-bold mb-2">Leviathan Joiner</h1>
          <p className="text-gray-400">Find rare brainrots instantly</p>
        </div>

        <button
          onClick={handleDiscordLogin}
          className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition flex items-center justify-center gap-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.367a19.12 19.12 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.607 1.25a17.994 17.994 0 0 0-5.412 0c-.163-.386-.398-.875-.607-1.25a.077.077 0 0 0-.079-.037A19.047 19.047 0 0 0 3.677 4.367a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.148 19.148 0 0 0 5.753 2.9.08.08 0 0 0 .087-.027c.461-.63.87-1.295 1.217-1.994a.077.077 0 0 0-.042-.107 12.667 12.667 0 0 1-1.809-.863.077.077 0 0 1-.009-.128 10.757 10.757 0 0 0 .389-.309.075.075 0 0 1 .082-.01c3.791 1.73 7.897 1.73 11.651 0a.075.075 0 0 1 .084.009c.125.104.257.208.389.31a.077.077 0 0 1-.007.127 11.691 11.691 0 0 1-1.81.864.077.077 0 0 0-.041.107c.35.698.758 1.364 1.216 1.994a.076.076 0 0 0 .086.027 19.12 19.12 0 0 0 5.757-2.9.077.077 0 0 0 .032-.057c.504-4.772-.847-8.92-3.585-12.623a.061.061 0 0 0-.031-.03Z" />
          </svg>
          Login with Discord
        </button>

        <p className="text-xs text-gray-500 text-center mt-6">
          By logging in, you agree to our terms of service
        </p>
      </div>
    </div>
  )
}
