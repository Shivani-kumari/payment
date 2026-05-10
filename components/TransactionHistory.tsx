'use client';

import { useStore } from '@/store/paymentStore';

export default function TransactionHistory() {
  const { transactions } = useStore();

  return (
    <div>
      <h3 className="font-bold">History</h3>
      {transactions.map((t) => (
        <div key={t.id} className="border p-2 mt-2">
          <p>ID: {t.id}</p>
          <p>Status: {t.status}</p>
          <p>Amount: {t.amount}</p>
        </div>
      ))}
    </div>
  );
}