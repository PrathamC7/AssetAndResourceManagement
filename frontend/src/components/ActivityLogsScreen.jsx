import { useState, useEffect } from 'react';
import { getNotifications, markNotificationRead } from '../services/api';

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Laptop AF-0014 assigned to Priya shah', time: '2m ago', message: 'Laptop AF-0014 assigned to Priya shah', isRead: false },
  { id: 2, text: 'Maintenance request AF-0055 approved', time: '18m ago', message: 'Maintenance request AF-0055 approved', isRead: false },
  { id: 3, text: 'Booking confirmed : Room B2 : 2:00 to 3:00 PM', time: '1h ago', message: 'Booking confirmed : Room B2 : 2:00 to 3:00 PM', isRead: true },
  { id: 4, text: 'Transfer approved : AF-0033 to facilities dept', time: '3h ago', message: 'Transfer approved : AF-0033 to facilities dept', isRead: true },
  { id: 5, text: 'Overdue return : AF-0021 was due 3 days ago', time: '1d ago', message: 'Overdue return : AF-0021 was due 3 days ago', isRead: true },
  { id: 6, text: 'audit discrepancy flagged : AF-0088 damaged', time: '2d ago', message: 'audit discrepancy flagged : AF-0088 damaged', isRead: true }
];

export function ActivityLogsScreen({ onNavigate, user, onAction, notifications: parentNotifications, setNotifications: setParentNotifications }) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getNotifications();
        if (res.data?.data && res.data.data.length > 0) {
          setNotifications(res.data.data);
        }
      } catch (err) {
        // Keep mock data on error
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchData();
    }
  }, [user]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      // Also update parent notifications if available
      if (setParentNotifications) {
        setParentNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      // silently fail
    }
  };

  const getTimeAgo = (dateStr) => {
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

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    // For type-based filters, we check message content as a simple heuristic
    const msg = (n.message || n.text || '').toLowerCase();
    if (filter === 'alerts') return msg.includes('overdue') || msg.includes('flagged') || msg.includes('discrepancy');
    if (filter === 'approvals') return msg.includes('approved') || msg.includes('transfer');
    if (filter === 'bookings') return msg.includes('booking') || msg.includes('booked');
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl w-full text-slate-800">
      
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2.5 pb-2 border-b border-slate-200">
        {['all', 'unread', 'alerts', 'approvals', 'bookings'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-1.5 text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-colors ${filter === tab ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-[12px] shadow-sm">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm mt-3">Loading notifications...</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden mt-4">
          <div className="divide-y divide-slate-150">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`flex justify-between items-center px-6 py-4 hover:bg-slate-50/50 transition-colors text-sm font-semibold ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                  onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3">
                    {/* Indicator pill */}
                    <span className={`w-2.5 h-2.5 rounded ${notif.isRead ? 'bg-slate-200 border border-slate-300' : 'bg-blue-600/30 border border-blue-500'}`}></span>
                    <span className="text-slate-800">{notif.message || notif.text}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-4">
                    {notif.time || getTimeAgo(notif.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-slate-400 italic">
                No notifications matching this filter.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
