"use client";

import { fetchWithAuth } from "../lib/api";
import PricingCard from "./components/SubscriptionCard";



export default function SubscriptionPage() {
  const handleSubscribe = async () => {
    try {
      const res = await fetchWithAuth("/subscription/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({
          successUrl: "http://localhost:3000/subscription/success",
          cancelUrl: "http://localhost:3000/subscription/cancel",
        }),
      });

      console.log("Checkout session created:", res);

      if (res?.success) {
        window.location.href = res?.data?.url;
      }
    } catch (err) {
      console.error("Error creating checkout session:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <PricingCard onStart={handleSubscribe} />
    </div>
  );
}
