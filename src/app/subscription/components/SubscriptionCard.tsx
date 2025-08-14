// components/PricingCard.tsx
import React from "react";

interface PricingCardProps {
  onStart: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ onStart }) => {
  return (
    <div className="bg-black text-white p-6 rounded-xl shadow-lg max-w-sm mx-auto">
      <h3 className="text-lg font-semibold mb-2">
        One Plan. One Price. Full Access
      </h3>
      <p className="text-3xl font-bold">
        $20<span className="text-lg font-normal">/month</span>
      </p>
      <p className="text-sm text-gray-300 mb-4">– flat rate</p>

      <ul className="space-y-1 text-sm text-gray-300 mb-6">
        <li className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          <span>No hidden fees</span>
        </li>
        <li className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          <span>Cancel anytime</span>
        </li>
      </ul>

      <button
        onClick={onStart}
        className="bg-green-300 text-black font-medium py-2 px-6 rounded-md w-full hover:bg-green-400 transition"
      >
        Start Now
      </button>
    </div>
  );
};

export default PricingCard;
