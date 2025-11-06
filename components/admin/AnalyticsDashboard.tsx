'use client';

import { useEffect, useState } from 'react';

interface AnalyticsStats {
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  topPages: Array<{ page: string; views: number }>;
  dailyViews: Array<{ date: string; views: number }>;
  deviceTypes: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No analytics data available</div>
      </div>
    );
  }

  const totalDevices = stats.deviceTypes.desktop + stats.deviceTypes.mobile + stats.deviceTypes.tablet;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          <div className="text-blue-100">Total Views (30 days)</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold">{stats.uniqueVisitors.toLocaleString()}</div>
          <div className="text-green-100">Unique Visitors</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl font-bold">{stats.todayViews.toLocaleString()}</div>
          <div className="text-purple-100">Views Today</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Views Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Views (Last 7 Days)</h3>
          <div className="space-y-2">
            {stats.dailyViews.map((day, index) => {
              const maxViews = Math.max(...stats.dailyViews.map(d => d.views));
              const percentage = (day.views / maxViews) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span className="font-semibold text-gray-900">{day.views}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amber-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Types */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">🖥️ Desktop</span>
                <span className="font-semibold text-gray-900">
                  {stats.deviceTypes.desktop} ({totalDevices > 0 ? Math.round((stats.deviceTypes.desktop / totalDevices) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${totalDevices > 0 ? (stats.deviceTypes.desktop / totalDevices) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">📱 Mobile</span>
                <span className="font-semibold text-gray-900">
                  {stats.deviceTypes.mobile} ({totalDevices > 0 ? Math.round((stats.deviceTypes.mobile / totalDevices) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${totalDevices > 0 ? (stats.deviceTypes.mobile / totalDevices) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">📲 Tablet</span>
                <span className="font-semibold text-gray-900">
                  {stats.deviceTypes.tablet} ({totalDevices > 0 ? Math.round((stats.deviceTypes.tablet / totalDevices) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${totalDevices > 0 ? (stats.deviceTypes.tablet / totalDevices) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Page</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Views</th>
              </tr>
            </thead>
            <tbody>
              {stats.topPages.map((page, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{page.page || '/'}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right font-semibold">
                    {page.views.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

