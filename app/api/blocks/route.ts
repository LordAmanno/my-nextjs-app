import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { blockQueries } from '@/lib/database';

export async function GET() {
  try {
    const blocks = blockQueries.getAll();
    
    const formattedBlocks = blocks.map(block => ({
      id: block.id,
      block_type: block.block_type,
      block_order: block.block_order,
      content: JSON.parse(block.content),
      styles: JSON.parse(block.styles),
      created_at: block.created_at,
      updated_at: block.updated_at,
    }));

    return NextResponse.json(formattedBlocks);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    return NextResponse.json({ error: 'Failed to fetch blocks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { block_type, block_order, content, styles } = body;

    if (!block_type || block_order === undefined || !content || !styles) {
      return NextResponse.json(
        { error: 'Missing required fields: block_type, block_order, content, styles' },
        { status: 400 }
      );
    }

    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    const stylesStr = typeof styles === 'string' ? styles : JSON.stringify(styles);

    const newBlockId = blockQueries.create(block_type, block_order, contentStr, stylesStr);

    return NextResponse.json({ 
      success: true, 
      id: newBlockId,
      message: 'Block created successfully' 
    });
  } catch (error) {
    console.error('Error creating block:', error);
    return NextResponse.json({ error: 'Failed to create block' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, content, styles } = body;

    if (!id || !content || !styles) {
      return NextResponse.json(
        { error: 'Missing required fields: id, content, styles' },
        { status: 400 }
      );
    }

    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    const stylesStr = typeof styles === 'string' ? styles : JSON.stringify(styles);

    blockQueries.update(id, contentStr, stylesStr);

    return NextResponse.json({ 
      success: true, 
      message: 'Block updated successfully' 
    });
  } catch (error) {
    console.error('Error updating block:', error);
    return NextResponse.json({ error: 'Failed to update block' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing block ID' }, { status: 400 });
    }

    blockQueries.delete(parseInt(id));

    return NextResponse.json({ 
      success: true, 
      message: 'Block deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting block:', error);
    return NextResponse.json({ error: 'Failed to delete block' }, { status: 500 });
  }
}

