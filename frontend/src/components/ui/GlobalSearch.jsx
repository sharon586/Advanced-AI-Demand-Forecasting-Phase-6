import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const MOCK_RESULTS = [
  { type: 'forecast', title: 'Random Forest — Electronics/North', url: '/forecast', icon: '📈', meta: '96.8% accuracy' },
  { type: 'forecast', title: 'XGBoost — Fashion/South', url: '/forecast', icon: '📈', meta: '95.4% accuracy' },
  { type: 'report', title: 'Q1 Sales Report', url: '/reports', icon: '📄', meta: 'Sales · 2025-04-01' },
  { type: 'report', title: 'Annual Revenue Insights', url: '/reports', icon: '📄', meta: 'Revenue · 2026-01-05' },
  { type: 'dataset', title: 'sales_q1_2025.csv', url: '/upload', icon: '📊', meta: '1,240 rows · Electronics' },
  { type: 'dataset', title: 'electronics_demand.csv', url: '/upload', icon: '📊', meta: '860 rows · Electronics' },
  { type: 'page', title: 'Dashboard', url: '/dashboard', icon: '🏠', meta: 'Page' },
  { type: 'page', title: 'Admin Dashboard', url: '/admin', icon: '🛡️', meta: 'Admin' },
  { type: 'page', title: 'Real-Time Monitor', url: '/realtime', icon: '⚡', meta: 'Live Data' },
  { type: 'page', title: 'Role Management', url: '/roles', icon: '🔐', meta: 'Access Control' },
  { type: 'page', title: 'System Monitor', url: '/system', icon: '🖥️', meta: 'Monitoring' },
  { type: 'page', title: 'Advanced Analytics', url: '/analytics', icon: '🔬', meta: 'Analytics' },
]

const typeColors = {
  forecast: 'text-violet-400 bg-violet-900/30',
  report: 'text-blue-400 bg-blue-900/30',
  dataset: 'text-green-400 bg-green-900/30',
  page: 'text-gray-400 bg-gray-900/30',
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setOpen(o => !o) }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50) }, [open])

  useEffect(() => {
    if (!query.trim()) { setResults(MOCK_RESULTS.slice(0, 6)); return }
    const q = query.toLowerCase()
    setResults(MOCK_RESULTS.filter(r =>
      r.title.toLowerCase().includes(q) || r.type.includes(q) || r.meta.toLowerCase().includes(q)
    ).slice(0, 8))
    setSelected(0)
  }, [query])

  const go = (url) => { navigate(url); setOpen(false); setQuery('') }

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') setSelected(s => Math.min(s+1, results.length-1))
    if (e.key === 'ArrowUp') setSelected(s => Math.max(s-1, 0))
    if (e.key === 'Enter' && results[selected]) go(results[selected].url)
  }

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#241B4B] border border-[#39306A] text-gray-400 hover:text-white hover:border-violet-500 transition text-sm w-52">
      <span>🔍</span><span className="flex-1 text-left">Search...</span>
      <span className="text-xs bg-[#312B56] px-1.5 py-0.5 rounded">⌘K</span>
    </button>
  )

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-xl bg-[#1B1538] rounded-2xl border border-[#39306A] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#39306A]">
          <span className="text-gray-400">🔍</span>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKey}
            placeholder="Search forecasts, reports, datasets, pages..."
            className="flex-1 bg-transparent text-white outline-none placeholder-gray-500 text-base" />
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white text-xs px-2 py-1 rounded border border-[#39306A]">Esc</button>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <p className="text-center text-gray-500 py-8 text-sm">No results for "{query}"</p>
          ) : results.map((r, i) => (
            <button key={i} onClick={() => go(r.url)} onMouseEnter={() => setSelected(i)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left transition ${selected===i?'bg-[#312B56]':'hover:bg-[#241B4B]'}`}>
              <span className="text-xl">{r.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{r.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{r.meta}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${typeColors[r.type]||typeColors.page}`}>{r.type}</span>
            </button>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-[#39306A] flex items-center gap-4 text-xs text-gray-600">
          <span>↑↓ navigate</span><span>↵ select</span><span>Esc close</span>
        </div>
      </div>
    </div>
  )
}
