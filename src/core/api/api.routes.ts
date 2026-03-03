import { createCallerFactory, createTRPCRouter } from "@/core/api/api.methods";

import { addressRouter } from "@/module/address/address.api";
import { attributeRouter } from "@/module/attribute/attribute.api";
import { cartRouter } from "@/module/cart/cart.api";
import { categoryRouter } from "@/module/category/category.api";
import { inventoryRouter } from "@/module/inventory/inventory.api";
import { orderRouter } from "@/module/order/order.api";
import { paymentRouter } from "@/module/payment/payment.api";
import { productRouter } from "@/module/product/product.api";
import { productVariantRouter } from "@/module/product-variant/product-variant.api";
import { seriesRouter } from "@/module/series/series.api";
import { shipmentRouter } from "@/module/shipment/shipment.api";
import { subcategoryRouter } from "@/module/subcategory/subcategory.api";
import { wishlistRouter } from "@/module/wishlist/wishlist.api";

export const appRouter = createTRPCRouter({
  address: addressRouter,
  attribute: attributeRouter,
  cart: cartRouter,
  category: categoryRouter,
  subcategory: subcategoryRouter,
  series: seriesRouter,
  product: productRouter,
  productVariant: productVariantRouter,
  inventory: inventoryRouter,
  order: orderRouter,
  payment: paymentRouter,
  wishlist: wishlistRouter,
  shipment: shipmentRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
