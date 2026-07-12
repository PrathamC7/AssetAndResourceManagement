import React, { useState, useEffect } from 'react';

export function OrgSetupScreen({ onNavigate, user, onAction }) {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const token = user?.token;

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/v1/departments', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const apiRes = await res.json();
        setDepartments(apiRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/v1/categories', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const apiRes = await res.json();
        setCategories(apiRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/v1/users?size=100', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const apiRes = await res.json();
        setUsers(apiRes.data?.content || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([fetchDepartments(), fetchCategories(), fetchUsers()])
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const openAddModal = () => {
    if (activeTab === 'departments') {
      setFormData({ name: '', headId: '', parentId: '' });
    } else if (activeTab === 'categories') {
      setFormData({ name: '', description: '' });
    } else {
      setFormData({ role: '' });
    }
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (activeTab === 'departments') {
        const payload = { name: formData.name };
        if (formData.headId) payload.headId = parseInt(formData.headId);
        if (formData.parentId) payload.parentId = parseInt(formData.parentId);
        const res = await fetch('/api/v1/departments', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Failed'); }
        await fetchDepartments();
      } else if (activeTab === 'categories') {
        const res = await fetch('/api/v1/categories', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, description: formData.description })
        });
        if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Failed'); }
        await fetchCategories();
      }
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePromoteUser = async (userId, role) => {
    try {
      const res = await fetch(`/api/v1/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Failed'); }
      await fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading organization data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl w-full text-slate-800 pb-24">
      
      {/* Tabs / Actions Bar */}
      <div className="flex flex-wrap gap-3 pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-5 py-2 text-sm font-semibold rounded-lg shadow-sm cursor-pointer ${activeTab === 'departments' ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors'}`}
        >
          Departments
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-2 text-sm font-semibold rounded-lg shadow-sm cursor-pointer ${activeTab === 'categories' ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors'}`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-5 py-2 text-sm font-semibold rounded-lg shadow-sm cursor-pointer ${activeTab === 'employees' ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors'}`}
        >
          Employee
        </button>
        {activeTab !== 'employees' && (
          <button
            onClick={openAddModal}
            className="px-5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-semibold rounded-lg shadow-sm cursor-pointer transition-colors ml-auto flex items-center gap-1"
          >
            <span>+ Add</span>
          </button>
        )}
      </div>

      {/* Departments Table */}
      {activeTab === 'departments' && (
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
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{dept.name}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{dept.headName || '--'}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{dept.parentName || '--'}</td>
                  <td className="px-6 py-4">
                    {dept.isActive !== false ? (
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
              {departments.length === 0 && (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">No departments created yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Categories Table */}
      {activeTab === 'categories' && (
        <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-sm">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{cat.name}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{cat.description || '--'}</td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan="2" className="px-6 py-12 text-center text-slate-400 italic">No categories created yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Employees Table */}
      {activeTab === 'employees' && (
        <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Email</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-sm">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{u.name}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 rounded-full">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.role !== 'ADMIN' && (
                      <button
                        onClick={() => handlePromoteUser(u.id, 'ADMIN')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 border border-blue-200 hover:bg-blue-50 py-1 px-3 rounded-lg transition-colors cursor-pointer"
                      >
                        Promote to Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Helper text */}
      <div className="text-xs text-slate-400 font-medium italic pt-4">
        Editing a department here also drives the picklist in Screen 4 & 5
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[18px] border border-slate-200 shadow-2xl p-6 flex flex-col text-slate-800">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                {activeTab === 'departments' ? 'Add Department' : 'Add Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer material-symbols-outlined">close</button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Name *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-900 placeholder-slate-400 outline-none"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              {activeTab === 'departments' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Department Head</label>
                    <select
                      className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-900 outline-none cursor-pointer"
                      value={formData.headId || ''}
                      onChange={(e) => setFormData({ ...formData, headId: e.target.value })}
                    >
                      <option value="">None</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Parent Department</label>
                    <select
                      className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-900 outline-none cursor-pointer"
                      value={formData.parentId || ''}
                      onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    >
                      <option value="">None (Top-level)</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                </>
              )}
              {activeTab === 'categories' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Description</label>
                  <textarea
                    className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-900 placeholder-slate-400 outline-none resize-none"
                    rows="3"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-650 hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 cursor-pointer">
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
