import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach JWT from localStorage
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (e) {
        // ignore parse errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: redirect to /login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export function login(email, password) {
  return api.post('/auth/login', { email, password });
}

export function signup(name, email, password) {
  return api.post('/auth/signup', { name, email, password });
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export function getDashboardSummary() {
  return api.get('/dashboard/summary');
}

// ─── Departments ─────────────────────────────────────────────────────────────
export function getDepartments() {
  return api.get('/departments');
}

export function createDepartment(data) {
  return api.post('/departments', data);
}

export function updateDepartment(id, data) {
  return api.put(`/departments/${id}`, data);
}

export function deactivateDepartment(id) {
  return api.patch(`/departments/${id}/deactivate`);
}

// ─── Categories ──────────────────────────────────────────────────────────────
export function getCategories() {
  return api.get('/categories');
}

export function createCategory(data) {
  return api.post('/categories', data);
}

export function updateCategory(id, data) {
  return api.put(`/categories/${id}`, data);
}

// ─── Users ───────────────────────────────────────────────────────────────────
export function getUsers(params = {}) {
  return api.get('/users', { params });
}

export function updateUserRole(id, role) {
  return api.patch(`/users/${id}/role`, { role });
}

export function updateUser(id, data) {
  return api.put(`/users/${id}`, data);
}

// ─── Assets ──────────────────────────────────────────────────────────────────
export function getAssets(params = {}) {
  return api.get('/assets', { params });
}

export function getAssetById(id) {
  return api.get(`/assets/${id}`);
}

export function getAssetHistory(id, params = {}) {
  return api.get(`/assets/${id}/history`, { params });
}

export function registerAsset(data) {
  return api.post('/assets', data);
}

// ─── Allocations ─────────────────────────────────────────────────────────────
export function createAllocation(data) {
  return api.post('/allocations', data);
}

export function returnAsset(id, data) {
  return api.post(`/allocations/${id}/return`, data);
}

export function getActiveAllocations() {
  return api.get('/allocations');
}

// ─── Transfers ───────────────────────────────────────────────────────────────
export function createTransfer(data) {
  return api.post('/transfers', data);
}

export function getTransfers() {
  return api.get('/transfers');
}

export function approveTransfer(id) {
  return api.patch(`/transfers/${id}/approve`);
}

export function rejectTransfer(id) {
  return api.patch(`/transfers/${id}/reject`);
}

export function getPendingTransfers() {
  return api.get('/transfers');
}

// ─── Bookings ────────────────────────────────────────────────────────────────
export function getBookings(params = {}) {
  return api.get('/bookings', { params });
}

export function createBooking(data) {
  return api.post('/bookings', data);
}

export function cancelBooking(id) {
  return api.patch(`/bookings/${id}/cancel`);
}

// ─── Maintenance ─────────────────────────────────────────────────────────────
export function getMaintenanceRequests(params = {}) {
  return api.get('/maintenance-requests', { params });
}

export function createMaintenanceRequest(data) {
  return api.post('/maintenance-requests', data);
}

export function approveMaintenanceRequest(id) {
  return api.patch(`/maintenance-requests/${id}/approve`);
}

export function rejectMaintenanceRequest(id) {
  return api.patch(`/maintenance-requests/${id}/reject`);
}

export function resolveMaintenanceRequest(id, data) {
  return api.patch(`/maintenance-requests/${id}/resolve`, data);
}

export function startMaintenanceRequest(id) {
  return api.patch(`/maintenance-requests/${id}/start`);
}

export function assignMaintenanceTechnician(id, assignedTo) {
  return api.patch(`/maintenance-requests/${id}/assign`, { assignedTo });
}

// ─── Audit ───────────────────────────────────────────────────────────────────
export function getAuditCycles() {
  return api.get('/audit-cycles');
}

export function createAuditCycle(data) {
  return api.post('/audit-cycles', data);
}

export function getAuditCycleById(id) {
  return api.get(`/audit-cycles/${id}`);
}

export function closeAuditCycle(id) {
  return api.patch(`/audit-cycles/${id}/close`);
}

export function assignAuditAsset(cycleId, data) {
  return api.post(`/audit-cycles/${cycleId}/assignments`, data);
}

export function updateAuditAssignment(assignmentId, data) {
  return api.patch(`/audit-cycles/assignments/${assignmentId}/finding`, data);
}

// ─── Notifications ───────────────────────────────────────────────────────────
export function getNotifications() {
  return api.get('/notifications');
}

export function markNotificationRead(id) {
  return api.patch(`/notifications/${id}/read`);
}

// ─── Activity Logs ───────────────────────────────────────────────────────────
export function getActivityLogs(params = {}) {
  return api.get('/activity-logs', { params });
}

export default api;
