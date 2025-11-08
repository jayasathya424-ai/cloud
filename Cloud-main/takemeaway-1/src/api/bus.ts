import { mockBuses } from "../mock/mockBuses";

export interface Bus {
  id: string;
  name: string; // ✅ Use 'name' instead of 'busName'
  from: string;
  to: string;
  price: number;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  busType: string;
  carbonFootprint: number;
}

/**
 * 🚌 Simulates bus search between two cities using mock data.
 * Filters the list for matching routes.
 */
export const searchBuses = async (from: string, to: string): Promise<Bus[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = mockBuses.filter(
        (bus) =>
          bus.from.toLowerCase().includes(from.toLowerCase()) &&
          bus.to.toLowerCase().includes(to.toLowerCase())
      );
      resolve(results);
    }, 800); // simulate API delay
  });
};
