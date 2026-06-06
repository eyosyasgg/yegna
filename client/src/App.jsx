import React from 'react';
import './styles/index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/layout/Navbar';
import Spinner from './components/ui/Spinner';
import { ToastProvider } from './components/ui/Toast';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream"><Spinner /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function NonAuthLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream"><Spinner /></div>;
  return (<> <Navbar /> {children} </>);
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6 p-8">
          <h1 className="font-display text-[3rem] text-near-black">Oops!</h1>
          <p className="font-body text-warm-gray">Something went wrong.</p>
          <button onClick={() => window.location.href = '/'} className="px-8 py-3 bg-amber text-white rounded-[9999px] font-body font-semibold">Go Home</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<NonAuthLayout><Landing /></NonAuthLayout>} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/onboarding" element={<AuthGuard><Onboarding /></AuthGuard>} />
              <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
              <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
