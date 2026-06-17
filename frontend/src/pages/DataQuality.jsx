import React, { useState } from 'react'
import Layout from '../components/layout/Layout'

const reports = [
  {dataset_id:1,dataset_name:'Electronics Sales 2025',overall_score:92,grade:'A',checks:{completeness:96,consistency:91,accuracy:94,timeliness:88,validity:93},issues:[{type:'Missing Values',severity:'low',column:'region',count:24,suggestion:'Fill with Unknown or drop rows'},{type:'Outlier Detected',severity:'medium',column:'sales_amount',count:7,suggestion:'Review and cap at 3σ'}],row_count:4820,null_count:31,duplicate_count:3,last_checked:'2h ago'},
  {dataset_id:2,dataset_name:'Fashion Demand Q3-Q4',overall_score:78,grade:'B',checks:{completeness:82,consistency:76,accuracy:80,timeliness:72,validity:79},issues:[{type:'Missing Values',severity:'medium',column:'category',count:85,suggestion:'Impute with mode value'},{type:'Date Format Inconsistency',severity:'medium',column:'sale_date',count:42,suggestion:'Standardize to YYYY-MM-DD'},{type:'Negative Values',severity:'high',column:'quantity',count:12,suggestion:'Investigate and correct or remove'}],row_count:2140,null_count:102,duplicate_count:15,last_checked:'1d ago'},
  {dataset_id:3,dataset_name:'Groceries 2024 Archive',overall_score:65,grade:'C',checks:{completeness:70,consistency:62,accuracy:68,timeliness:55,validity:70},issues:[{type:'Stale Data',severity:'critical',column:'sale_date',count:6800,suggestion:'Dataset is >1 year old — consider refreshing'},{type:'Missing Values',severity:'high',column:'store_id',count:420,suggestion:'Cannot reliably impute — source data needed'},{type:'Duplicate Rows',severity:'medium',column:'*',count:128,suggestion:'De-duplicate before training'}],row_count:6800,null_count:620,duplicate_count:128,last_checked:'5d ago'},
]

const gradeColor = g => ({A:'bg-green-900/40 text-green-400',B:'bg-blue-900/40 text-blue-400',C:'bg-yellow-900/40 text-yellow-400',D:'bg-orange-900/40 text-orange-400',F:'bg-red-900/40 text-red-400'}[g])
const severityColor = s => ({critical:'bg-red-900/40 text-red-400',high:'bg-orange-900/40 text-orange-400',medium:'bg-yellow-900/40 text-yellow-400',low:'bg-green-900/40 text-green-400'}[s])
const scoreColor = n => n>=90?'text-green-400':n>=80?'text-blue-400':n>=70?'text-yellow-400':'text-red-400'
const Card = ({children,className=''}) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>

export default function DataQuality() {
  const [selected, setSelected] = useState(null)
  const [scanning, setScanning] = useState(null)
  const [scanResults, setScanResults] = useState({})

  const runScan = (id) => {
    setScanning(id)
    setTimeout(()=>{
      const score = Math.floor(Math.random()*25+70)
      setScanResults(r=>({...r,[id]:{score,grade:score>=90?'A':score>=80?'B':score>=70?'C':'D',time:'just now'}}))
      setScanning(null)
    },1800)
  }

  const avgScore = Math.round(reports.reduce((a,b)=>a+b.overall_score,0)/reports.length)

  return (
    <Layout title="Data Quality Management">
      <p className="text-gray-400 mb-6">Monitor dataset quality scores, detect issues, and ensure data readiness for accurate forecasting</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:'Platform Score',v:`${avgScore}/100`,ic:'🏆',c:'from-violet-500 to-purple-600'},
          {l:'Datasets Checked',v:reports.length,ic:'🗂️',c:'from-blue-500 to-cyan-600'},
          {l:'Critical Issues',v:reports.reduce((a,b)=>a+b.issues.filter(i=>i.severity==='critical').length,0),ic:'🚨',c:'from-red-500 to-rose-600'},
          {l:'Need Attention',v:reports.filter(r=>r.overall_score<80).length,ic:'⚠️',c:'from-yellow-500 to-amber-600'}
        ].map((s,i)=>(
          <Card key={i} className="p-5"><div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.c} flex items-center justify-center text-lg`}>{s.ic}</div>
            <div><p className="text-2xl font-bold text-white">{s.v}</p><p className="text-xs text-gray-400">{s.l}</p></div>
          </div></Card>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Dataset list */}
        <div className="lg:w-80 flex-shrink-0 space-y-3">
          {reports.map(r=>{
            const scan = scanResults[r.dataset_id]
            const score = scan ? scan.score : r.overall_score
            const grade = scan ? scan.grade : r.grade
            return (
              <Card key={r.dataset_id} className={`p-4 cursor-pointer transition hover:border-violet-500 ${selected?.dataset_id===r.dataset_id?'border-violet-500 bg-[#2D2257]':''}`}
                onClick={()=>setSelected(r)}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-white text-sm">{r.dataset_name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${gradeColor(grade)}`}>{grade}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-2xl font-bold ${scoreColor(score)}`}>{score}</span>
                  <span className="text-gray-400 text-sm">/100</span>
                  {scan && <span className="text-xs text-violet-400">↺ rescanned</span>}
                </div>
                <div className="w-full bg-[#1B1538] rounded-full h-1.5 mb-2">
                  <div className={`h-1.5 rounded-full ${score>=90?'bg-green-500':score>=80?'bg-blue-500':score>=70?'bg-yellow-500':'bg-red-500'}`} style={{width:`${score}%`}}/>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{r.issues.length} issues · {r.last_checked}</span>
                  <button onClick={e=>{e.stopPropagation();runScan(r.dataset_id)}} disabled={scanning===r.dataset_id}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${scanning===r.dataset_id?'bg-yellow-800 text-yellow-300':'bg-[#2D2257] text-white hover:bg-violet-800'}`}>
                    {scanning===r.dataset_id?'⏳':'🔍 Scan'}
                  </button>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Detail panel */}
        <div className="flex-1">
          {!selected ? (
            <Card className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center"><p className="text-5xl mb-3">🗄️</p><p>Select a dataset to view quality report</p></div>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card className="p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{selected.dataset_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-3xl font-bold ${scoreColor(selected.overall_score)}`}>{selected.overall_score}</span>
                      <span className="text-gray-400">/100</span>
                      <span className={`px-2 py-0.5 rounded-full text-sm font-bold ${gradeColor(selected.grade)}`}>Grade {selected.grade}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{selected.row_count.toLocaleString()} rows · {selected.null_count} nulls · {selected.duplicate_count} duplicates · Last: {selected.last_checked}</p>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Quality Dimensions</h4>
                <div className="space-y-2">
                  {Object.entries(selected.checks).map(([k,v])=>(
                    <div key={k} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 capitalize w-24">{k}</span>
                      <div className="flex-1 bg-[#2D2257] rounded-full h-2">
                        <div className={`h-2 rounded-full ${v>=90?'bg-green-500':v>=80?'bg-blue-500':v>=70?'bg-yellow-500':'bg-red-500'}`} style={{width:`${v}%`}}/>
                      </div>
                      <span className={`text-xs font-semibold w-8 text-right ${scoreColor(v)}`}>{v}%</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5">
                <h4 className="font-semibold text-white mb-3">Issues Detected ({selected.issues.length})</h4>
                <div className="space-y-3">
                  {selected.issues.map((issue,i)=>(
                    <div key={i} className="p-4 bg-[#2D2257] rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${severityColor(issue.severity)}`}>{issue.severity}</span>
                        <span className="text-sm font-medium text-white">{issue.type}</span>
                        <span className="text-xs text-gray-400">· col: <span className="text-violet-300">{issue.column}</span></span>
                        <span className="text-xs text-gray-400">· {issue.count} records</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">💡 {issue.suggestion}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
