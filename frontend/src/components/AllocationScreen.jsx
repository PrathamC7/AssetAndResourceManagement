import React, { useState, useEffect } from 'react';

export function AllocationScreen({ onNavigate, user, onAction }) {
  const [allocations, setAllocations] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transfer');

  // Transfer form state
  const [selectedAsset, setSelectedAsset] = useState('');
  const [targetEmployee, setTargetEmployee] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const token = user?.token;

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

      const [allocRes, transferRes, usersRes, assetsRes] = await Promise.all([
        fetch('/api/v1/allocations', { headers }),
        fetch('/api/v1/transfers', { headers }),
        fetch('/api/v1/users?size=100', { headers }),
        fetch('/api/v1/assets?size=100', { headers })
      ]);

      if (allocRes.ok) { const d = await allocRes.json(); setAllocations(d.data || []); }
      if (transferRes.ok) { const d = await transferRes.json(); setTransfers(d.data || []); }
      if (usersRes.ok) { const d = await usersRes.json(); setUsers(d.data?.content || []); }
      if (assetsRes.ok) { const d = await assetsRes.json(); setAssets(d.data?.content || []); }
    } catch (err) {
      console.error('Error loading allocation data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAsset || !targetEmployee || !reason) {
      alert('Please fill all fields');
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch('/api/v1/transfers', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: parseInt(selectedAsset),
          toUserId: parseInt(targetEmployee),
          reason
        })
      });
      const apiRes = await res.json();
      if (!res.ok) throw new Error(apiRes.message || 'Transfer request failed');
      alert('Transfer request submitted successfully!');
      setSelectedAsset('');
      setTargetEmployee('');
      setReason('');
      fetchData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveTransfer = async (id) => {
    try {
      const res = await fetch(`/api/v1/transfers/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Failed'); }
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRejectTransfer = async (id) => {
    try {
      const res = await fetch(`/api/v1/transfers/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Failed'); }
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading allocations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl w-full text-slate-800 pb-24">

      {/* Tabs */}
      <div className="flex gap-3 pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('transfer')}
          className={`px-5 py-2 text-sm font-semibold rounded-lg shadow-sm cursor-pointer ${activeTab === 'transfer' ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors'}`}
        >
          Request Transfer
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-5 py-2 text-sm font-semibold rounded-lg shadow-sm cursor-pointer ${activeTab === 'pending' ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors'}`}
        >
          Pending Transfers ({transfers.filter(t => t.status === 'PENDING').length})
        </button>
      </div>

      {activeTab === 'transfer' && (
        <>
          {/* Transfer Request Form */}
          <form className="space-y-5 pt-2" onSubmit={handleTransferSubmit}>
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">Transfer Request</h3>
            
            {/* Asset selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider">Asset</label>
              <select
                className="w-full bg-white border border-slate-300 hover:border-slate-400 focus:border-slate-500 rounded-lg py-2.5 px-3.5 text-sm text-slate-900 transition-all outline-none cursor-pointer"
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                required
              >
                <option disabled value="">Select Asset...</option>
                {assets.filter(a => a.lifecycleState === 'ALLOCATED').map(a => (
                  <option key={a.id} value={a.id}>{a.assetTag} - {a.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* To */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider">Transfer To</label>
                <select 
                  className="w-full bg-white border border-slate-300 hover:border-slate-400 focus:border-slate-500 rounded-lg py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 transition-all outline-none cursor-pointer"
                  value={targetEmployee}
                  onChange={(e) => setTargetEmployee(e.target.value)}
                  required
                >
                  <option disabled value="">Select Employee....</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} - {u.email}</option>
                  ))}
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
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>

          {/* Allocation History */}
          <div className="pt-6 border-t border-slate-200 space-y-3">
            <h3 className="text-base font-bold text-slate-900">Active Allocations</h3>
            {allocations.length > 0 ? (
              <ul className="space-y-2 text-xs text-slate-500 font-medium">
                {allocations.slice(0, 10).map((alloc) => (
                  <li key={alloc.id} className="leading-relaxed">
                    <span className="font-bold text-slate-700">{alloc.assetTag || 'Asset'}</span> - Allocated to {alloc.allocatedToName || 'User'} 
                    {alloc.allocatedAt && <span className="text-slate-400"> ({new Date(alloc.allocatedAt).toLocaleDateString()})</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">No active allocations.</p>
            )}
          </div>
        </>
      )}

      {activeTab === 'pending' && (
        <div className="space-y-4">
          {transfers.filter(t => t.status === 'PENDING').length > 0 ? (
            transfers.filter(t => t.status === 'PENDING').map(t => (
              <div key={t.id} className="bg-white border border-slate-200 rounded-[12px] p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.assetTag || 'Asset'} - {t.assetName || ''}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      From: <span className="font-bold text-slate-700">{t.fromUserName || 'N/A'}</span> → To: <span className="font-bold text-slate-700">{t.toUserName || 'N/A'}</span>
                    </p>
                    {t.reason && <p className="text-xs text-slate-400 mt-1 italic">Reason: {t.reason}</p>}
                  </div>
                  <span className="inline-flex px-3 py-1 text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 rounded-full">Pending</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleApproveTransfer(t.id)}
                    className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectTransfer(t.id)}
                    className="px-4 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 italic text-sm">No pending transfers.</div>
          )}
        </div>
      )}
    </div>
  );
}
