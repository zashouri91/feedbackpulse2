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
import Login from './pages/Login';
import Landing from './pages/Landing';
import { PasswordReset } from './components/auth/PasswordReset';
import FeedbackPage from './pages/feedback/FeedbackPage';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <GlobalErrorBoundary>
      <Router future={{ v7_relativeSplatPath: true }}>
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
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
        </Routes>
      </Router>
    </GlobalErrorBoundary>
  );
}

export default App;