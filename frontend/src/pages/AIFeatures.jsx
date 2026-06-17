import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#7C3AED','#EC4899','#3B82F6','#10B981','#F59E0B']

const recommendations = [
  { id: 'P003', name: 'Running Shoes Elite', category: 'Fashion', current_stock: 12, avg_daily_sales: 22, days_until_stockout: 0.5, confidence_score: 94.2, recommended_order_qty: 330, demand_trend: 'rising', reason: '⚠️ Low stock — 📈 Rising demand' },
  { id: 'P005', name: 'Standing Desk Pro', category: 'Furniture', current_stock: 8, avg_daily_sales: 4, days_until_stockout: 2.0, confidence_score: 88.1, recommended_order_qty: 90, demand_trend: 'stable', reason: '⚠️ Low stock — 📊 Stable demand' },
  { id: 'P002', name: 'Mechanical Keyboard X', category: 'Electronics', current_stock: 78, avg_daily_sales: 15, days_until_stockout: 5.2, confidence_score: 91.5, recommended_order_qty: 220, demand_trend: 'rising', reason: '📈 Rising demand' },
  { id: 'P001', name: 'Wireless Headphones Pro', category: 'Electronics', current_stock: 145, avg_daily_sales: 28, days_until_stockout: 5.2, confidence_score: 95.8, recommended_order_qty: 420, demand_trend: 'rising', reason: '📈 Holiday demand spike incoming' },
  { id: 'P006', name: '4K Monitor UHD', category: 'Electronics', current_stock: 34, avg_daily_sales: 9, days_until_stockout: 3.8, confidence_score: 82.3, recommended_order_qty: 135, demand_trend: 'stable', reason: '📊 Stable demand' },
]

const spikes = [
  { product: 'Winter Jacket Premium', category: 'Fashion', predicted_spike: '+127%', predicted_date: '2025-12-15', confidence: 91.5, trigger: 'Seasonal weather shift', severity: 'high', recommended_stock: 180, current_stock: 56 },
  { product: 'Wireless Headphones Pro', category: 'Electronics', predicted_spike: '+84%', predicted_date: '2025-12-05', confidence: 87.2, trigger: 'Holiday season', severity: 'high', recommended_stock: 280, current_stock: 145 },
  { product: 'Gaming Mouse RGB', category: 'Electronics', predicted_spike: '+52%', predicted_date: '2025-12-08', confidence: 83.4, trigger: 'Gaming tournament season', severity: 'medium', recommended_stock: 320, current_stock: 203 },
  { product: 'Organic Oats 1kg', category: 'Groceries', predicted_spike: '+38%', predicted_date: '2025-12-20', confidence: 78.9, trigger: 'Health trend uptick', severity: 'medium', recommended_stock: 450, current_stock: 320 },
]

const segments = [
  { segment: 'High-Value Repeat', count: 1240, avg_order_value: 285.50, churn_risk: 'low', trend: '+12%', fill: '#7C3AED' },
  { segment: 'Tech Enthusiasts', count: 890, avg_order_value: 420.00, churn_risk: 'low', trend: '+18%', fill: '#3B82F6' },
  { segment: 'Seasonal Shoppers', count: 3450, avg_order_value: 95.20, churn_risk: 'medium', trend: '+5%', fill: '#10B981' },
  { segment: 'Bargain Hunters', count: 5680, avg_order_value: 42.80, churn_risk: 'high', trend: '-3%', fill: '#EC4899' },
]

const optimizations = [
  { product: 'Running Shoes Elite', issue: 'Critically low stock', priority: 'urgent', action: 'reorder', estimated_savings: 14200, suggestion: 'Reorder 330 units immediately. Expected stockout in 0.5 days.' },
  { product: 'Standing Desk Pro', issue: 'Very low stock', priority: 'high', action: 'reorder', estimated_savings: 8500, suggestion: 'Reorder 120 units. Stock covers only 2 days.' },
  { product: 'Winter Jacket Premium', issue: 'Demand spike predicted', priority: 'high', action: 'preorder', estimated_savings: 22800, suggestion: 'Increase stock by 124 units before Dec 15 spike. Confidence: 91.5%' },
  { product: 'Organic Oats 1kg', issue: 'Overstocked', priority: 'low', action: 'reduce', estimated_savings: 3200, suggestion: 'Reduce next order by 40%. Current stock covers 3.8 months.' },
  { product: 'Mechanical Keyboard X', issue: 'Suboptimal reorder point', priority: 'medium', action: 'adjust', estimated_savings: 5100, suggestion: 'Set reorder trigger at 100 units (currently 50).' },
]

const Card = ({ children, className = '' }) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>

const priorityBadge = (p) => {
  const cfg = { urgent: 'bg-red-900/40 text-red-400', high: 'bg-orange-900/40 text-orange-400', medium: 'bg-yellow-900/40 text-yellow-400', low: 'bg-green-900/40 text-green-400' }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cfg[p]}`}>{p}</span>
}

export default function AIFeatures() {
  const [tab, setTab] = useState('recommendations')

  const tabs = [
    { key: 'recommendations', label: '🎯 Recommendations' },
    { key: 'spikes', label: '⚡ Demand Spikes' },
    { key: 'behavior', label: '👥 Buying Behavior' },
    { key: 'optimization', label: '🧠 AI Optimization' },
  ]

  return (
    <Layout title="Advanced AI Features">
      <p className="text-gray-400 mb-6">AI-powered inventory recommendations, demand spike predictions, and customer behavior analysis</p>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Recommendations', value: recommendations.length, icon: '🎯', color: 'from-violet-500 to-purple-600' },
          { label: 'Demand Spikes', value: spikes.filter(s=>s.severity==='high').length, icon: '⚡', color: 'from-orange-500 to-red-600' },
          { label: 'Customer Segments', value: segments.length, icon: '👥', color: 'from-blue-500 to-cyan-600' },
          { label: 'Potential Savings', value: '$' + (optimizations.reduce((a,b)=>a+b.estimated_savings,0)/1000).toFixed(0)+'K', icon: '💰', color: 'from-green-500 to-emerald-600' },
        ].map((s, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg`}>{s.icon}</div>
              <div><p className="text-2xl font-bold text-white">{s.value}</p><p className="text-xs text-gray-400">{s.label}</p></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.key ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Recommendations */}
      {tab === 'recommendations' && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white mb-2">Product Demand Recommendations</h3>
          {recommendations.map(r => (
            <Card key={r.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${r.days_until_stockout < 3 ? 'bg-red-900/40 text-red-400' : 'bg-violet-900/40 text-violet-400'}`}>
                    {r.days_until_stockout < 3 ? '⚠️' : '📦'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white">{r.name}</p>
                      <span className="text-xs bg-[#2D2257] text-gray-400 px-2 py-0.5 rounded-full">{r.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.demand_trend==='rising' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'}`}>
                        {r.demand_trend === 'rising' ? '📈' : '📊'} {r.demand_trend}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{r.reason}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs">
                      <span className="text-gray-400">Stock: <span className={`font-semibold ${r.current_stock < 20 ? 'text-red-400' : 'text-white'}`}>{r.current_stock} units</span></span>
                      <span className="text-gray-400">Days left: <span className={`font-semibold ${r.days_until_stockout < 3 ? 'text-red-400' : 'text-yellow-400'}`}>{r.days_until_stockout}d</span></span>
                      <span className="text-gray-400">Reorder: <span className="text-violet-400 font-semibold">{r.recommended_order_qty} units</span></span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{r.confidence_score}%</div>
                  <div className="text-xs text-gray-400">AI Confidence</div>
                  <div className="w-16 bg-[#2D2257] h-1.5 rounded-full mt-1 ml-auto">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" style={{ width: `${r.confidence_score}%` }} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Demand Spikes */}
      {tab === 'spikes' && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Predicted Demand Spikes</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {spikes.map((s, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white">{s.product}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.severity === 'high' ? 'bg-red-900/40 text-red-400' : 'bg-yellow-900/40 text-yellow-400'}`}>{s.severity}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5">{s.category} · {s.predicted_date}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-400">{s.predicted_spike}</div>
                    <div className="text-xs text-gray-400">demand spike</div>
                  </div>
                </div>
                <div className="bg-[#2D2257] rounded-xl p-3 text-sm text-gray-300 mb-3">💡 {s.trigger}</div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Current: <span className="text-white font-semibold">{s.current_stock} units</span></span>
                  <span>Needed: <span className="text-violet-400 font-semibold">{s.recommended_stock} units</span></span>
                  <span>Confidence: <span className="text-green-400 font-semibold">{s.confidence}%</span></span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Buying Behavior */}
      {tab === 'behavior' && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Customer Buying Behavior Analysis</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-5">
              <h4 className="text-sm font-semibold text-gray-300 mb-4">Customer Segments by Count</h4>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={segments} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="count" nameKey="segment">
                    {segments.map((s, i) => <Cell key={i} fill={s.fill} />)}
                  </Pie>
                  <Tooltip formatter={(v) => v.toLocaleString()} contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {segments.map(s => (
                  <div key={s.segment} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: s.fill }} />
                      <span className="text-gray-300">{s.segment}</span>
                    </div>
                    <span className="text-white font-semibold">{s.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>
            <div className="space-y-3">
              {segments.map((s, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-white">{s.segment}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.churn_risk === 'low' ? 'bg-green-900/40 text-green-400' : s.churn_risk === 'medium' ? 'bg-yellow-900/40 text-yellow-400' : 'bg-red-900/40 text-red-400'}`}>
                      {s.churn_risk} churn risk
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-400">Avg order: <span className="text-white">${s.avg_order_value}</span></span>
                    <span className="text-gray-400">Count: <span className="text-violet-400">{s.count.toLocaleString()}</span></span>
                    <span className={`font-semibold ${s.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{s.trend}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Optimization */}
      {tab === 'optimization' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">AI Inventory Optimization Suggestions</h3>
            <div className="text-sm text-gray-400">Total potential savings: <span className="text-green-400 font-bold text-lg">${optimizations.reduce((a,b)=>a+b.estimated_savings,0).toLocaleString()}</span></div>
          </div>
          <div className="space-y-3">
            {optimizations.map((o, i) => (
              <Card key={i} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mt-0.5 ${o.priority==='urgent'?'bg-red-900/40':o.priority==='high'?'bg-orange-900/40':o.priority==='medium'?'bg-yellow-900/40':'bg-green-900/40'}`}>
                      {o.action==='reorder'?'🛒':o.action==='preorder'?'📦':o.action==='reduce'?'⬇️':'⚙️'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white">{o.product}</p>
                        {priorityBadge(o.priority)}
                        <span className="text-xs bg-[#2D2257] text-gray-400 px-2 py-0.5 rounded-full">{o.action}</span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{o.suggestion}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-400">+${o.estimated_savings.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">est. savings</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Layout>
  )
}
