import { userContract } from '@/module/user/dto/dto.user.contract'
import { addressContract } from '@/module/address/dto/dto.address.contract'
import { wishlistContract } from '@/module/wishlist/dto/dto.wishlist.contract'
import { cartContract } from '@/module/cart/dto/dto.cart.contract'
import { orderContract } from '@/module/order/dto/dto.order.contract'
import { shipmentContract } from '@/module/shipment/dto/dto.shipment.contract'
import { categoryContract } from '@/module/category/dto/dto.category.contract'
import { discountContract } from '@/module/discount/dto/dto.discount.contract'
import { productContract } from '@/module/product/dto/dto.product.contract'
import { reviewContract } from '@/module/review/dto/dto.review.contract'

export const contract = {
  user: userContract,
  address: addressContract,
  wishlist: wishlistContract,
  cart: cartContract,
  order: orderContract,
  shipment: shipmentContract,
  category: categoryContract,
  discount: discountContract,
  product: productContract,
  review: reviewContract,
}
