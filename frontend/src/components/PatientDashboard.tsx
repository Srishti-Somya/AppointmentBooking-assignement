import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';
import { slotsAPI, bookingsAPI } from '../services/api';
import { Slot, Booking } from '../types';
import { useAuth } from '../contexts/AuthContext';

const PatientDashboard: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const { logout } = useAuth();

  const today = new Date();
  const nextWeek = addDays(today, 7);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [slotsResponse, bookingsResponse] = await Promise.all([
        slotsAPI.getSlots(format(today, 'yyyy-MM-dd'), format(nextWeek, 'yyyy-MM-dd')),
        bookingsAPI.getMyBookings()
      ]);

      if (slotsResponse.data) {
        setSlots(slotsResponse.data.slots);
      }

      if (bookingsResponse.data) {
        setBookings(bookingsResponse.data.bookings);
      }
    } catch (error: any) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookSlot = async (slotId: string) => {
    setIsBooking(true);
    try {
      const response = await bookingsAPI.bookSlot(slotId);
      
      if (response.error) {
        toast.error(response.error.message);
        return;
      }

      if (response.data) {
        toast.success('Slot booked successfully!');
        await loadData(); // Refresh data
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  const groupSlotsByDate = (slots: Slot[]) => {
    const grouped: { [key: string]: Slot[] } = {};
    slots.forEach(slot => {
      const date = format(new Date(slot.startAt), 'yyyy-MM-dd');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });
    return grouped;
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const groupedSlots = groupSlotsByDate(slots);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Patient Dashboard
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="btn btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Slots */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Available Slots (Next 7 Days)
              </h2>
              <div className="space-y-4">
                {Object.entries(groupedSlots).map(([date, dateSlots]) => (
                  <div key={date} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-700 mb-2">
                      {format(new Date(date), 'EEEE, MMMM d')}
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {dateSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => handleBookSlot(slot.id)}
                          disabled={slot.isBooked || isBooking}
                          className={`p-2 text-sm rounded border transition-colors ${
                            slot.isBooked
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-white hover:bg-gray-50 border-gray-300'
                          }`}
                        >
                          {formatTime(slot.startAt)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* My Bookings */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                My Bookings
              </h2>
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <p className="text-gray-500">No bookings yet.</p>
                ) : (
                  bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border rounded-lg p-3 bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {format(new Date(booking.slot.startAt), 'EEEE, MMMM d')}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatTime(booking.slot.startAt)} - {formatTime(booking.slot.endAt)}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard; 