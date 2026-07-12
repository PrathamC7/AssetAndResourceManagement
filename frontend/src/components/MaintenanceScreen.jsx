import React, { useState, useEffect } from 'react';

export function MaintenanceScreen({ onNavigate, user, onAction }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = user?.token;

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/maintenance-requests', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const apiRes = await res.json();
        setRequests(apiRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching maintenance requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRequests();
  }, [token]);

  // Group requests by status for Kanban view
  const columns = [
    { key: 'PENDING', title: 'Pending' },
    { key: 'APPROVED', title: 'Approved' },
    { key: 'ASSIGNED', title: 'Technician assigned' },
    { key: 'IN_PROGRESS', title: 'in progress' },
    { key: 'RESOLVED', title: 'Resolved' }
  ];

  const getRequestsByStatus = (status) => {
    return requests.filter(r => r.status === status);
  };

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`/api/v1/maintenance-requests/${id}/${action}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Failed'); }
      fetchRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading maintenance requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full text-slate-800 pb-24">
      
      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const items = getRequestsByStatus(col.key);
          return (
            <div key={col.key} className="flex-1 min-w-[200px] flex flex-col gap-4">
              
              {/* Column Title */}
              <h3 className="text-sm font-bold text-slate-400 border-b border-slate-200 pb-2">
                {col.title} ({items.length})
              </h3>

              {/* Column Cards */}
              {items.length > 0 ? (
                items.map(item => (
                  col.key === 'RESOLVED' ? (
                    <div key={item.id} className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-[12px] p-4 shadow-sm flex flex-col gap-2 font-semibold">
                      <span className="font-bold text-xs text-emerald-600">{item.assetTag || `#${item.id}`}</span>
                      <p className="text-xs leading-relaxed">{item.description || 'Resolved'}</p>
                      {item.resolutionNotes && <p className="text-[10px] text-emerald-500 italic">{item.resolutionNotes}</p>}
                    </div>
                  ) : (
                    <div key={item.id} className="bg-white border border-slate-300 rounded-[12px] p-4 shadow-sm flex flex-col gap-2 font-semibold">
                      <span className="text-slate-400 font-bold text-xs">{item.assetTag || `#${item.id}`}</span>
                      <p className="text-slate-800 text-xs leading-relaxed">{item.description || 'Maintenance request'}</p>
                      {item.assignedToName && <p className="text-[10px] text-slate-400">Tech: {item.assignedToName}</p>}
                      
                      {/* Action buttons based on status */}
                      <div className="flex gap-1.5 mt-1">
                        {col.key === 'PENDING' && (
                          <button onClick={() => handleAction(item.id, 'approve')} className="text-[10px] font-bold text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded cursor-pointer hover:bg-emerald-50">Approve</button>
                        )}
                        {col.key === 'ASSIGNED' && (
                          <button onClick={() => handleAction(item.id, 'start')} className="text-[10px] font-bold text-blue-600 border border-blue-200 px-2 py-0.5 rounded cursor-pointer hover:bg-blue-50">Start</button>
                        )}
                        {col.key === 'IN_PROGRESS' && (
                          <button onClick={() => handleAction(item.id, 'resolve')} className="text-[10px] font-bold text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded cursor-pointer hover:bg-emerald-50">Resolve</button>
                        )}
                      </div>
                    </div>
                  )
                ))
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[12px] p-4 text-center">
                  <p className="text-[10px] text-slate-400 italic">No items</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Caption info text */}
      <div className="text-xs text-slate-400 font-medium pt-4">
        Approving a card moves the asset to under maintenance, resolving return it to available
      </div>
    </div>
  );
}
