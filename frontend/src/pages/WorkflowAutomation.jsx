import React, { useState } from 'react'
import Layout from '../components/layout/Layout'

const TRIGGERS = ['dataset_upload','schedule','accuracy_threshold','approval_rejected','manual','forecast_complete']
const ACTIONS  = ['run_forecast','submit_approval','send_notification','generate_report','retrain_model','export_data','archive_dataset']

const initWorkflows = [
  { id:1, name:'Auto Forecast + Approve', description:'Generate forecast then submit for manager approval automatically', trigger:'dataset_upload', steps:[{order:1,action:'run_forecast',label:'Run XGBoost Forecast'},{order:2,action:'submit_approval',label:'Submit for Approval'},{order:3,action:'send_notification',label:'Notify Team'}], is_active:true, run_count:28, success_count:26, fail_count:2, last_run:'2h ago' },
  { id:2, name:'Weekly Report Generator', description:'Auto-generate executive reports every Monday at 8AM', trigger:'schedule', schedule:'weekly/Monday/08:00', steps:[{order:1,action:'generate_report',label:'Generate Executive Report'},{order:2,action:'send_notification',label:'Email Stakeholders'}], is_active:true, run_count:12, success_count:12, fail_count:0, last_run:'3d ago' },
  { id:3, name:'Low Accuracy Alert Flow', description:'Notify team when model accuracy drops below 85%', trigger:'accuracy_threshold', threshold:85, steps:[{order:1,action:'send_notification',label:'Alert Team'},{order:2,action:'retrain_model',label:'Auto-Retrain Model'}], is_active:false, run_count:3, success_count:2, fail_count:1, last_run:'7d ago' },
]

const execLogs = [
  {id:1,workflow:'Auto Forecast + Approve',status:'success',steps_completed:3,total_steps:3,duration:'12s',trigger:'dataset_upload',time:'2h ago'},
  {id:2,workflow:'Weekly Report Generator',status:'success',steps_completed:2,total_steps:2,duration:'8s',trigger:'schedule',time:'3d ago'},
  {id:3,workflow:'Low Accuracy Alert Flow',status:'failed',steps_completed:1,total_steps:2,duration:'3s',trigger:'threshold_breach',time:'7d ago'},
  {id:4,workflow:'Auto Forecast + Approve',status:'success',steps_completed:3,total_steps:3,duration:'15s',trigger:'manual',time:'1d ago'},
]

const Card = ({children,className=''}) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>

export default function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState(initWorkflows)
  const [tab, setTab] = useState('workflows')
  const [showModal, setShowModal] = useState(false)
  const [runningId, setRunningId] = useState(null)
  const [logs, setLogs] = useState(execLogs)
  const [form, setForm] = useState({name:'',description:'',trigger:'manual',schedule:'',threshold:''})

  const toggle = (id) => setWorkflows(w=>w.map(x=>x.id===id?{...x,is_active:!x.is_active}:x))
  const remove = (id) => setWorkflows(w=>w.filter(x=>x.id!==id))

  const runNow = (wf) => {
    setRunningId(wf.id)
    setTimeout(()=>{
      const success = Math.random()>0.1
      setWorkflows(w=>w.map(x=>x.id===wf.id?{...x,run_count:x.run_count+1,success_count:success?x.success_count+1:x.success_count,fail_count:success?x.fail_count:x.fail_count+1,last_run:'just now'}:x))
      setLogs(l=>[{id:Date.now(),workflow:wf.name,status:success?'success':'failed',steps_completed:success?wf.steps.length:1,total_steps:wf.steps.length,duration:`${Math.floor(Math.random()*30+5)}s`,trigger:'manual',time:'just now'},...l])
      setRunningId(null)
    },2000)
  }

  const createWorkflow = () => {
    if(!form.name) return
    setWorkflows(w=>[...w,{id:Date.now(),...form,steps:[],is_active:true,run_count:0,success_count:0,fail_count:0,last_run:'Never'}])
    setShowModal(false); setForm({name:'',description:'',trigger:'manual',schedule:'',threshold:''})
  }

  return (
    <Layout title="Workflow Automation">
      <p className="text-gray-400 mb-6">Configure and automate multi-step forecasting, reporting, and notification workflows</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{label:'Total Workflows',value:workflows.length,icon:'⚙️',color:'from-violet-500 to-purple-600'},
          {label:'Active',value:workflows.filter(w=>w.is_active).length,icon:'✅',color:'from-green-500 to-emerald-600'},
          {label:'Total Runs',value:workflows.reduce((a,b)=>a+b.run_count,0),icon:'▶️',color:'from-blue-500 to-cyan-600'},
          {label:'Success Rate',value:`${Math.round(workflows.reduce((a,b)=>a+b.success_count,0)/Math.max(workflows.reduce((a,b)=>a+b.run_count,0),1)*100)}%`,icon:'🎯',color:'from-pink-500 to-rose-600'}
        ].map((s,i)=>(
          <Card key={i} className="p-5"><div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg`}>{s.icon}</div>
            <div><p className="text-2xl font-bold text-white">{s.value}</p><p className="text-xs text-gray-400">{s.label}</p></div>
          </div></Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {[{k:'workflows',l:'⚙️ Workflows'},{k:'logs',l:'📋 Execution Logs'}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab===t.k?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'text-gray-400 hover:text-white'}`}>{t.l}</button>
        ))}
      </div>

      {tab==='workflows' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Configured Workflows</h3>
            <button onClick={()=>setShowModal(true)} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-sm font-semibold hover:opacity-90">+ New Workflow</button>
          </div>
          <div className="space-y-4">
            {workflows.map(w=>(
              <Card key={w.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${w.is_active?'bg-violet-900/40':'bg-gray-800'}`}>⚙️</div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-semibold text-white">{w.name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${w.is_active?'bg-green-900/40 text-green-400':'bg-gray-800 text-gray-400'}`}>{w.is_active?'Active':'Inactive'}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-[#2D2257] text-violet-300">{w.trigger}</span>
                      </div>
                      <p className="text-sm text-gray-400">{w.description}</p>
                      {/* Steps */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {w.steps.map((s,i)=>(
                          <div key={i} className="flex items-center gap-1.5 text-xs bg-[#2D2257] px-2 py-1 rounded-lg text-gray-300">
                            <span className="text-violet-400 font-bold">{s.order}.</span> {s.label}
                            {i<w.steps.length-1 && <span className="text-gray-600 ml-1">→</span>}
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                        <span>Runs: <span className="text-white">{w.run_count}</span></span>
                        <span>Success: <span className="text-green-400">{w.success_count}</span></span>
                        <span>Failed: <span className="text-red-400">{w.fail_count}</span></span>
                        <span>Last: {w.last_run}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                    <button onClick={()=>runNow(w)} disabled={runningId===w.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${runningId===w.id?'bg-yellow-800 text-yellow-300':'bg-[#2D2257] text-white hover:bg-violet-800'}`}>
                      {runningId===w.id?'⏳ Running...':'▶ Run Now'}
                    </button>
                    <button onClick={()=>toggle(w.id)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${w.is_active?'bg-yellow-900/40 text-yellow-400':'bg-green-900/40 text-green-400'}`}>
                      {w.is_active?'Pause':'Enable'}
                    </button>
                    <button onClick={()=>remove(w.id)} className="px-3 py-1.5 bg-red-900/40 text-red-400 rounded-lg text-xs font-semibold transition">Delete</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab==='logs' && (
        <Card>
          <div className="p-5 border-b border-[#39306A]"><h4 className="font-semibold text-white">Workflow Execution Logs</h4></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#39306A] text-gray-400 text-left">
                {['Workflow','Status','Steps','Duration','Trigger','Time'].map(h=><th key={h} className="px-5 py-3 font-medium">{h}</th>)}
              </tr></thead>
              <tbody>
                {logs.map(l=>(
                  <tr key={l.id} className="border-b border-[#2D2257] hover:bg-[#2D2257]/50 transition">
                    <td className="px-5 py-4 text-white font-medium">{l.workflow}</td>
                    <td className="px-5 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${l.status==='success'?'bg-green-900/40 text-green-400':'bg-red-900/40 text-red-400'}`}>{l.status}</span></td>
                    <td className="px-5 py-4 text-gray-300">{l.steps_completed}/{l.total_steps}</td>
                    <td className="px-5 py-4 text-gray-300">{l.duration}</td>
                    <td className="px-5 py-4 text-violet-400">{l.trigger}</td>
                    <td className="px-5 py-4 text-gray-400">{l.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-5 text-white">New Workflow</h3>
            <div className="space-y-4">
              {[{l:'Workflow Name',k:'name',ph:'e.g. Auto Report Generator'},{l:'Description',k:'description',ph:'What does this workflow do?'}].map(f=>(
                <div key={f.k}><label className="block text-sm text-gray-400 mb-1">{f.l}</label>
                  <input placeholder={f.ph} value={form[f.k]} onChange={e=>setForm(x=>({...x,[f.k]:e.target.value}))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500"/></div>
              ))}
              <div><label className="block text-sm text-gray-400 mb-1">Trigger</label>
                <select value={form.trigger} onChange={e=>setForm(x=>({...x,trigger:e.target.value}))}
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                  {TRIGGERS.map(t=><option key={t}>{t}</option>)}</select></div>
              {form.trigger==='schedule' && <div><label className="block text-sm text-gray-400 mb-1">Schedule (e.g. weekly/Monday/08:00)</label>
                <input value={form.schedule} onChange={e=>setForm(x=>({...x,schedule:e.target.value}))}
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500"/></div>}
              {form.trigger==='accuracy_threshold' && <div><label className="block text-sm text-gray-400 mb-1">Accuracy Threshold (%)</label>
                <input type="number" value={form.threshold} onChange={e=>setForm(x=>({...x,threshold:e.target.value}))}
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500"/></div>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={createWorkflow} className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90">Create Workflow</button>
              <button onClick={()=>setShowModal(false)} className="flex-1 py-3 bg-[#2D2257] rounded-xl font-semibold text-gray-300 hover:bg-[#39306A]">Cancel</button>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  )
}
