import React, { useState, useEffect } from 'react';
import { useAppStore } from './store';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EmergencyButton } from './components/EmergencyButton';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import { DashboardPage } from './pages/DashboardPage';

// Features / Modules (Lazy Loaded)
const AiFanAssistant = React.lazy(() => import('./features/AiFanAssistant').then(m => ({ default: m.AiFanAssistant })));
const SmartCrowdManagement = React.lazy(() => import('./features/SmartCrowdManagement').then(m => ({ default: m.SmartCrowdManagement })));
const TransportAi = React.lazy(() => import('./features/TransportAi').then(m => ({ default: m.TransportAi })));
const AccessibilityCenter = React.lazy(() => import('./features/AccessibilityCenter').then(m => ({ default: m.AccessibilityCenter })));
const LiveTranslation = React.lazy(() => import('./features/LiveTranslation').then(m => ({ default: m.LiveTranslation })));
const EmergencyAi = React.lazy(() => import('./features/EmergencyAi').then(m => ({ default: m.EmergencyAi })));
const VolunteerHub = React.lazy(() => import('./features/VolunteerHub').then(m => ({ default: m.VolunteerHub })));
const SustainabilityHub = React.lazy(() => import('./features/SustainabilityHub').then(m => ({ default: m.SustainabilityHub })));
const DigitalTwin = React.lazy(() => import('./features/DigitalTwin').then(m => ({ default: m.DigitalTwin })));
const AdminCommandCenter = React.lazy(() => import('./features/AdminCommandCenter').then(m => ({ default: m.AdminCommandCenter })));
const AiAnnouncementGenerator = React.lazy(() => import('./features/AiAnnouncementGenerator').then(m => ({ default: m.AiAnnouncementGenerator })));

const queryClient = new QueryClient();

// Reusable Error Boundary component for app stability
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an uncaught exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6">
          <div className="h-16 w-16 rounded-full bg-rose-600/10 text-rose-500 flex items-center justify-center mb-4 border border-rose-500/25">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-slate-100">SmartHub Critical Error</h2>
          <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed">
            An unexpected error interrupted operations. Please restart the session by clearing local storage.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-5 py-2.5 bg-fifa-gold text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors"
          >
            Re-initialize Console
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Protected Route Shield
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useAppStore((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Module-level RBAC role mapping definition
const MODULE_ROLES: Record<string, string[]> = {
  'dashboard': ['fan', 'volunteer', 'organizer', 'security', 'admin'],
  'fan-assistant': ['fan', 'volunteer', 'admin'],
  'crowd-mgmt': ['fan', 'security', 'organizer', 'admin'],
  'transport-ai': ['fan', 'volunteer', 'organizer', 'admin'],
  'accessibility': ['fan', 'volunteer', 'organizer', 'admin'],
  'translation': ['fan', 'volunteer', 'organizer', 'admin'],
  'emergency': ['fan', 'volunteer', 'security', 'admin'],
  'volunteer-hub': ['volunteer', 'admin'],
  'sustainability': ['fan', 'organizer', 'admin'],
  'digital-twin': ['security', 'organizer', 'admin'],
  'admin-command': ['security', 'organizer', 'admin'],
  'announcement-gen': ['organizer', 'admin'],
};

const App: React.FC = () => {
  const user = useAppStore((state) => state.user);
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  // React on Auth Store changes
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Stitches active content modules with strict RBAC authorization guards
  const renderActiveModule = () => {
    const userRole = user?.role || 'fan';
    const allowedRoles = MODULE_ROLES[activeModule] || ['admin'];

    // Enforce role-based module checking
    if (!allowedRoles.includes(userRole)) {
      return <DashboardPage />;
    }

    switch (activeModule) {
      case 'dashboard':
        return <DashboardPage />;
      case 'fan-assistant':
        return <AiFanAssistant />;
      case 'crowd-mgmt':
        return <SmartCrowdManagement />;
      case 'transport-ai':
        return <TransportAi />;
      case 'accessibility':
        return <AccessibilityCenter />;
      case 'translation':
        return <LiveTranslation />;
      case 'emergency':
        return <EmergencyAi />;
      case 'volunteer-hub':
        return <VolunteerHub />;
      case 'sustainability':
        return <SustainabilityHub />;
      case 'digital-twin':
        return <DigitalTwin />;
      case 'admin-command':
        return <AdminCommandCenter />;
      case 'announcement-gen':
        return <AiAnnouncementGenerator />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen text-slate-100 selection:bg-fifa-gold selection:text-slate-950">
          <Routes>
            <Route path="/" element={<LandingPage onLaunch={() => navigate('/login')} />} />
            <Route path="/login" element={<LoginPage onBack={() => navigate('/')} />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <div className="flex flex-col min-h-screen bg-slate-950">
                    {/* Nav Header */}
                    <Header />

                    {/* Container for Sidebar and Workspace Content */}
                    <div className="flex flex-1 relative">
                      <Sidebar onModuleChange={setActiveModule} activeModule={activeModule} />
                      
                      {/* Workspace contents */}
                      <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-64px)] relative">
                        <React.Suspense fallback={
                          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3 py-20">
                            <span className="h-6 w-6 rounded-full border-2 border-slate-600 border-t-fifa-gold animate-spin" />
                            <span className="text-xxs font-mono uppercase tracking-widest text-slate-400">Loading Module...</span>
                          </div>
                        }>
                          {renderActiveModule()}
                        </React.Suspense>
                      </main>
                    </div>

                    {/* Floating SOS button */}
                    <EmergencyButton />
                  </div>
                </ProtectedRoute>
              } 
            />

            {/* Catch-all fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
