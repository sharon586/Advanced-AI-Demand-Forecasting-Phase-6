import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const reportData = [
  { id: 1, month: 'January', sales: 420000, forecast: 450000, growth: '8%', profit: 126000, category: 'All', region: 'North' },
  { id: 2, month: 'February', sales: 380000, forecast: 430000, growth: '13%', profit: 114000, category: 'All', region: 'South' },
  { id: 3, month: 'March', sales: 520000, forecast: 580000, growth: '11%', profit: 156000, category: 'Electronics', region: 'East' },
  { id: 4, month: 'April', sales: 610000, forecast: 670000, growth: '9%', profit: 183000, category: 'Fashion', region: 'West' },
  { id: 5, month: 'May', sales: 680000, forecast: 730000, growth: '7%', profit: 204000, category: 'All', region: 'North' },
  { id: 6, month: 'June', sales: 720000, forecast: 760000, growth: '5%', profit: 216000, category: 'Electronics', region: 'South' },
]

const savedReports = [
  { id: 1, title: 'Q1 Sales Report', type: 'Sales', date: '2025-04-01', accuracy: '94.5%', status: 'ready' },
  { id: 2, title: 'Electronics Forecast Q2', type: 'Forecast', date: '2025-07-01', accuracy: '96.8%', status: 'ready' },
  { id: 3, title: 'Annual Revenue Insights', type: 'Revenue', date: '2026-01-05', accuracy: '95.2%', status: 'ready' },
]

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Groceries', 'Furniture']
const REGIONS = ['All', 'North', 'South', 'East', 'West']

export default function Reports() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [region, setRegion] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)

  const filtered = reportData.filter(r => {
    if (category !== 'All' && r.category !== category && r.category !== 'All') return false
    if (region !== 'All' && r.region !== region) return false
    return true
  })

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.setTextColor(100, 50, 200)
    doc.text('AI Demand Forecast Report', 14, 20)
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Category: ${category} | Region: ${region} | Generated: ${new Date().toLocaleDateString()}`, 14, 30)
    doc.autoTable({
      startY: 40,
      head: [['Month', 'Sales (₹)', 'Forecast (₹)', 'Growth', 'Profit (₹)']],
      body: filtered.map(item => [item.month, item.sales.toLocaleString(), item.forecast.toLocaleString(), item.growth, item.profit.toLocaleString()]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [124, 58, 237] },
    })
    doc.save('AI_Forecast_Report.pdf')
  }

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filtered)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Forecast Report')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const fileData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
    saveAs(fileData, 'AI_Forecast_Report.xlsx')
  }

  const totalSales = filtered.reduce((a, b) => a + b.sales, 0)
  const totalProfit = filtered.reduce((a, b) => a + b.profit, 0)
  const avgGrowth = (filtered.reduce((a, b) => a + parseInt(b.growth), 0) / filtered.length).toFixed(1)

  return (
    <Layout title="Reports & Analytics">
      {/* Header with export buttons */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400">Manage and export forecasting analytics reports</p>
        <div className="flex gap-3">
          <button onClick={exportExcel}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-sm font-semibold hover:opacity-90 transition">
            📊 Export Excel
          </button>
          <button onClick={exportPDF}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-sm font-semibold hover:opacity-90 transition">
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-[#1B1538] rounded-2xl border border-[#312B56]">
        <input
          type="text"
          placeholder="🔍 Search reports..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#241B4B] text-white text-sm px-4 py-2 rounded-lg border border-[#39306A] outline-none w-48"
        />
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="bg-[#241B4B] text-white text-sm px-3 py-2 rounded-lg border border-[#39306A] outline-none">
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={region} onChange={e => setRegion(e.target.value)}
          className="bg-[#241B4B] text-white text-sm px-3 py-2 rounded-lg border border-[#39306A] outline-none">
          {REGIONS.map(r => <option key={r}>{r}</option>)}
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          className="bg-[#241B4B] text-white text-sm px-3 py-2 rounded-lg border border-[#39306A] outline-none" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          className="bg-[#241B4B] text-white text-sm px-3 py-2 rounded-lg border border-[#39306A] outline-none" />
        <button onClick={() => { setSearch(''); setCategory('All'); setRegion('All'); setDateFrom(''); setDateTo('') }}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#39306A] rounded-lg transition">Reset</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="bg-[#211A45] rounded-2xl p-5 border border-[#39306A]">
          <p className="text-sm text-gray-400 mb-1">Total Sales</p>
          <h3 className="text-3xl font-bold text-violet-400">₹{(totalSales / 100000).toFixed(1)}L</h3>
          <p className="text-xs text-gray-500 mt-1">{filtered.length} months</p>
        </div>
        <div className="bg-[#211A45] rounded-2xl p-5 border border-[#39306A]">
          <p className="text-sm text-gray-400 mb-1">Total Profit</p>
          <h3 className="text-3xl font-bold text-green-400">₹{(totalProfit / 100000).toFixed(1)}L</h3>
          <p className="text-xs text-gray-500 mt-1">30% margin avg</p>
        </div>
        <div className="bg-[#211A45] rounded-2xl p-5 border border-[#39306A]">
          <p className="text-sm text-gray-400 mb-1">Avg Growth</p>
          <h3 className="text-3xl font-bold text-pink-400">{avgGrowth}%</h3>
          <p className="text-xs text-gray-500 mt-1">Month over month</p>
        </div>
      </div>

      {/* Chart + Table */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
          <h2 className="text-lg font-bold mb-5">Monthly Sales vs Forecast</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={filtered}>
              <CartesianGrid strokeDasharray="3 3" stroke="#39306A" />
              <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={v => [`₹${v.toLocaleString()}`, '']} contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
              <Bar dataKey="sales" fill="#7C3AED" radius={[4, 4, 0, 0]} name="Sales" />
              <Bar dataKey="forecast" fill="#EC4899" radius={[4, 4, 0, 0]} name="Forecast" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
          <h2 className="text-lg font-bold mb-4">Saved Reports</h2>
          <div className="space-y-3">
            {savedReports.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#2D2257] hover:bg-[#39306A] cursor-pointer transition"
                onClick={() => setSelectedReport(r)}>
                <div className="w-9 h-9 rounded-lg bg-violet-900/50 flex items-center justify-center">
                  <span className="text-sm">📄</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{r.title}</p>
                  <p className="text-xs text-gray-400">{r.type} · {r.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-green-400">{r.accuracy}</span>
                  <div className="flex gap-1 mt-1 justify-end">
                    <button className="text-xs px-2 py-0.5 bg-blue-900/40 text-blue-400 rounded" onClick={(e) => { e.stopPropagation(); exportExcel() }}>XLS</button>
                    <button className="text-xs px-2 py-0.5 bg-violet-900/40 text-violet-400 rounded" onClick={(e) => { e.stopPropagation(); exportPDF() }}>PDF</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Detailed Forecasting Report</h2>
          <span className="text-sm text-gray-400">{filtered.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#39306A]">
                {['Month', 'Sales (₹)', 'Forecast (₹)', 'Growth', 'Profit (₹)', 'Category', 'Region'].map(h => (
                  <th key={h} className="text-left pb-3 px-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} className="border-b border-[#312B56] hover:bg-[#2D2257] transition">
                  <td className="py-3 px-3 font-medium text-white">{row.month}</td>
                  <td className="py-3 px-3 text-violet-300">₹{row.sales.toLocaleString()}</td>
                  <td className="py-3 px-3 text-pink-300">₹{row.forecast.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-green-900/40 text-green-400 text-xs">{row.growth}</span>
                  </td>
                  <td className="py-3 px-3 text-green-300">₹{row.profit.toLocaleString()}</td>
                  <td className="py-3 px-3 text-gray-300">{row.category}</td>
                  <td className="py-3 px-3 text-gray-300">{row.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setSelectedReport(null)}>
          <div className="bg-[#211A45] rounded-2xl p-8 w-full max-w-lg border border-[#39306A]" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{selectedReport.title}</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-[#312B56] pb-2">
                <span className="text-gray-400">Report Type</span>
                <span className="text-white">{selectedReport.type}</span>
              </div>
              <div className="flex justify-between border-b border-[#312B56] pb-2">
                <span className="text-gray-400">Date Generated</span>
                <span className="text-white">{selectedReport.date}</span>
              </div>
              <div className="flex justify-between border-b border-[#312B56] pb-2">
                <span className="text-gray-400">Forecast Accuracy</span>
                <span className="text-green-400 font-bold">{selectedReport.accuracy}</span>
              </div>
              <div className="flex justify-between border-b border-[#312B56] pb-2">
                <span className="text-gray-400">Status</span>
                <span className="px-2 py-0.5 rounded-full bg-green-900/40 text-green-400 text-xs">{selectedReport.status}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={exportExcel} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-sm font-semibold">Export Excel</button>
              <button onClick={exportPDF} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-sm font-semibold">Export PDF</button>
              <button onClick={() => setSelectedReport(null)} className="px-4 py-2.5 rounded-xl bg-[#2D2257] text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
