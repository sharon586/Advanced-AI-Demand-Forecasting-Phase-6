import React, { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Forecast Completed', message: 'Random Forest forecast completed with 96.8% accuracy.', type: 'success', read: false, time: '5 min ago' },
    { id: 2, title: 'Dataset Uploaded', message: 'sales_q4_2025.csv uploaded successfully. 1,240 rows processed.', type: 'success', read: false, time: '1 hour ago' },
    { id: 3, title: 'Report Generated', message: 'Q4 2025 Annual Report is ready for download.', type: 'info', read: true, time: '3 hours ago' },
    { id: 4, title: 'Upload Failed', message: 'corrupt_data.csv upload failed. Invalid file format.', type: 'error', read: true, time: '1 day ago' },
    { id: 5, title: 'Low Stock Alert', message: 'Critical: Headphones Pro X1 has only 12 units remaining.', type: 'warning', read: false, time: '2 hours ago' },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const addNotification = useCallback((notif) => {
    setNotifications(prev => [{ id: Date.now(), read: false, time: 'just now', ...notif }, ...prev])
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationContext)
}
