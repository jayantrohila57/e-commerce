import { getServerSession } from '@/core/auth/auth.server'

import { CommerceSidebar } from '@/module/account/account.commerce.sidebar'
import { WishlistServerList } from '@/module/wishlist/wishlist.listing'
import Section from '@/shared/components/layout/section/section'
import { PATH } from '@/shared/config/routes'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Wishlist',
  description: 'Update cart details',
}
export default async function CartPage() {
  const session = await getServerSession()
  if (!session) return redirect(PATH.ROOT)

  return (
    <Section
      className=""
      {...metadata}
    >
      <div className="grid h-full w-full grid-cols-12 gap-4">
        <div className="col-span-2 h-full w-full">
          <CommerceSidebar />
        </div>
        <div className="col-span-10 h-full w-full border-l">
          <WishlistServerList />
        </div>
      </div>
    </Section>
  )
}
