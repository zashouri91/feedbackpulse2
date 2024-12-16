import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalErrorBoundary } from './components/common/GlobalErrorBoundary';
import DashboardLayout from './components/Layout/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import UserList from './pages/users/UserList';
import LocationList from './pages/locations/LocationList';
import GroupList from './pages/groups/GroupList';
import SurveyList from './pages/surveys/SurveyList';
import NewSurvey from './pages/surveys/NewSurvey';
import SignaturesList from './pages/signatures/SignaturesList';
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';
import Login from './pages/Login';
import Landing from './pages/Landing';
import { PasswordReset } from './components/auth/PasswordReset';
import FeedbackPage from './pages/feedback/FeedbackPage';
import { useAuthStore } from './store/authStore';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { useAuth } from './hooks/useAuth';

function AppRoutes() {
  const { isAuthenticated, isInitialized } = useAuthStore();
  // Initialize auth hook inside Router context
  useAuth();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />
      } />
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
      } />
      <Route path="/reset-password" element={<PasswordReset />} />
      <Route path="/feedback/:trackingCode" element={<FeedbackPage />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="locations" element={<LocationList />} />
        <Route path="groups" element={<GroupList />} />
        <Route path="surveys" element={<SurveyList />} />
        <Route path="surveys/new" element={<NewSurvey />} />
        <Route path="signatures" element={<SignaturesList />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <GlobalErrorBoundary>
      <Router future={{ v7_relativeSplatPath: true }}>
        <AppRoutes />
      </Router>
    </GlobalErrorBoundary>
  );
}

export default App;