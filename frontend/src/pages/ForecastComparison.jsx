import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'

const MODELS = ['Linear Regression', 'Random Forest', 'XGBoost', 'ARIMA']
const MODEL_COLORS = { 'Linear Regression': '#3B82F6', 'Random Forest': '#10B981', 'XGBoost': '#7C3AED', 'ARIMA': '#EC4899' }

const modelData = [
  { model: 'XGBoost', accuracy: 97.1, mae: 1240, rmse: 1880, r2_score: 0.971, mape: 3.2, training_time_ms: 320, is_recommended: true },
  { model: 'Random Forest', accuracy: 95.2, mae: 1580, rmse: 2340, r2_score: 0.952, mape: 4.8, training_time_ms: 580, is_recommended: false },
  { model: 'ARIMA', accuracy: 91.4, mae: 2150, rmse: 3100, r2_score: 0.914, mape: 8.6, training_time_ms: 120, is_recommended: false },
  { model: 'Linear Regression', accuracy: 88.5, mae: 2840, rmse: 4200, r2_score: 0.885, mape: 11.5, training_time_ms: 85, is_recommended: false },
]

const trendData = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'].map((month, i) => ({
  month,
  'XGBoost': 95 + Math.random()*4,
  'Random Forest': 92 + Math.random()*5,
  'ARIMA': 88 + Math.random()*6,
  'Linear Regression': 85 + Math.random()*7,
}))

const confidenceData = modelData.map(m => ({
  model: m.model,
  low: m.accuracy - (Math.random()*6+2),
  score: m.accuracy,
  high: Math.min(100, m.accuracy + (Math.random()*3+1)),
}))

const historicalComparisons = [
  { date: '2025-11-25', best: 'XGBoost', bestAcc: 97.4, category: 'Electronics' },
  { date: '2025-11-18', best: 'XGBoost', bestAcc: 96.8, category: 'All' },
  { date: '2025-11-11', best: 'Random Forest', bestAcc: 95.9, category: 'Fashion' },
  { date: '2025-11-04', best: 'XGBoost', bestAcc: 97.1, category: 'Groceries' },
  { date: '2025-10-28', best: 'ARIMA', bestAcc: 93.2, category: 'Fashion' },
]

const recommendations = [
  { title: 'Switch to XGBoost for Electronics', impact: 'high', description: 'XGBoost outperforms current Linear Regression by 8.6% on Electronics.', potential_savings: 28500, confidence: 94.2, action: 'Switch Model' },
  { title: 'Enable ensemble forecasting', impact: 'high', description: 'Combining Random Forest + XGBoost reduces RMSE by 23%.', potential_savings: 41000, confidence: 91.5, action: 'Enable Feature' },
  { title: 'Increase forecast horizon for Fashion', impact: 'medium', description: 'Extending from 3 to 6 months improves seasonal planning by 12%.', potential_savings: 15200, confidence: 87.8, action: 'Adjust Settings' },
  { title: 'Retrain ARIMA with recent data', impact: 'low', description: 'Model last trained 45 days ago. Retraining improves accuracy by ~3%.', potential_savings: 4800, confidence: 78.3, action: 'Retrain Model' },
]

const Card = ({ children, className = '' }) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>

export default function ForecastComparison() {
  const [tab, setTab] = useState('models')
  const [category, setCategory] = useState('All')
  const [selectedModels, setSelectedModels] = useState(MODELS)

  const toggleModel = (m) => setSelectedModels(s => s.includes(m) ? s.filter(x => x !== m) : [...s, m])

  const tabs = [
    { key: 'models', label: '📊 Model Comparison' },
    { key: 'trends', label: '📈 Accuracy Trends' },
    { key: 'confidence', label: '🎯 Confidence Scores' },
    { key: 'historical', label: '🗂️ Historical' },
    { key: 'insights', label: '💡 Insights' },
  ]

  const radarData = modelData.map(m => ({
    model: m.model,
    Accuracy: m.accuracy,
    Speed: Math.round(100 - (m.training_time_ms / 12)),
    R2: Math.round(m.r2_score * 100),
    LowError: Math.round(100 - m.mape * 3),
  }))

  const radarKeys = ['Accuracy', 'Speed', 'R2', 'LowError']
  const radarChartData = ['Accuracy', 'Speed', 'R2', 'LowError'].map(key => {
    const obj = { metric: key }
    modelData.forEach(m => { obj[m.model] = radarData.find(r => r.model === m.model)?.[key] })
    return obj
  })

  return (
    <Layout title="Forecast Comparison & Insights">
      <p className="text-gray-400 mb-6">Compare model performance, accuracy trends, and get AI-driven business recommendations</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-[#1B1538] rounded-2xl border border-[#312B56]">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">🏷️ Category:</span>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="bg-[#241B4B] text-white text-sm px-3 py-2 rounded-lg border border-[#39306A] outline-none">
            {['All','Electronics','Fashion','Groceries','Furniture'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-400 text-sm">🤖 Models:</span>
          {MODELS.map(m => (
            <button key={m} onClick={() => toggleModel(m)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${selectedModels.includes(m) ? 'text-white' : 'bg-[#2D2257] text-gray-400'}`}
              style={selectedModels.includes(m) ? { background: MODEL_COLORS[m] } : {}}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Best model banner */}
      <Card className="p-4 mb-6 border-violet-500/50 bg-gradient-to-r from-violet-900/20 to-pink-900/20">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="font-semibold text-white">Best performing model: <span className="text-violet-400">XGBoost</span></p>
            <p className="text-sm text-gray-400">97.1% accuracy · Lowest RMSE · Recommended for production</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56]">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.key ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Model Comparison */}
      {tab === 'models' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4 mb-2">
            {modelData.filter(m => selectedModels.includes(m.model)).map((m, i) => (
              <Card key={i} className={`p-5 ${m.is_recommended ? 'border-violet-500/60' : ''}`}>
                {m.is_recommended && <div className="text-xs text-violet-400 font-semibold mb-2">⭐ RECOMMENDED</div>}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: MODEL_COLORS[m.model] }} />
                  <p className="font-semibold text-white text-sm">{m.model}</p>
                </div>
                <p className="text-3xl font-bold text-white">{m.accuracy}%</p>
                <p className="text-xs text-gray-400 mb-3">Accuracy</p>
                <div className="space-y-1 text-xs">
                  {[['MAE', m.mae.toLocaleString()], ['RMSE', m.rmse.toLocaleString()], ['R²', m.r2_score], ['MAPE', `${m.mape}%`], ['Train Time', `${m.training_time_ms}ms`]].map(([k, v]) => (
                    <div key={k} className="flex justify-between"><span className="text-gray-400">{k}</span><span className="text-white font-medium">{v}</span></div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          {/* Bar comparison */}
          <Card className="p-5">
            <h4 className="text-sm font-semibold text-gray-300 mb-4">Accuracy Comparison</h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={modelData.filter(m => selectedModels.includes(m.model))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#312B56" />
                <XAxis dataKey="model" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis domain={[80, 100]} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
                <Bar dataKey="accuracy" fill="#7C3AED" radius={[6, 6, 0, 0]} name="Accuracy %" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Accuracy Trends */}
      {tab === 'trends' && (
        <Card className="p-6">
          <h4 className="text-sm font-semibold text-gray-300 mb-4">Model Accuracy Trends Over Time</h4>
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#312B56" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis domain={[80, 100]} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} formatter={v => `${v.toFixed(1)}%`} />
              <Legend />
              {selectedModels.map(m => (
                <Line key={m} type="monotone" dataKey={m} stroke={MODEL_COLORS[m]} strokeWidth={2.5} dot={{ r: 3 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Confidence Scores */}
      {tab === 'confidence' && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white mb-2">Prediction Confidence Scores</h3>
          {confidenceData.filter(c => selectedModels.includes(c.model)).map((c, i) => (
            <Card key={i} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-10 rounded-full" style={{ background: MODEL_COLORS[c.model] }} />
                  <div>
                    <p className="font-semibold text-white">{c.model}</p>
                    <p className="text-sm text-gray-400">Confidence interval: {c.low.toFixed(1)}% — {c.high.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48">
                    <div className="flex justify-between text-xs text-gray-400 mb-1"><span>{c.low.toFixed(1)}%</span><span>{c.high.toFixed(1)}%</span></div>
                    <div className="h-3 bg-[#2D2257] rounded-full overflow-hidden">
                      <div className="h-3 rounded-full" style={{ width: `${c.score}%`, background: MODEL_COLORS[c.model], opacity: 0.8 }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{c.score.toFixed(1)}%</div>
                    <div className="text-xs text-gray-400">confidence</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Historical */}
      {tab === 'historical' && (
        <Card>
          <div className="p-5 border-b border-[#39306A]">
            <h4 className="font-semibold text-white">Historical Forecast Comparison Log</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#39306A] text-gray-400 text-left">
                {['Date', 'Best Model', 'Accuracy', 'Category', 'Models Compared'].map(h => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
              </tr></thead>
              <tbody>
                {historicalComparisons.map((r, i) => (
                  <tr key={i} className="border-b border-[#2D2257] hover:bg-[#2D2257]/50 transition">
                    <td className="px-5 py-4 text-gray-300">{r.date}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: MODEL_COLORS[r.best] }} />
                        <span className="text-white font-medium">{r.best}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-green-400 font-semibold">{r.bestAcc}%</td>
                    <td className="px-5 py-4 text-gray-300">{r.category}</td>
                    <td className="px-5 py-4 text-violet-400">{MODELS.length} models</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Insights & Recommendations */}
      {tab === 'insights' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">AI Business Recommendations</h3>
            <div className="text-sm text-gray-400">Total savings potential: <span className="text-green-400 font-bold">${recommendations.reduce((a,b)=>a+b.potential_savings,0).toLocaleString()}</span></div>
          </div>
          <div className="space-y-3">
            {recommendations.map((r, i) => (
              <Card key={i} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mt-0.5 ${r.impact==='high'?'bg-violet-900/40':r.impact==='medium'?'bg-blue-900/40':'bg-gray-800'}`}>
                      {r.impact==='high'?'⚡':r.impact==='medium'?'📊':'💡'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white">{r.title}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.impact==='high'?'bg-violet-900/40 text-violet-400':r.impact==='medium'?'bg-blue-900/40 text-blue-400':'bg-gray-800 text-gray-400'}`}>{r.impact} impact</span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{r.description}</p>
                      <p className="text-xs text-gray-400 mt-1">Confidence: {r.confidence}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-400">+${r.potential_savings.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">potential savings</div>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-sm font-semibold hover:opacity-90 transition text-white whitespace-nowrap">
                      {r.action}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Layout>
  )
}
