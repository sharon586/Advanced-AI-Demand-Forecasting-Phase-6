import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const systemStats = {
  total_users: 8,
  active_users: 6,
  total_datasets: 12,
  total_forecasts: 48,
  total_reports: 15,
  api_calls_today: 247,
  storage_used: 2.4,
  storage_total: 50,
  uptime: '99.8%',
  error_rate: 0.8,
}

const users = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Admin', status: true, created: '2025-01-01', forecasts: 18, datasets: 5 },
  { id: 2, name: 'Analyst User', email: 'analyst@example.com', role: 'Analyst', status: true, created: '2025-02-15', forecasts: 14, datasets: 4 },
  { id: 3, name: 'Manager User', email: 'manager@example.com', role: 'Manager', status: true, created: '2025-03-10', forecasts: 10, datasets: 2 },
  { id: 4, name: 'Sneha R', email: 'sneha@example.com', role: 'Analyst', status: false, created: '2025-04-20', forecasts: 6, datasets: 1 },
]

const modelUsage = [
  { model: 'Linear Regression', count: 18, color: '#3B82F6' },
  { model: 'Random Forest', count: 14, color: '#7C3AED' },
  { model: 'XGBoost', count: 10, color: '#EC4899' },
  { model: 'ARIMA', count: 6, color: '#10B981' },
]

const apiCallsData = [
  { day: 'Mon', calls: 220 }, { day: 'Tue', calls: 180 }, { day: 'Wed', calls: 260 },
  { day: 'Thu', calls: 247 }, { day: 'Fri', calls: 310 }, { day: 'Sat', calls: 150 }, { day: 'Sun', calls: 190 },
]

const recentActivity = [
  { user: 'admin@example.com', action: 'Forecast generated', detail: 'Random Forest', time: '5 min ago', type: 'forecast' },
  { user: 'analyst@example.com', action: 'Dataset uploaded', detail: 'sales_q4.csv', time: '20 min ago', type: 'upload' },
  { user: 'manager@example.com', action: 'Report exported', detail: 'Annual PDF', time: '1 hour ago', type: 'report' },
  { user: 'sneha@example.com', action: 'Login attempt', detail: 'Account inactive', time: '2 hours ago', type: 'error' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userList, setUserList] = useState(users)
  const [searchUser, setSearchUser] = useState('')

  const toggleUser = (id) => {
    setUserList(prev => prev.map(u => u.id === id ? { ...u, status: !u.status } : u))
  }

  const deleteUser = (id) => {
    if (window.confirm('Delete this user?')) {
      setUserList(prev => prev.filter(u => u.id !== id))
    }
  }

  const filteredUsers = userList.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  )

  return (
    <Layout title="Admin Dashboard">
      <p className="text-gray-400 mb-6">System management and monitoring panel</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {['overview', 'users', 'analytics'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition capitalize ${
              activeTab === tab ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white' : 'text-gray-400 hover:text-white'
            }`}>
            {tab === 'overview' ? '🏠 Overview' : tab === 'users' ? '👥 Users' : '📊 Analytics'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* System KPIs */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Users', value: systemStats.total_users, sub: `${systemStats.active_users} active`, icon: '👥', color: 'text-violet-400' },
              { label: 'Total Datasets', value: systemStats.total_datasets, sub: 'Uploaded files', icon: '📊', color: 'text-blue-400' },
              { label: 'API Calls Today', value: systemStats.api_calls_today, sub: 'Total requests', icon: '⚡', color: 'text-yellow-400' },
              { label: 'System Uptime', value: systemStats.uptime, sub: `${systemStats.error_rate}% error rate`, icon: '🟢', color: 'text-green-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-[#211A45] rounded-2xl p-5 border border-[#39306A]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
                <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
              <h3 className="font-semibold mb-5">Daily API Calls (This Week)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={apiCallsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#39306A" />
                  <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
                  <Bar dataKey="calls" fill="#7C3AED" radius={[6, 6, 0, 0]} name="API Calls" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
              <h3 className="font-semibold mb-5">Model Usage Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={modelUsage} dataKey="count" nameKey="model" cx="50%" cy="50%" outerRadius={80}
                    label={({ model, percent }) => `${model.split(' ')[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {modelUsage.map((m, i) => <Cell key={i} fill={m.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Storage */}
          <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A] mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Storage Usage</h3>
              <span className="text-sm text-gray-400">{systemStats.storage_used} GB / {systemStats.storage_total} GB</span>
            </div>
            <div className="w-full bg-[#312B56] rounded-full h-3">
              <div className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                style={{ width: `${(systemStats.storage_used / systemStats.storage_total) * 100}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">{((systemStats.storage_used / systemStats.storage_total) * 100).toFixed(1)}% used</p>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#2D2257] transition">
                  <span className="text-xl">{a.type === 'forecast' ? '📈' : a.type === 'upload' ? '📤' : a.type === 'report' ? '📄' : '⚠️'}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{a.action}: {a.detail}</p>
                    <p className="text-xs text-gray-400">{a.user}</p>
                  </div>
                  <p className="text-xs text-gray-500">{a.time}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold">User Management</h3>
            <input
              placeholder="🔍 Search users..."
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
              className="bg-[#2D2257] text-white text-sm px-4 py-2 rounded-lg border border-[#39306A] outline-none w-52"
            />
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#39306A]">
                {['User', 'Role', 'Forecasts', 'Datasets', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left pb-3 px-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, i) => (
                <tr key={i} className="border-b border-[#312B56] hover:bg-[#2D2257] transition">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-white">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      u.role === 'Admin' ? 'bg-violet-900/40 text-violet-400' :
                      u.role === 'Manager' ? 'bg-blue-900/40 text-blue-400' :
                      'bg-gray-900/40 text-gray-400'
                    }`}>{u.role}</span>
                  </td>
                  <td className="py-3 px-2 text-gray-300">{u.forecasts}</td>
                  <td className="py-3 px-2 text-gray-300">{u.datasets}</td>
                  <td className="py-3 px-2 text-gray-400">{u.created}</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.status ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                      {u.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <button onClick={() => toggleUser(u.id)}
                        className={`text-xs px-2 py-1 rounded transition ${u.status ? 'text-yellow-400 hover:bg-yellow-900/20' : 'text-green-400 hover:bg-green-900/20'}`}>
                        {u.status ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => deleteUser(u.id)}
                        className="text-xs px-2 py-1 rounded text-red-400 hover:bg-red-900/20 transition">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-5">
            {[
              { label: 'Forecast Accuracy', value: '96.2%', change: '+1.4%', icon: '🎯' },
              { label: 'Avg Response Time', value: '245ms', change: '-12ms', icon: '⚡' },
              { label: 'Reports Generated', value: systemStats.total_reports, change: '+3 this week', icon: '📄' },
            ].map((s, i) => (
              <div key={i} className="bg-[#211A45] rounded-2xl p-5 border border-[#39306A]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{s.icon}</span>
                  <p className="text-sm text-gray-400">{s.label}</p>
                </div>
                <h3 className="text-2xl font-bold text-white">{s.value}</h3>
                <p className="text-xs text-green-400 mt-1">{s.change}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
            <h3 className="font-semibold mb-5">Model Performance Over Time</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={[
                { month: 'Jan', lr: 88, rf: 93, xgb: 91, arima: 85 },
                { month: 'Feb', lr: 89, rf: 94, xgb: 92, arima: 86 },
                { month: 'Mar', lr: 90, rf: 95, xgb: 93, arima: 87 },
                { month: 'Apr', lr: 91, rf: 96, xgb: 94, arima: 88 },
                { month: 'May', lr: 91, rf: 96, xgb: 95, arima: 88 },
                { month: 'Jun', lr: 91, rf: 97, xgb: 95, arima: 89 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#39306A" />
                <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" domain={[80, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#211A45', border: '1px solid #39306A', borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="lr" stroke="#3B82F6" strokeWidth={2} name="Linear Regression" />
                <Line type="monotone" dataKey="rf" stroke="#7C3AED" strokeWidth={2} name="Random Forest" />
                <Line type="monotone" dataKey="xgb" stroke="#EC4899" strokeWidth={2} name="XGBoost" />
                <Line type="monotone" dataKey="arima" stroke="#10B981" strokeWidth={2} name="ARIMA" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Phase 4 — Quick Links to New Modules */}
      <div className="mt-6 bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
        <h2 className="text-lg font-bold mb-4">⚡ Phase 4 — New Modules</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { to: '/automation', label: 'Smart Automation', icon: '🗓️', desc: 'Schedules & alerts', color: 'from-violet-600 to-purple-700' },
            { to: '/integrations', label: 'Integrations', icon: '🔌', desc: 'ERP & webhooks', color: 'from-blue-600 to-cyan-700' },
            { to: '/ai-features', label: 'AI Features', icon: '🧠', desc: 'Recommendations & spikes', color: 'from-pink-600 to-rose-700' },
            { to: '/forecast-comparison', label: 'Model Comparison', icon: '⚖️', desc: 'Compare & insights', color: 'from-green-600 to-emerald-700' },
            { to: '/user-management', label: 'User Management', icon: '👥', desc: 'Profiles & activity', color: 'from-orange-600 to-amber-700' },
          ].map((item, i) => (
            <a key={i} href={item.to} className={"block p-4 rounded-xl bg-gradient-to-br " + item.color + " hover:opacity-90 transition text-center"}>
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="font-semibold text-white text-sm">{item.label}</p>
              <p className="text-xs text-white/70 mt-0.5">{item.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </Layout>
  )
}
