import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov']
const mkTrend = (base,target,n=11) => MONTHS.slice(0,n).map((m,i)=>({month:m,value:+(base*(1+(i-5)*0.01)+(Math.random()-0.5)*base*0.05).toFixed(2),target}))

const initKpis = [
  {id:1,name:'Revenue Growth Rate',description:'Month-over-month revenue growth',unit:'%',category:'Revenue',current_value:18.4,target:15.0,threshold_warning:12.0,threshold_critical:8.0,status:'achieved',trend:'up',is_active:true,owner:'cfo@example.com'},
  {id:2,name:'Forecast Accuracy Index',description:'Weighted average forecast accuracy',unit:'%',category:'Forecasting',current_value:96.2,target:95.0,threshold_warning:90.0,threshold_critical:85.0,status:'achieved',trend:'up',is_active:true,owner:'admin@example.com'},
  {id:3,name:'Inventory Turnover',description:'Times inventory is sold per period',unit:'x',category:'Operations',current_value:8.3,target:8.0,threshold_warning:6.0,threshold_critical:4.0,status:'achieved',trend:'stable',is_active:true,owner:'ops@example.com'},
  {id:4,name:'Demand Fulfillment Rate',description:'Percentage of demand fulfilled on time',unit:'%',category:'Operations',current_value:94.5,target:96.0,threshold_warning:92.0,threshold_critical:88.0,status:'at_risk',trend:'down',is_active:true,owner:'ops@example.com'},
  {id:5,name:'Cost per Forecast',description:'Avg operational cost per forecast run',unit:'₹',category:'Efficiency',current_value:840,target:1000,threshold_warning:1200,threshold_critical:1500,status:'achieved',trend:'down',is_active:true,owner:'admin@example.com'},
]

const statusColor = s => ({achieved:'bg-green-900/40 text-green-400',on_track:'bg-green-900/40 text-green-400',at_risk:'bg-yellow-900/40 text-yellow-400',behind:'bg-red-900/40 text-red-400'}[s]||'bg-gray-800 text-gray-400')
const trendIcon = t => ({up:'📈',down:'📉',stable:'➡️'}[t]||'➡️')
const Card = ({children,className=''}) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>

export default function KPIManagement() {
  const [kpis, setKpis] = useState(initKpis)
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({name:'',description:'',unit:'%',category:'Revenue',target:'',threshold_warning:'',threshold_critical:'',owner:''})

  const categories = [...new Set(kpis.map(k=>k.category))]
  const filtered = tab==='all' ? kpis : kpis.filter(k=>k.category===tab)

  const createKpi = () => {
    if(!form.name) return
    setKpis(k=>[...k,{...form,id:Date.now(),current_value:0,target:+form.target,threshold_warning:+form.threshold_warning,threshold_critical:+form.threshold_critical,status:'on_track',trend:'stable',is_active:true}])
    setShowModal(false); setForm({name:'',description:'',unit:'%',category:'Revenue',target:'',threshold_warning:'',threshold_critical:'',owner:''})
  }

  const toggleKpi = (id) => setKpis(k=>k.map(x=>x.id===id?{...x,is_active:!x.is_active}:x))
  const deleteKpi = (id) => { setKpis(k=>k.filter(x=>x.id!==id)); if(selected?.id===id) setSelected(null) }

  return (
    <Layout title="KPI Management">
      <p className="text-gray-400 mb-6">Create custom KPIs, track performance against forecasts, and set alert thresholds</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:'Total KPIs',v:kpis.length,ic:'📊',c:'from-violet-500 to-purple-600'},
          {l:'Achieved',v:kpis.filter(k=>k.status==='achieved').length,ic:'✅',c:'from-green-500 to-emerald-600'},
          {l:'At Risk',v:kpis.filter(k=>k.status==='at_risk').length,ic:'⚠️',c:'from-yellow-500 to-amber-600'},
          {l:'Active',v:kpis.filter(k=>k.is_active).length,ic:'🟢',c:'from-blue-500 to-cyan-600'}
        ].map((s,i)=>(
          <Card key={i} className="p-5"><div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.c} flex items-center justify-center text-lg`}>{s.ic}</div>
            <div><p className="text-2xl font-bold text-white">{s.v}</p><p className="text-xs text-gray-400">{s.l}</p></div>
          </div></Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56]">
        {['all',...categories].map(c=>(
          <button key={c} onClick={()=>setTab(c)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${tab===c?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'text-gray-400 hover:text-white'}`}>{c}</button>
        ))}
        <button onClick={()=>setShowModal(true)} className="ml-auto px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-sm font-semibold hover:opacity-90">+ New KPI</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-96 flex-shrink-0 space-y-3">
          {filtered.map(k=>(
            <Card key={k.id} className={`p-4 cursor-pointer transition hover:border-violet-500 ${selected?.id===k.id?'border-violet-500 bg-[#2D2257]':''}`}
              onClick={()=>setSelected(k)}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-white text-sm">{k.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(k.status)}`}>{k.status.replace('_',' ')}</span>
                    {!k.is_active && <span className="text-xs text-gray-500">Inactive</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{k.category}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="text-white font-semibold">{k.current_value}{k.unit}</span>
                    <span className="text-gray-500">/ {k.target}{k.unit} target</span>
                    <span>{trendIcon(k.trend)}</span>
                  </div>
                  <div className="w-full bg-[#1B1538] rounded-full h-1.5 mt-2">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                      style={{width:`${Math.min((k.current_value/k.target)*100,100)}%`}}/>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex-1">
          {!selected ? (
            <Card className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center"><p className="text-5xl mb-3">📊</p><p>Select a KPI to view details and trends</p></div>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card className="p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-white">{selected.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(selected.status)}`}>{selected.status.replace('_',' ')}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{selected.description}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Owner: {selected.owner}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>toggleKpi(selected.id)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selected.is_active?'bg-yellow-900/40 text-yellow-400':'bg-green-900/40 text-green-400'}`}>{selected.is_active?'Disable':'Enable'}</button>
                    <button onClick={()=>deleteKpi(selected.id)} className="px-3 py-1.5 bg-red-900/40 text-red-400 rounded-lg text-xs font-semibold">Delete</button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  {[['Current',`${selected.current_value}${selected.unit}`,'text-white'],['Target',`${selected.target}${selected.unit}`,'text-violet-400'],['Category',selected.category,'text-blue-400']].map(([l,v,c])=>(
                    <div key={l} className="bg-[#2D2257] p-3 rounded-xl text-center">
                      <p className={`text-lg font-bold ${c}`}>{v}</p><p className="text-xs text-gray-400">{l}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Warning threshold: {selected.threshold_warning}{selected.unit}</span><span>Critical: {selected.threshold_critical}{selected.unit}</span></div>
                  <div className="w-full bg-[#2D2257] rounded-full h-3 relative">
                    <div className="absolute top-0 h-3 rounded-full bg-gradient-to-r from-green-500 to-violet-500" style={{width:`${Math.min((selected.current_value/selected.target)*100,100)}%`}}/>
                    <div className="absolute top-0 w-0.5 h-3 bg-yellow-400" style={{left:`${(selected.threshold_warning/selected.target)*100}%`}}/>
                    <div className="absolute top-0 w-0.5 h-3 bg-red-400" style={{left:`${(selected.threshold_critical/selected.target)*100}%`}}/>
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <h4 className="font-semibold text-white mb-4">Performance Trend</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={mkTrend(selected.current_value, selected.target)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#39306A"/>
                    <XAxis dataKey="month" tick={{fill:'#9CA3AF',fontSize:11}}/>
                    <YAxis tick={{fill:'#9CA3AF',fontSize:11}}/>
                    <Tooltip contentStyle={{background:'#211A45',border:'1px solid #39306A',borderRadius:8}}/>
                    <Line type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={2.5} dot={false} name="Actual"/>
                    <Line type="monotone" dataKey="target" stroke="#EC4899" strokeWidth={1.5} strokeDasharray="5 3" dot={false} name="Target"/>
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-5 text-white">New Custom KPI</h3>
            <div className="space-y-4">
              {[{l:'KPI Name',k:'name',ph:'e.g. Forecast ROI'},{l:'Description',k:'description',ph:'What does this measure?'},{l:'Owner',k:'owner',ph:'owner@example.com'}].map(f=>(
                <div key={f.k}><label className="block text-sm text-gray-400 mb-1">{f.l}</label>
                  <input placeholder={f.ph} value={form[f.k]} onChange={e=>setForm(x=>({...x,[f.k]:e.target.value}))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500"/></div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                {[{l:'Unit',k:'unit',ph:'%, ₹, x'},{l:'Category',k:'category',ph:'Revenue'}].map(f=>(
                  <div key={f.k}><label className="block text-sm text-gray-400 mb-1">{f.l}</label>
                    <input placeholder={f.ph} value={form[f.k]} onChange={e=>setForm(x=>({...x,[f.k]:e.target.value}))}
                      className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500"/></div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[{l:'Target',k:'target'},{l:'Warning',k:'threshold_warning'},{l:'Critical',k:'threshold_critical'}].map(f=>(
                  <div key={f.k}><label className="block text-sm text-gray-400 mb-1">{f.l}</label>
                    <input type="number" value={form[f.k]} onChange={e=>setForm(x=>({...x,[f.k]:e.target.value}))}
                      className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500"/></div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={createKpi} className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90">Create KPI</button>
              <button onClick={()=>setShowModal(false)} className="flex-1 py-3 bg-[#2D2257] rounded-xl font-semibold text-gray-300 hover:bg-[#39306A]">Cancel</button>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  )
}
