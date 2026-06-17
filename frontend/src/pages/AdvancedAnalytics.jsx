import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const REGION_DATA = [
  { region: 'North', current: 1800000, forecast: 2100000, growth: 16.7, color: '#7C3AED' },
  { region: 'South', current: 1200000, forecast: 1380000, growth: 15.0, color: '#EC4899' },
  { region: 'East', current: 980000, forecast: 1060000, growth: 8.2, color: '#3B82F6' },
  { region: 'West', current: 1350000, forecast: 1520000, growth: 12.6, color: '#10B981' },
]

const CATEGORY_DATA = [
  { category: 'Electronics', revenue: 4200000, growth: 24, units: 1820, trend: 'rising', color: '#7C3AED',
    monthly: [320,345,368,392,418,445,472,500,528,556,585,614].map(v=>v*1000) },
  { category: 'Fashion', revenue: 3100000, growth: 18, units: 2540, trend: 'rising', color: '#EC4899',
    monthly: [240,258,275,292,310,328,346,364,382,400,418,436].map(v=>v*1000) },
  { category: 'Groceries', revenue: 2400000, growth: 12, units: 4820, trend: 'stable', color: '#3B82F6',
    monthly: [185,194,203,212,222,232,242,252,262,272,282,292].map(v=>v*1000) },
  { category: 'Furniture', revenue: 1800000, growth: 8, units: 420, trend: 'stable', color: '#10B981',
    monthly: [140,146,152,158,164,170,176,182,188,194,200,206].map(v=>v*1000) },
]

const QUARTERLY = [
  { quarter: 'Q1 2025', actual: 2850000, predicted: null },
  { quarter: 'Q2 2025', actual: 3100000, predicted: null },
  { quarter: 'Q3 2025', actual: 2800000, predicted: null },
  { quarter: 'Q4 2025', actual: 2750000, predicted: null },
  { quarter: 'Q1 2026', actual: null, predicted: 3400000 },
  { quarter: 'Q2 2026', actual: null, predicted: 3750000 },
  { quarter: 'Q3 2026', actual: null, predicted: 3600000 },
  { quarter: 'Q4 2026', actual: null, predicted: 4050000 },
]

const RISK_ITEMS = [
  { product: 'Laptop UltraBook', category: 'Electronics', stock: 5, days: 1, score: 98, action: 'Reorder immediately', severity: 'high' },
  { product: 'Office Chair Ergo', category: 'Furniture', stock: 8, days: 2, score: 95, action: 'Reorder immediately', severity: 'high' },
  { product: 'Headphones Pro X1', category: 'Electronics', stock: 12, days: 3, score: 91, action: 'Order within 24hrs', severity: 'high' },
  { product: 'Running Shoes Air', category: 'Fashion', stock: 28, days: 7, score: 72, action: 'Plan reorder', severity: 'medium' },
  { product: 'Denim Jacket', category: 'Fashion', stock: 35, days: 9, score: 64, action: 'Monitor closely', severity: 'medium' },
  { product: 'Organic Rice 5kg', category: 'Groceries', stock: 180, days: 45, score: 18, action: 'No action needed', severity: 'low' },
]

const AI_INSIGHTS = [
  { icon: '💰', title: 'Electronics Revenue Surge', detail: 'Random Forest predicts 24% revenue increase in Electronics next quarter. Consider increasing inventory for Laptop UltraBook and Headphones Pro X1.', impact: '+₹12.4L potential', severity: 'high', confidence: 96.8 },
  { icon: '⚠️', title: 'Critical Stock Shortage', detail: '3 products at critical stock levels. Immediate reorder recommended to prevent ₹28.4L revenue loss.', impact: '-₹28.4L if unaddressed', severity: 'high', confidence: 98.1 },
  { icon: '❄️', title: 'Winter Demand Spike', detail: 'Historical patterns indicate 38% demand spike in Electronics during Dec-Jan. Begin inventory planning now.', impact: '+38% seasonal boost', severity: 'info', confidence: 91.4 },
  { icon: '🤖', title: 'Ensemble Model Ready', detail: 'Combining Random Forest + XGBoost improves accuracy from 96.8% to 98.2%. Enable ensemble mode for best results.', impact: '+1.4% accuracy', severity: 'info', confidence: 89.5 },
  { icon: '📈', title: 'Fashion Category Boom', detail: 'Fashion showing 18% growth. South region leading with Running Shoes Air as top performer.', impact: '+₹5.5L additional revenue', severity: 'success', confidence: 87.3 },
]

export default function AdvancedAnalytics() {
  const [tab, setTab] = useState('region')
  const [selectedCat, setSelectedCat] = useState('Electronics')

  const catData = CATEGORY_DATA.find(c => c.category === selectedCat)
  const catMonthly = LABELS.map((l, i) => ({ month: l, revenue: catData?.monthly[i] || 0 }))

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18); doc.setTextColor(124, 58, 237)
    doc.text('Advanced Analytics Report', 14, 20)
    doc.setFontSize(10); doc.setTextColor(100)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28)
    doc.autoTable({
      startY: 35,
      head: [['Region', 'Current Revenue', 'Forecast', 'Growth']],
      body: REGION_DATA.map(r => [r.region, `₹${(r.current/100000).toFixed(1)}L`, `₹${(r.forecast/100000).toFixed(1)}L`, `+${r.growth}%`]),
      headStyles: { fillColor: [124, 58, 237] },
    })
    doc.save('Advanced_Analytics_Report.pdf')
  }

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(REGION_DATA.map(r => ({ Region: r.region, Current: r.current, Forecast: r.forecast, Growth: r.growth + '%' })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Region Analytics')
    saveAs(new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'Advanced_Analytics.xlsx')
  }

  const severityColors = { high: 'border-red-700/50 bg-red-900/10', info: 'border-blue-700/50 bg-blue-900/10', success: 'border-green-700/50 bg-green-900/10', medium: 'border-yellow-700/50 bg-yellow-900/10' }
  const riskColors = { high: 'text-red-400 bg-red-900/30', medium: 'text-yellow-400 bg-yellow-900/30', low: 'text-green-400 bg-green-900/30' }

  return (
    <Layout title="Advanced Analytics">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400">Enterprise-level AI analytics and business intelligence</p>
        <div className="flex gap-3">
          <button onClick={exportExcel} className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-sm font-semibold hover:opacity-90 transition">📊 Excel</button>
          <button onClick={exportPDF} className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-sm font-semibold hover:opacity-90 transition">📄 PDF</button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit flex-wrap">
        {[
          { key: 'region', label: '🗺️ Region Forecast' },
          { key: 'category', label: '🏷️ Category Insights' },
          { key: 'revenue', label: '💰 Revenue Prediction' },
          { key: 'inventory', label: '📦 Inventory Risk' },
          { key: 'insights', label: '🤖 AI Insights' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab===t.key ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'region' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {REGION_DATA.map((r, i) => (
              <div key={i} className="bg-[#211A45] rounded-2xl p-5 border border-[#39306A]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{r.region}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-400">+{r.growth}%</span>
                </div>
                <p className="text-xl font-bold" style={{ color: r.color }}>₹{(r.current/100000).toFixed(1)}L</p>
                <p className="text-xs text-gray-400 mt-1">→ ₹{(r.forecast/100000).toFixed(1)}L forecast</p>
                <div className="mt-2 bg-[#312B56] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ background: r.color, width: `${(r.current/2100000)*100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
            <h3 className="font-semibold mb-5">Region Revenue Comparison</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={REGION_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A" />
                <XAxis dataKey="region" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
                <Tooltip formatter={v => [`₹${(v/100000).toFixed(1)}L`, '']} contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
                <Bar dataKey="current" name="Current" radius={[6,6,0,0]}>
                  {REGION_DATA.map((r,i) => <Cell key={i} fill={r.color} />)}
                </Bar>
                <Bar dataKey="forecast" name="Forecast" radius={[6,6,0,0]} opacity={0.5}>
                  {REGION_DATA.map((r,i) => <Cell key={i} fill={r.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === 'category' && (
        <div className="space-y-6">
          <div className="flex gap-2 flex-wrap">
            {CATEGORY_DATA.map(c => (
              <button key={c.category} onClick={() => setSelectedCat(c.category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${selectedCat===c.category?'border-violet-500 bg-violet-900/30 text-white':'border-[#39306A] text-gray-400 hover:text-white'}`}>
                {c.category}
              </button>
            ))}
          </div>
          {catData && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
                <h3 className="font-semibold mb-2">{catData.category} — Monthly Revenue</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={catMonthly}>
                    <defs>
                      <linearGradient id="catGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={catData.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={catData.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#39306A" />
                    <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                    <Tooltip formatter={v => [`₹${v.toLocaleString()}`, '']} contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
                    <Area type="monotone" dataKey="revenue" stroke={catData.color} strokeWidth={2} fill="url(#catGrad)" name="Revenue" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A] space-y-4">
                <h3 className="font-semibold">{catData.category} Insights</h3>
                {[
                  { label: 'Total Revenue', value: `₹${(catData.revenue/100000).toFixed(1)}L`, color: 'text-violet-400' },
                  { label: 'YoY Growth', value: `+${catData.growth}%`, color: 'text-green-400' },
                  { label: 'Units Sold', value: catData.units.toLocaleString(), color: 'text-blue-400' },
                  { label: 'Trend', value: catData.trend, color: catData.trend==='rising'?'text-green-400':'text-yellow-400' },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-[#2D2257]">
                    <span className="text-sm text-gray-400">{s.label}</span>
                    <span className={`font-bold ${s.color} capitalize`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Current Year', value: '₹115L', sub: '2025 actual revenue', color: 'text-violet-400' },
              { label: 'Next Year Prediction', value: '₹148L', sub: 'AI model forecast', color: 'text-green-400' },
              { label: 'Growth Rate', value: '+28.7%', sub: '94.2% confidence', color: 'text-pink-400' },
            ].map((c, i) => (
              <div key={i} className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
                <p className="text-sm text-gray-400 mb-2">{c.label}</p>
                <h3 className={`text-3xl font-bold ${c.color}`}>{c.value}</h3>
                <p className="text-xs text-gray-500 mt-1">{c.sub}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
            <h3 className="font-semibold mb-5">Quarterly Revenue — Actual vs Predicted</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={QUARTERLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A" />
                <XAxis dataKey="quarter" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
                <Tooltip formatter={v => v ? [`₹${(v/100000).toFixed(1)}L`, ''] : ['N/A', '']} contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="actual" fill="#7C3AED" radius={[6,6,0,0]} name="Actual" />
                <Bar dataKey="predicted" fill="#EC4899" radius={[6,6,0,0]} name="Predicted" opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === 'inventory' && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'High Risk Items', value: 3, color: 'text-red-400', bg: 'bg-red-900/20 border-red-800/40' },
              { label: 'Medium Risk', value: 2, color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-800/40' },
              { label: 'Potential Loss', value: '₹28.4L', color: 'text-white', bg: 'bg-[#211A45] border-[#39306A]' },
            ].map((c, i) => (
              <div key={i} className={`rounded-2xl p-5 border ${c.bg}`}>
                <p className="text-sm text-gray-400 mb-1">{c.label}</p>
                <h3 className={`text-3xl font-bold ${c.color}`}>{c.value}</h3>
              </div>
            ))}
          </div>
          <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
            <h3 className="font-semibold mb-4">Inventory Risk Analysis</h3>
            <div className="space-y-3">
              {RISK_ITEMS.map((r, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${r.severity==='high'?'border-red-800/40 bg-red-900/10':r.severity==='medium'?'border-yellow-800/40 bg-yellow-900/10':'border-green-800/40 bg-green-900/10'}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{r.product}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#312B56] text-gray-400">{r.category}</span>
                    </div>
                    <p className="text-xs text-gray-400">{r.action}</p>
                  </div>
                  <div className="text-center px-3">
                    <p className="text-xl font-bold text-white">{r.stock}</p>
                    <p className="text-xs text-gray-500">units left</p>
                  </div>
                  <div className="text-center px-3">
                    <p className="text-lg font-bold text-white">{r.days}d</p>
                    <p className="text-xs text-gray-500">remaining</p>
                  </div>
                  <div className="text-center">
                    <div className="relative w-12 h-12">
                      <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#312B56" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.9" fill="none"
                          stroke={r.severity==='high'?'#EF4444':r.severity==='medium'?'#F59E0B':'#10B981'}
                          strokeWidth="3" strokeDasharray={`${r.score} ${100-r.score}`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{r.score}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">risk</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'insights' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">AI-generated business intelligence insights</p>
            <button onClick={exportPDF} className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-sm font-semibold hover:opacity-90 transition">
              📄 Download Insights
            </button>
          </div>
          {AI_INSIGHTS.map((ins, i) => (
            <div key={i} className={`p-5 rounded-2xl border ${severityColors[ins.severity]||'border-[#39306A] bg-[#211A45]'}`}>
              <div className="flex items-start gap-4">
                <span className="text-3xl">{ins.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{ins.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{ins.confidence}% confidence</span>
                      <div className="w-16 bg-[#312B56] rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" style={{ width: `${ins.confidence}%` }} />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{ins.detail}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#312B56] text-violet-300">{ins.impact}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
