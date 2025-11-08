// src/services/openTripPlannerService.ts
import axios from "axios";

const OTP_BASE_URL = "https://api.digitransit.fi/routing/v1/routers/hsl/plan";

/**
 * Fetch transit (bus/train/metro) routes between two coordinates
 */
export async function fetchTransitRoute(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
) {
  try {
    const response = await axios.get(OTP_BASE_URL, {
      params: {
        fromPlace: `${fromLat},${fromLon}`,
        toPlace: `${toLat},${toLon}`,
        mode: "TRANSIT,WALK",
        numItineraries: 3,
      },
    });

    return response.data?.plan?.itineraries ?? [];
  } catch (err) {
    console.error("❌ OTP API Error:", err);
    throw new Error("Failed to fetch transit route.");
  }
}
