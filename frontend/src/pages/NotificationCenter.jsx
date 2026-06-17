import React, { useState } from 'react'
import Layout from '../components/layout/Layout'

const typeConfig = {
  success:{color:'text-green-400',bg:'bg-green-900/20 border-green-800/40',icon:'✅'},
  warning:{color:'text-yellow-400',bg:'bg-yellow-900/20 border-yellow-800/40',icon:'⚠️'},
  error:{color:'text-red-400',bg:'bg-red-900/20 border-red-800/40',icon:'❌'},
  info:{color:'text-blue-400',bg:'bg-blue-900/20 border-blue-800/40',icon:'ℹ️'},
}

const initNotifications = [
  {id:1,title:'Forecast Approved',message:'Q4 Electronics forecast approved by admin@example.com',type:'success',channel:'in-app',role:'all',is_read:false,created_at:'2h ago'},
  {id:2,title:'Approval Pending',message:'Fashion Annual Plan has been pending review for 6+ hours',type:'warning',channel:'both',role:'manager',is_read:false,created_at:'6h ago'},
  {id:3,title:'Low Accuracy Alert',message:'XGBoost accuracy dropped to 88.2% on Groceries category',type:'error',channel:'both',role:'admin',is_read:true,created_at:'1d ago'},
  {id:4,title:'Report Ready',message:'Monthly Executive Report is ready for download',type:'info',channel:'email',role:'all',is_read:true,created_at:'1d ago'},
  {id:5,title:'Workflow Completed',message:'Auto Forecast + Approve workflow ran successfully — 26/28 success',type:'success',channel:'in-app',role:'analyst',is_read:false,created_at:'3h ago'},
  {id:6,title:'Dataset Uploaded',message:'sales_nov.csv processed successfully — 1,240 rows added',type:'success',channel:'in-app',role:'analyst',is_read:true,created_at:'5h ago'},
  {id:7,title:'KPI Alert',message:'Demand Fulfillment Rate dropped below warning threshold (92%)',type:'warning',channel:'both',role:'manager',is_read:false,created_at:'8h ago'},
  {id:8,title:'Organization Announcement',message:'Platform maintenance scheduled Dec 5, 02:00–04:00 UTC',type:'info',channel:'both',role:'all',is_read:true,created_at:'2d ago'},
]

const initAnnouncements = [
  {id:1,title:'Platform Maintenance — Dec 5, 2025',message:'Scheduled maintenance 02:00–04:00 UTC. Forecasting unavailable during this window.',severity:'warning',audience:'all',posted_by:'admin@example.com',is_active:true,created_at:'1d ago'},
  {id:2,title:'Phase 6 Features Now Live',message:'Multi-org support, approval workflows, and strategic planning are now available in your workspace.',severity:'info',audience:'all',posted_by:'admin@example.com',is_active:true,created_at:'5d ago'},
]

const defaultPrefs = {
  email_enabled: true,
  email_address: 'admin@example.com',
  digest: 'realtime',
  channels: {
    forecast_complete: {in_app:true,email:true},
    approval_required: {in_app:true,email:true},
    dataset_upload: {in_app:true,email:false},
    report_ready: {in_app:true,email:true},
    kpi_alert: {in_app:true,email:true},
    workflow_complete: {in_app:true,email:false},
    org_announcement: {in_app:true,email:true},
  }
}

const Card = ({children,className=''}) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>
const Toggle = ({value,onChange}) => (
  <button onClick={()=>onChange(!value)} className={`relative w-10 h-5 rounded-full transition-all ${value?'bg-violet-600':'bg-gray-600'}`}>
    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${value?'left-5':'left-0.5'}`}/>
  </button>
)

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState(initNotifications)
  const [announcements, setAnnouncements] = useState(initAnnouncements)
  const [tab, setTab] = useState('inbox')
  const [filter, setFilter] = useState('all')
  const [prefs, setPrefs] = useState(defaultPrefs)
  const [showAnnModal, setShowAnnModal] = useState(false)
  const [annForm, setAnnForm] = useState({title:'',message:'',severity:'info',audience:'all'})
  const [savedMsg, setSavedMsg] = useState('')

  const unread = notifications.filter(n=>!n.is_read).length

  const filtered = notifications.filter(n=>{
    if(filter==='unread') return !n.is_read
    if(filter==='success'||filter==='warning'||filter==='error'||filter==='info') return n.type===filter
    return true
  })

  const markRead = (id) => setNotifications(n=>n.map(x=>x.id===id?{...x,is_read:true}:x))
  const markAllRead = () => setNotifications(n=>n.map(x=>({...x,is_read:true})))
  const deleteNotif = (id) => setNotifications(n=>n.filter(x=>x.id!==id))

  const savePrefs = () => {
    setSavedMsg('✅ Notification preferences saved!')
    setTimeout(()=>setSavedMsg(''),3000)
  }

  const createAnnouncement = () => {
    if(!annForm.title) return
    setAnnouncements(a=>[{id:Date.now(),...annForm,posted_by:'admin@example.com',is_active:true,created_at:'just now'},...a])
    setShowAnnModal(false); setAnnForm({title:'',message:'',severity:'info',audience:'all'})
  }

  const toggleChannel = (event, channel) => {
    setPrefs(p=>({...p,channels:{...p.channels,[event]:{...p.channels[event],[channel]:!p.channels[event][channel]}}}))
  }

  const tabs = [
    {k:'inbox',l:`📬 Inbox${unread>0?` (${unread})`:''}` },
    {k:'preferences',l:'⚙️ Preferences'},
    {k:'announcements',l:'📢 Announcements'},
    {k:'history',l:'📋 History'},
  ]

  return (
    <Layout title="Notification Center">
      <p className="text-gray-400 mb-6">Manage all notifications, configure preferences, create announcements, and view notification history</p>

      {savedMsg && <div className="mb-4 p-3 bg-green-900/30 border border-green-500/40 rounded-xl text-green-400 text-sm">{savedMsg}</div>}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:'Unread',v:unread,ic:'📬',c:'from-violet-500 to-purple-600'},
          {l:'Total Today',v:notifications.filter(n=>n.created_at.includes('h ago')).length,ic:'🔔',c:'from-blue-500 to-cyan-600'},
          {l:'Announcements',v:announcements.filter(a=>a.is_active).length,ic:'📢',c:'from-pink-500 to-rose-600'},
          {l:'Email Enabled',v:prefs.email_enabled?'On':'Off',ic:'📧',c:'from-green-500 to-emerald-600'}
        ].map((s,i)=>(
          <Card key={i} className="p-5"><div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.c} flex items-center justify-center text-lg`}>{s.ic}</div>
            <div><p className="text-2xl font-bold text-white">{s.v}</p><p className="text-xs text-gray-400">{s.l}</p></div>
          </div></Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {tabs.map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab===t.k?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'text-gray-400 hover:text-white'}`}>{t.l}</button>
        ))}
      </div>

      {/* INBOX */}
      {tab==='inbox' && (
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {['all','unread','success','warning','error','info'].map(f=>(
                <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition ${filter===f?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'bg-[#211A45] border border-[#39306A] text-gray-400 hover:text-white'}`}>{f}</button>
              ))}
            </div>
            {unread>0 && <button onClick={markAllRead} className="text-xs text-violet-400 hover:text-violet-300">Mark all read</button>}
          </div>
          <div className="space-y-3">
            {filtered.length===0 && <Card className="p-12 text-center text-gray-500"><p className="text-4xl mb-3">🔔</p><p>No notifications found</p></Card>}
            {filtered.map(n=>{
              const cfg = typeConfig[n.type]||typeConfig.info
              return (
                <div key={n.id} onClick={()=>markRead(n.id)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition hover:opacity-90 ${cfg.bg} ${!n.is_read?'ring-1 ring-violet-500/30':''}`}>
                  <span className="text-2xl flex-shrink-0">{cfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-semibold ${cfg.color}`}>{n.title}</p>
                      {!n.is_read && <span className="w-2 h-2 rounded-full bg-violet-400"/>}
                      <span className="text-xs bg-[#2D2257] text-gray-400 px-2 py-0.5 rounded-full ml-auto">{n.role}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-0.5">{n.message}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{n.created_at}</span>
                      <span>via {n.channel}</span>
                    </div>
                  </div>
                  <button onClick={e=>{e.stopPropagation();deleteNotif(n.id)}} className="text-gray-500 hover:text-red-400 transition text-lg flex-shrink-0">×</button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* PREFERENCES */}
      {tab==='preferences' && (
        <div className="max-w-2xl space-y-5">
          {/* Email config */}
          <Card className="p-6">
            <h4 className="font-semibold text-white mb-4">📧 Email Notifications</h4>
            <div className="flex items-center justify-between p-4 bg-[#2D2257] rounded-xl mb-4">
              <div><p className="text-sm font-medium text-white">Enable Email Notifications</p><p className="text-xs text-gray-400">Receive alerts in your inbox</p></div>
              <Toggle value={prefs.email_enabled} onChange={v=>setPrefs(p=>({...p,email_enabled:v}))}/>
            </div>
            {prefs.email_enabled && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                <input value={prefs.email_address} onChange={e=>setPrefs(p=>({...p,email_address:e.target.value}))}
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500 text-sm"/>
              </div>
            )}
            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-1">Digest Frequency</label>
              <select value={prefs.digest} onChange={e=>setPrefs(p=>({...p,digest:e.target.value}))}
                className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                {['realtime','hourly','daily','weekly'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          </Card>

          {/* Per-event channels */}
          <Card className="overflow-hidden">
            <div className="p-5 border-b border-[#39306A]"><h4 className="font-semibold text-white">Notification Preferences by Event</h4></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#39306A] text-gray-400 text-left">
                  {['Event Type','In-App','Email'].map(h=><th key={h} className="px-5 py-3 font-medium">{h}</th>)}
                </tr></thead>
                <tbody>
                  {Object.entries(prefs.channels).map(([event, channels])=>(
                    <tr key={event} className="border-b border-[#2D2257] hover:bg-[#2D2257]/30 transition">
                      <td className="px-5 py-4 text-white font-medium capitalize">{event.replace(/_/g,' ')}</td>
                      <td className="px-5 py-4"><Toggle value={channels.in_app} onChange={()=>toggleChannel(event,'in_app')}/></td>
                      <td className="px-5 py-4"><Toggle value={channels.email&&prefs.email_enabled} onChange={()=>prefs.email_enabled&&toggleChannel(event,'email')}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <button onClick={savePrefs} className="px-8 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90">Save Preferences</button>
        </div>
      )}

      {/* ANNOUNCEMENTS */}
      {tab==='announcements' && (
        <div className="max-w-3xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Organization Announcements</h3>
            <button onClick={()=>setShowAnnModal(true)} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-sm font-semibold hover:opacity-90">+ New Announcement</button>
          </div>
          <div className="space-y-3">
            {announcements.map(a=>(
              <Card key={a.id} className={`p-5 ${a.severity==='warning'?'border-yellow-800/50':a.severity==='error'?'border-red-800/50':'border-blue-800/30'}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl flex-shrink-0">{a.severity==='warning'?'⚠️':a.severity==='error'?'🚨':'📢'}</span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-semibold text-white">{a.title}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${a.is_active?'bg-green-900/40 text-green-400':'bg-gray-800 text-gray-400'}`}>{a.is_active?'Active':'Inactive'}</span>
                        <span className="text-xs bg-[#2D2257] text-gray-400 px-2 py-0.5 rounded-full">{a.audience}</span>
                      </div>
                      <p className="text-sm text-gray-300">{a.message}</p>
                      <p className="text-xs text-gray-500 mt-1">Posted by {a.posted_by} · {a.created_at}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={()=>setAnnouncements(an=>an.map(x=>x.id===a.id?{...x,is_active:!x.is_active}:x))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${a.is_active?'bg-yellow-900/40 text-yellow-400':'bg-green-900/40 text-green-400'}`}>
                      {a.is_active?'Deactivate':'Activate'}
                    </button>
                    <button onClick={()=>setAnnouncements(an=>an.filter(x=>x.id!==a.id))} className="px-3 py-1.5 bg-red-900/40 text-red-400 rounded-lg text-xs font-semibold">Delete</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* HISTORY */}
      {tab==='history' && (
        <Card>
          <div className="p-5 border-b border-[#39306A]">
            <h4 className="font-semibold text-white">Notification History</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#39306A] text-gray-400 text-left">
                {['Title','Type','Channel','Role','Status','Time'].map(h=><th key={h} className="px-5 py-3 font-medium">{h}</th>)}
              </tr></thead>
              <tbody>
                {[...notifications].reverse().map(n=>{
                  const cfg = typeConfig[n.type]||typeConfig.info
                  return (
                    <tr key={n.id} className="border-b border-[#2D2257] hover:bg-[#2D2257]/50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span>{cfg.icon}</span>
                          <span className="text-white font-medium">{n.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4"><span className={`text-xs px-2 py-0.5 rounded-full ${cfg.color} bg-[#2D2257]`}>{n.type}</span></td>
                      <td className="px-5 py-4 text-gray-300">{n.channel}</td>
                      <td className="px-5 py-4 text-gray-400">{n.role}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${n.is_read?'bg-gray-800 text-gray-400':'bg-violet-900/40 text-violet-400'}`}>{n.is_read?'read':'unread'}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-400">{n.created_at}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Announcement Modal */}
      {showAnnModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-5 text-white">New Announcement</h3>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-400 mb-1">Title</label>
                <input value={annForm.title} onChange={e=>setAnnForm(x=>({...x,title:e.target.value}))} placeholder="Announcement title"
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500"/></div>
              <div><label className="block text-sm text-gray-400 mb-1">Message</label>
                <textarea value={annForm.message} onChange={e=>setAnnForm(x=>({...x,message:e.target.value}))} rows={3} placeholder="Announcement details..."
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500 resize-none text-sm"/></div>
              {[{l:'Severity',k:'severity',opts:['info','warning','error']},{l:'Audience',k:'audience',opts:['all','admin','manager','analyst']}].map(f=>(
                <div key={f.k}><label className="block text-sm text-gray-400 mb-1">{f.l}</label>
                  <select value={annForm[f.k]} onChange={e=>setAnnForm(x=>({...x,[f.k]:e.target.value}))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                    {f.opts.map(o=><option key={o}>{o}</option>)}</select></div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={createAnnouncement} className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90">Post Announcement</button>
              <button onClick={()=>setShowAnnModal(false)} className="flex-1 py-3 bg-[#2D2257] rounded-xl font-semibold text-gray-300 hover:bg-[#39306A]">Cancel</button>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  )
}
