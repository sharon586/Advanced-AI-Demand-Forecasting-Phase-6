import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts'

const revenueData = [
  {month:'Jan',revenue:2100,profit:441,cost:1659},{month:'Feb',revenue:1800,profit:378,cost:1422},{month:'Mar',revenue:2600,profit:546,cost:2054},{month:'Apr',revenue:1400,profit:294,cost:1106},{month:'May',revenue:3050,profit:640,cost:2410},{month:'Jun',revenue:2400,profit:504,cost:1896},{month:'Jul',revenue:3600,profit:756,cost:2844},{month:'Aug',revenue:3250,profit:682,cost:2568},{month:'Sep',revenue:2900,profit:609,cost:2291},{month:'Oct',revenue:3550,profit:745,cost:2805},{month:'Nov',revenue:4100,profit:861,cost:3239},
]
const costData = [
  {category:'Operations',amount:820,color:'#7C3AED'},{category:'Procurement',amount:680,color:'#EC4899'},{category:'Logistics',amount:390,color:'#3B82F6'},{category:'Marketing',amount:210,color:'#10B981'},{category:'Technology',amount:98,color:'#F59E0B'},{category:'Other',amount:50,color:'#6B7280'},
]
const kpiData = [
  {name:'Revenue Growth',current:18.4,target:15.0,unit:'%',status:'achieved',icon:'💰'},
  {name:'Forecast Accuracy',current:96.2,target:95.0,unit:'%',status:'achieved',icon:'🎯'},
  {name:'Inventory Turnover',current:8.3,target:8.0,unit:'x',status:'achieved',icon:'🔄'},
  {name:'Demand Fulfillment',current:94.5,target:96.0,unit:'%',status:'at_risk',icon:'📦'},
  {name:'Cost Reduction',current:3.2,target:5.0,unit:'%',status:'behind',icon:'📉'},
  {name:'Customer Satisfaction',current:88.7,target:90.0,unit:'%',status:'at_risk',icon:'⭐'},
]
const impactData = [
  {month:'Jan',before:1540,after:2100},{month:'Feb',before:1480,after:1800},{month:'Mar',before:1620,after:2600},{month:'Apr',before:1390,after:1400},{month:'May',before:1580,after:3050},{month:'Jun',before:1520,after:2400},{month:'Jul',before:1650,after:3600},{month:'Aug',before:1700,after:3250},{month:'Sep',before:1610,after:2900},{month:'Oct',before:1680,after:3550},{month:'Nov',before:1720,after:4100},
]

const Card = ({children,className=''}) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>
const statusColor = s => s==='achieved'?'text-green-400 bg-green-900/30':s==='at_risk'?'text-yellow-400 bg-yellow-900/30':'text-red-400 bg-red-900/30'

export default function ExecutiveDashboard() {
  const [activeSection, setActiveSection] = useState('overview')

  return (
    <Layout title="Executive Dashboard">
      <p className="text-gray-400 mb-6">Business intelligence overview — revenue, profit, cost analysis, and forecasting impact</p>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {label:'Total Revenue YTD',value:'₹28.45 Cr',change:'+18.4%',icon:'💰',gradient:true,color:'from-violet-600 to-fuchsia-600'},
          {label:'Net Profit YTD',value:'₹5.97 Cr',change:'+12.1%',icon:'📈',gradient:true,color:'from-green-600 to-emerald-600'},
          {label:'Total Cost YTD',value:'₹22.48 Cr',change:'+8.2%',icon:'📊',gradient:false,valColor:'text-orange-400'},
          {label:'Forecast Accuracy',value:'96.2%',change:'+1.8%',icon:'🎯',gradient:false,valColor:'text-violet-400'},
        ].map((k,i) => (
          <div key={i} className={`rounded-2xl p-6 ${k.gradient?`bg-gradient-to-br ${k.color} shadow-lg`:'bg-[#211A45] border border-[#39306A]'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{k.icon}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${k.gradient?'bg-white/20 text-white':'bg-green-900/30 text-green-400'}`}>{k.change}</span>
            </div>
            <p className={`text-2xl font-bold ${k.gradient?'text-white':k.valColor}`}>{k.value}</p>
            <p className={`text-xs mt-1 ${k.gradient?'text-white/70':'text-gray-400'}`}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56]">
        {[{k:'overview',l:'📊 Overview'},{k:'revenue',l:'💰 Revenue'},{k:'profit',l:'📈 Profit & Cost'},{k:'kpis',l:'🎯 KPIs'},{k:'impact',l:'⚡ AI Impact'}].map(t=>(
          <button key={t.k} onClick={()=>setActiveSection(t.k)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeSection===t.k?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'text-gray-400 hover:text-white'}`}>{t.l}</button>
        ))}
      </div>

      {activeSection==='overview' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-base font-semibold text-white mb-4">Revenue vs Profit Trend</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/><stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/></linearGradient>
                    <linearGradient id="prof" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#39306A"/>
                  <XAxis dataKey="month" tick={{fill:'#9CA3AF',fontSize:12}}/>
                  <YAxis tick={{fill:'#9CA3AF',fontSize:11}} tickFormatter={v=>`₹${v}L`}/>
                  <Tooltip formatter={v=>`₹${v}L`} contentStyle={{background:'#211A45',border:'1px solid #39306A',borderRadius:8}}/>
                  <Legend/>
                  <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={2} fill="url(#rev)" name="Revenue (₹L)"/>
                  <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fill="url(#prof)" name="Profit (₹L)"/>
                </AreaChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-6">
              <h3 className="text-base font-semibold text-white mb-4">Cost Breakdown</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart><Pie data={costData} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={({category,percent})=>`${category} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                  {costData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie><Tooltip formatter={v=>`₹${v}L`} contentStyle={{background:'#211A45',border:'1px solid #39306A',borderRadius:8}}/></PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {costData.map(c=><div key={c.category} className="flex items-center gap-1.5 text-xs"><div className="w-2.5 h-2.5 rounded-full" style={{background:c.color}}/><span className="text-gray-300">{c.category}</span></div>)}
              </div>
            </Card>
          </div>
          <Card className="p-6">
            <h3 className="text-base font-semibold text-white mb-4">Performance KPI Summary</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {kpiData.map((k,i)=>(
                <div key={i} className="flex items-center justify-between p-4 bg-[#2D2257] rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{k.icon}</span>
                    <div><p className="text-sm font-medium text-white">{k.name}</p>
                      <p className="text-xs text-gray-400">Target: {k.target}{k.unit}</p></div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{k.current}{k.unit}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColor(k.status)}`}>{k.status.replace('_',' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeSection==='revenue' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-white mb-4">Monthly Revenue Forecast</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A"/>
                <XAxis dataKey="month" tick={{fill:'#9CA3AF',fontSize:12}}/>
                <YAxis tick={{fill:'#9CA3AF',fontSize:11}} tickFormatter={v=>`₹${v}L`}/>
                <Tooltip formatter={v=>`₹${v}L`} contentStyle={{background:'#211A45',border:'1px solid #39306A',borderRadius:8}}/>
                <Legend/>
                <Bar dataKey="revenue" fill="#7C3AED" radius={[6,6,0,0]} name="Revenue (₹L)"/>
                <Bar dataKey="profit" fill="#10B981" radius={[6,6,0,0]} name="Profit (₹L)"/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <div className="grid md:grid-cols-4 gap-4">
            {[{label:'Peak Month',value:'Nov',sub:'₹41L revenue',icon:'🏆'},{label:'Avg Monthly',value:'₹25.9L',sub:'Revenue avg',icon:'📊'},{label:'Total Profit',value:'₹59.7L',sub:'YTD net profit',icon:'💚'},{label:'Profit Margin',value:'21%',sub:'Gross margin',icon:'📈'}].map((s,i)=>(
              <Card key={i} className="p-5"><span className="text-2xl">{s.icon}</span><p className="text-2xl font-bold text-white mt-2">{s.value}</p><p className="text-sm font-medium text-gray-300">{s.label}</p><p className="text-xs text-gray-500 mt-0.5">{s.sub}</p></Card>
            ))}
          </div>
        </div>
      )}

      {activeSection==='profit' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-white mb-4">Revenue vs Cost vs Profit</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A"/>
                <XAxis dataKey="month" tick={{fill:'#9CA3AF',fontSize:12}}/>
                <YAxis tick={{fill:'#9CA3AF',fontSize:11}} tickFormatter={v=>`₹${v}L`}/>
                <Tooltip formatter={v=>`₹${v}L`} contentStyle={{background:'#211A45',border:'1px solid #39306A',borderRadius:8}}/>
                <Legend/>
                <Bar dataKey="revenue" fill="#7C3AED" radius={[4,4,0,0]} name="Revenue"/>
                <Bar dataKey="cost" fill="#EC4899" radius={[4,4,0,0]} name="Cost"/>
                <Bar dataKey="profit" fill="#10B981" radius={[4,4,0,0]} name="Profit"/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-6">
            <h3 className="text-base font-semibold text-white mb-4">Cost Category Breakdown</h3>
            <div className="space-y-3">
              {costData.map(c=>(
                <div key={c.category} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-300">{c.category}</div>
                  <div className="flex-1 bg-[#2D2257] rounded-full h-3 overflow-hidden">
                    <div className="h-3 rounded-full" style={{width:`${(c.amount/250)*100}%`,background:c.color}}/>
                  </div>
                  <div className="text-sm font-semibold text-white w-16 text-right">₹{c.amount}L</div>
                  <div className="text-xs text-gray-400 w-10 text-right">{((c.amount/2248)*100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeSection==='kpis' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {kpiData.map((k,i)=>(
              <Card key={i} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3"><span className="text-2xl">{k.icon}</span><p className="font-semibold text-white">{k.name}</p></div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColor(k.status)}`}>{k.status.replace('_',' ')}</span>
                </div>
                <div className="flex items-end gap-4 mb-3">
                  <div><p className="text-3xl font-bold text-white">{k.current}{k.unit}</p><p className="text-xs text-gray-400">Current</p></div>
                  <div><p className="text-xl font-semibold text-gray-400">{k.target}{k.unit}</p><p className="text-xs text-gray-400">Target</p></div>
                  <div className={`text-lg font-semibold ${k.current>=k.target?'text-green-400':'text-red-400'}`}>
                    {k.current>=k.target?'✅':'⚠️'} {k.current>=k.target?'Achieved':'Gap: '+(k.target-k.current).toFixed(1)+k.unit}
                  </div>
                </div>
                <div className="bg-[#2D2257] rounded-full h-2 overflow-hidden">
                  <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" style={{width:`${Math.min((k.current/k.target)*100,100)}%`}}/>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">{Math.min(Math.round(k.current/k.target*100),100)}% of target</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeSection==='impact' && (
        <div className="space-y-6">
          <Card className="p-6 border-violet-500/40 bg-gradient-to-r from-violet-900/20 to-pink-900/10">
            <h3 className="text-lg font-bold text-white mb-4">🤖 AI Forecasting Business Impact</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[{label:'Revenue Increase',value:'+53.8%',sub:'₹9.95Cr gain',icon:'💰',color:'text-green-400'},{label:'Forecast Accuracy',value:'+24.2pp',sub:'72% → 96.2%',icon:'🎯',color:'text-violet-400'},{label:'Stockouts Reduced',value:'-90.1%',sub:'142 → 14 incidents',icon:'📦',color:'text-blue-400'},{label:'Overstock Savings',value:'₹7.98L',sub:'Holding cost saved',icon:'💾',color:'text-pink-400'},{label:'Platform ROI',value:'412%',sub:'12-month return',icon:'📈',color:'text-yellow-400'},{label:'Payback Period',value:'4.2 months',sub:'Time to break even',icon:'⏱️',color:'text-cyan-400'}].map((s,i)=>(
                <div key={i} className="text-center"><span className="text-3xl">{s.icon}</span><p className={`text-2xl font-bold mt-2 ${s.color}`}>{s.value}</p><p className="text-sm text-gray-300 font-medium mt-1">{s.label}</p><p className="text-xs text-gray-500">{s.sub}</p></div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-base font-semibold text-white mb-4">Revenue: Before vs After AI Forecasting</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={impactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A"/>
                <XAxis dataKey="month" tick={{fill:'#9CA3AF',fontSize:12}}/>
                <YAxis tick={{fill:'#9CA3AF',fontSize:11}} tickFormatter={v=>`₹${v}L`}/>
                <Tooltip formatter={v=>`₹${v}L`} contentStyle={{background:'#211A45',border:'1px solid #39306A',borderRadius:8}}/>
                <Legend/>
                <Line type="monotone" dataKey="before" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 3" dot={false} name="Before AI"/>
                <Line type="monotone" dataKey="after" stroke="#7C3AED" strokeWidth={3} dot={{r:4}} name="After AI"/>
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </Layout>
  )
}
