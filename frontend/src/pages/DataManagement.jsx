import React, { useState } from 'react'
import Layout from '../components/layout/Layout'

const initDatasets = [
  { id:1, name:'Electronics Sales 2025', category:'Electronics', current_version:'v4', status:'active', is_archived:false, forecasts_using:5, last_used:'2h ago',
    versions:[
      {version:'v4',rows:4820,columns:12,size_kb:420,uploaded_by:'admin@example.com',change_summary:'Added Nov data (+1,240 rows)',uploaded_at:'2h ago',is_current:true},
      {version:'v3',rows:3580,columns:12,size_kb:310,uploaded_by:'analyst@example.com',change_summary:'Fixed column types, removed nulls',uploaded_at:'14d ago',is_current:false},
      {version:'v2',rows:3120,columns:11,size_kb:271,uploaded_by:'admin@example.com',change_summary:'Added region column',uploaded_at:'30d ago',is_current:false},
      {version:'v1',rows:2800,columns:10,size_kb:242,uploaded_by:'admin@example.com',change_summary:'Initial upload',uploaded_at:'60d ago',is_current:false},
    ]},
  { id:2, name:'Fashion Demand Q3-Q4', category:'Fashion', current_version:'v2', status:'active', is_archived:false, forecasts_using:3, last_used:'1d ago',
    versions:[
      {version:'v2',rows:2140,columns:10,size_kb:188,uploaded_by:'manager@example.com',change_summary:'Appended Q4 data',uploaded_at:'5d ago',is_current:true},
      {version:'v1',rows:1080,columns:10,size_kb:95,uploaded_by:'manager@example.com',change_summary:'Initial Q3 dataset',uploaded_at:'45d ago',is_current:false},
    ]},
  { id:3, name:'Groceries 2024 Archive', category:'Groceries', current_version:'v1', status:'archived', is_archived:true, forecasts_using:1, last_used:'45d ago',
    versions:[
      {version:'v1',rows:6800,columns:9,size_kb:580,uploaded_by:'analyst@example.com',change_summary:'Full year 2024 data',uploaded_at:'90d ago',is_current:true},
    ]},
]

const uploadHistory = [
  {id:1,dataset:'Electronics Sales 2025',version:'v4',by:'admin@example.com',rows:1240,size_kb:110,status:'success',time:'2h ago'},
  {id:2,dataset:'Fashion Demand Q3-Q4',version:'v2',by:'manager@example.com',rows:1060,size_kb:93,status:'success',time:'5d ago'},
  {id:3,dataset:'Bad_data.csv',version:'—',by:'analyst@example.com',rows:0,size_kb:45,status:'failed',time:'6d ago'},
  {id:4,dataset:'Electronics Sales 2025',version:'v3',by:'analyst@example.com',rows:760,size_kb:68,status:'success',time:'14d ago'},
]

const Card = ({children,className=''}) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>

export default function DataManagement() {
  const [datasets, setDatasets] = useState(initDatasets)
  const [tab, setTab] = useState('datasets')
  const [selected, setSelected] = useState(null)
  const [compareIds, setCompareIds] = useState([])
  const [rolledBackMsg, setRolledBackMsg] = useState('')

  const toggleArchive = (id) => setDatasets(d=>d.map(x=>x.id===id?{...x,is_archived:!x.is_archived,status:x.is_archived?'active':'archived'}:x))

  const rollback = (datasetId, version) => {
    setDatasets(d=>d.map(x=>{
      if (x.id!==datasetId) return x
      return {...x, current_version:version, versions:x.versions.map(v=>({...v,is_current:v.version===version}))}
    }))
    const ds = datasets.find(x=>x.id===datasetId)
    setRolledBackMsg(`✅ Rolled back "${ds?.name}" to ${version}`)
    setTimeout(()=>setRolledBackMsg(''),3000)
  }

  const toggleCompare = (id) => setCompareIds(c=>c.includes(id)?c.filter(x=>x!==id):[...c.slice(-1),id])

  const compareDatasets = compareIds.length===2 ? (() => {
    const d1=datasets.find(x=>x.id===compareIds[0]), d2=datasets.find(x=>x.id===compareIds[1])
    const v1=d1?.versions.find(v=>v.is_current), v2=d2?.versions.find(v=>v.is_current)
    return d1&&d2&&v1&&v2 ? {d1,d2,v1,v2} : null
  })() : null

  return (
    <Layout title="Data Management">
      <p className="text-gray-400 mb-6">Dataset versioning, upload history, modification tracking, and dataset archiving</p>

      {rolledBackMsg && <div className="mb-4 p-3 bg-green-900/30 border border-green-500/40 rounded-xl text-green-400 text-sm">{rolledBackMsg}</div>}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {label:'Total Datasets',value:datasets.length,icon:'🗂️',color:'from-violet-500 to-purple-600'},
          {label:'Active',value:datasets.filter(d=>!d.is_archived).length,icon:'✅',color:'from-green-500 to-emerald-600'},
          {label:'Archived',value:datasets.filter(d=>d.is_archived).length,icon:'📦',color:'from-gray-500 to-gray-600'},
          {label:'Total Versions',value:datasets.reduce((a,b)=>a+b.versions.length,0),icon:'🔖',color:'from-blue-500 to-cyan-600'},
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
        {[{k:'datasets',l:'🗂️ Datasets & Versions'},{k:'history',l:'📋 Upload History'},{k:'compare',l:'⚖️ Compare Datasets'}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab===t.k?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'text-gray-400 hover:text-white'}`}>{t.l}</button>
        ))}
      </div>

      {/* Datasets & Versions */}
      {tab==='datasets' && (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-80 flex-shrink-0 space-y-3">
            {datasets.map(d=>(
              <Card key={d.id} className={`p-4 cursor-pointer transition hover:border-violet-500 ${selected?.id===d.id?'border-violet-500 bg-[#2D2257]':''}`} onClick={()=>setSelected(d)}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white text-sm truncate">{d.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${d.is_archived?'bg-gray-800 text-gray-400':'bg-green-900/40 text-green-400'}`}>{d.status}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{d.category} · Current: {d.current_version} · {d.versions.length} versions</p>
                    <p className="text-xs text-gray-500 mt-0.5">Last used: {d.last_used} · {d.forecasts_using} forecasts</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex-1">
            {!selected ? (
              <Card className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center"><p className="text-4xl mb-3">🗂️</p><p>Select a dataset to view version history</p></div>
              </Card>
            ) : (
              <div>
                <Card className="p-5 mb-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{selected.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{selected.category} · {selected.versions.length} versions · Used by {selected.forecasts_using} forecasts</p>
                    </div>
                    <button onClick={()=>{toggleArchive(selected.id);setSelected(d=>({...d,is_archived:!d.is_archived,status:d.is_archived?'active':'archived'}))}}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${selected.is_archived?'bg-green-900/40 text-green-400':'bg-yellow-900/40 text-yellow-400'}`}>
                      {selected.is_archived?'📂 Restore':'📦 Archive'}
                    </button>
                  </div>
                </Card>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Version History</h4>
                <div className="space-y-3">
                  {selected.versions.map((v,i)=>(
                    <Card key={v.version} className={`p-4 ${v.is_current?'border-violet-500/60':''}`}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${v.is_current?'bg-gradient-to-r from-violet-500 to-pink-500 text-white':'bg-[#2D2257] text-gray-400'}`}>{v.version}</div>
                          <div>
                            {v.is_current && <p className="text-xs text-violet-400 font-semibold mb-1">CURRENT</p>}
                            <p className="text-sm font-medium text-white">{v.change_summary}</p>
                            <p className="text-xs text-gray-400 mt-0.5">by {v.uploaded_by} · {v.uploaded_at}</p>
                            <div className="flex gap-3 text-xs text-gray-500 mt-1">
                              <span>{v.rows.toLocaleString()} rows</span>
                              <span>{v.columns} cols</span>
                              <span>{v.size_kb} KB</span>
                            </div>
                          </div>
                        </div>
                        {!v.is_current && (
                          <button onClick={()=>rollback(selected.id, v.version)} className="px-3 py-1.5 bg-[#2D2257] text-gray-300 hover:bg-violet-800 rounded-lg text-xs font-semibold transition flex-shrink-0">↩ Rollback</button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload History */}
      {tab==='history' && (
        <Card>
          <div className="p-5 border-b border-[#39306A] flex items-center justify-between">
            <h4 className="font-semibold text-white">Dataset Upload History</h4>
            <div className="text-sm text-gray-400">
              <span className="text-green-400 font-semibold">{uploadHistory.filter(u=>u.status==='success').length} success</span>
              <span className="text-gray-500 mx-2">·</span>
              <span className="text-red-400 font-semibold">{uploadHistory.filter(u=>u.status==='failed').length} failed</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#39306A] text-gray-400 text-left">
                {['Dataset','Version','Uploaded By','Rows','Size','Status','Time'].map(h=><th key={h} className="px-5 py-3 font-medium">{h}</th>)}
              </tr></thead>
              <tbody>
                {uploadHistory.map(u=>(
                  <tr key={u.id} className="border-b border-[#2D2257] hover:bg-[#2D2257]/50 transition">
                    <td className="px-5 py-4 text-white font-medium">{u.dataset}</td>
                    <td className="px-5 py-4 text-violet-400">{u.version}</td>
                    <td className="px-5 py-4 text-gray-300">{u.by}</td>
                    <td className="px-5 py-4 text-gray-300">{u.rows>0?u.rows.toLocaleString():'—'}</td>
                    <td className="px-5 py-4 text-gray-300">{u.size_kb} KB</td>
                    <td className="px-5 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.status==='success'?'bg-green-900/40 text-green-400':'bg-red-900/40 text-red-400'}`}>{u.status}</span></td>
                    <td className="px-5 py-4 text-gray-400">{u.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Compare */}
      {tab==='compare' && (
        <div>
          <p className="text-gray-400 text-sm mb-4">Select two datasets to compare their current versions side-by-side.</p>
          <div className="flex flex-wrap gap-3 mb-6">
            {datasets.map(d=>(
              <button key={d.id} onClick={()=>toggleCompare(d.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition ${compareIds.includes(d.id)?'border-violet-500 bg-[#2D2257] text-white':'border-[#39306A] text-gray-400 hover:text-white'}`}>
                <div className={`w-3 h-3 rounded-full ${compareIds.includes(d.id)?'bg-violet-400':'bg-gray-600'}`} />
                {d.name}
                <span className="text-xs text-gray-500">({d.current_version})</span>
              </button>
            ))}
          </div>
          {compareDatasets ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[{ds:compareDatasets.d1,v:compareDatasets.v1},{ds:compareDatasets.d2,v:compareDatasets.v2}].map(({ds,v},idx)=>(
                <Card key={idx} className="p-5">
                  <h4 className="font-semibold text-white mb-3">{ds.name}</h4>
                  <div className="space-y-3">
                    {[['Current Version',v.version],['Rows',v.rows.toLocaleString()],['Columns',v.columns],['Size',`${v.size_kb} KB`],['Category',ds.category],['Status',ds.status],['Forecasts Using',ds.forecasts_using],['Last Used',ds.last_used]].map(([l,val])=>(
                      <div key={l} className="flex justify-between text-sm"><span className="text-gray-400">{l}</span><span className="text-white font-medium">{val}</span></div>
                    ))}
                  </div>
                </Card>
              ))}
              <Card className="p-5 md:col-span-2">
                <h4 className="font-semibold text-white mb-3">Differences</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    {label:'Row Difference', value: compareDatasets.v1.rows-compareDatasets.v2.rows },
                    {label:'Column Difference', value: compareDatasets.v1.columns-compareDatasets.v2.columns },
                    {label:'Size Difference', value: `${compareDatasets.v1.size_kb-compareDatasets.v2.size_kb} KB` },
                    {label:'Same Columns', value: compareDatasets.v1.columns===compareDatasets.v2.columns?'✅ Yes':'❌ No' },
                  ].map((d,i)=>(
                    <div key={i} className="bg-[#2D2257] p-4 rounded-xl text-center">
                      <p className={`text-xl font-bold ${typeof d.value==='number'&&d.value>0?'text-green-400':typeof d.value==='number'&&d.value<0?'text-red-400':'text-white'}`}>{typeof d.value==='number'&&d.value>0?'+':''}{d.value}</p>
                      <p className="text-xs text-gray-400 mt-1">{d.label}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center text-gray-500">
              <p className="text-4xl mb-3">⚖️</p>
              <p>Select exactly 2 datasets above to compare</p>
            </Card>
          )}
        </div>
      )}
    </Layout>
  )
}
