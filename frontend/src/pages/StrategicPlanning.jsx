import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const QUARTERS = ['Q1 2026','Q2 2026','Q3 2026','Q4 2026']

const annualTargets = [
  {metric:'Revenue',target:120000000,current:74400000,unit:'₹',progress:62,status:'on_track',icon:'💰'},
  {metric:'Forecast Accuracy',target:97.0,current:96.2,unit:'%',progress:99,status:'on_track',icon:'🎯'},
  {metric:'Cost Reduction',target:8.0,current:3.2,unit:'%',progress:40,status:'at_risk',icon:'📉'},
  {metric:'New Markets',target:3,current:1,unit:'markets',progress:33,status:'behind',icon:'🌍'},
  {metric:'Customer Growth',target:25.0,current:18.0,unit:'%',progress:72,status:'on_track',icon:'👥'},
]

const monthlyData = MONTHS.map((m,i)=>({
  month:m,
  target:Math.round(9000000+i*150000),
  forecast:Math.round(9000000+i*150000+(Math.random()-0.3)*500000),
  actual:i<9?Math.round(9000000+i*150000+(Math.random()-0.2)*400000):null
}))

const qData = [
  {quarter:'Q1 2026',target:28000000,forecast:30240000,status:'ahead'},
  {quarter:'Q2 2026',target:29000000,forecast:29870000,status:'ahead'},
  {quarter:'Q3 2026',target:30000000,forecast:28500000,status:'at_risk'},
  {quarter:'Q4 2026',target:33000000,forecast:34650000,status:'ahead'},
]

const recommendations = [
  {priority:'critical',title:'Accelerate Q3 market expansion',impact:'Closes 67% gap on market target',action:'Launch NovaStar partnership in West region by June',deadline:'Jun 30, 2026'},
  {priority:'high',title:'Reduce operational cost by 4.8%',impact:'Achieves cost reduction target',action:'Automate 3 manual reporting workflows',deadline:'Sep 30, 2026'},
  {priority:'medium',title:'Increase Fashion forecast horizon to 6 months',impact:'Improves seasonal accuracy by 12%',action:'Update forecast settings for Fashion category',deadline:'Mar 31, 2026'},
  {priority:'low',title:'Onboard 2 new ERP integrations',impact:'Reduces data lag by 80%',action:'Connect Oracle + SAP to live data pipeline',deadline:'Dec 31, 2026'},
]

const Card = ({children,className=''}) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>
const statusColor = s => ({on_track:'text-green-400 bg-green-900/30',at_risk:'text-yellow-400 bg-yellow-900/30',behind:'text-red-400 bg-red-900/30',ahead:'text-green-400 bg-green-900/30'}[s]||'text-gray-400 bg-gray-800')
const priorityColor = p => ({critical:'bg-red-900/40 text-red-400',high:'bg-orange-900/40 text-orange-400',medium:'bg-yellow-900/40 text-yellow-400',low:'bg-green-900/40 text-green-400'}[p])

export default function StrategicPlanning() {
  const [view, setView] = useState('annual')
  const [selectedQ, setSelectedQ] = useState('Q1 2026')

  const qDetail = qData.find(q=>q.quarter===selectedQ)||qData[0]

  return (
    <Layout title="Strategic Planning">
      <p className="text-gray-400 mb-6">Annual and quarterly planning dashboards — track business targets against forecast demand</p>

      <div className="flex flex-wrap gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {[{k:'annual',l:'📅 Annual Plan 2026'},{k:'quarterly',l:'📊 Quarterly Plan'},{k:'targets',l:'🎯 Target Tracking'},{k:'recommendations',l:'💡 Recommendations'}].map(t=>(
          <button key={t.k} onClick={()=>setView(t.k)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${view===t.k?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'text-gray-400 hover:text-white'}`}>{t.l}</button>
        ))}
      </div>

      {view==='annual' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[{label:'Annual Revenue Target',value:'₹12 Cr',sub:'62% achieved YTD',icon:'💰',color:'from-violet-600 to-fuchsia-600'},
              {label:'On-Track Targets',value:`${annualTargets.filter(t=>t.status==='on_track').length}/${annualTargets.length}`,sub:'3 targets on track',icon:'✅',color:'from-green-600 to-emerald-600'},
              {label:'At Risk / Behind',value:`${annualTargets.filter(t=>t.status!=='on_track').length}`,sub:'Need attention',icon:'⚠️',color:'from-orange-600 to-red-600'}
            ].map((s,i)=>(
              <div key={i} className={`rounded-2xl p-6 bg-gradient-to-br ${s.color} shadow-lg`}>
                <span className="text-3xl">{s.icon}</span>
                <p className="text-3xl font-bold text-white mt-2">{s.value}</p>
                <p className="text-sm font-medium text-white/80 mt-1">{s.label}</p>
                <p className="text-xs text-white/60 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          <Card className="p-6">
            <h3 className="font-semibold text-white mb-4">Monthly Revenue — Target vs Forecast vs Actual</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A"/>
                <XAxis dataKey="month" tick={{fill:'#9CA3AF',fontSize:12}}/>
                <YAxis tick={{fill:'#9CA3AF',fontSize:11}} tickFormatter={v=>`₹${(v/1e6).toFixed(1)}M`}/>
                <Tooltip formatter={v=>v?`₹${v.toLocaleString()}`:'N/A'} contentStyle={{background:'#211A45',border:'1px solid #39306A',borderRadius:8}}/>
                <Legend/>
                <Line type="monotone" dataKey="target" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 3" dot={false} name="Target"/>
                <Line type="monotone" dataKey="forecast" stroke="#7C3AED" strokeWidth={2.5} dot={false} name="Forecast"/>
                <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2.5} dot={{r:4}} name="Actual" connectNulls={false}/>
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {view==='quarterly' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3 mb-2">
            {QUARTERS.map(q=>(
              <button key={q} onClick={()=>setSelectedQ(q)} className={`px-5 py-2 rounded-xl text-sm font-medium transition border ${selectedQ===q?'bg-gradient-to-r from-violet-500 to-pink-500 text-white border-transparent':'border-[#39306A] text-gray-400 hover:text-white'}`}>{q}</button>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[{l:'Target',v:`₹${(qDetail.target/1e6).toFixed(1)}M`,color:'text-gray-300'},
              {l:'Forecast',v:`₹${(qDetail.forecast/1e6).toFixed(1)}M`,color:'text-violet-400'},
              {l:'Variance',v:`${qDetail.forecast>qDetail.target?'+':''}${(((qDetail.forecast-qDetail.target)/qDetail.target)*100).toFixed(1)}%`,color:qDetail.forecast>=qDetail.target?'text-green-400':'text-red-400'}
            ].map((s,i)=>(
              <Card key={i} className="p-5 text-center">
                <p className={`text-3xl font-bold ${s.color}`}>{s.v}</p>
                <p className="text-sm text-gray-400 mt-1">{s.l}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold mt-2 inline-block ${statusColor(qDetail.status)}`}>{qDetail.status.replace('_',' ')}</span>
              </Card>
            ))}
          </div>
          <Card className="p-6">
            <h3 className="font-semibold text-white mb-4">All Quarters — Target vs Forecast</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={qData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A"/>
                <XAxis dataKey="quarter" tick={{fill:'#9CA3AF',fontSize:12}}/>
                <YAxis tick={{fill:'#9CA3AF',fontSize:11}} tickFormatter={v=>`₹${(v/1e6).toFixed(0)}M`}/>
                <Tooltip formatter={v=>`₹${v.toLocaleString()}`} contentStyle={{background:'#211A45',border:'1px solid #39306A',borderRadius:8}}/>
                <Legend/>
                <Bar dataKey="target" fill="#6B7280" radius={[4,4,0,0]} name="Target"/>
                <Bar dataKey="forecast" fill="#7C3AED" radius={[4,4,0,0]} name="Forecast"/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {view==='targets' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Business Target Tracking — 2026</h3>
          {annualTargets.map((t,i)=>(
            <Card key={i} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-2xl">{t.icon}</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <p className="font-semibold text-white">{t.metric}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(t.status)}`}>{t.status.replace('_',' ')}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2 text-sm">
                      <span className="text-gray-400">Current: <span className="text-white font-semibold">{typeof t.current==='number'&&t.current>1000?`₹${(t.current/1e7).toFixed(1)}Cr`:t.current}{t.unit}</span></span>
                      <span className="text-gray-500">→</span>
                      <span className="text-gray-400">Target: <span className="text-violet-400 font-semibold">{typeof t.target==='number'&&t.target>1000?`₹${(t.target/1e7).toFixed(1)}Cr`:t.target}{t.unit}</span></span>
                    </div>
                    <div className="w-full bg-[#2D2257] rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full transition-all ${t.progress>=80?'bg-gradient-to-r from-green-500 to-emerald-400':t.progress>=50?'bg-gradient-to-r from-violet-500 to-pink-500':'bg-gradient-to-r from-orange-500 to-red-500'}`}
                        style={{width:`${t.progress}%`}}/>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{t.progress}% of target achieved</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {view==='recommendations' && (
        <div className="space-y-3 max-w-3xl">
          <h3 className="text-lg font-semibold text-white mb-4">AI-Generated Planning Recommendations</h3>
          {recommendations.map((r,i)=>(
            <Card key={i} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${r.priority==='critical'?'bg-red-900/40':r.priority==='high'?'bg-orange-900/40':r.priority==='medium'?'bg-yellow-900/40':'bg-green-900/40'}`}>
                    {r.priority==='critical'?'🚨':r.priority==='high'?'⚡':r.priority==='medium'?'💡':'📌'}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-white">{r.title}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityColor(r.priority)}`}>{r.priority}</span>
                    </div>
                    <p className="text-sm text-gray-300">{r.impact}</p>
                    <div className="mt-2 p-3 bg-[#2D2257] rounded-xl text-sm text-gray-300">→ {r.action}</div>
                    <p className="text-xs text-gray-500 mt-2">Deadline: <span className="text-white">{r.deadline}</span></p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-xs font-semibold text-white hover:opacity-90 flex-shrink-0">Take Action</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  )
}
