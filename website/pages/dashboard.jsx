import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Image from 'next/image'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [hits, setHits] = useState([])
  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [topDepositors, setTopDepositors] = useState([])
  const [botsChart, setBotsChart] = useState([])

  useEffect(() => {
    // Load user from localStorage (set after Discord auth)
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    } else {
      // Redirect to login if no user
      window.location.href = '/login'
    }
  }, [])

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        // Fetch hits
        const hitsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hits`, {
          headers: { 'x-api-key': user.apiKey }
        })
        if (hitsRes.ok) {
          const data = await hitsRes.json()
          setHits(data.hits || [])
        }

        // Fetch stats
        const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`)
        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data)
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [user])

  if (!user) return <div className="min-h-screen bg-dark-900" />

  return (
    <div className="flex min-h-screen bg-dark-900">
      {/* SIDEBAR */}
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && (
          <DashboardContent user={user} hits={hits} stats={stats} loading={loading} botsChart={botsChart} topDepositors={topDepositors} />
        )}
        {activeTab === 'settings' && <SettingsPage user={user} />}
        {activeTab === 'purchase' && <PurchasePlanPage user={user} />}
        {activeTab === 'marketplace' && <MarketplacePage user={user} />}
        {activeTab === 'connected' && <ConnectedUsersPage user={user} />}
      </div>
    </div>
  )
}

function Sidebar({ user, activeTab, setActiveTab }) {
  return (
    <div className="w-64 bg-dark-800 border-r border-dark-700 p-6 flex flex-col">
      {/* User Profile */}
      <div className="mb-8 pb-6 border-b border-dark-700">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`}
            alt={user.username}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <div className="font-bold text-sm">{user.username}</div>
            <div className="text-xs text-gray-500">{user.discordId}</div>
          </div>
        </div>

        {/* Plan Info */}
        <div className="bg-dark-700 rounded p-3 mb-3">
          <div className="text-xs text-gray-400 mb-1">Current Plan</div>
          <div className="font-bold text-accent text-sm">{user.plan || 'Free'}</div>
        </div>

        {/* Balance */}
        <div className="bg-dark-700 rounded p-3">
          <div className="text-xs text-gray-400 mb-1">Balance</div>
          <div className="font-bold text-green-400">${user.balance?.toFixed(2) || '0.00'}</div>
        </div>

        {/* Add Balance Button */}
        <button className="w-full mt-3 px-3 py-2 bg-accent text-dark-900 font-bold rounded text-xs hover:bg-blue-300 transition">
          + Add Balance
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: '📊' },
          { id: 'settings', label: 'Settings', icon: '⚙️' },
          { id: 'purchase', label: 'Purchase Plan', icon: '🛒' },
          { id: 'marketplace', label: 'Marketplace', icon: '🏪' },
          { id: 'connected', label: 'Connected Users', icon: '👥' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-4 py-3 rounded transition text-sm font-medium ${
              activeTab === tab.id
                ? 'bg-accent text-dark-900'
                : 'text-gray-300 hover:bg-dark-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.clear()
          window.location.href = '/login'
        }}
        className="w-full px-4 py-2 text-gray-400 hover:text-red-400 transition text-sm font-medium"
      >
        Logout
      </button>
    </div>
  )
}

function DashboardContent({ user, hits, stats, loading, topDepositors, botsChart }) {
  return (
    <div className="p-8">
      {/* Top Section: Hits Feed */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Live Hits</h2>
        <div className="grid gap-4">
          {hits.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No hits found yet. Scanners are searching...</div>
          ) : (
            hits.slice(0, 5).map(hit => <HitCard key={hit.id} hit={hit} />)
          )}
        </div>
      </div>

      {/* Middle Section: Dashboard Stats */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Active Hits', value: stats?.activeHits || 0, color: 'text-accent' },
            { label: 'Scanning Bots', value: stats?.activeBots || 0, color: 'text-green-400' },
            { label: 'Your Delay', value: user.delay ? `${user.delay}s` : '0s', color: 'text-purple-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-dark-800 border border-dark-700 rounded p-6">
              <div className="text-gray-400 text-sm mb-2">{stat.label}</div>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Bots Chart */}
        <div className="bg-dark-800 border border-dark-700 rounded p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">Bots Running (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={botsChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" />
              <XAxis stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a26', border: 'none', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="bots" stroke="#6fa7fe" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Depositors */}
        <div className="bg-dark-800 border border-dark-700 rounded p-6">
          <h3 className="text-lg font-bold mb-4">Top 10 Depositors</h3>
          <div className="space-y-2">
            {topDepositors.map((depositor, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-dark-700 rounded">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-500 w-6">{i + 1}</span>
                  <img src={depositor.avatar} alt="" className="w-8 h-8 rounded-full" />
                  <span className="font-medium">{depositor.username}</span>
                </div>
                <span className="text-green-400 font-bold">${depositor.balance.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function HitCard({ hit }) {
  const br = hit.brainrots?.[0]
  const mutation = br?.mutation || 'None'

  const mutationColors = {
    'Gold': 'border-yellow-400',
    'Diamond': 'border-cyan-400',
    'Bloodrot': 'border-red-500',
    'Candy': 'border-pink-400',
    'Lava': 'border-orange-500',
    'Galaxy': 'border-purple-600',
    'Radioactive': 'border-lime-400',
    'Divine': 'border-yellow-300',
    'Cyber': 'border-cyan-500',
  }

  return (
    <div className={`bg-dark-800 border-2 ${mutationColors[mutation] || 'border-gray-600'} rounded p-4`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-lg">{br?.name || 'Unknown'}</h4>
          <p className="text-sm text-gray-400">{hit.username}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-400">{br?.valueText}</div>
          {mutation !== 'None' && <div className="text-xs text-gray-400">{mutation}</div>}
        </div>
      </div>
    </div>
  )
}

function SettingsPage({ user }) {
  const [delay, setDelay] = React.useState(user.delay || 0)

  return (
    <div className="p-8 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <div className="bg-dark-800 border border-dark-700 rounded p-6">
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">Hit Delay (seconds)</label>
          <p className="text-xs text-gray-400 mb-3">
            How long after a hit is found should it appear in your joiner GUI? 0s = instant
          </p>
          <input
            type="number"
            min="0"
            max="10"
            value={delay}
            onChange={(e) => setDelay(parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded text-white focus:outline-none focus:border-accent"
          />
        </div>
        <button className="w-full px-4 py-2 bg-accent text-dark-900 font-bold rounded hover:bg-blue-300 transition">
          Save Settings
        </button>
      </div>
    </div>
  )
}

function PurchasePlanPage({ user }) {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Purchase Plan</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { name: 'Free', price: 0, hits: '5', slots: '1' },
          { name: 'Basic', price: 9.99, hits: '15', slots: '2' },
          { name: 'Premium', price: 24.99, hits: '50', slots: '5' },
        ].map(plan => (
          <div key={plan.name} className={`bg-dark-800 border-2 ${plan.name === 'Premium' ? 'border-yellow-400' : 'border-dark-700'} rounded p-6`}>
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <div className="text-3xl font-bold text-accent mb-4">${plan.price}</div>
            <ul className="space-y-2 text-sm mb-6 text-gray-300">
              <li>✓ {plan.hits} hits/min</li>
              <li>✓ {plan.slots} slots</li>
              <li>✓ Discord support</li>
            </ul>
            <button className="w-full px-4 py-2 bg-accent text-dark-900 font-bold rounded hover:bg-blue-300 transition">
              Select {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function MarketplacePage({ user }) {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Marketplace</h2>
      <p className="text-gray-400 mb-6">Rent your plan to other users by the hour. Set your own price.</p>
      <div className="grid gap-4">
        {/* Listed plans go here */}
        <div className="bg-dark-800 border border-dark-700 rounded p-6 text-center text-gray-400">
          No plans listed yet
        </div>
      </div>
    </div>
  )
}

function ConnectedUsersPage({ user }) {
  const [connectedUsers, setConnectedUsers] = React.useState([])

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Connected Users</h2>
      <div className="grid gap-4">
        {connectedUsers.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No connected users yet</div>
        ) : (
          connectedUsers.map(cu => (
            <div key={cu.id} className="bg-dark-800 border border-dark-700 rounded p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={cu.robloxPfp} alt="" className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-bold">{cu.discordName}</div>
                  <div className="text-xs text-gray-500">{cu.region} • {cu.plan}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
