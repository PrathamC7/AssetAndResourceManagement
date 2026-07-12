import React from 'react';

export function BookingScreen({ onNavigate, user, onAction }) {
  return (
    <div className="space-y-6 max-w-4xl w-full text-slate-800">
      
      {/* Resource selector */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 block">Resource</label>
        <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-semibold cursor-not-allowed">
          Conference room B2 - Tue, 7 Jul
        </div>
      </div>

      {/* Booking schedule grid */}
      <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden mt-4">
        
        {/* Hour slots */}
        <div className="divide-y divide-slate-150 text-sm relative min-h-[360px] flex flex-col justify-between">
          
          {/* 9:00 AM Slot */}
          <div className="flex items-center px-6 py-6 min-h-[90px] relative">
            <span className="w-20 font-bold text-slate-400">9:00</span>
            <div className="flex-grow">
              {/* Light blue box for booked slot */}
              <div className="absolute inset-y-2 left-24 right-6 bg-blue-50 border border-blue-250 text-blue-800 rounded-lg p-3 flex flex-col justify-center shadow-sm font-semibold">
                <span className="font-bold text-xs uppercase tracking-wider">Booked - Procurement Team - 9 to 10</span>
              </div>
            </div>
          </div>

          {/* 10:00 AM Slot */}
          <div className="flex items-center px-6 py-6 min-h-[90px] relative">
            <span className="w-20 font-bold text-slate-400">10:00</span>
            <div className="flex-grow">
              {/* Dotted red box for conflict slot */}
              <div className="absolute inset-y-2 left-24 right-6 border-2 border-dashed border-red-500 bg-red-50/70 text-red-600 rounded-lg p-3 flex items-center shadow-sm">
                <span className="font-semibold text-xs leading-relaxed">Requested 9:30 to 10:30 - conflict - slot is unavailable</span>
              </div>
            </div>
          </div>

          {/* 11:00 AM Slot */}
          <div className="flex items-center px-6 py-6 min-h-[90px] relative">
            <span className="w-20 font-bold text-slate-400">11:00</span>
            <div className="flex-grow"></div>
          </div>

          {/* 12:00 PM Slot */}
          <div className="flex items-center px-6 py-6 min-h-[90px] relative">
            <span className="w-20 font-bold text-slate-400">12:00</span>
            <div className="flex-grow"></div>
          </div>

          {/* 1:00 PM Slot */}
          <div className="flex items-center px-6 py-6 min-h-[90px] relative">
            <span className="w-20 font-bold text-slate-400">1:00</span>
            <div className="flex-grow"></div>
          </div>

        </div>
      </div>

      {/* Action button */}
      <div className="pt-2">
        <button className="bg-emerald-800 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm cursor-pointer">
          Book a slot
        </button>
      </div>

    </div>
  );
}