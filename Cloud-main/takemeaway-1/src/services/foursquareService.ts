import axios from "axios";

const FOURSQUARE_API_URL = "https://api.foursquare.com/v3/places/search";
const API_KEY = process.env.REACT_APP_FOURSQUARE_API_KEY; // store key in .env

export const getNearbyPlaces = async (lat: number, lon: number, query: string) => {
  try {
    const response = await axios.get(FOURSQUARE_API_URL, {
      headers: {
        Authorization: API_KEY || "",
      },
      params: {
        ll: `${lat},${lon}`, // latitude,longitude
        query,              // e.g., "restaurant", "museum"
        limit: 10,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Foursquare API Error:", error);
    return [];
  }
};
