'use client';

import { Suspense } from 'react';
import StripeWrapper from './components/StripeWrapper';
import Loading from '../../components/loading/Loading';

export default function StripePage() {
  return (
    <Suspense fallback={<div><Loading /></div>}>
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-4">
        <StripeWrapper />
      </div>
    </Suspense>
  );
}
