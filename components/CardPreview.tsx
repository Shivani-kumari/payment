'use client';

export default function CardPreview({ number, name, expiry }: any) {
  return (
    <div className="p-4 bg-black text-white rounded-xl w-full max-w-sm">
      <div>{number || '**** **** **** ****'}</div>
      <div className="mt-4">{name || 'CARDHOLDER'}</div>
      <div>{expiry || 'MM/YY'}</div>
    </div>
  );
}