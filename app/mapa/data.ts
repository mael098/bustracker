// Coordenadas de rutas de transporte público
// que conectan con el Instituto Tecnológico de Altamira (ITA)
// Zona conurbada: Altamira, Tampico, Ciudad Madero, Tamaulipas

export interface Stop {
    id: string;
    name: string;
    lat: number;
    lng: number;
}

export interface Route {
    id: string;
    name: string;
    color: string;
    stops: Stop[];
    /** Coordenadas de la polilínea del recorrido completo */
    path: [number, number][];
}

export interface BusUnit {
    id: string;
    routeId: string;
    label: string;
    /** Índice actual en el path de la ruta */
    pathIndex: number;
}

// ─── RUTA 1: Calle 20 de Noviembre (Tampico) → ITA ──────────────────────────
const route1Stops: Stop[] = [
    { id: "r1-s1", name: "Terminal AutoBus · Calle 20 de Noviembre", lat: 22.2189841, lng: -97.8576715 },
    { id: "r1-s2", name: "Plaza las Américas", lat: 22.2831, lng: -97.8712 },
    { id: "r1-s3", name: "Blvd. Adolfo López Mateos", lat: 22.3012, lng: -97.8880 },
    { id: "r1-s4", name: "Col. Altamira Centro", lat: 22.3612, lng: -97.9180 },
    { id: "r1-s5", name: "Crucero Altamira", lat: 22.393289054517577, lng: -97.93139625195371 },
    { id: "r1-s6", name: "Centro Altamira (paso de autobus)", lat: 22.397651926300796, lng: -97.93807042993949 },
    { id: "r1-s7", name: "Tramo directo hacia ITA", lat: 22.41948610584814, lng: -97.9431645155561 },
    { id: "r1-s8", name: "Alejandro Briones, 89602 Altamira, Tamps.", lat: 22.422724757713606, lng: -97.9454502732479 },
    { id: "r1-s9", name: "Tecnológico de México Altamira ITA N°4", lat: 22.4252092, lng: -97.9451106 },
];

const route1Path: [number, number][] = [
    [22.2189841, -97.8576715],
    [22.2350, -97.8610],
    [22.2520, -97.8650],
    [22.2751, -97.8688],
    [22.2831, -97.8712],
    [22.2950, -97.8780],
    [22.3012, -97.8880],
    [22.3150, -97.8970],
    [22.3300, -97.9020],
    [22.3456, -97.9102],
    [22.3530, -97.9140],
    [22.3612, -97.9180],
    [22.3720, -97.9220],
    [22.3830, -97.9260],
    [22.393289054517577, -97.93139625195371],
    [22.397651926300796, -97.93807042993949],
    [22.41948610584814, -97.9431645155561],
    [22.422724757713606, -97.9454502732479],
    [22.4252092, -97.9451106],
];

// ─── RUTA 2: Ciudad Madero → ITA ─────────────────────────────────────────────
const route2Stops: Stop[] = [
    { id: "r2-s1", name: "Ciudad Madero – IMSS", lat: 22.2712, lng: -97.8310 },
    { id: "r2-s2", name: "Col. Miramar", lat: 22.2880, lng: -97.8510 },
    { id: "r2-s3", name: "Blvd. Constitución", lat: 22.3090, lng: -97.8720 },
    { id: "r2-s4", name: "Col. Industrial", lat: 22.3350, lng: -97.8960 },
    { id: "r2-s5", name: "Av. Las Torres", lat: 22.3590, lng: -97.9130 },
    { id: "r2-s6", name: "Tecnológico de México Altamira ITA N°4", lat: 22.4252092, lng: -97.9451106 },
];

const route2Path: [number, number][] = [
    [22.2712, -97.8310],
    [22.2780, -97.8410],
    [22.2880, -97.8510],
    [22.2990, -97.8600],
    [22.3090, -97.8720],
    [22.3200, -97.8840],
    [22.3350, -97.8960],
    [22.3460, -97.9040],
    [22.3590, -97.9130],
    [22.3700, -97.9200],
    [22.3820, -97.9250],
    [22.4000, -97.9340],
    [22.4120, -97.9400],
    [22.4252092, -97.9451106],
];

// ─── RUTAS EXPORTADAS ─────────────────────────────────────────────────────────
export const routes: Route[] = [
    {
        id: "ruta-1",
        name: "Ruta 1 · Calle 20 de Noviembre (Tampico) → ITA",
        color: "#3b82f6",
        stops: route1Stops,
        path: route1Path,
    },
    {
        id: "ruta-2",
        name: "Ruta 2 · Cd. Madero → ITA",
        color: "#10b981",
        stops: route2Stops,
        path: route2Path,
    },
];

// ─── UNIDADES INICIALES ───────────────────────────────────────────────────────
export const initialBusUnits: BusUnit[] = [
    { id: "bus-1A", routeId: "ruta-1", label: "1A", pathIndex: 2 },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** Distancia en km entre dos puntos usando fórmula de Haversine */
export function haversineKm(
    lat1: number, lng1: number,
    lat2: number, lng2: number
): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const AVG_SPEED_KMH = 25;

/**
 * Estima cuántos minutos tardará el autobús (en pathIndex dado) en llegar
 * a una parada específica. Retorna null si ya pasó la parada.
 */
export function estimateMinutesToStop(
    route: Route,
    busPathIndex: number,
    stop: Stop
): number | null {
    // Encontrar el punto del path más cercano a la parada
    let closestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < route.path.length; i++) {
        const d = haversineKm(route.path[i][0], route.path[i][1], stop.lat, stop.lng);
        if (d < minDist) {
            minDist = d;
            closestIdx = i;
        }
    }

    if (closestIdx <= busPathIndex) return null; // ya pasó

    // Sumar distancias desde busPathIndex hasta closestIdx
    let distKm = 0;
    for (let i = busPathIndex; i < closestIdx; i++) {
        distKm += haversineKm(
            route.path[i][0], route.path[i][1],
            route.path[i + 1][0], route.path[i + 1][1]
        );
    }

    return Math.round((distKm / AVG_SPEED_KMH) * 60);
}

interface OsrmRouteResponse {
    code: string;
    routes?: {
        geometry?: {
            coordinates?: [number, number][];
        };
    }[];
}

/**
 * Obtiene una polilínea que sigue calles reales usando OSRM.
 * Si falla, regresa la ruta original para no romper el mapa.
 */
export async function routePathOnRoad(route: Route): Promise<Route> {
    if (route.stops.length < 2) return route;

    const stopChain = route.stops.map((s) => `${s.lng},${s.lat}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${stopChain}?overview=full&geometries=geojson&steps=false`;

    try {
        const res = await fetch(url, {
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
        });

        if (!res.ok) return route;

        const data = (await res.json()) as OsrmRouteResponse;
        if (data.code !== "Ok") return route;

        const coordinates = data.routes?.[0]?.geometry?.coordinates;
        if (!coordinates || coordinates.length < 2) return route;

        const roadPath: [number, number][] = coordinates.map(([lng, lat]) => [
            lat,
            lng,
        ]);

        return {
            ...route,
            path: roadPath,
        };
    } catch {
        return route;
    }
}

/** Aplica routePathOnRoad a todas las rutas */
export async function routesOnRoad(inputRoutes: Route[]): Promise<Route[]> {
    return Promise.all(inputRoutes.map((route) => routePathOnRoad(route)));
}
