
import { APIRouteResponse } from '@/app/types/prisma'

export default async function Routerpath(): Promise<APIRouteResponse> {
  const path: APIRouteResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/routes?include=path`,
    {
      cache: 'default',
      headers: {
        Accept: 'application/json',
      },
    },
  ).then(res => res.json())
  return path
}


