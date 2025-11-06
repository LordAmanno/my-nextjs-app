import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { contentQueries } from '@/lib/database';

// GET - Fetch current website content
export async function GET() {
  try {
    const content = contentQueries.getLatest();

    if (!content) {
      return NextResponse.json(
        { message: 'No content found' },
        { status: 404 }
      );
    }

    // Parse the JSON content string
    const parsedContent = JSON.parse(content.content);
    return NextResponse.json({
      ...parsedContent,
      layoutType: content.layout_type,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { message: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// POST - Update website content (requires authentication)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const layoutType = body.layoutType || 'classic';

    // Remove layoutType from body before storing
    const { layoutType: _, ...contentData } = body;

    // Store content as JSON string
    contentQueries.upsert(layoutType, JSON.stringify(contentData));

    return NextResponse.json({
      message: 'Content updated successfully',
      layoutType,
      ...contentData
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { message: 'Failed to update content' },
      { status: 500 }
    );
  }
}

