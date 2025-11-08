import axios from "axios";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

export async function getWeather(lat: number, lon: number): Promise<WeatherData[]> {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: "temperature_2m,windspeed_10m,weathercode",
        forecast_days: 1,
        timezone: "auto"
      }
    });

    const data = response.data;

    return data.hourly.time.map((time: string, index: number) => ({
      time,
      temperature: data.hourly.temperature_2m[index],
      windspeed: data.hourly.windspeed_10m[index],
      weathercode: data.hourly.weathercode[index]
    }));
  } catch (error) {
    console.error("Weather API error:", error);
    throw new Error("Failed to fetch weather data");
  }
}
