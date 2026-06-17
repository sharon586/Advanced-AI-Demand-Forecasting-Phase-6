import React, { useState, useRef, useEffect } from 'react'
import { useNotifications } from '../../context/NotificationContext'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import GlobalSearch from '../ui/GlobalSearch'

const typeIcons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }

export default function Navbar({ title }) {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()
  const { user } = useAuth()
  const { dark, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-[#1B1538] border-b border-[#312B56] sticky top-0 z-20">
      <h2 className="text-xl font-bold text-white">{title}</h2>

      <div className="flex items-center gap-3">
        <GlobalSearch />

        {/* Dark/Light Toggle */}
        <button onClick={toggle}
          className="p-2 rounded-xl hover:bg-[#312B56] text-gray-300 hover:text-white transition text-xl"
          title={dark ? 'Light mode' : 'Dark mode'}>
          {dark ? '☀️' : '🌙'}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen(!open)}
            className="relative p-2 rounded-xl hover:bg-[#312B56] text-gray-300 hover:text-white transition">
            <span className="text-xl">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold bg-gradient-to-r from-violet-500 to-pink-500 rounded-full text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {open && (
            <div className="absolute right-0 top-12 w-96 bg-[#211A45] border border-[#39306A] rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#39306A]">
                <span className="font-semibold text-white">Notifications</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-violet-400 hover:text-violet-300">Mark all read</button>}
                  <span className="text-xs text-gray-500">{unreadCount} unread</span>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">No notifications</div>
                ) : notifications.map(n => (
                  <div key={n.id}
                    className={`flex items-start gap-3 px-5 py-3 border-b border-[#312B56] hover:bg-[#312B56] cursor-pointer transition ${!n.read ? 'bg-[#261E4A]' : ''}`}
                    onClick={() => markRead(n.id)}>
                    <span className="text-lg mt-0.5">{typeIcons[n.type] || 'ℹ️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${!n.read ? 'text-white' : 'text-gray-300'}`}>{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{n.time}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-violet-500 mt-1 flex-shrink-0" />}
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-[#39306A]">
                <a href="/notifications" className="text-xs text-violet-400 hover:text-violet-300">View all notifications →</a>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 bg-[#241B4B] px-4 py-2 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
            {(user?.name || 'U')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400">{user?.role || 'Analyst'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
