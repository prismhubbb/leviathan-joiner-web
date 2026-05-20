import React, { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)

  // Script Key and copy state
  const scriptKey = "•" + "•".repeat(34)
  const luaCode = `getgenv().KEY = "...................................."\nloadstring(game:HttpGet("https://api.luarmor.net/files/v4/loaders/bd4ed5a1d37dc72a888874falc3d8b8.lua"))()`
  const [copied, setCopied] = useState(false)
  const [showKey, setShowKey] = useState(false)

  // Chart placeholder data matching the screenshot behavior
  const botsChartData = [
    { name: '00:00', bots: 150 },
    { name: '04:00', bots: 300 },
    { name: '08:00', bots: 200 },
    { name: '12:00', bots: 800 },
    { name: '16:00', bots: 3492 },
    { name: '20:00', bots: 1500 },
    { name: '24:00', bots: 260 },
  ]

  const handleCopy = () => {
    navigator.clipboard.writeText(luaCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    } else {
      // Fallback fallback profile data to preview accurately if localStorage isn't set yet
      setUser({
        username: 'User',
        discordId: '149991713135336211',
        avatar: '',
        plan: 'Expired',
        balance: 0.00,
        delay: 0
      })
    }
    setLoading(false)
  }, [])

  if (loading || !user) return <div className="min-h-screen bg-[#08080c]" />

  return (
    <div className="flex min-h-screen bg-[#08080c] text-[#f3f4f6] font-sans antialiased selection:bg-[#ff4e50]/30">
      
      {/* SIDEBAR */}
      <div className="w-60 bg-[#0c0d12] border-r border-[#151722] flex flex-col justify-between">
        <div>
          {/* User Profile Header */}
          <div className="p-4 flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full bg-[#1b1e2c] border border-[#2b2f44] flex items-center justify-center overflow-hidden">
              <span className="text-xs font-bold text-gray-400">ID</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 truncate">{user.discordId || '149991713135336211'}</span>
                <button className="text-gray-600 hover:text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Balance/Plan Box Container */}
          <div className="px-4 mb-4">
            <div className="bg-[#10121a] border border-[#161926] rounded-xl p-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#ff4e50] to-[#f9d423]" />
              <div className="bg-[#ff4e50]/10 border border-[#ff4e50]/20 text-[#ff4e50] text-[11px] font-bold tracking-wider uppercase text-center py-2 rounded-lg mb-4">
                No Plan
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Balance</div>
                  <div className="text-xl font-bold text-white tracking-tight">${user.balance?.toFixed(2) || '0.00'}</div>
                </div>
                <button className="flex items-center gap-1.5 bg-[#1b1e2c] border border-[#2b2f44] hover:bg-[#23273a] text-xs font-semibold px-3 py-1.5 rounded-lg transition text-gray-300">
                  <span className="text-gray-400 text-sm font-light">+</span> Add
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-2 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path></svg> },
              { id: 'settings', label: 'Settings', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> },
              { id: 'orders', label: 'Orders', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg> },
              { id: 'purchase', label: 'Purchase Plan', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path></svg> },
              { id: 'auctions', label: 'Auctions', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> },
              { id: 'marketplace', label: 'Marketplace', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg> },
              { id: 'connected', label: 'Connected Users', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-xs transition duration-150 ${
                  activeTab === tab.id
                    ? 'bg-[#12141d] text-white border border-[#1d2130]'
                    : 'text-gray-400 hover:bg-[#0c0d12] hover:text-gray-200'
                }`}
              >
                <span className={activeTab === tab.id ? 'text-[#ff4e50]' : 'text-gray-500'}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-[#151722]">
          <button
            onClick={() => {
              localStorage.clear()
              window.location.href = '/login'
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-400 transition duration-150"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP SCROLL BANNER */}
        <div className="bg-[#0a0b10] border-b border-[#151722] py-2 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-3 px-4">
          {[
            { name: 'Lo Romantic Grande', value: '$1.1B/s', icon: '🦖' },
            { name: 'Burguro And Fryuro', value: '$1.2B/s', icon: '🍔' },
            { name: 'Money Money Bros', value: '$1.3B/s', icon: '💰' },
            { name: 'Ventoliero Pavonero', value: '$2.2B/s', icon: '🦚' },
            { name: 'Ventoliero Pavonero', value: '$1.2B/s', icon: '🦚' },
            { name: 'Burguro And Fryuro', value: '$1.1B/s', icon: '🍔' },
            { name: 'Cerberus', value: '$1.2B/s', icon: '🐺' },
            { name: 'Lo Anniversary Grande', value: '$1.0B/s', icon: '🎂' },
            { name: 'Ventoliero Pavonero', value: '$1.6B/s', icon: '🦚' },
            { name: 'Goromo and Modundung', value: '$1.1B/s', icon: '🗿' },
          ].map((item, index) => (
            <div key={index} className="inline-flex flex-col items-center justify-center bg-[#0d0e14] border border-[#161824] rounded-xl px-4 py-2 min-w-[110px]">
              <div className="text-base mb-1">{item.icon}</div>
              <div className="text-[9px] text-gray-400 font-medium truncate max-w-[100px] text-center">{item.name}</div>
              <div className="text-[10px] font-bold text-[#b176ff]">{item.value}</div>
            </div>
          ))}
        </div>

        {/* TAB TARGETING ROUTER */}
        <div className="flex-1 overflow-y-auto p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white mb-4">Dashboard</h1>

              {/* STATS MATRIX LAYOUT */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                <div className="bg-[#0b0c12] border border-[#151722] rounded-xl p-4">
                  <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Status</div>
                  <div className="text-xs font-bold text-red-400">Expired</div>
                </div>
                <div className="bg-[#0b0c12] border border-[#151722] rounded-xl p-4">
                  <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Plan</div>
                  <div className="text-xs font-bold text-gray-400">—</div>
                </div>
                <div className="bg-[#0b0c12] border border-[#151722] rounded-xl p-4">
                  <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Delay</div>
                  <div className="text-xs font-bold text-white">{user.delay || 0}s</div>
                </div>
                <div className="bg-[#0b0c12] border border-[#151722] rounded-xl p-4">
                  <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Expires In</div>
                  <div className="text-xs font-bold text-red-400">Expired</div>
                </div>
                <div className="bg-[#0b0c12] border border-[#151722] rounded-xl p-4 col-span-2 md:col-span-1">
                  <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Total Spent</div>
                  <div className="text-xs font-bold text-[#22c55e]">$ 0.00</div>
                </div>
              </div>

              {/* SCRIPT CONTAINER CONTAINER */}
              <div className="bg-[#0b0c12] border border-[#151722] rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between border-b border-[#151722] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Script Key</span>
                    <span className="text-xs text-gray-500 font-mono tracking-widest">{showKey ? "DEMO-KEY-X9F82" : scriptKey}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowKey(!showKey)} className="p-1 text-gray-500 hover:text-gray-300 rounded transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button onClick={handleCopy} className="p-1 text-gray-500 hover:text-gray-300 rounded transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </button>
                    <button className="p-1 text-gray-500 hover:text-gray-300 rounded transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18"></path></svg>
                    </button>
                  </div>
                </div>

                <div className="bg-[#07080c] rounded-lg p-3 relative group border border-[#131520]">
                  <button onClick={handleCopy} className="absolute top-3 right-3 opacity-60 group-hover:opacity-100 p-1.5 bg-[#11131c] border border-[#1f2335] rounded-md text-gray-400 hover:text-white transition">
                    {copied ? <span className="text-[10px] text-green-400 px-1">Copied!</span> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>}
                  </button>
                  <pre className="text-xs font-mono text-gray-400 overflow-x-auto leading-relaxed whitespace-pre-wrap select-all pr-8">
                    <span className="text-[#38bdf8]">getgenv</span>().KEY = <span className="text-[#fbbf24]">"...................................."</span>{"\n"}
                    <span className="text-[#f43f5e]">loadstring</span>(game:<span className="text-[#38bdf8]">HttpGet</span>(<span className="text-[#34d399]">"https://api.luarmor.net/files/v4/loaders/bd4ed5a1d37dc72a888874falc3d8b8.lua"</span>))()
                  </pre>
                </div>
              </div>

              {/* RUNNING AND BOTS OVERVIEWS */}
              <div className="mb-3 flex justify-between items-end">
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-0.5">Real-Time Usage</div>
                  <h2 className="text-sm font-bold text-white">Plans status</h2>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <div className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Running</div>
                    <div className="text-sm font-bold text-[#22c55e]">244</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Avg Bots</div>
                    <div className="text-sm font-bold text-white">3.9<span className="text-gray-500 font-normal">/8</span></div>
                  </div>
                </div>
              </div>

              {/* THREE PROGRESS BOX BAR MODULES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {/* MASTER */}
                <div className="bg-[#0b0c12] border border-[#151722] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-white tracking-wide">MASTER</span>
                      <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">👥 4/4</span>
                    </div>
                    <div className="text-[10px] text-red-400 mb-4">Next slot in: 1d 18h 43m</div>
                  </div>
                  <div className="w-full bg-[#161824] h-[3px] rounded-full overflow-hidden">
                    <div className="bg-[#ef4444] h-full w-full" />
                  </div>
                </div>

                {/* GOD */}
                <div className="bg-[#0b0c12] border border-[#151722] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-white tracking-wide">GOD</span>
                      <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">👥 4/6</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mb-4">Next slot in: N/A</div>
                  </div>
                  <div className="w-full bg-[#161824] h-[3px] rounded-full overflow-hidden">
                    <div className="bg-[#f97316] h-full w-[66%]" />
                  </div>
                </div>

                {/* OMEGA */}
                <div className="bg-[#0b0c12] border border-[#151722] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-white tracking-wide">OMEGA</span>
                      <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">👥 6/8</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mb-4">Next slot in: N/A</div>
                  </div>
                  <div className="w-full bg-[#161824] h-[3px] rounded-full overflow-hidden">
                    <div className="bg-[#ec4899] h-full w-[75%]" />
                  </div>
                </div>
              </div>

              {/* HISTORY AND RECHARTS AREA GRAPH CONTAINER */}
              <div className="bg-[#0b0c12] border border-[#151722] rounded-xl p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-0.5">History</div>
                    <h2 className="text-sm font-bold text-white mb-1">Bots running</h2>
                    <div className="flex gap-3 text-[10px] text-gray-500">
                      <span>avg <strong className="text-gray-400 font-medium">1,508</strong></span>
                      <span>max <strong className="text-gray-400 font-medium">8,492</strong></span>
                      <span>min <strong className="text-gray-400 font-medium">0</strong></span>
                      <span>• 260 samples</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-[#11131c] border border-[#1d2130] text-xs font-medium px-2.5 py-1 rounded-lg text-emerald-400">Last 24h</button>
                    <div className="bg-[#11131c] border border-[#1d2130] text-[11px] font-medium px-2.5 py-1 rounded-lg text-gray-400 flex items-center gap-1">
                      05/19/2026 📅
                    </div>
                    <div className="bg-[#11131c] border border-[#1d2130] text-[11px] font-medium px-2.5 py-1 rounded-lg text-gray-400 flex items-center gap-1">
                      05/20/2026 📅
                    </div>
                  </div>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={botsChartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorBots" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="#131522" />
                      <XAxis dataKey="name" stroke="#2c2f44" tick={{ fill: '#4b5563', fontSize: 9 }} />
                      <YAxis stroke="#2c2f44" tick={{ fill: '#4b5563', fontSize: 9 }} domain={[0, 10000]} ticks={[0, 2000, 4000, 6000, 8000, 10000]} />
                      <Tooltip contentStyle={{ backgroundColor: '#0c0d12', border: '1px solid #1c1f30', borderRadius: '8px', fontSize: '11px' }} />
                      <Area type="monotone" dataKey="bots" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorBots)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

          {/* SECONDARY SCREENS FALLBACK VIEWS */}
          {activeTab === 'settings' && <div className="text-gray-400 text-sm">Settings layout interface template ready.</div>}
          {activeTab === 'orders' && <div className="text-gray-400 text-sm">Orders history interface template ready.</div>}
          {activeTab === 'purchase' && <div className="text-gray-400 text-sm">Purchase systems dashboard template ready.</div>}
          {activeTab === 'auctions' && <div className="text-gray-400 text-sm">Auctions engine interface template ready.</div>}
          {activeTab === 'marketplace' && <div className="text-gray-400 text-sm">Marketplace module ready.</div>}
          {activeTab === 'connected' && <div className="text-gray-400 text-sm">Connected tracking interface template ready.</div>}
        </div>
      </div>

    </div>
  )
}
