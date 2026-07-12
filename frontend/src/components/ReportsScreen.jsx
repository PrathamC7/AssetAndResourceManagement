import React from 'react';

export function ReportsScreen({ onNavigate, user, onAction }) {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-margin-desktop custom-scrollbar"><div className="flex-1 overflow-y-auto custom-scrollbar p-margin-desktop bg-background space-y-gutter">
{/* Analytics Summary Row */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
{/* Utilization by Department (Bar Chart) */}
<div className="glass-card rounded-[18px] p-md shadow-sm">
<div className="flex justify-between items-start mb-8">
<div>
<h3 className="font-headline-md text-headline-md">Utilization by department</h3>
<p className="text-body-sm text-on-surface-variant">Asset distribution across core business units</p>
</div>
<button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
<span className="material-symbols-outlined text-on-surface-variant">more_horiz</span>
</button>
</div>
<div className="h-64 flex items-end justify-between px-md">
<div className="flex flex-col items-center gap-2 group">
<div className="w-12 bg-primary/20 rounded-t-lg relative chart-bar" style={{height: '45%'}}>
<div className="absolute inset-0 bg-primary rounded-t-lg transition-all duration-1000 opacity-80" style={{height: '100%'}}></div>
</div>
<span className="font-label-md text-[10px] uppercase text-on-surface-variant">ENG</span>
</div>
<div className="flex flex-col items-center gap-2 group">
<div className="w-12 bg-primary/20 rounded-t-lg relative chart-bar" style={{height: '75%'}}>
<div className="absolute inset-0 bg-primary rounded-t-lg transition-all duration-1000 opacity-80" style={{height: '100%'}}></div>
</div>
<span className="font-label-md text-[10px] uppercase text-on-surface-variant">OPS</span>
</div>
<div className="flex flex-col items-center gap-2 group">
<div className="w-12 bg-primary/20 rounded-t-lg relative chart-bar" style={{height: '30%'}}>
<div className="absolute inset-0 bg-primary rounded-t-lg transition-all duration-1000 opacity-80" style={{height: '100%'}}></div>
</div>
<span className="font-label-md text-[10px] uppercase text-on-surface-variant">HR</span>
</div>
<div className="flex flex-col items-center gap-2 group">
<div className="w-12 bg-primary/20 rounded-t-lg relative chart-bar" style={{height: '90%'}}>
<div className="absolute inset-0 bg-primary rounded-t-lg transition-all duration-1000 opacity-80" style={{height: '100%'}}></div>
</div>
<span className="font-label-md text-[10px] uppercase text-on-surface-variant">SALES</span>
</div>
<div className="flex flex-col items-center gap-2 group">
<div className="w-12 bg-primary/20 rounded-t-lg relative chart-bar" style={{height: '55%'}}>
<div className="absolute inset-0 bg-primary rounded-t-lg transition-all duration-1000 opacity-80" style={{height: '100%'}}></div>
</div>
<span className="font-label-md text-[10px] uppercase text-on-surface-variant">FIN</span>
</div>
</div>
</div>
{/* Maintenance Frequency (Line Chart) */}
<div className="glass-card rounded-[18px] p-md shadow-sm">
<div className="flex justify-between items-start mb-8">
<div>
<h3 className="font-headline-md text-headline-md">Maintenance Frequency</h3>
<p className="text-body-sm text-on-surface-variant">Fleet health &amp; service intervals over time</p>
</div>
<div className="flex bg-surface-container-low rounded-lg p-1">
<button className="px-3 py-1 bg-white shadow-sm rounded-md text-[11px] font-bold">W</button>
<button className="px-3 py-1 text-on-surface-variant text-[11px] font-bold">M</button>
</div>
</div>
<div className="relative h-64 overflow-hidden rounded-xl">
<svg className="w-full h-full drop-shadow-lg" viewbox="0 0 400 200">
<path d="M 0 160 Q 50 140 100 150 T 200 100 T 300 120 T 400 40" fill="none" stroke="#2563EB" stroke-linecap="round" stroke-width="3"></path>
<path d="M 0 160 Q 50 140 100 150 T 200 100 T 300 120 T 400 40 V 200 H 0 Z" fill="url(#gradient)" opacity="0.1"></path>
<defs>
<lineargradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="0%" style={{stopColor: '#2563eb', stopOpacity: '1'}}></stop>
<stop offset="100%" style={{stopColor: '#2563eb', stopOpacity: '0'}}></stop>
</lineargradient>
</defs>
<circle cx="100" cy="150" fill="#2563EB" r="4"></circle>
<circle cx="200" cy="100" fill="#2563EB" r="4"></circle>
<circle cx="300" cy="120" fill="#2563EB" r="4"></circle>
</svg>
</div>
</div>
</div>
{/* Detail Cards Grid */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
{/* Most Used Assets */}
<div className="glass-card rounded-[18px] p-md shadow-sm">
<div className="flex items-center gap-2 mb-4">
<span className="material-symbols-outlined text-primary">trending_up</span>
<h4 className="font-headline-md text-headline-md !text-lg">Most used assets</h4>
</div>
<ul className="space-y-4">
<li className="flex justify-between items-center p-3 hover:bg-surface-container-low transition-colors rounded-xl">
<div className="flex items-center gap-3">
<div className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center">
<span className="material-symbols-outlined text-on-secondary-container">meeting_room</span>
</div>
<div>
<p className="font-body-md text-body-sm">Room B2</p>
<p className="text-[11px] text-on-surface-variant">34 bookings this month</p>
</div>
</div>
<span className="font-bold text-success">+12%</span>
</li>
<li className="flex justify-between items-center p-3 hover:bg-surface-container-low transition-colors rounded-xl">
<div className="flex items-center gap-3">
<div className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center">
<span className="material-symbols-outlined text-on-secondary-container">local_shipping</span>
</div>
<div>
<p className="font-body-md text-body-sm">Van AF-343</p>
<p className="text-[11px] text-on-surface-variant">21 trips this month</p>
</div>
</div>
<span className="font-bold text-success">+5%</span>
</li>
</ul>
</div>
{/* Idle Assets */}
<div className="glass-card rounded-[18px] p-md shadow-sm">
<div className="flex items-center gap-2 mb-4">
<span className="material-symbols-outlined text-warning">timer_off</span>
<h4 className="font-headline-md text-headline-md !text-lg">Idle assets</h4>
</div>
<ul className="space-y-4">
<li className="flex justify-between items-center p-3 hover:bg-surface-container-low transition-colors rounded-xl">
<div className="flex items-center gap-3">
<div className="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant">camera_indoor</span>
</div>
<div>
<p className="font-body-md text-body-sm">Camera AF-0301</p>
<p className="text-[11px] text-on-surface-variant">Unused 60+ days</p>
</div>
</div>
<span className="font-bold text-danger">Alert</span>
</li>
<li className="flex justify-between items-center p-3 hover:bg-surface-container-low transition-colors rounded-xl">
<div className="flex items-center gap-3">
<div className="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant">chair</span>
</div>
<div>
<p className="font-body-md text-body-sm">Chair AF-0910</p>
<p className="text-[11px] text-on-surface-variant">Unused 45 days</p>
</div>
</div>
<span className="font-bold text-on-surface-variant opacity-40">...</span>
</li>
</ul>
</div>
{/* Summary CTA Card */}
<div className="bg-deep-navy rounded-[18px] p-md shadow-xl text-surface-light flex flex-col relative overflow-hidden">
<div className="relative z-10 h-full flex flex-col">
<h4 className="font-headline-md text-headline-md !text-lg mb-4">Annual performance overview</h4>
<p className="text-on-primary-container opacity-80 text-body-sm mb-auto">Fleet efficiency has increased by 14% compared to the previous fiscal year. Optimization strategies are currently saving ~$12k monthly in maintenance costs.</p>
<button className="w-full bg-primary-container text-on-primary-container font-button text-button py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all mt-6 shadow-lg shadow-primary/20">
                            Download PDF Summary
                        </button>
</div>
</div>
</div>
{/* Maintenance Table */}
<div className="glass-card rounded-[18px] p-md shadow-sm">
<div className="flex justify-between items-center mb-6">
<h4 className="font-headline-md text-headline-md !text-lg">Assets due for maintenance / nearing retirement</h4>
<button className="text-primary font-button text-button hover:underline flex items-center gap-1">
                        View schedule <span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="border-b border-outline-variant/30">
<tr>
<th className="pb-4 font-label-md text-label-md text-on-surface-variant uppercase">Asset ID</th>
<th className="pb-4 font-label-md text-label-md text-on-surface-variant uppercase">Model/Type</th>
<th className="pb-4 font-label-md text-label-md text-on-surface-variant uppercase">Status</th>
<th className="pb-4 font-label-md text-label-md text-on-surface-variant uppercase text-right">Deadline</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/20">
<tr className="group hover:bg-surface-container-low transition-colors">
<td className="py-4 font-bold text-body-sm">Forklift AF-0087</td>
<td className="py-4 text-body-sm">Heavy Machinery</td>
<td className="py-4">
<span className="px-3 py-1 bg-warning/10 text-warning rounded-full text-[10px] font-bold uppercase">Service Due</span>
</td>
<td className="py-4 text-right text-body-sm font-medium">in 5 days</td>
</tr>
<tr className="group hover:bg-surface-container-low transition-colors">
<td className="py-4 font-bold text-body-sm">Laptop AF-0020</td>
<td className="py-4 text-body-sm">IT Hardware</td>
<td className="py-4">
<span className="px-3 py-1 bg-danger/10 text-danger rounded-full text-[10px] font-bold uppercase">Nearing Retirement</span>
</td>
<td className="py-4 text-right text-body-sm font-medium">4 years old</td>
</tr>
</tbody>
</table>
</div>
</div>
{/* Footer Action */}
<div className="flex justify-end pt-4">
<button className="bg-primary text-on-primary px-10 py-3 rounded-xl font-button text-button shadow-lg shadow-primary/20 flex items-center gap-2 hover:-translate-y-1 transition-transform">
<span className="material-symbols-outlined">ios_share</span>
                    Export report
                </button>
</div>
</div></div>
    </>
  );
}
