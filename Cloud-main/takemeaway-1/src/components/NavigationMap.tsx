import React, { useEffect, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Crosshair } from "lucide-react";

interface RouteData {
  from: string;
  to: string;
  fromCoords: [number, number] | null;
  toCoords: [number, number] | null;
  path?: any;
}

interface NavigationMapProps {
  route?: RouteData;
}

const NavigationMap: React.FC<NavigationMapProps> = ({ route }) => {
  const [from, setFrom] = useState(route?.from || "");
  const [to, setTo] = useState(route?.to || "");
  const [travelMode, setTravelMode] = useState("driving-car");
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  // ✅ Initialize map once
  useEffect(() => {
    const map = L.map("map").setView([20.5937, 78.9629], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
    setMapInstance(map);
    return () => map.remove();
  }, []);

  // ✅ Geocode function
  const geocode = async (place: string) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
    );
    const data = await res.json();
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [number, number];
    }
    return null;
  };

  // ✅ Detect current location
  const handleDetectLocation = async () => {
    if (!navigator.geolocation) return alert("Geolocation not supported by your browser.");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const address = data.display_name || `${latitude}, ${longitude}`;
          setFrom(address);

          if (mapInstance) {
            L.marker([latitude, longitude])
              .addTo(mapInstance)
              .bindPopup("📍 Current Location")
              .openPopup();
            mapInstance.setView([latitude, longitude], 10);
          }
        } catch {
          alert("Could not detect address from GPS.");
        }
      },
      () => alert("Unable to get your current location.")
    );
  };

  // ✅ Draw route
  const drawRoute = useCallback(
    async (fromPlace: string, toPlace: string, map: L.Map) => {
      const fromCoords = await geocode(fromPlace);
      const toCoords = await geocode(toPlace);

      if (!fromCoords || !toCoords) {
        alert("Could not find one or both locations.");
        return;
      }

      // Clear old layers
      map.eachLayer((layer) => {
        if (!(layer as any)._url) map.removeLayer(layer);
      });

      // Add markers
      L.marker(fromCoords).addTo(map).bindPopup(`From: ${fromPlace}`).openPopup();
      L.marker(toCoords).addTo(map).bindPopup(`To: ${toPlace}`);
      map.fitBounds(L.latLngBounds([fromCoords, toCoords]), { padding: [50, 50] });

      const apiKey = import.meta.env.VITE_OPENROUTE_API_KEY;
      const supportedModes = ["driving-car", "driving-hgv", "cycling-regular", "foot-walking"];

      // ✈️ Simulated transport details
      const simulated = {
        bus: { speed: 60, farePerKm: 1.5, color: "orange" },
        train: { speed: 120, farePerKm: 0.8, color: "purple" },
        flight: { speed: 800, farePerKm: 6.0, color: "red" },
      } as const;

      // ✅ For real ORS modes
      if (supportedModes.includes(travelMode)) {
        try {
          const res = await fetch(
            `https://api.openrouteservice.org/v2/directions/${travelMode}?api_key=${apiKey}&start=${fromCoords[1]},${fromCoords[0]}&end=${toCoords[1]},${toCoords[0]}`
          );
          const json = await res.json();

          if (json.features?.length > 0) {
            const coords = json.features[0].geometry.coordinates.map(
              (c: number[]) => [c[1], c[0]]
            );
            L.polyline(coords, { color: "blue", weight: 5 }).addTo(map);

            const summary = json.features[0].properties.summary;
            const distance = (summary.distance / 1000).toFixed(2);
            const duration = (summary.duration / 60).toFixed(1);

            L.popup()
              .setLatLng(toCoords)
              .setContent(
                `🚗 Mode: ${travelMode}<br/>📏 Distance: ${distance} km<br/>⏱️ Time: ${duration} mins`
              )
              .openOn(map);
          } else {
            alert("No route found.");
          }
        } catch (err) {
          console.error(err);
          alert("Failed to fetch ORS route.");
        }
      } else {
        // 🚌 Simulate transit
        const modeData = simulated[travelMode as keyof typeof simulated];
        if (!modeData) return;

        const R = 6371; // km
        const dLat = ((toCoords[0] - fromCoords[0]) * Math.PI) / 180;
        const dLon = ((toCoords[1] - fromCoords[1]) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((fromCoords[0] * Math.PI) / 180) *
            Math.cos((toCoords[0] * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        const duration = (distance / modeData.speed) * 60;
        const fare = distance * modeData.farePerKm;

        // Draw line
        L.polyline([fromCoords, toCoords], {
          color: modeData.color,
          dashArray: "8 8",
          weight: 4,
        }).addTo(map);

        L.popup()
          .setLatLng(toCoords)
          .setContent(
            `🧭 Mode: ${travelMode.toUpperCase()}<br/>
             📏 Distance: ${distance.toFixed(1)} km<br/>
             ⏱️ Est. Time: ${duration.toFixed(1)} mins<br/>
             💰 Est. Fare: ₹${fare.toFixed(0)}`
          )
          .openOn(map);
      }
    },
    [travelMode]
  );

  const handleSearch = useCallback(() => {
    if (!from.trim() || !to.trim() || !mapInstance) {
      alert("Please enter both 'From' and 'To' locations.");
      return;
    }
    drawRoute(from, to, mapInstance);
  }, [from, to, mapInstance, drawRoute]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        <input
          type="text"
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm w-48"
        />
        <button
          onClick={handleDetectLocation}
          title="Use current location"
          className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          <Crosshair className="w-4 h-4 text-blue-600" />
        </button>

        <span className="text-gray-600">→</span>

        <input
          type="text"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm w-48"
        />

        <select
          value={travelMode}
          onChange={(e) => setTravelMode(e.target.value)}
          className="px-2 py-2 border rounded-md text-sm"
        >
          <option value="driving-car">🚗 Car</option>
          <option value="cycling-regular">🚴 Cycling</option>
          <option value="foot-walking">🚶 Walking</option>
          <option value="driving-hgv">🚚 Heavy Vehicle</option>
          <option value="bus">🚌 Bus</option>
          <option value="train">🚆 Train</option>
          <option value="flight">✈️ Flight</option>
        </select>

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-1"
        >
          <MapPin className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>

      <div id="map" className="w-full h-[500px] rounded-lg shadow-lg border"></div>
    </div>
  );
};

export default NavigationMap;
