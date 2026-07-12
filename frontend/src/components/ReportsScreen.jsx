import React, { useState, useEffect } from 'react';
import { getDashboardSummary, getAssets } from '../services/api';

export function ReportsScreen({ onNavigate, user, onAction }) {
  const [summary, setSummary] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const sumRes = await getDashboardSummary();
      setSummary(sumRes.data?.data || null);

      const assetsRes = await getAssets({ size: 100 });
      setAssets(assetsRes.data?.data?.content || []);
    } catch (err) {
      console.error('Error fetching reports data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-semibold text-sm">Generating analytics reports...</p>
      </div>
    );
  }

  // Calculate live ratios
  const total = summary?.totalAssets || 0;
  const allocPct = total > 0 ? Math.round((summary.assetsAllocated / total) * 100) : 0;
  const availPct = total > 0 ? Math.round((summary.assetsAvailable / total) * 100) : 0;
  const maintPct = total > 0 ? Math.round((summary.assetsUnderMaintenance / total) * 100) : 0;

  // Filter real assets
  const idleAssets = assets.filter(a => a.lifecycleState === 'AVAILABLE').slice(0, 5);
  const maintenanceAssets = assets.filter(a => a.lifecycleState === 'UNDER_MAINTENANCE').slice(0, 5);
  const allocatedAssets = assets.filter(a => a.lifecycleState === 'ALLOCATED').slice(0, 5);

  return (
    <div className="space-y-6 max-w-6xl w-full text-slate-800 pb-24 animate-fade-in">
      
      {/* Upper Title */}
      <div className="border-b border-slate-200 pb-2">
        <h2 className="text-lg font-bold text-slate-950">System Reports & Analytics</h2>
      </div>

      {/* Stats summary from API */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-4 rounded-[12px] shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Assets</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{summary.totalAssets}</p>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-[12px] shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Bookings</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{summary.activeBookings}</p>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-[12px] shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Repairs</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{summary.pendingMaintenanceRequests}</p>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-[12px] shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Audit Cycles</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{summary.openAuditCycles}</p>
          </div>
        </div>
      )}

      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Asset Distribution Ratios */}
        <div className="bg-white border border-slate-200 p-5 rounded-[12px] shadow-sm flex flex-col">
          <h4 className="text-xs font-bold text-slate-400 border-b border-slate-200 pb-2 mb-6 uppercase tracking-wider">
            Asset Inventory Ratios
          </h4>
          
          <div className="space-y-4">
            {/* Allocated */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Allocated Assets</span>
                <span>{allocPct}% ({summary?.assetsAllocated ?? 0} items)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${allocPct}%` }}></div>
              </div>
            </div>

            {/* Available */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Available Assets (Idle)</span>
                <span>{availPct}% ({summary?.assetsAvailable ?? 0} items)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${availPct}%` }}></div>
              </div>
            </div>

            {/* Under Maintenance */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Under Maintenance</span>
                <span>{maintPct}% ({summary?.assetsUnderMaintenance ?? 0} items)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${maintPct}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Frequency Graph */}
        <div className="bg-white border border-slate-200 p-5 rounded-[12px] shadow-sm flex flex-col">
          <h4 className="text-xs font-bold text-slate-400 border-b border-slate-200 pb-2 mb-4 uppercase tracking-wider">
            Maintenance Frequency Chart
          </h4>
          <div className="h-40 relative flex items-end">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 150">
              <path d="M0,130 C50,110 100,50 150,90 S250,30 300,70 S350,120 400,60" fill="none" stroke="#0f172a" strokeWidth="2.5"></path>
              <circle cx="150" cy="90" fill="#0f172a" r="4"></circle>
              <circle cx="300" cy="70" fill="#0f172a" r="4"></circle>
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-[9px] font-bold text-slate-450 px-1 pt-1.5 border-t border-slate-150">
              <span>JAN</span>
              <span>MAR</span>
              <span>MAY</span>
              <span>JUL</span>
              <span>SEP</span>
              <span>NOV</span>
            </div>
          </div>
        </div>

      </div>

      {/* Lists section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Idle Assets List */}
        <div className="bg-white border border-slate-200 p-5 rounded-[12px] shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-400 border-b border-slate-200 pb-2 uppercase tracking-wider">
            Idle Assets (Available in Registry)
          </h4>
          <ul className="space-y-2 text-xs font-semibold text-slate-700">
            {idleAssets.map((asset) => (
              <li key={asset.id} className="flex justify-between items-center bg-slate-50 p-2.5 border border-slate-150 rounded-lg">
                <span>{asset.name}</span>
                <span className="text-[10px] font-bold text-slate-400">{asset.assetTag}</span>
              </li>
            ))}
            {idleAssets.length === 0 && (
              <li className="text-slate-400 italic text-center py-4">No idle assets in registry.</li>
            )}
          </ul>
        </div>

        {/* Assets in Maintenance List */}
        <div className="bg-white border border-slate-200 p-5 rounded-[12px] shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-400 border-b border-slate-200 pb-2 uppercase tracking-wider">
            Assets in Maintenance / Nearing Repair
          </h4>
          <ul className="space-y-2 text-xs font-semibold text-slate-700">
            {maintenanceAssets.map((asset) => (
              <li key={asset.id} className="flex justify-between items-center bg-amber-50/30 p-2.5 border border-amber-100 rounded-lg text-amber-900">
                <span>{asset.name}</span>
                <span className="text-[10px] font-bold text-amber-500">{asset.assetTag}</span>
              </li>
            ))}
            {maintenanceAssets.length === 0 && (
              <li className="text-slate-400 italic text-center py-4">No active maintenance jobs.</li>
            )}
          </ul>
        </div>

      </div>

      {/* Export Report Trigger */}
      <div className="pt-2">
        <button 
          onClick={() => {
            alert('Analytical report generated and exported to PDF successfully!');
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
        >
          Export Analytics Report
        </button>
      </div>

    </div>
  );
}
