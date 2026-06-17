import React, { useState } from 'react'
import Layout from '../components/layout/Layout'

const historyData = [
  { id: 1, model: 'Random Forest', category: 'Electronics', region: 'North', accuracy: '96.8%', mae: '8,900', rmse: '12,400', r2: '0.97', prediction: '₹7.15L', time: '5 min ago' },
  { id: 2, model: 'XGBoost', category: 'Fashion', region: 'South', accuracy: '95.4%', mae: '10,200', rmse: '14,800', r2: '0.95', prediction: '₹4.82L', time: '2 hours ago' },
  { id: 3, model: 'Linear Regression', category: 'All', region: 'All', accuracy: '91.2%', mae: '18,500', rmse: '24,200', r2: '0.89', prediction: '₹6.72L', time: '5 hours ago' },
  { id: 4, model: 'ARIMA', category: 'Groceries', region: 'East', accuracy: '88.6%', mae: '22,100', rmse: '29,500', r2: '0.84', prediction: '₹3.24L', time: '1 day ago' },
  { id: 5, model: 'Random Forest', category: 'Furniture', region: 'West', accuracy: '94.1%', mae: '11,300', rmse: '15,600', r2: '0.93', prediction: '₹2.18L', time: '2 days ago' },
  { id: 6, model: 'XGBoost', category: 'Electronics', region: 'South', accuracy: '95.8%', mae: '9,800', rmse: '13,200', r2: '0.96', prediction: '₹8.42L', time: '3 days ago' },
  { id: 7, model: 'Linear Regression', category: 'Fashion', region: 'North', accuracy: '89.4%', mae: '20,100', rmse: '26,800', r2: '0.87', prediction: '₹3.91L', time: '4 days ago' },
  { id: 8, model: 'ARIMA', category: 'All', region: 'All', accuracy: '87.2%', mae: '24,500', rmse: '31,200', r2: '0.82', prediction: '₹5.63L', time: '5 days ago' },
]

const modelColors = { 'Random Forest': '#7C3AED', 'XGBoost': '#EC4899', 'Linear Regression': '#3B82F6', 'ARIMA': '#10B981' }

export default function ForecastHistory() {
  const [search, setSearch] = useState('')
  const [modelFilter, setModelFilter] = useState('All')

  const filtered = historyData.filter(h => {
    if (modelFilter !== 'All' && h.model !== modelFilter) return false
    if (search && !h.model.toLowerCase().includes(search.toLowerCase()) &&
        !h.category.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <Layout title="Forecast History">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400">All past forecast runs with full accuracy metrics</p>
        <a href="/forecast" className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-sm font-semibold hover:opacity-90 transition">
          + New Forecast
        </a>
      </div>

      <div className="flex gap-3 mb-6 p-4 bg-[#1B1538] rounded-2xl border border-[#312B56]">
        <input placeholder="🔍 Search model or category..." value={search} onChange={e => setSearch(e.target.value)}
          className="bg-[#241B4B] text-white text-sm px-4 py-2 rounded-lg border border-[#39306A] outline-none w-60" />
        <select value={modelFilter} onChange={e => setModelFilter(e.target.value)}
          className="bg-[#241B4B] text-white text-sm px-3 py-2 rounded-lg border border-[#39306A] outline-none">
          {['All', 'Random Forest', 'XGBoost', 'Linear Regression', 'ARIMA'].map(m => <option key={m}>{m}</option>)}
        </select>
        <span className="ml-auto text-sm text-gray-400 self-center">{filtered.length} records</span>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Forecasts', value: historyData.length, color: 'text-violet-400' },
          { label: 'Best Accuracy', value: '96.8%', color: 'text-green-400' },
          { label: 'Avg Accuracy', value: '92.3%', color: 'text-blue-400' },
          { label: 'Most Used', value: 'Random Forest', color: 'text-pink-400' },
        ].map((s, i) => (
          <div key={i} className="bg-[#211A45] rounded-2xl p-5 border border-[#39306A]">
            <p className="text-sm text-gray-400 mb-1">{s.label}</p>
            <h3 className={`text-xl font-bold ${s.color}`}>{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#39306A]">
                {['#', 'Model', 'Category', 'Region', 'Prediction', 'Accuracy', 'MAE', 'RMSE', 'R²', 'Time'].map(h => (
                  <th key={h} className="text-left pb-3 px-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((h, i) => (
                <tr key={i} className="border-b border-[#312B56] hover:bg-[#2D2257] transition">
                  <td className="py-3 px-3 text-gray-500">#{h.id}</td>
                  <td className="py-3 px-3">
                    <span className="text-xs px-2 py-1 rounded-lg font-semibold" style={{ color: modelColors[h.model], background: modelColors[h.model] + '20', border: `1px solid ${modelColors[h.model]}40` }}>
                      {h.model}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-300">{h.category}</td>
                  <td className="py-3 px-3 text-gray-300">{h.region}</td>
                  <td className="py-3 px-3 text-white font-medium">{h.prediction}</td>
                  <td className="py-3 px-3 text-green-400 font-bold">{h.accuracy}</td>
                  <td className="py-3 px-3 text-gray-300">{h.mae}</td>
                  <td className="py-3 px-3 text-gray-300">{h.rmse}</td>
                  <td className="py-3 px-3 text-gray-300">{h.r2}</td>
                  <td className="py-3 px-3 text-gray-500">{h.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
