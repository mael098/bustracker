"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BusUnit,
  Stop,
  estimateMinutesToStop,
  initialBusUnits,
  routes,
  routesOnRoad,
} from "./data";

// Leaflet no funciona en SSR → dynamic import sin SSR
const BusMap = dynamic(() => import("./BusMap"), { ssr: false });

// Avanza cada bus un paso a lo largo del path de su ruta cada N ms
const TICK_MS = 2500;
const PATH_STEP = 14;

export default function MapPage() {
  const [mapRoutes, setMapRoutes] = useState(routes);
  const [busUnits, setBusUnits] = useState<BusUnit[]>(initialBusUnits);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [selectedStop, setSelectedStop] = useState<{
    stop: Stop;
    routeId: string;
  } | null>(null);
  const [isTracking, setIsTracking] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Ajusta las rutas para que sigan calles reales
  useEffect(() => {
    let isMounted = true;
    routesOnRoad(routes).then((nextRoutes) => {
      if (isMounted) setMapRoutes(nextRoutes);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Simula el movimiento de los autobuses a lo largo del path
  useEffect(() => {
    if (!isTracking) return;
    intervalRef.current = setInterval(() => {
      setBusUnits((prev) =>
        prev.map((bus) => {
          const route = mapRoutes.find((r) => r.id === bus.routeId);
          if (!route) return bus;
          const nextIndex = bus.pathIndex + PATH_STEP;
          // Al llegar al final, reinicia desde 0
          return { ...bus, pathIndex: nextIndex >= route.path.length ? 0 : nextIndex };
        })
      );
    }, TICK_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTracking, mapRoutes]);

  const handleSelectStop = (stop: Stop, routeId: string) => {
    setSelectedStop({ stop, routeId });
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
      {/* ── Barra superior ─────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-zinc-400 hover:text-white transition text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Inicio
          </Link>
          <span className="text-zinc-700">|</span>
          <span className="text-sm font-semibold">
            BusTracker <span className="text-blue-400">ITA</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Indicador en vivo */}
          <button
            onClick={() => setIsTracking((v) => !v)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
              isTracking
                ? "bg-green-600/20 text-green-400 border border-green-700"
                : "bg-zinc-800 text-zinc-400 border border-zinc-700"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isTracking ? "bg-green-400 animate-pulse" : "bg-zinc-500"
              }`}
            />
            {isTracking ? "En vivo" : "Pausado"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Panel lateral izquierdo ─────────────────────────────────────── */}
        <aside className="w-72 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-y-auto">
          {/* Filtro de rutas */}
          <section className="p-4 border-b border-zinc-800">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
              Rutas activas
            </h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedRoute(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  selectedRoute === null
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                Todas las rutas
              </button>
              {mapRoutes.map((r) => (
                <button
                  key={r.id}
                  onClick={() =>
                    setSelectedRoute(selectedRoute === r.id ? null : r.id)
                  }
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
                    selectedRoute === r.id
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: r.color }}
                  />
                  {r.name}
                </button>
              ))}
            </div>
          </section>

          {/* Unidades en tiempo real */}
          <section className="p-4 border-b border-zinc-800">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
              Unidades activas
            </h2>
            <div className="flex flex-col gap-2">
              {busUnits
                .filter((b) => !selectedRoute || b.routeId === selectedRoute)
                .map((bus) => {
                  const route = mapRoutes.find((r) => r.id === bus.routeId);
                  if (!route) return null;
                  const nextStop = route.stops.find(
                    (s) =>
                      estimateMinutesToStop(route, bus.pathIndex, s) !== null
                  );
                  const mins = nextStop
                    ? estimateMinutesToStop(route, bus.pathIndex, nextStop)
                    : null;
                  return (
                    <div
                      key={bus.id}
                      className="rounded-lg bg-zinc-800 px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: route.color }}
                        >
                          {bus.label}
                        </span>
                        <div>
                          <p className="text-xs font-medium text-white">
                            Unidad {bus.label}
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            {route.name.split("·")[1]?.trim()}
                          </p>
                        </div>
                      </div>
                      {nextStop && mins !== null && (
                        <p className="mt-1.5 text-[11px] text-zinc-300">
                          ⏱ {nextStop.name} en ~{mins} min
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>

          {/* Detalle de parada seleccionada */}
          {selectedStop && (
            <section className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                  Parada seleccionada
                </h2>
                <button
                  onClick={() => setSelectedStop(null)}
                  className="text-zinc-600 hover:text-zinc-300 text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="rounded-lg bg-zinc-800 p-3">
                <p className="text-sm font-semibold text-white">
                  {selectedStop.stop.name}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{
                    color:
                      mapRoutes.find((r) => r.id === selectedStop.routeId)
                        ?.color ?? "#aaa",
                  }}
                >
                  {mapRoutes.find((r) => r.id === selectedStop.routeId)?.name}
                </p>
                <div className="mt-3 flex flex-col gap-1.5">
                  {busUnits
                    .filter((b) => b.routeId === selectedStop.routeId)
                    .map((bus) => {
                      const route = mapRoutes.find((r) => r.id === bus.routeId);
                      if (!route) return null;
                      const mins = estimateMinutesToStop(
                        route,
                        bus.pathIndex,
                        selectedStop.stop
                      );
                      return (
                        <div
                          key={bus.id}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-zinc-300">
                            🚌 Unidad {bus.label}
                          </span>
                          <span
                            className={
                              mins === null
                                ? "text-zinc-500"
                                : "text-white font-semibold"
                            }
                          >
                            {mins === null ? "Ya pasó" : `~${mins} min`}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </section>
          )}
        </aside>

        {/* ── Mapa ─────────────────────────────────────────────────────────── */}
        <main className="flex-1 relative">
          <BusMap
            routes={mapRoutes}
            busUnits={busUnits}
            selectedRoute={selectedRoute}
            onSelectStop={handleSelectStop}
          />
        </main>
      </div>
    </div>
  );
}
