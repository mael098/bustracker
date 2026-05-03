
import { APIRouteResponse } from '@/app/types/prisma'

export default async function Routerpath(): Promise<APIRouteResponse> {
  const path: APIRouteResponse = await fetch(
    process.env.API_URL as string,
    {
      cache: 'default',
      headers: {
        Accept: 'application/json',
      },
    },
  ).then(res => res.json())
  return path
}


