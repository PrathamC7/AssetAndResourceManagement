import React, { useState, useEffect } from 'react';
import { 
  getDepartments, 
  getCategories, 
  getUsers, 
  createDepartment, 
  createCategory, 
  deactivateDepartment, 
  updateUserRole 
} from '../services/api';

export function OrgSetupScreen({ onNavigate, user, onAction }) {
  // ALL hooks must be declared before any conditional returns (React Rules of Hooks)
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Department / Category Creation State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    description: '',
    parentId: '',
    headId: ''
  });
  
  // Promotion State
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('EMPLOYEE');

  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'departments') {
        const deptRes = await getDepartments();
        setDepartments(deptRes.data?.data || []);
        
        // Also load users to choose head from directory
        const usersRes = await getUsers({ size: 100 });
        setUsers(usersRes.data?.data?.content || []);
      } else if (activeTab === 'categories') {
        const catRes = await getCategories();
        setCategories(catRes.data?.data || []);
      } else if (activeTab === 'employees') {
        const usersRes = await getUsers({ size: 100 });
        setUsers(usersRes.data?.data?.content || []);
      }
    } catch (err) {
      console.error('Error fetching org setup dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user, activeTab]);

  // Conditional render AFTER all hooks
  if (user?.role !== 'ADMIN') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-[12px] p-6 text-sm text-red-650 font-bold max-w-lg mx-auto mt-10 shadow-sm">
        <h3 className="text-base font-extrabold mb-2 text-red-800 uppercase tracking-wider">Access Denied</h3>
        <p className="leading-relaxed">You must be an Administrator to access organizational setup records.</p>
        <button 
          onClick={() => { if(typeof onNavigate === 'function') onNavigate('dashboard'); }} 
          className="mt-4 px-4.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!addForm.name) return;

    try {
      setSubmitting(true);
      if (activeTab === 'departments') {
        const payload = {
          name: addForm.name,
          parentId: addForm.parentId ? parseInt(addForm.parentId, 10) : null,
          headId: addForm.headId ? parseInt(addForm.headId, 10) : null
        };
        await createDepartment(payload);
      } else if (activeTab === 'categories') {
        await createCategory({
          name: addForm.name,
          description: addForm.description
        });
      }
      
      setShowAddModal(false);
      setAddForm({ name: '', description: '', parentId: '', headId: '' });
      fetchData();
      alert(`${activeTab === 'departments' ? 'Department' : 'Category'} created successfully!`);
    } catch (err) {
      alert(err.response?.data?.message || 'Creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivateDept = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this department?')) return;
    try {
      await deactivateDepartment(id);
      fetchData();
      alert('Department deactivated!');
    } catch (err) {
      alert(err.response?.data?.message || 'Deactivation failed');
    }
  };

  const handlePromoteSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setSubmitting(true);
      await updateUserRole(selectedUser.id, selectedRole);
      setShowPromoteModal(false);
      setSelectedUser(null);
      fetchData();
      alert('User role updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Promotion failed');
    } finally {
      setSubmitting(false);
    }
  };

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
          Employee Directory
        </button>
        {activeTab !== 'employees' && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-semibold rounded-lg shadow-sm cursor-pointer transition-colors ml-auto flex items-center gap-1"
          >
            <span>+ Add</span>
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-[12px] shadow-sm">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm mt-3">Loading organizational records...</p>
        </div>
      ) : (
        <>
          {/* Departments Tab */}
          {activeTab === 'departments' && (
            <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden mt-4">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Department</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Head</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Parent Dept</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-sm">
                    {departments.map((dept) => (
                      <tr key={dept.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">{dept.name}</td>
                        <td className="px-6 py-4 text-slate-600 font-bold">{dept.headName || '--'}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{dept.parentName || '--'}</td>
                        <td className="px-6 py-4">
                          {dept.isActive ? (
                            <span className="inline-flex px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 rounded-full">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {dept.isActive && (
                            <button
                              onClick={() => handleDeactivateDept(dept.id)}
                              className="text-xs font-bold text-red-600 hover:text-red-800 border border-red-200 hover:bg-red-50 py-1 px-2.5 rounded-lg transition-colors cursor-pointer"
                            >
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {departments.length === 0 && (
                      <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">No departments found in company registry.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden mt-4">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[500px]">
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
                      <tr><td colSpan="2" className="px-6 py-12 text-center text-slate-400 italic">No category records found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Employees Tab */}
          {activeTab === 'employees' && (
            <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden mt-4">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Name</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Email</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-sm">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">{u.name}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 rounded-full uppercase">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {u.isActive ? (
                            <span className="inline-flex px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full">Active</span>
                          ) : (
                            <span className="inline-flex px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 rounded-full">Inactive</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setSelectedRole(u.role);
                              setShowPromoteModal(true);
                            }}
                            className="text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 py-1 px-2.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Promote / Change Role
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">No employees found in directory.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[18px] border border-slate-200 shadow-2xl p-6 flex flex-col text-slate-800">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Add {activeTab === 'departments' ? 'Department' : 'Category'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer material-symbols-outlined">close</button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Name *</label>
                <input
                  type="text" required placeholder="Enter name..."
                  className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm outline-none"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                />
              </div>

              {activeTab === 'departments' ? (
                <>
                  {/* Department Head */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Department Head</label>
                    <select
                      className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm outline-none cursor-pointer"
                      value={addForm.headId}
                      onChange={(e) => setAddForm({ ...addForm, headId: e.target.value })}
                    >
                      <option value="">Select Leader</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                  </div>

                  {/* Parent Department */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Parent Department</label>
                    <select
                      className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm outline-none cursor-pointer"
                      value={addForm.parentId}
                      onChange={(e) => setAddForm({ ...addForm, parentId: e.target.value })}
                    >
                      <option value="">None (Top Level)</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Description</label>
                  <textarea
                    placeholder="Category details..." rows="2.5"
                    className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm outline-none resize-none"
                    value={addForm.description}
                    onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-650 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm disabled:opacity-50 cursor-pointer">
                  {submitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promote Modal */}
      {showPromoteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-[18px] border border-slate-200 shadow-2xl p-6 flex flex-col text-slate-800">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-5">
              <h3 className="text-lg font-bold text-slate-900">Promote Employee</h3>
              <button onClick={() => { setShowPromoteModal(false); setSelectedUser(null); }} className="text-slate-400 hover:text-slate-600 cursor-pointer material-symbols-outlined">close</button>
            </div>

            <form onSubmit={handlePromoteSubmit} className="space-y-4">
              <div className="text-sm font-semibold text-slate-600">
                User: <span className="text-slate-900 font-bold">{selectedUser.name} ({selectedUser.email})</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Select Role *</label>
                <select
                  required
                  className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm outline-none cursor-pointer font-bold"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="EMPLOYEE">EMPLOYEE (Standard)</option>
                  <option value="ASSET_MANAGER">ASSET_MANAGER (Inventory Control)</option>
                  <option value="DEPARTMENT_HEAD">DEPARTMENT_HEAD (Approver)</option>
                  <option value="ADMIN">ADMIN (System Owner)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
                <button type="button" onClick={() => { setShowPromoteModal(false); setSelectedUser(null); }} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-650 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm disabled:opacity-50 cursor-pointer">
                  {submitting ? 'Promoting...' : 'Assign Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
