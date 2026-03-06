import Script from "next/script";

function RazorpayProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </>
  );
}

export default RazorpayProvider;
