import Razorpay from "razorpay";
import { serverEnv } from "@/shared/config/env.server";

const options: ConstructorParameters<typeof Razorpay>[0] = {
  key_id: serverEnv.RAZORPAY_API_KEY,
  key_secret: serverEnv.RAZORPAY_API_SECRET,
};

if (serverEnv.RAZORPAY_ACCOUNT_ID) {
  options.headers = { "X-Razorpay-Account": serverEnv.RAZORPAY_ACCOUNT_ID };
}

export const razorpay = new Razorpay(options);
