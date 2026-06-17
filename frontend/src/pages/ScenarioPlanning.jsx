import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const COLORS = { 'Optimistic Q4 Growth':'#10B981', 'Pessimistic Recession':'#EF4444', 'Baseline Current Trend':'#7C3AED', 'What-If Analysis':'#F59E0B' }
const BASE = [420,350,520,280,610,480,720,650,580,710,820,950]

function projectScenario(variables) {
  const g = (variables.sales_growth||0)/100, s = variables.seasonality_factor||1
  const d = variables.demand_factor||1, m = (variables.marketing_spend||0)/100
  const c = (variables.competitor_impact||0)/100
  const multiplier = (1+g)*s*d*(1+m*0.5)*(1+c*0.3)
  return MONTHS.map((month,i) => ({ month, value: Math.round(BASE[i]*multiplier*1000 + (Math.random()-0.5)*20000) }))
}

const initScenarios = [
  { id:1, name:'Baseline Current Trend', description:'Continuation of current market conditions', is_baseline:true, variables:{ sales_growth:5, seasonality_factor:1.0, demand_factor:1.0, price_elasticity:-0.8, marketing_spend:0, competitor_impact:0 } },
  { id:2, name:'Optimistic Q4 Growth', description:'Best-case holiday season scenario', is_baseline:false, variables:{ sales_growth:15, seasonality_factor:1.3, demand_factor:1.2, price_elasticity:-0.5, marketing_spend:20, competitor_impact:-5 } },
  { id:3, name:'Pessimistic Recession', description:'Worst-case economic downturn', is_baseline:false, variables:{ sales_growth:-8, seasonality_factor:0.85, demand_factor:0.75, price_elasticity:-1.2, marketing_spend:-15, competitor_impact:-20 } },
]

const Card = ({ children, className='' }) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>

const Slider = ({ label, value, min, max, step=0.01, unit='', onChange }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-400">{label}</span>
      <span className="text-violet-400 font-semibold">{value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={e=>onChange(Number(e.target.value))}
      className="w-full accent-violet-500 cursor-pointer" />
    <div className="flex justify-between text-xs text-gray-600 mt-0.5"><span>{min}{unit}</span><span>{max}{unit}</span></div>
  </div>
)

export default function ScenarioPlanning() {
  const [scenarios, setScenarios] = useState(initScenarios)
  const [selected, setSelected] = useState([1,2,3])
  const [whatIfVars, setWhatIfVars] = useState({ sales_growth:5, seasonality_factor:1.0, demand_factor:1.0, price_elasticity:-0.8, marketing_spend:0, competitor_impact:0 })
  const [whatIfLabel, setWhatIfLabel] = useState('My What-If Scenario')
  const [tab, setTab] = useState('compare')
  const [showCreate, setShowCreate] = useState(false)
  const [newForm, setNewForm] = useState({ name:'', description:'', variables:{ sales_growth:0, seasonality_factor:1.0, demand_factor:1.0, marketing_spend:0, competitor_impact:0 } })

  const baseline = scenarios.find(s=>s.is_baseline)
  const baselineData = baseline ? projectScenario(baseline.variables) : []
  const baselineTotal = baselineData.reduce((a,b)=>a+b.value, 0)

  const scenarioSeries = scenarios.filter(s=>selected.includes(s.id)).map(s => {
    const data = projectScenario(s.variables)
    const total = data.reduce((a,b)=>a+b.value,0)
    return { ...s, data, total, vsPct: baseline ? Math.round((total-baselineTotal)/baselineTotal*1000)/10 : 0 }
  })

  const whatIfData = projectScenario(whatIfVars)
  const whatIfTotal = whatIfData.reduce((a,b)=>a+b.value,0)

  const chartData = MONTHS.map((month,i) => {
    const obj = { month }
    scenarioSeries.forEach(s => { obj[s.name] = s.data[i].value })
    if (tab==='whatif') obj[whatIfLabel] = whatIfData[i].value
    return obj
  })

  const toggleScenario = (id) => setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id])

  const createScenario = () => {
    if (!newForm.name) return
    const newS = { id: Date.now(), name: newForm.name, description: newForm.description, is_baseline: false, variables: newForm.variables }
    setScenarios(s=>[...s,newS])
    setSelected(s=>[...s,newS.id])
    setShowCreate(false)
    setNewForm({ name:'', description:'', variables:{ sales_growth:0, seasonality_factor:1.0, demand_factor:1.0, marketing_spend:0, competitor_impact:0 } })
  }

  return (
    <Layout title="Scenario Planning & What-If Analysis">
      <p className="text-gray-400 mb-6">Model different business scenarios and compare forecast outcomes side-by-side</p>

      <div className="flex flex-wrap gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {[{k:'compare',l:'📊 Compare Scenarios'},{k:'whatif',l:'⚙️ What-If Analysis'}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab===t.k?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'text-gray-400 hover:text-white'}`}>{t.l}</button>
        ))}
      </div>

      {tab==='compare' && (
        <div className="space-y-6">
          {/* Scenario cards */}
          <div className="flex flex-wrap gap-3 items-center">
            {scenarios.map(s => (
              <button key={s.id} onClick={()=>toggleScenario(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition ${selected.includes(s.id)?'border-violet-500 bg-[#2D2257] text-white':'border-[#39306A] text-gray-400 hover:text-white'}`}>
                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[s.name]||'#7C3AED' }} />
                {s.name}
                {s.is_baseline && <span className="text-xs text-violet-400">(baseline)</span>}
              </button>
            ))}
            <button onClick={()=>setShowCreate(true)} className="px-4 py-2 rounded-xl border border-dashed border-[#39306A] text-gray-400 hover:text-white hover:border-violet-500 text-sm transition">+ New Scenario</button>
          </div>

          {/* Chart */}
          <Card className="p-6">
            <h3 className="text-base font-semibold text-white mb-4">Scenario Forecast Comparison (12 Months)</h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#312B56" />
                <XAxis dataKey="month" tick={{fill:'#9CA3AF',fontSize:12}} />
                <YAxis tick={{fill:'#9CA3AF',fontSize:11}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={v=>`₹${v.toLocaleString()}`} contentStyle={{background:'#211A45',border:'1px solid #39306A',borderRadius:8}} />
                <Legend />
                {scenarioSeries.map(s=><Line key={s.name} type="monotone" dataKey={s.name} stroke={COLORS[s.name]||'#7C3AED'} strokeWidth={2.5} dot={false} strokeDasharray={s.is_baseline?'6 3':undefined} />)}
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Results table */}
          <div className="grid md:grid-cols-3 gap-4">
            {scenarioSeries.map(s => (
              <Card key={s.id} className={`p-5 ${s.is_baseline?'border-violet-500/60':''}`}>
                {s.is_baseline && <p className="text-xs text-violet-400 font-semibold mb-2">📌 BASELINE</p>}
                <div className="flex items-center gap-2 mb-3"><div className="w-3 h-3 rounded-full" style={{background:COLORS[s.name]||'#7C3AED'}} /><p className="font-semibold text-white text-sm">{s.name}</p></div>
                <p className="text-2xl font-bold text-white mb-1">₹{(s.total/100000).toFixed(1)}L</p>
                <p className="text-xs text-gray-400 mb-3">Annual forecast</p>
                {!s.is_baseline && (
                  <p className={`text-sm font-semibold ${s.vsPct>=0?'text-green-400':'text-red-400'}`}>{s.vsPct>=0?'+':''}{s.vsPct}% vs baseline</p>
                )}
                <div className="mt-3 space-y-1 text-xs text-gray-400">
                  <div>Sales growth: <span className="text-white">{s.variables.sales_growth}%</span></div>
                  <div>Demand factor: <span className="text-white">{s.variables.demand_factor}x</span></div>
                  <div>Peak month: <span className="text-violet-400">{s.data.reduce((a,b)=>b.value>a.value?b:a).month}</span></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab==='whatif' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sliders */}
          <Card className="p-6">
            <h3 className="font-semibold text-white mb-5">Adjust Variables</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Scenario Label</label>
              <input value={whatIfLabel} onChange={e=>setWhatIfLabel(e.target.value)}
                className="w-full bg-[#2D2257] text-white px-4 py-2.5 rounded-xl border border-[#39306A] outline-none focus:border-violet-500 text-sm" />
            </div>
            <div className="space-y-5">
              <Slider label="Sales Growth" value={whatIfVars.sales_growth} min={-30} max={40} step={0.5} unit="%" onChange={v=>setWhatIfVars(x=>({...x,sales_growth:v}))} />
              <Slider label="Seasonality Factor" value={whatIfVars.seasonality_factor} min={0.5} max={2.0} step={0.05} onChange={v=>setWhatIfVars(x=>({...x,seasonality_factor:v}))} />
              <Slider label="Demand Factor" value={whatIfVars.demand_factor} min={0.5} max={2.0} step={0.05} onChange={v=>setWhatIfVars(x=>({...x,demand_factor:v}))} />
              <Slider label="Marketing Spend Change" value={whatIfVars.marketing_spend} min={-30} max={50} step={1} unit="%" onChange={v=>setWhatIfVars(x=>({...x,marketing_spend:v}))} />
              <Slider label="Competitor Impact" value={whatIfVars.competitor_impact} min={-30} max={10} step={1} unit="%" onChange={v=>setWhatIfVars(x=>({...x,competitor_impact:v}))} />
            </div>
            <button onClick={()=>setScenarios(s=>[...s,{id:Date.now(),name:whatIfLabel,description:'What-if analysis scenario',is_baseline:false,variables:{...whatIfVars}}])}
              className="mt-5 w-full py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90 transition">
              💾 Save as Scenario
            </button>
          </Card>

          {/* What-if results */}
          <div className="space-y-4">
            <Card className="p-5">
              <h4 className="text-sm text-gray-400 mb-3">Projected vs Baseline</h4>
              <div className="flex gap-6">
                <div><p className="text-3xl font-bold text-white">₹{(whatIfTotal/100000).toFixed(1)}L</p><p className="text-xs text-gray-400">Your scenario</p></div>
                <div><p className="text-3xl font-bold text-gray-400">₹{(baselineTotal/100000).toFixed(1)}L</p><p className="text-xs text-gray-400">Baseline</p></div>
                <div>
                  <p className={`text-3xl font-bold ${whatIfTotal>baselineTotal?'text-green-400':'text-red-400'}`}>
                    {whatIfTotal>baselineTotal?'+':''}{Math.round((whatIfTotal-baselineTotal)/baselineTotal*100)}%
                  </p>
                  <p className="text-xs text-gray-400">vs baseline</p>
                </div>
              </div>
            </Card>
            <Card className="p-5">
              <h4 className="text-sm text-gray-400 mb-4">Monthly Forecast</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={MONTHS.map((m,i)=>({ month:m, 'Your Scenario':whatIfData[i].value, 'Baseline':baselineData[i]?.value||0 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#312B56" />
                  <XAxis dataKey="month" tick={{fill:'#9CA3AF',fontSize:11}} />
                  <YAxis tick={{fill:'#9CA3AF',fontSize:10}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`} />
                  <Tooltip formatter={v=>`₹${v.toLocaleString()}`} contentStyle={{background:'#211A45',border:'1px solid #39306A',borderRadius:8}} />
                  <Line type="monotone" dataKey="Your Scenario" stroke="#F59E0B" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="Baseline" stroke="#7C3AED" strokeWidth={2} strokeDasharray="5 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {/* Create Scenario Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-5 text-white">New Scenario</h3>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-400 mb-1">Scenario Name</label>
                <input value={newForm.name} onChange={e=>setNewForm(x=>({...x,name:e.target.value}))}
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500" placeholder="e.g. Conservative Growth" /></div>
              <div><label className="block text-sm text-gray-400 mb-1">Description</label>
                <input value={newForm.description} onChange={e=>setNewForm(x=>({...x,description:e.target.value}))}
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500" placeholder="Brief description" /></div>
              <div className="space-y-3 pt-2">
                <Slider label="Sales Growth" value={newForm.variables.sales_growth} min={-30} max={40} step={0.5} unit="%" onChange={v=>setNewForm(x=>({...x,variables:{...x.variables,sales_growth:v}}))} />
                <Slider label="Demand Factor" value={newForm.variables.demand_factor} min={0.5} max={2.0} step={0.05} onChange={v=>setNewForm(x=>({...x,variables:{...x.variables,demand_factor:v}}))} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={createScenario} className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90">Create</button>
              <button onClick={()=>setShowCreate(false)} className="flex-1 py-3 bg-[#2D2257] rounded-xl font-semibold text-gray-300 hover:bg-[#39306A]">Cancel</button>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  )
}
