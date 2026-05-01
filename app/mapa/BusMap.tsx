"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Route, BusUnit, Stop, estimateMinutesToStop } from "./data";

// ─── Fix Leaflet default icon paths (Next.js / webpack issue) ─────────────────
function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

// ─── Custom icon factory ──────────────────────────────────────────────────────
function busIcon(color: string, label: string) {
  return L.divIcon({
    html: `
      <div style="
        background:${color};
        color:#fff;
        font-weight:700;
        font-size:11px;
        width:32px;height:32px;
        border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        border:2px solid #fff;
        box-shadow:0 2px 6px rgba(0,0,0,.4);
      ">${label}</div>
    `,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function stopIcon(color: string) {
  return L.divIcon({
    html: `
      <div style="
        background:#fff;
        border:3px solid ${color};
        width:14px;height:14px;
        border-radius:50%;
        box-shadow:0 1px 4px rgba(0,0,0,.35);
      "></div>
    `,
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function itaIcon() {
  return L.divIcon({
    html: `
      <div style="
        background:#f59e0b;
        color:#000;
        font-weight:800;
        font-size:10px;
        width:38px;height:38px;
        border-radius:8px;
        display:flex;align-items:center;justify-content:center;
        border:2px solid #fff;
        box-shadow:0 2px 8px rgba(0,0,0,.5);
      ">ITA</div>
    `,
    className: "",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
}

// ─── Subcomponente: re-centra el mapa al montar ───────────────────────────────
function MapCenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [map, lat, lng]);
  return null;
}

// ─── Props del componente ─────────────────────────────────────────────────────
interface BusMapProps {
  routes: Route[];
  busUnits: BusUnit[];
  selectedRoute: string | null;
  onSelectStop: (stop: Stop, routeId: string) => void;
}

const ITA_LAT = 22.4252092;
const ITA_LNG = -97.9451106;

export default function BusMap({
  routes,
  busUnits,
  selectedRoute,
  onSelectStop,
}: BusMapProps) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  const visibleRoutes = selectedRoute
    ? routes.filter((r) => r.id === selectedRoute)
    : routes;

  return (
    <MapContainer
      center={[ITA_LAT, ITA_LNG]}
      zoom={13}
      className="w-full h-full"
      zoomControl={true}
    >
      <MapCenter lat={ITA_LAT} lng={ITA_LNG} />

      {/* Mapa base OpenStreetMap (sin API key) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* ITA marker fijo */}
      <Marker position={[ITA_LAT, ITA_LNG]} icon={itaIcon()}>
        <Popup>
          <strong>Instituto Tecnológico de Altamira</strong>
          <br />
          Destino principal de las rutas.
        </Popup>
      </Marker>

      {visibleRoutes.map((route) => (
        <RouteLayer
          key={route.id}
          route={route}
          busUnits={busUnits.filter((b) => b.routeId === route.id)}
          onSelectStop={onSelectStop}
        />
      ))}
    </MapContainer>
  );
}

// ─── Capa de cada ruta (polilínea + paradas + autobuses) ─────────────────────
function RouteLayer({
  route,
  busUnits,
  onSelectStop,
}: {
  route: Route;
  busUnits: BusUnit[];
  onSelectStop: (stop: Stop, routeId: string) => void;
}) {
  return (
    <>
      {/* Polilínea de la ruta */}
      <Polyline
        positions={route.path}
        pathOptions={{ color: route.color, weight: 4, opacity: 0.85 }}
      />

      {/* Paradas */}
      {route.stops.map((stop) => (
        <Marker
          key={stop.id}
          position={[stop.lat, stop.lng]}
          icon={stopIcon(route.color)}
          eventHandlers={{
            click: () => onSelectStop(stop, route.id),
          }}
        >
          <Popup>
            <strong>{stop.name}</strong>
            <br />
            <span style={{ color: route.color }}>● {route.name}</span>
            <br />
            {busUnits.map((bus) => {
              const mins = estimateMinutesToStop(route, bus.pathIndex, stop);
              if (mins === null) return null;
              return (
                <span key={bus.id} className="text-sm">
                  🚌 Unidad {bus.label}: ~{mins} min
                </span>
              );
            })}
          </Popup>
        </Marker>
      ))}

      {/* Autobuses en movimiento */}
      {busUnits.map((bus) => {
        const pos = route.path[bus.pathIndex] ?? route.path[0];
        return (
          <Marker
            key={bus.id}
            position={pos}
            icon={busIcon(route.color, bus.label)}
          >
            <Popup>
              <strong>Unidad {bus.label}</strong>
              <br />
              <span style={{ color: route.color }}>● {route.name}</span>
              <br />
              {route.stops.map((stop) => {
                const mins = estimateMinutesToStop(route, bus.pathIndex, stop);
                if (mins === null) return null;
                return (
                  <div key={stop.id} className="text-sm">
                    ⏱ {stop.name}: ~{mins} min
                  </div>
                );
              })}
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
