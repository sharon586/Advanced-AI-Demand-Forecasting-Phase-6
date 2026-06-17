import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)

    // Demo login — accept any credentials
    const userData = {
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'Admin User',
      email,
      role: email.includes('admin') ? 'Admin' : email.includes('manager') ? 'Manager' : 'Analyst',
    }
    login(userData, 'demo-token-' + Date.now())
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/10">

        {/* LEFT */}
        <div className="hidden md:flex flex-col justify-center p-16 text-white">
          <h1 className="text-6xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            AI Forecast
          </h1>
          <p className="text-lg text-gray-300 mb-10 leading-relaxed">
            Intelligent demand forecasting and analytics platform powered by machine learning.
          </p>
          <div className="space-y-6">
            {[
              { title: 'Smart Analytics', desc: 'Visualize trends with real-time business insights.' },
              { title: 'Multi-Model AI', desc: 'Linear Regression, Random Forest, XGBoost & ARIMA.' },
              { title: 'Admin Panel', desc: 'Full user management and system monitoring.' },
              { title: 'Secure Platform', desc: 'JWT authentication & enterprise-grade protection.' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="text-gray-400 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-l-3xl flex items-center justify-center p-10">
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-8">Login to your AI forecasting workspace</p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Email Address</label>
                <input type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-800" required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Password</label>
                <input type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-800" required />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold text-lg transition hover:opacity-90 disabled:opacity-60">
                {loading ? '⏳ Logging in...' : 'Login →'}
              </button>
            </form>

            <p className="text-center text-gray-500 mt-6 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-violet-600 font-semibold hover:underline">Register</Link>
            </p>

            <div className="mt-6 p-3 bg-gray-50 rounded-xl text-xs text-gray-400 text-center">
              Demo: use any email/password to login
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
