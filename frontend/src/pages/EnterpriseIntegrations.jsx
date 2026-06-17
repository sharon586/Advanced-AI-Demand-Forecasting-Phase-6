import React, { useState } from 'react'
import Layout from '../components/layout/Layout'

const integrations = [
  { id: 1, name: 'SAP ERP', type: 'erp', provider: 'SAP', status: 'connected', endpoint: 'https://sap-erp.company.com/api', last_sync: '30 min ago', sync_interval: '15min', records_synced: 12480, is_active: true, icon: '🏢' },
  { id: 2, name: 'Oracle NetSuite', type: 'erp', provider: 'Oracle', status: 'connected', endpoint: 'https://netsuite.oracle.com/api', last_sync: '1h ago', sync_interval: 'hourly', records_synced: 5240, is_active: true, icon: '🗄️' },
  { id: 3, name: 'Shopify Inventory', type: 'inventory', provider: 'Shopify', status: 'error', endpoint: 'https://my-store.myshopify.com', last_sync: '5h ago', sync_interval: '30min', records_synced: 890, is_active: false, icon: '🛒' },
  { id: 4, name: 'Warehouse API', type: 'inventory', provider: 'Custom', status: 'pending', endpoint: 'https://warehouse.internal/api/v2', last_sync: null, sync_interval: '5min', records_synced: 0, is_active: false, icon: '📦' },
]

const webhooks = [
  { id: 1, name: 'Forecast Complete Webhook', url: 'https://hooks.slack.com/services/abc', events: ['forecast.complete', 'forecast.failed'], is_active: true, last_triggered: '2h ago', total_delivered: 48 },
  { id: 2, name: 'Inventory Alert Hook', url: 'https://api.customer.com/webhooks/inventory', events: ['stock.low', 'stock.critical'], is_active: true, last_triggered: '1d ago', total_delivered: 12 },
]

const Card = ({ children, className = '' }) => <div className={`bg-[#211A45] rounded-2xl border border-[#39306A] ${className}`}>{children}</div>
const Badge = ({ status }) => {
  const cfg = { connected: 'bg-green-900/40 text-green-400', error: 'bg-red-900/40 text-red-400', pending: 'bg-yellow-900/40 text-yellow-400', disconnected: 'bg-gray-800 text-gray-400' }
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cfg[status] || cfg.disconnected}`}>{status}</span>
}

export default function EnterpriseIntegrations() {
  const [tab, setTab] = useState('integrations')
  const [integrationList, setIntegrationList] = useState(integrations)
  const [webhookList, setWebhookList] = useState(webhooks)
  const [showModal, setShowModal] = useState(false)
  const [syncingId, setSyncingId] = useState(null)
  const [form, setForm] = useState({ name: '', type: 'erp', provider: '', endpoint: '', sync_interval: 'hourly' })

  const triggerSync = (id) => {
    setSyncingId(id)
    setTimeout(() => {
      setIntegrationList(l => l.map(i => i.id === id ? { ...i, last_sync: 'Just now', status: 'connected', records_synced: i.records_synced + Math.floor(Math.random()*200+50) } : i))
      setSyncingId(null)
    }, 1500)
  }

  const toggle = (id) => setIntegrationList(l => l.map(i => i.id === id ? { ...i, is_active: !i.is_active, status: !i.is_active ? 'connected' : 'disconnected' } : i))
  const removeIntegration = (id) => setIntegrationList(l => l.filter(i => i.id !== id))
  const removeWebhook = (id) => setWebhookList(l => l.filter(w => w.id !== id))

  const addIntegration = () => {
    if (!form.name || !form.endpoint) return
    setIntegrationList(l => [...l, { ...form, id: Date.now(), status: 'pending', is_active: false, last_sync: null, records_synced: 0, icon: '🔌' }])
    setShowModal(false)
    setForm({ name: '', type: 'erp', provider: '', endpoint: '', sync_interval: 'hourly' })
  }

  const connected = integrationList.filter(i => i.status === 'connected').length
  const totalRecords = integrationList.reduce((a, b) => a + b.records_synced, 0)

  return (
    <Layout title="Enterprise Integrations">
      <p className="text-gray-400 mb-6">Connect external ERP systems, inventory platforms, and webhooks for real-time data sync</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Connected', value: connected, icon: '🟢', color: 'from-green-500 to-emerald-600' },
          { label: 'Total Integrations', value: integrationList.length, icon: '🔌', color: 'from-violet-500 to-purple-600' },
          { label: 'Records Synced', value: totalRecords.toLocaleString(), icon: '🔄', color: 'from-blue-500 to-cyan-600' },
          { label: 'Active Webhooks', value: webhookList.filter(w=>w.is_active).length, icon: '🪝', color: 'from-pink-500 to-rose-600' },
        ].map((s, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg`}>{s.icon}</div>
              <div><p className="text-2xl font-bold text-white">{s.value}</p><p className="text-xs text-gray-400">{s.label}</p></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-[#1B1538] p-1.5 rounded-xl border border-[#312B56] w-fit">
        {[{ key: 'integrations', label: '🔌 Integrations' }, { key: 'webhooks', label: '🪝 Webhooks' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab === t.key ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'integrations' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Connected Systems</h3>
            <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-sm font-semibold hover:opacity-90 transition">
              + Add Integration
            </button>
          </div>
          <div className="space-y-3">
            {integrationList.map(i => (
              <Card key={i.id} className="p-5">
                <div className="flex flex-wrap items-center gap-4 justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#2D2257] flex items-center justify-center text-2xl">{i.icon}</div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white">{i.name}</p>
                        <Badge status={i.status} />
                        <span className="text-xs text-gray-500 bg-[#2D2257] px-2 py-0.5 rounded-full">{i.type}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{i.endpoint}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Sync: {i.sync_interval} · Last: {i.last_sync || 'Never'} · {i.records_synced.toLocaleString()} records</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => triggerSync(i.id)} disabled={syncingId === i.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${syncingId === i.id ? 'bg-yellow-800 text-yellow-300' : 'bg-[#2D2257] text-white hover:bg-violet-800'}`}>
                      {syncingId === i.id ? '🔄 Syncing...' : '🔄 Sync Now'}
                    </button>
                    <button onClick={() => toggle(i.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${i.is_active ? 'bg-yellow-900/40 text-yellow-400' : 'bg-green-900/40 text-green-400'}`}>
                      {i.is_active ? 'Disable' : 'Enable'}
                    </button>
                    <button onClick={() => removeIntegration(i.id)} className="text-red-400 hover:text-red-300 px-2 text-lg">✕</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === 'webhooks' && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Webhook Endpoints</h3>
          <div className="space-y-3">
            {webhookList.map(w => (
              <Card key={w.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-900/30 flex items-center justify-center text-2xl">🪝</div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white">{w.name}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${w.is_active ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                          {w.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-blue-400 mt-1">{w.url}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {w.events.map(e => <span key={e} className="text-xs bg-violet-900/30 text-violet-300 px-2 py-0.5 rounded-full">{e}</span>)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Last triggered: {w.last_triggered} · {w.total_delivered} delivered</p>
                    </div>
                  </div>
                  <button onClick={() => removeWebhook(w.id)} className="text-red-400 hover:text-red-300 px-2 text-lg">✕</button>
                </div>
              </Card>
            ))}
            <Card className="p-5 border-dashed border-[#39306A] hover:border-violet-500 transition cursor-pointer flex items-center justify-center gap-3 text-gray-400 hover:text-white" onClick={() => {}}>
              <span className="text-2xl">+</span>
              <span className="font-medium">Add Webhook Endpoint</span>
            </Card>
          </div>
        </div>
      )}

      {/* Add Integration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-5 text-white">Add Integration</h3>
            <div className="space-y-4">
              {[{ l: 'Name', k: 'name', ph: 'e.g. SAP ERP' }, { l: 'Provider', k: 'provider', ph: 'e.g. SAP, Oracle' }, { l: 'Endpoint URL', k: 'endpoint', ph: 'https://api.example.com' }].map(f => (
                <div key={f.k}>
                  <label className="block text-sm text-gray-400 mb-1">{f.l}</label>
                  <input type="text" placeholder={f.ph} value={form[f.k]} onChange={e => setForm(x => ({ ...x, [f.k]: e.target.value }))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500" />
                </div>
              ))}
              {[{ l: 'Type', k: 'type', opts: ['erp', 'inventory', 'analytics', 'custom'] }, { l: 'Sync Interval', k: 'sync_interval', opts: ['5min', '15min', '30min', 'hourly', 'daily'] }].map(f => (
                <div key={f.k}>
                  <label className="block text-sm text-gray-400 mb-1">{f.l}</label>
                  <select value={form[f.k]} onChange={e => setForm(x => ({ ...x, [f.k]: e.target.value }))}
                    className="w-full bg-[#2D2257] text-white px-4 py-3 rounded-xl border border-[#39306A] outline-none focus:border-violet-500">
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={addIntegration} className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition text-white">Add</button>
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-[#2D2257] rounded-xl font-semibold text-gray-300 hover:bg-[#39306A] transition">Cancel</button>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  )
}
