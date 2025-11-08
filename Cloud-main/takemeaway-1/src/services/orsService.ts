import axios from "axios";

const ORS_BASE_URL = "https://api.openrouteservice.org";
const API_KEY = import.meta.env.VITE_ORS_API_KEY;

// 🔹 Route between two points
export async function getRoute(start: [number, number], end: [number, number]) {
  try {
    const response = await axios.post(
      `${ORS_BASE_URL}/v2/directions/driving-car`,
      {
        coordinates: [start, end],
      },
      {
        headers: {
          Authorization: API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("ORS route error:", error);
    throw new Error("Failed to fetch route");
  }
}

// 🔹 Nearby attractions (POI search)
export async function getNearbyAttractions(
  location: [number, number],
  radius: number = 2000
) {
  try {
    const response = await axios.post(
      `${ORS_BASE_URL}/pois`,
      {
        request: "pois",
        geometry: {
          geojson: {
            type: "Point",
            coordinates: location,
          },
          buffer: radius,
        },
        filters: {
          category_ids: [581, 580], // 581=Tourism, 580=Cultural attractions
        },
      },
      {
        headers: {
          Authorization: API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.features;
  } catch (error) {
    console.error("ORS POI error:", error);
    throw new Error("Failed to fetch attractions");
  }
}
