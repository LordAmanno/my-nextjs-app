import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { visitQueries } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get total page views
    const totalViews = visitQueries.countLast30Days();

    // Get unique visitors (unique session IDs)
    const uniqueVisitors = visitQueries.uniqueVisitorsLast30Days();

    // Get today's stats
    const todayViews = visitQueries.countToday();

    // Get top pages
    const topPages = visitQueries.topPages();

    // Get daily views for the last 7 days
    const dailyViews = visitQueries.dailyViewsLast7Days();

    // Get device types (simplified based on user agent)
    const visits = visitQueries.allLast30Days();

    const deviceTypes = {
      desktop: 0,
      mobile: 0,
      tablet: 0,
    };

    visits.forEach((visit) => {
      const ua = (visit.user_agent || '').toLowerCase();
      if (ua.includes('mobile')) {
        deviceTypes.mobile++;
      } else if (ua.includes('tablet') || ua.includes('ipad')) {
        deviceTypes.tablet++;
      } else {
        deviceTypes.desktop++;
      }
    });

    return NextResponse.json({
      totalViews,
      uniqueVisitors,
      todayViews,
      topPages,
      dailyViews,
      deviceTypes,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { message: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

