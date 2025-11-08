import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, MapPin, Calendar, DollarSign, Plane } from 'lucide-react';

interface Trip {
  id: string;
  title: string;
  description: string;
  destination: string;
  origin: string;
  start_date: string;
  end_date: string;
  budget: number;
  status: string;
}

interface Booking {
  id: string;
  type: string;
  title: string;
  price: number;
  provider: string;
  booking_date: string;
}

export function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) return;
    loadTrip();
  }, [tripId]);

  const loadTrip = async () => {
    try {
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .maybeSingle();

      if (tripError) throw tripError;
      setTrip(tripData);

      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('trip_id', tripId)
        .order('booking_date', { ascending: false });

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);
    } catch (err) {
      console.error('Error loading trip:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Trip not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const totalSpent = bookings.reduce((sum, booking) => sum + booking.price, 0);
  const remaining = trip.budget - totalSpent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{trip.title}</h1>
          <p className="text-gray-600 mb-6">{trip.description}</p>

          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-semibold">Destination</span>
              </div>
              <p className="text-gray-900 font-bold">{trip.destination}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-semibold">Duration</span>
              </div>
              <p className="text-gray-900 font-bold">
                {new Date(trip.start_date).toLocaleDateString()} -{' '}
                {new Date(trip.end_date).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm font-semibold">Budget</span>
              </div>
              <p className="text-gray-900 font-bold">${trip.budget}</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm font-semibold">Remaining</span>
              </div>
              <p className={`font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${remaining.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-full rounded-full transition-all ${
                remaining >= 0 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min((totalSpent / trip.budget) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {((totalSpent / trip.budget) * 100).toFixed(0)}% of budget spent
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Plane className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
          </div>

          {bookings.length === 0 ? (
            <p className="text-gray-600 py-8 text-center">No bookings yet. Start booking your transport and accommodation!</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{booking.title}</h3>
                      <p className="text-sm text-gray-600 capitalize">Type: {booking.type}</p>
                      {booking.provider && (
                        <p className="text-sm text-gray-600">Provider: {booking.provider}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-blue-600">${booking.price}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
