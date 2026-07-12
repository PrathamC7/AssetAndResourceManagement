import React, { useState, useEffect } from 'react';

export function ActivityLogsScreen({ onNavigate, user, onAction }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const token = user?.token;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/notifications', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const apiRes = await res.json();
        setNotifications(apiRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  const handleMarkRead = async (id) => {
    try {
      await fetch(`/api/v1/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  // Simple filter logic based on notification type/message
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    const msg = (n.message || n.title || '').toLowerCase();
    if (filter === 'alerts') return msg.includes('overdue') || msg.includes('flagged') || msg.includes('alert');
    if (filter === 'approvals') return msg.includes('approv') || msg.includes('transfer') || msg.includes('reject');
    if (filter === 'bookings') return msg.includes('book') || msg.includes('slot') || msg.includes('room');
    return true;
  });

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl w-full text-slate-800">
      
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2.5 pb-2 border-b border-slate-200">
        {['all', 'alerts', 'approvals', 'bookings'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-1.5 text-xs font-semibold rounded-lg shadow-sm cursor-pointer ${filter === f ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden mt-4">
        <div className="divide-y divide-slate-150">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                className={`flex justify-between items-center px-6 py-4 hover:bg-slate-50/50 transition-colors text-sm font-semibold cursor-pointer ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {/* Small indicator pill */}
                  <span className={`w-2.5 h-2.5 rounded ${notif.isRead ? 'bg-slate-200 border border-slate-300' : 'bg-blue-600/30 border border-blue-500'}`}></span>
                  <span className="text-slate-800">{notif.message || notif.title || 'Notification'}</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">{formatTime(notif.createdAt)}</span>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-slate-400 italic text-sm">
              No notifications to display.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
