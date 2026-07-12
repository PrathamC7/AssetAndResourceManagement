import React from 'react';

export function AllocationScreen({ onNavigate, user, onAction }) {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-margin-desktop custom-scrollbar"><div className="flex-1 p-margin-desktop space-y-gutter max-w-7xl mx-auto w-full">
{/* Breadcrumbs */}
<nav className="flex text-label-md font-label-md text-on-surface-variant gap-xs">
<span>Assets</span>
<span>/</span>
<span className="text-primary">Allocation &amp; Transfer</span>
</nav>
{/* Main Layout: 12-column grid */}
<div className="grid grid-cols-12 gap-gutter">
{/* Left Column: Asset Selection & Form (Bento Style) */}
<div className="col-span-12 lg:col-span-8 space-y-gutter">
{/* Asset Focus Card */}
<div className="bg-surface-light rounded-[18px] p-md shadow-sm relative overflow-hidden">
<div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
<div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-md">
<div className="flex gap-md">
<div className="w-16 h-16 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-4xl">laptop_mac</span>
</div>
<div>
<h3 className="font-headline-md text-headline-md">AF-0114 - Dell Laptop</h3>
<p className="text-body-sm text-on-surface-variant">Asset Type: Computing | SN: DX-9281-22</p>
</div>
</div>
<div className="flex items-center gap-sm">
<span className="px-3 py-1 rounded-full bg-error-container text-on-error-container text-label-md font-label-md flex items-center gap-1">
<span className="material-symbols-outlined text-sm">warning</span> Currently Allocated
                                </span>
</div>
</div>
{/* Alert Banner */}
<div className="bg-error-container/30 border border-error/20 rounded-xl p-sm flex items-start gap-sm mb-md">
<span className="material-symbols-outlined text-error mt-0.5">info</span>
<div>
<p className="text-body-sm font-bold text-on-error-container">Asset already allocated to Priya Shah (Engineering)</p>
<p className="text-body-sm text-on-error-container/80">Direct reallocation is blocked. Please submit a transfer request below for approval.</p>
</div>
</div>
{/* Transfer Form */}
<form className="space-y-md">
<div className="grid grid-cols-1 md:grid-cols-2 gap-md">
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Transfer From</label>
<div className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-body-md text-on-surface-variant flex items-center gap-sm cursor-not-allowed border border-outline-variant/30">
<span className="material-symbols-outlined text-sm">person</span>
                                        Priya Shah
                                    </div>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Assign To</label>
<div className="relative">
<select className="w-full pl-4 pr-10 py-3 bg-surface-container-low rounded-xl border-none text-body-md focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer">
<option disabled="" selected={true} value="">Select Employee...</option>
<option value="1">Arjun Nair - Facilities</option>
<option value="2">Sarah Jenkins - Marketing</option>
<option value="3">David Chen - IT</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
</div>
</div>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Reason for Transfer</label>
<textarea className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none text-body-md focus:ring-2 focus:ring-primary/50 transition-all resize-none" placeholder="Enter reason for this transfer request..." rows="4"></textarea>
</div>
<div className="flex items-center justify-end gap-sm pt-sm">
<button className="px-6 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-button text-button" type="button">Cancel</button>
<button className="px-8 py-2.5 bg-primary text-on-primary rounded-xl font-button text-button shadow-md hover:scale-[1.02] active:scale-95 transition-all" type="submit">Submit Request</button>
</div>
</form>
</div>
{/* Allocation History (Activity Feed Style) */}
<div className="bg-surface-light rounded-[18px] p-md shadow-sm">
<h4 className="font-headline-md text-headline-md mb-md flex items-center gap-sm">
<span className="material-symbols-outlined text-primary">history</span> Allocation History
                        </h4>
<div className="relative pl-8 space-y-lg before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/30">
{/* Timeline Item 1 */}
<div className="relative">
<div className="absolute -left-[26px] top-1.5 w-4 h-4 rounded-full bg-primary ring-4 ring-primary/10 border-2 border-white"></div>
<div className="flex flex-col gap-xs">
<div className="flex items-center justify-between">
<span className="font-body-md font-bold">Allocated to Priya Shah</span>
<span className="text-label-md font-label-md text-on-surface-variant">Mar 12, 2024</span>
</div>
<p className="text-body-sm text-on-surface-variant">Department: Engineering | Reason: New joining kit</p>
</div>
</div>
{/* Timeline Item 2 */}
<div className="relative">
<div className="absolute -left-[26px] top-1.5 w-4 h-4 rounded-full bg-surface-variant border-2 border-white"></div>
<div className="flex flex-col gap-xs">
<div className="flex items-center justify-between">
<span className="font-body-md font-bold">Returned by Arjun Nair</span>
<span className="text-label-md font-label-md text-on-surface-variant">Jan 04, 2024</span>
</div>
<p className="text-body-sm text-on-surface-variant">Condition: Good | Checked by Admin: David C.</p>
</div>
</div>
{/* Timeline Item 3 */}
<div className="relative">
<div className="absolute -left-[26px] top-1.5 w-4 h-4 rounded-full bg-surface-variant border-2 border-white"></div>
<div className="flex flex-col gap-xs">
<div className="flex items-center justify-between">
<span className="font-body-md font-bold">Asset Registered</span>
<span className="text-label-md font-label-md text-on-surface-variant">Dec 15, 2023</span>
</div>
<p className="text-body-sm text-on-surface-variant">Initial procurement entry by Logistics team.</p>
</div>
</div>
</div>
</div>
</div>
{/* Right Column: Contextual Info & Details (Asymmetric Column) */}
<div className="col-span-12 lg:col-span-4 space-y-gutter">
{/* Asset Condition Card */}
<div className="bg-surface-light rounded-[18px] p-md shadow-sm border border-outline-variant/10">
<h5 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-md">Asset Health</h5>
<div className="flex items-center gap-md">
<div className="flex-1">
<div className="flex justify-between mb-xs">
<span className="text-body-sm font-bold">Condition: Excellent</span>
<span className="text-body-sm text-success">98%</span>
</div>
<div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-success w-[98%]"></div>
</div>
</div>
</div>
<div className="mt-md grid grid-cols-2 gap-sm">
<div className="bg-surface-container-low p-sm rounded-xl">
<span className="text-label-md font-label-md text-on-surface-variant block">Last Audit</span>
<span className="text-body-sm font-bold">June 10, 2024</span>
</div>
<div className="bg-surface-container-low p-sm rounded-xl">
<span className="text-label-md font-label-md text-on-surface-variant block">Next Service</span>
<span className="text-body-sm font-bold">Sept 15, 2024</span>
</div>
</div>
</div>
{/* Related Assets / Quick Links */}
<div className="bg-surface-light rounded-[18px] p-md shadow-sm">
<h5 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-md">Associated Accessories</h5>
<div className="space-y-sm">
<div className="flex items-center gap-sm p-sm hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer group">
<div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary">
<span className="material-symbols-outlined">charger</span>
</div>
<div className="flex-1 min-w-0">
<p className="text-body-sm font-bold truncate">Dell USB-C Power Adapter</p>
<p className="text-label-md text-on-surface-variant">SN: PW-1029</p>
</div>
</div>
<div className="flex items-center gap-sm p-sm hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer group">
<div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary">
<span className="material-symbols-outlined">mouse</span>
</div>
<div className="flex-1 min-w-0">
<p className="text-body-sm font-bold truncate">Logitech Wireless Mouse</p>
<p className="text-label-md text-on-surface-variant">SN: MS-3321</p>
</div>
</div>
<div className="flex items-center gap-sm p-sm hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer group">
<div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary">
<span className="material-symbols-outlined">dock</span>
</div>
<div className="flex-1 min-w-0">
<p className="text-body-sm font-bold truncate">Dell WD19 Docking Station</p>
<p className="text-label-md text-on-surface-variant">SN: DK-0012</p>
</div>
</div>
</div>
<button className="w-full mt-md py-2 text-primary font-button text-button hover:bg-primary/5 rounded-xl transition-colors">
                            View All Accessories
                        </button>
</div>
{/* Workflow Hint */}
<div className="bg-deep-navy text-surface-light rounded-[18px] p-md shadow-lg">
<div className="flex items-center gap-sm mb-sm">
<span className="material-symbols-outlined text-warning">info</span>
<span className="font-label-md text-label-md">Process Note</span>
</div>
<p className="text-body-sm opacity-80 leading-relaxed">
                            Transfer requests for "Computing" category assets require manager approval. The recipient will receive a notification to acknowledge receipt upon delivery.
                        </p>
</div>
</div>
</div>
</div></div>
    </>
  );
}
