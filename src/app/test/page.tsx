import { apiServer } from '@/core/api/api.server'

export default async function Test() {
  const query = await apiServer.user.getMany({})
  return (
    <div>
      <h1>{JSON.stringify(query.data)}</h1>
    </div>
  )
}
