import { pgEnum } from 'drizzle-orm/pg-core'

const discountTypeEnum = pgEnum('discount_type', ['flat', 'percent'])

const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled'])

const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded'])

const paymentProviderEnum = pgEnum('payment_provider', ['stripe', 'razorpay', 'paypal', 'cod'])

const shipmentStatusEnum = pgEnum('shipment_status', ['pending', 'in_transit', 'delivered'])


const displayTypeEnum = pgEnum('display_type', ['grid', 'carousel', 'banner', 'list', 'featured'])

const visibilityEnum = pgEnum('visibility', ['public', 'private', 'hidden'])
export { discountTypeEnum, orderStatusEnum, paymentStatusEnum, paymentProviderEnum, shipmentStatusEnum, displayTypeEnum, visibilityEnum }


