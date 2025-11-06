import { NextRequest, NextResponse } from 'next/server';
import { visitQueries } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, sessionId } = body;

    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || undefined;
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;

    const finalSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    visitQueries.create(finalSessionId, page, userAgent, referrer, ipAddress);

    return NextResponse.json({ success: true, sessionId: finalSessionId });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json(
      { message: 'Failed to track visit' },
      { status: 500 }
    );
  }
}

