import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { hasStoredSession } from '../utils/authGuard';

const ProtectedRoute: React.FC = () => {
  const hasSession = hasStoredSession();

  if (!hasSession) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

