import React, { useState } from 'react'
import Layout from '../components/layout/Layout'

const PLANS = ['Starter','Business','Enterprise']
const INDUSTRIES = ['Retail','Manufacturing','E-Commerce','Logistics','Healthcare','Finance']

const initOrgs = [
  { id:1, name:'Acme Corp', slug:'acme-corp', industry:'Retail', plan:'Enterprise', status:'active', owner_email:'admin@acme.com', member_count:12, dataset_count:8, forecast_count:45, report_count:22, logo_color:'#7C3AED', created_at:'120d ago' },
  { id:2, name:'GlobalTrade Ltd', slug:'globaltrade', industry:'Manufacturing', plan:'Business', status:'active', owner_email:'ceo@globaltrade.com', member_count:6, dataset_count:4, forecast_count:18, report_count:9, logo_color:'#EC4899', created_at:'60d ago' },
  { id:3, name:'NovaStar Retail', slug:'novastar', industry:'E-Commerce', plan:'Starter', status:'trial', owner_email:'owner@novastar.com', member_count:3, dataset_count:2, forecast_count:5, report_count:2, logo_color:'#3B82F6', created_at:'14d ago' },
]

const Card = ({children,className=''}) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>
const statusColor = s => ({active:'bg-green-900/40 text-green-400',trial:'bg-yellow-900/40 text-yellow-400',suspended:'bg-red-900/40 text-red-400'}[s])
const planColor = p => ({Enterprise:'bg-violet-900/40 text-violet-400',Business:'bg-blue-900/40 text-blue-400',Starter:'bg-gray-800 text-gray-400'}[p])

export default function OrgManagement() {
  const [orgs, setOrgs] = useState(initOrgs)
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('overview')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({name:'',industry:'Retail',plan:'Starter',owner_email:''})
  const [members] = useState([
    {email:'admin@acme.com',name:'Admin User',role:'Owner'},
    {email:'analyst@acme.com',name:'Analyst User',role:'Analyst'},
    {email:'manager@acme.com',name:'Manager User',role:'Manager'},
  ])

  const createOrg = () => {
    if (!form.name) return
    const colors = ['#7C3AED','#EC4899','#3B82F6','#10B981','#F59E0B']
    setOrgs(o=>[...o, {...form, id:Date.now(), slug:form.name.toLowerCase().replace(/ /g,'-'),
      status:'trial', member_count:1, dataset_count:0, forecast_count:0, report_count:0,
      logo_color:colors[Math.floor(Math.random()*colors.length)], created_at:'just now'}])
    setShowModal(false); setForm({name:'',industry:'Retail',plan:'Starter',owner_email:''})
  }

  const deleteOrg = (id) => { setOrgs(o=>o.filter(x=>x.id!==id)); if(selected?.id===id) setSelected(null) }

  const settings = selected ? {timezone:'Asia/Kolkata',currency:'INR',fiscal_year:'April',default_model:'XGBoost',data_retention:'365 days'} : {}

  return (
    <Layout title="Organization Management">
      <p className="text-gray-400 mb-6">Create and manage multiple organizations with isolated data, users, and configurations</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{label:'Total Organizations',value:orgs.length,icon:'🏢',color:'from-violet-500 to-purple-600'},
          {label:'Active',value:orgs.filter(o=>o.status==='active').length,icon:'✅',color:'from-green-500 to-emerald-600'},
          {label:'Trial',value:orgs.filter(o=>o.status==='trial').length,icon:'⏳',color:'from-yellow-500 to-amber-600'},
          {label:'Total Members',value:orgs.reduce((a,b)=>a+b.member_count,0),icon:'👥',color:'from-blue-500 to-cyan-600'}
        ].map((s,i)=>(
          <Card key={i} className="p-5"><div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg`}>{s.icon}</div>
            <div><p className="text-2xl font-bold text-white">{s.value}</p><p className="text-xs text-gray-400">{s.label}</p></div>
          </div></Card>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Org list */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="flex gap-2 mb-4">
            <span className="flex-1 text-sm text-gray-300 font-semibold flex items-center">Organizations</span>
            <button onClick={()=>setShowModal(true)} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-sm font-semibold hover:opacity-90">+ New Org</button>
          </div>
          <div className="space-y-3">
            {orgs.map(o=>(
              <Card key={o.id} className={`p-4 cursor-pointer transition hover:border-violet-500 ${selected?.id===o.id?'border-violet-500 bg-[#2D2257]':''}`}
                onClick={()=>{setSelected(o);setTab('overview')}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                    style={{background:o.logo_color}}>{o.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white text-sm">{o.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(o.status)}`}>{o.status}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{o.industry} · <span className={`font-semibold ${planColor(o.plan).split(' ')[1]}`}>{o.plan}</span></p>
                    <div className="flex gap-3 text-xs text-gray-500 mt-1">
                      <span>👥 {o.member_count}</span><span>📈 {o.forecast_count}</span><span>📄 {o.report_count}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Org detail */}
        <div className="flex-1">
          {!selected ? (
            <Card className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center"><p className="text-5xl mb-3">🏢</p><p>Select an organization to manage</p></div>
            </Card>
          ) : (
            <div>
              <Card className="p-6 mb-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                      style={{background:selected.logo_color}}>{selected.name[0]}</div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                      <p className="text-gray-400 text-sm">{selected.industry} · {selected.owner_email}</p>
                      <div className="flex gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(selected.status)}`}>{selected.status}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${planColor(selected.plan)}`}>{selected.plan}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-[#2D2257] text-white rounded-lg text-xs font-semibold hover:bg-violet-800 transition">✏️ Edit</button>
                    <button onClick={()=>deleteOrg(selected.id)} className="px-3 py-1.5 bg-red-900/40 text-red-400 rounded-lg text-xs font-semibold transition">Delete</button>
                  </div>
                </div>
              </Card>

              <div className="flex gap-2 mb-4 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
                {['overview','members','settings'].map(t=>(
                  <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${tab===t?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'text-gray-400 hover:text-white'}`}>{t}</button>
                ))}
              </div>

              {tab==='overview' && (
                <div className="grid md:grid-cols-2 gap-4">
                  {[['Datasets',selected.dataset_count,'🗂️'],['Forecasts',selected.forecast_count,'📈'],['Reports',selected.report_count,'📄'],['Members',selected.member_count,'👥']].map(([l,v,ic])=>(
                    <Card key={l} className="p-5">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{ic}</span>
                        <div><p className="text-3xl font-bold text-white">{v}</p><p className="text-sm text-gray-400">{l}</p></div>
                      </div>
                    </Card>
                  ))}
                  <Card className="p-5 md:col-span-2">
                    <p className="text-sm text-gray-400 mb-3">Organization Details</p>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      {[['Slug',selected.slug],['Created',selected.created_at],['Owner',selected.owner_email]].map(([l,v])=>(
                        <div key={l}><span className="text-gray-500">{l}: </span><span className="text-white">{v}</span></div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {tab==='members' && (
                <Card className="p-5">
                  <h4 className="font-semibold text-white mb-4">Members ({selected.member_count})</h4>
                  <div className="space-y-3">
                    {members.map(m=>(
                      <div key={m.email} className="flex items-center justify-between p-3 bg-[#2D2257] rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold">{m.name[0]}</div>
                          <div><p className="text-sm font-medium text-white">{m.name}</p><p className="text-xs text-gray-400">{m.email}</p></div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${m.role==='Owner'?'bg-violet-900/40 text-violet-400':'bg-gray-800 text-gray-400'}`}>{m.role}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {tab==='settings' && (
                <Card className="p-5">
                  <h4 className="font-semibold text-white mb-4">Organization Settings</h4>
                  <div className="space-y-3">
                    {Object.entries(settings).map(([k,v])=>(
                      <div key={k} className="flex items-center justify-between p-3 bg-[#2D2257] rounded-xl">
                        <span className="text-sm text-gray-400 capitalize">{k.replace(/_/g,' ')}</span>
                        <span className="text-sm text-white font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 px-6 py-2.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-sm font-semibold text-white hover:opacity-90">Save Settings</button>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-5 text-white">New Organization</h3>
            <div className="space-y-4">
              {[{l:'Organization Name',k:'name',ph:'e.g. Acme Corp'},{l:'Owner Email',k:'owner_email',ph:'owner@example.com'}].map(f=>(
                <div key={f.k}><label className="block text-sm text-gray-400 mb-1">{f.l}</label>
                  <input placeholder={f.ph} value={form[f.k]} onChange={e=>setForm(x=>({...x,[f.k]:e.target.value}))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500"/></div>
              ))}
              {[{l:'Industry',k:'industry',opts:INDUSTRIES},{l:'Plan',k:'plan',opts:PLANS}].map(f=>(
                <div key={f.k}><label className="block text-sm text-gray-400 mb-1">{f.l}</label>
                  <select value={form[f.k]} onChange={e=>setForm(x=>({...x,[f.k]:e.target.value}))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                    {f.opts.map(o=><option key={o}>{o}</option>)}</select></div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={createOrg} className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90">Create</button>
              <button onClick={()=>setShowModal(false)} className="flex-1 py-3 bg-[#2D2257] rounded-xl font-semibold text-gray-300 hover:bg-[#39306A]">Cancel</button>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  )
}
