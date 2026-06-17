import React, { useState } from 'react'
import Layout from '../components/layout/Layout'

const initComments = [
  { id:1, forecast_id:1, project:'Q4 Electronics', user:'admin@example.com', user_name:'Admin User', message:'Accuracy looks good. Should we compare with XGBoost before finalizing?', likes:2, created_at:'5h ago', replies:[] },
  { id:2, forecast_id:1, project:'Q4 Electronics', user:'analyst@example.com', user_name:'Analyst User', message:'Agreed. XGBoost performed better last quarter. I\'ll run a comparison and share results.', likes:1, created_at:'4h ago', replies:[] },
  { id:3, forecast_id:2, project:'Annual Fashion', user:'manager@example.com', user_name:'Manager User', message:'The demand spike for Winter Jackets aligns with our logistics plan. Proceed with pre-stocking.', likes:3, created_at:'1d ago', replies:[] },
]

const initShares = [
  { id:1, report_name:'Q4 Electronics Monthly Report', shared_by:'admin@example.com', shared_with:['manager@example.com','analyst@example.com'], access:'view-only', expires:'Dec 10, 2025', views:8, link:'https://app.aiforecast.com/shared/rpt_q4' },
  { id:2, report_name:'Annual Fashion Demand Plan', shared_by:'manager@example.com', shared_with:['admin@example.com'], access:'comment', expires:'Jan 01, 2026', views:3, link:'https://app.aiforecast.com/shared/rpt_fashion' },
]

const timeline = [
  { user:'Admin User', email:'admin@example.com', action:'Ran forecast', detail:'XGBoost — Electronics Q4', time:'2h ago' },
  { user:'Analyst User', email:'analyst@example.com', action:'Uploaded dataset', detail:'sales_nov.csv (1,240 rows)', time:'5h ago' },
  { user:'Manager User', email:'manager@example.com', action:'Added comment', detail:'Q4 Electronics forecast', time:'1d ago' },
  { user:'Admin User', email:'admin@example.com', action:'Shared report', detail:'Q4 Monthly Report → manager@', time:'2d ago' },
  { user:'Analyst User', email:'analyst@example.com', action:'Updated scenario', detail:'Optimistic Growth variables', time:'2d ago' },
  { user:'Admin User', email:'admin@example.com', action:'Invited member', detail:'analyst@example.com joined', time:'5d ago' },
  { user:'Manager User', email:'manager@example.com', action:'Generated report', detail:'Annual Fashion PDF — 12 pages', time:'5d ago' },
]

const revisions = [
  { version:'v3', changed_by:'analyst@example.com', changes:'Switched model ARIMA → XGBoost; accuracy 89.4% → 97.1%', accuracy_before:89.4, accuracy_after:97.1, time:'3h ago' },
  { version:'v2', changed_by:'admin@example.com', changes:'Updated dataset to include November (+1,240 rows)', accuracy_before:91.2, accuracy_after:89.4, time:'2d ago' },
  { version:'v1', changed_by:'admin@example.com', changes:'Initial forecast created with ARIMA model', accuracy_before:null, accuracy_after:91.2, time:'5d ago' },
]

const Card = ({children,className=''}) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>

export default function Collaboration() {
  const [tab, setTab] = useState('comments')
  const [comments, setComments] = useState(initComments)
  const [shares, setShares] = useState(initShares)
  const [newComment, setNewComment] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareForm, setShareForm] = useState({ report_name:'', shared_with:'', access:'view-only', expires_days:7 })
  const [copiedId, setCopiedId] = useState(null)

  const postComment = () => {
    if (!newComment.trim()) return
    setComments(c=>[{ id:Date.now(), forecast_id:1, project:'Q4 Electronics', user:'admin@example.com', user_name:'Admin User', message:newComment, likes:0, created_at:'just now', replies:[] }, ...c])
    setNewComment('')
  }

  const likeComment = (id) => setComments(c=>c.map(x=>x.id===id?{...x,likes:x.likes+1}:x))
  const deleteComment = (id) => setComments(c=>c.filter(x=>x.id!==id))

  const createShare = () => {
    if (!shareForm.report_name) return
    setShares(s=>[...s,{ id:Date.now(), report_name:shareForm.report_name, shared_by:'admin@example.com', shared_with:shareForm.shared_with.split(',').map(e=>e.trim()).filter(Boolean), access:shareForm.access, expires:`+${shareForm.expires_days}d`, views:0, link:`https://app.aiforecast.com/shared/rpt_${Date.now()}` }])
    setShowShareModal(false)
    setShareForm({ report_name:'', shared_with:'', access:'view-only', expires_days:7 })
  }

  const copyLink = (id, link) => {
    navigator.clipboard?.writeText(link)
    setCopiedId(id)
    setTimeout(()=>setCopiedId(null), 2000)
  }

  const tabs = [
    { k:'comments', l:'💬 Comments' },
    { k:'shares', l:'🔗 Shared Reports' },
    { k:'timeline', l:'⏱️ Activity Timeline' },
    { k:'revisions', l:'📝 Revision History' },
  ]

  return (
    <Layout title="Forecast Collaboration">
      <p className="text-gray-400 mb-6">Comment on forecasts, share reports, and track team activity across all projects</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {label:'Total Comments',value:comments.length,icon:'💬',color:'from-violet-500 to-purple-600'},
          {label:'Shared Reports',value:shares.length,icon:'🔗',color:'from-blue-500 to-cyan-600'},
          {label:'Team Members',value:4,icon:'👥',color:'from-pink-500 to-rose-600'},
          {label:'Revisions',value:revisions.length,icon:'📝',color:'from-green-500 to-emerald-600'},
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
        {tabs.map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab===t.k?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'text-gray-400 hover:text-white'}`}>{t.l}</button>
        ))}
      </div>

      {/* Comments */}
      {tab==='comments' && (
        <div className="max-w-3xl">
          <Card className="p-5 mb-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold flex-shrink-0">A</div>
              <div className="flex-1">
                <textarea value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="Add a comment on this forecast..." rows={3}
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500 text-sm resize-none" />
                <div className="flex justify-end mt-2">
                  <button onClick={postComment} disabled={!newComment.trim()} className="px-5 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40 transition">Post Comment</button>
                </div>
              </div>
            </div>
          </Card>
          <div className="space-y-3">
            {comments.map(c=>(
              <Card key={c.id} className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold flex-shrink-0">{c.user_name[0]}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm">{c.user_name}</span>
                      <span className="text-xs text-gray-500">{c.user}</span>
                      <span className="text-xs bg-[#2D2257] text-gray-400 px-2 py-0.5 rounded-full">{c.project}</span>
                      <span className="text-xs text-gray-500 ml-auto">{c.created_at}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-2">{c.message}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={()=>likeComment(c.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-violet-400 transition">
                        👍 <span>{c.likes}</span>
                      </button>
                      <button className="text-xs text-gray-400 hover:text-white transition">↩ Reply</button>
                      {c.user==='admin@example.com' && (
                        <button onClick={()=>deleteComment(c.id)} className="text-xs text-gray-500 hover:text-red-400 transition ml-auto">Delete</button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Shared Reports */}
      {tab==='shares' && (
        <div className="max-w-3xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Shared Report Links</h3>
            <button onClick={()=>setShowShareModal(true)} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-sm font-semibold hover:opacity-90">+ Share Report</button>
          </div>
          <div className="space-y-3">
            {shares.map(s=>(
              <Card key={s.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{s.report_name}</p>
                    <p className="text-sm text-gray-400 mt-0.5">Shared by {s.shared_by} → {s.shared_with.join(', ')}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-violet-900/30 text-violet-300 px-2 py-0.5 rounded-full">{s.access}</span>
                      <span className="text-xs text-gray-400">Expires: {s.expires}</span>
                      <span className="text-xs text-gray-400">👁 {s.views} views</span>
                    </div>
                    <p className="text-xs text-blue-400 mt-2 truncate max-w-xs">{s.link}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>copyLink(s.id, s.link)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${copiedId===s.id?'bg-green-900/40 text-green-400':'bg-[#2D2257] text-white hover:bg-[#39306A]'}`}>
                      {copiedId===s.id?'✅ Copied!':'📋 Copy Link'}
                    </button>
                    <button onClick={()=>setShares(x=>x.filter(r=>r.id!==s.id))} className="px-3 py-1.5 rounded-lg text-xs bg-red-900/40 text-red-400 hover:bg-red-800/40 transition">Revoke</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      {tab==='timeline' && (
        <div className="max-w-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Team Activity Timeline</h3>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#39306A]" />
            <div className="space-y-4">
              {timeline.map((t,i)=>(
                <div key={i} className="flex items-start gap-4 pl-12 relative">
                  <div className="absolute left-2.5 w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold">{t.user[0]}</div>
                  <Card className="flex-1 p-4 hover:border-violet-500/50 transition">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-sm font-semibold text-white">{t.user}</span>
                        <span className="text-sm text-gray-400"> {t.action}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{t.detail}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{t.time}</span>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Revisions */}
      {tab==='revisions' && (
        <div className="max-w-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Forecast Revision History</h3>
          <div className="space-y-3">
            {revisions.map((r,i)=>(
              <Card key={i} className={`p-5 ${i===0?'border-violet-500/60':''}`}>
                {i===0 && <p className="text-xs text-violet-400 font-semibold mb-2">🔖 CURRENT VERSION</p>}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${i===0?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'bg-[#2D2257] text-gray-400'}`}>{r.version}</div>
                    <div>
                      <p className="font-semibold text-white text-sm">{r.changes}</p>
                      <p className="text-xs text-gray-400 mt-0.5">by {r.changed_by} · {r.time}</p>
                      {r.accuracy_before !== null && (
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <span className="text-gray-400">Accuracy:</span>
                          <span className="text-gray-400">{r.accuracy_before}%</span>
                          <span className="text-gray-500">→</span>
                          <span className={`font-semibold ${r.accuracy_after>r.accuracy_before?'text-green-400':'text-red-400'}`}>{r.accuracy_after}%</span>
                          <span className={`${r.accuracy_after>r.accuracy_before?'text-green-400':'text-red-400'}`}>
                            ({r.accuracy_after>r.accuracy_before?'+':''}{(r.accuracy_after-r.accuracy_before).toFixed(1)}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {i!==0 && <button className="px-3 py-1.5 bg-[#2D2257] text-gray-300 hover:bg-[#39306A] rounded-lg text-xs font-semibold transition flex-shrink-0">↩ Restore</button>}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-5 text-white">Share Report</h3>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-400 mb-1">Report Name</label>
                <input value={shareForm.report_name} onChange={e=>setShareForm(x=>({...x,report_name:e.target.value}))} placeholder="e.g. Q4 Electronics Monthly Report"
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500" /></div>
              <div><label className="block text-sm text-gray-400 mb-1">Share with (emails, comma separated)</label>
                <input value={shareForm.shared_with} onChange={e=>setShareForm(x=>({...x,shared_with:e.target.value}))} placeholder="manager@example.com, analyst@example.com"
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500" /></div>
              <div><label className="block text-sm text-gray-400 mb-1">Access Level</label>
                <select value={shareForm.access} onChange={e=>setShareForm(x=>({...x,access:e.target.value}))}
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                  {['view-only','comment','edit'].map(o=><option key={o}>{o}</option>)}
                </select></div>
              <div><label className="block text-sm text-gray-400 mb-1">Expires in (days)</label>
                <input type="number" value={shareForm.expires_days} onChange={e=>setShareForm(x=>({...x,expires_days:e.target.value}))} min={1} max={90}
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={createShare} className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90">Create Share Link</button>
              <button onClick={()=>setShowShareModal(false)} className="flex-1 py-3 bg-[#2D2257] rounded-xl font-semibold text-gray-300 hover:bg-[#39306A]">Cancel</button>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  )
}
