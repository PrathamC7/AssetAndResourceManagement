import React from 'react';

export function ReportsScreen({ onNavigate, user, onAction }) {
  return (
    <div className="space-y-6 max-w-6xl w-full text-slate-800">
      
      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Utilization by department */}
        <div className="bg-white border border-slate-200 p-5 rounded-[12px] shadow-sm flex flex-col">
          <h4 className="text-sm font-bold text-slate-400 border-b border-slate-200 pb-2 mb-4">
            Utilization by department
          </h4>
          <div className="h-44 flex items-end justify-between gap-4 px-2">
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-slate-900 rounded-t-md" style={{ height: '40%' }}></div>
              <span className="text-[10px] font-bold text-slate-400">ENG</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-slate-900 rounded-t-md" style={{ height: '80%' }}></div>
              <span className="text-[10px] font-bold text-slate-400">OPS</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-slate-900 rounded-t-md" style={{ height: '55%' }}></div>
              <span className="text-[10px] font-bold text-slate-400">HR</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-slate-900 rounded-t-md" style={{ height: '35%' }}></div>
              <span className="text-[10px] font-bold text-slate-400">SALES</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-slate-900 rounded-t-md" style={{ height: '70%' }}></div>
              <span className="text-[10px] font-bold text-slate-400">FIN</span>
            </div>
          </div>
        </div>

        {/* Maintenance Frequency */}
        <div className="bg-white border border-slate-200 p-5 rounded-[12px] shadow-sm flex flex-col">
          <h4 className="text-sm font-bold text-slate-400 border-b border-slate-200 pb-2 mb-4">
            Maintenance Frequency
          </h4>
          <div className="h-44 relative flex items-end">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 150">
              <path d="M0,120 C50,110 100,50 150,70 S250,20 300,50 S350,80 400,60" fill="none" stroke="#0f172a" strokeWidth="2.5"></path>
              <circle cx="150" cy="70" fill="#0f172a" r="3"></circle>
              <circle cx="300" cy="50" fill="#0f172a" r="3"></circle>
            </svg>
          </div>
        </div>

      </div>

      {/* Lists section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Most used assets */}
        <div className="bg-white border border-slate-200 p-5 rounded-[12px] shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-950">Most used assets</h4>
          <ul className="space-y-2 text-xs text-slate-600 font-semibold">
            <li className="list-disc ml-4">Room B2: 34 booking this month</li>
            <li className="list-disc ml-4">Van AF-343: 21 trips this month</li>
            <li className="list-disc ml-4">Projector AF-335: 18 uses</li>
          </ul>
        </div>

        {/* Idle assets */}
        <div className="bg-white border border-slate-200 p-5 rounded-[12px] shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-950">Idle assets</h4>
          <ul className="space-y-2 text-xs text-slate-600 font-semibold">
            <li className="list-disc ml-4">Camera AF-0301 : unused 60+ days</li>
            <li className="list-disc ml-4">chair AF-0410 : unused 45 days</li>
          </ul>
        </div>

      </div>

      {/* Assets due for maintenance list */}
      <div className="bg-white border border-slate-200 p-5 rounded-[12px] shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-950 border-b border-slate-200 pb-2">
          Assets due for maintenance / nearing retirement
        </h4>
        <ul className="space-y-2.5 text-xs text-slate-600 font-semibold">
          <li className="list-disc ml-4 leading-relaxed">
            Forklift AF-0087 : service due in 5 days
          </li>
          <li className="list-disc ml-4 leading-relaxed">
            Laptop AF-0020 : 4 years old : nearing retirement
          </li>
        </ul>
      </div>

      {/* Export report button */}
      <div className="pt-2">
        <button className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm cursor-pointer">
          Export report
        </button>
      </div>

    </div>
  );
}