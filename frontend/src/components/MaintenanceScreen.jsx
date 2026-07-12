import React from 'react';

export function MaintenanceScreen({ onNavigate, user, onAction }) {
  const columns = [
    {
      title: 'Pending',
      card: { id: 'AF-0062', text: 'Projector bulb not turning on' }
    },
    {
      title: 'Approved',
      card: { id: 'AF-003', text: 'ac unit noisy compressor' }
    },
    {
      title: 'Technician assigned',
      card: { id: 'AF-0078', text: 'forklift tech: R varma' }
    },
    {
      title: 'in progress',
      card: { id: 'AF-897', text: 'Printer Jam parts ordered' }
    },
    {
      title: 'Resolved',
      card: { id: 'AF-873', text: 'Chair repair resolved 7 Jul', isGreen: true }
    }
  ];

  return (
    <div className="space-y-6 w-full text-slate-800">
      
      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col, idx) => (
          <div key={idx} className="flex-1 min-w-[200px] flex flex-col gap-4">
            
            {/* Column Title */}
            <h3 className="text-sm font-bold text-slate-400 border-b border-slate-200 pb-2">
              {col.title}
            </h3>

            {/* Column Card */}
            {col.card && (
              col.card.isGreen ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-[12px] p-4 shadow-sm flex flex-col gap-2 font-semibold">
                  <span className="font-bold text-xs text-emerald-600">{col.card.id}</span>
                  <p className="text-xs leading-relaxed">{col.card.text}</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-300 rounded-[12px] p-4 shadow-sm flex flex-col gap-2 font-semibold">
                  <span className="text-slate-400 font-bold text-xs">{col.card.id}</span>
                  <p className="text-slate-800 text-xs leading-relaxed">{col.card.text}</p>
                </div>
              )
            )}

          </div>
        ))}
      </div>

      {/* Caption info text */}
      <div className="text-xs text-slate-400 font-medium pt-4">
        Approving a card moves the asset to under maintenance, resolving return it to available
      </div>
    </div>
  );
}