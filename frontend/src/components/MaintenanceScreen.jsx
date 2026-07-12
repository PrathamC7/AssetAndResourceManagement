import React, { useState, useEffect } from 'react';
import { 
  getMaintenanceRequests, 
  createMaintenanceRequest, 
  approveMaintenanceRequest, 
  rejectMaintenanceRequest, 
  startMaintenanceRequest, 
  resolveMaintenanceRequest, 
  assignMaintenanceTechnician,
  getAssets,
  getUsers
} from '../services/api';

export function MaintenanceScreen({ onNavigate, user, onAction }) {
  const [requests, setRequests] = useState([]);
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Request Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    assetId: '',
    description: '',
    priority: 'MEDIUM'
  });

  // Assign Tech Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedReqForAssign, setSelectedReqForAssign] = useState(null);
  const [selectedTechId, setSelectedTechId] = useState('');

  // Resolve Modal State
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedReqForResolve, setSelectedReqForResolve] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getMaintenanceRequests();
      setRequests(res.data?.data || []);

      const assetRes = await getAssets({ size: 100 });
      setAssets(assetRes.data?.data?.content || []);

      const userRes = await getUsers({ size: 100 });
      setEmployees(userRes.data?.data?.content || []);
    } catch (err) {
      console.error('Error loading maintenance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchRequests();
    }
  }, [user]);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!newRequest.assetId || !newRequest.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      await createMaintenanceRequest({
        assetId: parseInt(newRequest.assetId, 10),
        description: newRequest.description,
        priority: newRequest.priority
      });
      setShowAddModal(false);
      setNewRequest({ assetId: '', description: '', priority: 'MEDIUM' });
      fetchRequests();
      alert('Maintenance request raised successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to raise request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') {
        await approveMaintenanceRequest(id);
        alert('Request approved! Asset status updated to UNDER_MAINTENANCE.');
      } else if (action === 'reject') {
        await rejectMaintenanceRequest(id);
        alert('Request rejected!');
      } else if (action === 'start') {
        await startMaintenanceRequest(id);
        alert('Repair work started!');
      }
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || `Action ${action} failed`);
    }
  };

  const handleAssignClick = (req) => {
    setSelectedReqForAssign(req);
    setSelectedTechId('');
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReqForAssign || !selectedTechId) return;

    try {
      setSubmitting(true);
      await assignMaintenanceTechnician(selectedReqForAssign.realId, selectedTechId);
      setShowAssignModal(false);
      setSelectedReqForAssign(null);
      fetchRequests();
      alert('Technician assigned successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Assignment failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveClick = (req) => {
    setSelectedReqForResolve(req);
    setResolutionNotes('Repair completed successfully.');
    setShowResolveModal(true);
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReqForResolve) return;

    try {
      setSubmitting(true);
      await resolveMaintenanceRequest(selectedReqForResolve.realId, { resolutionNotes });
      setShowResolveModal(false);
      setSelectedReqForResolve(null);
      fetchRequests();
      alert('Issue resolved! Asset returned to AVAILABLE registry.');
    } catch (err) {
      alert(err.response?.data?.message || 'Resolution failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getColumns = () => {
    const statusMap = {
      'PENDING': 'Pending',
      'APPROVED': 'Approved',
      'ASSIGNED': 'Technician assigned',
      'IN_PROGRESS': 'in progress',
      'RESOLVED': 'Resolved'
    };

    const columns = [
      { title: 'Pending', cards: [] },
      { title: 'Approved', cards: [] },
      { title: 'Technician assigned', cards: [] },
      { title: 'in progress', cards: [] },
      { title: 'Resolved', cards: [] }
    ];

    requests.forEach(req => {
      const colTitle = statusMap[req.status] || 'Pending';
      const col = columns.find(c => c.title === colTitle);
      if (col) {
        col.cards.push({
          id: req.assetTag || `REQ-${req.id}`,
          assetName: req.assetName || 'Unknown Device',
          text: req.description || 'No description provided.',
          priority: req.priority || 'MEDIUM',
          isGreen: req.status === 'RESOLVED',
          realId: req.id,
          status: req.status,
          assignedTo: req.assignedTo,
          resolutionNotes: req.resolutionNotes
        });
      }
    });

    return columns;
  };

  const columns = getColumns();
  const isOperator = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-semibold text-sm">Loading maintenance pipeline...</p>
      </div>
    );
  }

  const getPriorityColor = (prio) => {
    switch(prio) {
      case 'CRITICAL': return 'bg-red-150 text-red-700 border-red-200';
      case 'HIGH': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'MEDIUM': return 'bg-blue-50 text-blue-600 border-blue-150';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 w-full text-slate-800 pb-24 animate-fade-in">
      
      {/* Upper Actions bar */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-950">Maintenance Board</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
        >
          + Raise Maintenance Request
        </button>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col, idx) => (
          <div key={idx} className="flex-1 min-w-[220px] bg-slate-50/50 p-3 rounded-[12px] border border-slate-200 flex flex-col gap-3 min-h-[500px]">
            
            {/* Column Title */}
            <h3 className="text-xs font-bold text-slate-500 border-b border-slate-200 pb-2 flex justify-between items-center">
              <span>{col.title}</span>
              {col.cards.length > 0 && (
                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full text-slate-600">
                  {col.cards.length}
                </span>
              )}
            </h3>

            {/* Column Cards */}
            <div className="space-y-3 overflow-y-auto flex-grow max-h-[600px] pr-0.5">
              {col.cards.map((card, cardIdx) => (
                <div 
                  key={card.realId || cardIdx} 
                  className={`border rounded-[12px] p-4 shadow-xs flex flex-col gap-2 font-medium bg-white ${card.isGreen ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">{card.id}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 border rounded uppercase ${getPriorityColor(card.priority)}`}>
                      {card.priority}
                    </span>
                  </div>
                  
                  <h4 className="text-xs font-bold text-slate-900">{card.assetName}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">{card.text}</p>
                  
                  {card.assignedTo && (
                    <p className="text-[10px] text-slate-400 font-bold">Technician: {card.assignedTo}</p>
                  )}

                  {card.isGreen && card.resolutionNotes && (
                    <p className="text-[10px] text-emerald-600 font-bold mt-1.5 border-t border-emerald-100 pt-1.5">
                      Resolved: {card.resolutionNotes}
                    </p>
                  )}

                  {/* Actions based on card status */}
                  {isOperator && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {card.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleAction(card.realId, 'approve')} 
                            className="text-[9px] px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold cursor-pointer transition-colors shadow-xs"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleAction(card.realId, 'reject')} 
                            className="text-[9px] px-2 py-1 bg-white hover:bg-slate-50 text-red-600 border border-red-200 rounded font-bold cursor-pointer transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {card.status === 'APPROVED' && (
                        <button 
                          onClick={() => handleAction(card.realId, 'start')} 
                          className="text-[9px] px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          Start Repair
                        </button>
                      )}

                      {(card.status === 'APPROVED' || card.status === 'ASSIGNED') && (
                        <button 
                          onClick={() => handleAssignClick(card)} 
                          className="text-[9px] px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-350 rounded font-bold cursor-pointer transition-colors"
                        >
                          Assign Tech
                        </button>
                      )}

                      {card.status === 'IN_PROGRESS' && (
                        <button 
                          onClick={() => handleResolveClick(card)} 
                          className="text-[9px] px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {col.cards.length === 0 && (
                <div className="text-xs text-slate-350 italic p-3 text-center">No jobs</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Caption info text */}
      <div className="text-xs text-slate-400 font-semibold italic pt-4">
        * Approving a pending card sets the asset to UNDER_MAINTENANCE. Resolving it reverts the status to AVAILABLE.
      </div>

      {/* Raise Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[18px] border border-slate-200 shadow-2xl p-6 flex flex-col text-slate-800">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-5">
              <h3 className="text-lg font-bold text-slate-900">Raise Repair Request</h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer material-symbols-outlined"
              >
                close
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              {/* Asset Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Select Asset *</label>
                <select
                  required
                  className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2.5 px-3 text-xs outline-none cursor-pointer font-semibold"
                  value={newRequest.assetId}
                  onChange={(e) => setNewRequest({ ...newRequest, assetId: e.target.value })}
                >
                  <option value="">Select Asset...</option>
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>[{a.assetTag}] {a.name}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Priority Level</label>
                <select
                  className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2.5 px-3 text-xs outline-none cursor-pointer font-semibold"
                  value={newRequest.priority}
                  onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Issue Description *</label>
                <textarea
                  required
                  placeholder="Describe the failure, error code, or structural damage..."
                  rows="3.5"
                  className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-xs outline-none resize-none font-semibold"
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-650 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Raise Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Tech Modal */}
      {showAssignModal && selectedReqForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-[18px] border border-slate-200 shadow-2xl p-6 flex flex-col text-slate-800">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-5">
              <h3 className="text-lg font-bold text-slate-900">Assign Technician</h3>
              <button 
                onClick={() => { setShowAssignModal(false); setSelectedReqForAssign(null); }} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer material-symbols-outlined"
              >
                close
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div className="text-xs font-semibold text-slate-500">
                Job: <span className="font-bold text-slate-855">[{selectedReqForAssign.id}] {selectedReqForAssign.assetName}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Select Employee *</label>
                <select
                  required
                  className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-xs outline-none cursor-pointer font-bold"
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                >
                  <option value="">Choose User...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name} ({emp.role})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
                <button 
                  type="button" 
                  onClick={() => { setShowAssignModal(false); setSelectedReqForAssign(null); }} 
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-650 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Assigning...' : 'Assign Tech'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {showResolveModal && selectedReqForResolve && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[18px] border border-slate-200 shadow-2xl p-6 flex flex-col text-slate-800">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-5">
              <h3 className="text-lg font-bold text-slate-900">Resolve Repair Job</h3>
              <button 
                onClick={() => { setShowResolveModal(false); setSelectedReqForResolve(null); }} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer material-symbols-outlined"
              >
                close
              </button>
            </div>

            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div className="text-xs font-semibold text-slate-500">
                Job: <span className="font-bold text-slate-855">[{selectedReqForResolve.id}] {selectedReqForResolve.assetName}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Resolution Action Notes *</label>
                <textarea
                  required
                  placeholder="What was fixed? E.g., replaced compressor, reinstalled OS..."
                  rows="3.5"
                  className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-xs outline-none resize-none font-semibold"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
                <button 
                  type="button" 
                  onClick={() => { setShowResolveModal(false); setSelectedReqForResolve(null); }} 
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-650 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Resolving...' : 'Complete Repair'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
