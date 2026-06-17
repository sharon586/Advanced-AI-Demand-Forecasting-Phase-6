import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './routes/ProtectedRoute'

// Core pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Forecast from './pages/Forecast'
import ForecastHistory from './pages/ForecastHistory'
import UploadDataset from './pages/UploadDataset'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import AdminDashboard from './pages/AdminDashboard'
import NotificationsPage from './pages/Notifications'
import RealTimeDashboard from './pages/RealTimeDashboard'
import RoleManagement from './pages/RoleManagement'
import SystemMonitor from './pages/SystemMonitor'
import AdvancedAnalytics from './pages/AdvancedAnalytics'
import MLOps from './pages/MLOps'

// Phase 4
import SmartAutomation from './pages/SmartAutomation'
import EnterpriseIntegrations from './pages/EnterpriseIntegrations'
import AIFeatures from './pages/AIFeatures'
import ForecastComparison from './pages/ForecastComparison'
import UserManagement from './pages/UserManagement'

// Phase 5
import ForecastWorkspace from './pages/ForecastWorkspace'
import ScenarioPlanning from './pages/ScenarioPlanning'
import ExecutiveDashboard from './pages/ExecutiveDashboard'
import AIInsights from './pages/AIInsights'
import Collaboration from './pages/Collaboration'
import DataManagement from './pages/DataManagement'
import AccuracyCenter from './pages/AccuracyCenter'
import ExecutiveReports from './pages/ExecutiveReports'

// Phase 6
import OrgManagement from './pages/OrgManagement'
import ApprovalWorkflow from './pages/ApprovalWorkflow'
import WorkflowAutomation from './pages/WorkflowAutomation'
import StrategicPlanning from './pages/StrategicPlanning'
import GovernanceCenter from './pages/GovernanceCenter'
import KPIManagement from './pages/KPIManagement'
import DataQuality from './pages/DataQuality'
import CommandCenter from './pages/CommandCenter'
import NotificationCenter from './pages/NotificationCenter'

const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Core */}
              <Route path="/dashboard"         element={<P><Dashboard /></P>} />
              <Route path="/forecast"          element={<P><Forecast /></P>} />
              <Route path="/forecast/history"  element={<P><ForecastHistory /></P>} />
              <Route path="/upload"            element={<P><UploadDataset /></P>} />
              <Route path="/reports"           element={<P><Reports /></P>} />
              <Route path="/settings"          element={<P><Settings /></P>} />
              <Route path="/admin"             element={<P><AdminDashboard /></P>} />
              <Route path="/notifications"     element={<P><NotificationsPage /></P>} />
              <Route path="/realtime"          element={<P><RealTimeDashboard /></P>} />
              <Route path="/roles"             element={<P><RoleManagement /></P>} />
              <Route path="/system"            element={<P><SystemMonitor /></P>} />
              <Route path="/analytics"         element={<P><AdvancedAnalytics /></P>} />
              <Route path="/mlops"             element={<P><MLOps /></P>} />

              {/* Phase 4 */}
              <Route path="/automation"           element={<P><SmartAutomation /></P>} />
              <Route path="/integrations"         element={<P><EnterpriseIntegrations /></P>} />
              <Route path="/ai-features"          element={<P><AIFeatures /></P>} />
              <Route path="/forecast-comparison"  element={<P><ForecastComparison /></P>} />
              <Route path="/user-management"      element={<P><UserManagement /></P>} />

              {/* Phase 5 */}
              <Route path="/workspace"          element={<P><ForecastWorkspace /></P>} />
              <Route path="/scenario-planning"  element={<P><ScenarioPlanning /></P>} />
              <Route path="/executive-dashboard" element={<P><ExecutiveDashboard /></P>} />
              <Route path="/ai-insights"        element={<P><AIInsights /></P>} />
              <Route path="/collaboration"      element={<P><Collaboration /></P>} />
              <Route path="/data-management"    element={<P><DataManagement /></P>} />
              <Route path="/accuracy-center"    element={<P><AccuracyCenter /></P>} />
              <Route path="/executive-reports"  element={<P><ExecutiveReports /></P>} />

              {/* Phase 6 */}
              <Route path="/organizations"        element={<P><OrgManagement /></P>} />
              <Route path="/approval-workflow"    element={<P><ApprovalWorkflow /></P>} />
              <Route path="/workflow-automation"  element={<P><WorkflowAutomation /></P>} />
              <Route path="/strategic-planning"   element={<P><StrategicPlanning /></P>} />
              <Route path="/governance"           element={<P><GovernanceCenter /></P>} />
              <Route path="/kpi-management"       element={<P><KPIManagement /></P>} />
              <Route path="/data-quality"         element={<P><DataQuality /></P>} />
              <Route path="/command-center"       element={<P><CommandCenter /></P>} />
              <Route path="/notification-center"  element={<P><NotificationCenter /></P>} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
