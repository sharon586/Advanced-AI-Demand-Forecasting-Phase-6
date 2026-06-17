import React, { useState } from 'react'
import Layout from '../components/layout/Layout'

const recommendations = [
  { id:1, category:'Revenue', priority:'critical', title:'Pre-stock Electronics before holiday spike', summary:'AI predicts +84% demand spike for Electronics in 5 days. Current inventory covers only 5.2 days.', action:'Order 420 units of top 3 SKUs immediately', impact:'+₹12,80,000 projected revenue', confidence:94.2, deadline:'Dec 03, 2025' },
  { id:2, category:'Cost', priority:'high', title:'Reduce Groceries overstock by 40%', summary:'Organic Oats inventory covers 3.8 months at current sales rate. Holding costs accumulating daily.', action:'Reduce next procurement order by 40%', impact:'Save ₹3,20,000 in holding costs', confidence:88.5, deadline:'Dec 17, 2025' },
  { id:3, category:'Model', priority:'high', title:'Switch Electronics model to XGBoost', summary:'Linear Regression shows 8.6% lower accuracy than XGBoost for Electronics over last 60 days.', action:'Update default model for Electronics category', impact:'+₹28,500 forecasting accuracy value', confidence:91.5, deadline:'Dec 10, 2025' },
  { id:4, category:'Operations', priority:'medium', title:'Enable ensemble forecasting for Fashion', summary:'Combining RF + XGBoost reduces Fashion RMSE by 23% based on last 90 days of data.', action:'Enable ensemble mode in forecast settings', impact:'RMSE ↓ 23%, Accuracy ↑ ~4%', confidence:87.8, deadline:'Dec 31, 2025' },
  { id:5, category:'Revenue', priority:'low', title:'Retrain ARIMA with Oct–Nov data', summary:'ARIMA last trained 45 days ago. Adding recent seasonal data improves accuracy by ~3%.', action:'Schedule model retraining for maintenance window', impact:'Accuracy ↑ 3%, MAE ↓ ~150', confidence:78.3, deadline:'Jan 15, 2026' },
]

const opportunities = [
  { product:'Wireless Headphones Pro', category:'Electronics', opportunity:'Holiday bundle pricing', potential_uplift:'+₹4,20,000', confidence:91.2, window:'Dec 1–25', action:'Create gift-bundle SKU' },
  { product:'Winter Jacket Premium', category:'Fashion', opportunity:'Demand spike pre-stocking', potential_uplift:'+₹2,80,000', confidence:88.7, window:'Next 12 days', action:'Reorder 124 units' },
  { product:'Gaming Mouse RGB', category:'Electronics', opportunity:'Tournament season surge', potential_uplift:'+₹1,60,000', confidence:83.4, window:'Dec 8–20', action:'Increase stock by 120 units' },
  { product:'Standing Desk Pro', category:'Furniture', opportunity:'New Year workspace trend', potential_uplift:'+₹95,000', confidence:76.1, window:'Jan 1–15', action:'Pre-order 40 units' },
]

const declining = [
  { product:'DVD Player Classic', category:'Electronics', decline_rate:'-42% YoY', current_stock:210, monthly_sales:12, months_to_zero:8, recommendation:'Liquidate stock, discontinue reorders', severity:'critical' },
  { product:'Wired Office Headset', category:'Electronics', decline_rate:'-28% YoY', current_stock:85, monthly_sales:18, months_to_zero:14, recommendation:'Reduce order quantity by 60%', severity:'high' },
  { product:'Physical Planner 2024', category:'Stationery', decline_rate:'-18% YoY', current_stock:320, monthly_sales:35, months_to_zero:22, recommendation:'Clear with 25% discount campaign', severity:'medium' },
]

const highGrowth = [
  { product:'Wireless Headphones Pro', category:'Electronics', growth_rate:'+127% YoY', current_rank:1, prev_rank:4, trend:'accelerating', forecast_q:'38% QoQ', recommendation:'Increase stock by 80%, negotiate volume discount' },
  { product:'Gaming Mouse RGB', category:'Electronics', growth_rate:'+84% YoY', current_rank:2, prev_rank:7, trend:'strong', forecast_q:'+22% QoQ', recommendation:'Expand to 2 new regional markets' },
  { product:'Running Shoes Elite', category:'Fashion', growth_rate:'+62% YoY', current_rank:3, prev_rank:9, trend:'strong', forecast_q:'+18% QoQ', recommendation:'Add 3 new color variants based on demand signals' },
  { product:'Standing Desk Pro', category:'Furniture', growth_rate:'+48% YoY', current_rank:4, prev_rank:11, trend:'emerging', forecast_q:'+15% QoQ', recommendation:'Introduce budget-tier variant to capture wider segment' },
]

const Card = ({children,className=''}) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>
const priorityColor = p => ({critical:'bg-red-900/40 text-red-400',high:'bg-orange-900/40 text-orange-400',medium:'bg-yellow-900/40 text-yellow-400',low:'bg-green-900/40 text-green-400'}[p])
const severityColor = s => ({critical:'bg-red-900/40 text-red-400',high:'bg-orange-900/40 text-orange-400',medium:'bg-yellow-900/40 text-yellow-400'}[s])

export default function AIInsights() {
  const [tab, setTab] = useState('recommendations')
  const [dismissed, setDismissed] = useState([])

  const visibleRecs = recommendations.filter(r => !dismissed.includes(r.id))

  const tabs = [
    { k:'recommendations', l:'💡 Recommendations', count: visibleRecs.filter(r=>r.priority==='critical'||r.priority==='high').length },
    { k:'opportunities', l:'🚀 Opportunities', count: opportunities.length },
    { k:'declining', l:'📉 Declining Products', count: declining.length },
    { k:'high_growth', l:'📈 High Growth', count: highGrowth.length },
    { k:'summary', l:'📋 AI Summary', count: null },
  ]

  return (
    <Layout title="AI Insights Engine">
      <p className="text-gray-400 mb-6">Automated business recommendations, demand opportunities, and AI-generated forecast summaries</p>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {label:'Critical Actions',value:visibleRecs.filter(r=>r.priority==='critical').length,icon:'🚨',color:'from-red-500 to-rose-600'},
          {label:'Opportunities',value:opportunities.length,icon:'🚀',color:'from-green-500 to-emerald-600'},
          {label:'Declining Products',value:declining.length,icon:'📉',color:'from-orange-500 to-amber-600'},
          {label:'High Growth',value:highGrowth.length,icon:'📈',color:'from-violet-500 to-purple-600'},
        ].map((s,i)=>(
          <Card key={i} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg`}>{s.icon}</div>
              <div><p className="text-2xl font-bold text-white">{s.value}</p><p className="text-xs text-gray-400">{s.label}</p></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56]">
        {tabs.map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${tab===t.k?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'text-gray-400 hover:text-white'}`}>
            {t.l}
            {t.count!==null && <span className={`px-1.5 py-0.5 rounded-full text-xs ${tab===t.k?'bg-white/20':'bg-[#312B56]'}`}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Recommendations */}
      {tab==='recommendations' && (
        <div className="space-y-3">
          {visibleRecs.length === 0 && (
            <Card className="p-12 text-center text-gray-500"><p className="text-4xl mb-3">✅</p><p>All recommendations addressed!</p></Card>
          )}
          {visibleRecs.map(r=>(
            <Card key={r.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${r.priority==='critical'?'bg-red-900/40':r.priority==='high'?'bg-orange-900/40':r.priority==='medium'?'bg-yellow-900/40':'bg-green-900/40'}`}>
                    {r.priority==='critical'?'🚨':r.priority==='high'?'⚡':r.priority==='medium'?'💡':'📌'}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-white">{r.title}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityColor(r.priority)}`}>{r.priority}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-[#2D2257] text-gray-400">{r.category}</span>
                    </div>
                    <p className="text-sm text-gray-300">{r.summary}</p>
                    <div className="mt-2 p-3 bg-[#2D2257] rounded-xl">
                      <p className="text-xs text-gray-400">Recommended Action:</p>
                      <p className="text-sm text-white font-medium mt-0.5">→ {r.action}</p>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
                      <span>Impact: <span className="text-green-400 font-semibold">{r.impact}</span></span>
                      <span>Confidence: <span className="text-violet-400">{r.confidence}%</span></span>
                      <span>Deadline: <span className="text-white">{r.deadline}</span></span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="px-3 py-1.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg text-xs font-semibold text-white hover:opacity-90">Take Action</button>
                  <button onClick={()=>setDismissed(d=>[...d,r.id])} className="px-3 py-1.5 bg-[#2D2257] rounded-lg text-xs text-gray-400 hover:text-white hover:bg-[#39306A] transition">Dismiss</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Opportunities */}
      {tab==='opportunities' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Demand Opportunities Identified</h3>
            <p className="text-sm text-gray-400">Total uplift: <span className="text-green-400 font-bold">+₹9,55,000</span></p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {opportunities.map((o,i)=>(
              <Card key={i} className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-white">{o.product}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{o.category} · {o.window}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-green-400">{o.potential_uplift}</p>
                    <p className="text-xs text-gray-400">potential uplift</p>
                  </div>
                </div>
                <div className="bg-[#2D2257] rounded-xl p-3 mb-3">
                  <p className="text-xs text-gray-400">Opportunity</p>
                  <p className="text-sm text-white font-medium mt-0.5">🎯 {o.opportunity}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">AI Confidence: <span className="text-violet-400 font-semibold">{o.confidence}%</span></span>
                  <button className="px-3 py-1.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg text-xs font-semibold text-white hover:opacity-90">{o.action}</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Declining */}
      {tab==='declining' && (
        <div>
          <div className="p-4 mb-4 bg-red-900/20 border border-red-800/40 rounded-xl text-sm text-red-300">
            ⚠️ {declining.filter(d=>d.severity==='critical').length} product(s) showing critical decline — immediate action recommended
          </div>
          <div className="space-y-3">
            {declining.map((p,i)=>(
              <Card key={i} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${p.severity==='critical'?'bg-red-900/40':p.severity==='high'?'bg-orange-900/40':'bg-yellow-900/40'}`}>📉</div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white">{p.product}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${severityColor(p.severity)}`}>{p.severity}</span>
                        <span className="text-xs bg-[#2D2257] text-gray-400 px-2 py-0.5 rounded-full">{p.category}</span>
                      </div>
                      <p className="text-sm font-bold text-red-400 mt-1">{p.decline_rate}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-400 mt-1">
                        <span>Stock: <span className="text-white">{p.current_stock} units</span></span>
                        <span>Sales/month: <span className="text-white">{p.monthly_sales}</span></span>
                        <span>Est. zero demand: <span className="text-orange-400">{p.months_to_zero} months</span></span>
                      </div>
                      <div className="mt-2 p-3 bg-[#2D2257] rounded-xl text-sm text-gray-300">💡 {p.recommendation}</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-red-900/40 text-red-400 border border-red-800/50 rounded-xl text-xs font-semibold hover:bg-red-800/40 transition">Take Action</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* High Growth */}
      {tab==='high_growth' && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">High-Growth Products — Capitalize on Momentum</h3>
          <div className="space-y-3">
            {highGrowth.map((p,i)=>(
              <Card key={i} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-900/40 flex items-center justify-center text-lg font-bold text-green-400">#{p.current_rank}</div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white">{p.product}</p>
                        <span className="text-xs bg-[#2D2257] text-gray-400 px-2 py-0.5 rounded-full">{p.category}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.trend==='accelerating'?'bg-green-900/40 text-green-400':'bg-blue-900/40 text-blue-400'}`}>{p.trend}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs mt-1">
                        <span className="text-green-400 font-bold">{p.growth_rate}</span>
                        <span className="text-gray-400">Next Quarter: <span className="text-violet-400 font-semibold">{p.forecast_q}</span></span>
                        <span className="text-gray-400">Rank moved: #{p.prev_rank} → <span className="text-green-400">#{p.current_rank}</span></span>
                      </div>
                      <div className="mt-2 p-3 bg-[#2D2257] rounded-xl text-sm text-gray-300">🚀 {p.recommendation}</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-xs font-semibold text-white hover:opacity-90">Capitalize</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* AI Summary */}
      {tab==='summary' && (
        <div className="space-y-4 max-w-3xl">
          <Card className="p-6 border-violet-500/40">
            <div className="flex items-center gap-3 mb-4"><span className="text-3xl">🤖</span><div><p className="font-bold text-white text-lg">AI Forecast Summary — December 2025</p><p className="text-xs text-gray-400">Generated {new Date().toLocaleString()}</p></div></div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              AI analysis of All Categories shows strong positive momentum with overall demand tracking 8% above forecast baseline.
              XGBoost model leads with 97.1% accuracy. Two high-severity demand spikes are predicted within the next 12 days.
              Critical inventory shortages detected in 3 SKUs requiring immediate action.
            </p>
            <div className="space-y-2">
              {['Overall demand is tracking +8% above forecast baseline','XGBoost is the top performing model at 97.1% accuracy','2 high-severity demand spikes predicted in next 12 days','3 products at critical stockout risk (< 3 days remaining)','Holiday season expected to drive +35% revenue vs last December'].map((f,i)=>(
                <div key={i} className="flex items-start gap-2 text-sm"><span className="text-green-400 mt-0.5">✓</span><span className="text-gray-300">{f}</span></div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h4 className="font-semibold text-white mb-3">⚠️ Risk Flags</h4>
            <div className="space-y-2">
              {[{risk:'Running Shoes stockout in < 1 day',sev:'critical'},{risk:'Electronics demand spike not pre-stocked',sev:'high'},{risk:'ARIMA model overdue for retraining (45 days)',sev:'medium'}].map((r,i)=>(
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${r.sev==='critical'?'bg-red-900/20 border border-red-800/40':r.sev==='high'?'bg-orange-900/20 border border-orange-800/40':'bg-yellow-900/20 border border-yellow-800/40'}`}>
                  <span>{r.sev==='critical'?'🔴':r.sev==='high'?'🟠':'🟡'}</span>
                  <span className="text-sm text-gray-300">{r.risk}</span>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold ${severityColor(r.sev)}`}>{r.sev}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h4 className="font-semibold text-white mb-3">🎯 Model Performance</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[['Best Model','XGBoost'],['Best Accuracy','97.1%'],['Avg Accuracy','93.1%'],['Models Evaluated','4']].map(([l,v])=>(
                <div key={l} className="bg-[#2D2257] p-3 rounded-xl"><p className="text-gray-400 text-xs">{l}</p><p className="text-white font-semibold mt-0.5">{v}</p></div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </Layout>
  )
}
