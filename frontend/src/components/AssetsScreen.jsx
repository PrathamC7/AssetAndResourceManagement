import React from 'react';

export function AssetsScreen({ onNavigate, user, onAction }) {
  const assets = [
    { tag: 'AF-0012', name: 'Dell Laptop', category: 'Electronics', status: 'Allocated', location: 'bengaluru' },
    { tag: 'AF-0062', name: 'Projector', category: 'Electronics', status: 'Maintenance', location: 'HQ floor 2' },
    { tag: 'AF-0201', name: 'Office chair', category: 'Furniture', status: 'Available', location: 'Warehouse' }
  ];

  return (
    <div className="space-y-6 max-w-6xl w-full text-slate-800">
      
      {/* Top Search & Actions bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-lg">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:border-slate-500 transition-colors outline-none" 
            placeholder="Search by tag, serial, or QR code.." 
            type="text"
          />
        </div>
        <button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors shadow-sm cursor-pointer whitespace-nowrap">
          + Register Asset
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2.5 pt-2">
        <button className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer">
          Category
        </button>
        <button className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer">
          Status
        </button>
        <button className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer">
          Department
        </button>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tag</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Name</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 text-sm">
            {assets.map((asset, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{asset.tag}</td>
                <td className="px-6 py-4 text-slate-700 font-semibold">{asset.name}</td>
                <td className="px-6 py-4 text-slate-600 font-medium">{asset.category}</td>
                <td className="px-6 py-4">
                  {asset.status === 'Available' && (
                    <span className="inline-flex px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full">
                      Available
                    </span>
                  )}
                  {asset.status === 'Allocated' && (
                    <span className="inline-flex px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 rounded-full">
                      Allocated
                    </span>
                  )}
                  {asset.status === 'Maintenance' && (
                    <span className="inline-flex px-3 py-1 text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 rounded-full">
                      Maintenance
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">{asset.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}