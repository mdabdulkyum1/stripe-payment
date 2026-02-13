'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-500';
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-xl font-bold text-gray-800">
            Stripe Payment
          </div>
          
          <div className="flex space-x-8">
            <Link href="/" className={`${isActive('/')} transition-colors duration-200`}>
              Home
            </Link>
            <Link href="/pricing" className={`${isActive('/pricing')} transition-colors duration-200`}>
              Pricing
            </Link>
            <Link href="/voice" className={`${isActive('/voice')} transition-colors duration-200`}>
              Voice
            </Link>
            <Link href="/sojib" className={`${isActive('/voice')} transition-colors duration-200`}>
              Sojib
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 