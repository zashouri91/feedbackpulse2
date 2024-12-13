import React from 'react';
import { BarChart3, Users, Mail, PieChart } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Responses', value: '1,234', icon: BarChart3, change: '+12.3%' },
    { label: 'Response Rate', value: '28.4%', icon: PieChart, change: '+4.1%' },
    { label: 'Active Users', value: '342', icon: Users, change: '+2.5%' },
    { label: 'Email Signatures', value: '892', icon: Mail, change: '+8.7%' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white overflow-hidden rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Placeholder for charts - we'll add real charts later */}
        <div className="bg-white rounded-lg shadow p-6 min-h-[400px]">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Response Trends</h3>
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Chart coming soon...</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 min-h-[400px]">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Feedback Distribution</h3>
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Chart coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}