import React, { useState } from 'react'
import Layout from '../components/layout/Layout'

const initApprovals = [
  { id:1, forecast_name:'Q4 Electronics XGBoost Forecast', submitted_by:'analyst@example.com', submitted_by_name:'Analyst User', assigned_to:'manager@example.com', assigned_to_name:'Manager User', status:'pending', priority:'high', accuracy:97.1, model:'XGBoost', category:'Electronics', region:'North', notes:'Q4 holiday season forecast. XGBoost shows best accuracy.', submitted_at:'3h ago', reviewed_at:null, reviewer_comment:'' },
  { id:2, forecast_name:'Annual Fashion Demand Plan', submitted_by:'analyst@example.com', submitted_by_name:'Analyst User', assigned_to:'admin@example.com', assigned_to_name:'Admin User', status:'approved', priority:'medium', accuracy:95.2, model:'Random Forest', category:'Fashion', region:'All', notes:'Annual fashion demand plan for Q1-Q4 2026.', submitted_at:'2d ago', reviewed_at:'1d ago', reviewer_comment:'Approved. Accuracy is acceptable. Proceed with planning.' },
  { id:3, forecast_name:'Grocery Restock Weekly', submitted_by:'manager@example.com', submitted_by_name:'Manager User', assigned_to:'admin@example.com', assigned_to_name:'Admin User', status:'rejected', priority:'low', accuracy:88.5, model:'ARIMA', category:'Groceries', region:'South', notes:'Weekly restock forecast using ARIMA.', submitted_at:'5d ago', reviewed_at:'4d ago', reviewer_comment:'Rejected. Accuracy below 90% threshold. Retrain with XGBoost.' },
  { id:4, forecast_name:'Furniture Q1 Demand Forecast', submitted_by:'analyst@example.com', submitted_by_name:'Analyst User', assigned_to:'manager@example.com', assigned_to_name:'Manager User', status:'pending', priority:'medium', accuracy:91.8, model:'Random Forest', category:'Furniture', region:'West', notes:'Q1 2026 furniture demand forecast.', submitted_at:'8h ago', reviewed_at:null, reviewer_comment:'' },
]

const auditTrail = [
  {id:1,action:'Submitted',by:'analyst@example.com',detail:"Submitted 'Q4 Electronics XGBoost Forecast' for approval",time:'3h ago'},
  {id:2,action:'Approved',by:'admin@example.com',detail:'Accuracy meets threshold. Proceed with planning.',time:'1d ago'},
  {id:3,action:'Rejected',by:'admin@example.com',detail:'Below 90% accuracy threshold. Retrain required.',time:'4d ago'},
  {id:4,action:'Submitted',by:'manager@example.com',detail:"Submitted 'Grocery Restock Weekly' for approval",time:'5d ago'},
]

const Card = ({children,className=''}) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>
const statusColor = s => ({pending:'bg-yellow-900/40 text-yellow-400',approved:'bg-green-900/40 text-green-400',rejected:'bg-red-900/40 text-red-400'}[s])
const priorityColor = p => ({high:'bg-red-900/40 text-red-400',medium:'bg-orange-900/40 text-orange-400',low:'bg-gray-800 text-gray-400'}[p])

export default function ApprovalWorkflow() {
  const [approvals, setApprovals] = useState(initApprovals)
  const [tab, setTab] = useState('queue')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [reviewComment, setReviewComment] = useState('')
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submitForm, setSubmitForm] = useState({forecast_name:'',model:'XGBoost',category:'All',region:'All',accuracy:'',notes:''})
  const [actionMsg, setActionMsg] = useState('')

  const filtered = approvals.filter(a => filter==='all' || a.status===filter)

  const doAction = (id, action) => {
    if (!reviewComment && action!=='reassign') return
    setApprovals(a=>a.map(x=>x.id!==id?x:{...x,status:action==='approve'?'approved':'rejected',reviewed_at:'just now',reviewer_comment:reviewComment}))
    setActionMsg(`✅ Forecast ${action==='approve'?'approved':'rejected'} successfully`)
    setSelected(null); setReviewComment('')
    setTimeout(()=>setActionMsg(''),3000)
  }

  const submitNew = () => {
    if (!submitForm.forecast_name) return
    setApprovals(a=>[{id:Date.now(),...submitForm,accuracy:parseFloat(submitForm.accuracy)||90,submitted_by:'admin@example.com',submitted_by_name:'Admin User',assigned_to:'manager@example.com',assigned_to_name:'Manager User',status:'pending',priority:'medium',submitted_at:'just now',reviewed_at:null,reviewer_comment:''},...a])
    setShowSubmitModal(false); setSubmitForm({forecast_name:'',model:'XGBoost',category:'All',region:'All',accuracy:'',notes:''})
  }

  return (
    <Layout title="Forecast Approval Workflow">
      <p className="text-gray-400 mb-6">Submit forecasts for review, approve or reject with comments, and maintain a full audit trail</p>

      {actionMsg && <div className="mb-4 p-3 bg-green-900/30 border border-green-500/40 rounded-xl text-green-400 text-sm">{actionMsg}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{label:'Pending Review',value:approvals.filter(a=>a.status==='pending').length,icon:'⏳',color:'from-yellow-500 to-amber-600'},
          {label:'Approved',value:approvals.filter(a=>a.status==='approved').length,icon:'✅',color:'from-green-500 to-emerald-600'},
          {label:'Rejected',value:approvals.filter(a=>a.status==='rejected').length,icon:'❌',color:'from-red-500 to-rose-600'},
          {label:'Total',value:approvals.length,icon:'📋',color:'from-violet-500 to-purple-600'}
        ].map((s,i)=>(
          <Card key={i} className="p-5"><div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg`}>{s.icon}</div>
            <div><p className="text-2xl font-bold text-white">{s.value}</p><p className="text-xs text-gray-400">{s.label}</p></div>
          </div></Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {[{k:'queue',l:'📋 Approval Queue'},{k:'audit',l:'🔍 Audit Trail'}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab===t.k?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'text-gray-400 hover:text-white'}`}>{t.l}</button>
        ))}
      </div>

      {tab==='queue' && (
        <div>
          <div className="flex flex-wrap gap-2 mb-4 items-center justify-between">
            <div className="flex gap-2">
              {['all','pending','approved','rejected'].map(f=>(
                <button key={f} onClick={()=>setFilter(f)} className={`px-4 py-1.5 rounded-xl text-xs font-medium capitalize transition ${filter===f?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'bg-[#211A45] border border-[#39306A] text-gray-400 hover:text-white'}`}>{f}</button>
              ))}
            </div>
            <button onClick={()=>setShowSubmitModal(true)} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-sm font-semibold hover:opacity-90">+ Submit Forecast</button>
          </div>

          <div className="space-y-3">
            {filtered.map(a=>(
              <Card key={a.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${a.status==='pending'?'bg-yellow-900/40':a.status==='approved'?'bg-green-900/40':'bg-red-900/40'}`}>
                      {a.status==='pending'?'⏳':a.status==='approved'?'✅':'❌'}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-semibold text-white">{a.forecast_name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(a.status)}`}>{a.status}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityColor(a.priority)}`}>{a.priority}</span>
                      </div>
                      <p className="text-xs text-gray-400">{a.model} · {a.category} · {a.region} · Accuracy: <span className="text-violet-400 font-semibold">{a.accuracy}%</span></p>
                      <p className="text-xs text-gray-500 mt-0.5">Submitted by {a.submitted_by_name} · {a.submitted_at} → Assigned to {a.assigned_to_name}</p>
                      {a.reviewer_comment && <div className="mt-2 p-2 bg-[#2D2257] rounded-lg text-xs text-gray-300">💬 {a.reviewer_comment}</div>}
                    </div>
                  </div>
                  {a.status==='pending' && (
                    <button onClick={()=>{setSelected(a);setReviewComment('')}} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-xs font-semibold text-white hover:opacity-90 flex-shrink-0">Review</button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab==='audit' && (
        <div className="max-w-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Approval Audit Trail</h3>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#39306A]"/>
            <div className="space-y-4">
              {auditTrail.map((t,i)=>(
                <div key={i} className="pl-12 relative">
                  <div className={`absolute left-2.5 w-5 h-5 rounded-full flex items-center justify-center text-xs ${t.action==='Approved'?'bg-green-500':t.action==='Rejected'?'bg-red-500':t.action==='Submitted'?'bg-violet-500':'bg-yellow-500'}`}>
                    {t.action==='Approved'?'✓':t.action==='Rejected'?'✗':t.action==='Submitted'?'↑':'~'}
                  </div>
                  <Card className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-sm font-semibold text-white">{t.action} </span>
                        <span className="text-xs text-gray-400">by {t.by}</span>
                        <p className="text-xs text-gray-300 mt-0.5">{t.detail}</p>
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

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-white">Review Forecast</h3>
            <div className="bg-[#2D2257] rounded-xl p-4 mb-4 space-y-2 text-sm">
              <p><span className="text-gray-400">Forecast: </span><span className="text-white font-medium">{selected.forecast_name}</span></p>
              <p><span className="text-gray-400">Model: </span><span className="text-white">{selected.model}</span></p>
              <p><span className="text-gray-400">Accuracy: </span><span className="text-violet-400 font-bold">{selected.accuracy}%</span></p>
              <p><span className="text-gray-400">Category: </span><span className="text-white">{selected.category} · {selected.region}</span></p>
              {selected.notes && <p><span className="text-gray-400">Notes: </span><span className="text-gray-300">{selected.notes}</span></p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Review Comment <span className="text-red-400">*</span></label>
              <textarea value={reviewComment} onChange={e=>setReviewComment(e.target.value)} rows={3} placeholder="Provide your review comment..."
                className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500 text-sm resize-none"/>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>doAction(selected.id,'approve')} disabled={!reviewComment} className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-40 rounded-xl font-semibold text-white transition">✅ Approve</button>
              <button onClick={()=>doAction(selected.id,'reject')} disabled={!reviewComment} className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 rounded-xl font-semibold text-white transition">❌ Reject</button>
              <button onClick={()=>setSelected(null)} className="px-5 py-3 bg-[#2D2257] rounded-xl font-semibold text-gray-300 hover:bg-[#39306A] transition">Cancel</button>
            </div>
          </Card>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-5 text-white">Submit Forecast for Approval</h3>
            <div className="space-y-4">
              {[{l:'Forecast Name',k:'forecast_name',ph:'e.g. Q4 Electronics Forecast'},{l:'Accuracy (%)',k:'accuracy',ph:'e.g. 96.2'}].map(f=>(
                <div key={f.k}><label className="block text-sm text-gray-400 mb-1">{f.l}</label>
                  <input placeholder={f.ph} value={submitForm[f.k]} onChange={e=>setSubmitForm(x=>({...x,[f.k]:e.target.value}))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500"/></div>
              ))}
              {[{l:'Model',k:'model',opts:['XGBoost','Random Forest','ARIMA','Linear Regression']},
                {l:'Category',k:'category',opts:['All','Electronics','Fashion','Groceries','Furniture']},
                {l:'Region',k:'region',opts:['All','North','South','East','West']}].map(f=>(
                <div key={f.k}><label className="block text-sm text-gray-400 mb-1">{f.l}</label>
                  <select value={submitForm[f.k]} onChange={e=>setSubmitForm(x=>({...x,[f.k]:e.target.value}))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                    {f.opts.map(o=><option key={o}>{o}</option>)}</select></div>
              ))}
              <div><label className="block text-sm text-gray-400 mb-1">Notes</label>
                <textarea value={submitForm.notes} onChange={e=>setSubmitForm(x=>({...x,notes:e.target.value}))} rows={2} placeholder="Add context for the reviewer..."
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500 resize-none text-sm"/></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={submitNew} className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90">Submit for Approval</button>
              <button onClick={()=>setShowSubmitModal(false)} className="flex-1 py-3 bg-[#2D2257] rounded-xl font-semibold text-gray-300 hover:bg-[#39306A]">Cancel</button>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  )
}
