import React from 'react';

export function DashboardScreen({ onNavigate, user, onAction }) {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-margin-desktop custom-scrollbar"><div className="p-margin-desktop space-y-lg">
{/* Section 1: Greeting */}
<section className="flex flex-col md:flex-row md:items-end justify-between gap-md">
<div>
<h2 className="font-headline-xl text-headline-xl text-on-surface">Good Morning, Alex</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Here's what's happening with your asset fleet today.</p>
</div>
<div className="flex gap-sm">
<div className="px-4 py-2 bg-surface-light shadow-soft rounded-xl flex items-center gap-2 border border-outline-variant/30">
<span className="material-symbols-outlined text-primary">calendar_today</span>
<span className="font-label-md text-label-md">Oct 24, 2023</span>
</div>
<div className="px-4 py-2 bg-surface-light shadow-soft rounded-xl flex items-center gap-2 border border-outline-variant/30">
<span className="material-symbols-outlined text-warning">bolt</span>
<span className="font-label-md text-label-md">12 Critical Tasks</span>
</div>
</div>
</section>
{/* Section 2: 6 KPI Cards */}
<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-md">
{/* Assets */}
<div className="bg-surface-light p-md rounded-card shadow-soft kpi-card transition-all duration-300 border border-transparent hover:border-primary/20">
<div className="flex items-start justify-between mb-2">
<span className="p-2 bg-primary-container/10 text-primary rounded-lg material-symbols-outlined">inventory_2</span>
<span className="text-success flex items-center font-label-md text-label-md"><span className="material-symbols-outlined text-[16px]">trending_up</span> 4%</span>
</div>
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Assets</p>
<h3 className="text-[36px] font-bold text-on-surface leading-tight">1,284</h3>
</div>
{/* Bookings */}
<div className="bg-surface-light p-md rounded-card shadow-soft kpi-card transition-all duration-300 border border-transparent hover:border-primary/20">
<div className="flex items-start justify-between mb-2">
<span className="p-2 bg-secondary-container/30 text-secondary rounded-lg material-symbols-outlined">event_available</span>
<span className="text-success flex items-center font-label-md text-label-md"><span className="material-symbols-outlined text-[16px]">trending_up</span> 12%</span>
</div>
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Bookings</p>
<h3 className="text-[36px] font-bold text-on-surface leading-tight">412</h3>
</div>
{/* Maintenance */}
<div className="bg-surface-light p-md rounded-card shadow-soft kpi-card transition-all duration-300 border border-transparent hover:border-primary/20">
<div className="flex items-start justify-between mb-2">
<span className="p-2 bg-error-container/40 text-error rounded-lg material-symbols-outlined">build</span>
<span className="text-error flex items-center font-label-md text-label-md"><span className="material-symbols-outlined text-[16px]">trending_down</span> 2%</span>
</div>
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">In Repair</p>
<h3 className="text-[36px] font-bold text-on-surface leading-tight">18</h3>
</div>
{/* Transfers */}
<div className="bg-surface-light p-md rounded-card shadow-soft kpi-card transition-all duration-300 border border-transparent hover:border-primary/20">
<div className="flex items-start justify-between mb-2">
<span className="p-2 bg-tertiary-fixed/40 text-tertiary rounded-lg material-symbols-outlined">move_up</span>
<span className="text-on-surface-variant flex items-center font-label-md text-label-md">0%</span>
</div>
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Transfers</p>
<h3 className="text-[36px] font-bold text-on-surface leading-tight">85</h3>
</div>
{/* Returns */}
<div className="bg-surface-light p-md rounded-card shadow-soft kpi-card transition-all duration-300 border border-transparent hover:border-primary/20">
<div className="flex items-start justify-between mb-2">
<span className="p-2 bg-info/10 text-info rounded-lg material-symbols-outlined">keyboard_return</span>
<span className="text-success flex items-center font-label-md text-label-md"><span className="material-symbols-outlined text-[16px]">trending_up</span> 8%</span>
</div>
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Returns</p>
<h3 className="text-[36px] font-bold text-on-surface leading-tight">142</h3>
</div>
{/* Audits */}
<div className="bg-surface-light p-md rounded-card shadow-soft kpi-card transition-all duration-300 border border-transparent hover:border-primary/20">
<div className="flex items-start justify-between mb-2">
<span className="p-2 bg-stripe-purple/10 text-stripe-purple rounded-lg material-symbols-outlined">fact_check</span>
<span className="text-success flex items-center font-label-md text-label-md"><span className="material-symbols-outlined text-[16px]">verified</span> 100%</span>
</div>
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Audits</p>
<h3 className="text-[36px] font-bold text-on-surface leading-tight">09</h3>
</div>
</section>
{/* Section 3: Modern Analytics */}
<section className="grid grid-cols-1 lg:grid-cols-2 gap-md">
{/* Bar Chart Card */}
<div className="bg-surface-light p-lg rounded-card shadow-soft relative overflow-hidden">
<div className="flex justify-between items-start mb-lg">
<div>
<h4 className="font-headline-md text-headline-md text-on-surface mb-1">Asset Utilization</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Efficiency across core categories</p>
</div>
<button className="p-2 hover:bg-surface-container rounded-lg">
<span className="material-symbols-outlined">more_vert</span>
</button>
</div>
<div className="h-64 flex items-end justify-between gap-4 px-2">
<div className="flex-1 flex flex-col items-center gap-2">
<div className="w-full bg-primary-container rounded-t-lg transition-all hover:brightness-110" style={{height: '85%'}}></div>
<span className="font-label-md text-label-md text-on-surface-variant">IT</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2">
<div className="w-full bg-primary rounded-t-lg transition-all hover:brightness-110" style={{height: '60%'}}></div>
<span className="font-label-md text-label-md text-on-surface-variant">Fleet</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2">
<div className="w-full bg-primary-fixed-dim rounded-t-lg transition-all hover:brightness-110" style={{height: '45%'}}></div>
<span className="font-label-md text-label-md text-on-surface-variant">Lab</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2">
<div className="w-full bg-primary-container rounded-t-lg transition-all hover:brightness-110" style={{height: '70%'}}></div>
<span className="font-label-md text-label-md text-on-surface-variant">Furn</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2">
<div className="w-full bg-primary rounded-t-lg transition-all hover:brightness-110" style={{height: '95%'}}></div>
<span className="font-label-md text-label-md text-on-surface-variant">AV</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2">
<div className="w-full bg-primary-fixed-dim rounded-t-lg transition-all hover:brightness-110" style={{height: '30%'}}></div>
<span className="font-label-md text-label-md text-on-surface-variant">Prod</span>
</div>
</div>
</div>
{/* Area Chart Card */}
<div className="bg-surface-light p-lg rounded-card shadow-soft relative overflow-hidden">
<div className="flex justify-between items-start mb-lg">
<div>
<h4 className="font-headline-md text-headline-md text-on-surface mb-1">Maintenance Trends</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Incidents vs. preventative maintenance</p>
</div>
<div className="flex gap-2">
<span className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant"><span className="w-2 h-2 rounded-full bg-primary"></span> Prev</span>
<span className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant"><span className="w-2 h-2 rounded-full bg-error"></span> Incident</span>
</div>
</div>
{/* Placeholder for "Smooth Area Chart" visual using CSS gradients/shapes */}
<div className="h-64 relative">
<svg className="w-full h-full" preserveaspectratio="none" viewbox="0 0 400 150">
<defs>
<lineargradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="0%" style={{stopColor: '#004ac6', stopOpacity: '0.2'}}></stop>
<stop offset="100%" style={{stopColor: '#004ac6', stopOpacity: '0'}}></stop>
</lineargradient>
</defs>
<path d="M0,120 C50,110 100,50 150,70 S250,20 300,50 S350,80 400,60 L400,150 L0,150 Z" fill="url(#grad1)"></path>
<path d="M0,120 C50,110 100,50 150,70 S250,20 300,50 S350,80 400,60" fill="none" stroke="#004ac6" stroke-width="3"></path>
<circle cx="150" cy="70" fill="#004ac6" r="4" stroke="#fff" stroke-width="2"></circle>
<circle cx="300" cy="50" fill="#004ac6" r="4" stroke="#fff" stroke-width="2"></circle>
</svg>
<div className="absolute inset-0 flex items-end justify-between px-2 pt-12">
<span className="font-label-md text-label-md text-on-surface-variant">Mon</span>
<span className="font-label-md text-label-md text-on-surface-variant">Tue</span>
<span className="font-label-md text-label-md text-on-surface-variant">Wed</span>
<span className="font-label-md text-label-md text-on-surface-variant">Thu</span>
<span className="font-label-md text-label-md text-on-surface-variant">Fri</span>
<span className="font-label-md text-label-md text-on-surface-variant">Sat</span>
<span className="font-label-md text-label-md text-on-surface-variant">Sun</span>
</div>
</div>
</div>
</section>
{/* Section 4 & 5: Activity and Quick Actions */}
<section className="grid grid-cols-1 xl:grid-cols-3 gap-md pb-xl">
{/* Recent Activity Feed */}
<div className="xl:col-span-2 bg-surface-light p-lg rounded-card shadow-soft">
<div className="flex items-center justify-between mb-lg">
<h4 className="font-headline-md text-headline-md text-on-surface">Recent Activity</h4>
<a className="text-primary font-button text-button hover:underline" href="#">View All History</a>
</div>
<div className="space-y-6">
<div className="flex gap-md relative">
<div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center shrink-0 z-10">
<span className="material-symbols-outlined text-primary text-sm">laptop_mac</span>
</div>
<div className="absolute left-5 top-10 w-0.5 h-full bg-surface-container-highest/50"></div>
<div className="flex-1 pb-2">
<p className="font-body-md text-body-md text-on-surface"><span className="font-bold">Laptop AF-0012</span> allocated to Sarah Jenkins</p>
<p className="font-label-md text-label-md text-on-surface-variant">Marketing Department • 12 mins ago</p>
</div>
</div>
<div className="flex gap-md relative">
<div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0 z-10">
<span className="material-symbols-outlined text-success text-sm">assignment_return</span>
</div>
<div className="absolute left-5 top-10 w-0.5 h-full bg-surface-container-highest/50"></div>
<div className="flex-1 pb-2">
<p className="font-body-md text-body-md text-on-surface"><span className="font-bold">Dell Monitor X-200</span> returned by David Chen</p>
<p className="font-label-md text-label-md text-on-surface-variant">Engineering HQ • 45 mins ago</p>
</div>
</div>
<div className="flex gap-md relative">
<div className="w-10 h-10 rounded-full bg-error-container/20 flex items-center justify-center shrink-0 z-10">
<span className="material-symbols-outlined text-error text-sm">construction</span>
</div>
<div className="absolute left-5 top-10 w-0.5 h-full bg-surface-container-highest/50"></div>
<div className="flex-1 pb-2">
<p className="font-body-md text-body-md text-on-surface"><span className="font-bold">Ford F-150 (V-092)</span> reported for emergency engine repair</p>
<p className="font-label-md text-label-md text-on-surface-variant">Fleet Logistics • 2 hours ago</p>
</div>
</div>
<div className="flex gap-md">
<div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center shrink-0 z-10">
<span className="material-symbols-outlined text-info text-sm">add_circle</span>
</div>
<div className="flex-1">
<p className="font-body-md text-body-md text-on-surface"><span className="font-bold">12 New Licenses</span> added for Adobe Creative Cloud</p>
<p className="font-label-md text-label-md text-on-surface-variant">Procurement • 4 hours ago</p>
</div>
</div>
</div>
</div>
{/* Floating Quick Actions Grid */}
<div className="bg-surface-light p-lg rounded-card shadow-soft border-2 border-primary-container/20 flex flex-col">
<h4 className="font-headline-md text-headline-md text-on-surface mb-lg">Quick Actions</h4>
<div className="grid grid-cols-2 gap-sm flex-1">
<button className="flex flex-col items-center justify-center p-md bg-surface-container-low hover:bg-primary-container hover:text-on-primary-container transition-all rounded-xl group">
<span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">add_box</span>
<span className="font-label-md text-label-md text-center">Register Asset</span>
</button>
<button className="flex flex-col items-center justify-center p-md bg-surface-container-low hover:bg-primary-container hover:text-on-primary-container transition-all rounded-xl group">
<span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">book_online</span>
<span className="font-label-md text-label-md text-center">Book Resource</span>
</button>
<button className="flex flex-col items-center justify-center p-md bg-surface-container-low hover:bg-primary-container hover:text-on-primary-container transition-all rounded-xl group">
<span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">swap_horiz</span>
<span className="font-label-md text-label-md text-center">Initiate Transfer</span>
</button>
<button className="flex flex-col items-center justify-center p-md bg-surface-container-low hover:bg-primary-container hover:text-on-primary-container transition-all rounded-xl group">
<span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">receipt_long</span>
<span className="font-label-md text-label-md text-center">Audit Scan</span>
</button>
<button className="flex flex-col items-center justify-center p-md bg-surface-container-low hover:bg-primary-container hover:text-on-primary-container transition-all rounded-xl group">
<span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">build_circle</span>
<span className="font-label-md text-label-md text-center">Log Repair</span>
</button>
<button className="flex flex-col items-center justify-center p-md bg-surface-container-low hover:bg-primary-container hover:text-on-primary-container transition-all rounded-xl group">
<span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">file_download</span>
<span className="font-label-md text-label-md text-center">Export Data</span>
</button>
</div>
<div className="mt-lg p-4 bg-primary-container/5 rounded-xl border border-primary-container/10">
<p className="font-label-md text-label-md text-primary mb-2 flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">lightbulb</span> Pro Tip
                            </p>
<p className="text-xs text-on-surface-variant leading-relaxed">
                                Use <kbd className="px-1.5 py-0.5 bg-surface-container-highest rounded border border-outline-variant text-[10px]">CMD + K</kbd> to access the global search and command palette instantly from anywhere.
                            </p>
</div>
</div>
</section>
</div></div>
    </>
  );
}
