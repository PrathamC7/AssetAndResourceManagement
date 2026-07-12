import React, { useState } from 'react';

export function AllocationScreen({ onNavigate, user, onAction }) {
  const [targetEmployee, setTargetEmployee] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onAction === 'function') {
      onAction('submitTransfer', { targetEmployee, reason });
    }
    setReason('');
    setTargetEmployee('');
    alert('Transfer request submitted successfully!');
  };

  return (
    <div className="space-y-6 max-w-2xl w-full text-slate-800">
      
      {/* Asset input */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 block">Asset</label>
        <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-semibold cursor-not-allowed">
          AF-0114 - Dell laptop
        </div>
      </div>

      {/* Warning Box */}
      <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 text-xs text-red-700 space-y-1 font-medium leading-relaxed">
        <p className="font-bold">Already Allocated to Priya shah (Engineering)</p>
        <p>Direct re-allocation is blocked - submit a transfer request below</p>
      </div>

      {/* Transfer Request Form */}
      <form className="space-y-5 pt-2" onSubmit={handleSubmit}>
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">Transfer Request</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* From */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider">From</label>
            <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-600 font-semibold cursor-not-allowed">
              Priya Shah
            </div>
          </div>

          {/* To */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider">To</label>
            <select 
              className="w-full bg-white border border-slate-300 hover:border-slate-400 focus:border-slate-500 rounded-lg py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 transition-all outline-none cursor-pointer"
              value={targetEmployee}
              onChange={(e) => setTargetEmployee(e.target.value)}
              required
            >
              <option disabled value="">Select Employee....</option>
              <option value="arjun">Arjun Nair - Facilities</option>
              <option value="sarah">Sarah Jenkins - Marketing</option>
              <option value="david">David Chen - IT</option>
            </select>
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider">Reason</label>
          <textarea
            className="w-full bg-white border border-slate-300 hover:border-slate-400 focus:border-slate-500 rounded-lg py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 transition-all outline-none resize-none"
            rows="4"
            placeholder="Enter reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Submit */}
        <button
          className="bg-emerald-800 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
          type="submit"
        >
          Submit Request
        </button>
      </form>

      {/* Allocation History */}
      <div className="pt-6 border-t border-slate-200 space-y-3">
        <h3 className="text-base font-bold text-slate-900">Allocation history</h3>
        <ul className="space-y-2 text-xs text-slate-500 font-medium">
          <li className="leading-relaxed">
            <span className="font-bold text-slate-700">Mar 12</span> - Allocated to Priya shah - Engineering
          </li>
          <li className="leading-relaxed">
            <span className="font-bold text-slate-700">Jan 04</span> - Returned by Arjun Nair - condition: good
          </li>
        </ul>
      </div>
    </div>
  );
}