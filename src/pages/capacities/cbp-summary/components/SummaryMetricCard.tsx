import React, { ReactNode } from 'react';

interface SummaryMetricCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  status: 'under' | 'over' | 'balanced' | 'info';
  description: string;
}

const SummaryMetricCard: React.FC<SummaryMetricCardProps> = ({
  title,
  value,
  icon,
  status,
  description,
}) => {
  const getBgColor = () => {
    switch (status) {
      case 'under':
        return 'bg-amber-50 border-amber-200';
      case 'over':
        return 'bg-red-50 border-red-200';
      case 'balanced':
        return 'bg-green-50 border-green-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getValueColor = () => {
    switch (status) {
      case 'under':
        return 'text-amber-700';
      case 'over':
        return 'text-red-700';
      case 'balanced':
        return 'text-green-700';
      case 'info':
      default:
        return 'text-blue-700';
    }
  };

  return (
    <div className={`rounded-lg p-4 border ${getBgColor()}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          <p className={`text-2xl font-bold mt-1 ${getValueColor()}`}>{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className="p-2 rounded-full bg-white shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryMetricCard; 