import React, { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: ReactNode;
  description?: string;
  color?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  unit,
  icon,
  description,
  color = 'bg-gray-50 border-gray-200'
}) => {
  return (
    <div className={`p-6 rounded-lg border ${color}`}>
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-base font-medium text-gray-900">{title}</h4>
        <div className="p-2 rounded-full bg-white shadow-sm">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {unit && <div className="ml-2 text-sm text-gray-500">{unit}</div>}
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default SummaryCard; 