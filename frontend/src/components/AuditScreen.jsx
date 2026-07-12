import React from 'react';

export function AuditScreen({ onNavigate, user, onAction }) {
  const auditItems = [
    { asset: 'AF-003 Dell laptop', location: 'Desk E12', status: 'Verified' },
    { asset: 'AF-9921 Office chair', location: 'Desk E14', status: 'Missing' },
    { asset: 'AF-9838 Monitor', location: 'Desk E15', status: 'Damaged' }
  ];

  return (
    <div className="space-y-6 max-w-4xl w-full text-slate-800">
      
      {/* Top details block */}
      <div className="bg-slate-100 border border-slate-200 text-slate-850 rounded-[12px] p-5 shadow-sm space-y-1.5">
        <h3 className="text-sm font-bold text-slate-900">Q3 audit: Engineering dept - 1-15 jul</h3>
        <p className="text-xs text-slate-500 font-semibold">Auditors: A. Rao, S, Iqbal</p>
      </div>

      {/* Checklist Table */}
      <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Asset</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Expected location</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 text-sm">
            {auditItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900">{item.asset}</td>
                <td className="px-6 py-4 text-slate-600 font-semibold">{item.location}</td>
                <td className="px-6 py-4">
                  {item.status === 'Verified' && (
                    <span className="inline-flex px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full">
                      Verified
                    </span>
                  )}
                  {item.status === 'Missing' && (
                    <span className="inline-flex px-3 py-1 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 rounded-full">
                      Missing
                    </span>
                  )}
                  {item.status === 'Damaged' && (
                    <span className="inline-flex px-3 py-1 text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 rounded-full">
                      Damaged
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Discrepancy warning banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-[12px] p-4 text-xs text-amber-700 font-semibold leading-relaxed">
        2 assets flagged - discrepancy report generated automatically
      </div>

      {/* Action button */}
      <div className="pt-2">
        <button className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm cursor-pointer">
          Close audit cycle
        </button>
      </div>

    </div>
  );
}