import React from 'react';

export function AssetsScreen({ onNavigate, user, onAction }) {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-margin-desktop custom-scrollbar"><div className="flex-1 overflow-y-auto p-margin-desktop space-y-gutter">
{/* Dashboard Controls & Actions */}
<div className="flex flex-wrap items-center justify-between gap-md">
<div className="flex flex-1 min-w-[300px] items-center gap-sm bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-md py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
<span className="material-symbols-outlined text-outline" data-icon="search">search</span>
<input className="bg-transparent border-none focus:ring-0 w-full font-body-md text-on-surface placeholder:text-outline/60" placeholder="Search by tag, serial, or QR code..." type="text"/>
<span className="material-symbols-outlined text-outline/50 cursor-pointer hover:text-outline" data-icon="qr_code_scanner">qr_code_scanner</span>
</div>
<div className="flex items-center gap-sm">
<button className="flex items-center gap-xs px-md py-2.5 bg-surface-container-highest/20 hover:bg-surface-container-highest/40 text-on-surface rounded-xl font-button transition-all border border-outline-variant/30">
<span className="material-symbols-outlined" data-icon="filter_list">filter_list</span>
<span>Advanced Filters</span>
</button>
<button className="flex items-center gap-xs px-lg py-2.5 bg-primary text-on-primary rounded-xl font-button shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
<span className="material-symbols-outlined" data-icon="add">add</span>
<span>Register Asset</span>
</button>
</div>
</div>
{/* Stats/Metrics Row (Bento Style) */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<div className="col-span-1 md:col-span-2 bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between overflow-hidden relative group">
<div className="flex justify-between items-start mb-md">
<div>
<p className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase">Utilization Overview</p>
<h3 className="font-headline-xl text-headline-xl text-primary">84.2%</h3>
</div>
<div className="px-sm py-1 bg-success/10 text-success text-label-md rounded-full font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]" data-icon="trending_up">trending_up</span>
                            +2.4%
                        </div>
</div>
{/* Simplified Visual Bar */}
<div className="h-12 w-full bg-surface-container rounded-lg relative overflow-hidden flex">
<div className="h-full bg-primary/80 transition-all duration-1000" style={{ width: "84.2%;" }}></div>
<div className="h-full bg-secondary/20" style={{ width: "15.8%;" }}></div>
</div>
<p className="mt-md font-body-sm text-body-sm text-on-surface-variant">Active deployments are at peak capacity across the Bengaluru HQ.</p>
{/* Visual decoration */}
<div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity">
<span className="material-symbols-outlined text-[160px]" data-icon="analytics">analytics</span>
</div>
</div>
<div className="bg-error-container/20 p-md rounded-xl shadow-sm border border-error/10 flex flex-col h-full">
<div className="flex items-center gap-sm mb-md">
<div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
<span className="material-symbols-outlined" data-icon="notification_important">notification_important</span>
</div>
<p className="font-label-md text-label-md text-on-error-container font-bold uppercase tracking-wider">Maintenance Alert</p>
</div>
<h3 className="font-headline-md text-headline-md text-on-error-container mb-sm">12 Critical Items</h3>
<p className="font-body-sm text-body-sm text-on-error-container/80 flex-1">Assets requiring immediate safety inspection or repair to prevent workflow disruption.</p>
<button className="mt-lg w-full py-2.5 bg-error text-on-error rounded-xl font-button hover:opacity-90 transition-all flex items-center justify-center gap-sm">
                        View Schedule
                        <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
{/* Asset Directory Table Container */}
<div className="bg-surface-light rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
<div className="px-md py-sm border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low/30">
<div className="flex items-center gap-gutter">
<button className="text-primary font-button border-b-2 border-primary py-2 px-1">All Assets</button>
<button className="text-on-surface-variant font-button hover:text-primary transition-colors py-2 px-1">Electronics</button>
<button className="text-on-surface-variant font-button hover:text-primary transition-colors py-2 px-1">Furniture</button>
</div>
<div className="flex gap-sm">
<button className="p-2 text-on-surface-variant hover:bg-surface-container transition-all rounded-lg">
<span className="material-symbols-outlined" data-icon="download">download</span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-surface-container transition-all rounded-lg">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low/50">
<th className="px-md py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tag ID</th>
<th className="px-md py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Asset Name</th>
<th className="px-md py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Category</th>
<th className="px-md py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
<th className="px-md py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Location</th>
<th className="px-md py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/20">
{/* Row 1 */}
<tr className="hover:bg-surface-container-low/30 transition-colors group">
<td className="px-md py-md font-mono text-sm text-primary font-semibold">AF-0012</td>
<td className="px-md py-md">
<div className="flex items-center gap-sm">
<div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
<span className="material-symbols-outlined text-secondary" data-icon="laptop_mac">laptop_mac</span>
</div>
<span className="font-body-md text-on-surface">Dell XPS 15 9520</span>
</div>
</td>
<td className="px-md py-md text-on-surface-variant font-body-sm">Electronics</td>
<td className="px-md py-md">
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold bg-primary/10 text-primary uppercase">
                                        Allocated
                                    </span>
</td>
<td className="px-md py-md text-on-surface-variant font-body-sm">Bengaluru - HQ</td>
<td className="px-md py-md text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="open_in_new">open_in_new</span>
</button>
</td>
</tr>
{/* Row 2 */}
<tr className="hover:bg-surface-container-low/30 transition-colors group">
<td className="px-md py-md font-mono text-sm text-primary font-semibold">AF-0062</td>
<td className="px-md py-md">
<div className="flex items-center gap-sm">
<div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
<span className="material-symbols-outlined text-secondary" data-icon="videocam">videocam</span>
</div>
<span className="font-body-md text-on-surface">Epson Pro Projector</span>
</div>
</td>
<td className="px-md py-md text-on-surface-variant font-body-sm">Electronics</td>
<td className="px-md py-md">
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold bg-warning/10 text-warning uppercase">
                                        Maintenance
                                    </span>
</td>
<td className="px-md py-md text-on-surface-variant font-body-sm">HQ Floor 2</td>
<td className="px-md py-md text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="open_in_new">open_in_new</span>
</button>
</td>
</tr>
{/* Row 3 */}
<tr className="hover:bg-surface-container-low/30 transition-colors group">
<td className="px-md py-md font-mono text-sm text-primary font-semibold">AF-0201</td>
<td className="px-md py-md">
<div className="flex items-center gap-sm">
<div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
<span className="material-symbols-outlined text-secondary" data-icon="chair">chair</span>
</div>
<span className="font-body-md text-on-surface">Herman Miller Aeron</span>
</div>
</td>
<td className="px-md py-md text-on-surface-variant font-body-sm">Furniture</td>
<td className="px-md py-md">
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold bg-success/10 text-success uppercase">
                                        Available
                                    </span>
</td>
<td className="px-md py-md text-on-surface-variant font-body-sm">Warehouse B</td>
<td className="px-md py-md text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="open_in_new">open_in_new</span>
</button>
</td>
</tr>
{/* Row 4 */}
<tr className="hover:bg-surface-container-low/30 transition-colors group">
<td className="px-md py-md font-mono text-sm text-primary font-semibold">AF-0941</td>
<td className="px-md py-md">
<div className="flex items-center gap-sm">
<div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
<span className="material-symbols-outlined text-secondary" data-icon="print">print</span>
</div>
<span className="font-body-md text-on-surface">HP LaserJet Pro</span>
</div>
</td>
<td className="px-md py-md text-on-surface-variant font-body-sm">Electronics</td>
<td className="px-md py-md">
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold bg-primary/10 text-primary uppercase">
                                        Allocated
                                    </span>
</td>
<td className="px-md py-md text-on-surface-variant font-body-sm">Mumbai Office</td>
<td className="px-md py-md text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="open_in_new">open_in_new</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="px-md py-md border-t border-outline-variant/20 flex items-center justify-between">
<p className="font-body-sm text-body-sm text-on-surface-variant">Showing 4 of 42 assets</p>
<div className="flex items-center gap-sm">
<button className="p-2 border border-outline-variant/30 rounded-lg hover:bg-surface-container-low disabled:opacity-50" disabled="">
<span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
</button>
<button className="p-2 border border-outline-variant/30 rounded-lg hover:bg-surface-container-low">
<span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
</div>
</div><div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div><div className="absolute bottom-0 left-0 w-64 h-64 bg-success/5 rounded-full blur-[100px] pointer-events-none -z-10"></div></div>
    </>
  );
}
