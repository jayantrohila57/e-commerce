import { cookies } from 'next/headers'

export default async function getCookies() {
  const cookieStore = await cookies()
  return cookieStore.getAll().map((cookie) => ({
    [cookie.name]: {
      [cookie.name]: cookie.value,
    },
  }))
}
