import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, PieChart, Pie, Cell
} from 'recharts'

const salesData = [
  { month: 'Jan', sales: 420000, profit: 126000, forecast: 450000 },
  { month: 'Feb', sales: 350000, profit: 105000, forecast: 380000 },
  { month: 'Mar', sales: 520000, profit: 156000, forecast: 550000 },
  { month: 'Apr', sales: 280000, profit: 84000, forecast: 300000 },
  { month: 'May', sales: 610000, profit: 183000, forecast: 640000 },
  { month: 'Jun', sales: 480000, profit: 144000, forecast: 510000 },
  { month: 'Jul', sales: 720000, profit: 216000, forecast: 750000 },
  { month: 'Aug', sales: 650000, profit: 195000, forecast: 680000 },
]

const productData = [
  { name: 'Headphones', value: 420, revenue: 840000 },
  { name: 'Mobile', value: 300, revenue: 600000 },
  { name: 'Laptop', value: 210, revenue: 1050000 },
  { name: 'Keyboard', value: 180, revenue: 180000 },
  { name: 'Mouse', value: 160, revenue: 112000 },
]

const regionData = [
  { region: 'North', sales: 1800000, color: '#7C3AED' },
  { region: 'South', sales: 1200000, color: '#EC4899' },
  { region: 'East', sales: 980000, color: '#3B82F6' },
  { region: 'West', sales: 1350000, color: '#10B981' },
]

const recentActivity = [
  { action: 'Forecast generated', detail: 'Random Forest — Electronics', time: '2 min ago', status: 'success', icon: '📈' },
  { action: 'Dataset uploaded', detail: 'sales_q4_2025.csv (1,240 rows)', time: '1 hour ago', status: 'success', icon: '📤' },
  { action: 'Report exported', detail: 'Annual Revenue PDF', time: '3 hours ago', status: 'success', icon: '📄' },
  { action: 'Model comparison', detail: '4 models benchmarked', time: '5 hours ago', status: 'success', icon: '🔬' },
  { action: 'Upload failed', detail: 'corrupt_data.csv — invalid format', time: '1 day ago', status: 'error', icon: '❌' },
]

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Groceries', 'Furniture']
const REGIONS = ['All', 'North', 'South', 'East', 'West']
const DATE_RANGES = ['Last 7 days', 'Last 30 days', 'Last 6 months', 'Last year']

const ALL_WIDGETS = [
  { id: 'kpi', label: 'KPI Cards', default: true },
  { id: 'sales_trend', label: 'Sales Trend', default: true },
  { id: 'top_products', label: 'Top Products', default: true },
  { id: 'region', label: 'Region Distribution', default: true },
  { id: 'ai_forecast', label: 'AI Forecast Chart', default: true },
  { id: 'activity', label: 'Recent Activity', default: true },
  { id: 'ai_summary', label: 'AI Summary Banner', default: true },
]

export default function Dashboard() {
  const [category, setCategory] = useState('All')
  const [region, setRegion] = useState('All')
  const [dateRange, setDateRange] = useState('Last 6 months')
  const [drilldown, setDrilldown] = useState(null)
  const [showWidgetConfig, setShowWidgetConfig] = useState(false)
  const [activeWidgets, setActiveWidgets] = useState(ALL_WIDGETS.filter(w => w.default).map(w => w.id))
  const [downloading, setDownloading] = useState(false)

  const multiplier = { Electronics: 1.2, Fashion: 0.9, Groceries: 0.75, Furniture: 0.6 }[category] || 1
  const filteredSales = salesData.map(d => ({
    ...d,
    sales: Math.round(d.sales * multiplier),
    profit: Math.round(d.profit * multiplier),
    forecast: Math.round(d.forecast * multiplier)
  }))

  const totalSales = filteredSales.reduce((a, b) => a + b.sales, 0)
  const totalProfit = filteredSales.reduce((a, b) => a + b.profit, 0)
  const has = (id) => activeWidgets.includes(id)

  const toggleWidget = (id) => setActiveWidgets(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id])

  const downloadSummary = () => {
    setDownloading(true)
    const lines = [
      'Advanced AI Demand Forecasting — Dashboard Summary',
      `Generated: ${new Date().toLocaleString()}`,
      `Filters: Category=${category}, Region=${region}, Range=${dateRange}`,
      '',
      `Total Sales: ₹${(totalSales/100000).toFixed(1)}L`,
      `Total Profit: ₹${(totalProfit/100000).toFixed(1)}L`,
      `Forecast Accuracy: 96%`,
      `Revenue Growth: +32%`,
      '',
      'Monthly Breakdown:',
      ...filteredSales.map(d => `  ${d.month}: Sales=₹${d.sales.toLocaleString()}, Profit=₹${d.profit.toLocaleString()}, Forecast=₹${d.forecast.toLocaleString()}`),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'dashboard_summary.txt'; a.click()
    URL.revokeObjectURL(url)
    setTimeout(() => setDownloading(false), 1500)
  }

  return (
    <Layout title="Dashboard">
      <p className="text-gray-400 mb-6">Welcome back to your AI forecasting workspace</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-[#1B1538] rounded-2xl border border-[#312B56]">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">📅</span>
          <select value={dateRange} onChange={e => setDateRange(e.target.value)}
            className="bg-[#241B4B] text-white text-sm px-3 py-2 rounded-lg border border-[#39306A] outline-none">
            {DATE_RANGES.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">🏷️</span>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="bg-[#241B4B] text-white text-sm px-3 py-2 rounded-lg border border-[#39306A] outline-none">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">📍</span>
          <select value={region} onChange={e => setRegion(e.target.value)}
            className="bg-[#241B4B] text-white text-sm px-3 py-2 rounded-lg border border-[#39306A] outline-none">
            {REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => { setCategory('All'); setRegion('All'); setDateRange('Last 6 months') }}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#39306A] rounded-lg transition">
            Reset
          </button>
          <button onClick={() => setShowWidgetConfig(true)}
            className="px-4 py-2 text-sm bg-[#2D2257] text-gray-300 hover:text-white hover:bg-[#39306A] rounded-lg transition flex items-center gap-1.5">
            ⚙️ Widgets
          </button>
          <button onClick={downloadSummary} disabled={downloading}
            className="px-4 py-2 text-sm bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-1.5">
            {downloading ? '⏳ Downloading...' : '⬇️ Export Summary'}
          </button>
        </div>
      </div>

      {/* AI Summary Banner */}
      {has('ai_summary') && (
        <div className="mb-6 p-4 bg-gradient-to-r from-violet-900/30 to-pink-900/20 rounded-2xl border border-violet-500/30 flex flex-wrap items-center gap-4">
          <span className="text-2xl">🤖</span>
          <div className="flex-1">
            <p className="font-semibold text-white text-sm">AI Insight: Strong performance detected</p>
            <p className="text-xs text-gray-400 mt-0.5">Sales are tracking 8% above forecast this month. Demand spike predicted for Electronics (+84%) in 5 days. Recommend pre-stocking Wireless Headphones Pro.</p>
          </div>
          <a href="/ai-features" className="px-4 py-2 text-xs bg-violet-700/50 text-violet-300 rounded-xl hover:bg-violet-600/50 transition font-semibold whitespace-nowrap">View AI Features →</a>
        </div>
      )}

      {/* KPI Cards */}
      {has('kpi') && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {[
            { label: 'Total Sales', value: `₹${(totalSales/100000).toFixed(1)}L`, sub: '↑ 15% from last period', gradient: true, color: 'from-violet-600 to-fuchsia-600', subColor: 'text-violet-200' },
            { label: 'Forecast Accuracy', value: '96%', sub: 'AI model precision', subColor: 'text-gray-500', valColor: 'text-pink-400' },
            { label: 'Total Profit', value: `₹${(totalProfit/100000).toFixed(1)}L`, sub: '30% profit margin', subColor: 'text-gray-500', valColor: 'text-violet-400' },
            { label: 'Revenue Growth', value: '+32%', sub: 'Year over year', gradient: true, color: 'from-indigo-600 to-blue-600', subColor: 'text-indigo-200' },
          ].map((k, i) => (
            <div key={i} onClick={() => setDrilldown(k.label)} title="Click for drill-down"
              className={`rounded-2xl p-6 cursor-pointer transition hover:scale-[1.02] hover:shadow-lg ${k.gradient ? `bg-gradient-to-br ${k.color} shadow-lg` : 'bg-[#211A45] border border-[#39306A] hover:border-violet-500'}`}>
              <p className={`text-sm mb-2 ${k.gradient ? 'text-violet-200' : 'text-gray-400'}`}>{k.label}</p>
              <h2 className={`text-3xl font-bold ${k.gradient ? 'text-white' : k.valColor}`}>{k.value}</h2>
              <p className={`text-xs mt-2 ${k.subColor}`}>{k.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Drill-down modal */}
      {drilldown && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setDrilldown(null)}>
          <div className="bg-[#211A45] rounded-2xl border border-[#39306A] p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">🔍 Drill-Down: {drilldown}</h3>
              <button onClick={() => setDrilldown(null)} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={filteredSales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A" />
                <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={v => `₹${v.toLocaleString()}`} contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
                <Bar dataKey="sales" fill="#7C3AED" radius={[4,4,0,0]} name="Sales" />
                <Bar dataKey="profit" fill="#EC4899" radius={[4,4,0,0]} name="Profit" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              {filteredSales.slice(-3).map((d, i) => (
                <div key={i} className="bg-[#2D2257] rounded-xl p-3">
                  <p className="text-gray-400 text-xs">{d.month}</p>
                  <p className="text-white font-semibold">₹{(d.sales/1000).toFixed(0)}K</p>
                  <p className={`text-xs ${d.sales > d.forecast ? 'text-green-400' : 'text-red-400'}`}>
                    {d.sales > d.forecast ? '↑ Above' : '↓ Below'} forecast
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {has('sales_trend') && (
          <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
            <h2 className="text-lg font-bold mb-1">Monthly Sales Trends</h2>
            <p className="text-gray-400 text-sm mb-5">Sales vs Forecast comparison</p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={filteredSales}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A" />
                <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={v => [`₹${v.toLocaleString()}`, '']} contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
                <Legend />
                <Area type="monotone" dataKey="sales" stroke="#7C3AED" strokeWidth={2} fill="url(#salesGrad)" name="Sales" />
                <Area type="monotone" dataKey="forecast" stroke="#EC4899" strokeWidth={2} strokeDasharray="5 5" fill="url(#forecastGrad)" name="Forecast" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        {has('top_products') && (
          <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
            <h2 className="text-lg font-bold mb-1">Top Products</h2>
            <p className="text-gray-400 text-sm mb-5">Units sold by product</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A" />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
                <Bar dataKey="value" name="Units" radius={[6,6,0,0]}>
                  {productData.map((_, i) => <Cell key={i} fill={['#7C3AED','#EC4899','#3B82F6','#10B981','#F59E0B'][i%5]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {has('region') && (
          <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
            <h2 className="text-lg font-bold mb-1">Sales by Region</h2>
            <p className="text-gray-400 text-sm mb-4">Regional distribution</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={regionData} dataKey="sales" nameKey="region" cx="50%" cy="50%" outerRadius={80}
                  label={({ region, percent }) => `${region} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                  {regionData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={v => [`₹${(v/100000).toFixed(1)}L`, 'Sales']} contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        {has('ai_forecast') && (
          <div className="col-span-1 lg:col-span-2 bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold">AI Forecast Prediction</h2>
                <p className="text-gray-400 text-sm">Machine learning future demand analysis</p>
              </div>
              <a href="/forecast" className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-sm font-semibold hover:opacity-90 transition">Run Forecast →</a>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={filteredSales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A" />
                <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={v => [`₹${v.toLocaleString()}`, '']} contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
                <Line type="monotone" dataKey="forecast" stroke="#60A5FA" strokeWidth={3} dot={{ fill: '#60A5FA', r: 4 }} name="AI Forecast" />
                <Line type="monotone" dataKey="sales" stroke="#C084FC" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Actual Sales" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {has('activity') && (
        <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">Recent Forecasting Activity</h2>
            <a href="/reports" className="text-sm text-violet-400 hover:text-violet-300">View all →</a>
          </div>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#2D2257] transition">
                <span className="text-xl">{a.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{a.action}</p>
                  <p className="text-xs text-gray-400">{a.detail}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${a.status === 'success' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>{a.status}</span>
                  <p className="text-xs text-gray-500 mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Widget Config Modal */}
      {showWidgetConfig && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#211A45] rounded-2xl border border-[#39306A] p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-4">⚙️ Customize Dashboard Widgets</h3>
            <div className="space-y-3">
              {ALL_WIDGETS.map(w => (
                <label key={w.id} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={activeWidgets.includes(w.id)} onChange={() => toggleWidget(w.id)}
                    className="w-4 h-4 accent-violet-500" />
                  <span className="text-gray-300 group-hover:text-white transition text-sm">{w.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setActiveWidgets(ALL_WIDGETS.map(w=>w.id))} className="flex-1 py-2.5 bg-[#2D2257] rounded-xl text-sm text-gray-300 hover:bg-[#39306A] transition">Show All</button>
              <button onClick={() => setShowWidgetConfig(false)} className="flex-1 py-2.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">Done</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
