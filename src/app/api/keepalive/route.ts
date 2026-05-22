import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic so it doesn't cache the response
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Uma query super leve que interage com o banco e conta como "atividade"
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
      status: 'ok', 
      message: 'Supabase ping: Atividade registrada com sucesso!' 
    });
  } catch (error: any) {
    console.error('Erro no keepalive do Supabase:', error);
    return NextResponse.json({ 
      status: 'error', 
      details: error.message 
    }, { status: 500 });
  }
}
