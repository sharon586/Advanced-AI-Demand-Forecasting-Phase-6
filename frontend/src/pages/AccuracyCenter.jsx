import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov']
const MODEL_COLORS = { 'XGBoost':'#7C3AED','Random Forest':'#10B981','ARIMA':'#EC4899','Linear Regression':'#3B82F6' }

const models = [
  {model:'XGBoost',current_accuracy:97.1,mae:1240,rmse:1880,r2:0.971,mape:3.2,training_ms:320,status:'production',improvement:'+0.8%'},
  {model:'Random Forest',current_accuracy:95.2,mae:1580,rmse:2340,r2:0.952,mape:4.8,training_ms:580,status:'staging',improvement:'+0.4%'},
  {model:'ARIMA',current_accuracy:91.4,mae:2150,rmse:3100,r2:0.914,mape:8.6,training_ms:120,status:'backup',improvement:'-0.2%'},
  {model:'Linear Regression',current_accuracy:88.5,mae:2840,rmse:4200,r2:0.885,mape:11.5,training_ms:85,status:'deprecated',improvement:'+0.1%'},
]

const baseAccuracy = { XGBoost:94, 'Random Forest':91, ARIMA:87, 'Linear Regression':84 }
const trendData = MONTHS.map((month,i)=>{
  const obj = { month }
  Object.keys(baseAccuracy).forEach(m=>{ obj[m] = +(baseAccuracy[m]+i*0.3+(Math.random()-0.5)*3).toFixed(2) })
  return obj
})

const historicalData = Array.from({length:8},(_,i)=>({
  date: `Nov ${25-i*7}, 2025`,
  best_model: ['XGBoost','XGBoost','Random Forest','XGBoost','ARIMA','XGBoost','Random Forest','XGBoost'][i],
  best_accuracy: +(93+Math.random()*5).toFixed(2),
  category: ['Electronics','All','Fashion','Groceries','All','Electronics','Fashion','All'][i],
}))

const improvementData = (() => {
  const start = { XGBoost:90, 'Random Forest':88, ARIMA:84, 'Linear Regression':82 }
  return MONTHS.map((month,i)=>{
    const obj = { month }
    Object.keys(start).forEach(m=>{ obj[m] = +(start[m]+i*(m==='XGBoost'?0.65:m==='Random Forest'?0.6:m==='ARIMA'?0.55:0.4)+(Math.random()-0.5)*0.5).toFixed(2) })
    return obj
  })
})()

const statusBadge = (s) => ({production:'bg-green-900/40 text-green-400',staging:'bg-blue-900/40 text-blue-400',backup:'bg-yellow-900/40 text-yellow-400',deprecated:'bg-red-900/40 text-red-400'}[s])
const Card = ({children,className=''}) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>

export default function AccuracyCenter() {
  const [tab, setTab] = useState('dashboard')
  const [selectedModels, setSelectedModels] = useState(Object.keys(baseAccuracy))
  const [generating, setGenerating] = useState(false)
  const [reportMsg, setReportMsg] = useState('')

  const toggleModel = (m) => setSelectedModels(s=>s.includes(m)?s.filter(x=>x!==m):[...s,m])

  const generateReport = () => {
    setGenerating(true)
    setTimeout(()=>{ setGenerating(false); setReportMsg('✅ Model evaluation report generated for XGBoost (Last 30 days)') }, 1800)
    setTimeout(()=>setReportMsg(''), 5000)
  }

  return (
    <Layout title="Forecast Accuracy Center">
      <p className="text-gray-400 mb-6">Monitor model performance, accuracy trends, and track improvement over time</p>

      {reportMsg && <div className="mb-4 p-3 bg-green-900/30 border border-green-500/40 rounded-xl text-green-400 text-sm">{reportMsg}</div>}

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {label:'Best Accuracy',value:'97.1%',sub:'XGBoost model',icon:'🏆',color:'from-violet-500 to-purple-600'},
          {label:'Avg Accuracy',value:'93.1%',sub:'Across 4 models',icon:'📊',color:'from-blue-500 to-cyan-600'},
          {label:'Production Model',value:'XGBoost',sub:'Currently live',icon:'✅',color:'from-green-500 to-emerald-600'},
          {label:'Last Evaluated',value:'Today',sub:'Auto-evaluation',icon:'🔄',color:'from-pink-500 to-rose-600'},
        ].map((s,i)=>(
          <Card key={i} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg`}>{s.icon}</div>
              <div><p className="text-xl font-bold text-white">{s.value}</p><p className="text-xs text-gray-400">{s.label}</p><p className="text-xs text-gray-500">{s.sub}</p></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {[{k:'dashboard',l:'📊 Dashboard'},{k:'trends',l:'📈 Accuracy Trends'},{k:'historical',l:'🗂️ Historical'},{k:'improvement',l:'📉→📈 Improvement'},{k:'report',l:'📄 Generate Report'}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab===t.k?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'text-gray-400 hover:text-white'}`}>{t.l}</button>
        ))}
      </div>

      {/* Dashboard */}
      {tab==='dashboard' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            {models.map((m,i)=>(
              <Card key={i} className={`p-5 ${m.status==='production'?'border-violet-500/60':''}`}>
                {m.status==='production' && <p className="text-xs text-violet-400 font-semibold mb-2">⭐ PRODUCTION</p>}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{background:MODEL_COLORS[m.model]}}/>
                  <p className="font-semibold text-white text-sm">{m.model}</p>
                </div>
                <p className="text-3xl font-bold text-white">{m.current_accuracy}%</p>
                <p className="text-xs text-gray-400 mb-3">Accuracy</p>
                <div className="space-y-1.5 text-xs">
                  {[['MAE',m.mae.toLocaleString()],['RMSE',m.rmse.toLocaleString()],['R²',m.r2],['MAPE',`${m.mape}%`],['Train',`${m.training_ms}ms`]].map(([k,v])=>(
                    <div key={k} className="flex justify-between"><span className="text-gray-400">{k}</span><span className="text-white font-medium">{v}</span></div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusBadge(m.status)}`}>{m.status}</span>
                  <span className={`text-xs font-semibold ${m.improvement.startsWith('+')?'text-green-400':'text-red-400'}`}>{m.improvement} MoM</span>
                </div>
              </Card>
            ))}
          </div>
          <Card className="p-6">
            <h4 className="font-semibold text-white mb-4">Accuracy Comparison Bar</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={models}>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A"/>
                <XAxis dataKey="model" tick={{fill:'#9CA3AF',fontSize:11}}/>
                <YAxis domain={[80,100]} tick={{fill:'#9CA3AF',fontSize:11}}/>
                <Tooltip contentStyle={{background:'#211A45',border:'1px solid #39306A',borderRadius:8}} formatter={v=>`${v}%`}/>
                <Bar dataKey="current_accuracy" name="Accuracy %" radius={[6,6,0,0]}>
                  {models.map((m,i)=><rect key={i} fill={MODEL_COLORS[m.model]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Trends */}
      {tab==='trends' && (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(baseAccuracy).map(m=>(
              <button key={m} onClick={()=>toggleModel(m)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${selectedModels.includes(m)?'border-violet-500 text-white':'border-[#39306A] text-gray-400'}`} style={selectedModels.includes(m)?{background:MODEL_COLORS[m]+'33'}:{}}>
                <div className="w-2.5 h-2.5 rounded-full" style={{background:MODEL_COLORS[m]}}/> {m}
              </button>
            ))}
          </div>
          <Card className="p-6">
            <h4 className="font-semibold text-white mb-4">Accuracy Trends — {MONTHS[0]} to {MONTHS[MONTHS.length-1]} 2025</h4>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A"/>
                <XAxis dataKey="month" tick={{fill:'#9CA3AF',fontSize:12}}/>
                <YAxis domain={[80,100]} tick={{fill:'#9CA3AF',fontSize:12}}/>
                <Tooltip contentStyle={{background:'#211A45',border:'1px solid #39306A',borderRadius:8}} formatter={v=>`${v}%`}/>
                <Legend/>
                {selectedModels.map(m=><Line key={m} type="monotone" dataKey={m} stroke={MODEL_COLORS[m]} strokeWidth={2.5} dot={false}/>)}
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Historical */}
      {tab==='historical' && (
        <Card>
          <div className="p-5 border-b border-[#39306A]"><h4 className="font-semibold text-white">Historical Prediction Performance</h4></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#39306A] text-gray-400 text-left">
                {['Date','Best Model','Best Accuracy','Category','Details'].map(h=><th key={h} className="px-5 py-3 font-medium">{h}</th>)}
              </tr></thead>
              <tbody>
                {historicalData.map((r,i)=>(
                  <tr key={i} className="border-b border-[#2D2257] hover:bg-[#2D2257]/50 transition">
                    <td className="px-5 py-4 text-gray-300">{r.date}</td>
                    <td className="px-5 py-4"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{background:MODEL_COLORS[r.best_model]}}/><span className="text-white font-medium">{r.best_model}</span></div></td>
                    <td className="px-5 py-4 text-green-400 font-semibold">{r.best_accuracy}%</td>
                    <td className="px-5 py-4 text-gray-300">{r.category}</td>
                    <td className="px-5 py-4"><span className="text-xs bg-[#2D2257] text-violet-300 px-2 py-1 rounded-full">4 models evaluated</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Improvement */}
      {tab==='improvement' && (
        <Card className="p-6">
          <h4 className="font-semibold text-white mb-4">Model Improvement Over Time (Jan–Nov 2025)</h4>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={improvementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#39306A"/>
              <XAxis dataKey="month" tick={{fill:'#9CA3AF',fontSize:12}}/>
              <YAxis domain={[80,100]} tick={{fill:'#9CA3AF',fontSize:12}}/>
              <Tooltip contentStyle={{background:'#211A45',border:'1px solid #39306A',borderRadius:8}} formatter={v=>`${v}%`}/>
              <Legend/>
              {Object.keys(baseAccuracy).map(m=><Line key={m} type="monotone" dataKey={m} stroke={MODEL_COLORS[m]} strokeWidth={2.5} dot={false}/>)}
            </LineChart>
          </ResponsiveContainer>
          <div className="grid md:grid-cols-4 gap-4 mt-5">
            {models.map((m,i)=>{
              const start = {XGBoost:90,'Random Forest':88,ARIMA:84,'Linear Regression':82}[m.model]
              const gain = +(m.current_accuracy - start).toFixed(1)
              return (
                <div key={i} className="bg-[#2D2257] p-4 rounded-xl text-center">
                  <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{background:MODEL_COLORS[m.model]}}/>
                  <p className="font-semibold text-white text-sm">{m.model}</p>
                  <p className="text-2xl font-bold text-green-400 mt-1">+{gain}%</p>
                  <p className="text-xs text-gray-400">improvement</p>
                  <p className="text-xs text-gray-500 mt-1">{start}% → {m.current_accuracy}%</p>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Report */}
      {tab==='report' && (
        <div className="max-w-2xl">
          <Card className="p-6">
            <h4 className="font-semibold text-white mb-5">Generate Model Evaluation Report</h4>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-400 mb-1">Model</label>
                <select className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                  {models.map(m=><option key={m.model}>{m.model}</option>)}
                </select></div>
              <div><label className="block text-sm text-gray-400 mb-1">Evaluation Period</label>
                <select className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                  {['Last 7 days','Last 30 days','Last 90 days','Last 6 months','Full year'].map(o=><option key={o}>{o}</option>)}
                </select></div>
              <div><label className="block text-sm text-gray-400 mb-1">Report Format</label>
                <select className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                  {['PDF','CSV','JSON'].map(o=><option key={o}>{o}</option>)}
                </select></div>
            </div>
            <button onClick={generateReport} disabled={generating} className="mt-5 w-full py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90 disabled:opacity-60 transition">
              {generating?'⏳ Generating Report...':'📄 Generate Evaluation Report'}
            </button>
          </Card>
        </div>
      )}
    </Layout>
  )
}
