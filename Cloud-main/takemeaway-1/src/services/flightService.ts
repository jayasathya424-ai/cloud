import axios from "axios";

const API_KEY = import.meta.env.VITE_AVIATIONSTACK_API_KEY;
const BASE_URL = "http://api.aviationstack.com/v1/flights";

export const getFlights = async (from: string, to: string, date: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        access_key: API_KEY,
        dep_iata: from,
        arr_iata: to,
        flight_status: "scheduled",
        limit: 5,
      },
    });

    const flights = response.data.data.map((f: any) => ({
      airline: f.airline.name,
      flight: f.flight.iata,
      departure: f.departure.scheduled,
      arrival: f.arrival.scheduled,
      from: f.departure.airport,
      to: f.arrival.airport,
    }));

    return flights;
  } catch (err) {
    console.error("Flight API error:", err);
    return [];
  }
};
