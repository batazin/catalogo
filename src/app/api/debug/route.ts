import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rawDbUrl = process.env.DATABASE_URL || 'Missing';
  const debugInfo = {
    length: rawDbUrl.length,
    startsWith: rawDbUrl.substring(0, 15),
    protocol: rawDbUrl.includes(':') ? rawDbUrl.split(':')[0] : 'no-colon',
    firstChar: rawDbUrl.length > 0 ? rawDbUrl.charCodeAt(0) : 'none',
    nodeEnv: process.env.NODE_ENV,
  };

  try {
    const count = await prisma.gift.count();
    return NextResponse.json({
      status: 'success',
      count,
      debug: debugInfo
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      debug: debugInfo,
    }, { status: 500 });
  }
}
