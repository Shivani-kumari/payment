'use client';

import PaymentForm from '../components/PymentForm';
import TransactionHistory from '@/components/TransactionHistory';
import { useEffect } from 'react';
import { useStore } from '@/store/paymentStore';

export default function Page() {
  const load = useStore((s) => s.load);

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      <PaymentForm />
      <TransactionHistory />
    </div>
  );
}