import React from 'react';

export function ActivityLogsScreen({ onNavigate, user, onAction }) {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-margin-desktop custom-scrollbar"><div className="p-margin-desktop space-y-lg max-w-6xl mx-auto w-full">
{/* Header Section */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
<div>
<h2 className="font-headline-xl text-headline-xl text-on-surface">Activity Logs</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Track system-wide updates, approvals, and allocation events in real-time.</p>
</div>
{/* Filter Tabs */}
<div className="flex bg-surface-container rounded-xl p-xs">
<button className="px-md py-xs rounded-lg font-button text-button bg-surface-light shadow-sm text-primary">All</button>
<button className="px-md py-xs rounded-lg font-button text-button text-on-surface-variant hover:bg-surface-container-high transition-all">Alerts</button>
<button className="px-md py-xs rounded-lg font-button text-button text-on-surface-variant hover:bg-surface-container-high transition-all">Approvals</button>
<button className="px-md py-xs rounded-lg font-button text-button text-on-surface-variant hover:bg-surface-container-high transition-all">Bookings</button>
</div>
</div>
{/* Main Activity Feed (Bento Style Layout) */}
<div className="grid grid-cols-1 gap-gutter">
{/* Today Section */}
<section className="space-y-sm">
<h3 className="font-label-md text-label-md text-outline uppercase tracking-wider">Today</h3>
<div className="bg-surface-light rounded-xl shadow-sm overflow-hidden divide-y divide-outline-variant/10">
{/* Critical Alert */}
<div className="p-md flex gap-md hover:bg-surface-container-low transition-colors group">
<div className="flex-shrink-0 w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h4 className="font-body-md text-body-md text-on-surface font-bold">Audit discrepancy flagged</h4>
<span className="font-label-md text-label-md text-on-surface-variant">2m ago</span>
</div>
<p className="text-body-sm text-on-surface-variant mt-xs">Asset <span className="font-bold text-primary">AF-0088 (Office Chair)</span> marked as <span className="text-error font-bold">Damaged</span> during Q3 Engineering Audit by <span className="font-medium text-on-surface">A. Rao</span>.</p>
<div className="mt-sm flex gap-xs">
<button className="text-primary font-button text-button hover:underline">View Report</button>
<span className="text-outline-variant">•</span>
<button className="text-on-surface-variant font-button text-button hover:text-on-surface">Dismiss</button>
</div>
</div>
</div>
{/* Assignment Log */}
<div className="p-md flex gap-md hover:bg-surface-container-low transition-colors">
<div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
<span className="material-symbols-outlined">assignment_ind</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h4 className="font-body-md text-body-md text-on-surface">Asset assigned to user</h4>
<span className="font-label-md text-label-md text-on-surface-variant">18m ago</span>
</div>
<p className="text-body-sm text-on-surface-variant mt-xs"><span className="font-bold text-primary">Laptop AF-0014</span> assigned to <span className="font-medium text-on-surface">Priya Shah</span> (Engineering Dept).</p>
</div>
</div>
{/* Approval Log */}
<div className="p-md flex gap-md hover:bg-surface-container-low transition-colors">
<div className="flex-shrink-0 w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary-container">
<span className="material-symbols-outlined">check_circle</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h4 className="font-body-md text-body-md text-on-surface">Maintenance request approved</h4>
<span className="font-label-md text-label-md text-on-surface-variant">1h ago</span>
</div>
<p className="text-body-sm text-on-surface-variant mt-xs">Request <span className="font-bold text-primary">AF-0055</span> for Server Room AC Repair was approved by System Admin.</p>
</div>
</div>
{/* Booking Log */}
<div className="p-md flex gap-md hover:bg-surface-container-low transition-colors">
<div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
<span className="material-symbols-outlined">event_available</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h4 className="font-body-md text-body-md text-on-surface">Booking confirmed</h4>
<span className="font-label-md text-label-md text-on-surface-variant">3h ago</span>
</div>
<p className="text-body-sm text-on-surface-variant mt-xs">Room <span className="font-bold text-on-surface">B2</span> booked for <span className="font-medium text-on-surface">2:00 PM - 3:00 PM</span> today by Facilities Team.</p>
</div>
</div>
</div>
</section>
{/* Yesterday Section */}
<section className="space-y-sm">
<h3 className="font-label-md text-label-md text-outline uppercase tracking-wider">Yesterday</h3>
<div className="bg-surface-light rounded-xl shadow-sm overflow-hidden divide-y divide-outline-variant/10">
{/* Transfer Log */}
<div className="p-md flex gap-md hover:bg-surface-container-low transition-colors">
<div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined">swap_horiz</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h4 className="font-body-md text-body-md text-on-surface">Transfer approved</h4>
<span className="font-label-md text-label-md text-on-surface-variant">1d ago</span>
</div>
<p className="text-body-sm text-on-surface-variant mt-xs">Asset <span className="font-bold text-primary">AF-0033</span> transfer from <span className="font-medium text-on-surface">Finance</span> to <span className="font-medium text-on-surface">Facilities Dept</span> completed.</p>
</div>
</div>
{/* Overdue Log */}
<div className="p-md flex gap-md hover:bg-surface-container-low transition-colors group">
<div className="flex-shrink-0 w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-warning">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h4 className="font-body-md text-body-md text-on-surface">Overdue return</h4>
<span className="font-label-md text-label-md text-on-surface-variant">1d ago</span>
</div>
<p className="text-body-sm text-on-surface-variant mt-xs">Projector <span className="font-bold text-primary">AF-0021</span> was due back <span className="text-warning font-bold">3 days ago</span>. Automated nudge sent to user.</p>
<button className="mt-sm bg-surface-container-low text-on-surface-variant font-button text-button px-sm py-xs rounded-lg hover:bg-surface-container-high transition-all">Send Manual Alert</button>
</div>
</div>
</div>
</section>
{/* Status Summary Widget */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<div className="bg-surface-light p-md rounded-xl shadow-sm border-l-4 border-primary">
<p className="font-label-md text-label-md text-outline uppercase">Active Events</p>
<p className="font-headline-md text-headline-md text-on-surface mt-xs">142</p>
<p className="text-body-sm text-success flex items-center gap-xs mt-xs">
<span className="material-symbols-outlined text-[16px]">trending_up</span>
                            +12% from last week
                        </p>
</div>
<div className="bg-surface-light p-md rounded-xl shadow-sm border-l-4 border-warning">
<p className="font-label-md text-label-md text-outline uppercase">Pending Approvals</p>
<p className="font-headline-md text-headline-md text-on-surface mt-xs">08</p>
<p className="text-body-sm text-on-surface-variant flex items-center gap-xs mt-xs">
                            Require immediate action
                        </p>
</div>
<div className="bg-surface-light p-md rounded-xl shadow-sm border-l-4 border-error">
<p className="font-label-md text-label-md text-outline uppercase">Critical Alerts</p>
<p className="font-headline-md text-headline-md text-on-surface mt-xs">03</p>
<p className="text-body-sm text-error flex items-center gap-xs mt-xs">
                            Last 24 hours
                        </p>
</div>
</div>
</div>
</div><nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-outline-variant/30 flex justify-around py-sm px-xs z-50">
<button className="flex flex-col items-center gap-xs text-on-surface-variant">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-[10px] font-bold">Home</span>
</button>
<button className="flex flex-col items-center gap-xs text-on-surface-variant">
<span className="material-symbols-outlined">inventory_2</span>
<span className="text-[10px] font-bold">Assets</span>
</button>
<button className="flex flex-col items-center gap-xs text-primary">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
<span className="text-[10px] font-bold">Logs</span>
</button>
<button className="flex flex-col items-center gap-xs text-on-surface-variant">
<span className="material-symbols-outlined">settings</span>
<span className="text-[10px] font-bold">Setup</span>
</button>
</nav></div>
    </>
  );
}
