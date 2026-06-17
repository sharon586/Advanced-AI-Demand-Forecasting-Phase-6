import React, { useState } from 'react'
import Layout from '../components/layout/Layout'

const scheduledReports = [
  { id:1, name:'Monthly Executive Summary', type:'executive_summary', frequency:'monthly', day:'1st', time:'07:00', recipients:['ceo@example.com','cfo@example.com'], format:'PDF', is_active:true, last_sent:'1d ago', next_send:'Dec 1, 2025' },
  { id:2, name:'Weekly Revenue Outlook', type:'revenue_forecast', frequency:'weekly', day:'Monday', time:'08:00', recipients:['manager@example.com','admin@example.com'], format:'PDF', is_active:true, last_sent:'3d ago', next_send:'Dec 2, 2025' },
  { id:3, name:'Demand & Inventory Outlook', type:'demand_outlook', frequency:'weekly', day:'Friday', time:'17:00', recipients:['admin@example.com'], format:'PDF', is_active:false, last_sent:'10d ago', next_send:'—' },
]

const generatedReports = [
  { id:1, name:'Monthly Executive Summary — Nov 2025', type:'executive_summary', generated_by:'system', period:'November 2025', pages:12, format:'PDF', status:'ready', generated_at:'1d ago' },
  { id:2, name:'Revenue Outlook — Dec 2025', type:'revenue_forecast', generated_by:'admin@example.com', period:'December 2025', pages:6, format:'PDF', status:'ready', generated_at:'3d ago' },
  { id:3, name:'Demand Forecast Q4 2025', type:'demand_outlook', generated_by:'admin@example.com', period:'Q4 2025', pages:9, format:'PDF', status:'ready', generated_at:'5d ago' },
  { id:4, name:'Management Analytics — Oct', type:'management_analytics', generated_by:'system', period:'October 2025', pages:7, format:'PDF', status:'ready', generated_at:'1mo ago' },
]

const Card = ({children,className=''}) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>

export default function ExecutiveReports() {
  const [tab, setTab] = useState('scheduled')
  const [schedules, setSchedules] = useState(scheduledReports)
  const [reports, setReports] = useState(generatedReports)
  const [showSchedModal, setShowSchedModal] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [genForm, setGenForm] = useState({ name:'', type:'executive_summary', period:'December 2025', format:'PDF' })
  const [schedForm, setSchedForm] = useState({ name:'', type:'executive_summary', frequency:'monthly', day:'1st', time:'08:00', recipients:'', format:'PDF' })
  const [successMsg, setSuccessMsg] = useState('')

  const toggleSchedule = (id) => setSchedules(s=>s.map(x=>x.id===id?{...x,is_active:!x.is_active}:x))

  const generateReport = () => {
    if (!genForm.name) return
    setGenerating(true)
    setTimeout(()=>{
      setReports(r=>[{ id:Date.now(), name:`${genForm.name} — ${genForm.period}`, type:genForm.type, generated_by:'admin@example.com', period:genForm.period, pages:Math.floor(Math.random()*10+4), format:genForm.format, status:'ready', generated_at:'just now' }, ...r])
      setGenerating(false)
      setSuccessMsg(`✅ "${genForm.name}" report generated successfully!`)
      setGenForm({ name:'', type:'executive_summary', period:'December 2025', format:'PDF' })
      setTimeout(()=>setSuccessMsg(''), 4000)
    }, 2000)
  }

  const createSchedule = () => {
    if (!schedForm.name) return
    setSchedules(s=>[...s,{ id:Date.now(), ...schedForm, recipients:schedForm.recipients.split(',').map(e=>e.trim()).filter(Boolean), is_active:true, last_sent:'Never', next_send:'Scheduled' }])
    setShowSchedModal(false)
    setSchedForm({ name:'', type:'executive_summary', frequency:'monthly', day:'1st', time:'08:00', recipients:'', format:'PDF' })
  }

  const typeLabel = t => ({executive_summary:'Executive Summary',revenue_forecast:'Revenue Forecast',demand_outlook:'Demand Outlook',management_analytics:'Management Analytics'}[t]||t)
  const typeIcon = t => ({executive_summary:'📋',revenue_forecast:'💰',demand_outlook:'📦',management_analytics:'📊'}[t]||'📄')

  return (
    <Layout title="Executive Reports">
      <p className="text-gray-400 mb-6">Generate executive summaries, monthly forecasts, and management analytics reports</p>

      {successMsg && <div className="mb-4 p-3 bg-green-900/30 border border-green-500/40 rounded-xl text-green-400 text-sm">{successMsg}</div>}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {label:'Scheduled Reports',value:schedules.length,icon:'🗓️',color:'from-violet-500 to-purple-600'},
          {label:'Active Schedules',value:schedules.filter(s=>s.is_active).length,icon:'✅',color:'from-green-500 to-emerald-600'},
          {label:'Reports Generated',value:reports.length,icon:'📄',color:'from-blue-500 to-cyan-600'},
          {label:'Ready to Download',value:reports.filter(r=>r.status==='ready').length,icon:'⬇️',color:'from-pink-500 to-rose-600'},
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
      <div className="flex flex-wrap gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {[{k:'scheduled',l:'🗓️ Scheduled'},{k:'generate',l:'⚡ Generate'},{k:'history',l:'📁 Report History'}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab===t.k?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'text-gray-400 hover:text-white'}`}>{t.l}</button>
        ))}
      </div>

      {/* Scheduled */}
      {tab==='scheduled' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Scheduled Reports</h3>
            <button onClick={()=>setShowSchedModal(true)} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-sm font-semibold hover:opacity-90">+ New Schedule</button>
          </div>
          <div className="space-y-3">
            {schedules.map(s=>(
              <Card key={s.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${s.is_active?'bg-violet-900/40':'bg-gray-800'}`}>{typeIcon(s.type)}</div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white">{s.name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.is_active?'bg-green-900/40 text-green-400':'bg-gray-800 text-gray-400'}`}>{s.is_active?'Active':'Paused'}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-0.5">{typeLabel(s.type)} · {s.frequency} on {s.day} at {s.time} · {s.format}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Recipients: {s.recipients.join(', ')} · Last sent: {s.last_sent} · Next: {s.next_send}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>toggleSchedule(s.id)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${s.is_active?'bg-yellow-900/40 text-yellow-400':'bg-green-900/40 text-green-400'}`}>{s.is_active?'Pause':'Enable'}</button>
                    <button onClick={()=>setSchedules(x=>x.filter(r=>r.id!==s.id))} className="px-3 py-1.5 rounded-lg text-xs bg-red-900/40 text-red-400 transition">Delete</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Generate */}
      {tab==='generate' && (
        <div className="max-w-2xl">
          <Card className="p-6">
            <h4 className="font-semibold text-white mb-5">Generate Report On-Demand</h4>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-400 mb-1">Report Name</label>
                <input value={genForm.name} onChange={e=>setGenForm(x=>({...x,name:e.target.value}))} placeholder="e.g. Q4 Executive Summary"
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500"/></div>
              {[
                {l:'Report Type',k:'type',opts:[['executive_summary','Executive Summary'],['revenue_forecast','Revenue Forecast'],['demand_outlook','Demand & Inventory Outlook'],['management_analytics','Management Analytics']]},
              ].map(f=>(
                <div key={f.k}><label className="block text-sm text-gray-400 mb-1">{f.l}</label>
                  <select value={genForm[f.k]} onChange={e=>setGenForm(x=>({...x,[f.k]:e.target.value}))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                    {f.opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                  </select></div>
              ))}
              <div><label className="block text-sm text-gray-400 mb-1">Period</label>
                <input value={genForm.period} onChange={e=>setGenForm(x=>({...x,period:e.target.value}))} placeholder="e.g. December 2025"
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500"/></div>
              <div><label className="block text-sm text-gray-400 mb-1">Format</label>
                <select value={genForm.format} onChange={e=>setGenForm(x=>({...x,format:e.target.value}))}
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                  {['PDF','CSV','Excel'].map(o=><option key={o}>{o}</option>)}
                </select></div>
            </div>
            <button onClick={generateReport} disabled={generating||!genForm.name} className="mt-5 w-full py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90 disabled:opacity-60 transition">
              {generating?'⏳ Generating Report...':'📄 Generate Report'}
            </button>
          </Card>
        </div>
      )}

      {/* History */}
      {tab==='history' && (
        <Card>
          <div className="p-5 border-b border-[#39306A]"><h4 className="font-semibold text-white">Generated Report History</h4></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#39306A] text-gray-400 text-left">
                {['Report','Type','Period','Generated By','Pages','Status','Generated At',''].map(h=><th key={h} className="px-5 py-3 font-medium">{h}</th>)}
              </tr></thead>
              <tbody>
                {reports.map(r=>(
                  <tr key={r.id} className="border-b border-[#2D2257] hover:bg-[#2D2257]/50 transition">
                    <td className="px-5 py-4"><div className="flex items-center gap-2"><span className="text-lg">{typeIcon(r.type)}</span><span className="text-white font-medium">{r.name}</span></div></td>
                    <td className="px-5 py-4 text-gray-300">{typeLabel(r.type)}</td>
                    <td className="px-5 py-4 text-gray-300">{r.period}</td>
                    <td className="px-5 py-4 text-gray-400">{r.generated_by}</td>
                    <td className="px-5 py-4 text-gray-300">{r.pages}p</td>
                    <td className="px-5 py-4"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-900/40 text-green-400">{r.status}</span></td>
                    <td className="px-5 py-4 text-gray-400">{r.generated_at}</td>
                    <td className="px-5 py-4"><button className="px-3 py-1.5 bg-[#2D2257] text-violet-400 hover:bg-[#39306A] rounded-lg text-xs font-semibold transition">⬇️ Download</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Schedule Modal */}
      {showSchedModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-5 text-white">New Report Schedule</h3>
            <div className="space-y-4">
              {[{l:'Schedule Name',k:'name',ph:'e.g. Weekly Revenue Outlook'}].map(f=>(
                <div key={f.k}><label className="block text-sm text-gray-400 mb-1">{f.l}</label>
                  <input placeholder={f.ph} value={schedForm[f.k]} onChange={e=>setSchedForm(x=>({...x,[f.k]:e.target.value}))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500"/></div>
              ))}
              {[
                {l:'Report Type',k:'type',opts:['executive_summary','revenue_forecast','demand_outlook','management_analytics']},
                {l:'Frequency',k:'frequency',opts:['daily','weekly','monthly']},
                {l:'Format',k:'format',opts:['PDF','CSV','Excel']},
              ].map(f=>(
                <div key={f.k}><label className="block text-sm text-gray-400 mb-1">{f.l}</label>
                  <select value={schedForm[f.k]} onChange={e=>setSchedForm(x=>({...x,[f.k]:e.target.value}))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                    {f.opts.map(o=><option key={o}>{o}</option>)}
                  </select></div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm text-gray-400 mb-1">Day</label>
                  <input value={schedForm.day} onChange={e=>setSchedForm(x=>({...x,day:e.target.value}))} placeholder="e.g. 1st or Monday"
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500"/></div>
                <div><label className="block text-sm text-gray-400 mb-1">Time</label>
                  <input type="time" value={schedForm.time} onChange={e=>setSchedForm(x=>({...x,time:e.target.value}))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500"/></div>
              </div>
              <div><label className="block text-sm text-gray-400 mb-1">Recipients (comma separated)</label>
                <input value={schedForm.recipients} onChange={e=>setSchedForm(x=>({...x,recipients:e.target.value}))} placeholder="ceo@example.com, manager@example.com"
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500"/></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={createSchedule} className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90">Create Schedule</button>
              <button onClick={()=>setShowSchedModal(false)} className="flex-1 py-3 bg-[#2D2257] rounded-xl font-semibold text-gray-300 hover:bg-[#39306A]">Cancel</button>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  )
}
