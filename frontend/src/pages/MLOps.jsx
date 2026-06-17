import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const MODELS = [
  { name: 'Random Forest', accuracy: 96.8, trained: '2 days ago', status: 'healthy', data: 8420, color: '#7C3AED' },
  { name: 'XGBoost', accuracy: 95.4, trained: '4 days ago', status: 'healthy', data: 8420, color: '#EC4899' },
  { name: 'Linear Regression', accuracy: 91.2, trained: '7 days ago', status: 'healthy', data: 8420, color: '#3B82F6' },
  { name: 'ARIMA', accuracy: 88.6, trained: '7 days ago', status: 'stale', data: 8420, color: '#F59E0B' },
]

const HISTORY = [
  { id: 1, model: 'Random Forest', trigger: 'scheduled', before: 94.2, after: 96.8, duration: '42s', status: 'completed', date: '2 days ago' },
  { id: 2, model: 'XGBoost', trigger: 'new_data', before: 93.1, after: 95.4, duration: '38s', status: 'completed', date: '4 days ago' },
  { id: 3, model: 'Linear Regression', trigger: 'manual', before: 89.8, after: 91.2, duration: '12s', status: 'completed', date: '7 days ago' },
]

const ACCURACY_TREND = [
  { month: 'Jan', rf: 88, xgb: 87, lr: 85, arima: 83 },
  { month: 'Feb', rf: 90, xgb: 89, lr: 86, arima: 84 },
  { month: 'Mar', rf: 92, xgb: 91, lr: 88, arima: 85 },
  { month: 'Apr', rf: 94, xgb: 93, lr: 89, arima: 86 },
  { month: 'May', rf: 95, xgb: 94, lr: 90, arima: 87 },
  { month: 'Jun', rf: 97, xgb: 95, lr: 91, arima: 89 },
]

export default function MLOps() {
  const [retraining, setRetraining] = useState(null)
  const [history, setHistory] = useState(HISTORY)
  const [autoRetrain, setAutoRetrain] = useState(true)

  const triggerRetrain = (model) => {
    setRetraining(model)
    setTimeout(() => {
      const newAccuracy = (parseFloat(MODELS.find(m=>m.name===model)?.accuracy||95) + Math.random()*1.5).toFixed(1)
      setHistory(prev => [{
        id: prev.length + 1, model, trigger: 'manual',
        before: MODELS.find(m=>m.name===model)?.accuracy, after: parseFloat(newAccuracy),
        duration: `${Math.round(15+Math.random()*40)}s`, status: 'completed', date: 'just now'
      }, ...prev])
      setRetraining(null)
    }, 2500)
  }

  return (
    <Layout title="ML Operations">
      <p className="text-gray-400 mb-6">Model retraining, ensemble forecasting and performance management</p>

      {/* Model Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {MODELS.map((m, i) => (
          <div key={i} className="bg-[#211A45] rounded-2xl p-5 border border-[#39306A]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white text-sm">{m.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${m.status==='healthy'?'bg-green-900/30 text-green-400':'bg-yellow-900/30 text-yellow-400'}`}>
                {m.status}
              </span>
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color: m.color }}>{m.accuracy}%</p>
            <p className="text-xs text-gray-500 mb-3">accuracy · {m.data.toLocaleString()} data points</p>
            <p className="text-xs text-gray-400 mb-3">Last trained: {m.trained}</p>
            <button onClick={() => triggerRetrain(m.name)} disabled={retraining === m.name}
              className={`w-full py-2 rounded-xl text-xs font-semibold transition ${retraining===m.name?'bg-violet-900/30 text-violet-400':'bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90'}`}>
              {retraining === m.name ? '⏳ Retraining...' : '🔄 Retrain'}
            </button>
          </div>
        ))}
      </div>

      {/* Auto-retrain toggle */}
      <div className="bg-[#211A45] rounded-2xl p-5 border border-[#39306A] mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">Automated Model Retraining</h3>
          <p className="text-sm text-gray-400 mt-0.5">Schedule: Weekly on Sunday 02:00 UTC · Next: 5 days</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{autoRetrain ? 'Enabled' : 'Disabled'}</span>
          <button onClick={() => setAutoRetrain(a => !a)}
            className={`relative w-14 h-7 rounded-full transition ${autoRetrain ? 'bg-violet-500' : 'bg-[#39306A]'}`}>
            <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${autoRetrain ? 'left-8' : 'left-1'}`} />
          </button>
        </div>
      </div>

      {/* Accuracy Trend + Ensemble */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
          <h3 className="font-semibold mb-5">Model Accuracy Trend</h3>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={ACCURACY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#39306A" />
              <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9CA3AF" domain={[80, 100]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
              <Legend />
              <Line type="monotone" dataKey="rf" stroke="#7C3AED" strokeWidth={2} name="Random Forest" dot={false} />
              <Line type="monotone" dataKey="xgb" stroke="#EC4899" strokeWidth={2} name="XGBoost" dot={false} />
              <Line type="monotone" dataKey="lr" stroke="#3B82F6" strokeWidth={2} name="Linear Reg" dot={false} />
              <Line type="monotone" dataKey="arima" stroke="#F59E0B" strokeWidth={2} name="ARIMA" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Ensemble Forecast</h3>
            <span className="text-xs bg-violet-900/40 text-violet-400 px-2 py-0.5 rounded-full border border-violet-700/40">Best Accuracy</span>
          </div>
          <div className="text-center py-4">
            <p className="text-5xl font-bold text-white mb-1">98.2%</p>
            <p className="text-sm text-gray-400">Combined Model Accuracy</p>
            <p className="text-xs text-gray-500 mt-1">+1.4% vs best single model</p>
          </div>
          <div className="space-y-2 mt-4">
            {[
              { model: 'Random Forest', weight: '40%', acc: 96.8, color: '#7C3AED' },
              { model: 'XGBoost', weight: '35%', acc: 95.4, color: '#EC4899' },
              { model: 'Linear Regression', weight: '15%', acc: 91.2, color: '#3B82F6' },
              { model: 'ARIMA', weight: '10%', acc: 88.6, color: '#F59E0B' },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: m.color }} />
                <span className="text-xs text-gray-400 flex-1">{m.model}</span>
                <span className="text-xs text-gray-400">{m.weight} weight</span>
                <span className="text-xs font-semibold" style={{ color: m.color }}>{m.acc}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Retrain History */}
      <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
        <h3 className="font-semibold mb-4">Retraining History</h3>
        <table className="w-full text-sm">
          <thead><tr className="text-gray-400 border-b border-[#39306A]">
            {['#','Model','Trigger','Before','After','Improvement','Duration','Status','Date'].map(h=>(
              <th key={h} className="text-left pb-3 px-2 font-medium">{h}</th>
            ))}
          </tr></thead>
          <tbody>{history.map((h, i) => (
            <tr key={i} className="border-b border-[#312B56] hover:bg-[#2D2257] transition">
              <td className="py-3 px-2 text-gray-600">#{h.id}</td>
              <td className="py-3 px-2 text-violet-300 font-medium">{h.model}</td>
              <td className="py-3 px-2"><span className="text-xs px-2 py-0.5 rounded-full bg-[#312B56] text-gray-400">{h.trigger}</span></td>
              <td className="py-3 px-2 text-gray-400">{h.before}%</td>
              <td className="py-3 px-2 text-green-400 font-semibold">{h.after}%</td>
              <td className="py-3 px-2 text-green-400">+{(h.after - h.before).toFixed(1)}%</td>
              <td className="py-3 px-2 text-gray-400">{h.duration}</td>
              <td className="py-3 px-2"><span className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-400">{h.status}</span></td>
              <td className="py-3 px-2 text-gray-500">{h.date}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </Layout>
  )
}
