import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LoginScreen } from './components/LoginScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { OrgSetupScreen } from './components/OrgSetupScreen';
import { AssetsScreen } from './components/AssetsScreen';
import { AllocationScreen } from './components/AllocationScreen';
import { BookingScreen } from './components/BookingScreen';
import { MaintenanceScreen } from './components/MaintenanceScreen';
import { AuditScreen } from './components/AuditScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { ActivityLogsScreen } from './components/ActivityLogsScreen';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const navigate = useNavigate();

  // Force document to Light Mode always and prevent color-scheme inverting
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('light');
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }, []);

  // Authenticate user with mock administrator data
  const handleLogin = (email, password) => {
    const mockUser = {
      name: 'Alex Henderson',
      email: email || 'alex@company.com',
      role: 'ADMIN',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6igkTBhqNxW9N82gJubEHeLUssuqLzY0gP1WlRQs_cqzXL5tAONze_79-_3fkGbQy4gVxkhXmb9RC42RMOddTH_gz7WAMVA8OQ-wrPE9JfZcch7jewM9V9_nx9Ozc9YOGDZ7E6UT6-3xcrrh99bImQEJI9Ar5hVHDmdwMQpeWV6bMUN5osRmEeSKYVIEk64KFOWUcmo5-mkvfdMKPIZ8rkPOwIHdN6GO5whaDNPX634ThTZ2b3-6dKg'
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAction = (actionType, event) => {
    console.log(`Action: ${actionType}`, event);
    if (actionType === 'submit') {
      handleLogin();
    }
  };

  // Layout wrapper component containing Sidebar, Header, and Outlet
  function MainLayout() {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
      { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { path: '/org-setup', label: 'Organization setup', icon: 'settings_suggest' },
      { path: '/assets', label: 'Assets', icon: 'inventory_2' },
      { path: '/allocation', label: 'Allocation & Transfer', icon: 'assignment_ind' },
      { path: '/booking', label: 'Resource Booking', icon: 'event_available' },
      { path: '/maintenance', label: 'Maintenance', icon: 'build' },
      { path: '/audit', label: 'Audit', icon: 'fact_check' },
      { path: '/reports', label: 'Reports', icon: 'analytics' },
      { path: '/notifications', label: 'Notifications', icon: 'notifications' }
    ];

    // Redirect to login if user session is null
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return (
      <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-800 font-sans">
        
        {/* Side Navigation (Clean Premium White sidebar with Slate borders) */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white text-slate-700 flex flex-col py-4 px-5 transition-transform duration-300 transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-slate-200`}>
          
          {/* Branding */}
          <div className="mb-3 px-1 flex justify-start">
            <img src="/logo_horizontal.png" alt="AssetFlow Logo" className="h-11 w-auto object-contain" />
          </div>

          {/* Links */}
          <nav className="flex-grow space-y-0.5 overflow-y-auto pr-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all text-left ${isActive ? 'bg-slate-100 text-slate-950 font-bold border-l-4 border-slate-950' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Card */}
          <div className="mt-auto pt-4 border-t border-slate-200 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                <img className="w-full h-full object-cover" src={user.avatarUrl} alt="User Profile" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Panel */}
        <div className="flex-grow flex flex-col h-full overflow-hidden bg-white">
          
          {/* Header */}
          <header className="bg-white flex items-center justify-between px-10 h-20 w-full border-b border-slate-200 shadow-sm shrink-0">
            <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div className="relative w-full max-w-md hidden sm:block">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input 
                  className="w-full pl-12 pr-4 py-2 bg-slate-100 border border-slate-200 focus:border-slate-300 focus:bg-white rounded-lg text-sm transition-all text-slate-900 placeholder-slate-400 outline-none" 
                  placeholder="Global Search..." 
                  type="text"
                />
              </div>
            </div>
            
            {/* Header Right Icons */}
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all rounded-full relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all rounded-full">
                <span className="material-symbols-outlined">help_outline</span>
              </button>
            </div>
          </header>

          {/* Dynamic Inner Page Screen using Outlet */}
          <main className="flex-grow overflow-y-auto p-8 relative">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Login Route */}
      <Route 
        path="/login" 
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-4 relative overflow-hidden">
              <LoginScreen 
                onNavigate={(tab) => navigate(`/${tab.replace('_', '-')}`)} 
                user={user} 
                onAction={handleAction} 
              />
            </div>
          )
        } 
      />

      {/* Main Layout containing Children Outlets */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Outlet Pages */}
        <Route path="dashboard" element={<DashboardScreen onNavigate={(tab) => navigate(`/${tab.replace('_', '-')}`)} user={user} onAction={handleAction} />} />
        <Route path="org-setup" element={<OrgSetupScreen onNavigate={(tab) => navigate(`/${tab.replace('_', '-')}`)} user={user} onAction={handleAction} />} />
        <Route path="assets" element={<AssetsScreen onNavigate={(tab) => navigate(`/${tab.replace('_', '-')}`)} user={user} onAction={handleAction} />} />
        <Route path="allocation" element={<AllocationScreen onNavigate={(tab) => navigate(`/${tab.replace('_', '-')}`)} user={user} onAction={handleAction} />} />
        <Route path="booking" element={<BookingScreen onNavigate={(tab) => navigate(`/${tab.replace('_', '-')}`)} user={user} onAction={handleAction} />} />
        <Route path="maintenance" element={<MaintenanceScreen onNavigate={(tab) => navigate(`/${tab.replace('_', '-')}`)} user={user} onAction={handleAction} />} />
        <Route path="audit" element={<AuditScreen onNavigate={(tab) => navigate(`/${tab.replace('_', '-')}`)} user={user} onAction={handleAction} />} />
        <Route path="reports" element={<ReportsScreen onNavigate={(tab) => navigate(`/${tab.replace('_', '-')}`)} user={user} onAction={handleAction} />} />
        <Route path="notifications" element={<ActivityLogsScreen onNavigate={(tab) => navigate(`/${tab.replace('_', '-')}`)} user={user} onAction={handleAction} />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
