import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAppDispatch } from './hooks';
import { loginSuccess } from './features/auth/authSlice';
import { loadAuthSession } from './features/auth/authStorage';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const stored = loadAuthSession();

    if (stored) {
      dispatch(
        loginSuccess({
          user: stored.user,
          accessToken: stored.accessToken,
          refreshToken: stored.refreshToken,
          rememberMe: stored.storageType === 'local',
        }),
      );
    }
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/products" element={<ProductsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
};

export default App;

