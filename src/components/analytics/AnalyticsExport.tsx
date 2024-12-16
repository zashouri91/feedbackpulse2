import React from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAnalytics } from '../../hooks/useAnalytics';

interface AnalyticsExportProps {
  filters: {
    startDate?: Date;
    endDate?: Date;
    groupId?: string;
    locationId?: string;
  };
}

export function AnalyticsExport({ filters }: AnalyticsExportProps) {
  const [isExporting, setIsExporting] = React.useState(false);
  const { exportData } = useAnalytics(filters);

  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    try {
      const data = await exportData(format);
      const blob = new Blob([data], {
        type: format === 'csv' ? 'text/csv' : 'application/pdf',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback-analytics.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => handleExport('csv')} disabled={isExporting}>
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
      <Button variant="outline" onClick={() => handleExport('pdf')} disabled={isExporting}>
        <FileText className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
    </div>
  );
}
