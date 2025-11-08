import axios from "axios";

const API_URL = "https://api.stayapi.com/v1/hotels/search";
const API_KEY = import.meta.env.VITE_STAYAPI_KEY;

export const getHotels = async (city: string, checkIn?: string, checkOut?: string) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        location: city,
        check_in: checkIn || "2025-11-05",
        check_out: checkOut || "2025-11-06",
        currency: "INR",
        limit: 10,
      },
      headers: {
        "x-api-key": API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("StayAPI Hotel Fetch Error:", error);
    return [];
  }
};
