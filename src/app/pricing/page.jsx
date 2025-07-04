'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 9.99,
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      description: 'Perfect for getting started'
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 19.99,
      features: ['All Basic features', 'Feature 4', 'Feature 5', 'Feature 6'],
      description: 'Most popular choice'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 49.99,
      features: ['All Pro features', 'Feature 7', 'Feature 8', 'Feature 9', 'Priority Support'],
      description: 'For large organizations'
    }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handlePayment = () => {
    if (selectedPlan) {
      router.push(`/?amount=${selectedPlan.price}&plan=${selectedPlan.name}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600">Select the perfect plan for your needs</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow-lg p-6 border-2 transition-all duration-200 cursor-pointer ${
              selectedPlan?.id === plan.id
                ? 'border-blue-500 shadow-xl transform scale-105'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handlePlanSelect(plan)}
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">
                ${plan.price}
                <span className="text-lg text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                selectedPlan?.id === plan.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              Selected: {selectedPlan.name}
            </h3>
            <p className="text-blue-700">Total: ${selectedPlan.price}</p>
          </div>
          
          <button
            onClick={handlePayment}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
          >
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
} 