import React, { useState, useEffect } from 'react';
import { getAssets, getCategories as fetchCategoriesApi, registerAsset } from '../services/api';

export function AssetsScreen({ onNavigate, user, onAction }) {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal & Registration State
  const [showModal, setShowModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    serialNumber: '',
    acquisitionDate: new Date().toISOString().split('T')[0],
    cost: '',
    conditionStatus: 'EXCELLENT',
    location: '',
    isBookable: false,
    photoUrl: '',
    customFields: '{}'
  });

  // History Modal State
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const handleViewHistory = async (asset) => {
    setSelectedAsset(asset);
    setShowHistoryModal(true);
    try {
      setLoadingHistory(true);
      const res = await fetch(`/api/v1/assets/${asset.id}/history`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const apiRes = await res.json();
        setHistoryLogs(apiRes.data.content || []);
      }
    } catch (err) {
      console.error('Error fetching asset history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Fetch Assets and Categories
  const fetchAssets = async () => {
    try {
      setLoading(true);
      const params = { page, size: 10 };
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.categoryId = selectedCategory;
      if (selectedState) params.state = selectedState;

      const res = await getAssets(params);
      setAssets(res.data.data?.content || []);
      setTotalPages(res.data.data?.totalPages || 0);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetchCategoriesApi();
      setCategories(res.data.data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchAssets();
    }
  }, [user, page, selectedCategory, selectedState]);

  // Debounced search trigger
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (user?.token) {
        setPage(0);
        fetchAssets();
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    if (user?.token) {
      fetchCategories();
    }
  }, [user]);

  // Handle asset registration submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || !formData.serialNumber) {
      alert('Please fill out all required fields');
      return;
    }

    try {
      setRegistering(true);
      const payload = {
        ...formData,
        categoryId: LongFromId(formData.categoryId),
        cost: formData.cost ? parseFloat(formData.cost) : null
      };

      await registerAsset(payload);

      alert('Asset registered successfully!');
      setShowModal(false);
      // Reset form
      setFormData({
        name: '',
        categoryId: '',
        serialNumber: '',
        acquisitionDate: new Date().toISOString().split('T')[0],
        cost: '',
        conditionStatus: 'EXCELLENT',
        location: '',
        isBookable: false,
        photoUrl: '',
        customFields: '{}'
      });
      setPage(0);
      fetchAssets();
    } catch (err) {
      alert(`Registration error: ${err.response?.data?.message || err.message}`);
    } finally {
      setRegistering(false);
    }
  };

  const LongFromId = (val) => {
    return parseInt(val, 10);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full">
            Available
          </span>
        );
      case 'ALLOCATED':
        return (
          <span className="inline-flex px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 rounded-full">
            Allocated
          </span>
        );
      case 'UNDER_MAINTENANCE':
        return (
          <span className="inline-flex px-3 py-1 text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 rounded-full">
            Maintenance
          </span>
        );
      case 'LOST':
        return (
          <span className="inline-flex px-3 py-1 text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 rounded-full">
            Lost
          </span>
        );
      case 'DISPOSED':
        return (
          <span className="inline-flex px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 rounded-full">
            Disposed
          </span>
        );
      default:
        return (
          <span className="inline-flex px-3 py-1 text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl w-full text-slate-800 pb-24">
      
      {/* Top Search & Actions bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-lg">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:border-slate-500 transition-colors outline-none" 
            placeholder="Search by name, tag, or serial code.." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors shadow-sm cursor-pointer whitespace-nowrap"
        >
          + Register Asset
        </button>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-3 items-center pt-1">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
          <select
            className="bg-white border border-slate-300 rounded-lg py-1.5 px-3 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50 cursor-pointer shadow-sm min-w-[140px]"
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(0); }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lifecycle Status</label>
          <select
            className="bg-white border border-slate-300 rounded-lg py-1.5 px-3 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50 cursor-pointer shadow-sm min-w-[140px]"
            value={selectedState}
            onChange={(e) => { setSelectedState(e.target.value); setPage(0); }}
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ALLOCATED">Allocated</option>
            <option value="UNDER_MAINTENANCE">Maintenance</option>
            <option value="LOST">Lost</option>
            <option value="DISPOSED">Disposed</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      {loading && assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-white border border-slate-200 rounded-[12px] shadow-sm">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm">Loading asset registry...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-[12px] p-6 text-sm text-red-600 font-semibold">
          Error loading assets: {error}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden mt-4">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Asset Tag</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Location</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-sm">
                {assets.map((asset) => (
                  <tr 
                    key={asset.id} 
                    onClick={() => handleViewHistory(asset)}
                    className="hover:bg-slate-100/55 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900">{asset.assetTag}</td>
                    <td className="px-6 py-4 text-slate-700 font-semibold">{asset.name}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{asset.categoryName}</td>
                    <td className="px-6 py-4">{getStatusBadge(asset.lifecycleState)}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{asset.location || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {asset.cost ? `$${asset.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'N/A'}
                    </td>
                  </tr>
                ))}
                {assets.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400 italic">
                      No assets found in the registry matching the specified filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
              <span className="text-xs text-slate-500 font-semibold">
                Page {page + 1} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Asset Registration Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-[18px] border border-slate-200 shadow-2xl p-6 flex flex-col text-slate-800 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-5">
              <h3 className="text-lg font-bold text-slate-900">Register New Asset</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer material-symbols-outlined"
              >
                close
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">Asset Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MacBook Pro 16-inch"
                    className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-900 placeholder-slate-400 outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Category *</label>
                  <select
                    required
                    className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-900 outline-none cursor-pointer"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Serial Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Serial Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. C02X87GBJG5"
                    className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-900 placeholder-slate-400 outline-none"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  />
                </div>

                {/* Acquisition Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Acquisition Date *</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-900 outline-none"
                    value={formData.acquisitionDate}
                    onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })}
                  />
                </div>

                {/* Cost */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Purchase Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 1499.00"
                    className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-900 placeholder-slate-400 outline-none"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">Location / Office Room</label>
                  <input
                    type="text"
                    placeholder="e.g. Floor 3, Bengalru Tech Park"
                    className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-900 placeholder-slate-400 outline-none"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                {/* Condition Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Condition Status</label>
                  <select
                    className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-900 outline-none cursor-pointer"
                    value={formData.conditionStatus}
                    onChange={(e) => setFormData({ ...formData, conditionStatus: e.target.value })}
                  >
                    <option value="NEW">New</option>
                    <option value="EXCELLENT">Excellent</option>
                    <option value="GOOD">Good</option>
                    <option value="FAIR">Fair</option>
                    <option value="POOR">Poor</option>
                  </select>
                </div>

                {/* Bookable Checkbox */}
                <div className="flex items-center gap-2.5 pt-6 pl-1">
                  <input
                    id="isBookable"
                    type="checkbox"
                    className="w-4.5 h-4.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                    checked={formData.isBookable}
                    onChange={(e) => setFormData({ ...formData, isBookable: e.target.checked })}
                  />
                  <label htmlFor="isBookable" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                    Available for shared booking
                  </label>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 pt-5 border-t border-slate-200 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-650 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registering}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-wait cursor-pointer"
                >
                  {registering ? 'Saving...' : 'Register Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Asset History Modal */}
      {showHistoryModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-[18px] border border-slate-200 shadow-2xl p-6 flex flex-col text-slate-800 max-h-[85vh] overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-5 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Asset Lifecycle History</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">{selectedAsset.name} ({selectedAsset.assetTag})</p>
              </div>
              <button 
                onClick={() => { setShowHistoryModal(false); setSelectedAsset(null); setHistoryLogs([]); }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer material-symbols-outlined"
              >
                close
              </button>
            </div>

            {/* Logs Timeline */}
            <div className="flex-grow overflow-y-auto space-y-4 pr-1">
              {loadingHistory ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-2">
                  <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-semibold text-xs">Loading history logs...</p>
                </div>
              ) : historyLogs.length > 0 ? (
                <div className="relative border-l border-slate-200 ml-3 pl-5 space-y-5 pb-2">
                  {historyLogs.map((log) => (
                    <div key={log.id} className="relative">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[26px] top-1.5 w-3 h-3 rounded-full bg-slate-900 border-2 border-white shadow-sm"></span>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-950 px-2 py-0.5 bg-slate-100 border border-slate-200 rounded uppercase tracking-wider text-[10px]">
                            {log.eventType}
                          </span>
                          <span className="text-slate-450 font-semibold">{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 leading-relaxed">{log.description}</p>
                        {log.previousState && log.newState && (
                          <p className="text-xs text-slate-500 font-medium">
                            State transition: <span className="font-bold text-slate-650">{log.previousState}</span> &rarr; <span className="font-bold text-slate-900">{log.newState}</span>
                          </p>
                        )}
                        <p className="text-[10px] text-slate-400 font-bold">Performed by: {log.performedByName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-450 italic text-center py-12 text-sm font-semibold">
                  No lifecycle event history logs recorded for this asset.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-4 border-t border-slate-250 mt-5 shrink-0">
              <button
                onClick={() => { setShowHistoryModal(false); setSelectedAsset(null); setHistoryLogs([]); }}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}