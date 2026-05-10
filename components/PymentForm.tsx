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

  const [errors, setErrors] = useState<any>({});

  const [txnId] = useState(() => crypto.randomUUID());
  const [attempts, setAttempts] = useState(1);

  const { status, setStatus, addTransaction, updateTransaction } =
    useStore();

  const cardType = getCardType(
    form.number.replace(/\s/g, '')
  );

  // Handle Input Change + Remove Error
  const handleChange = (
    field: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Remove current field error
    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Validate Form
  const validateForm = () => {
    const newErrors: any = {};

    // Name
    if (!form.name.trim()) {
      newErrors.name =
        'Cardholder name is required';
    }

    // Card Number
    const cleanNumber =
      form.number.replace(/\s/g, '');

    if (!cleanNumber) {
      newErrors.number =
        'Card number is required';
    } else if (cleanNumber.length < 16) {
      newErrors.number =
        'Card number must be 16 digits';
    }

    // Expiry
    if (!form.expiry) {
      newErrors.expiry =
        'Expiry date is required';
    } else if (!validateExpiry(form.expiry)) {
      newErrors.expiry =
        'Card has expired or expiry is invalid';
    }

    // CVV
    if (!form.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (
      !validateCVV(form.cvv, cardType)
    ) {
      newErrors.cvv =
        cardType === 'amex'
          ? 'AMEX CVV must be 4 digits'
          : 'CVV must be 3 digits';
    }

    // Amount
    if (!form.amount) {
      newErrors.amount =
        'Amount is required';
    } else if (
      Number(form.amount) <= 0
    ) {
      newErrors.amount =
        'Amount must be greater than 0';
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // Submit Payment
  const submit = async () => {
    const valid = validateForm();

    if (!valid) return;

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
      const res = await pay({
        ...form,
        transactionId: txnId,
      });

      if (res.status === 'success') {
        setStatus('SUCCESS');

        updateTransaction(txnId, {
          status: 'SUCCESS',
        });
      } else {
        setStatus('FAILED');

        updateTransaction(txnId, {
          status: 'FAILED',
          attempts,
        });
      }
    } catch (e: any) {
      setStatus('TIMEOUT');
    }
  };

  // Retry Payment
  const retry = () => {
    if (attempts >= 3) return;

    setAttempts((a) => a + 1);

    submit();
  };

  // Show Result Screen
  if (
    status !== 'IDLE' &&
    status !== 'PROCESSING'
  ) {
    return (
      <StatusScreen
        status={status}
        retry={retry}
        attempts={attempts}
      />
    );
  }

  return (
    <div className="space-y-3">
      <CardPreview {...form} />

      {/* Name */}
      <div>
        <input
          className={`border p-2 rounded w-full ${
            errors.name
              ? 'border-red-500'
              : ''
          }`}
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            handleChange(
              'name',
              e.target.value
            )
          }
        />

        {errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.name}
          </p>
        )}
      </div>

      {/* Card Number */}
      <div>
        <input
          className={`border p-2 rounded w-full ${
            errors.number
              ? 'border-red-500'
              : ''
          }`}
          placeholder="Card Number"
          value={form.number}
          onChange={(e) =>
            handleChange(
              'number',
              formatCardNumber(
                e.target.value
              )
            )
          }
        />

        {errors.number && (
          <p className="text-red-500 text-sm mt-1">
            {errors.number}
          </p>
        )}
      </div>

      {/* Expiry */}
      <div>
        <input
          className={`border p-2 rounded w-full ${
            errors.expiry
              ? 'border-red-500'
              : ''
          }`}
          placeholder="MM/YY"
          value={form.expiry}
          onChange={(e) =>
            handleChange(
              'expiry',
              e.target.value
            )
          }
        />

        {errors.expiry && (
          <p className="text-red-500 text-sm mt-1">
            {errors.expiry}
          </p>
        )}
      </div>

      {/* CVV */}
      <div>
        <input
          className={`border p-2 rounded w-full ${
            errors.cvv
              ? 'border-red-500'
              : ''
          }`}
          placeholder="CVV"
          value={form.cvv}
          onChange={(e) =>
            handleChange(
              'cvv',
              e.target.value
            )
          }
        />

        {errors.cvv && (
          <p className="text-red-500 text-sm mt-1">
            {errors.cvv}
          </p>
        )}
      </div>

      {/* Amount */}
      <div>
        <input
          className={`border p-2 rounded w-full ${
            errors.amount
              ? 'border-red-500'
              : ''
          }`}
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            handleChange(
              'amount',
              e.target.value
            )
          }
        />

        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">
            {errors.amount}
          </p>
        )}
      </div>

      {/* Currency */}
      <select
        className="border p-2 rounded w-full"
        value={form.currency}
        onChange={(e) =>
          handleChange(
            'currency',
            e.target.value
          )
        }
      >
        <option>INR</option>
        <option>USD</option>
      </select>

      {/* Button */}
      <button
        onClick={submit}
        disabled={status === 'PROCESSING'}
        className={`p-2 text-white rounded transition w-full
        ${
          status === 'PROCESSING'
            ? 'bg-green-300 cursor-not-allowed opacity-60'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {status === 'PROCESSING'
          ? 'Processing...'
          : 'Pay'}
      </button>
    </div>
  );
}