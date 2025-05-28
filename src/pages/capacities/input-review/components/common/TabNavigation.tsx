import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';

interface StatusItem {
  complete: boolean;
  date: string | null;
}

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  status: Record<string, StatusItem>;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  setActiveTab, 
  status 
}) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px overflow-x-auto">
        <button
          className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'buildPlan' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('buildPlan')}
        >
          Build Plan
          {status.buildPlan.complete && <Check className="inline-block w-4 h-4 ml-1 text-green-500" />}
        </button>
        <button
          className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'headcount' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('headcount')}
        >
          Headcount
          {status.headcount.complete && <Check className="inline-block w-4 h-4 ml-1 text-green-500" />}
        </button>
        <button
          className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'runRates' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('runRates')}
        >
          Run Rates
          {!status.runRates.complete && <AlertTriangle className="inline-block w-4 h-4 ml-1 text-amber-500" />}
          {status.runRates.complete && <Check className="inline-block w-4 h-4 ml-1 text-green-500" />}
        </button>
        <button
          className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'yield' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('yield')}
        >
          Yield
          {status.yield.complete && <Check className="inline-block w-4 h-4 ml-1 text-green-500" />}
        </button>
        <button
          className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'downtimes' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('downtimes')}
        >
          Downtimes
          {!status.downtimes.complete && <AlertTriangle className="inline-block w-4 h-4 ml-1 text-amber-500" />}
          {status.downtimes.complete && <Check className="inline-block w-4 h-4 ml-1 text-green-500" />}
        </button>
      </nav>
    </div>
  );
};

export default TabNavigation; 