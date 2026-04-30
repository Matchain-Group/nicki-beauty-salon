import { Suspense } from 'react';
import PaymentVerifyContent from './PaymentVerifyContent';

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#d4a574] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[#3d2314] text-lg">Verifying your payment...</p>
        </div>
      </div>
    }>
      <PaymentVerifyContent />
    </Suspense>
  );
}
