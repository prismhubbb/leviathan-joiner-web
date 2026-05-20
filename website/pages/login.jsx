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
    window.location.href = `https://discord.com/oauth2/authorize?client_id=1506640624240164886&response_type=code&redirect_uri=https%3A%2F%2Fleviathan-joiner-web.vercel.app%2Fapi%2Fauth%2Fdiscord%2Fcallback&scope=identify`
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center font-sans antialiased px-4 select-none">
      {/* Centered Login Card */}
      <div className="bg-[#0b0c0e] border border-[#16181c] rounded-[28px] max-w-[460px] w-full pt-12 pb-10 px-10 flex flex-col items-center shadow-2xl">
        
        {/* Rounded Green Controller Box Icon */}
        <div className="w-[72px] h-[72px] bg-[#0d1f18] border border-[#1b3d2f] rounded-[22px] flex items-center justify-center mb-7">
          <svg className="w-9 h-9 text-[#3ae387]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2Zm-10 7H9v2H8v-2H6v-1h2V9h1v2h2v1Zm4.5 1.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1Zm2-2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1Z" />
          </svg>
        </div>

        {/* Header Elements */}
        <h1 className="text-[27px] font-bold text-white tracking-tight mb-2.5 text-center">
          Login to Dashboard
        </h1>
        <p className="text-[14px] text-gray-400/80 mb-9 text-center font-normal tracking-normal">
          Sign in with your Discord account to continue.
        </p>

        {/* Exact Image Styled Discord Action Button */}
        <button
          onClick={handleDiscordLogin}
          className="w-full py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium text-[15px] rounded-[14px] transition duration-150 flex items-center justify-center gap-2.5 shadow-md shadow-[#5865F2]/5"
        >
          <svg className="w-5 h-5 mb-[1px]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.367a19.12 19.12 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.607 1.25a17.994 17.994 0 0 0-5.412 0c-.163-.386-.398-.875-.607-1.25a.077.077 0 0 0-.079-.037A19.047 19.047 0 0 0 3.677 4.367a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.148 19.148 0 0 0 5.753 2.9.08.08 0 0 0 .087-.027c.461-.63.87-1.295 1.217-1.994a.077.077 0 0 0-.042-.107 12.667 12.667 0 0 1-1.809-.863.077.077 0 0 1-.009-.128 10.757 10.757 0 0 0 .389-.309.075.075 0 0 1 .082-.01c3.791 1.73 7.897 1.73 11.651 0a.075.075 0 0 1 .084.009c.125.104.257.208.389.31a.077.077 0 0 1-.007.127 11.691 11.691 0 0 1-1.81.864.077.077 0 0 0-.041.107c.35.698.758 1.364 1.216 1.994a.076.076 0 0 0 .086.027 19.12 19.12 0 0 0 5.757-2.9.077.077 0 0 0 .032-.057c.504-4.772-.847-8.92-3.585-12.623a.061.061 0 0 0-.031-.03Z" />
          </svg>
          Login with Discord
        </button>

        {/* Muted Legal Footer */}
        <p className="text-[12px] text-[#4d515c] text-center mt-9 font-normal tracking-normal">
          By logging in you agree to the platform's terms of service.
        </p>
      </div>
    </div>
  )
}
