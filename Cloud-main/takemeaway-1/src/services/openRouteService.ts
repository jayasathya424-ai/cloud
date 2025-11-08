import axios from "axios";

const ORS_BASE_URL = "https://api.openrouteservice.org/v2/directions/driving-car";
const ORS_API_KEY = import.meta.env.VITE_OPENROUTE_API_KEY;

if (!ORS_API_KEY) {
  console.error("⚠️ Missing ORS API key! Set VITE_OPENROUTE_API_KEY in .env");
}

export const getRouteData = async (start: [number, number], end: [number, number]) => {
  try {
    const response = await axios.post(
      ORS_BASE_URL,
      {
        coordinates: [start, end],
      },
      {
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    const route = data.features[0].properties.summary;

    return {
      distance: (route.distance / 1000).toFixed(2) + " km",
      duration: (route.duration / 60).toFixed(2) + " mins",
      geometry: data.features[0].geometry.coordinates,
    };
  } catch (error) {
    console.error("OpenRouteService Error:", error);
    throw error;
  }
};
