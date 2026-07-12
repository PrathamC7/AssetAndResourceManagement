import React, { useState, useEffect } from 'react';

export function ReportsScreen({ onNavigate, user, onAction }) {
  const [summary, setSummary] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = user?.token;

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

        const [summaryRes, assetsRes] = await Promise.all([
          fetch('/api/v1/dashboard/summary', { headers }),
          fetch('/api/v1/assets?size=100', { headers })
        ]);

        if (summaryRes.ok) {
          const d = await summaryRes.json();
          setSummary(d.data);
        }
        if (assetsRes.ok) {
          const d = await assetsRes.json();
          setAssets(d.data?.content || []);
        }
      } catch (err) {
        console.error('Error loading reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading reports...</p>
      </div>
    );
  }

  // Compute chart data from real assets
  const totalAssets = assets.length || 1;
  const available = assets.filter(a => a.lifecycleState === 'AVAILABLE').length;
  const allocated = assets.filter(a => a.lifecycleState === 'ALLOCATED').length;
  const maintenance = assets.filter(a => a.lifecycleState === 'UNDER_MAINTENANCE').length;

  const barData = [
    { label: 'AVAIL', height: `${Math.max((available / totalAssets) * 100, 5)}%` },
    { label: 'ALLOC', height: `${Math.max((allocated / totalAssets) * 100, 5)}%` },
    { label: 'MAINT', height: `${Math.max((maintenance / totalAssets) * 100, 5)}%` },
    { label: 'BOOK', height: `${Math.max(((summary?.activeBookings || 0) / Math.max(totalAssets, 1)) * 100, 5)}%` },
    { label: 'TRANS', height: `${Math.max(((summary?.pendingTransfers || 0) / Math.max(totalAssets, 1)) * 100, 5)}%` }
  ];

  return (
    <div className="space-y-6 max-w-6xl w-full text-slate-800 pb-24">
      
      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Utilization by status */}
        <div className="bg-white border border-slate-200 p-5 rounded-[12px] shadow-sm flex flex-col">
          <h4 className="text-sm font-bold text-slate-400 border-b border-slate-200 pb-2 mb-4">
            Asset Distribution
          </h4>
          <div className="h-44 flex items-end justify-between gap-4 px-2">
            {barData.map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-slate-900 rounded-t-md" style={{ height: bar.height }}></div>
                <span className="text-[10px] font-bold text-slate-400">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Frequency */}
        <div className="bg-white border border-slate-200 p-5 rounded-[12px] shadow-sm flex flex-col">
          <h4 className="text-sm font-bold text-slate-400 border-b border-slate-200 pb-2 mb-4">
            Maintenance Frequency
          </h4>
          <div className="h-44 relative flex items-end">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 150">
              <path d="M0,120 C50,110 100,50 150,70 S250,20 300,50 S350,80 400,60" fill="none" stroke="#0f172a" strokeWidth="2.5"></path>
              <circle cx="150" cy="70" fill="#0f172a" r="3"></circle>
              <circle cx="300" cy="50" fill="#0f172a" r="3"></circle>
            </svg>
          </div>
        </div>

      </div>

      {/* Lists section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Summary Stats */}
        <div className="bg-white border border-slate-200 p-5 rounded-[12px] shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-950">Asset Summary</h4>
          <ul className="space-y-2 text-xs text-slate-600 font-semibold">
            <li className="list-disc ml-4">Total Assets: {assets.length}</li>
            <li className="list-disc ml-4">Available: {available}</li>
            <li className="list-disc ml-4">Allocated: {allocated}</li>
            <li className="list-disc ml-4">Under Maintenance: {maintenance}</li>
            <li className="list-disc ml-4">Active Bookings: {summary?.activeBookings ?? 0}</li>
          </ul>
        </div>

        {/* Overdue & Transfers */}
        <div className="bg-white border border-slate-200 p-5 rounded-[12px] shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-950">Pending Actions</h4>
          <ul className="space-y-2 text-xs text-slate-600 font-semibold">
            <li className="list-disc ml-4">Pending Transfers: {summary?.pendingTransfers ?? 0}</li>
            <li className="list-disc ml-4">Overdue Returns: {summary?.overdueReturns ?? 0}</li>
          </ul>
        </div>

      </div>

      {/* Assets by category breakdown */}
      <div className="bg-white border border-slate-200 p-5 rounded-[12px] shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-950 border-b border-slate-200 pb-2">
          Assets by Category
        </h4>
        <ul className="space-y-2.5 text-xs text-slate-600 font-semibold">
          {Object.entries(
            assets.reduce((acc, a) => {
              const cat = a.categoryName || 'Uncategorized';
              acc[cat] = (acc[cat] || 0) + 1;
              return acc;
            }, {})
          ).map(([cat, count]) => (
            <li key={cat} className="list-disc ml-4 leading-relaxed">
              {cat}: {count} assets
            </li>
          ))}
          {assets.length === 0 && (
            <li className="ml-4 text-slate-400 italic">No assets registered yet.</li>
          )}
        </ul>
      </div>

      {/* Export report button */}
      <div className="pt-2">
        <button className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm cursor-pointer">
          Export report
        </button>
      </div>

    </div>
  );
}
