import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navGroups = [
  {
    label: null,
    items: [
      { to:'/dashboard', label:'Dashboard', icon:'🏠' },
      { to:'/upload', label:'Upload Dataset', icon:'📤' },
      { to:'/forecast', label:'Forecast', icon:'📈' },
      { to:'/forecast/history', label:'Forecast History', icon:'🗂️' },
      { to:'/forecast-comparison', label:'Model Comparison', icon:'⚖️' },
      { to:'/reports', label:'Reports', icon:'📄' },
    ]
  },
  {
    label: 'Phase 6 — Enterprise',
    items: [
      { to:'/organizations', label:'Organizations', icon:'🏢' },
      { to:'/approval-workflow', label:'Approval Workflow', icon:'✅' },
      { to:'/workflow-automation', label:'Workflow Automation', icon:'⚙️' },
      { to:'/strategic-planning', label:'Strategic Planning', icon:'🗺️' },
      { to:'/governance', label:'Governance Center', icon:'🛡️' },
      { to:'/kpi-management', label:'KPI Management', icon:'📊' },
      { to:'/data-quality', label:'Data Quality', icon:'🔍' },
      { to:'/command-center', label:'Command Center', icon:'🎯' },
      { to:'/notification-center', label:'Notification Center', icon:'📢' },
    ]
  },
  {
    label: 'Phase 5 — BI & Planning',
    items: [
      { to:'/workspace', label:'Forecast Workspaces', icon:'📁' },
      { to:'/executive-dashboard', label:'Executive Dashboard', icon:'👔' },
      { to:'/scenario-planning', label:'Scenario Planning', icon:'🔮' },
      { to:'/ai-insights', label:'AI Insights Engine', icon:'💡' },
      { to:'/collaboration', label:'Collaboration', icon:'💬' },
      { to:'/data-management', label:'Data Management', icon:'🗄️' },
      { to:'/accuracy-center', label:'Accuracy Center', icon:'🎯' },
      { to:'/executive-reports', label:'Executive Reports', icon:'📋' },
    ]
  },
  {
    label: 'Analytics & AI',
    items: [
      { to:'/analytics', label:'Advanced Analytics', icon:'🔬' },
      { to:'/ai-features', label:'AI Features', icon:'🧠' },
      { to:'/realtime', label:'Real-Time Monitor', icon:'⚡' },
      { to:'/mlops', label:'ML Ops', icon:'🤖' },
    ]
  },
  {
    label: 'Admin & Config',
    items: [
      { to:'/admin', label:'Admin Dashboard', icon:'🛡️' },
      { to:'/user-management', label:'User Management', icon:'👥' },
      { to:'/roles', label:'Role Management', icon:'🔐' },
      { to:'/automation', label:'Smart Automation', icon:'🗓️' },
      { to:'/integrations', label:'Integrations', icon:'🔌' },
      { to:'/system', label:'System Monitor', icon:'🖥️' },
      { to:'/notifications', label:'Notifications', icon:'🔔' },
      { to:'/settings', label:'Settings', icon:'⚙️' },
    ]
  },
]

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation()
  const { user, logout } = useAuth()
  const isActive = (path) => location.pathname === path

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} min-h-screen bg-[#1B1538] border-r border-[#312B56] flex flex-col transition-all duration-300 flex-shrink-0`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#312B56]">
        {!collapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            AI Forecast
          </h1>
        )}
        <button onClick={onToggle}
          className="p-2 rounded-lg hover:bg-[#312B56] text-gray-400 hover:text-white transition ml-auto"
          title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {navGroups.map((group, gi) => (
          <div key={gi} className="mb-2">
            {group.label && !collapsed && (
              <p className="text-xs text-gray-500 px-3 pt-3 pb-1 uppercase tracking-widest font-semibold">{group.label}</p>
            )}
            {group.label && collapsed && <div className="my-1 border-t border-[#312B56]" />}
            <div className="space-y-0.5">
              {group.items.map(item => (
                <Link key={item.to} to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm
                    ${isActive(item.to)
                      ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-[#31265F] hover:text-white'}`}
                  title={collapsed ? item.label : ''}>
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[#312B56]">
        {!collapsed && user && (
          <div className="mb-2 px-3">
            <p className="text-sm font-semibold text-white truncate">{user.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{user.role || 'Analyst'}</p>
          </div>
        )}
        <button onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition text-sm"
          title={collapsed ? 'Logout' : ''}>
          <span className="text-lg">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}
