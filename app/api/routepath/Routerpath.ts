import { APIRouteResponse } from '@/app/types/prisma'

export default async function Routerpath(): Promise<APIRouteResponse> {
  const path: APIRouteResponse = await fetch(
    'https://bustracker-api.vercel.app/routes?include=path',
    {
      cache: 'default',
      headers: {
        Accept: 'application/json',
      },
    },
  ).then(res => res.json())
  return path
}


