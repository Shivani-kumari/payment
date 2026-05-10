import { NextResponse } from 'next/server';

export async function POST() {
  const r = Math.random();

  if (r < 0.6) {
    return NextResponse.json({ status: 'success' });
  }

  if (r < 0.85) {
    return NextResponse.json({
      status: 'failed',
      reason: 'Insufficient funds',
    });
  }

  await new Promise((res) => setTimeout(res, 8000));
  return NextResponse.json({ status: 'timeout' });
}