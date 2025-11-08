import { mockHotels } from "../mock/mockHotels";

export interface Hotel {
  id: string;
  name: string;
  city: string;
  state: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
}

/**
 * Simulates searching for hotels in a given city.
 * You can expand this later with price range or rating filters.
 */
export const searchHotels = async (city: string): Promise<Hotel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = mockHotels.filter((hotel) =>
        hotel.city.toLowerCase().includes(city.toLowerCase())
      );
      resolve(results);
    }, 800); // simulate API delay
  });
};
