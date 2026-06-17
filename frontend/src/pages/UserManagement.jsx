import React, { useState } from 'react'
import Layout from '../components/layout/Layout'

const initialUsers = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Admin', is_active: true, department: 'Engineering', last_login: '2h ago', created_at: '90d ago', forecasts_run: 142, datasets_uploaded: 28, reports_generated: 56 },
  { id: 2, name: 'Analyst User', email: 'analyst@example.com', role: 'Analyst', is_active: true, department: 'Data Science', last_login: '1d ago', created_at: '60d ago', forecasts_run: 87, datasets_uploaded: 15, reports_generated: 23 },
  { id: 3, name: 'Manager User', email: 'manager@example.com', role: 'Manager', is_active: true, department: 'Operations', last_login: '8h ago', created_at: '45d ago', forecasts_run: 34, datasets_uploaded: 5, reports_generated: 41 },
  { id: 4, name: 'Viewer User', email: 'viewer@example.com', role: 'Viewer', is_active: false, department: 'Marketing', last_login: '14d ago', created_at: '30d ago', forecasts_run: 8, datasets_uploaded: 0, reports_generated: 12 },
]

const activityLog = [
  { id: 1, user: 'admin@example.com', action: 'Ran forecast', detail: 'Random Forest - Electronics', time: '2h ago', status: 'success' },
  { id: 2, user: 'analyst@example.com', action: 'Uploaded dataset', detail: 'sales_q4.csv (1,240 rows)', time: '5h ago', status: 'success' },
  { id: 3, user: 'manager@example.com', action: 'Generated report', detail: 'Monthly Summary PDF', time: '8h ago', status: 'success' },
  { id: 4, user: 'admin@example.com', action: 'Logged in', detail: 'From 192.168.1.10', time: '9h ago', status: 'success' },
  { id: 5, user: 'viewer@example.com', action: 'Export data', detail: 'CSV export failed', time: '14d ago', status: 'failed' },
]

const Card = ({ children, className = '' }) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>

const roleBadge = (role) => {
  const cfg = { Admin: 'bg-violet-900/40 text-violet-400', Manager: 'bg-blue-900/40 text-blue-400', Analyst: 'bg-green-900/40 text-green-400', Viewer: 'bg-gray-800 text-gray-400' }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cfg[role] || cfg.Viewer}`}>{role}</span>
}

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers)
  const [tab, setTab] = useState('users')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [resetMsg, setResetMsg] = useState('')

  const filtered = users.filter(u => {
    const s = search.toLowerCase()
    const matchSearch = !s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
    const matchRole = roleFilter === 'All' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const toggleStatus = (id) => setUsers(u => u.map(x => x.id === id ? { ...x, is_active: !x.is_active } : x))

  const openEdit = (user) => {
    setSelectedUser(user)
    setEditForm({ name: user.name, email: user.email, role: user.role, department: user.department })
    setShowModal(true)
  }

  const saveEdit = () => {
    setUsers(u => u.map(x => x.id === selectedUser.id ? { ...x, ...editForm } : x))
    setShowModal(false)
    setResetMsg('')
  }

  const resetPassword = (user) => {
    setResetMsg(`✅ Password reset email sent to ${user.email}`)
    setTimeout(() => setResetMsg(''), 3000)
  }

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    byRole: ['Admin', 'Manager', 'Analyst', 'Viewer'].reduce((a, r) => ({ ...a, [r]: users.filter(u => u.role === r).length }), {}),
  }

  return (
    <Layout title="User Management">
      <p className="text-gray-400 mb-6">Manage user profiles, permissions, activity tracking, and account settings</p>

      {resetMsg && <div className="mb-4 p-4 bg-green-900/30 border border-green-500/40 rounded-xl text-green-400 text-sm">{resetMsg}</div>}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Users', value: stats.total, color: 'from-violet-500 to-purple-600', icon: '👥' },
          { label: 'Active', value: stats.active, color: 'from-green-500 to-emerald-600', icon: '✅' },
          ...Object.entries(stats.byRole).map(([r, v]) => ({ label: r, value: v, color: 'from-blue-500 to-cyan-600', icon: '🏷️' }))
        ].map((s, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-sm`}>{s.icon}</div>
              <div><p className="text-xl font-bold text-white">{s.value}</p><p className="text-xs text-gray-400">{s.label}</p></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {[{ k: 'users', l: '👥 Users' }, { k: 'activity', l: '📋 Activity Log' }].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab === t.k ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.l}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div>
          {/* Search & Filter */}
          <div className="flex flex-wrap gap-3 mb-4">
            <input type="text" placeholder="🔍 Search users..." value={search} onChange={e => setSearch(e.target.value)}
              className="bg-[#211A45] text-white px-4 py-2.5 rounded-xl border border-[#39306A] outline-none focus:border-violet-500 text-sm w-64" />
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
              className="bg-[#211A45] text-white px-4 py-2.5 rounded-xl border border-[#39306A] outline-none text-sm">
              {['All', 'Admin', 'Manager', 'Analyst', 'Viewer'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="space-y-3">
            {filtered.map(u => (
              <Card key={u.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${u.is_active ? 'bg-gradient-to-br from-violet-500 to-pink-500' : 'bg-gray-700'}`}>
                      {u.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white">{u.name}</p>
                        {roleBadge(u.role)}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.is_active ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                          {u.is_active ? 'Active' : 'Suspended'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-0.5">{u.email} · {u.department}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                        <span>Last login: {u.last_login}</span>
                        <span>Forecasts: <span className="text-violet-400">{u.forecasts_run}</span></span>
                        <span>Datasets: <span className="text-blue-400">{u.datasets_uploaded}</span></span>
                        <span>Reports: <span className="text-pink-400">{u.reports_generated}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => openEdit(u)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2D2257] text-white hover:bg-violet-800 transition">✏️ Edit</button>
                    <button onClick={() => resetPassword(u)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-900/40 text-blue-400 hover:bg-blue-800/40 transition">🔑 Reset PW</button>
                    <button onClick={() => toggleStatus(u.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${u.is_active ? 'bg-red-900/40 text-red-400 hover:bg-red-800/40' : 'bg-green-900/40 text-green-400 hover:bg-green-800/40'}`}>
                      {u.is_active ? '🔒 Suspend' : '✅ Activate'}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === 'activity' && (
        <Card>
          <div className="p-5 border-b border-[#39306A]">
            <h4 className="font-semibold text-white">User Activity Log</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#39306A] text-gray-400 text-left">
                {['User', 'Action', 'Detail', 'Time', 'Status'].map(h => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
              </tr></thead>
              <tbody>
                {activityLog.map(a => (
                  <tr key={a.id} className="border-b border-[#2D2257] hover:bg-[#2D2257]/50 transition">
                    <td className="px-5 py-4 text-blue-400">{a.user}</td>
                    <td className="px-5 py-4 text-white font-medium">{a.action}</td>
                    <td className="px-5 py-4 text-gray-300">{a.detail}</td>
                    <td className="px-5 py-4 text-gray-400">{a.time}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${a.status === 'success' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-5 text-white">Edit User — {selectedUser.name}</h3>
            <div className="space-y-4">
              {[{ l: 'Full Name', k: 'name' }, { l: 'Email', k: 'email' }, { l: 'Department', k: 'department' }].map(f => (
                <div key={f.k}>
                  <label className="block text-sm text-gray-400 mb-1">{f.l}</label>
                  <input type="text" value={editForm[f.k] || ''} onChange={e => setEditForm(x => ({ ...x, [f.k]: e.target.value }))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500" />
                </div>
              ))}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Role</label>
                <select value={editForm.role || ''} onChange={e => setEditForm(x => ({ ...x, role: e.target.value }))}
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                  {['Super Admin','Admin','Manager','Analyst','Viewer'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveEdit} className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition text-white">Save Changes</button>
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-[#2D2257] rounded-xl font-semibold text-gray-300 hover:bg-[#39306A] transition">Cancel</button>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  )
}
