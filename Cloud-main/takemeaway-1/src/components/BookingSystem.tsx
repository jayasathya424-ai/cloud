import React, { useState } from "react";
import {
  Plane,
  Train,
  Bus,
  Hotel,
  CreditCard,
  Check,
  Loader2,
} from "lucide-react";
import { searchFlights } from "../api/aviationstack";
import { searchBuses, Bus as BusType } from "../api/bus";
import { searchTrains, Train as TrainType } from "../api/train";
import { searchHotels, Hotel as HotelType } from "../api/hotel";

interface BookingOption {
  id: string;
  type: "flight" | "train" | "bus" | "hotel";
  provider: string;
  title: string;
  price: number;
  duration?: string;
  departure?: string;
  arrival?: string;
  rating?: number;
  amenities?: string[];
  carbonFootprint: number;
  image: string;
}

const BookingSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "flights" | "trains" | "buses" | "hotels"
  >("flights");

  const [selectedOption, setSelectedOption] = useState<BookingOption | null>(
    null
  );

  const [searchParams, setSearchParams] = useState({
    from: "Chennai",
    to: "Bangalore",
    departDate: "2025-10-20",
    returnDate: "2025-10-25",
    passengers: 1,
    rooms: 1,
  });

  const [flightResults, setFlightResults] = useState<BookingOption[]>([]);
  const [busResults, setBusResults] = useState<BookingOption[]>([]);
  const [trainResults, setTrainResults] = useState<BookingOption[]>([]);
  const [hotelResults, setHotelResults] = useState<BookingOption[]>([]);
  const [loading, setLoading] = useState(false);

  const tabs = {
    flights: { label: "Flights", icon: Plane },
    trains: { label: "Trains", icon: Train },
    buses: { label: "Buses", icon: Bus },
    hotels: { label: "Hotels", icon: Hotel },
  };

  // 🌱 Carbon footprint label logic
  const getEcoLabel = (carbonFootprint: number, type: string) => {
    const thresholds = {
      flight: { good: 0.15, ok: 0.2 },
      train: { good: 0.02, ok: 0.05 },
      bus: { good: 0.03, ok: 0.06 },
      hotel: { good: 0.1, ok: 0.15 },
    };
    const threshold = thresholds[type as keyof typeof thresholds];
    if (carbonFootprint <= threshold.good)
      return { label: "Eco-Friendly", color: "bg-green-100 text-green-800" };
    if (carbonFootprint <= threshold.ok)
      return { label: "Good Choice", color: "bg-yellow-100 text-yellow-800" };
    return { label: "High Impact", color: "bg-red-100 text-red-800" };
  };

  // 💳 Booking confirmation
  const handleBooking = (option: BookingOption) => {
    setSelectedOption(option);
    alert(`Booking confirmed for ${option.title} - ₹${option.price}`);
  };

  // ✈️ Flights
  const handleSearchFlights = async () => {
    try {
      setLoading(true);
      setFlightResults([]);
      const res = await searchFlights(searchParams.from, searchParams.to);
      if (res?.data) {
        const flights: BookingOption[] = res.data.map((f: any, idx: number) => ({
          id: f.flight?.iata || `f${idx}`,
          type: "flight",
          provider: f.airline?.name || "Unknown Airline",
          title: `${f.departure?.airport} → ${f.arrival?.airport}`,
          price: Math.floor(Math.random() * 300) + 80,
          duration: f.flight_time || "N/A",
          departure: f.departure?.scheduled?.slice(11, 16) || "N/A",
          arrival: f.arrival?.scheduled?.slice(11, 16) || "N/A",
          carbonFootprint: 0.08,
          image:
            "https://images.pexels.com/photos/358220/pexels-photo-358220.jpeg",
        }));
        setFlightResults(flights);
      }
    } catch (err) {
      console.error("Flight search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🚌 Buses
  const handleSearchBuses = async () => {
    try {
      setLoading(true);
      setBusResults([]);
      const res: BusType[] = await searchBuses(searchParams.from, searchParams.to);
      if (res?.length > 0) {
        const buses: BookingOption[] = res.map((b, idx) => ({
          id: `bus${b.id}`,
          type: "bus",
          provider: b.name,
          title: `${b.from} → ${b.to}`,
          price: b.price,
          duration: `${b.departureTime} → ${b.arrivalTime}`,
          carbonFootprint: 0.03,
          image:
            idx % 2 === 0
              ? "https://upload.wikimedia.org/wikipedia/commons/7/7a/Parveen_Travels_bus.jpg"
              : "https://upload.wikimedia.org/wikipedia/commons/4/41/Sleeper_bus_in_India.jpg",
        }));
        setBusResults(buses);
      }
    } catch (err) {
      console.error("Bus search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🚆 Trains
  const handleSearchTrains = async () => {
    try {
      setLoading(true);
      setTrainResults([]);
      const res: TrainType[] = await searchTrains(searchParams.from, searchParams.to);
      if (res?.length > 0) {
        const trains: BookingOption[] = res.map((t, idx) => ({
          id: `train${idx}`,
          type: "train",
          provider: "Indian Railways",
          title: `${t.from} → ${t.to} (${t.name})`,
          price: t.price,
          duration: t.duration,
          departure: t.departureTime,
          arrival: t.arrivalTime,
          carbonFootprint: t.carbonFootprint,
          image:
            "https://upload.wikimedia.org/wikipedia/commons/5/52/Indian_railways_train.jpg",
        }));
        setTrainResults(trains);
      }
    } catch (err) {
      console.error("Train search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🏨 Hotels
  const handleSearchHotels = async () => {
    try {
      setLoading(true);
      setHotelResults([]);
      const res: HotelType[] = await searchHotels(searchParams.to);
      if (res?.length > 0) {
        const hotels: BookingOption[] = res.map((h, idx) => ({
          id: h.id,
          type: "hotel",
          provider: h.name,
          title: `${h.name}, ${h.city}`,
          price: h.pricePerNight,
          rating: h.rating,
          amenities: h.amenities,
          carbonFootprint: 0.05,
          image:
            idx % 2 === 0
              ? "https://cdn.prod.website-files.com/6502a82cff431778b5d82829/65151a8dd01240758a9a1c45_Oyo_(1).webp"
              : "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/25/7c/5f/exterior.jpg",
        }));
        setHotelResults(hotels);
      }
    } catch (err) {
      console.error("Hotel search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔎 Main search handler
  const handleSearch = () => {
    if (activeTab === "flights") handleSearchFlights();
    if (activeTab === "buses") handleSearchBuses();
    if (activeTab === "trains") handleSearchTrains();
    if (activeTab === "hotels") handleSearchHotels();
  };

  // 🎯 Choose correct results list
  const getResults = () => {
    switch (activeTab) {
      case "flights":
        return flightResults;
      case "buses":
        return busResults;
      case "trains":
        return trainResults;
      case "hotels":
        return hotelResults;
      default:
        return [];
    }
  };

  const results = getResults();

  return (
    <div className="space-y-6">
      {/* 🔍 Search Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Book Your Journey
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              type="text"
              value={searchParams.from}
              onChange={(e) =>
                setSearchParams({ ...searchParams, from: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              type="text"
              value={searchParams.to}
              onChange={(e) =>
                setSearchParams({ ...searchParams, to: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Depart */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Depart
            </label>
            <input
              type="date"
              value={searchParams.departDate}
              onChange={(e) =>
                setSearchParams({ ...searchParams, departDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Return */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return
            </label>
            <input
              type="date"
              value={searchParams.returnDate}
              onChange={(e) =>
                setSearchParams({ ...searchParams, returnDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Passengers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passengers
            </label>
            <select
              value={searchParams.passengers}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  passengers: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Passenger" : "Passengers"}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Searching...
                </>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 🚉 Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="flex border-b border-gray-200">
          {Object.entries(tabs).map(([key, tab]) => {
            const Icon = tab.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === key
                    ? "border-teal-500 text-teal-600 bg-teal-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results */}
        <div className="p-6">
          {results.length > 0 ? (
            results.map((option) => {
              const ecoLabel = getEcoLabel(option.carbonFootprint, option.type);
              return (
                <div
                  key={option.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow mb-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4 flex-1">
                      <img
                        src={option.image}
                        alt={option.provider}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {option.title}
                        </h4>
                        <div className="text-sm text-gray-600 mb-2">
                          {option.provider}
                          {option.duration && ` · ${option.duration}`}
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${ecoLabel.color}`}
                        >
                          🌱 {ecoLabel.label}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ₹{option.price}
                      </div>
                      <button
                        onClick={() => handleBooking(option)}
                        className="mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Book Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            !loading && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg">No {activeTab} found</p>
                <p>Try adjusting your search criteria</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* ✅ Booking Confirmation */}
      {selectedOption && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Check className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Booking Confirmed
            </h3>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              Successfully booked: <strong>{selectedOption.title}</strong> for{" "}
              <strong>₹{selectedOption.price}</strong>
            </p>
            <p className="text-green-600 text-sm mt-1">
              Confirmation details have been sent to your email.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSystem;
