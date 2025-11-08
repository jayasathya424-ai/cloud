import { mockTrains } from "../mock/mockTrains";

export interface Train {
  id: string;
  name: string;
  from: string;
  to: string;
  price: number;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  trainType: string;
  carbonFootprint: number;
  image: string;
}

/**
 * Simulates searching for trains between two cities.
 * Filters results from mockTrains based on partial or full match.
 */
export const searchTrains = async (
  from: string,
  to: string
): Promise<Train[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = mockTrains.filter(
        (train) =>
          train.from.toLowerCase().includes(from.toLowerCase()) &&
          train.to.toLowerCase().includes(to.toLowerCase())
      );
      resolve(results);
    }, 800); // simulate network delay
  });
};
