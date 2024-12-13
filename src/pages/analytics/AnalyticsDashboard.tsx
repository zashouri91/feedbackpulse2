import React, { useState } from 'react';
import { Settings, Share, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { DashboardStats } from '../../components/analytics/DashboardStats';
import { ResponseChart } from '../../components/analytics/ResponseChart';
import { RatingDistribution } from '../../components/analytics/RatingDistribution';
import { CommonReasons } from '../../components/analytics/CommonReasons';
import { AnalyticsFilters } from '../../components/analytics/AnalyticsFilters';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAnalytics } from '../../hooks/useAnalytics';
import { usePermissions } from '../../hooks/usePermissions';

export default function AnalyticsDashboard() {
  const [filters, setFilters] = useState({
    startDate: undefined,
    endDate: undefined,
    groupId: undefined,
    locationId: undefined
  });

  const { stats, isLoading } = useAnalytics(filters);
  const { hasPermission } = usePermissions();

  const canViewDetailed = hasPermission('analytics.view.detailed');
  const canViewFinancial = hasPermission('analytics.view.financial');
  const canCustomize = hasPermission('analytics.customize');
  const canShare = hasPermission('analytics.share');
  const canExport = hasPermission('analytics.export');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <div className="flex items-center gap-4">
          {canExport && (
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          )}
          
          {canCustomize && (
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Customize Dashboard
            </Button>
          )}
          
          {canShare && (
            <Button variant="outline">
              <Share className="h-4 w-4 mr-2" />
              Share Report
            </Button>
          )}
        </div>
      </div>

      <AnalyticsFilters
        filters={filters}
        onChange={setFilters}
      />

      <DashboardStats 
        stats={stats}
        showFinancial={canViewFinancial}
      />

      {canViewDetailed && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <ResponseChart data={stats.recentTrend} type="rating" />
            <ResponseChart data={stats.recentTrend} type="responses" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <RatingDistribution distribution={stats.ratingDistribution} />
            <CommonReasons reasons={stats.commonReasons} />
          </div>
        </>
      )}
    </div>
  );
}