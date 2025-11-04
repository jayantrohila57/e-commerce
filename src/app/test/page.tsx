'use client'

import { apiClient } from '@/core/orpc/orpc.client'
import { useQuery } from '@tanstack/react-query'

export default function Test() {
  const query = apiClient.user.user.getMany.mutationOptions({
    input: {},
  })
  return (
    <div>
      <h1>{JSON.stringify(query.data)}</h1>
    </div>
  )
}
