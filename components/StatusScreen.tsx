'use client';

export default function StatusScreen({ status, retry, attempts }: any) {
  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold">{status}</h2>

      {status !== 'SUCCESS' && attempts < 3 && (
        <button onClick={retry} className="mt-4 bg-blue-500 text-white p-2">
          Retry ({attempts}/3)
        </button>
      )}

      {attempts >= 3 && <p>Max retries reached</p>}
    </div>
  );
}