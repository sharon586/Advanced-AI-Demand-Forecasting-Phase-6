import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const forecastData = [
  { month: 'Sep', demand: 420000, lr: 410000, rf: 430000, xgb: 425000, arima: 415000 },
  { month: 'Oct', demand: 480000, lr: 460000, rf: 490000, xgb: 485000, arima: 470000 },
  { month: 'Nov', demand: 530000, lr: 510000, rf: 545000, xgb: 538000, arima: 520000 },
  { month: 'Dec', demand: 610000, lr: 590000, rf: 625000, xgb: 618000, arima: 605000 },
  { month: 'Jan', demand: 700000, lr: 672000, rf: 715000, xgb: 708000, arima: 695000 },
  { month: 'Feb', demand: 770000, lr: 742000, rf: 785000, xgb: 778000, arima: 762000 },
]

const categoryData = [
  { category: 'Electronics', value: 90, revenue: 4200000 },
  { category: 'Fashion', value: 70, revenue: 3100000 },
  { category: 'Groceries', value: 55, revenue: 2400000 },
  { category: 'Furniture', value: 40, revenue: 1800000 },
  { category: 'Sports', value: 48, revenue: 2100000 },
]

const modelMetrics = [
  { model: 'Linear Regression', accuracy: 91.2, mae: 18500, rmse: 24200, r2: 0.89, color: '#3B82F6', predictions: 18 },
  { model: 'Random Forest', accuracy: 96.8, mae: 8900, rmse: 12400, r2: 0.97, color: '#7C3AED', predictions: 14 },
  { model: 'XGBoost', accuracy: 95.4, mae: 10200, rmse: 14800, r2: 0.95, color: '#EC4899', predictions: 10 },
  { model: 'ARIMA', accuracy: 88.6, mae: 22100, rmse: 29500, r2: 0.84, color: '#10B981', predictions: 6 },
]

const radarData = modelMetrics.map(m => ({
  model: m.model.split(' ')[0],
  Accuracy: m.accuracy,
  Speed: m.model === 'Linear Regression' ? 98 : m.model === 'ARIMA' ? 80 : m.model === 'Random Forest' ? 72 : 68,
  Stability: m.model === 'Random Forest' ? 95 : m.model === 'XGBoost' ? 92 : m.model === 'Linear Regression' ? 85 : 82,
}))

const historyData = [
  { id: 1, model: 'Random Forest', category: 'Electronics', region: 'North', accuracy: '96.8%', prediction: '₹7.15L', time: '5 min ago' },
  { id: 2, model: 'XGBoost', category: 'Fashion', region: 'South', accuracy: '95.4%', prediction: '₹4.82L', time: '2 hours ago' },
  { id: 3, model: 'Linear Regression', category: 'All', region: 'All', accuracy: '91.2%', prediction: '₹6.72L', time: '5 hours ago' },
  { id: 4, model: 'ARIMA', category: 'Groceries', region: 'East', accuracy: '88.6%', prediction: '₹3.24L', time: '1 day ago' },
]

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Groceries', 'Furniture', 'Sports']
const REGIONS = ['All', 'North', 'South', 'East', 'West']

export default function Forecast() {
  const [selectedModel, setSelectedModel] = useState('Random Forest')
  const [category, setCategory] = useState('All')
  const [region, setRegion] = useState('All')
  const [showComparison, setShowComparison] = useState(false)
  const [running, setRunning] = useState(false)

  const runForecast = () => {
    setRunning(true)
    setTimeout(() => setRunning(false), 1500)
  }

  const bestModel = modelMetrics.reduce((a, b) => a.accuracy > b.accuracy ? a : b)

  return (
    <Layout title="Forecast">
      <p className="text-gray-400 mb-6">AI-powered multi-model demand forecasting</p>

      {/* Model Selection + Filters */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
          <h3 className="font-semibold mb-4 text-white">Select Forecasting Model</h3>
          <div className="grid grid-cols-2 gap-3">
            {modelMetrics.map(m => (
              <button
                key={m.model}
                onClick={() => setSelectedModel(m.model)}
                className={`p-4 rounded-xl border-2 text-left transition ${
                  selectedModel === m.model
                    ? 'border-violet-500 bg-violet-900/30'
                    : 'border-[#39306A] hover:border-[#6D5FC0]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white">{m.model}</span>
                  {m.model === bestModel.model && (
                    <span className="text-xs px-2 py-0.5 bg-violet-900/50 text-violet-400 rounded-full">Best</span>
                  )}
                </div>
                <p className="text-2xl font-bold" style={{ color: m.color }}>{m.accuracy}%</p>
                <p className="text-xs text-gray-400">accuracy</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
          <h3 className="font-semibold mb-4 text-white">Forecast Filters</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Product Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Region</label>
              <select value={region} onChange={e => setRegion(e.target.value)}
                className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none">
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <button
              onClick={runForecast}
              disabled={running}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {running ? '⏳ Running Forecast...' : '🚀 Run Forecast'}
            </button>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="w-full py-3 rounded-xl bg-[#2D2257] border border-[#39306A] text-sm hover:bg-[#39306A] transition"
            >
              {showComparison ? '📊 Hide Comparison' : '🔬 Compare All Models'}
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Future Growth', value: '+24%', sub: 'Expected next quarter', color: 'text-green-400' },
          { label: 'Best Accuracy', value: '96.8%', sub: 'Random Forest model', color: 'text-violet-400' },
          { label: 'MAE Score', value: '8,900', sub: 'Mean absolute error', color: 'text-blue-400' },
          { label: 'High Demand', value: 'Electronics', sub: 'Strong future trend', color: 'text-pink-400' },
        ].map((c, i) => (
          <div key={i} className="bg-[#211A45] rounded-2xl p-5 border border-[#39306A]">
            <p className="text-sm text-gray-400 mb-2">{c.label}</p>
            <h3 className={`text-2xl font-bold ${c.color}`}>{c.value}</h3>
            <p className="text-xs text-gray-500 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Forecast Chart */}
      <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A] mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold">Future Sales Prediction — {selectedModel}</h2>
            <p className="text-sm text-gray-400">{category} · {region}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm bg-[#2D2257] rounded-lg hover:bg-[#39306A] transition">CSV</button>
            <button className="px-4 py-2 text-sm bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg hover:opacity-90 transition">Export PDF</button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#39306A" />
            <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
            <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
            <Tooltip formatter={v => [`₹${v.toLocaleString()}`, '']} contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
            <Legend />
            <Line type="monotone" dataKey="demand" stroke="#60A5FA" strokeWidth={3} dot={{ r: 4 }} name="Actual Demand" />
            {selectedModel === 'Linear Regression' && <Line type="monotone" dataKey="lr" stroke="#3B82F6" strokeWidth={2} strokeDasharray="5 5" name="LR Forecast" />}
            {selectedModel === 'Random Forest' && <Line type="monotone" dataKey="rf" stroke="#7C3AED" strokeWidth={2} strokeDasharray="5 5" name="RF Forecast" />}
            {selectedModel === 'XGBoost' && <Line type="monotone" dataKey="xgb" stroke="#EC4899" strokeWidth={2} strokeDasharray="5 5" name="XGB Forecast" />}
            {selectedModel === 'ARIMA' && <Line type="monotone" dataKey="arima" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" name="ARIMA Forecast" />}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Model Comparison */}
      {showComparison && (
        <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A] mb-6">
          <h2 className="text-lg font-bold mb-5">Model Comparison</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-gray-400 mb-4">Accuracy Comparison</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={modelMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#39306A" />
                  <XAxis dataKey="model" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#9CA3AF" domain={[80, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
                  <Bar dataKey="accuracy" name="Accuracy %" radius={[6, 6, 0, 0]}>
                    {modelMetrics.map((m, i) => <Cell key={i} fill={m.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-auto">
              <h3 className="text-sm text-gray-400 mb-4">Metrics Table</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-[#39306A]">
                    <th className="text-left pb-3">Model</th>
                    <th className="text-right pb-3">Accuracy</th>
                    <th className="text-right pb-3">MAE</th>
                    <th className="text-right pb-3">R²</th>
                  </tr>
                </thead>
                <tbody>
                  {modelMetrics.map((m, i) => (
                    <tr key={i} className={`border-b border-[#312B56] ${m.model === bestModel.model ? 'bg-violet-900/20' : ''}`}>
                      <td className="py-3 font-medium" style={{ color: m.color }}>{m.model}</td>
                      <td className="py-3 text-right">{m.accuracy}%</td>
                      <td className="py-3 text-right">{m.mae.toLocaleString()}</td>
                      <td className="py-3 text-right">{m.r2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Category Chart + History */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
          <h2 className="text-lg font-bold mb-5">Category-wise AI Demand</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#39306A" />
              <XAxis dataKey="category" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
              <Bar dataKey="value" name="Demand Score" radius={[6, 6, 0, 0]}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={['#7C3AED', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Forecast History</h2>
            <a href="/forecast/history" className="text-sm text-violet-400 hover:text-violet-300">View all →</a>
          </div>
          <div className="space-y-3">
            {historyData.map((h, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#2D2257] hover:bg-[#39306A] transition">
                <div className="w-8 h-8 rounded-lg bg-violet-900/50 flex items-center justify-center text-xs font-bold text-violet-400">#{h.id}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{h.model}</p>
                  <p className="text-xs text-gray-400">{h.category} · {h.region}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-400">{h.accuracy}</p>
                  <p className="text-xs text-gray-500">{h.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
        <h2 className="text-lg font-bold mb-4">AI Insights</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: '📈', text: 'Electronics demand expected to increase by 24% next quarter based on Random Forest analysis.', type: 'success' },
            { icon: '❄️', text: 'Winter season products (Dec-Jan) may show 38% higher revenue growth across all categories.', type: 'info' },
            { icon: '📉', text: 'Furniture category may experience lower demand. Consider adjusting inventory levels.', type: 'warning' },
          ].map((ins, i) => (
            <div key={i} className={`p-4 rounded-xl border ${
              ins.type === 'success' ? 'bg-green-900/20 border-green-800/40' :
              ins.type === 'warning' ? 'bg-yellow-900/20 border-yellow-800/40' :
              'bg-blue-900/20 border-blue-800/40'
            }`}>
              <span className="text-2xl">{ins.icon}</span>
              <p className="text-sm text-gray-300 mt-2">{ins.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
