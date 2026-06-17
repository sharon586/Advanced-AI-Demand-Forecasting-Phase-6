import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { useNotifications } from '../context/NotificationContext'

const typeConfig = {
  success: { color: 'text-green-400', bg: 'bg-green-900/20 border-green-800/40', icon: '✅', label: 'Success' },
  error: { color: 'text-red-400', bg: 'bg-red-900/20 border-red-800/40', icon: '❌', label: 'Error' },
  warning: { color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-800/40', icon: '⚠️', label: 'Warning' },
  info: { color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-800/40', icon: 'ℹ️', label: 'Info' },
}

const defaultAlertSettings = [
  { id: 1, name: 'Forecast Complete', description: 'When a forecast run finishes', in_app: true, email: false, key: 'forecast_complete' },
  { id: 2, name: 'Dataset Uploaded', description: 'When a dataset is processed', in_app: true, email: false, key: 'dataset_upload' },
  { id: 3, name: 'Report Ready', description: 'When a report is generated', in_app: true, email: true, key: 'report_ready' },
  { id: 4, name: 'Low Stock Alert', description: 'When product stock falls critically low', in_app: true, email: true, key: 'low_stock' },
  { id: 5, name: 'Upload Failed', description: 'When a dataset upload fails', in_app: true, email: false, key: 'upload_fail' },
  { id: 6, name: 'Forecast Failure', description: 'When a forecast job fails', in_app: true, email: true, key: 'forecast_fail' },
  { id: 7, name: 'Demand Spike Detected', description: 'When AI detects abnormal demand spikes', in_app: true, email: true, key: 'demand_spike' },
  { id: 8, name: 'Schedule Run Complete', description: 'When an automated schedule finishes', in_app: false, email: false, key: 'schedule_complete' },
]

const thresholdAlerts = [
  { id: 1, name: 'Low Forecast Accuracy', metric: 'Accuracy', threshold: 85, condition: 'below', unit: '%', is_active: true },
  { id: 2, name: 'High RMSE', metric: 'RMSE', threshold: 5000, condition: 'above', unit: '', is_active: true },
  { id: 3, name: 'Demand Spike', metric: 'Demand Change', threshold: 25, condition: 'above', unit: '%', is_active: true },
  { id: 4, name: 'Low Stock Critical', metric: 'Days Until Stockout', threshold: 3, condition: 'below', unit: ' days', is_active: false },
]

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead, removeNotification } = useNotifications()
  const [tab, setTab] = useState('inbox')
  const [filter, setFilter] = useState('all')
  const [alertSettings, setAlertSettings] = useState(defaultAlertSettings)
  const [thresholds, setThresholds] = useState(thresholdAlerts)
  const [emailEnabled, setEmailEnabled] = useState(false)
  const [emailAddress, setEmailAddress] = useState('admin@example.com')
  const [savedMsg, setSavedMsg] = useState('')

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'success') return n.type === 'success'
    if (filter === 'error') return n.type === 'error'
    if (filter === 'warning') return n.type === 'warning'
    return true
  })

  const toggleAlertChannel = (id, channel) => {
    setAlertSettings(s => s.map(a => a.id === id ? { ...a, [channel]: !a[channel] } : a))
  }

  const toggleThreshold = (id) => {
    setThresholds(t => t.map(a => a.id === id ? { ...a, is_active: !a.is_active } : a))
  }

  const saveSettings = () => {
    setSavedMsg('✅ Notification settings saved successfully!')
    setTimeout(() => setSavedMsg(''), 3000)
  }

  return (
    <Layout title="Notifications & Alerts">
      {savedMsg && <div className="mb-4 p-3 bg-green-900/30 border border-green-500/40 rounded-xl text-green-400 text-sm">{savedMsg}</div>}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {[
          { k: 'inbox', l: `📬 Inbox${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
          { k: 'alert_settings', l: '⚙️ Alert Settings' },
          { k: 'thresholds', l: '📊 Thresholds' },
        ].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab === t.k ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.l}
          </button>
        ))}
      </div>

      {/* INBOX TAB */}
      {tab === 'inbox' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">Manage your system notifications and alerts</p>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="px-4 py-2 rounded-xl bg-[#241B4B] border border-[#39306A] text-sm text-violet-400 hover:text-violet-300 transition">
                Mark all as read
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-5">
            {['all', 'unread', 'success', 'error', 'warning'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize ${filter === f ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white' : 'bg-[#1B1538] border border-[#312B56] text-gray-400 hover:text-white'}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p className="text-4xl mb-3">🔔</p>
                <p>No notifications found</p>
              </div>
            ) : filtered.map(n => {
              const cfg = typeConfig[n.type] || typeConfig.info
              return (
                <div key={n.id}
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition hover:opacity-90 ${cfg.bg} ${!n.read ? 'ring-1 ring-violet-500/30' : ''}`}
                  onClick={() => markRead(n.id)}>
                  <span className="text-2xl mt-0.5">{cfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-semibold ${cfg.color}`}>{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />}
                    </div>
                    <p className="text-sm text-gray-300 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{n.time || 'Just now'}</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); removeNotification(n.id) }} className="text-gray-500 hover:text-red-400 transition text-lg ml-2">×</button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ALERT SETTINGS TAB */}
      {tab === 'alert_settings' && (
        <div className="max-w-3xl">
          {/* Email Config */}
          <div className="bg-[#211A45] rounded-2xl border border-[#39306A] p-6 mb-5">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">📧 Email Notifications</h3>
            <div className="flex items-center justify-between p-4 bg-[#2D2257] rounded-xl mb-4">
              <div>
                <p className="text-white font-medium text-sm">Enable Email Notifications</p>
                <p className="text-xs text-gray-400 mt-0.5">Receive alerts and reports by email</p>
              </div>
              <button onClick={() => setEmailEnabled(e => !e)}
                className={`w-12 h-6 rounded-full transition-all relative ${emailEnabled ? 'bg-violet-600' : 'bg-gray-600'}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${emailEnabled ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
            {emailEnabled && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Notification Email Address</label>
                <input type="email" value={emailAddress} onChange={e => setEmailAddress(e.target.value)}
                  className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500 text-sm" />
              </div>
            )}
          </div>

          {/* Per-alert settings */}
          <div className="bg-[#211A45] rounded-2xl border border-[#39306A] overflow-hidden">
            <div className="p-5 border-b border-[#39306A]">
              <h3 className="text-base font-semibold text-white">Notification Preferences</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#39306A] text-gray-400 text-left">
                    <th className="px-5 py-3 font-medium">Alert Type</th>
                    <th className="px-5 py-3 font-medium text-center">In-App</th>
                    <th className="px-5 py-3 font-medium text-center">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {alertSettings.map(a => (
                    <tr key={a.id} className="border-b border-[#2D2257] hover:bg-[#2D2257]/40 transition">
                      <td className="px-5 py-4">
                        <p className="text-white font-medium">{a.name}</p>
                        <p className="text-xs text-gray-400">{a.description}</p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button onClick={() => toggleAlertChannel(a.id, 'in_app')}
                          className={`w-10 h-5 rounded-full transition-all relative inline-block ${a.in_app ? 'bg-violet-600' : 'bg-gray-600'}`}>
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${a.in_app ? 'left-5' : 'left-0.5'}`} />
                        </button>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button onClick={() => toggleAlertChannel(a.id, 'email')}
                          className={`w-10 h-5 rounded-full transition-all relative inline-block ${a.email && emailEnabled ? 'bg-pink-600' : 'bg-gray-600'} ${!emailEnabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                          disabled={!emailEnabled}>
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${a.email && emailEnabled ? 'left-5' : 'left-0.5'}`} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button onClick={saveSettings} className="mt-4 px-8 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90 transition">
            Save Notification Settings
          </button>
        </div>
      )}

      {/* THRESHOLDS TAB */}
      {tab === 'thresholds' && (
        <div className="max-w-3xl">
          <p className="text-gray-400 text-sm mb-5">Configure threshold-based automated alerts. Alerts fire when the metric crosses the defined limit.</p>
          <div className="space-y-3">
            {thresholds.map(t => (
              <div key={t.id} className="bg-[#211A45] rounded-2xl border border-[#39306A] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.is_active ? 'bg-violet-900/40' : 'bg-gray-800'}`}>
                      📊
                    </div>
                    <div>
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="text-sm text-gray-400 mt-0.5">
                        Trigger when <span className="text-violet-400">{t.metric}</span> is{' '}
                        <span className="text-pink-400">{t.condition}</span>{' '}
                        <span className="text-white font-semibold">{t.threshold}{t.unit}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.is_active ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                      {t.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button onClick={() => toggleThreshold(t.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${t.is_active ? 'bg-yellow-900/40 text-yellow-400' : 'bg-green-900/40 text-green-400'}`}>
                      {t.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={saveSettings} className="mt-5 px-8 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90 transition">
            Save Threshold Settings
          </button>
        </div>
      )}
    </Layout>
  )
}
