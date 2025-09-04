import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import ProtectedRoute from "./components/ProtectedRoute"
import RoleRoute from "./components/RoleRoute"
import Navbar from "./components/Navbar"
import { ToastProvider, ToastViewport } from "./components/ui/toast"

// Pages
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import PlayerDashboard from "./pages/PlayerDashboard"
import CoachDashboard from "./pages/CoachDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import ClubManagement from "./pages/ClubManagement"
import Profile from "./pages/Profile"
import AboutUs from "./pages/AboutUs"
import Contact from "./pages/Contact"
import HelpCenter from "./pages/HelpCenter"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsOfService from "./pages/TermsOfService"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Role-based Routes - These are the main dashboards */}
              <Route path="/player-dashboard" element={
                <RoleRoute allowedRoles={['player']}>
                  <PlayerDashboard />
                </RoleRoute>
              } />
              <Route path="/coach-dashboard" element={
                <RoleRoute allowedRoles={['coach']}>
                  <CoachDashboard />
                </RoleRoute>
              } />
              <Route path="/admin-dashboard" element={
                <RoleRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleRoute>
              } />

              {/* General Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/clubs" element={
                <ProtectedRoute>
                  <ClubManagement />
                </ProtectedRoute>
              } />

              {/* Catch-all route - redirect to appropriate dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <ToastViewport />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
