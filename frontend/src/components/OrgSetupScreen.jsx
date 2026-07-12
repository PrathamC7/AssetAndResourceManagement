import React from 'react';

export function OrgSetupScreen({ onNavigate, user, onAction }) {
  const departments = [
    { name: 'Engineering', head: 'aditi rao', parent: '--', status: 'Active' },
    { name: 'Facilities', head: 'rohan mehta', parent: '--', status: 'Active' },
    { name: 'Field ops (east)', head: 'sana iqbal', parent: 'Field Ops', status: 'Inactive' }
  ];

  return (
    <div className="space-y-6 max-w-6xl w-full text-slate-800">
      
      {/* Tabs / Actions Bar */}
      <div className="flex flex-wrap gap-3 pb-2 border-b border-slate-200">
        <button className="px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg shadow-sm cursor-pointer">
          Departments
        </button>
        <button className="px-5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-semibold rounded-lg shadow-sm cursor-pointer transition-colors">
          Categories
        </button>
        <button className="px-5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-semibold rounded-lg shadow-sm cursor-pointer transition-colors">
          Employee
        </button>
        <button className="px-5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-semibold rounded-lg shadow-sm cursor-pointer transition-colors ml-auto flex items-center gap-1">
          <span>+ Add</span>
        </button>
      </div>

      {/* Modern Simple Table */}
      <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Department</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Head</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Parent Dept</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 text-sm">
            {departments.map((dept, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900">{dept.name}</td>
                <td className="px-6 py-4 text-slate-600 font-medium">{dept.head}</td>
                <td className="px-6 py-4 text-slate-600 font-medium">{dept.parent}</td>
                <td className="px-6 py-4">
                  {dept.status === 'Active' ? (
                    <span className="inline-flex px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 rounded-full">
                      Inactive
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Helper text */}
      <div className="text-xs text-slate-400 font-medium italic pt-4">
        Editing a department here also drives the picklist in Screen 4 & 5
      </div>
    </div>
  );
}