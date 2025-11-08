import React, { useState } from "react";
import {
  Plane,
  MapPin,
  Calendar,
  DollarSign,
  Cloud,
  Route,
} from "lucide-react";

import Header from "./components/Header";
import TripPlanner from "./components/TripPlanner";
import BudgetTracker from "./components/BudgetTracker";
import WeatherWidget from "./components/WeatherWidget";
import PlaceRecommendations from "./components/PlaceRecommendations";
import AIAssistant from "./components/AIAssistant";
import BookingSystem from "./components/BookingSystem";
import ProtectedRoute from "./components/ProtectedRoute";
import NavigationMap from "./components/NavigationMap";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("planner");
  const [currentTrip, setCurrentTrip] = useState<any>({
    places: []
  });
  const [budget, setBudget] = useState({
    total: 0,
    spent: 0,
    categories: {},
  });

  const [route, setRoute] = useState<{
    from: string;
    to: string;
    fromCoords: [number, number] | null;
    toCoords: [number, number] | null;
    path?: any;
  }>({
    from: "",
    to: "",
    fromCoords: null,
    toCoords: null,
    path: null,
  });

  const tabs = [
    { id: "planner", label: "Trip Planner", icon: Calendar },
    { id: "budget", label: "Budget Tracker", icon: DollarSign },
    { id: "recommendations", label: "Discover", icon: MapPin },
    { id: "navigation", label: "Navigation", icon: Route },
    { id: "booking", label: "Booking", icon: Plane },
    { id: "weather", label: "Weather", icon: Cloud },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "planner":
        return (
          <ProtectedRoute>
            <TripPlanner
              currentTrip={currentTrip}
              setCurrentTrip={setCurrentTrip}
              setRoute={setRoute}
            />
          </ProtectedRoute>
        );

      case "budget":
        return (
          <ProtectedRoute>
            <BudgetTracker budget={budget} setBudget={setBudget} />
          </ProtectedRoute>
        );

      case "recommendations":
        return (
          <ProtectedRoute>
            <PlaceRecommendations
              currentTrip={currentTrip}
              setCurrentTrip={setCurrentTrip}
              setRoute={setRoute}
            />
          </ProtectedRoute>
        );

      case "navigation":
        return (
          <ProtectedRoute>
            <NavigationMap
              route={route}
              setRoute={setRoute}
              apiKey={import.meta.env.VITE_OPENROUTESERVICE_API_KEY}
            />
          </ProtectedRoute>
        );

      case "booking":
        window.location.href =
          "https://mike-masters-quit-magnificent.trycloudflare.com/";
        return null;

      case "weather":
        return (
          <ProtectedRoute>
            <WeatherWidget route={route} />
          </ProtectedRoute>
        );

      default:
        return (
          <ProtectedRoute>
            <TripPlanner
              currentTrip={currentTrip}
              setCurrentTrip={setCurrentTrip}
              setRoute={setRoute}
            />
          </ProtectedRoute>
        );
    }
  };

  return (
    <div className="min-h-screen w-full">
      <Header />

      <div className="bg-[#0b1d36] w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="pt-20 mb-8 w-full">
          <AIAssistant />
        </div>
      </div>

      <div className="bg-[#ffffff] w-full sm:px-6 lg:px-8 py-8">
        <div className="flex w-full rounded-xl bg-white justify-center shadow-lg mb-8">
          <div className="flex overflow-x-auto w-full">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const handleClick = () => {
                if (tab.id !== "booking") setActiveTab(tab.id);
                else window.location.href =
                  "https://mike-masters-quit-magnificent.trycloudflare.com/";
              };

              return (
                <button
                  key={tab.id}
                  onClick={handleClick}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-teal-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="transition-all duration-300 ease-in-out w-full">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
};

export default App;
