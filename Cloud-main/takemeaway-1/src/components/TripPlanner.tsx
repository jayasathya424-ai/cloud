import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Trash2,
  GripVertical,
  ArrowRight,
  Route as RouteIcon,
  Plus,
  Shuffle,
} from "lucide-react";
import axios from "axios";

interface TripPlannerProps {
  currentTrip?: any;
  setCurrentTrip?: React.Dispatch<React.SetStateAction<any>>;
  setRoute?: React.Dispatch<
    React.SetStateAction<{
      from: string;
      to: string;
      fromCoords: [number, number] | null;
      toCoords: [number, number] | null;
      path?: any;
    }>
  >;
}

type TripType = "flight" | "hotel" | "activity" | "transport" | "transit";

interface TripItem {
  id: string;
  title: string;
  location: string;                // city or category/name
  date: string;                    // ISO date for day grouping
  time: string;                    // display time
  duration: string;                // display duration
  type: TripType;

  coords?: { lat: number; lng: number };
  notes?: string;
}

type DayKey = string; // ISO date string (e.g., "2025-11-05")

const todayISO = () => new Date().toISOString().split("T")[0];

const TripPlanner: React.FC<TripPlannerProps> = ({
  currentTrip,
  setCurrentTrip,
  setRoute,
}) => {
  const [tripItems, setTripItems] = useState<TripItem[]>([]);
  const [activeDay, setActiveDay] = useState<DayKey>(todayISO());
  const [loadingOpt, setLoadingOpt] = useState(false);
  const dragSrcId = useRef<string | null>(null);

  // ========= Utilities =========
  const fmtHr = (hrs: number) => `${Math.max(0, +hrs).toFixed(1)} h`;
  const fmtKm = (km: number) => `${Math.max(0, +km).toFixed(1)} km`;

  // Free OSRM leg calc (driving). from = [lat,lng]
  const getOSRMLeg = async (from: number[], to: number[]) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=false&geometries=polyline`;
      const res = await axios.get(url);
      const r = res.data?.routes?.[0];
      if (!r) return null;
      return {
        distanceKm: r.distance / 1000,
        durationHr: r.duration / 3600,
      };
    } catch (e) {
      console.error("OSRM error:", e);
      return null;
    }
  };

  // ========= 1) Bring in places from PlaceRecommendations =========
  useEffect(() => {
    if (!currentTrip?.places) return;
    const baseDate = activeDay || todayISO();

    const converted: TripItem[] = currentTrip.places.map((p: any) => ({
      id: p.id,
      title: p.name,
      location: p.category,
      date: baseDate,
      time: "Anytime",
      duration: "—",
      type: "activity",
      coords: p.coordinates ? { lat: p.coordinates.lat, lng: p.coordinates.lng } : undefined,
    }));

    setTripItems((prev) => {
      const ids = new Set(prev.map((i) => i.id));
      const merged = [...prev];
      converted.forEach((c) => {
        if (!ids.has(c.id)) merged.push(c);
      });
      return merged;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrip?.places]);

  // ========= 6) Day-wise grouping =========
  const itemsByDay: Record<DayKey, TripItem[]> = useMemo(() => {
    const map: Record<string, TripItem[]> = {};
    for (const item of tripItems) {
      const key = item.date || todayISO();
      if (!map[key]) map[key] = [];
      map[key].push(item);
    }
    // stable sort by time (if you decide to use HH:mm later)
    for (const k of Object.keys(map)) {
      map[k] = map[k];
    }
    return map;
  }, [tripItems]);

  const dayKeys = useMemo(() => Object.keys(itemsByDay).sort(), [itemsByDay]);

  useEffect(() => {
    if (dayKeys.length && !dayKeys.includes(activeDay)) {
      setActiveDay(dayKeys[0]);
    }
  }, [dayKeys, activeDay]);

  const ensureDay = (d?: string) => d || todayISO();

  // ========= 5) Compute leg metrics between sequential items =========
  const [legInfo, setLegInfo] = useState<
    Record<string /* join key: A->B id */, { km: number; hr: number }>
  >({});

  const recomputeLegs = async (day: DayKey) => {
    const items = (itemsByDay[day] || []).filter((i) => i.coords);
    const nextLegs: Record<string, { km: number; hr: number }> = {};
    for (let i = 0; i < items.length - 1; i++) {
      const a = items[i];
      const b = items[i + 1];
      const key = `${a.id}->${b.id}`;
      if (!a.coords || !b.coords) continue;
      const leg = await getOSRMLeg([a.coords.lat, a.coords.lng], [b.coords.lat, b.coords.lng]);
      if (leg) {
        nextLegs[key] = { km: leg.distanceKm, hr: leg.durationHr };
      }
    }
    setLegInfo((prev) => ({ ...prev, ...nextLegs }));
  };

  useEffect(() => {
    if (!activeDay) return;
    recomputeLegs(activeDay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDay, itemsByDay[activeDay]?.length]);

  // ========= 1) Drag & Drop (per day) =========
  const onDragStart = (id: string) => (e: React.DragEvent) => {
    dragSrcId.current = id;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const onDrop = (targetId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    const srcId = dragSrcId.current;
    dragSrcId.current = null;
    if (!srcId || srcId === targetId) return;

    setTripItems((prev) => {
      const dayItems = (itemsByDay[activeDay] || []).map((i) => i.id);
      // only reorder within active day
      if (!dayItems.includes(srcId) || !dayItems.includes(targetId)) return prev;

      const newList = [...prev];
      const srcIndex = newList.findIndex((i) => i.id === srcId);
      const tgtIndex = newList.findIndex((i) => i.id === targetId);
      const [moved] = newList.splice(srcIndex, 1);
      newList.splice(tgtIndex, 0, moved);
      return newList;
    });

    // recompute legs after a short tick
    setTimeout(() => recomputeLegs(activeDay), 0);
  };

  // ========= Move item to another day =========
  const moveItemToDay = (id: string, day: DayKey) => {
    setTripItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, date: ensureDay(day) } : i))
    );
    setTimeout(() => recomputeLegs(day), 0);
  };

  // ========= 3) Route optimization (nearest neighbor, per day) =========
  const optimizeDay = async (day: DayKey) => {
    const items = (itemsByDay[day] || []).filter((i) => i.coords);
    if (items.length < 3) return; // nothing to optimize

    setLoadingOpt(true);
    try {
      // Nearest Neighbor
      const remaining = [...items];
      const ordered: TripItem[] = [];
      // start from first in the list
      let current = remaining.shift()!;
      ordered.push(current);

      while (remaining.length) {
        let bestIdx = 0;
        let bestCost = Infinity;
        for (let i = 0; i < remaining.length; i++) {
          const candidate = remaining[i];
          if (!current.coords || !candidate.coords) continue;
          // simple Euclidean as a heuristic (faster than OSRM for selection)
          const dx = current.coords.lat - candidate.coords.lat;
          const dy = current.coords.lng - candidate.coords.lng;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < bestCost) {
            bestCost = dist2;
            bestIdx = i;
          }
        }
        current = remaining.splice(bestIdx, 1)[0];
        ordered.push(current);
      }

      // apply new order within that day while keeping other days intact
      setTripItems((prev) => {
        const others = prev.filter((i) => i.date !== day);
        return [
          ...others,
          ...ordered,
          // also include any non-coords items of that day in the end
          ...(itemsByDay[day] || []).filter((i) => !i.coords),
        ];
      });

      // recompute OSRM legs after reordering
      setTimeout(() => recomputeLegs(day), 0);
    } finally {
      setLoadingOpt(false);
    }
  };

  // ========= 4) Map integration: click item to setRoute =========
  const focusOnItem = (idx: number, day: DayKey) => {
    const items = itemsByDay[day] || [];
    const a = items[idx];
    if (!a?.coords) return;

    // Build a leg: prev -> current (or trip start -> current)
    const prev = idx > 0 ? items[idx - 1] : undefined;
    const fromName =
      prev?.title || currentTrip?.from || "Start";
    const fromCoordsTuple: [number, number] | null =
      prev?.coords
        ? [prev.coords.lat, prev.coords.lng]
        : (currentTrip?.fromCoords as [number, number] | null) || null;

    setRoute?.({
      from: fromName,
      to: a.title,
      fromCoords: fromCoordsTuple,
      toCoords: [a.coords.lat, a.coords.lng],
      path: null,
    });
  };

  // ========= Remove =========
  const removeItem = (id: string) => {
    setTripItems((prev) => prev.filter((i) => i.id !== id));
    setCurrentTrip?.((p: any) => ({
      ...p,
      places: (p?.places || []).filter((pl: any) => pl.id !== id),
    }));
    setTimeout(() => recomputeLegs(activeDay), 0);
  };

  // ========= Add quick blank activity to a day =========
  const addBlank = (day: DayKey) => {
    const id = `${Date.now()}`;
    setTripItems((prev) => [
      ...prev,
      {
        id,
        title: "New Activity",
        location: "Custom",
        date: day,
        time: "Anytime",
        duration: "—",
        type: "activity",
      },
    ]);
  };

  // ======== UI ========
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Trip Plan</h2>
          <div className="flex gap-2">
            <button
              onClick={() => addBlank(activeDay)}
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Add Activity
            </button>
            <button
              onClick={() => optimizeDay(activeDay)}
              disabled={loadingOpt}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
            >
              <Shuffle className="w-4 h-4" />
              {loadingOpt ? "Optimizing..." : "Optimize Route"}
            </button>
          </div>
        </div>

        {/* Day Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {dayKeys.length === 0 && (
            <div className="text-gray-500 text-sm"></div>
          )}
          {dayKeys.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeDay === d
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {d === todayISO() ? "Today" : d}
            </button>
          ))}
          
        </div>

        {/* Timeline for active day */}
        {(itemsByDay[activeDay] || []).length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No items for this day. Add places from Discover</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(itemsByDay[activeDay] || []).map((item, idx, arr) => {
              const prev = idx > 0 ? arr[idx - 1] : null;
              const legKey = prev ? `${prev.id}->${item.id}` : undefined;
              const leg = legKey ? legInfo[legKey] : undefined;

              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={onDragStart(item.id)}
                  onDragOver={onDragOver}
                  onDrop={onDrop(item.id)}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow transition"
                >
                  <div className="flex items-start gap-4">
                    <GripVertical className="w-5 h-5 text-gray-400 mt-1" />

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📍</span>
                          <h4 className="font-semibold text-gray-900">
                            {item.title}
                          </h4>
                          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                            {item.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Move to another day */}
                          <input
                            type="date"
                            value={item.date}
                            onChange={(e) => moveItemToDay(item.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                            title="Move to another day"
                          />
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                        <Calendar className="w-4 h-4" />
                        <span>{item.date}</span>
                        <Clock className="w-4 h-4" />
                        <span>{item.time} {item.duration !== "—" ? `(${item.duration})` : ""}</span>
                      </div>

                      {/* 5) leg metrics */}
                      {prev && leg && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-700">
                          <RouteIcon className="w-4 h-4" />
                          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100">
                            {fmtKm(leg.km)} • {fmtHr(leg.hr)} from <strong className="font-medium">{prev.title}</strong>
                          </span>
                        </div>
                      )}

                      {/* 4) click to focus on map */}
                      <div className="mt-3">
                        <button
                          onClick={() => focusOnItem(idx, activeDay)}
                          className="inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900"
                          title="Show on map & draw leg"
                        >
                          <ArrowRight className="w-4 h-4" />
                          Show this leg on map
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlanner;
