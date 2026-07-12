import React, { useState, useEffect } from 'react';

export function BookingScreen({ onNavigate, user, onAction }) {
  const [resources, setResources] = useState([]);
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [error, setError] = useState(null);

  // Modal & Booking Form State
  const [showModal, setShowModal] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endDate: new Date().toISOString().split('T')[0],
    endTime: '11:00',
    notes: ''
  });

  // Fetch bookable resources (Assets where isBookable is true)
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoadingResources(true);
        const res = await fetch('/api/v1/assets?size=100', {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error('Failed to load resources');
        
        const apiRes = await res.json();
        const content = apiRes.data.content || [];
        // Filter assets that are marked as bookable
        const bookables = content.filter(asset => asset.isBookable);
        setResources(bookables);
        
        // Select first resource by default if available
        if (bookables.length > 0) {
          setSelectedResourceId(bookables[0].id.toString());
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingResources(false);
      }
    };

    if (user?.token) {
      fetchResources();
    }
  }, [user]);

  // Fetch Bookings for Selected Resource
  const fetchBookings = async () => {
    if (!selectedResourceId) return;
    try {
      setLoadingBookings(true);
      const res = await fetch(`/api/v1/bookings?assetId=${selectedResourceId}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Failed to load bookings');
      
      const apiRes = await res.json();
      setBookings(apiRes.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (user?.token && selectedResourceId) {
      fetchBookings();
    }
  }, [user, selectedResourceId]);

  // Handle Cancel Booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking slot?')) return;
    
    try {
      const res = await fetch(`/api/v1/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const apiRes = await res.json();
      if (!res.ok) {
        throw new Error(apiRes.message || 'Cancellation failed');
      }
      
      alert('Booking cancelled successfully!');
      fetchBookings();
    } catch (err) {
      alert(`Error cancelling booking: ${err.message}`);
    }
  };

  // Handle Book Slot Form Submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      alert('Please fill out all required fields');
      return;
    }

    const startDateTime = `${formData.startDate}T${formData.startTime}:00`;
    const endDateTime = `${formData.endDate}T${formData.endTime}:00`;

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      alert('End date/time must be after start date/time');
      return;
    }

    try {
      setBookingInProgress(true);
      const payload = {
        assetId: parseInt(selectedResourceId, 10),
        title: formData.title,
        startTime: startDateTime,
        endTime: endDateTime,
        notes: formData.notes
      };

      const res = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const apiRes = await res.json();
      if (!res.ok) {
        throw new Error(apiRes.message || 'Overlapping or invalid slot');
      }

      alert('Resource booked successfully!');
      setShowModal(false);
      // Reset form
      setFormData({
        title: '',
        startDate: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        endDate: new Date().toISOString().split('T')[0],
        endTime: '11:00',
        notes: ''
      });
      fetchBookings();
    } catch (err) {
      alert(`Booking conflict: ${err.message}`);
    } finally {
      setBookingInProgress(false);
    }
  };

  const formatDateRange = (startStr, endStr) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    
    const dateOptions = { month: 'short', day: 'numeric', weekday: 'short' };
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    
    const formattedDate = start.toLocaleDateString(undefined, dateOptions);
    const startTime = start.toLocaleTimeString(undefined, timeOptions);
    const endTime = end.toLocaleTimeString(undefined, timeOptions);
    
    return `${formattedDate} • ${startTime} - ${endTime}`;
  };

  return (
    <div className="space-y-6 max-w-4xl w-full text-slate-800 pb-24">
      
      {/* Resource selector */}
      <div className="space-y-1.5 max-w-md">
        <label className="text-sm font-bold text-slate-700 block">Select Bookable Resource</label>
        {loadingResources ? (
          <div className="h-10 bg-slate-100 rounded-lg animate-pulse"></div>
        ) : resources.length > 0 ? (
          <select 
            className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2.5 px-4 text-sm text-slate-800 font-semibold outline-none cursor-pointer shadow-sm"
            value={selectedResourceId}
            onChange={(e) => setSelectedResourceId(e.target.value)}
          >
            {resources.map(res => (
              <option key={res.id} value={res.id}>{res.name} ({res.categoryName})</option>
            ))}
          </select>
        ) : (
          <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-400 italic">
            No bookable resources found in asset registry.
          </div>
        )}
      </div>

      {/* Booking schedule grid */}
      <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden mt-4">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Active Bookings Timeline</h3>
          {loadingBookings && <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>}
        </div>
        
        <div className="divide-y divide-slate-150 text-sm relative min-h-[160px] flex flex-col justify-start">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 hover:bg-slate-50/30 transition-colors gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{booking.title || 'Reserved slot'}</span>
                    {booking.status === 'ONGOING' && (
                      <span className="inline-flex px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-250 rounded-full uppercase">
                        Ongoing
                      </span>
                    )}
                    {booking.status === 'UPCOMING' && (
                      <span className="inline-flex px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-250 rounded-full uppercase">
                        Upcoming
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">
                    Booked by: <span className="text-slate-750 font-bold">{booking.bookedByName}</span>
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {formatDateRange(booking.startTime, booking.endTime)}
                  </p>
                  {booking.notes && <p className="text-xs text-slate-400 italic">Notes: {booking.notes}</p>}
                </div>

                {booking.status === 'UPCOMING' && (
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="self-start sm:self-center text-xs font-bold text-red-600 hover:text-red-800 border border-red-200 hover:bg-red-50 py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 italic">
              <span className="material-symbols-outlined text-[36px] mb-2">event_busy</span>
              <p>No active bookings scheduled for this resource.</p>
            </div>
          )}
        </div>
      </div>

      {/* Action button */}
      <div className="pt-2">
        <button 
          disabled={!selectedResourceId}
          onClick={() => setShowModal(true)}
          className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Book a slot
        </button>
      </div>

      {/* Booking Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[18px] border border-slate-200 shadow-2xl p-6 flex flex-col text-slate-800">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-5">
              <h3 className="text-lg font-bold text-slate-900">Book Resource Slot</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer material-symbols-outlined"
              >
                close
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Booking Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekly Sync / Training"
                  className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-900 placeholder-slate-400 outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Start Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Start Date *</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-900 outline-none"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value, endDate: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Start Time *</label>
                  <input
                    type="time"
                    required
                    className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-900 outline-none"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
              </div>

              {/* End Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">End Date *</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-900 outline-none"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">End Time *</label>
                  <input
                    type="time"
                    required
                    className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-900 outline-none"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Notes</label>
                <textarea
                  placeholder="Any additional details..."
                  rows="2"
                  className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-lg py-2 px-3 text-sm text-slate-900 placeholder-slate-400 outline-none resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4.5 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-650 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingInProgress}
                  className="px-4.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-wait cursor-pointer"
                >
                  {bookingInProgress ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}