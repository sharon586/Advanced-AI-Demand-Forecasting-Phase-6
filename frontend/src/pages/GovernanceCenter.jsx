import React, { useState } from 'react'
import Layout from '../components/layout/Layout'

const versions = [
  {id:1,forecast_id:101,forecast_name:'Q4 Electronics Forecast',version:'v3',status:'approved',model:'XGBoost',accuracy:97.1,created_by:'analyst@example.com',approved_by:'admin@example.com',changes:'Switched ARIMA → XGBoost; accuracy 89.4% → 97.1%',is_current:true,created_at:'3h ago'},
  {id:2,forecast_id:101,forecast_name:'Q4 Electronics Forecast',version:'v2',status:'rejected',model:'ARIMA',accuracy:89.4,created_by:'analyst@example.com',approved_by:'manager@example.com',changes:'Updated dataset with November data',is_current:false,created_at:'2d ago'},
  {id:3,forecast_id:101,forecast_name:'Q4 Electronics Forecast',version:'v1',status:'superseded',model:'ARIMA',accuracy:91.2,created_by:'admin@example.com',approved_by:null,changes:'Initial forecast',is_current:false,created_at:'5d ago'},
  {id:4,forecast_id:102,forecast_name:'Fashion Annual Plan',version:'v1',status:'approved',model:'Random Forest',accuracy:95.2,created_by:'manager@example.com',approved_by:'admin@example.com',changes:'Initial forecast',is_current:true,created_at:'1d ago'},
]

const modifications = [
  {forecast:'Q4 Electronics Forecast',modified_by:'analyst@example.com',type:'Model Changed',detail:'ARIMA → XGBoost',time:'3h ago'},
  {forecast:'Q4 Electronics Forecast',modified_by:'admin@example.com',type:'Dataset Updated',detail:'Added Nov 2025 data',time:'2d ago'},
  {forecast:'Fashion Annual Plan',modified_by:'manager@example.com',type:'Version Created',detail:'v1 created',time:'1d ago'},
  {forecast:'Q4 Electronics Forecast',modified_by:'analyst@example.com',type:'Submitted for Approval',detail:'Submitted to manager@',time:'3h ago'},
]

const lifecycle = [
  {id:101,name:'Q4 Electronics Forecast',stage:'Published',version:'v3',next_action:'Archive after Q4 ends',compliance:true},
  {id:102,name:'Fashion Annual Plan',stage:'Approved',version:'v1',next_action:'Publish to stakeholders',compliance:true},
  {id:103,name:'Grocery Restock Weekly',stage:'Draft',version:'v1',next_action:'Submit for review',compliance:false},
]

const STAGES = ['Draft','Review','Approved','Published','Archived']
const Card = ({children,className=''}) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>
const versionStatusColor = s => ({approved:'bg-green-900/40 text-green-400',rejected:'bg-red-900/40 text-red-400',superseded:'bg-gray-800 text-gray-400',draft:'bg-yellow-900/40 text-yellow-400'}[s])

export default function GovernanceCenter() {
  const [tab, setTab] = useState('dashboard')

  const dashStats = {
    total_versions: versions.length,
    approved: versions.filter(v=>v.status==='approved').length,
    pending_approvals: 2,
    compliance_score: 87,
    modifications_today: 4,
  }

  return (
    <Layout title="Forecast Governance Center">
      <p className="text-gray-400 mb-6">Version control, modification tracking, approval records, and forecast lifecycle management</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[{l:'Versions',v:dashStats.total_versions,ic:'🔖',c:'from-violet-500 to-purple-600'},
          {l:'Approved',v:dashStats.approved,ic:'✅',c:'from-green-500 to-emerald-600'},
          {l:'Pending',v:dashStats.pending_approvals,ic:'⏳',c:'from-yellow-500 to-amber-600'},
          {l:'Compliance',v:`${dashStats.compliance_score}%`,ic:'🛡️',c:'from-blue-500 to-cyan-600'},
          {l:'Mods Today',v:dashStats.modifications_today,ic:'✏️',c:'from-pink-500 to-rose-600'}
        ].map((s,i)=>(
          <Card key={i} className="p-4"><div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.c} flex items-center justify-center text-sm`}>{s.ic}</div>
            <div><p className="text-xl font-bold text-white">{s.v}</p><p className="text-xs text-gray-400">{s.l}</p></div>
          </div></Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {[{k:'dashboard',l:'📊 Dashboard'},{k:'versions',l:'🔖 Version Control'},{k:'modifications',l:'✏️ Modifications'},{k:'lifecycle',l:'🔄 Lifecycle'}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab===t.k?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'text-gray-400 hover:text-white'}`}>{t.l}</button>
        ))}
      </div>

      {tab==='dashboard' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-5">
            <h4 className="font-semibold text-white mb-4">Compliance Score</h4>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2D2257" strokeWidth="3"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#7C3AED" strokeWidth="3"
                    strokeDasharray={`${dashStats.compliance_score} ${100-dashStats.compliance_score}`} strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{dashStats.compliance_score}%</span>
                  <span className="text-xs text-gray-400">Compliance</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {[['Version Control','✅ Maintained'],['Approval Records','✅ Complete'],['Audit Trail','✅ Active'],['Lifecycle Mgmt','⚠️ 1 non-compliant']].map(([l,v])=>(
                <div key={l} className="flex justify-between"><span className="text-gray-400">{l}</span><span className="text-white font-medium">{v}</span></div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h4 className="font-semibold text-white mb-4">Forecast Lifecycle Overview</h4>
            <div className="space-y-3">
              {STAGES.map(stage=>{
                const count = lifecycle.filter(f=>f.stage===stage).length
                return (
                  <div key={stage} className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-24">{stage}</span>
                    <div className="flex-1 bg-[#2D2257] rounded-full h-2">
                      <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" style={{width:`${count/lifecycle.length*100}%`}}/>
                    </div>
                    <span className="text-sm text-white w-6 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {tab==='versions' && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white mb-2">Forecast Version Control</h3>
          {versions.map(v=>(
            <Card key={v.id} className={`p-5 ${v.is_current?'border-violet-500/60':''}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${v.is_current?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'bg-[#2D2257] text-gray-400'}`}>{v.version}</div>
                  <div>
                    {v.is_current && <p className="text-xs text-violet-400 font-semibold mb-1">🔖 CURRENT VERSION</p>}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-white">{v.forecast_name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${versionStatusColor(v.status)}`}>{v.status}</span>
                    </div>
                    <p className="text-sm text-gray-300">{v.changes}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400 mt-1">
                      <span>Model: <span className="text-white">{v.model}</span></span>
                      <span>Accuracy: <span className="text-violet-400 font-semibold">{v.accuracy}%</span></span>
                      <span>By: {v.created_by}</span>
                      {v.approved_by && <span>Approved by: {v.approved_by}</span>}
                      <span>{v.created_at}</span>
                    </div>
                  </div>
                </div>
                {!v.is_current && <button className="px-3 py-1.5 bg-[#2D2257] text-gray-300 hover:bg-violet-800 rounded-lg text-xs font-semibold transition flex-shrink-0">↩ Restore</button>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab==='modifications' && (
        <Card>
          <div className="p-5 border-b border-[#39306A]"><h4 className="font-semibold text-white">Forecast Modification Log</h4></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#39306A] text-gray-400 text-left">
                {['Forecast','Modified By','Type','Detail','Time'].map(h=><th key={h} className="px-5 py-3 font-medium">{h}</th>)}
              </tr></thead>
              <tbody>
                {modifications.map((m,i)=>(
                  <tr key={i} className="border-b border-[#2D2257] hover:bg-[#2D2257]/50 transition">
                    <td className="px-5 py-4 text-white font-medium">{m.forecast}</td>
                    <td className="px-5 py-4 text-blue-400">{m.modified_by}</td>
                    <td className="px-5 py-4"><span className="px-2 py-0.5 bg-violet-900/30 text-violet-300 rounded-full text-xs">{m.type}</span></td>
                    <td className="px-5 py-4 text-gray-300">{m.detail}</td>
                    <td className="px-5 py-4 text-gray-400">{m.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab==='lifecycle' && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white mb-2">Forecast Lifecycle Management</h3>
          {lifecycle.map(f=>(
            <Card key={f.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${f.compliance?'bg-green-900/40':'bg-red-900/40'}`}>{f.compliance?'✅':'⚠️'}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white">{f.name}</p>
                      <span className="px-2 py-0.5 bg-violet-900/30 text-violet-300 rounded-full text-xs">{f.version}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${f.compliance?'bg-green-900/40 text-green-400':'bg-red-900/40 text-red-400'}`}>{f.compliance?'Compliant':'Non-compliant'}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5">Next action: <span className="text-white">{f.next_action}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {STAGES.map((s,i)=>(
                    <div key={s} className="flex items-center gap-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${f.stage===s?'bg-violet-500':STAGES.indexOf(f.stage)>i?'bg-green-500':'bg-[#2D2257]'}`}/>
                      {i<STAGES.length-1 && <div className={`w-6 h-0.5 ${STAGES.indexOf(f.stage)>i?'bg-green-500':'bg-[#2D2257]'}`}/>}
                    </div>
                  ))}
                  <span className="text-xs text-gray-400 ml-2">{f.stage}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  )
}
