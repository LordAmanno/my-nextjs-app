import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { blockQueries } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { blocks } = body;

    if (!blocks || !Array.isArray(blocks)) {
      return NextResponse.json(
        { error: 'Invalid request: blocks array required' },
        { status: 400 }
      );
    }

    blockQueries.reorderAll(blocks);

    return NextResponse.json({ 
      success: true, 
      message: 'Blocks reordered successfully' 
    });
  } catch (error) {
    console.error('Error reordering blocks:', error);
    return NextResponse.json({ error: 'Failed to reorder blocks' }, { status: 500 });
  }
}

