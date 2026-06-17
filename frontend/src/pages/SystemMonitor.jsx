import React, { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const genPerf = () => ({
  cpu: (18 + Math.random() * 27).toFixed(1),
  memory: (42 + Math.random() * 26).toFixed(1),
  disk: (28 + Math.random() * 24).toFixed(1),
  latency: Math.round(85 + Math.random() * 235),
  rpm: Math.round(12 + Math.random() * 36),
  cache: (72 + Math.random() * 22).toFixed(1),
  db_ms: Math.round(12 + Math.random() * 73),
  error_rate: (0.2 + Math.random() * 1.6).toFixed(2),
})

const activityLogs = [
  { id: 1, user: 'admin@example.com', action: 'forecast_run', detail: 'Random Forest — Electronics/North', ip: '192.168.1.10', status: 'success', duration: '245ms', time: '5 min ago' },
  { id: 2, user: 'analyst@example.com', action: 'dataset_upload', detail: 'sales_q4.csv (1240 rows)', ip: '192.168.1.12', status: 'success', duration: '820ms', time: '22 min ago' },
  { id: 3, user: 'manager@example.com', action: 'report_export', detail: 'Annual Revenue PDF', ip: '192.168.1.15', status: 'success', duration: '1.2s', time: '1 hour ago' },
  { id: 4, user: 'sneha@example.com', action: 'login', detail: 'Login failed — account inactive', ip: '192.168.1.20', status: 'failed', duration: '120ms', time: '2 hours ago' },
  { id: 5, user: 'admin@example.com', action: 'model_compare', detail: '4 models benchmarked', ip: '192.168.1.10', status: 'success', duration: '1.85s', time: '3 hours ago' },
  { id: 6, user: 'analyst@example.com', action: 'forecast_run', detail: 'XGBoost — Fashion/South', ip: '192.168.1.12', status: 'success', duration: '312ms', time: '5 hours ago' },
  { id: 7, user: 'manager@example.com', action: 'dataset_upload', detail: 'corrupt.csv — invalid format', ip: '192.168.1.15', status: 'failed', duration: '95ms', time: '6 hours ago' },
  { id: 8, user: 'admin@example.com', action: 'user_manage', detail: 'Deactivated user sneha@example.com', ip: '192.168.1.10', status: 'success', duration: '88ms', time: '1 day ago' },
]

const endpointStats = [
  { endpoint: '/forecast/random-forest', avg_ms: 245, calls: 84, color: '#7C3AED' },
  { endpoint: '/analytics/summary', avg_ms: 120, calls: 312, color: '#3B82F6' },
  { endpoint: '/datasets/upload', avg_ms: 820, calls: 28, color: '#EC4899' },
  { endpoint: '/reports/', avg_ms: 185, calls: 96, color: '#10B981' },
  { endpoint: '/auth/login', avg_ms: 210, calls: 47, color: '#F59E0B' },
]

export default function SystemMonitor() {
  const [perf, setPerf] = useState(genPerf)
  const [tab, setTab] = useState('performance')
  const [logFilter, setLogFilter] = useState({ search: '', status: 'all', action: 'all' })

  useEffect(() => {
    const interval = setInterval(() => setPerf(genPerf()), 4000)
    return () => clearInterval(interval)
  }, [])

  const filteredLogs = activityLogs.filter(l => {
    if (logFilter.status !== 'all' && l.status !== logFilter.status) return false
    if (logFilter.action !== 'all' && l.action !== logFilter.action) return false
    if (logFilter.search && !l.user.includes(logFilter.search) && !l.detail.toLowerCase().includes(logFilter.search.toLowerCase())) return false
    return true
  })

  const Gauge = ({ value, label, color }) => (
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto mb-2">
        <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#312B56" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${value} ${100 - value}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{value}%</span>
        </div>
      </div>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  )

  return (
    <Layout title="System Monitor">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-sm text-gray-400">System healthy — auto-refresh every 4s</span>
      </div>

      <div className="flex gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {[
          { key: 'performance', label: '⚡ Performance' },
          { key: 'api', label: '🔌 API Monitor' },
          { key: 'logs', label: '📋 Activity Logs' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab===t.key ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'performance' && (
        <div className="space-y-6">
          {/* Gauges */}
          <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
            <h3 className="font-semibold mb-6">System Resources</h3>
            <div className="flex justify-around">
              <Gauge value={parseFloat(perf.cpu)} label="CPU Usage" color="#7C3AED" />
              <Gauge value={parseFloat(perf.memory)} label="Memory" color="#EC4899" />
              <Gauge value={parseFloat(perf.disk)} label="Disk" color="#3B82F6" />
              <Gauge value={parseFloat(perf.cache)} label="Cache Hit" color="#10B981" />
            </div>
          </div>
          {/* Metric Cards */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'API Latency', value: `${perf.latency}ms`, sub: 'Average response time', color: 'text-violet-400' },
              { label: 'Requests/min', value: perf.rpm, sub: 'Current throughput', color: 'text-blue-400' },
              { label: 'DB Query Avg', value: `${perf.db_ms}ms`, sub: 'Database response', color: 'text-green-400' },
              { label: 'Error Rate', value: `${perf.error_rate}%`, sub: 'Failed requests', color: parseFloat(perf.error_rate) > 1 ? 'text-red-400' : 'text-green-400' },
            ].map((m, i) => (
              <div key={i} className="bg-[#211A45] rounded-2xl p-5 border border-[#39306A]">
                <p className="text-sm text-gray-400 mb-2">{m.label}</p>
                <h3 className={`text-2xl font-bold ${m.color}`}>{m.value}</h3>
                <p className="text-xs text-gray-500 mt-1">{m.sub}</p>
              </div>
            ))}
          </div>
          {/* Uptime */}
          <div className="bg-[#211A45] rounded-2xl p-5 border border-[#39306A]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">System Uptime</span>
              <span className="text-green-400 font-bold">99.8%</span>
            </div>
            <div className="w-full bg-[#312B56] rounded-full h-3">
              <div className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: '99.8%' }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">2,184 hours continuous uptime</p>
          </div>
        </div>
      )}

      {tab === 'api' && (
        <div className="space-y-6">
          <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
            <h3 className="font-semibold mb-5">Endpoint Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={endpointStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A" />
                <XAxis dataKey="endpoint" stroke="#9CA3AF" tick={{ fontSize: 9 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} label={{ value: 'ms', position: 'insideLeft', fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
                <Bar dataKey="avg_ms" name="Avg Response (ms)" radius={[6, 6, 0, 0]}>
                  {endpointStats.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
            <h3 className="font-semibold mb-4">API Call Statistics</h3>
            <table className="w-full text-sm">
              <thead><tr className="text-gray-400 border-b border-[#39306A]">
                {['Endpoint','Avg Response','Calls Today','Status'].map(h=><th key={h} className="text-left pb-3 px-2 font-medium">{h}</th>)}
              </tr></thead>
              <tbody>{endpointStats.map((e,i)=>(
                <tr key={i} className="border-b border-[#312B56] hover:bg-[#2D2257] transition">
                  <td className="py-3 px-2 text-white font-mono text-xs">{e.endpoint}</td>
                  <td className="py-3 px-2" style={{color:e.color}}>{e.avg_ms}ms</td>
                  <td className="py-3 px-2 text-gray-300">{e.calls}</td>
                  <td className="py-3 px-2"><span className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-400">healthy</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'logs' && (
        <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
          <div className="flex flex-wrap gap-3 mb-5">
            <input placeholder="🔍 Search user or action..."
              value={logFilter.search} onChange={e => setLogFilter(p=>({...p,search:e.target.value}))}
              className="bg-[#2D2257] text-white text-sm px-4 py-2 rounded-lg border border-[#39306A] outline-none w-52" />
            <select value={logFilter.status} onChange={e => setLogFilter(p=>({...p,status:e.target.value}))}
              className="bg-[#2D2257] text-white text-sm px-3 py-2 rounded-lg border border-[#39306A] outline-none">
              {['all','success','failed'].map(s=><option key={s} value={s}>{s==='all'?'All Status':s}</option>)}
            </select>
            <select value={logFilter.action} onChange={e => setLogFilter(p=>({...p,action:e.target.value}))}
              className="bg-[#2D2257] text-white text-sm px-3 py-2 rounded-lg border border-[#39306A] outline-none">
              {['all','forecast_run','dataset_upload','report_export','login','model_compare','user_manage'].map(a=><option key={a} value={a}>{a==='all'?'All Actions':a}</option>)}
            </select>
            <span className="text-sm text-gray-400 self-center ml-auto">{filteredLogs.length} logs</span>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="text-gray-400 border-b border-[#39306A]">
              {['#','User','Action','Detail','IP','Duration','Status','Time'].map(h=><th key={h} className="text-left pb-3 px-2 font-medium">{h}</th>)}
            </tr></thead>
            <tbody>{filteredLogs.map((l,i)=>(
              <tr key={i} className="border-b border-[#312B56] hover:bg-[#2D2257] transition">
                <td className="py-3 px-2 text-gray-600">#{l.id}</td>
                <td className="py-3 px-2 text-violet-300 text-xs">{l.user}</td>
                <td className="py-3 px-2"><span className="text-xs px-2 py-0.5 rounded-full bg-[#312B56] text-gray-300">{l.action}</span></td>
                <td className="py-3 px-2 text-gray-300 text-xs max-w-[180px] truncate">{l.detail}</td>
                <td className="py-3 px-2 text-gray-500 text-xs">{l.ip}</td>
                <td className="py-3 px-2 text-gray-400 text-xs">{l.duration}</td>
                <td className="py-3 px-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${l.status==='success'?'bg-green-900/30 text-green-400':'bg-red-900/30 text-red-400'}`}>{l.status}</span>
                </td>
                <td className="py-3 px-2 text-gray-600 text-xs">{l.time}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
