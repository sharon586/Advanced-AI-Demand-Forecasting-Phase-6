import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'Analyst' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { alert('Passwords do not match'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setSuccess(true)
  }

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#2E026D] via-[#7E22CE] to-[#FF4D8D] relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl top-0 left-10" />
      <div className="absolute w-80 h-80 bg-purple-500/20 rounded-full blur-3xl bottom-0 right-10" />

      <div className="w-[90%] max-w-5xl bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl flex overflow-hidden border border-white/10">
        {/* Left */}
        <div className="hidden md:flex flex-col justify-center w-1/2 p-16 text-white">
          <h1 className="text-5xl font-bold mb-5 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">AI Forecast</h1>
          <p className="text-gray-100 mb-8 leading-7">Create your account and unlock powerful AI-driven business forecasting.</p>
          <div className="space-y-4">
            {[
              { icon: '📊', title: 'Intelligent Analytics', desc: 'Understand market demand trends with advanced charts.' },
              { icon: '🤖', title: 'Multi-Model Forecasting', desc: 'Compare Linear Regression, RF, XGBoost, and ARIMA.' },
              { icon: '🛡️', title: 'Secure Architecture', desc: 'JWT authentication and role-based access control.' },
              { icon: '🔔', title: 'Smart Notifications', desc: 'Get notified on forecast completion and alerts.' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-semibold text-sm">{f.title}</h3>
                  <p className="text-gray-200 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
            {success ? (
              <div className="text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Created!</h2>
                <p className="text-gray-500 mb-6">Your account has been registered successfully.</p>
                <Link to="/" className="block w-full py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-xl font-semibold text-center hover:opacity-90 transition">
                  Login Now →
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-800 mb-1">Create Account</h2>
                <p className="text-gray-500 mb-7 text-sm">Start using AI forecasting today</p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input type="text" placeholder="Full name" value={form.name} onChange={set('name')} required
                    className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-800 text-sm" />
                  <input type="email" placeholder="Email address" value={form.email} onChange={set('email')} required
                    className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-800 text-sm" />
                  <select value={form.role} onChange={set('role')}
                    className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-600 text-sm">
                    {['Analyst', 'Manager', 'Admin'].map(r => <option key={r}>{r}</option>)}
                  </select>
                  <input type="password" placeholder="Password" value={form.password} onChange={set('password')} required
                    className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-800 text-sm" />
                  <input type="password" placeholder="Confirm password" value={form.confirm} onChange={set('confirm')} required
                    className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-800 text-sm" />
                  <button type="submit" disabled={loading}
                    className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60 text-sm">
                    {loading ? '⏳ Creating...' : 'Create Account →'}
                  </button>
                </form>

                <p className="text-center text-gray-500 mt-5 text-sm">
                  Already have an account?{' '}
                  <Link to="/" className="text-violet-600 font-semibold hover:underline">Login</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
