import React from 'react';

export function BookingScreen({ onNavigate, user, onAction }) {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-margin-desktop custom-scrollbar"><div className="p-margin-mobile md:p-margin-desktop overflow-y-auto flex-grow bg-surface-container-lowest">
{/* Header Section */}
<div className="flex flex-col md:flex-row md:items-end justify-between mb-lg gap-md">
<div>
<h1 className="font-headline-xl text-headline-xl text-on-surface mb-xs">Resource Booking</h1>
<p className="text-on-surface-variant font-body-md">Manage and schedule organizational facilities and equipment.</p>
</div>
<div className="flex gap-sm">
<div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 flex p-1">
<button className="px-md py-xs bg-surface-container-low rounded-lg text-primary font-button">Day</button>
<button className="px-md py-xs text-on-surface-variant hover:bg-surface-container-lowest transition-all rounded-lg font-button">Week</button>
<button className="px-md py-xs text-on-surface-variant hover:bg-surface-container-lowest transition-all rounded-lg font-button">Month</button>
</div>
<button className="bg-primary text-on-primary px-lg py-sm rounded-xl font-button shadow-md flex items-center gap-xs">
<span className="material-symbols-outlined">add</span>
                        Book a slot
                    </button>
</div>
</div>
{/* Main Layout: Sidebar & Calendar Grid */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
{/* Left Details Sidebar (Asymmetric Layout) */}
<div className="lg:col-span-3 space-y-gutter">
<div className="bg-white rounded-[18px] p-md shadow-[0_8px_30px_rgb(15,23,42,0.04)] border border-outline-variant/20">
<div className="aspect-video rounded-xl mb-md overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover" data-alt="Modern minimalist conference room with a large oak table, ergonomic charcoal chairs, and floor-to-ceiling glass walls overlooking a bright corporate campus. Soft natural lighting, 8k resolution, architectural photography style, clean and professional." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv5GEtjXx46caXO906BE8zj77cKSB0SkxWF1BXo1tVA1CQY5eZzIsRvAVgy2lDyacWRdpiKQH8_qvjBXBhSe5unlUXA1q3mHBEXht8Oh7_xRzYDA3JVm15bWVjPhq5ll58c2_Q71sQgfyuopLGywaSKWvokyvkOQxfsXwdj5F28wgKxXRmaU3WIxKH2Q1uvXdcLbWYy3ywUgwhtbXUIeoOYNp0YgdUH5FKZVWC9LZHwaaWVqEvklHcUw"/>
</div>
<h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Conference Room B2</h2>
<div className="flex items-center gap-xs text-on-surface-variant mb-md">
<span className="material-symbols-outlined text-[18px]">location_on</span>
<span className="text-body-sm">Building A, Floor 2</span>
</div>
<div className="space-y-sm pt-md border-t border-surface-container">
<div className="flex justify-between items-center">
<span className="text-label-md text-on-surface-variant">Capacity</span>
<span className="text-body-sm font-bold">12 People</span>
</div>
<div className="flex justify-between items-center">
<span className="text-label-md text-on-surface-variant">Equipment</span>
<div className="flex gap-xs">
<span className="material-symbols-outlined text-[16px] text-primary" title="TV Display">tv</span>
<span className="material-symbols-outlined text-[16px] text-primary" title="Whiteboard">edit_square</span>
<span className="material-symbols-outlined text-[16px] text-primary" title="VC Gear">videocam</span>
</div>
</div>
</div>
</div>
<div className="bg-white rounded-[18px] p-md shadow-[0_8px_30px_rgb(15,23,42,0.04)] border border-outline-variant/20">
<h3 className="font-button text-on-surface mb-sm">Select Date</h3>
{/* Simple Calendar Mini Widget */}
<div className="flex items-center justify-between mb-sm">
<span className="font-label-md">July 2024</span>
<div className="flex gap-xs">
<span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">chevron_left</span>
<span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">chevron_right</span>
</div>
</div>
<div className="grid grid-cols-7 gap-1 text-center">
<span className="text-label-md text-on-surface-variant">M</span><span className="text-label-md text-on-surface-variant">T</span><span className="text-label-md text-on-surface-variant">W</span><span className="text-label-md text-on-surface-variant">T</span><span className="text-label-md text-on-surface-variant">F</span><span className="text-label-md text-on-surface-variant">S</span><span className="text-label-md text-on-surface-variant">S</span>
<div className="p-1 text-body-sm hover:bg-surface-container rounded-lg cursor-pointer">5</div>
<div className="p-1 text-body-sm hover:bg-surface-container rounded-lg cursor-pointer">6</div>
<div className="p-1 text-body-sm bg-primary text-on-primary rounded-lg font-bold">7</div>
<div className="p-1 text-body-sm hover:bg-surface-container rounded-lg cursor-pointer">8</div>
<div className="p-1 text-body-sm hover:bg-surface-container rounded-lg cursor-pointer">9</div>
<div className="p-1 text-body-sm hover:bg-surface-container rounded-lg cursor-pointer">10</div>
<div className="p-1 text-body-sm hover:bg-surface-container rounded-lg cursor-pointer">11</div>
</div>
</div>
</div>
{/* Main Schedule View (12-column Grid) */}
<div className="lg:col-span-9 bg-white rounded-[18px] shadow-[0_8px_30px_rgb(15,23,42,0.06)] border border-outline-variant/20 flex flex-col min-h-[600px] overflow-hidden">
{/* Timeline Header */}
<div className="bg-surface-container-low/50 px-md py-sm border-b border-outline-variant/30 flex items-center justify-between">
<span className="font-headline-md text-on-surface">Tuesday, 7 July</span>
<div className="flex items-center gap-md">
<div className="flex items-center gap-xs">
<div className="w-3 h-3 rounded-full bg-primary-container"></div>
<span className="text-label-md text-on-surface-variant">Confirmed</span>
</div>
<div className="flex items-center gap-xs">
<div className="w-3 h-3 rounded-full border border-dashed border-primary"></div>
<span className="text-label-md text-on-surface-variant">Requested</span>
</div>
</div>
</div>
{/* Vertical Timeline Grid */}
<div className="flex-grow overflow-y-auto p-md relative">
{/* Hour Rows */}
<div className="space-y-0 relative min-h-[500px]">
{/* 9:00 AM */}
<div className="flex gap-md h-32 group border-t border-surface-container first:border-t-0">
<div className="w-16 text-right pt-2">
<span className="text-label-md text-on-surface-variant group-hover:text-primary transition-colors">9:00 AM</span>
</div>
<div className="flex-grow relative">
{/* Blue Block: Booked - Procurement Team */}
<div className="absolute inset-y-2 inset-x-0 bg-primary-container/20 border-l-4 border-primary rounded-r-xl p-md flex items-start justify-between shadow-sm hover:shadow-md transition-all cursor-pointer">
<div className="flex items-start gap-md">
<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
<span className="material-symbols-outlined text-primary">groups</span>
</div>
<div>
<h4 className="font-button text-primary">Booked - Procurement Team</h4>
<p className="text-label-md text-on-primary-fixed-variant opacity-80">9:00 AM — 10:15 AM</p>
<p className="text-body-sm text-on-secondary-container mt-1">Weekly alignment meeting</p>
</div>
</div>
<span className="material-symbols-outlined text-outline">more_vert</span>
</div>
</div>
</div>
{/* 10:00 AM */}
<div className="flex gap-md h-32 group border-t border-surface-container">
<div className="w-16 text-right pt-2">
<span className="text-label-md text-on-surface-variant group-hover:text-primary transition-colors">10:00 AM</span>
</div>
<div className="flex-grow relative">
{/* Dotted Block: Requested */}
<div className="absolute top-1/2 left-0 right-0 h-16 border-2 border-dashed border-primary/40 rounded-xl bg-surface-container-lowest/50 p-sm flex items-center justify-between hover:border-primary/80 transition-all cursor-help" style={{transform: 'translateY(-50%)'}}>
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-primary/60">pending_actions</span>
<span className="text-body-sm font-medium text-primary/60">Requested 10:30 to 11:30 — Conflict Detected</span>
</div>
<div className="flex gap-xs">
<button className="px-sm py-1 bg-primary/10 text-primary text-label-md rounded-lg hover:bg-primary/20">Resolve</button>
</div>
</div>
</div>
</div>
{/* 11:00 AM */}
<div className="flex gap-md h-32 group border-t border-surface-container">
<div className="w-16 text-right pt-2">
<span className="text-label-md text-on-surface-variant group-hover:text-primary transition-colors">11:00 AM</span>
</div>
<div className="flex-grow relative hover:bg-surface-container-low/30 rounded-xl transition-colors cursor-crosshair">
<div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100">
<span className="text-label-md text-primary font-bold">+ New Booking</span>
</div>
</div>
</div>
{/* 12:00 PM */}
<div className="flex gap-md h-32 group border-t border-surface-container">
<div className="w-16 text-right pt-2">
<span className="text-label-md text-on-surface-variant group-hover:text-primary transition-colors">12:00 PM</span>
</div>
<div className="flex-grow relative">
{/* Empty Space */}
</div>
</div>
{/* 1:00 PM */}
<div className="flex gap-md h-32 group border-t border-surface-container">
<div className="w-16 text-right pt-2">
<span className="text-label-md text-on-surface-variant group-hover:text-primary transition-colors">1:00 PM</span>
</div>
<div className="flex-grow relative">
</div>
</div>
</div>
{/* Current Time Indicator */}
<div className="absolute left-0 right-0 pointer-events-none" style={{top: '185px'}}>
<div className="flex items-center">
<div className="w-[72px] text-right pr-2">
<span className="text-[10px] font-bold text-danger">10:42 AM</span>
</div>
<div className="flex-grow h-[2px] bg-danger relative">
<div className="absolute left-0 -top-1 w-2 h-2 rounded-full bg-danger"></div>
</div>
</div>
</div>
</div>
</div>
</div>
</div></div>
    </>
  );
}
