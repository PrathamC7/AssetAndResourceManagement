import React from 'react';

export function ActivityLogsScreen({ onNavigate, user, onAction }) {
  const notifications = [
    { text: 'Laptop AF-0014 assigned to Priya shah', time: '2m ago' },
    { text: 'Maintenance request AF-0055 approved', time: '18m ago' },
    { text: 'Booking confirmed : Room B2 : 2:00 to 3:00 PM', time: '1h ago' },
    { text: 'Transfer approved : AF-0033 to facilities dept', time: '3h ago' },
    { text: 'Overdue return : AF-0021 was due 3 days ago', time: '1d ago' },
    { text: 'audit discrepancy flagged : AF-0088 damaged', time: '2d ago' }
  ];

  return (
    <div className="space-y-6 max-w-5xl w-full text-slate-800">
      
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2.5 pb-2 border-b border-slate-200">
        <button className="px-5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer">
          All
        </button>
        <button className="px-5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-colors">
          Alerts
        </button>
        <button className="px-5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-colors">
          Approvals
        </button>
        <button className="px-5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-colors">
          Bookings
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden mt-4">
        <div className="divide-y divide-slate-150">
          {notifications.map((notif, idx) => (
            <div key={idx} className="flex justify-between items-center px-6 py-4 hover:bg-slate-50/50 transition-colors text-sm font-semibold">
              <div className="flex items-center gap-3">
                {/* Small indicator pill */}
                <span className="w-2.5 h-2.5 rounded bg-blue-600/30 border border-blue-500"></span>
                <span className="text-slate-800">{notif.text}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">{notif.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}