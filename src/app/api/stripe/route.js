import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { amount } = await request.json();
    // Create a PaymentIntent with the specified amount (in cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      // You can add more options here (e.g., metadata)
    });
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 