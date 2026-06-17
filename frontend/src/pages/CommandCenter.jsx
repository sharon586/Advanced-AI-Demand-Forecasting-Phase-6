import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov']
const revTrend = MONTHS.map((m,i)=>({month:m,value:Math.round((2200000+i*180000)+(Math.random()-0.3)*300000)}))

const orgSummaries = [
  {org:'Acme Corp',plan:'Enterprise',revenue:284500000,accuracy:96.2,forecasts:45,members:12,health:'excellent',color:'#7C3AED'},
  {org:'GlobalTrade Ltd',plan:'Business',revenue:92000000,accuracy:94.1,forecasts:18,members:6,health:'good',color:'#EC4899'},
  {org:'NovaStar Retail',plan:'Starter',revenue:18000000,accuracy:88.5,forecasts:5,members:3,health:'fair',color:'#3B82F6'},
]

const execMetrics = [
  {label:'Total Revenue YTD',value:'₹28.45 Cr',change:'+18.4%',trend:'up',icon:'💰'},
  {label:'Net Profit YTD',value:'₹5.97 Cr',change:'+12.1%',trend:'up',icon:'📈'},
  {label:'Best Model Accuracy',value:'97.1%',change:'+0.8%',trend:'up',icon:'🎯'},
  {label:'Demand Fulfillment',value:'94.5%',change:'-0.5%',trend:'down',icon:'📦'},
  {label:'Active Organizations',value:'3',change:'+1',trend:'up',icon:'🏢'},
  {label:'Pending Approvals',value:'2',change:'0',trend:'stable',icon:'⏳'},
  {label:'Workflow Success Rate',value:'92%',change:'+3%',trend:'up',icon:'⚙️'},
  {label:'Data Quality Score',value:'78/100',change:'-2',trend:'down',icon:'🗄️'},
]

const alerts = [
  {id:1,severity:'critical',title:'Running Shoes stockout in < 1 day',category:'Inventory',org:'Acme Corp',action_required:true,time:'2h ago'},
  {id:2,severity:'critical',title:'Fashion dataset quality score: 65/100',category:'Data Quality',org:'Acme Corp',action_required:true,time:'5h ago'},
  {id:3,severity:'high',title:'2 forecasts pending approval > 8 hours',category:'Approvals',org:'All',action_required:true,time:'8h ago'},
  {id:4,severity:'high',title:'NovaStar Retail trial expires in 7 days',category:'Organization',org:'NovaStar Retail',action_required:true,time:'12h ago'},
  {id:5,severity:'medium',title:'ARIMA model accuracy dropped to 91.4%',category:'Model Performance',org:'GlobalTrade Ltd',action_required:false,time:'1d ago'},
]

const insights = [
  {category:'Revenue',priority:'high',title:'Holiday season driving +35% revenue surge',detail:'Electronics and Fashion peak Dec 1–25. Pre-stock recommended.',impact:'+₹4.2 Cr projected',confidence:94.2},
  {category:'Operations',priority:'high',title:'Workflow automation saving 18 hrs/week',detail:'3 active workflows eliminating manual submissions and report generation.',impact:'₹2.1L monthly savings',confidence:98.0},
  {category:'Risk',priority:'critical',title:'3 datasets below quality threshold',detail:'Fashion and Groceries quality <80. Forecast reliability at risk.',impact:'Accuracy may drop 4-8%',confidence:88.5},
  {category:'Growth',priority:'medium',title:'NovaStar trial upgrade opportunity',detail:'Strong adoption in trial phase. Upgrade before expiry for +₹18L ARR.',impact:'+₹18L ARR',confidence:76.0},
]

const healthColor = h => ({excellent:'text-green-400 bg-green-900/30',good:'text-blue-400 bg-blue-900/30',fair:'text-yellow-400 bg-yellow-900/30',poor:'text-red-400 bg-red-900/30'}[h])
const severityColor = s => ({critical:'bg-red-900/40 text-red-400',high:'bg-orange-900/40 text-orange-400',medium:'bg-yellow-900/40 text-yellow-400'}[s])
const Card = ({children,className=''}) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>

export default function CommandCenter() {
  const [section, setSection] = useState('overview')
  const [dismissedAlerts, setDismissedAlerts] = useState([])

  const visibleAlerts = alerts.filter(a=>!dismissedAlerts.includes(a.id))

  return (
    <Layout title="Executive Command Center">
      <p className="text-gray-400 mb-6">Organization-wide analytics, executive forecasting metrics, and strategic insights — all in one place</p>

      <div className="flex flex-wrap gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56]">
        {[{k:'overview',l:'🏢 Overview'},{k:'metrics',l:'📊 Exec Metrics'},{k:'orgs',l:'🏢 Organizations'},{k:'alerts',l:`🚨 Alerts${visibleAlerts.filter(a=>a.severity==='critical').length>0?` (${visibleAlerts.filter(a=>a.severity==='critical').length})`:''}`},{k:'insights',l:'💡 Insights'}].map(t=>(
          <button key={t.k} onClick={()=>setSection(t.k)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${section===t.k?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'text-gray-400 hover:text-white'}`}>{t.l}</button>
        ))}
      </div>

      {section==='overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{l:'Total Organizations',v:3,ic:'🏢',c:'from-violet-600 to-fuchsia-600',gradient:true},
              {l:'Platform Accuracy',v:'94.6%',ic:'🎯',c:'from-green-600 to-emerald-600',gradient:true},
              {l:'Critical Alerts',v:visibleAlerts.filter(a=>a.severity==='critical').length,ic:'🚨',c:'text-red-400',gradient:false},
              {l:'Total Forecasts',v:68,ic:'📈',c:'text-violet-400',gradient:false}
            ].map((s,i)=>(
              <div key={i} className={`rounded-2xl p-6 ${s.gradient?`bg-gradient-to-br ${s.c} shadow-lg`:'bg-[#211A45] border border-[#39306A]'}`}>
                <span className="text-2xl">{s.ic}</span>
                <p className={`text-3xl font-bold mt-2 ${s.gradient?'text-white':s.c}`}>{s.v}</p>
                <p className={`text-sm mt-1 ${s.gradient?'text-white/70':'text-gray-400'}`}>{s.l}</p>
              </div>
            ))}
          </div>
          <Card className="p-6">
            <h3 className="font-semibold text-white mb-4">Platform Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revTrend}>
                <defs><linearGradient id="rev6" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/><stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A"/>
                <XAxis dataKey="month" tick={{fill:'#9CA3AF',fontSize:12}}/>
                <YAxis tick={{fill:'#9CA3AF',fontSize:11}} tickFormatter={v=>`₹${(v/1e6).toFixed(1)}M`}/>
                <Tooltip formatter={v=>`₹${v.toLocaleString()}`} contentStyle={{background:'#211A45',border:'1px solid #39306A',borderRadius:8}}/>
                <Area type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={2.5} fill="url(#rev6)" name="Revenue"/>
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <div className="grid md:grid-cols-3 gap-4">
            {[['Platform Uptime','99.98%','healthy'],['Avg API Response','184ms','healthy'],['Data Quality Score','78/100','warning'],['Approval Backlog','2 pending','warning'],['Failed Workflows','3 this week','warning'],['Model Accuracy','97.1%','healthy']].map(([n,v,s])=>(
              <Card key={n} className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{n}</span>
                  <span className={`text-sm font-semibold ${s==='healthy'?'text-green-400':'text-yellow-400'}`}>{v}</span>
                </div>
                <div className="mt-2 h-1 bg-[#2D2257] rounded-full"><div className={`h-1 rounded-full ${s==='healthy'?'bg-green-500':'bg-yellow-500'}`} style={{width:s==='healthy'?'90%':'60%'}}/></div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {section==='metrics' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {execMetrics.map((m,i)=>(
            <Card key={i} className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{m.icon}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${m.trend==='up'?'bg-green-900/30 text-green-400':m.trend==='down'?'bg-red-900/30 text-red-400':'bg-gray-800 text-gray-400'}`}>{m.change}</span>
              </div>
              <p className="text-2xl font-bold text-white">{m.value}</p>
              <p className="text-xs text-gray-400 mt-1">{m.label}</p>
            </Card>
          ))}
        </div>
      )}

      {section==='orgs' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-2">Organization Performance Summaries</h3>
          {orgSummaries.map((o,i)=>(
            <Card key={i} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white" style={{background:o.color}}>{o.org[0]}</div>
                  <div>
                    <div className="flex items-center gap-2"><p className="font-semibold text-white">{o.org}</p><span className="text-xs bg-[#2D2257] text-gray-300 px-2 py-0.5 rounded-full">{o.plan}</span></div>
                    <div className="flex gap-4 text-xs text-gray-400 mt-1">
                      <span>Revenue: <span className="text-white font-semibold">₹{(o.revenue/1e7).toFixed(1)}Cr</span></span>
                      <span>Accuracy: <span className="text-violet-400 font-semibold">{o.accuracy}%</span></span>
                      <span>Forecasts: <span className="text-white">{o.forecasts}</span></span>
                      <span>Members: <span className="text-white">{o.members}</span></span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${healthColor(o.health)}`}>{o.health}</span>
              </div>
            </Card>
          ))}
          <Card className="p-5 bg-gradient-to-r from-violet-900/20 to-pink-900/10 border-violet-500/30">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><p className="font-semibold text-white">Platform Totals</p><p className="text-xs text-gray-400 mt-0.5">Across all organizations</p></div>
              <div className="flex gap-6 text-sm">
                <div className="text-center"><p className="text-xl font-bold text-white">₹{(orgSummaries.reduce((a,b)=>a+b.revenue,0)/1e7).toFixed(1)}Cr</p><p className="text-xs text-gray-400">Total Revenue</p></div>
                <div className="text-center"><p className="text-xl font-bold text-violet-400">{(orgSummaries.reduce((a,b)=>a+b.accuracy,0)/orgSummaries.length).toFixed(1)}%</p><p className="text-xs text-gray-400">Avg Accuracy</p></div>
                <div className="text-center"><p className="text-xl font-bold text-white">{orgSummaries.reduce((a,b)=>a+b.forecasts,0)}</p><p className="text-xs text-gray-400">Total Forecasts</p></div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {section==='alerts' && (
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Executive Alert Center</h3>
            {dismissedAlerts.length > 0 && <button onClick={()=>setDismissedAlerts([])} className="text-xs text-violet-400 hover:text-violet-300">Restore all</button>}
          </div>
          {visibleAlerts.length===0 && <Card className="p-12 text-center text-gray-500"><p className="text-4xl mb-3">✅</p><p>All alerts addressed!</p></Card>}
          {visibleAlerts.map(a=>(
            <Card key={a.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className={`text-2xl flex-shrink-0 ${a.severity==='critical'?'':'opacity-80'}`}>{a.severity==='critical'?'🔴':a.severity==='high'?'🟠':'🟡'}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-white">{a.title}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${severityColor(a.severity)}`}>{a.severity}</span>
                    </div>
                    <p className="text-xs text-gray-400">{a.category} · {a.org} · {a.time}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {a.action_required && <button className="px-3 py-1.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg text-xs font-semibold text-white hover:opacity-90">Take Action</button>}
                  <button onClick={()=>setDismissedAlerts(d=>[...d,a.id])} className="px-3 py-1.5 bg-[#2D2257] text-gray-400 hover:text-white rounded-lg text-xs font-semibold transition">Dismiss</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {section==='insights' && (
        <div className="space-y-3 max-w-3xl">
          <h3 className="text-lg font-semibold text-white mb-2">Strategic Insights</h3>
          {insights.map((ins,i)=>(
            <Card key={i} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${ins.priority==='critical'?'bg-red-900/40':ins.priority==='high'?'bg-orange-900/40':'bg-violet-900/40'}`}>
                    {ins.priority==='critical'?'🚨':ins.priority==='high'?'⚡':'💡'}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-white">{ins.title}</p>
                      <span className="text-xs bg-[#2D2257] text-gray-400 px-2 py-0.5 rounded-full">{ins.category}</span>
                    </div>
                    <p className="text-sm text-gray-300">{ins.detail}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                      <span>Impact: <span className="text-green-400 font-semibold">{ins.impact}</span></span>
                      <span>Confidence: <span className="text-violet-400">{ins.confidence}%</span></span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-xs font-semibold text-white hover:opacity-90 flex-shrink-0">Act Now</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  )
}
