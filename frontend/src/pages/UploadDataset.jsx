import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { useNotifications } from '../context/NotificationContext'

const CATEGORIES = ['General', 'Electronics', 'Fashion', 'Groceries', 'Furniture', 'Sports']
const REGIONS = ['All', 'North', 'South', 'East', 'West']

const uploadedDatasets = [
  { id: 1, name: 'sales_q1_2025.csv', rows: 1240, cols: 8, size: '48 KB', category: 'All', region: 'North', date: '2025-04-01', status: 'active' },
  { id: 2, name: 'electronics_demand.csv', rows: 860, cols: 6, size: '32 KB', category: 'Electronics', region: 'South', date: '2025-05-10', status: 'active' },
  { id: 3, name: 'fashion_trends.csv', rows: 540, cols: 5, size: '21 KB', category: 'Fashion', region: 'East', date: '2025-06-15', status: 'active' },
]

export default function UploadDataset() {
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState('General')
  const [region, setRegion] = useState('All')
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [datasets, setDatasets] = useState(uploadedDatasets)
  const [dragging, setDragging] = useState(false)
  const { addNotification } = useNotifications()

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      addNotification({ title: 'Upload Failed', message: `${file.name} is not a CSV file. Only CSV files are allowed.`, type: 'error' })
      return
    }

    setUploading(true)
    // Simulate upload
    await new Promise(r => setTimeout(r, 1500))
    setUploading(false)
    setUploadSuccess(true)

    const newDataset = {
      id: datasets.length + 1,
      name: file.name,
      rows: Math.floor(Math.random() * 1500) + 200,
      cols: Math.floor(Math.random() * 8) + 4,
      size: `${(file.size / 1024).toFixed(0)} KB`,
      category,
      region,
      date: new Date().toISOString().split('T')[0],
      status: 'active'
    }
    setDatasets(prev => [newDataset, ...prev])
    addNotification({ title: 'Dataset Uploaded', message: `${file.name} uploaded successfully. ${newDataset.rows} rows processed.`, type: 'success' })

    setTimeout(() => { setUploadSuccess(false); setFile(null) }, 3000)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  const deleteDataset = (id) => {
    setDatasets(prev => prev.filter(d => d.id !== id))
  }

  return (
    <Layout title="Upload Dataset">
      <p className="text-gray-400 mb-6">Upload CSV datasets for AI demand forecasting analysis</p>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Upload Form */}
        <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
          <h3 className="text-lg font-semibold mb-5">Upload New Dataset</h3>

          <form onSubmit={handleUpload} className="space-y-4">
            {/* Drop Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer ${
                dragging ? 'border-violet-500 bg-violet-900/20' :
                file ? 'border-green-500 bg-green-900/10' :
                'border-[#39306A] hover:border-violet-500'
              }`}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input id="fileInput" type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} className="hidden" />
              {file ? (
                <div>
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-sm text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null) }}
                    className="mt-2 text-xs text-red-400 hover:text-red-300">Remove</button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-white font-medium">Drop CSV file here</p>
                  <p className="text-sm text-gray-400 mt-1">or click to browse</p>
                  <p className="text-xs text-gray-500 mt-2">Only .csv files supported</p>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">Product Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Region</label>
              <select value={region} onChange={e => setRegion(e.target.value)}
                className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none">
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {uploading ? '⏳ Uploading...' : uploadSuccess ? '✅ Uploaded!' : '📤 Upload Dataset'}
            </button>
          </form>
        </div>

        {/* Upload Tips */}
        <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
          <h3 className="text-lg font-semibold mb-5">📋 Upload Guidelines</h3>
          <div className="space-y-4">
            {[
              { icon: '✅', title: 'CSV Format Required', desc: 'Only .csv files are accepted. Maximum file size: 50 MB.' },
              { icon: '📊', title: 'Required Columns', desc: 'Your CSV should include: date, product, sales, quantity. Optional: region, category, price.' },
              { icon: '🔢', title: 'Data Quality', desc: 'Ensure no empty rows or corrupted data. Use ISO date format (YYYY-MM-DD).' },
              { icon: '⚡', title: 'Processing Speed', desc: 'Files up to 10,000 rows process in under 5 seconds using optimized pandas pipeline.' },
            ].map((tip, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-[#2D2257]">
                <span className="text-xl mt-0.5">{tip.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white">{tip.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Datasets Table */}
      <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Uploaded Datasets</h2>
          <span className="text-sm text-gray-400">{datasets.length} datasets</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#39306A]">
                {['File Name', 'Rows', 'Columns', 'Size', 'Category', 'Region', 'Upload Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left pb-3 px-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datasets.map((d, i) => (
                <tr key={i} className="border-b border-[#312B56] hover:bg-[#2D2257] transition">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">📊</span>
                      <span className="text-white font-medium truncate max-w-[160px]">{d.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-violet-300">{d.rows.toLocaleString()}</td>
                  <td className="py-3 px-2 text-gray-300">{d.cols}</td>
                  <td className="py-3 px-2 text-gray-300">{d.size}</td>
                  <td className="py-3 px-2 text-gray-300">{d.category}</td>
                  <td className="py-3 px-2 text-gray-300">{d.region}</td>
                  <td className="py-3 px-2 text-gray-400">{d.date}</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${d.status === 'active' ? 'bg-green-900/40 text-green-400' : 'bg-gray-900/40 text-gray-400'}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <button onClick={() => deleteDataset(d.id)}
                      className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-900/20 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
