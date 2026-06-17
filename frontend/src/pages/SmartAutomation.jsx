import React, { useState } from 'react'
import Layout from '../components/layout/Layout'

const INTERVALS = ['5min', '15min', '30min', 'hourly', 'daily', 'weekly', 'monthly']
const MODELS = ['Linear Regression', 'Random Forest', 'XGBoost', 'ARIMA']
const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Groceries', 'Furniture']

const initialSchedules = [
  { id: 1, name: 'Daily Electronics Forecast', model: 'Random Forest', category: 'Electronics', region: 'North', interval: 'daily', time: '08:00', is_active: true, last_run: '2h ago', next_run: 'in 18h', runs: 48 },
  { id: 2, name: 'Weekly All-Category Forecast', model: 'XGBoost', category: 'All', region: 'All', interval: 'weekly', time: '09:00', is_active: true, last_run: '3d ago', next_run: 'in 4d', runs: 12 },
  { id: 3, name: 'Monthly Groceries Report', model: 'ARIMA', category: 'Groceries', region: 'South', interval: 'monthly', time: '07:00', is_active: false, last_run: '12d ago', next_run: 'in 18d', runs: 3 },
]

const initialAlerts = [
  { id: 1, name: 'Low Accuracy Alert', type: 'Accuracy', threshold: '85%', condition: 'below', is_active: true, channel: 'in-app' },
  { id: 2, name: 'High RMSE Alert', type: 'RMSE', threshold: '5000', condition: 'above', is_active: true, channel: 'email' },
  { id: 3, name: 'Demand Spike Alert', type: 'Demand Spike', threshold: '25%', condition: 'above', is_active: true, channel: 'in-app' },
]

const workflowRuns = [
  { id: 1, name: 'Daily Electronics Forecast', status: 'success', duration: '12s', time: '2h ago', result: '94.2% accuracy' },
  { id: 2, name: 'Weekly All-Category Forecast', status: 'success', duration: '38s', time: '3d ago', result: 'Best: XGBoost 97.1%' },
  { id: 3, name: 'Monthly Groceries Report', status: 'failed', duration: '5s', time: '12d ago', result: 'No dataset available' },
]

const Card = ({ children, className = '' }) => (
  <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>
)
const Badge = ({ color, children }) => {
  const colors = { green: 'bg-green-900/40 text-green-400', red: 'bg-red-900/40 text-red-400', gray: 'bg-gray-800 text-gray-400', yellow: 'bg-yellow-900/40 text-yellow-400' }
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[color]}`}>{children}</span>
}

export default function SmartAutomation() {
  const [tab, setTab] = useState('schedules')
  const [schedules, setSchedules] = useState(initialSchedules)
  const [alerts, setAlerts] = useState(initialAlerts)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [runningId, setRunningId] = useState(null)
  const [newSchedule, setNewSchedule] = useState({ name: '', model: 'Random Forest', category: 'All', region: 'All', interval: 'daily', time: '08:00' })
  const [newAlert, setNewAlert] = useState({ name: '', type: 'Accuracy', threshold: '', condition: 'below', channel: 'in-app' })

  const toggleSchedule = (id) => setSchedules(s => s.map(x => x.id === id ? { ...x, is_active: !x.is_active } : x))
  const deleteSchedule = (id) => setSchedules(s => s.filter(x => x.id !== id))
  const toggleAlert = (id) => setAlerts(a => a.map(x => x.id === id ? { ...x, is_active: !x.is_active } : x))
  const deleteAlert = (id) => setAlerts(a => a.filter(x => x.id !== id))

  const runNow = (id) => {
    setRunningId(id)
    setTimeout(() => setRunningId(null), 2000)
  }

  const addSchedule = () => {
    if (!newSchedule.name) return
    setSchedules(s => [...s, { ...newSchedule, id: Date.now(), is_active: true, last_run: 'Never', next_run: 'Soon', runs: 0 }])
    setShowScheduleModal(false)
    setNewSchedule({ name: '', model: 'Random Forest', category: 'All', region: 'All', interval: 'daily', time: '08:00' })
  }

  const addAlert = () => {
    if (!newAlert.name || !newAlert.threshold) return
    setAlerts(a => [...a, { ...newAlert, id: Date.now(), is_active: true }])
    setShowAlertModal(false)
    setNewAlert({ name: '', type: 'Accuracy', threshold: '', condition: 'below', channel: 'in-app' })
  }

  const tabs = [
    { key: 'schedules', label: '🗓️ Schedules', count: schedules.filter(s => s.is_active).length },
    { key: 'alerts', label: '🔔 Alert Configs', count: alerts.filter(a => a.is_active).length },
    { key: 'runs', label: '▶️ Workflow Runs', count: workflowRuns.length },
  ]

  return (
    <Layout title="Smart Automation">
      <p className="text-gray-400 mb-6">Configure automated forecasting schedules, workflows, and intelligent alerts</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Schedules', value: schedules.filter(s=>s.is_active).length, icon: '🗓️', color: 'from-violet-500 to-purple-600' },
          { label: 'Total Schedules', value: schedules.length, icon: '📋', color: 'from-blue-500 to-cyan-600' },
          { label: 'Active Alerts', value: alerts.filter(a=>a.is_active).length, icon: '🔔', color: 'from-pink-500 to-rose-600' },
          { label: 'Successful Runs', value: workflowRuns.filter(r=>r.status==='success').length, icon: '✅', color: 'from-green-500 to-emerald-600' },
        ].map((s, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg`}>{s.icon}</div>
              <div><p className="text-2xl font-bold text-white">{s.value}</p><p className="text-xs text-gray-400">{s.label}</p></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${tab === t.key ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.label} <span className={`px-1.5 py-0.5 rounded-full text-xs ${tab===t.key?'bg-white/20':'bg-[#312B56]'}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Schedules Tab */}
      {tab === 'schedules' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Automated Forecast Schedules</h3>
            <button onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-sm font-semibold hover:opacity-90 transition">
              + New Schedule
            </button>
          </div>
          <div className="space-y-3">
            {schedules.map(s => (
              <Card key={s.id} className="p-5">
                <div className="flex flex-wrap items-center gap-4 justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${s.is_active ? 'bg-violet-900/40' : 'bg-gray-800'}`}>🗓️</div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white">{s.name}</p>
                        <Badge color={s.is_active ? 'green' : 'gray'}>{s.is_active ? 'Active' : 'Inactive'}</Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-0.5">{s.model} · {s.category} · {s.region} · Every {s.interval} at {s.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                    <span>Last: {s.last_run}</span>
                    <span>Next: {s.next_run}</span>
                    <span className="text-violet-400">{s.runs} runs</span>
                    <button onClick={() => runNow(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${runningId === s.id ? 'bg-yellow-600 text-white' : 'bg-[#2D2257] text-white hover:bg-violet-700'}`}>
                      {runningId === s.id ? '⏳ Running...' : '▶ Run Now'}
                    </button>
                    <button onClick={() => toggleSchedule(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${s.is_active ? 'bg-yellow-900/40 text-yellow-400' : 'bg-green-900/40 text-green-400'}`}>
                      {s.is_active ? 'Pause' : 'Enable'}
                    </button>
                    <button onClick={() => deleteSchedule(s.id)} className="text-red-400 hover:text-red-300 px-2">✕</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Alert Configs Tab */}
      {tab === 'alerts' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Alert Configurations</h3>
            <button onClick={() => setShowAlertModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-sm font-semibold hover:opacity-90 transition">
              + New Alert
            </button>
          </div>
          <div className="space-y-3">
            {alerts.map(a => (
              <Card key={a.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${a.is_active ? 'bg-pink-900/40' : 'bg-gray-800'}`}>🔔</div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white">{a.name}</p>
                        <Badge color={a.is_active ? 'green' : 'gray'}>{a.is_active ? 'Active' : 'Off'}</Badge>
                      </div>
                      <p className="text-sm text-gray-400">{a.type} {a.condition} {a.threshold} · via {a.channel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleAlert(a.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${a.is_active ? 'bg-yellow-900/40 text-yellow-400' : 'bg-green-900/40 text-green-400'}`}>
                      {a.is_active ? 'Disable' : 'Enable'}
                    </button>
                    <button onClick={() => deleteAlert(a.id)} className="text-red-400 hover:text-red-300 px-2">✕</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Workflow Runs Tab */}
      {tab === 'runs' && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Workflow Execution History</h3>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#39306A] text-gray-400 text-left">
                  {['Schedule', 'Status', 'Duration', 'Triggered', 'Result'].map(h => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
                </tr></thead>
                <tbody>
                  {workflowRuns.map(r => (
                    <tr key={r.id} className="border-b border-[#2D2257] hover:bg-[#2D2257]/50 transition">
                      <td className="px-5 py-4 text-white font-medium">{r.name}</td>
                      <td className="px-5 py-4"><Badge color={r.status === 'success' ? 'green' : 'red'}>{r.status}</Badge></td>
                      <td className="px-5 py-4 text-gray-300">{r.duration}</td>
                      <td className="px-5 py-4 text-gray-400">{r.time}</td>
                      <td className="px-5 py-4 text-gray-300">{r.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-5 text-white">New Forecast Schedule</h3>
            <div className="space-y-4">
              {[{ label: 'Schedule Name', key: 'name', type: 'text', placeholder: 'e.g. Daily Electronics Forecast' }].map(f => (
                <div key={f.key}>
                  <label className="block text-sm text-gray-400 mb-1">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={newSchedule[f.key]} onChange={e => setNewSchedule(s => ({ ...s, [f.key]: e.target.value }))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500" />
                </div>
              ))}
              {[
                { label: 'Model', key: 'model', options: MODELS },
                { label: 'Category', key: 'category', options: CATEGORIES },
                { label: 'Interval', key: 'interval', options: INTERVALS },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm text-gray-400 mb-1">{f.label}</label>
                  <select value={newSchedule[f.key]} onChange={e => setNewSchedule(s => ({ ...s, [f.key]: e.target.value }))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Time</label>
                <input type="time" value={newSchedule.time} onChange={e => setNewSchedule(s => ({ ...s, time: e.target.value }))}
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={addSchedule} className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition text-white">Create</button>
              <button onClick={() => setShowScheduleModal(false)} className="flex-1 py-3 bg-[#2D2257] rounded-xl font-semibold text-gray-300 hover:bg-[#39306A] transition">Cancel</button>
            </div>
          </Card>
        </div>
      )}

      {/* Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-5 text-white">New Alert Configuration</h3>
            <div className="space-y-4">
              {[{ label: 'Alert Name', key: 'name', placeholder: 'e.g. Low Accuracy Alert' }].map(f => (
                <div key={f.key}>
                  <label className="block text-sm text-gray-400 mb-1">{f.label}</label>
                  <input type="text" placeholder={f.placeholder} value={newAlert[f.key]} onChange={e => setNewAlert(a => ({ ...a, [f.key]: e.target.value }))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500" />
                </div>
              ))}
              {[
                { label: 'Alert Type', key: 'type', options: ['Accuracy', 'RMSE', 'MAE', 'Demand Spike', 'Stock Level'] },
                { label: 'Condition', key: 'condition', options: ['below', 'above'] },
                { label: 'Channel', key: 'channel', options: ['in-app', 'email', 'both'] },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm text-gray-400 mb-1">{f.label}</label>
                  <select value={newAlert[f.key]} onChange={e => setNewAlert(a => ({ ...a, [f.key]: e.target.value }))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Threshold</label>
                <input type="text" placeholder="e.g. 85 or 5000" value={newAlert.threshold} onChange={e => setNewAlert(a => ({ ...a, threshold: e.target.value }))}
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={addAlert} className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition text-white">Create</button>
              <button onClick={() => setShowAlertModal(false)} className="flex-1 py-3 bg-[#2D2257] rounded-xl font-semibold text-gray-300 hover:bg-[#39306A] transition">Cancel</button>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  )
}
