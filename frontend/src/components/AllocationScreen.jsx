import React, { useState, useEffect } from 'react';
import { 
  getAssets, 
  getUsers, 
  getActiveAllocations, 
  createAllocation, 
  returnAsset, 
  createTransfer, 
  getTransfers, 
  approveTransfer, 
  rejectTransfer 
} from '../services/api';

export function AllocationScreen({ onNavigate, user, onAction }) {
  const [activeSubTab, setActiveSubTab] = useState('allocate'); // 'allocate' or 'transfers'
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Allocation/Transfer Form State
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [targetEmployeeId, setTargetEmployeeId] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Return Check-in State
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [conditionNotes, setConditionNotes] = useState('');

  // Find info about the currently selected asset
  const selectedAsset = assets.find(a => a.id === parseInt(selectedAssetId, 10));
  // Check if it is currently allocated
  const isSelectedAssetAllocated = selectedAsset?.lifecycleState === 'ALLOCATED';
  const activeAllocationForSelectedAsset = allocations.find(al => al.assetId === selectedAsset?.id);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all assets
      const assetRes = await getAssets({ size: 100 });
      setAssets(assetRes.data?.data?.content || []);

      // Fetch employees
      const userRes = await getUsers({ size: 100 });
      setEmployees(userRes.data?.data?.content || []);

      // Fetch active allocations
      const allocRes = await getActiveAllocations();
      setAllocations(allocRes.data?.data || []);

      // Fetch transfer requests
      const transferRes = await getTransfers();
      setTransfers(transferRes.data?.data || []);
    } catch (err) {
      console.error('Error fetching allocation datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchData();
    }
  }, [user, activeSubTab]);

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssetId || !targetEmployeeId) {
      alert('Please select an asset and an assignee');
      return;
    }

    try {
      setSubmitting(true);
      if (isSelectedAssetAllocated) {
        // Asset is already allocated, so raise a transfer request instead
        if (!transferReason) {
          alert('Please enter a reason for the transfer request');
          return;
        }
        await createTransfer({
          assetId: parseInt(selectedAssetId, 10),
          toUserId: parseInt(targetEmployeeId, 10),
          reason: transferReason
        });
        alert('Transfer request raised! Requires manager/head approval.');
        setTransferReason('');
      } else {
        // Asset is available, allocate it directly
        if (!expectedReturnDate) {
          alert('Please select an expected return date');
          return;
        }
        const tomorrow = new Date();
        tomorrow.setHours(0,0,0,0);
        const checkDate = new Date(expectedReturnDate);
        if (checkDate <= tomorrow) {
          alert('Expected return date must be in the future');
          return;
        }

        await createAllocation({
          assetId: parseInt(selectedAssetId, 10),
          assignedTo: parseInt(targetEmployeeId, 10),
          expectedReturnDate: expectedReturnDate
        });
        alert('Asset allocated successfully!');
        setExpectedReturnDate('');
      }
      
      setSelectedAssetId('');
      setTargetEmployeeId('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnClick = (alloc) => {
    setSelectedAllocation(alloc);
    setConditionNotes('Good');
    setShowReturnModal(true);
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAllocation) return;

    try {
      setSubmitting(true);
      await returnAsset(selectedAllocation.id, { conditionNotes });
      setShowReturnModal(false);
      setSelectedAllocation(null);
      fetchData();
      alert('Asset checked-in successfully and status reverted to Available!');
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTransferApproval = async (id, approve) => {
    try {
      if (approve) {
        await approveTransfer(id);
        alert('Transfer request approved and asset re-allocated!');
      } else {
        await rejectTransfer(id);
        alert('Transfer request rejected!');
      }
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Transfer decision failed');
    }
  };

  const isOperator = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER' || user?.role === 'DEPARTMENT_HEAD';

  return (
    <div className="space-y-6 max-w-6xl w-full text-slate-800 pb-24 animate-fade-in">
      
      {/* Sub Tabs */}
      <div className="flex gap-4 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('allocate')}
          className={`pb-2 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeSubTab === 'allocate' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Allocations & Check-ins
        </button>
        <button
          onClick={() => setActiveSubTab('transfers')}
          className={`pb-2 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeSubTab === 'transfers' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Transfer Requests
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-[12px] shadow-sm">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm mt-3">Loading allocation flows...</p>
        </div>
      ) : activeSubTab === 'allocate' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Allocation Action Form Panel */}
          <div className="lg:col-span-1 bg-white border border-slate-200 p-5 rounded-[12px] shadow-sm h-fit space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-150 pb-2">
              Allocate & Transfer Console
            </h3>

            <form onSubmit={handleActionSubmit} className="space-y-4">
              {/* Asset Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Select Asset *</label>
                <select
                  required
                  className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-xs outline-none cursor-pointer font-semibold"
                  value={selectedAssetId}
                  onChange={(e) => {
                    setSelectedAssetId(e.target.value);
                    setTargetEmployeeId('');
                  }}
                >
                  <option value="">Choose Asset...</option>
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>
                      [{a.assetTag}] {a.name} ({a.lifecycleState})
                    </option>
                  ))}
                </select>
              </div>

              {selectedAsset && (
                <>
                  {/* Selected Asset Status Summary */}
                  <div className="p-3.5 rounded-lg border border-slate-150 bg-slate-50/50 space-y-1 text-xs">
                    <p className="font-bold text-slate-900">Current Status: {selectedAsset.lifecycleState}</p>
                    <p className="text-slate-500 font-semibold">Location: {selectedAsset.location || 'N/A'}</p>
                    {isSelectedAssetAllocated && activeAllocationForSelectedAsset && (
                      <div className="mt-2 pt-2 border-t border-slate-200 text-red-600 font-bold">
                        <p>Currently held by: {activeAllocationForSelectedAsset.userName}</p>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase">Direct reallocation is blocked. Raising a Transfer Request instead.</p>
                      </div>
                    )}
                  </div>

                  {/* Assignee select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      {isSelectedAssetAllocated ? 'Transfer To Employee *' : 'Allocate To Employee *'}
                    </label>
                    <select
                      required
                      className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-xs outline-none cursor-pointer font-semibold"
                      value={targetEmployeeId}
                      onChange={(e) => setTargetEmployeeId(e.target.value)}
                    >
                      <option value="">Select Assignee...</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                  </div>

                  {isSelectedAssetAllocated ? (
                    /* Transfer Reason input */
                    <div className="space-y-1.5 animate-fade-in">
                      <label className="text-xs font-bold text-slate-700 block">Reason for Transfer *</label>
                      <textarea
                        required
                        placeholder="Why is this transfer needed?"
                        rows="3"
                        className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-xs outline-none resize-none font-semibold"
                        value={transferReason}
                        onChange={(e) => setTransferReason(e.target.value)}
                      />
                    </div>
                  ) : (
                    /* Expected Return Date input */
                    <div className="space-y-1.5 animate-fade-in">
                      <label className="text-xs font-bold text-slate-700 block">Expected Return Date *</label>
                      <input
                        type="date"
                        required
                        className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-xs outline-none font-semibold"
                        value={expectedReturnDate}
                        onChange={(e) => setExpectedReturnDate(e.target.value)}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-2 rounded-lg text-xs font-bold text-white shadow-sm transition-colors cursor-pointer ${isSelectedAssetAllocated ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-900 hover:bg-slate-800'}`}
                  >
                    {submitting ? 'Processing...' : isSelectedAssetAllocated ? 'Raise Transfer Request' : 'Allocate Asset'}
                  </button>
                </>
              )}
            </form>
          </div>

          {/* Active Allocations Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-900">Active Allocations Directory</h3>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Asset Tag</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Asset Name</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Assigned To</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Return Date</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-sm">
                    {allocations.map((alloc) => (
                      <tr key={alloc.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{alloc.assetTag}</td>
                        <td className="px-6 py-4 text-slate-700 font-semibold">{alloc.assetName}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{alloc.userName}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{alloc.expectedReturnDate}</td>
                        <td className="px-6 py-4">
                          {alloc.isOverdue ? (
                            <span className="inline-flex px-2.5 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 rounded-full uppercase">
                              Overdue
                            </span>
                          ) : (
                            <span className="inline-flex px-2.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200 rounded-full uppercase">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleReturnClick(alloc)}
                            className="text-xs font-bold text-slate-900 border border-slate-350 hover:bg-slate-50 py-1 px-3 rounded-lg transition-colors cursor-pointer"
                          >
                            Return Check-in
                          </button>
                        </td>
                      </tr>
                    ))}
                    {allocations.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400 italic font-semibold">
                          No active asset allocations recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Transfer Requests List Tab */
        <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden mt-4">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Asset</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">From User</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">To User</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Reason</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-sm">
                {transfers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{t.assetName}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{t.fromUserName || 'System'}</td>
                    <td className="px-6 py-4 text-slate-650 font-bold">{t.toUserName}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{t.reason}</td>
                    <td className="px-6 py-4">
                      {t.status === 'PENDING' ? (
                        <span className="inline-flex px-2.5 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 rounded-full">PENDING</span>
                      ) : t.status === 'APPROVED' ? (
                        <span className="inline-flex px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full">APPROVED</span>
                      ) : (
                        <span className="inline-flex px-2.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-400 border border-slate-200 rounded-full">{t.status}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {t.status === 'PENDING' && isOperator ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleTransferApproval(t.id, true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1 px-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleTransferApproval(t.id, false)}
                            className="bg-white hover:bg-slate-50 text-rose-600 border border-rose-250 text-xs font-bold py-1 px-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No actions pending</span>
                      )}
                    </td>
                  </tr>
                ))}
                {transfers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400 italic font-semibold">
                      No transfer requests submitted.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Return Asset Modal */}
      {showReturnModal && selectedAllocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[18px] border border-slate-200 shadow-2xl p-6 flex flex-col text-slate-800">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-5">
              <h3 className="text-lg font-bold text-slate-900">Return Asset Check-in</h3>
              <button 
                onClick={() => { setShowReturnModal(false); setSelectedAllocation(null); }} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer material-symbols-outlined"
              >
                close
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div className="text-xs font-semibold text-slate-500 space-y-1">
                <p>Asset: <span className="font-bold text-slate-800">[{selectedAllocation.assetTag}] {selectedAllocation.assetName}</span></p>
                <p>Assigned To: <span className="font-bold text-slate-800">{selectedAllocation.userName}</span></p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Asset Check-in Notes *</label>
                <textarea
                  required
                  placeholder="Record condition details (e.g. Good, Minor scratches)..."
                  rows="3.5"
                  className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-xs outline-none resize-none font-semibold"
                  value={conditionNotes}
                  onChange={(e) => setConditionNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
                <button 
                  type="button" 
                  onClick={() => { setShowReturnModal(false); setSelectedAllocation(null); }} 
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-650 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Checking-in...' : 'Check-in Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
