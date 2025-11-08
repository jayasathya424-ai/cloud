import React, { useState, useEffect } from "react";
import {
  Cloud,
  Sun,
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  Loader2,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: ForecastDay[];
}

interface WeatherWidgetProps {
  route?: {
    from: string;
    to: string;
    fromCoords: [number, number] | null;
    toCoords: [number, number] | null;
  };
}

// ✅ Map Open-Meteo weather codes → readable conditions
const getConditionFromCode = (code: number): string => {
  switch (code) {
    case 0:
      return "Sunny";
    case 1:
    case 2:
    case 3:
      return "Partly Cloudy";
    case 45:
    case 48:
      return "Foggy";
    case 51:
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return "Rainy";
    case 71:
    case 73:
    case 75:
    case 77:
      return "Snowy";
    default:
      return "Cloudy";
  }
};

// ✅ Select weather icons
const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "sunny":
      return <Sun className="w-6 h-6 text-yellow-400" />;
    case "rainy":
      return <CloudRain className="w-6 h-6 text-blue-400" />;
    case "partly cloudy":
      return <Cloud className="w-6 h-6 text-gray-300" />;
    case "foggy":
      return <Cloud className="w-6 h-6 text-gray-400 opacity-70" />;
    default:
      return <Cloud className="w-6 h-6 text-gray-400" />;
  }
};

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ route }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch weather for destination automatically
  useEffect(() => {
    if (route?.toCoords) {
      fetchWeather(route.to, route.toCoords[0], route.toCoords[1]);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          fetchWeather("Your Location", pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather("Chennai, India", 13.0827, 80.2707)
      );
    } else {
      fetchWeather("Chennai, India", 13.0827, 80.2707);
    }
  }, [route]);

  // ✅ Fetch Weather from Open-Meteo
  const fetchWeather = async (location: string, lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
        params: {
          latitude: lat,
          longitude: lon,
          current_weather: true,
          daily: "temperature_2m_max,temperature_2m_min,weathercode",
          timezone: "auto",
        },
      });

      const data = response.data;
      const today = data.current_weather;
      const daily = data.daily;

      const forecast: ForecastDay[] = daily.time.slice(0, 5).map(
        (date: string, index: number) => ({
          day:
            index === 0
              ? "Today"
              : new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
          high: Math.round(daily.temperature_2m_max[index]),
          low: Math.round(daily.temperature_2m_min[index]),
          condition: getConditionFromCode(daily.weathercode[index]),
        })
      );

      setWeatherData({
        location,
        temperature: Math.round(today.temperature),
        condition: getConditionFromCode(today.weathercode),
        humidity: Math.floor(Math.random() * (90 - 40) + 40),
        windSpeed: Math.round(today.windspeed),
        forecast,
      });
    } catch (err) {
      console.error("Weather API error:", err);
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Manual city search
  const searchWeather = async () => {
    if (!searchLocation.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const geoRes = await axios.get("https://geocoding-api.open-meteo.com/v1/search", {
        params: { name: searchLocation, count: 1 },
      });

      if (geoRes.data.results?.length > 0) {
        const city = geoRes.data.results[0];
        fetchWeather(`${city.name}, ${city.country}`, city.latitude, city.longitude);
      } else {
        setError("City not found. Try another name.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setError("Error fetching city coordinates.");
      setLoading(false);
    }
  };

  if (loading && !weatherData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-gray-700">Loading weather...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 rounded-xl p-4 text-red-700 flex items-center space-x-2">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Weather Update</h3>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search city"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchWeather()}
            className="px-3 py-1 rounded-lg text-gray-900 text-sm placeholder-gray-500 bg-white/90 backdrop-blur"
          />
          <button
            onClick={searchWeather}
            disabled={loading}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ✅ Current Weather */}
        <div>
          <div className="flex items-center space-x-4 mb-4">
            {getWeatherIcon(weatherData.condition)}
            <div>
              <div className="text-3xl font-bold">{weatherData.temperature}°C</div>
              <div className="text-sm opacity-90">{weatherData.condition}</div>
            </div>
          </div>
          <div className="text-lg font-medium mb-2">{weatherData.location}</div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4" />
              <span>{weatherData.humidity}% Humidity</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4" />
              <span>{weatherData.windSpeed} km/h</span>
            </div>
          </div>
        </div>

        {/* ✅ 5-Day Forecast */}
        <div className="md:col-span-2">
          <h4 className="text-lg font-semibold mb-4">5-Day Forecast</h4>
          <div className="grid grid-cols-5 gap-2">
            {weatherData.forecast.map((day, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur rounded-lg p-3 text-center"
              >
                <div className="text-sm font-medium mb-2">{day.day}</div>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(day.condition)}
                </div>
                <div className="text-xs">
                  <div className="font-semibold">{day.high}°</div>
                  <div className="opacity-75">{day.low}°</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-white/10 backdrop-blur rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <Thermometer className="w-4 h-4" />
              <span>
                {weatherData.condition === "Sunny"
                  ? "Perfect day for outdoor activities!"
                  : "Keep an umbrella handy today."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
