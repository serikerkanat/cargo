import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import RoutesPage from './pages/Routes';
import Contacts from './pages/Contacts';
import Analytics from './pages/Analytics';
import Login from './pages/Login';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="/orders" element={<Layout />}>
        <Route index element={<Orders />} />
      </Route>
      <Route path="/routes" element={<Layout />}>
        <Route index element={<RoutesPage />} />
      </Route>
      <Route path="/contacts" element={<Layout />}>
        <Route index element={<Contacts />} />
      </Route>
      <Route path="/analytics" element={<Layout />}>
        <Route index element={<Analytics />} />
      </Route>
    </Routes>
  );
}

function App() {
  console.log('App рендерится');

  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
