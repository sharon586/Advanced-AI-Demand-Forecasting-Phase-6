import React, { useState, useEffect, useCallback } from 'react'
import Layout from '../components/layout/Layout'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const generateTimeline = () => {
  const now = new Date()
  return Array.from({ length: 20 }, (_, i) => {
    const t = new Date(now - (19 - i) * 3 * 60000)
    return {
      time: t.toTimeString().slice(0, 5),
      sales: Math.round(75000 + Math.random() * 40000 + i * 1200),
      orders: Math.round(35 + Math.random() * 60),
    }
  })
}

const generateKPIs = () => ({
  live_sales: Math.round(80000 + Math.random() * 30000),
  live_orders: Math.round(42 + Math.random() * 96),
  active_users: Math.round(8 + Math.random() * 26),
  forecast_accuracy: (94 + Math.random() * 4).toFixed(1),
  sales_change: (2 + Math.random() * 16).toFixed(1),
})

const anomalies = [
  { product: 'Laptop UltraBook', category: 'Electronics', expected: 52000, actual: 89400, deviation: '+71.9%', severity: 'high' },
  { product: 'Cotton Kurta Set', category: 'Fashion', expected: 14200, actual: 4800, deviation: '-66.2%', severity: 'medium' },
  { product: 'Basmati Rice 10kg', category: 'Groceries', expected: 18500, actual: 22100, deviation: '+19.5%', severity: 'low' },
]

const seasonalTrends = [
  { season: 'Spring', months: 'Mar-May', impact: '+12%', top: 'Fashion', growth: 12 },
  { season: 'Summer', months: 'Jun-Aug', impact: '+18%', top: 'Electronics', growth: 18 },
  { season: 'Autumn', months: 'Sep-Nov', impact: '+8%', top: 'Furniture', growth: 8 },
  { season: 'Winter', months: 'Dec-Feb', impact: '+32%', top: 'Electronics', growth: 32 },
]

export default function RealTimeDashboard() {
  const [timeline, setTimeline] = useState(generateTimeline)
  const [kpis, setKpis] = useState(generateKPIs)
  const [live, setLive] = useState(true)
  const [tab, setTab] = useState('monitor')
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const refresh = useCallback(() => {
    setTimeline(prev => {
      const now = new Date()
      const newPoint = {
        time: now.toTimeString().slice(0, 5),
        sales: Math.round(75000 + Math.random() * 40000),
        orders: Math.round(35 + Math.random() * 60),
      }
      return [...prev.slice(1), newPoint]
    })
    setKpis(generateKPIs())
    setLastUpdated(new Date())
  }, [])

  useEffect(() => {
    if (!live) return
    const interval = setInterval(refresh, 3000)
    return () => clearInterval(interval)
  }, [live, refresh])

  const severityConfig = { high: 'bg-red-900/30 border-red-700/50 text-red-400', medium: 'bg-yellow-900/30 border-yellow-700/50 text-yellow-400', low: 'bg-green-900/30 border-green-700/50 text-green-400' }

  return (
    <Layout title="Real-Time Monitor">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${live ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-sm text-gray-400">{live ? 'Live — updates every 3s' : 'Paused'}</span>
          <span className="text-xs text-gray-600">Last: {lastUpdated.toTimeString().slice(0, 8)}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setLive(l => !l)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${live ? 'bg-red-900/30 text-red-400 border border-red-700/50' : 'bg-green-900/30 text-green-400 border border-green-700/50'}`}>
            {live ? '⏸ Pause' : '▶ Resume'}
          </button>
          <button onClick={refresh} className="px-4 py-2 rounded-xl bg-[#241B4B] border border-[#39306A] text-sm text-gray-300 hover:text-white transition">🔄 Refresh</button>
        </div>
      </div>

      {/* Live KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Live Sales', value: `₹${(kpis.live_sales/1000).toFixed(0)}K`, sub: `↑ ${kpis.sales_change}% vs last hour`, color: 'text-violet-400', icon: '💰' },
          { label: 'Live Orders', value: kpis.live_orders, sub: 'Active transactions', color: 'text-pink-400', icon: '🛒' },
          { label: 'Active Users', value: kpis.active_users, sub: 'Currently online', color: 'text-blue-400', icon: '👤' },
          { label: 'AI Accuracy', value: `${kpis.forecast_accuracy}%`, sub: 'Real-time model accuracy', color: 'text-green-400', icon: '🎯' },
        ].map((c, i) => (
          <div key={i} className="bg-[#211A45] rounded-2xl p-5 border border-[#39306A]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">{c.label}</p>
              <span className="text-xl">{c.icon}</span>
            </div>
            <h3 className={`text-2xl font-bold ${c.color}`}>{c.value}</h3>
            <p className="text-xs text-gray-500 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {[
          { key: 'monitor', label: '📊 Sales Monitor' },
          { key: 'anomalies', label: '🔍 Anomaly Detection' },
          { key: 'seasonal', label: '🌦️ Seasonal Trends' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab===t.key ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'monitor' && (
        <div className="space-y-6">
          <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
            <h2 className="text-lg font-bold mb-5">Live Sales Timeline (last 60 min)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient id="liveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A" />
                <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={v => [`₹${v.toLocaleString()}`, '']} contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
                <Area type="monotone" dataKey="sales" stroke="#7C3AED" strokeWidth={2} fill="url(#liveGrad)" name="Live Sales" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
            <h2 className="text-lg font-bold mb-5">Live Order Volume</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A" />
                <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
                <Bar dataKey="orders" fill="#EC4899" radius={[4, 4, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === 'anomalies' && (
        <div className="space-y-4">
          <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Detected Anomalies</h2>
              <span className="text-sm text-red-400 bg-red-900/20 px-3 py-1 rounded-full border border-red-800/40">3 anomalies detected</span>
            </div>
            <div className="space-y-4">
              {anomalies.map((a, i) => (
                <div key={i} className={`p-5 rounded-xl border ${severityConfig[a.severity]}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{a.product}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#312B56] text-gray-400">{a.category}</span>
                    </div>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full border ${severityConfig[a.severity]}`}>
                      {a.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div><p className="text-xs text-gray-500">Expected</p><p className="text-sm font-medium text-gray-300">₹{a.expected.toLocaleString()}</p></div>
                    <div><p className="text-xs text-gray-500">Actual</p><p className="text-sm font-medium text-white">₹{a.actual.toLocaleString()}</p></div>
                    <div><p className="text-xs text-gray-500">Deviation</p><p className={`text-sm font-bold ${a.deviation.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{a.deviation}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'seasonal' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {seasonalTrends.map((s, i) => (
              <div key={i} className={`bg-[#211A45] rounded-2xl p-5 border ${i===1?'border-violet-600':'border-[#39306A]'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{s.season}</h3>
                  {i===1 && <span className="text-xs bg-violet-900/40 text-violet-400 px-2 py-0.5 rounded-full border border-violet-700/40">Current</span>}
                </div>
                <p className="text-xs text-gray-500 mb-2">{s.months}</p>
                <p className="text-2xl font-bold text-violet-400 mb-1">{s.impact}</p>
                <p className="text-xs text-gray-400">Top: {s.top}</p>
                <div className="mt-3 bg-[#312B56] rounded-full h-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" style={{ width: `${s.growth * 2.5}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
            <h2 className="text-lg font-bold mb-4">Seasonal Forecast Adjustments</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { cat: 'Electronics', adj: '+24% (Summer/Winter peak)', color: 'text-violet-400' },
                { cat: 'Fashion', adj: '+18% (Spring/Summer)', color: 'text-pink-400' },
                { cat: 'Groceries', adj: 'Stable year-round (±5%)', color: 'text-green-400' },
                { cat: 'Furniture', adj: '+11% (Autumn)', color: 'text-blue-400' },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[#2D2257]">
                  <div className={`w-3 h-3 rounded-full ${r.color.replace('text-', 'bg-')}`} />
                  <div>
                    <p className="text-sm font-medium text-white">{r.cat}</p>
                    <p className={`text-xs ${r.color}`}>{r.adj}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
