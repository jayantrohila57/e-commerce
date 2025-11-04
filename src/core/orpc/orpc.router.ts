import { userRouter } from '@/module/user/api/api.user.router'
import { addressRouter } from '@/module/address/api/api.address.router'
import { wishlistRouter } from '@/module/wishlist/api/api.wishlist.router'
import { cartRouter } from '@/module/cart/api/api.cart.router'
import { orderRouter } from '@/module/order/api/api.order.router'
import { shipmentRouter } from '@/module/shipment/api/api.shipment.router'
import { categoryRouter } from '@/module/category/api/api.category.router'
import { discountRouter } from '@/module/discount/api/api.discount.router'
import { productRouter } from '@/module/product/api/api.product.router'
import { reviewRouter } from '@/module/review/api/api.review.router'

export const appRouter = {
  user: userRouter,
  address: addressRouter,
  wishlist: wishlistRouter,
  cart: cartRouter,
  order: orderRouter,
  shipment: shipmentRouter,
  category: categoryRouter,
  discount: discountRouter,
  product: productRouter,
  review: reviewRouter,
}
