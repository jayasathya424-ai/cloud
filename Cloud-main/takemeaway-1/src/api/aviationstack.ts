// src/api/aviationstack.ts

// Simple mapping of common cities to IATA codes
const cityToIata: Record<string, string> = {
  chennai: "MAA",
  bangalore: "BLR",
  mumbai: "BOM",
  delhi: "DEL",
  hyderabad: "HYD",
  kolkata: "CCU",
  singapore: "SIN",
  dubai: "DXB",
  london: "LHR",
  newyork: "JFK",
  paris: "CDG",
  tokyo: "HND",
};

// Helper function: convert city name to IATA
export function getIataCode(city: string): string | null {
  if (!city) return null;
  const key = city.trim().toLowerCase();
  return cityToIata[key] || null;
}

// Flight search by IATA code
export async function searchFlights(
  departure: string,
  arrival: string
) {
  const apiKey = import.meta.env.VITE_AVIATIONSTACK_API_KEY;

  const depCode = getIataCode(departure) || departure;
  const arrCode = getIataCode(arrival) || arrival;

  const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&dep_iata=${depCode}&arr_iata=${arrCode}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching flight data:", error);
    return null;
  }
}
