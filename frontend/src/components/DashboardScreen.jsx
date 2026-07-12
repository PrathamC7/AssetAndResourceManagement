import React from 'react';

export function DashboardScreen({ onNavigate, user, onAction }) {
  const kpis = [
    { label: 'Available', value: 128 },
    { label: 'Allocated', value: 76 },
    { label: 'Available', value: 4 },
    { label: 'Active Bookings', value: 9 },
    { label: 'Pending Transfers', value: 3 },
    { label: 'Upcoming returns', value: 12 }
  ];

  const recentActivity = [
    'Laptop AF-0114 - allocated to Priya shah - IT dept',
    'Room B2 - booking confirmed - 2:00 to 3:00 PM',
    'Projector AF-0062 - maintenance resolved'
  ];

  return (
    <div className="space-y-6 max-w-6xl w-full">
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
      <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 text-sm text-red-600 font-semibold">
        3 assets overdue for return - flagged for follow-up
      </div>

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
          onClick={() => { if(typeof onNavigate === 'function') onNavigate('allocation'); }}
          className="bg-white hover:bg-slate-50 text-slate-700 font-medium px-6 py-2.5 rounded-lg text-sm transition-colors border border-slate-300 shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span>Raise requests</span>
        </button>
      </div>

      {/* Recent Activity Section */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
        <ul className="space-y-3">
          {recentActivity.map((activity, idx) => (
            <li key={idx} className="text-sm text-slate-600 font-medium list-disc ml-5 leading-relaxed">
              {activity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}