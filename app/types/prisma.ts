import { BusUnit } from '../mapa/data';

export const RouteNodeType = {
  stop: "stop",
  route: "route",
} as const;

export type RouteNodeType = (typeof RouteNodeType)[keyof typeof RouteNodeType];

export interface APIRoute {
  id: string;
  name: string;
  color: string;
  path: APIPath[];
}

export interface APIPath {
  id: string;
  type: RouteNodeType;
  lat: number;
  lng: number;
  order: number;
  name: string;
}

export type APIRouteResponse = APIRoute[];
