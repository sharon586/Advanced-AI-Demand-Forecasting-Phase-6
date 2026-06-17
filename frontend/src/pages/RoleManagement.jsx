import React, { useState } from 'react'
import Layout from '../components/layout/Layout'

const ROLES = [
  { name: 'Super Admin', color: '#EF4444', users: 1, desc: 'Full system access with all permissions', icon: '👑' },
  { name: 'Admin', color: '#7C3AED', users: 2, desc: 'Full access except system-level config', icon: '🛡️' },
  { name: 'Manager', color: '#3B82F6', users: 3, desc: 'Access to forecasting, reports and analytics', icon: '📊' },
  { name: 'Analyst', color: '#10B981', users: 5, desc: 'Access to forecasting and dataset upload', icon: '🔬' },
  { name: 'Viewer', color: '#F59E0B', users: 2, desc: 'Read-only access to dashboard and reports', icon: '👁️' },
]

const FEATURES = [
  'View Dashboard', 'Run Forecast', 'Upload Dataset', 'Export Reports',
  'Manage Users', 'Delete Data', 'Admin Panel', 'System Config', 'Retrain Models'
]

const MATRIX = {
  'Super Admin': [true, true, true, true, true, true, true, true, true],
  'Admin':       [true, true, true, true, true, true, true, false, true],
  'Manager':     [true, true, true, true, false, false, false, false, false],
  'Analyst':     [true, true, true, true, false, false, false, false, false],
  'Viewer':      [true, false, false, false, false, false, false, false, false],
}

const USERS = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Admin', status: true },
  { id: 2, name: 'Analyst User', email: 'analyst@example.com', role: 'Analyst', status: true },
  { id: 3, name: 'Manager User', email: 'manager@example.com', role: 'Manager', status: true },
  { id: 4, name: 'Sneha R', email: 'sneha@example.com', role: 'Analyst', status: false },
]

export default function RoleManagement() {
  const [tab, setTab] = useState('roles')
  const [users, setUsers] = useState(USERS)
  const [selectedRole, setSelectedRole] = useState('Admin')
  const [editingUser, setEditingUser] = useState(null)

  const changeRole = (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    setEditingUser(null)
  }

  return (
    <Layout title="Role Management">
      <p className="text-gray-400 mb-6">Manage roles, permissions and user access control</p>

      <div className="flex gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {[
          { key: 'roles', label: '🎭 Roles Overview' },
          { key: 'matrix', label: '📋 Permission Matrix' },
          { key: 'users', label: '👥 User Roles' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab===t.key ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'roles' && (
        <div className="grid grid-cols-2 gap-5">
          {ROLES.map((r, i) => (
            <div key={i}
              className={`bg-[#211A45] rounded-2xl p-6 border-2 cursor-pointer transition ${selectedRole===r.name ? 'border-violet-500' : 'border-[#39306A] hover:border-[#5B4A8A]'}`}
              onClick={() => setSelectedRole(r.name)}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: r.color + '30' }}>
                  {r.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white">{r.name}</h3>
                  <p className="text-xs text-gray-400">{r.users} user{r.users !== 1 ? 's' : ''}</p>
                </div>
                <div className="ml-auto w-3 h-3 rounded-full" style={{ background: r.color }} />
              </div>
              <p className="text-sm text-gray-400 mb-4">{r.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {FEATURES.filter((_, fi) => MATRIX[r.name][fi]).map((f, fi) => (
                  <span key={fi} className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-400 border border-green-800/40">{f}</span>
                ))}
                {FEATURES.filter((_, fi) => !MATRIX[r.name][fi]).map((f, fi) => (
                  <span key={fi} className="text-xs px-2 py-0.5 rounded-full bg-gray-900/30 text-gray-600 border border-gray-800/40 line-through">{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'matrix' && (
        <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
          <h2 className="text-lg font-bold mb-5">Permission Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#39306A]">
                  <th className="text-left pb-3 px-3 text-gray-400 font-medium">Feature</th>
                  {ROLES.map(r => (
                    <th key={r.name} className="pb-3 px-3 text-center font-medium" style={{ color: r.color }}>{r.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feat, fi) => (
                  <tr key={fi} className="border-b border-[#312B56] hover:bg-[#2D2257] transition">
                    <td className="py-3 px-3 text-white">{feat}</td>
                    {ROLES.map(r => (
                      <td key={r.name} className="py-3 px-3 text-center">
                        {MATRIX[r.name][fi]
                          ? <span className="text-green-400 text-lg">✓</span>
                          : <span className="text-gray-700 text-lg">✕</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
          <h2 className="text-lg font-bold mb-5">Assign User Roles</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#39306A] text-gray-400">
                {['User', 'Email', 'Current Role', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left pb-3 px-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const roleInfo = ROLES.find(r => r.name === u.role)
                return (
                  <tr key={i} className="border-b border-[#312B56] hover:bg-[#2D2257] transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                          {u.name[0]}
                        </div>
                        <span className="font-medium text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-400">{u.email}</td>
                    <td className="py-3 px-3">
                      {editingUser === u.id ? (
                        <select defaultValue={u.role} onChange={e => changeRole(u.id, e.target.value)}
                          className="bg-[#2D2257] text-white text-sm px-2 py-1 rounded-lg border border-[#39306A] outline-none">
                          {ROLES.map(r => <option key={r.name}>{r.name}</option>)}
                        </select>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full border font-medium"
                          style={{ color: roleInfo?.color, borderColor: roleInfo?.color + '50', background: roleInfo?.color + '20' }}>
                          {roleInfo?.icon} {u.role}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${u.status ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                        {u.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {editingUser === u.id ? (
                        <button onClick={() => setEditingUser(null)} className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-[#39306A] transition">Cancel</button>
                      ) : (
                        <button onClick={() => setEditingUser(u.id)} className="text-xs text-violet-400 hover:text-violet-300 px-2 py-1 rounded hover:bg-violet-900/20 transition">Change Role</button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
