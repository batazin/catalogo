import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const count = await prisma.gift.count();
    const dbUrl = process.env.DATABASE_URL ? (process.env.DATABASE_URL.split('@')[1] || 'URL exists but no @') : 'Missing';
    
    return NextResponse.json({
      status: 'success',
      count,
      dbHost: dbUrl,
      nodeEnv: process.env.NODE_ENV,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
