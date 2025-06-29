'use client';

import { useSearchParams } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../../components/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function StripeWrapper() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const plan = searchParams.get("plan");

  if (!amount || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Invalid payment information.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-[#014E4E] text-center">
        Stripe Payment
      </h2>
      <Elements stripe={stripePromise}>
        <CheckoutForm amount={amount} plan={plan} />
      </Elements>
    </div>
  );
}











