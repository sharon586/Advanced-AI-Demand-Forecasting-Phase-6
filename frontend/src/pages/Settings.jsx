import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Settings() {
  const { user } = useAuth()
  const { dark, toggle } = useTheme()
  const [name, setName] = useState(user?.name || 'Admin User')
  const [email, setEmail] = useState(user?.email || 'admin@example.com')
  const [role, setRole] = useState(user?.role || 'Admin')
  const [phone, setPhone] = useState('+91 98765 43210')
  const [department, setDepartment] = useState('Engineering')
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [pwError, setPwError] = useState('')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [notifPrefs, setNotifPrefs] = useState({
    forecast_complete: true, dataset_upload: true, report_ready: true,
    low_stock: true, upload_fail: true, email_notif: false
  })
  const [apiSettings, setApiSettings] = useState({
    default_model: 'Random Forest', forecast_horizon: '6',
    auto_retrain: true, pagination_size: '10', api_rate_limit: '100'
  })
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true)
  const [auditLog] = useState([
    { action: 'Profile updated', time: '2h ago', ip: '192.168.1.10' },
    { action: 'Password changed', time: '7d ago', ip: '192.168.1.10' },
    { action: 'Login successful', time: '2h ago', ip: '192.168.1.10' },
    { action: 'API settings updated', time: '14d ago', ip: '192.168.1.15' },
  ])

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handlePasswordUpdate = (e) => {
    e.preventDefault()
    setPwError('')
    if (!currentPw) { setPwError('Current password is required'); return }
    if (newPw.length < 6) { setPwError('New password must be at least 6 characters'); return }
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return }
    setPwSaved(true)
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    setTimeout(() => setPwSaved(false), 3000)
  }

  return (
    <Layout title="Settings">
      <p className="text-gray-400 mb-6">Manage your account and application preferences</p>

      <div className="flex flex-wrap gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {[
          { key: 'profile', label: '👤 Profile' },
          { key: 'appearance', label: '🎨 Appearance' },
          { key: 'notifications', label: '🔔 Notifications' },
          { key: 'api', label: '⚙️ API Settings' },
          { key: 'security', label: '🔒 Security' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.key ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl">
          <form onSubmit={handleSave} className="bg-[#211A45] rounded-2xl p-8 border border-[#39306A] space-y-5">
            <h3 className="text-lg font-semibold">Profile Information</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white">
                {name[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium">{name}</p>
                <p className="text-sm text-gray-400">{role}</p>
                <button type="button" className="text-xs text-violet-400 hover:text-violet-300 mt-1">Change avatar →</button>
              </div>
            </div>
            {[
              { label: 'Full Name', val: name, set: setName, type: 'text' },
              { label: 'Email Address', val: email, set: setEmail, type: 'email' },
              { label: 'Phone Number', val: phone, set: setPhone, type: 'text' },
              { label: 'Department', val: department, set: setDepartment, type: 'text' },
            ].map((f, i) => (
              <div key={i}>
                <label className="block text-sm text-gray-400 mb-2">{f.label}</label>
                <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500 transition" />
              </div>
            ))}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Role</label>
              <select value={role} onChange={e => setRole(e.target.value)}
                className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                {['Super Admin','Admin','Manager','Analyst','Viewer'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <button type="submit" className={`px-8 py-3 rounded-xl font-semibold transition ${saved ? 'bg-green-600' : 'bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90'}`}>
              {saved ? '✅ Saved!' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* APPEARANCE TAB */}
      {activeTab === 'appearance' && (
        <div className="max-w-2xl">
          <div className="bg-[#211A45] rounded-2xl p-8 border border-[#39306A] space-y-6">
            <h3 className="text-lg font-semibold">Appearance</h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#2D2257]">
              <div>
                <p className="text-sm font-medium text-white">Dark Mode</p>
                <p className="text-xs text-gray-400 mt-0.5">Toggle dark / light theme</p>
              </div>
              <button onClick={toggle}
                className={`relative w-12 h-6 rounded-full transition ${dark ? 'bg-violet-500' : 'bg-[#39306A]'}`}>
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${dark ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-3">Accent Color</label>
              <div className="flex gap-3">
                {['#7C3AED','#EC4899','#3B82F6','#10B981','#F59E0B','#EF4444'].map(c => (
                  <button key={c} className="w-8 h-8 rounded-full border-2 border-white/20 hover:scale-110 transition" style={{ background: c }} />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Sidebar Default State</label>
              <select className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                <option>Expanded</option>
                <option>Collapsed</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <div className="max-w-2xl">
          <div className="bg-[#211A45] rounded-2xl p-8 border border-[#39306A] space-y-4">
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
            {[
              { key: 'forecast_complete', label: 'Forecast Complete', desc: 'Notify when a forecast run finishes' },
              { key: 'dataset_upload', label: 'Dataset Uploaded', desc: 'Notify when dataset is processed' },
              { key: 'report_ready', label: 'Report Ready', desc: 'Notify when reports are generated' },
              { key: 'low_stock', label: 'Low Stock Alert', desc: 'Alert on critically low inventory' },
              { key: 'upload_fail', label: 'Upload Failed', desc: 'Alert on dataset upload failures' },
              { key: 'email_notif', label: 'Email Notifications', desc: 'Receive alerts via email too' },
            ].map(pref => (
              <div key={pref.key} className="flex items-center justify-between p-4 rounded-xl bg-[#2D2257]">
                <div>
                  <p className="text-sm font-medium text-white">{pref.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{pref.desc}</p>
                </div>
                <button onClick={() => setNotifPrefs(prev => ({ ...prev, [pref.key]: !prev[pref.key] }))}
                  className={`relative w-12 h-6 rounded-full transition ${notifPrefs[pref.key] ? 'bg-violet-500' : 'bg-[#39306A]'}`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifPrefs[pref.key] ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            ))}
            <button onClick={() => setSaved(true)} className="mt-2 px-8 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 font-semibold hover:opacity-90">
              {saved ? '✅ Saved!' : 'Save Preferences'}
            </button>
          </div>
        </div>
      )}

      {/* API SETTINGS TAB */}
      {activeTab === 'api' && (
        <div className="max-w-2xl">
          <div className="bg-[#211A45] rounded-2xl p-8 border border-[#39306A] space-y-5">
            <h3 className="text-lg font-semibold">API & Forecasting Settings</h3>
            {[
              { label: 'Default Forecasting Model', key: 'default_model', opts: ['Linear Regression','Random Forest','XGBoost','ARIMA','Ensemble'] },
              { label: 'Forecast Horizon (months)', key: 'forecast_horizon', opts: ['3','6','9','12'] },
              { label: 'Pagination Page Size', key: 'pagination_size', opts: ['10','25','50','100'] },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm text-gray-400 mb-2">{f.label}</label>
                <select value={apiSettings[f.key]} onChange={e => setApiSettings(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#2D2257]">
              <div>
                <p className="text-sm font-medium text-white">Auto-retrain Models</p>
                <p className="text-xs text-gray-400 mt-0.5">Automatically retrain when new data is uploaded</p>
              </div>
              <button onClick={() => setApiSettings(p => ({ ...p, auto_retrain: !p.auto_retrain }))}
                className={`relative w-12 h-6 rounded-full transition ${apiSettings.auto_retrain ? 'bg-violet-500' : 'bg-[#39306A]'}`}>
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${apiSettings.auto_retrain ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            {/* API Rate Limiting */}
            <div className="pt-2 border-t border-[#39306A]">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#2D2257] mb-3">
                <div>
                  <p className="text-sm font-medium text-white">API Rate Limiting</p>
                  <p className="text-xs text-gray-400 mt-0.5">Protect endpoints from excessive requests</p>
                </div>
                <button onClick={() => setRateLimitEnabled(e => !e)}
                  className={`relative w-12 h-6 rounded-full transition ${rateLimitEnabled ? 'bg-violet-500' : 'bg-[#39306A]'}`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${rateLimitEnabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              {rateLimitEnabled && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Max Requests per Hour</label>
                  <input type="number" value={apiSettings.api_rate_limit} onChange={e => setApiSettings(p => ({ ...p, api_rate_limit: e.target.value }))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500" />
                </div>
              )}
            </div>
            <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 font-semibold hover:opacity-90">Save API Settings</button>
          </div>
        </div>
      )}

      {/* SECURITY TAB */}
      {activeTab === 'security' && (
        <div className="max-w-2xl space-y-5">
          {/* Password Update */}
          <form onSubmit={handlePasswordUpdate} className="bg-[#211A45] rounded-2xl p-8 border border-[#39306A] space-y-5">
            <h3 className="text-lg font-semibold">Change Password</h3>
            {pwError && <div className="p-3 bg-red-900/30 border border-red-500/40 rounded-xl text-red-400 text-sm">{pwError}</div>}
            {pwSaved && <div className="p-3 bg-green-900/30 border border-green-500/40 rounded-xl text-green-400 text-sm">✅ Password updated successfully!</div>}
            {[['Current Password', currentPw, setCurrentPw], ['New Password', newPw, setNewPw], ['Confirm New Password', confirmPw, setConfirmPw]].map(([label, val, set]) => (
              <div key={label}>
                <label className="block text-sm text-gray-400 mb-2">{label}</label>
                <input type="password" placeholder={`Enter ${label.toLowerCase()}`} value={val} onChange={e => set(e.target.value)}
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500 transition" />
              </div>
            ))}
            <button type="submit" className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 font-semibold hover:opacity-90">Update Password</button>
          </form>

          {/* Security settings */}
          <div className="bg-[#211A45] rounded-2xl p-8 border border-[#39306A] space-y-4">
            <h3 className="text-lg font-semibold">Security Settings</h3>
            {[
              { label: 'JWT Auto-refresh', desc: 'Automatically refresh tokens before expiry', enabled: true },
              { label: 'Secure File Validation', desc: 'Validate file types and scan for malicious content', enabled: true },
              { label: 'Admin Audit Logging', desc: 'Log all admin actions for compliance', enabled: true },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#2D2257]">
                <div>
                  <p className="text-sm font-medium text-white">{s.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                </div>
                <div className={`w-10 h-5 rounded-full ${s.enabled ? 'bg-green-600' : 'bg-gray-600'} flex items-center justify-end px-0.5`}>
                  <span className="w-4 h-4 rounded-full bg-white shadow" />
                </div>
              </div>
            ))}
            <div className="p-4 rounded-xl bg-[#2D2257]">
              <p className="text-sm font-medium text-white mb-1">Session Info</p>
              <p className="text-xs text-gray-400">Token expires: 12 hours · Last login: Today · IP: 192.168.1.10</p>
            </div>
          </div>

          {/* Audit Log */}
          <div className="bg-[#211A45] rounded-2xl p-6 border border-[#39306A]">
            <h3 className="text-base font-semibold text-white mb-4">Recent Audit Log</h3>
            <div className="space-y-2">
              {auditLog.map((entry, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-3 rounded-xl hover:bg-[#2D2257] transition">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">{entry.action}</span>
                  </div>
                  <div className="text-right text-gray-500 text-xs">
                    <span>{entry.time}</span>
                    <span className="ml-3 text-gray-600">{entry.ip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
