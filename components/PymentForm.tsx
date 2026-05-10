'use client';

import { useState } from 'react';
import { formatCardNumber } from '@/utils/formatters';
import { getCardType } from '../utils/cardUtils';
import { validateExpiry, validateCVV } from '@/utils/validators';
import { pay } from '@/utils/api';
import { useStore } from '@/store/paymentStore';
import CardPreview from './CardPreview';
import StatusScreen from './StatusScreen';

export default function PaymentForm() {
  const [form, setForm] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
    amount: '',
    currency: 'INR',
  });

  const [txnId] = useState(() => crypto.randomUUID());
  const [attempts, setAttempts] = useState(1);

  const { status, setStatus, addTransaction, updateTransaction } = useStore();

  const cardType = getCardType(form.number.replace(/\s/g, ''));

  const isValid =
    form.name &&
    form.number.length >= 16 &&
    validateExpiry(form.expiry) &&
    validateCVV(form.cvv, cardType) &&
    form.amount;

  const submit = async () => {
    setStatus('PROCESSING');

    if (attempts === 1) {
      addTransaction({
        id: txnId,
        amount: Number(form.amount),
        status: 'PROCESSING',
        timestamp: Date.now(),
        attempts: 1,
      });
    }

    try {
      const res = await pay({ ...form, transactionId: txnId });

      if (res.status === 'success') {
        setStatus('SUCCESS');
        updateTransaction(txnId, { status: 'SUCCESS' });
      } else {
        setStatus('FAILED');
        updateTransaction(txnId, { status: 'FAILED', attempts });
      }
    } catch (e: any) {
      setStatus('TIMEOUT');
    }
  };

  const retry = () => {
    if (attempts >= 3) return;
    setAttempts((a) => a + 1);
    submit();
  };

  if (status !== 'IDLE' && status !== 'PROCESSING') {
    return <StatusScreen status={status} retry={retry} attempts={attempts} />;
  }

  return (
    <div className="space-y-3">
      <CardPreview {...form} />

      <input
       className="border p-2 rounded w-full"
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
       className="border p-2 rounded w-full"
        placeholder="Card Number"
        onChange={(e) =>
          setForm({ ...form, number: formatCardNumber(e.target.value) })
        }
      />

      <input
       className="border p-2 rounded w-full"
        placeholder="MM/YY"
        onChange={(e) => setForm({ ...form, expiry: e.target.value })}
      />

      <input
       className="border p-2 rounded w-full"
        placeholder="CVV"
        onChange={(e) => setForm({ ...form, cvv: e.target.value })}
      />

      <input
       className="border p-2 rounded w-full"
        placeholder="Amount"
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />

      <select
       className="border p-2 rounded w-full"
        onChange={(e) => setForm({ ...form, currency: e.target.value })}
      >
        <option>INR</option>
        <option>USD</option>
      </select>

      <button
    disabled={!isValid || status === 'PROCESSING'}
    onClick={submit}
    className={`p-2 text-white rounded transition w-full 
      ${!isValid || status === 'PROCESSING'
        ? 'bg-green-300 cursor-not-allowed opacity-60'
        : 'bg-green-600 hover:bg-green-700'
      }`}
  >
    {status === 'PROCESSING' ? 'Processing...' : 'Pay'}
  </button>
    </div>
  );
}