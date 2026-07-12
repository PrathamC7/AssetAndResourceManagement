import React from 'react';

export function AuditScreen({ onNavigate, user, onAction }) {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-margin-desktop custom-scrollbar"><div className="max-w-7xl mx-auto px-margin-desktop py-lg">
{/* Audit Header */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-lg">
<div>
<nav className="flex items-center gap-2 text-label-md font-label-md text-on-surface-variant mb-2">
<span>ASSETS</span>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span className="text-primary">AUDIT CYCLE</span>
</nav>
<h2 className="font-headline-xl text-headline-xl text-on-surface">Q3 Audit: Engineering Dept</h2>
<p className="font-body-md text-on-surface-variant mt-2 flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">group</span>
                        Auditors: A. Rao, S. Iqbal • Start Date: 15 Jul 2023
                    </p>
</div>
<div className="flex items-center gap-3">
<button className="px-6 py-3 bg-surface-container-highest/20 hover:bg-surface-container-highest/40 text-on-surface font-button rounded-xl transition-all flex items-center gap-2">
<span className="material-symbols-outlined">download</span>
                        Export Report
                    </button>
<button className="px-6 py-3 bg-primary text-on-primary font-button rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
<span className="material-symbols-outlined">check_circle</span>
                        Close Audit Cycle
                    </button>
</div>
</div>
{/* Discrepancy Banner */}
<div className="bg-error-container border border-error/10 rounded-xl p-md mb-gutter flex items-start gap-4 animate-pulse-subtle">
<div className="bg-on-error-container/10 p-2 rounded-lg">
<span className="material-symbols-outlined text-on-error-container">warning</span>
</div>
<div className="flex-1">
<h4 className="font-body-lg text-body-lg text-on-error-container font-bold">2 assets flagged for discrepancy</h4>
<p className="font-body-sm text-body-sm text-on-error-container opacity-80">Manual verification is required for flagged items. A discrepancy report has been auto-generated for the Facilities department.</p>
</div>
<button className="text-on-error-container font-button text-label-md underline underline-offset-4">View Report</button>
</div>
{/* Audit Table Container */}
<div className="bg-surface-light rounded-[18px] shadow-sm border border-outline-variant/30 overflow-hidden">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low">
<th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Asset ID</th>
<th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Asset Description</th>
<th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Expected Location</th>
<th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Current Custodian</th>
<th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Verification Status</th>
<th className="px-md py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/20">
{/* Row 1: Verified */}
<tr className="hover:bg-surface-container-lowest transition-colors group">
<td className="px-md py-5 font-label-md text-label-md text-primary font-bold">AF-0012</td>
<td className="px-md py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-secondary">laptop_mac</span>
</div>
<div>
<div className="font-body-md text-on-surface">Dell XPS 15 (2023)</div>
<div className="text-label-md font-label-md text-on-surface-variant opacity-60">S/N: 98765-ENG-21</div>
</div>
</div>
</td>
<td className="px-md py-5 font-body-sm text-on-surface">Desk E12 - Zone B</td>
<td className="px-md py-5 font-body-sm text-on-surface">Priya Shah</td>
<td className="px-md py-5">
<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success rounded-full font-label-md text-label-md border border-success/20">
<span className="material-symbols-outlined text-[14px]">verified</span>
                                    Verified
                                </span>
</td>
<td className="px-md py-5 text-right">
<button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-all">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
{/* Row 2: Missing */}
<tr className="hover:bg-surface-container-lowest transition-colors group bg-error-container/5">
<td className="px-md py-5 font-label-md text-label-md text-primary font-bold">AF-0062</td>
<td className="px-md py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-secondary">videocam</span>
</div>
<div>
<div className="font-body-md text-on-surface">Conference Cam Pro</div>
<div className="text-label-md font-label-md text-on-surface-variant opacity-60">S/N: CAM-32-411</div>
</div>
</div>
</td>
<td className="px-md py-5 font-body-sm text-on-surface">Meeting Room Delta</td>
<td className="px-md py-5 font-body-sm text-on-surface">Shared Resource</td>
<td className="px-md py-5">
<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-warning/10 text-warning rounded-full font-label-md text-label-md border border-warning/20">
<span className="material-symbols-outlined text-[14px]">question_mark</span>
                                    Missing
                                </span>
</td>
<td className="px-md py-5 text-right">
<button className="px-4 py-1.5 bg-on-surface text-surface-light text-label-md font-button rounded-lg hover:bg-on-surface-variant transition-all">
                                    Flag Found
                                </button>
</td>
</tr>
{/* Row 3: Damaged */}
<tr className="hover:bg-surface-container-lowest transition-colors group bg-error-container/5">
<td className="px-md py-5 font-label-md text-label-md text-primary font-bold">AF-0921</td>
<td className="px-md py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-secondary">desktop_windows</span>
</div>
<div>
<div className="font-body-md text-on-surface">LG UltraWide 34"</div>
<div className="text-label-md font-label-md text-on-surface-variant opacity-60">S/N: MNTR-99-A2</div>
</div>
</div>
</td>
<td className="px-md py-5 font-body-sm text-on-surface">Desk E14 - Zone B</td>
<td className="px-md py-5 font-body-sm text-on-surface">Arjun Nair</td>
<td className="px-md py-5">
<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-danger/10 text-danger rounded-full font-label-md text-label-md border border-danger/20">
<span className="material-symbols-outlined text-[14px]">heart_broken</span>
                                    Damaged
                                </span>
</td>
<td className="px-md py-5 text-right">
<button className="px-4 py-1.5 border border-outline-variant text-on-surface text-label-md font-button rounded-lg hover:bg-surface-container-low transition-all">
                                    Repair Log
                                </button>
</td>
</tr>
{/* Row 4: Verified */}
<tr className="hover:bg-surface-container-lowest transition-colors group">
<td className="px-md py-5 font-label-md text-label-md text-primary font-bold">AF-1044</td>
<td className="px-md py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-secondary">headset</span>
</div>
<div>
<div className="font-body-md text-on-surface">Sony WH-1000XM5</div>
<div className="text-label-md font-label-md text-on-surface-variant opacity-60">S/N: SNR-551-M5</div>
</div>
</div>
</td>
<td className="px-md py-5 font-body-sm text-on-surface">Inventory Locker A</td>
<td className="px-md py-5 font-body-sm text-on-surface">Unassigned</td>
<td className="px-md py-5">
<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success rounded-full font-label-md text-label-md border border-success/20">
<span className="material-symbols-outlined text-[14px]">verified</span>
                                    Verified
                                </span>
</td>
<td className="px-md py-5 text-right">
<button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-all">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
{/* Row 5: Verified */}
<tr className="hover:bg-surface-container-lowest transition-colors group">
<td className="px-md py-5 font-label-md text-label-md text-primary font-bold">AF-2101</td>
<td className="px-md py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-secondary">power</span>
</div>
<div>
<div className="font-body-md text-on-surface">Hypervolt Charging Hub</div>
<div className="text-label-md font-label-md text-on-surface-variant opacity-60">S/N: HP-0022-HUB</div>
</div>
</div>
</td>
<td className="px-md py-5 font-body-sm text-on-surface">Lab Server Room</td>
<td className="px-md py-5 font-body-sm text-on-surface">Lab Admin</td>
<td className="px-md py-5">
<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success rounded-full font-label-md text-label-md border border-success/20">
<span className="material-symbols-outlined text-[14px]">verified</span>
                                    Verified
                                </span>
</td>
<td className="px-md py-5 text-right">
<button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-all">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
{/* Pagination / Table Footer */}
<div className="px-md py-4 bg-surface-container-low/50 flex items-center justify-between border-t border-outline-variant/20">
<p className="font-label-md text-label-md text-on-surface-variant">Showing 5 of 48 total assets in Engineering</p>
<div className="flex gap-2">
<button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all">
<span className="material-symbols-outlined text-[20px]">chevron_left</span>
</button>
<button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all">
<span className="material-symbols-outlined text-[20px]">chevron_right</span>
</button>
</div>
</div>
</div>
{/* Bento Summary Grid */}
<div className="mt-gutter grid grid-cols-1 md:grid-cols-3 gap-gutter">
<div className="bg-surface-light p-md rounded-[18px] border border-outline-variant/30 shadow-sm flex flex-col gap-2">
<div className="text-label-md font-label-md text-on-surface-variant uppercase">Progress</div>
<div className="flex items-end justify-between">
<span className="font-headline-xl text-headline-xl text-on-surface">92%</span>
<span className="text-success font-label-md text-label-md">+4% vs Q2</span>
</div>
<div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-1">
<div className="bg-primary h-full w-[92%]"></div>
</div>
</div>
<div className="bg-surface-light p-md rounded-[18px] border border-outline-variant/30 shadow-sm flex flex-col gap-2">
<div className="text-label-md font-label-md text-on-surface-variant uppercase">Issues Flagged</div>
<div className="flex items-end justify-between">
<span className="font-headline-xl text-headline-xl text-on-surface">02</span>
<span className="text-danger font-label-md text-label-md">Requires Action</span>
</div>
<div className="flex gap-1 mt-1">
<span className="h-2 w-full rounded-full bg-danger"></span>
<span className="h-2 w-full rounded-full bg-warning"></span>
<span className="h-2 w-full rounded-full bg-surface-container-high"></span>
</div>
</div>
<div className="bg-surface-light p-md rounded-[18px] border border-outline-variant/30 shadow-sm flex flex-col gap-2">
<div className="text-label-md font-label-md text-on-surface-variant uppercase">Auditor Efficiency</div>
<div className="flex items-end justify-between">
<span className="font-headline-xl text-headline-xl text-on-surface">4.8s</span>
<span className="text-on-surface-variant font-label-md text-label-md">Avg/Asset Scan</span>
</div>
<div className="flex items-center gap-2 mt-1">
<div className="flex -space-x-2">
<div className="w-6 h-6 rounded-full bg-primary ring-2 ring-surface-light"></div>
<div className="w-6 h-6 rounded-full bg-secondary ring-2 ring-surface-light"></div>
</div>
<span className="text-label-md font-label-md text-on-surface-variant">Team Velocity High</span>
</div>
</div>
</div>
</div></div>
    </>
  );
}
