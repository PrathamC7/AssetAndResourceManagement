import React, { useState, useEffect } from 'react';
import { getDashboardSummary, getActivityLogs } from '../services/api';

export function DashboardScreen({ onNavigate, user, onAction, summary: propSummary, setSummary: setPropSummary }) {
  const [summary, setSummary] = useState(propSummary || null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(!summary);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!summary) setLoading(true);
        // Fetch dashboard summary
        const summaryRes = await getDashboardSummary();
        const data = summaryRes.data.data;
        setSummary(data);
        if (setPropSummary) setPropSummary(data);

        // Fetch recent activity logs
        try {
          const logsRes = await getActivityLogs({ size: 5 });
          setActivities(logsRes.data.data?.content || []);
        } catch (logErr) {
          // non-critical
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading today's overview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-[12px] p-6 text-sm text-red-600 font-semibold max-w-lg mx-auto mt-10">
        <h3 className="text-base font-bold mb-2">Error Loading Dashboard</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const kpis = [
    { label: 'Available Assets', value: summary?.assetsAvailable ?? 0 },
    { label: 'Allocated Assets', value: summary?.assetsAllocated ?? 0 },
    { label: 'Under Maintenance', value: summary?.assetsUnderMaintenance ?? 0 },
    { label: 'Active Bookings', value: summary?.activeBookings ?? 0 },
    { label: 'Pending Transfers', value: summary?.pendingTransfers ?? 0 },
    { label: 'Overdue Returns', value: summary?.overdueReturns ?? 0 }
  ];

  return (
    <div className="space-y-6 max-w-6xl w-full pb-24">
      {/* Title */}
      <h2 className="text-xl font-bold text-slate-900 mb-6">Today's Overview</h2>
 
      {/* Grid: 6 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-200 p-5 rounded-[12px] shadow-sm flex flex-col justify-between">
            <span className="text-sm font-semibold text-slate-500">{kpi.label}</span>
            <span className="text-2xl font-bold text-slate-900 mt-2">{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* Overdue alert */}
      {summary?.overdueReturns > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 text-sm text-red-600 font-semibold">
          {summary.overdueReturns} assets overdue for return - flagged for follow-up
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-2">
        <button 
          onClick={() => { if(typeof onNavigate === 'function') onNavigate('assets'); }}
          className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors border border-transparent shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span>+ register asset</span>
        </button>
        <button 
          onClick={() => { if(typeof onNavigate === 'function') onNavigate('booking'); }}
          className="bg-white hover:bg-slate-50 text-slate-700 font-medium px-6 py-2.5 rounded-lg text-sm transition-colors border border-slate-300 shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span>Book resource</span>
        </button>
        <button 
          onClick={() => { if(typeof onNavigate === 'function') onNavigate('maintenance'); }}
          className="bg-white hover:bg-slate-50 text-slate-700 font-medium px-6 py-2.5 rounded-lg text-sm transition-colors border border-slate-300 shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span>Raise Maintenance Request</span>
        </button>
      </div>

      {/* Recent Activity Section */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
        <ul className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <li key={activity.id} className="text-sm text-slate-600 font-medium list-disc ml-5 leading-relaxed">
                <span className="font-bold text-slate-850">{activity.user?.name || 'System'}</span>:{' '}
                {activity.details || activity.action}{' '}
                <span className="text-xs text-slate-400 font-normal">
                  ({new Date(activity.createdAt).toLocaleString()})
                </span>
              </li>
            ))
          ) : (
            <li className="text-sm text-slate-450 italic ml-5">No recent activities logged yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}