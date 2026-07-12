import React, { useState, useEffect } from 'react';

export function AuditScreen({ onNavigate, user, onAction }) {
  const [cycles, setCycles] = useState([]);
  const [selectedCycleId, setSelectedCycleId] = useState('');
  const [cycleDetails, setCycleDetails] = useState(null);
  const [loadingCycles, setLoadingCycles] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Modals & Action Data State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [assets, setAssets] = useState([]);
  const [auditors, setAuditors] = useState([]);
  const [activeAssignment, setActiveAssignment] = useState(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });
  
  const [assignForm, setAssignForm] = useState({
    assetId: '',
    auditorId: ''
  });

  const [verifyForm, setVerifyForm] = useState({
    finding: 'VERIFIED',
    notes: ''
  });

  // Fetch all audit cycles
  const fetchCycles = async (selectId = null) => {
    try {
      setLoadingCycles(true);
      const res = await fetch('/api/v1/audit-cycles', {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Failed to load audit cycles');
      
      const apiRes = await res.json();
      const list = apiRes.data || [];
      setCycles(list);
      
      if (selectId) {
        setSelectedCycleId(selectId.toString());
      } else if (list.length > 0 && !selectedCycleId) {
        setSelectedCycleId(list[0].id.toString());
      }
    } catch (err) {
      console.error('Error fetching cycles:', err);
    } finally {
      setLoadingCycles(false);
    }
  };

  // Fetch selected cycle details & assignments checklist
  const fetchCycleDetails = async () => {
    if (!selectedCycleId) return;
    try {
      setLoadingDetails(true);
      const res = await fetch(`/api/v1/audit-cycles/${selectedCycleId}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Failed to load audit cycle details');
      
      const apiRes = await res.json();
      setCycleDetails(apiRes.data);
    } catch (err) {
      console.error('Error fetching details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Fetch supporting lists for assignment dropdowns
  const fetchAssignmentData = async () => {
    try {
      // Assets
      const assetsRes = await fetch('/api/v1/assets?size=100', {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      if (assetsRes.ok) {
        const data = await assetsRes.json();
        setAssets(data.data.content || []);
      }
      
      // Users/Auditors
      const usersRes = await fetch('/api/v1/users?size=100', {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      if (usersRes.ok) {
        const data = await usersRes.json();
        setAuditors(data.data.content || []);
      }
    } catch (err) {
      console.error('Error fetching assignment datasets:', err);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchCycles();
    }
  }, [user]);

  useEffect(() => {
    if (user?.token && selectedCycleId) {
      fetchCycleDetails();
    }
  }, [user, selectedCycleId]);

  useEffect(() => {
    if (user?.token && showAssignModal) {
      fetchAssignmentData();
    }
  }, [user, showAssignModal]);

  // Create audit cycle submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.name || !createForm.startDate) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/v1/audit-cycles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: createForm.name,
          description: createForm.description,
          startDate: createForm.startDate,
          endDate: createForm.endDate || null
        })
      });

      const apiRes = await res.json();
      if (!res.ok) throw new Error(apiRes.message || 'Creation failed');

      alert('Audit cycle created successfully!');
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '', startDate: new Date().toISOString().split('T')[0], endDate: '' });
      fetchCycles(apiRes.data.id);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Assign asset submit
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignForm.assetId || !assignForm.auditorId) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/v1/audit-cycles/${selectedCycleId}/assignments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assetId: parseInt(assignForm.assetId, 10),
          auditorId: parseInt(assignForm.auditorId, 10)
        })
      });

      const apiRes = await res.json();
      if (!res.ok) throw new Error(apiRes.message || 'Assignment failed');

      alert('Asset assigned to checklist successfully!');
      setShowAssignModal(false);
      setAssignForm({ assetId: '', auditorId: '' });
      fetchCycleDetails();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Record finding submit
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!activeAssignment) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/v1/audit-cycles/assignments/${activeAssignment.id}/finding`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          finding: verifyForm.finding,
          notes: verifyForm.notes
        })
      });

      const apiRes = await res.json();
      if (!res.ok) throw new Error(apiRes.message || 'Failed to submit finding');

      alert('Verification finding recorded!');
      setShowVerifyModal(false);
      setActiveAssignment(null);
      setVerifyForm({ finding: 'VERIFIED', notes: '' });
      fetchCycleDetails();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Close cycle
  const handleCloseCycle = async () => {
    if (!window.confirm('Are you sure you want to close this audit cycle? This will lock findings.')) return;

    try {
      const res = await fetch(`/api/v1/audit-cycles/${selectedCycleId}/close`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const apiRes = await res.json();
      if (!res.ok) throw new Error(apiRes.message || 'Failed to close cycle');
      
      alert('Audit cycle closed!');
      fetchCycles(selectedCycleId);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const getFindingBadge = (finding) => {
    if (!finding) {
      return (
        <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200 rounded-full">
          Unverified
        </span>
      );
    }
    switch (finding) {
      case 'VERIFIED':
        return (
          <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full">
            Verified
          </span>
        );
      case 'DAMAGED':
        return (
          <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 rounded-full">
            Damaged
          </span>
        );
      case 'MISSING':
        return (
          <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 rounded-full">
            Missing
          </span>
        );
      default:
        return (
          <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200 rounded-full">
            {finding}
          </span>
        );
    }
  };

  // Discrepancy counts
  const assignments = cycleDetails?.assignments || [];
  const discrepancies = assignments.filter(a => a.finding === 'DAMAGED' || a.finding === 'MISSING').length;

  return (
    <div className="space-y-6 max-w-4xl w-full text-slate-800">
      
      {/* Top Controls: Selector and New Cycle */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col gap-1 w-full max-w-xs">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Audit Cycle</label>
          {loadingCycles ? (
            <div className="h-10 bg-slate-100 rounded-lg animate-pulse"></div>
          ) : cycles.length > 0 ? (
            <select
              className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-800 font-semibold outline-none cursor-pointer shadow-sm"
              value={selectedCycleId}
              onChange={(e) => setSelectedCycleId(e.target.value)}
            >
              {cycles.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.status})</option>
              ))}
            </select>
          ) : (
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 italic text-sm">
              No audit cycles found.
            </div>
          )}
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors shadow-sm cursor-pointer whitespace-nowrap"
        >
          + Open Audit Cycle
        </button>
      </div>

      {/* Cycle detail block */}
      {cycleDetails && (
        <div className="bg-slate-100 border border-slate-200 text-slate-850 rounded-[12px] p-5 shadow-sm space-y-1.5 relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${cycleDetails.status === 'OPEN' ? 'bg-emerald-50 text-emerald-600 border-emerald-250' : 'bg-slate-200 text-slate-600 border-slate-300'}`}>
              {cycleDetails.status}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900">{cycleDetails.name}</h3>
          {cycleDetails.description && <p className="text-sm text-slate-650">{cycleDetails.description}</p>}
          <p className="text-xs text-slate-500 font-semibold">
            Timeline: {new Date(cycleDetails.startDate).toLocaleDateString()} to {cycleDetails.endDate ? new Date(cycleDetails.endDate).toLocaleDateString() : 'Ongoing'}
          </p>
          
          {cycleDetails.status === 'OPEN' && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">assignment_add</span>
              <span>Assign Asset to Audit</span>
            </button>
          )}
        </div>
      )}

      {/* Checklist Table */}
      {loadingDetails ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-[12px] shadow-sm">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm mt-3">Loading checklist...</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden mt-4">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Asset & Tag</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Assigned Auditor</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Finding</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Verify Date</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-sm">
                {assignments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{item.assetName}</div>
                      <div className="text-xs text-slate-400 font-bold">{item.assetId ? `ID: ${item.assetId}` : 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-semibold">{item.auditorName || 'System Assigned'}</td>
                    <td className="px-6 py-4">{getFindingBadge(item.finding)}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {item.auditedAt ? new Date(item.auditedAt).toLocaleString() : 'Pending'}
                    </td>
                    <td className="px-6 py-4">
                      {cycleDetails?.status === 'OPEN' && !item.finding && (
                        <button
                          onClick={() => {
                            setActiveAssignment(item);
                            setShowVerifyModal(true);
                          }}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                        >
                          Verify Status
                        </button>
                      )}
                      {item.finding && item.notes && (
                        <span className="text-xs text-slate-450 italic block max-w-[150px] truncate" title={item.notes}>
                          "{item.notes}"
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {assignments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">
                      No assets assigned to this audit checklist yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Discrepancy warning banner */}
      {discrepancies > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-[12px] p-4 text-xs text-amber-700 font-bold leading-relaxed">
          {discrepancies} assets flagged with discrepancies - discrepancy report generated automatically.
        </div>
      )}

      {/* Close Cycle Action */}
      {cycleDetails?.status === 'OPEN' && (
        <div className="pt-2">
          <button 
            onClick={handleCloseCycle}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
          >
            Close Audit Cycle
          </button>
        </div>
      )}

      {/* Create Cycle Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[18px] border border-slate-200 shadow-2xl p-6 flex flex-col text-slate-800">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-5">
              <h3 className="text-lg font-bold text-slate-900">Open New Audit Cycle</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 material-symbols-outlined cursor-pointer">
                close
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Cycle Name *</label>
                <input
                  type="text" required placeholder="e.g. Q3 Engineering Audit"
                  className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm outline-none"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Description</label>
                <textarea
                  placeholder="Cycle scope details..." rows="2"
                  className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm outline-none resize-none"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Start Date *</label>
                  <input
                    type="date" required
                    className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm outline-none"
                    value={createForm.startDate}
                    onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">End Date (Target)</label>
                  <input
                    type="date"
                    className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm outline-none"
                    value={createForm.endDate}
                    onChange={(e) => setCreateForm({ ...createForm, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
                <button
                  type="button" onClick={() => setShowCreateModal(false)}
                  className="px-4.5 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={submitting}
                  className="px-4.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Creating...' : 'Open Cycle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Asset Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[18px] border border-slate-200 shadow-2xl p-6 flex flex-col text-slate-800">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-5">
              <h3 className="text-lg font-bold text-slate-900">Assign Asset to checklist</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600 material-symbols-outlined cursor-pointer">
                close
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Select Asset *</label>
                <select
                  required className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm outline-none cursor-pointer"
                  value={assignForm.assetId}
                  onChange={(e) => setAssignForm({ ...assignForm, assetId: e.target.value })}
                >
                  <option value="">Choose Asset</option>
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.assetTag})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Select Auditor *</label>
                <select
                  required className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm outline-none cursor-pointer"
                  value={assignForm.auditorId}
                  onChange={(e) => setAssignForm({ ...assignForm, auditorId: e.target.value })}
                >
                  <option value="">Choose User</option>
                  {auditors.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
                <button
                  type="button" onClick={() => setShowAssignModal(false)}
                  className="px-4.5 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={submitting}
                  className="px-4.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verify Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[18px] border border-slate-200 shadow-2xl p-6 flex flex-col text-slate-800">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-5">
              <h3 className="text-lg font-bold text-slate-900">Record Verification Finding</h3>
              <button 
                onClick={() => {
                  setShowVerifyModal(false);
                  setActiveAssignment(null);
                }} 
                className="text-slate-400 hover:text-slate-600 material-symbols-outlined cursor-pointer"
              >
                close
              </button>
            </div>

            {activeAssignment && (
              <div className="mb-4 text-xs font-semibold text-slate-500">
                Asset: <span className="text-slate-800 font-bold">{activeAssignment.assetName}</span>
              </div>
            )}

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Verification Status *</label>
                <select
                  required className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm outline-none cursor-pointer"
                  value={verifyForm.finding}
                  onChange={(e) => setVerifyForm({ ...verifyForm, finding: e.target.value })}
                >
                  <option value="VERIFIED">Verified (Matches expectation)</option>
                  <option value="DAMAGED">Damaged (Asset is damaged)</option>
                  <option value="MISSING">Missing (Asset not found)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Verification Notes / Details</label>
                <textarea
                  placeholder="e.g. Asset found in room 4B instead of expected 4A..." rows="2.5"
                  className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm outline-none resize-none"
                  value={verifyForm.notes}
                  onChange={(e) => setVerifyForm({ ...verifyForm, notes: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
                <button
                  type="button" 
                  onClick={() => {
                    setShowVerifyModal(false);
                    setActiveAssignment(null);
                  }}
                  className="px-4.5 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={submitting}
                  className="px-4.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Record Finding'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
