import { useState, useEffect } from 'react';
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
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Authenticate user with mock administrator data
  const handleLogin = (email, password) => {
    setUser({
      name: 'Alex Henderson',
      email: email || 'alex@company.com',
      role: 'ADMIN',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6igkTBhqNxW9N82gJubEHeLUssuqLzY0gP1WlRQs_cqzXL5tAONze_79-_3fkGbQy4gVxkhXmb9RC42RMOddTH_gz7WAMVA8OQ-wrPE9JfZcch7jewM9V9_nx9Ozc9YOGDZ7E6UT6-3xcrrh99bImQEJI9Ar5hVHDmdwMQpeWV6bMUN5osRmEeSKYVIEk64KFOWUcmo5-mkvfdMKPIZ8rkPOwIHdN6GO5whaDNPX634ThTZ2b3-6dKg'
    });
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Callback to capture actions from sub-screens
  const handleAction = (actionType, event) => {
    console.log(`Action captured: ${actionType}`, event);
    if (actionType === 'submit' && !user) {
      handleLogin();
    } else if (actionType === 'logout') {
      handleLogout();
    }
  };

  // If user is not logged in, render the login page centered
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <LoginScreen 
          onNavigate={setActiveTab} 
          user={user} 
          onAction={handleAction} 
        />
      </div>
    );
  }

  // Sidebar navigation options
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'org_setup', label: 'Org Setup', icon: 'settings_suggest' },
    { id: 'assets', label: 'Assets', icon: 'inventory_2' },
    { id: 'allocation', label: 'Allocation', icon: 'assignment_ind' },
    { id: 'booking', label: 'Booking', icon: 'event_available' },
    { id: 'maintenance', label: 'Maintenance', icon: 'build' },
    { id: 'audit', label: 'Audit', icon: 'fact_check' },
    { id: 'reports', label: 'Reports', icon: 'analytics' },
    { id: 'activity_logs', label: 'Activity Logs', icon: 'history' }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Side Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col p-6 transition-transform duration-300 transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Branding */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <span className="material-symbols-outlined font-bold text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AssetFlow</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold opacity-70">Enterprise ERP</p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all text-left ${activeTab === item.id ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Card */}
        <div className="mt-auto pt-6 border-t border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-700">
              <img className="w-full h-full object-cover" src={user.avatarUrl} alt="User Profile" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#f7f9fb]">
        {/* TopAppBar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md flex items-center justify-between px-10 h-20 w-full border-b border-slate-200">
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
                className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-600/50 text-sm transition-all" 
                placeholder="Global Search..." 
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-600 hover:bg-slate-100 transition-all rounded-full relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-slate-600 hover:bg-slate-100 transition-all rounded-full">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
          </div>
        </header>

        {/* Dynamic Inner Page Screen */}
        <main className="flex-1 overflow-y-auto relative">
          {activeTab === 'dashboard' && <DashboardScreen onNavigate={setActiveTab} user={user} onAction={handleAction} />}
          {activeTab === 'org_setup' && <OrgSetupScreen onNavigate={setActiveTab} user={user} onAction={handleAction} />}
          {activeTab === 'assets' && <AssetsScreen onNavigate={setActiveTab} user={user} onAction={handleAction} />}
          {activeTab === 'allocation' && <AllocationScreen onNavigate={setActiveTab} user={user} onAction={handleAction} />}
          {activeTab === 'booking' && <BookingScreen onNavigate={setActiveTab} user={user} onAction={handleAction} />}
          {activeTab === 'maintenance' && <MaintenanceScreen onNavigate={setActiveTab} user={user} onAction={handleAction} />}
          {activeTab === 'audit' && <AuditScreen onNavigate={setActiveTab} user={user} onAction={handleAction} />}
          {activeTab === 'reports' && <ReportsScreen onNavigate={setActiveTab} user={user} onAction={handleAction} />}
          {activeTab === 'activity_logs' && <ActivityLogsScreen onNavigate={setActiveTab} user={user} onAction={handleAction} />}
        </main>
      </div>
    </div>
  );
}

export default App;
