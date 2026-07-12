import React from 'react';

export function MaintenanceScreen({ onNavigate, user, onAction }) {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-margin-desktop custom-scrollbar"><section className="flex-1 overflow-x-auto overflow-y-hidden p-margin-desktop">
<div className="flex gap-gutter h-full min-w-[1200px]">
{/* Pending Column */}
<div className="flex-1 flex flex-col gap-sm kanban-column">
<div className="flex items-center justify-between px-xs mb-xs">
<div className="flex items-center gap-xs">
<h3 className="font-headline-md text-lg text-on-surface">Pending</h3>
<span className="bg-surface-container-high px-2 py-0.5 rounded-full text-[10px] font-bold text-on-surface-variant">2</span>
</div>
<button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">more_horiz</span></button>
</div>
<div className="space-y-sm">
{/* Ticket Card */}
<div className="glass-card p-md rounded-xl shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing border-l-4 border-warning">
<div className="flex justify-between items-start mb-sm">
<span className="text-label-md text-warning bg-warning/10 px-2 py-0.5 rounded-full">AF-0062</span>
<span className="text-[10px] text-on-surface-variant">2h ago</span>
</div>
<p className="font-body-md text-sm text-on-surface font-semibold mb-sm">Projector bulbs not turning on</p>
<div className="flex items-center gap-xs">
<span className="material-symbols-outlined text-on-surface-variant text-[16px]">location_on</span>
<span className="text-[11px] text-on-surface-variant">Room B2 • Conference Hub</span>
</div>
</div>
</div>
</div>
{/* Approved Column */}
<div className="flex-1 flex flex-col gap-sm kanban-column">
<div className="flex items-center justify-between px-xs mb-xs">
<div className="flex items-center gap-xs">
<h3 className="font-headline-md text-lg text-on-surface">Approved</h3>
<span className="bg-surface-container-high px-2 py-0.5 rounded-full text-[10px] font-bold text-on-surface-variant">1</span>
</div>
</div>
<div className="space-y-sm">
<div className="glass-card p-md rounded-xl shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing border-l-4 border-info">
<div className="flex justify-between items-start mb-sm">
<span className="text-label-md text-info bg-info/10 px-2 py-0.5 rounded-full">AF-003</span>
<span className="text-[10px] text-on-surface-variant">5h ago</span>
</div>
<p className="font-body-md text-sm text-on-surface font-semibold mb-sm">AC unit making noisy compressor sounds</p>
<div className="flex items-center gap-xs">
<span className="material-symbols-outlined text-on-surface-variant text-[16px]">priority_high</span>
<span className="text-[11px] text-danger font-bold uppercase tracking-tight">Urgent</span>
</div>
</div>
</div>
</div>
{/* Technician Assigned Column */}
<div className="flex-1 flex flex-col gap-sm kanban-column">
<div className="flex items-center justify-between px-xs mb-xs">
<div className="flex items-center gap-xs">
<h3 className="font-headline-md text-lg text-on-surface">Technician Assigned</h3>
<span className="bg-surface-container-high px-2 py-0.5 rounded-full text-[10px] font-bold text-on-surface-variant">1</span>
</div>
</div>
<div className="space-y-sm">
<div className="glass-card p-md rounded-xl shadow-sm hover:shadow-md transition-all cursor-grab border-l-4 border-primary">
<div className="flex justify-between items-start mb-sm">
<span className="text-label-md text-primary bg-primary/10 px-2 py-0.5 rounded-full">AF-0078</span>
<div className="flex -space-x-2">
<div className="w-6 h-6 rounded-full border-2 border-surface bg-surface-container-highest overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Close-up portrait of a skilled field technician wearing a gray work uniform with a subtle company logo. The technician has a focused and professional demeanor, standing in a brightly lit industrial maintenance workshop with soft out-of-focus equipment in the background. High-quality corporate photography style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8GGsuYbJHMQ8QjnxRcqChBn5Iun1xXHVu01rUvLEPfAXWbU3qebLeeP-kh4eXP9FeYjz8lDG28PJesfPk0gHmuzjN998G0GXnsAvo_luMRAlz1F1rdsSWz0cmHtGkXfp8Dmw9SUJBsEqcZteeX_Oo8yVMeGni9m9PuvA0QcrYY3cVX7TksBlJBhFmpDhOCHrEgwaHN7UmfFD4cJVeznE1WpNXNSfVhGeiq6V2sM9-g-vBW3qVPhaS0g"/>
</div>
</div>
</div>
<p className="font-body-md text-sm text-on-surface font-semibold mb-sm">Industrial Forklift Hydrualics Check</p>
<div className="flex items-center justify-between">
<div className="flex items-center gap-xs">
<span className="material-symbols-outlined text-primary text-[16px]">engineering</span>
<span className="text-[11px] font-bold text-on-surface">R. Verma</span>
</div>
<span className="text-[10px] text-on-surface-variant italic">Scheduled: Jul 12</span>
</div>
</div>
</div>
</div>
{/* In Progress Column */}
<div className="flex-1 flex flex-col gap-sm kanban-column">
<div className="flex items-center justify-between px-xs mb-xs">
<div className="flex items-center gap-xs">
<h3 className="font-headline-md text-lg text-on-surface">In Progress</h3>
<span className="bg-surface-container-high px-2 py-0.5 rounded-full text-[10px] font-bold text-on-surface-variant">1</span>
</div>
</div>
<div className="space-y-sm">
<div className="glass-card p-md rounded-xl shadow-sm hover:shadow-md transition-all cursor-grab border-l-4 border-stripe-purple">
<div className="flex justify-between items-start mb-sm">
<span className="text-label-md text-stripe-purple bg-stripe-purple/10 px-2 py-0.5 rounded-full">AF-897</span>
<span className="flex items-center gap-xs text-stripe-purple animate-pulse">
<span className="w-1.5 h-1.5 bg-stripe-purple rounded-full"></span>
<span className="text-[10px] font-bold">LIVE</span>
</span>
</div>
<p className="font-body-md text-sm text-on-surface font-semibold mb-sm">Printer Jam: Parts Ordered</p>
<div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mb-xs">
<div className="bg-stripe-purple h-full w-[65%]"></div>
</div>
<span className="text-[10px] text-on-surface-variant">65% Complete • Waiting for components</span>
</div>
</div>
</div>
{/* Resolved Column */}
<div className="flex-1 flex flex-col gap-sm kanban-column">
<div className="flex items-center justify-between px-xs mb-xs">
<div className="flex items-center gap-xs">
<h3 className="font-headline-md text-lg text-on-surface">Resolved</h3>
<span className="bg-surface-container-high px-2 py-0.5 rounded-full text-[10px] font-bold text-on-surface-variant">1</span>
</div>
</div>
<div className="space-y-sm">
<div className="glass-card p-md rounded-xl shadow-sm border-l-4 border-success opacity-80 group">
<div className="flex justify-between items-start mb-sm">
<span className="text-label-md text-success bg-success/10 px-2 py-0.5 rounded-full">AF-873</span>
<span className="material-symbols-outlined text-success text-[18px]">check_circle</span>
</div>
<p className="font-body-md text-sm text-on-surface font-semibold mb-sm line-through">Ergonomic Chair Repair</p>
<div className="flex items-center justify-between mt-sm">
<span className="text-[11px] font-bold text-success">Resolved Jul 7</span>
<button className="text-[10px] font-bold text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Archive</button>
</div>
</div>
</div>
</div>
</div>
</section></div>
    </>
  );
}
