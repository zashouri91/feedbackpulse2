import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <GlobalErrorBoundary>
      <Router future={{ v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/feedback/:trackingCode" element={<FeedbackPage />} />
          
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
        </Routes>
      </Router>
    </GlobalErrorBoundary>
  );
}

export default App;