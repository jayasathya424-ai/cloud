import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  DollarSign,
  PlaneTakeoff,
  RefreshCcw,
} from "lucide-react";
import { getOpenRouterModel } from "../lib/openrouterClient";

const TripPlanner: React.FC = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);

  // ✅ Generate response using OpenRouter (replaces Gemini)
  const getAIResponse = async (
    from: string,
    to: string,
    date: string,
    budget: string
  ): Promise<string> => {
    try {
      const prompt = `Plan a trip from ${from} to ${to} on ${date} with a budget of rupees ${budget}. 
Provide a detailed one-day schedule to visit which places with timestamps and activities within budget.
Include:
- transport options available (train, bus, flight, car with price estimation if available)
- in-city transport like auto or cab to reach locations
- food and hotel options within budget
Format:
Plain text only, no emojis, no bold text, and no empty lines.`;

      const response = await getOpenRouterModel(prompt, "gpt-3.5-turbo");
      return response.trim();
    } catch (err: any) {
      console.error("OpenRouter API error:", err);
      throw new Error("Failed to fetch trip plan. Please try again.");
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async () => {
    if (!from || !to || !date || !budget) return;
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const aiPlan = await getAIResponse(from, to, date, budget);
      setPlan(aiPlan);
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Retry fetch
  const handleRetry = () => {
    handleSubmit();
  };

  // ✅ Print schedule
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-4 py-10">
      <h1 className="text-5xl text-left font-bold mb-8">Plan Your Trip Now</h1>

      {/* Input Form */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg flex flex-wrap items-center overflow-hidden">
        <div className="flex items-center px-4 py-3 flex-1 border-r border-gray-200">
          <PlaneTakeoff className="w-5 h-5 text-teal-600 mr-2" />
          <input
            type="text"
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full outline-none text-gray-900 placeholder-gray-500"
          />
        </div>

        <div className="flex items-center px-4 py-3 flex-1 border-r border-gray-200">
          <MapPin className="w-5 h-5 text-teal-600 mr-2" />
          <input
            type="text"
            placeholder="Destination"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full outline-none text-gray-900 placeholder-gray-500"
          />
        </div>

        <div className="flex items-center px-4 py-3 flex-1 border-r border-gray-200">
          <Calendar className="w-5 h-5 text-teal-600 mr-2" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full outline-none text-gray-900"
          />
        </div>

        <div className="flex items-center px-4 py-3 flex-1 border-r border-gray-200">
          <DollarSign className="w-5 h-5 text-teal-600 mr-2" />
          <input
            type="number"
            placeholder="Budget (in Rupees)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full outline-none text-gray-900 placeholder-gray-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !from || !to || !date || !budget}
          className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-4 font-semibold text-white disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-6 text-red-300 bg-red-800/30 px-4 py-3 rounded-lg shadow-md flex items-center gap-3">
          ⚠ {error}
          <button
            onClick={handleRetry}
            className="ml-4 px-3 py-1 bg-blue-700 hover:bg-blue-800 rounded-lg flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" /> Retry
          </button>
        </div>
      )}

      {/* Default image */}
      {!plan && !loading && !error && (
        <img
          src="/hannieldesign.png"
          className="pt-24 w-184 md:w-184 h-auto object-cover"
          alt="Logo"
        />
      )}

      {/* Generated plan */}
      {plan && (
        <div className="w-full max-w-6xl bg-white/20 backdrop-blur-md text-white rounded-xl shadow-lg mt-8 p-6">
          <h2 className="text-xl text-center font-semibold mb-4">
            TakeMeAway Plan
          </h2>
          <div className="space-y-1 border-t pt-3">
            {plan.split("\n").map((line, idx) => (
              <div key={idx} className="flex items-start space-x-3 px-3 py-2">
                <p className="text-md font-medium">{line}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 text-right">
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg shadow"
            >
              Print Schedule
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPlanner;