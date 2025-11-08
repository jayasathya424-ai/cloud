// src/services/travelpayouts.ts
const API_URL = "https://api.travelpayouts.com/aviasales/v3";

export async function searchFlights(origin: string, destination: string) {
  const token = import.meta.env.VITE_TRAVELPAYOUTS_API_TOKEN;

  const url = `${API_URL}/prices_for_dates?origin=${origin}&destination=${destination}&depart_date=2025-10-01&return_date=2025-10-15&currency=usd&token=${token}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch flights");
  return res.json();
}
