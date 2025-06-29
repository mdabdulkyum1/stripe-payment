'use client';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useSearchParams } from 'next/navigation';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
export default function PaymentForm() {
    const searchParams = useSearchParams();
    const amount = searchParams.get("amount");
    const plan = searchParams.get("plan");
    
    return (
        <div className="max-w-md mx-auto p-4">
            <Elements stripe={stripePromise}>
            
            <CheckoutForm amount={amount} plan={plan} />
            
            </Elements>
        </div>
    );
}


