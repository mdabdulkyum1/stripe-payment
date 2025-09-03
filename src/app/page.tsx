import { Suspense } from 'react';
import PaymentForm from './payment/components/PaymentForm';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Stripe Payment</h1>
        <p className="text-xl text-gray-600 mb-8">
          Secure, fast, and reliable payment processing for your business
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Payment Form */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Make a Payment</h2>
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>}>
            <PaymentForm />
          </Suspense>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-full mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Payments</h3>
                <p className="text-gray-600">Bank-level security with Stripe{"'"}s advanced encryption</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Fast Processing</h3>
                <p className="text-gray-600">Instant payment confirmation and processing</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-full mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Easy Integration</h3>
                <p className="text-gray-600">Simple setup and seamless integration with your business</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-full mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                <p className="text-gray-600">Round-the-clock customer support for all your needs</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
            <p className="text-gray-600 text-sm">
              To test the payment system, you can use Stripe{"'"}s test card numbers:
            </p>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>• 4242 4242 4242 4242 (Visa)</li>
              <li>• Any future expiry date</li>
              <li>• Any 3-digit CVC</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
