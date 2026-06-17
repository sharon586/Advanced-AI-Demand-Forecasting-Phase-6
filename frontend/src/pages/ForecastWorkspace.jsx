import React, { useState } from 'react'
import Layout from '../components/layout/Layout'

const CATEGORIES = ['All','Electronics','Fashion','Groceries','Furniture']

const initProjects = [
  { id: 1, name: 'Q4 Electronics Forecast', description: 'Quarterly demand forecast for Electronics division', owner: 'admin@example.com', members: ['admin@example.com','analyst@example.com'], status: 'active', category: 'Electronics', region: 'North', dataset_count: 3, forecast_count: 8, report_count: 4, tags: ['quarterly','electronics','high-priority'], last_activity: 'Forecast run by analyst@example.com 2h ago', created_at: '30d ago' },
  { id: 2, name: 'Annual Fashion Planning', description: 'Full-year seasonal fashion demand planning', owner: 'manager@example.com', members: ['manager@example.com','admin@example.com'], status: 'active', category: 'Fashion', region: 'All', dataset_count: 5, forecast_count: 12, report_count: 6, tags: ['annual','fashion','seasonal'], last_activity: 'Report generated 1d ago', created_at: '60d ago' },
  { id: 3, name: 'Grocery Restock Planning', description: 'Weekly grocery restock and demand management', owner: 'analyst@example.com', members: ['analyst@example.com'], status: 'archived', category: 'Groceries', region: 'South', dataset_count: 2, forecast_count: 5, report_count: 2, tags: ['weekly','groceries'], last_activity: 'Archived 14d ago', created_at: '90d ago' },
]

const Card = ({ children, className = '' }) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>

export default function ForecastWorkspace() {
  const [projects, setProjects] = useState(initProjects)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [detailTab, setDetailTab] = useState('overview')
  const [form, setForm] = useState({ name:'', description:'', category:'All', region:'All', tags:'' })
  const [newMember, setNewMember] = useState('')

  const filtered = projects.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  const createProject = () => {
    if (!form.name) return
    const proj = { ...form, id: Date.now(), owner: 'admin@example.com', members: ['admin@example.com'], status: 'active', dataset_count: 0, forecast_count: 0, report_count: 0, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean), last_activity: 'Project created just now', created_at: 'just now' }
    setProjects(p => [...p, proj])
    setShowModal(false)
    setForm({ name:'', description:'', category:'All', region:'All', tags:'' })
  }

  const archiveProject = (id) => setProjects(p => p.map(x => x.id === id ? { ...x, status: x.status === 'active' ? 'archived' : 'active' } : x))
  const deleteProject = (id) => { setProjects(p => p.filter(x => x.id !== id)); if (selectedProject?.id === id) setSelectedProject(null) }

  const addMember = () => {
    if (!newMember || !selectedProject) return
    setProjects(p => p.map(x => x.id === selectedProject.id ? { ...x, members: [...new Set([...x.members, newMember])] } : x))
    setSelectedProject(prev => ({ ...prev, members: [...new Set([...prev.members, newMember])] }))
    setNewMember('')
  }

  const activityLog = [
    { user: 'admin@example.com', action: 'Ran forecast', detail: 'XGBoost — Electronics', time: '2h ago' },
    { user: 'analyst@example.com', action: 'Uploaded dataset', detail: 'sales_nov.csv', time: '5h ago' },
    { user: 'manager@example.com', action: 'Added comment', detail: 'Check accuracy for Q4', time: '1d ago' },
    { user: 'admin@example.com', action: 'Generated report', detail: 'Monthly PDF', time: '2d ago' },
  ]

  return (
    <Layout title="Forecast Workspaces">
      <p className="text-gray-400 mb-6">Create and manage forecasting projects — organize datasets, forecasts, and reports in one place</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Projects', value: projects.length, icon: '📁', color: 'from-violet-500 to-purple-600' },
          { label: 'Active', value: projects.filter(p=>p.status==='active').length, icon: '✅', color: 'from-green-500 to-emerald-600' },
          { label: 'Total Forecasts', value: projects.reduce((a,b)=>a+b.forecast_count,0), icon: '📈', color: 'from-blue-500 to-cyan-600' },
          { label: 'Total Reports', value: projects.reduce((a,b)=>a+b.report_count,0), icon: '📄', color: 'from-pink-500 to-rose-600' },
        ].map((s,i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg`}>{s.icon}</div>
              <div><p className="text-2xl font-bold text-white">{s.value}</p><p className="text-xs text-gray-400">{s.label}</p></div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left — Project list */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="flex gap-2 mb-4">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search projects..."
              className="flex-1 bg-[#211A45] text-white px-4 py-2.5 rounded-xl border border-[#39306A] outline-none focus:border-violet-500 text-sm" />
            <button onClick={()=>setShowModal(true)} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-sm font-semibold hover:opacity-90 whitespace-nowrap">+ New</button>
          </div>
          <div className="flex gap-2 mb-4">
            {['all','active','archived'].map(f => (
              <button key={f} onClick={()=>setFilter(f)} className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition ${filter===f?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'bg-[#211A45] border border-[#39306A] text-gray-400 hover:text-white'}`}>{f}</button>
            ))}
          </div>
          <div className="space-y-3">
            {filtered.map(p => (
              <Card key={p.id} className={`p-4 cursor-pointer transition hover:border-violet-500 ${selectedProject?.id===p.id?'border-violet-500 bg-[#2D2257]':''}`} onClick={()=>{ setSelectedProject(p); setDetailTab('overview') }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white text-sm truncate">{p.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${p.status==='active'?'bg-green-900/40 text-green-400':'bg-gray-800 text-gray-400'}`}>{p.status}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.description}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span>📈 {p.forecast_count}</span>
                      <span>📄 {p.report_count}</span>
                      <span>👥 {p.members.length}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.tags.slice(0,2).map(t => <span key={t} className="text-xs bg-violet-900/30 text-violet-300 px-2 py-0.5 rounded-full">{t}</span>)}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right — Project detail */}
        <div className="flex-1">
          {!selectedProject ? (
            <Card className="h-80 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-5xl mb-4">📁</p>
                <p className="font-medium">Select a project to view details</p>
                <p className="text-sm mt-1">or create a new workspace</p>
              </div>
            </Card>
          ) : (
            <div>
              <Card className="p-6 mb-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedProject.name}</h2>
                    <p className="text-gray-400 text-sm mt-1">{selectedProject.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProject.tags.map(t => <span key={t} className="text-xs bg-violet-900/30 text-violet-300 px-2 py-0.5 rounded-full">{t}</span>)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>archiveProject(selectedProject.id)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedProject.status==='active'?'bg-yellow-900/40 text-yellow-400':'bg-green-900/40 text-green-400'}`}>
                      {selectedProject.status==='active'?'Archive':'Restore'}
                    </button>
                    <button onClick={()=>deleteProject(selectedProject.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-900/40 text-red-400 transition">Delete</button>
                  </div>
                </div>
              </Card>

              {/* Detail tabs */}
              <div className="flex gap-2 mb-4 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
                {['overview','members','activity'].map(t => (
                  <button key={t} onClick={()=>setDetailTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${detailTab===t?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'text-gray-400 hover:text-white'}`}>{t}</button>
                ))}
              </div>

              {detailTab==='overview' && (
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label:'Datasets', value: selectedProject.dataset_count, icon:'🗂️', color:'from-blue-500 to-cyan-600' },
                    { label:'Forecasts', value: selectedProject.forecast_count, icon:'📈', color:'from-violet-500 to-purple-600' },
                    { label:'Reports', value: selectedProject.report_count, icon:'📄', color:'from-pink-500 to-rose-600' },
                  ].map((s,i) => (
                    <Card key={i} className="p-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg`}>{s.icon}</div>
                        <div><p className="text-3xl font-bold text-white">{s.value}</p><p className="text-sm text-gray-400">{s.label}</p></div>
                      </div>
                    </Card>
                  ))}
                  <Card className="p-5 md:col-span-3">
                    <p className="text-sm text-gray-400 mb-1">Project Info</p>
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      {[['Owner', selectedProject.owner],['Category', selectedProject.category],['Region', selectedProject.region],['Created', selectedProject.created_at]].map(([l,v]) => (
                        <div key={l}><span className="text-gray-500">{l}: </span><span className="text-white">{v}</span></div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">Last activity: {selectedProject.last_activity}</p>
                  </Card>
                </div>
              )}

              {detailTab==='members' && (
                <Card className="p-5">
                  <h4 className="font-semibold text-white mb-4">Team Members ({selectedProject.members.length})</h4>
                  <div className="space-y-3 mb-4">
                    {selectedProject.members.map(m => (
                      <div key={m} className="flex items-center justify-between p-3 bg-[#2D2257] rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold">{m[0].toUpperCase()}</div>
                          <span className="text-sm text-white">{m}</span>
                          {m === selectedProject.owner && <span className="text-xs bg-violet-900/40 text-violet-400 px-2 py-0.5 rounded-full">Owner</span>}
                        </div>
                        {m !== selectedProject.owner && (
                          <button onClick={()=>{ setProjects(p=>p.map(x=>x.id===selectedProject.id?{...x,members:x.members.filter(mm=>mm!==m)}:x)); setSelectedProject(prev=>({...prev,members:prev.members.filter(mm=>mm!==m)})) }}
                            className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={newMember} onChange={e=>setNewMember(e.target.value)} placeholder="Email address"
                      className="flex-1 bg-[#2D2257] text-white px-4 py-2.5 rounded-xl border border-[#39306A] outline-none focus:border-violet-500 text-sm" />
                    <button onClick={addMember} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-sm font-semibold hover:opacity-90">Add</button>
                  </div>
                </Card>
              )}

              {detailTab==='activity' && (
                <Card>
                  <div className="p-5 border-b border-[#39306A]"><h4 className="font-semibold text-white">Project Activity Timeline</h4></div>
                  <div className="p-4 space-y-3">
                    {activityLog.map((a,i) => (
                      <div key={i} className="flex items-start gap-3 p-3 hover:bg-[#2D2257] rounded-xl transition">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold flex-shrink-0">{a.user[0].toUpperCase()}</div>
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium">{a.action}</p>
                          <p className="text-xs text-gray-400">{a.detail}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{a.user} · {a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-5 text-white">New Forecast Project</h3>
            <div className="space-y-4">
              {[{l:'Project Name',k:'name',ph:'e.g. Q4 Electronics Forecast'},{l:'Description',k:'description',ph:'What is this project about?'},{l:'Tags (comma separated)',k:'tags',ph:'quarterly, high-priority'}].map(f=>(
                <div key={f.k}>
                  <label className="block text-sm text-gray-400 mb-1">{f.l}</label>
                  <input type="text" placeholder={f.ph} value={form[f.k]} onChange={e=>setForm(x=>({...x,[f.k]:e.target.value}))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500" />
                </div>
              ))}
              {[{l:'Category',k:'category',opts:CATEGORIES},{l:'Region',k:'region',opts:['All','North','South','East','West']}].map(f=>(
                <div key={f.k}>
                  <label className="block text-sm text-gray-400 mb-1">{f.l}</label>
                  <select value={form[f.k]} onChange={e=>setForm(x=>({...x,[f.k]:e.target.value}))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                    {f.opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={createProject} className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90">Create Project</button>
              <button onClick={()=>setShowModal(false)} className="flex-1 py-3 bg-[#2D2257] rounded-xl font-semibold text-gray-300 hover:bg-[#39306A]">Cancel</button>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  )
}
