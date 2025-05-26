import { useState } from 'react';
import { calculationService } from '@/services/calculationService';

export default function CalculationDebugPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [params, setParams] = useState({
    baseTarget: 50,
    date: new Date().toISOString().split('T')[0],
    shift: 1,
    lineId: '',
    hour: '07:00'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log('Calculating effective target with params:', params);
      const effectiveTarget = await calculationService.getEffectiveTarget(params);
      console.log('Calculation result:', effectiveTarget);
      setResult(effectiveTarget);
    } catch (err) {
      console.error('Error calculating target:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Calculations Debug Page</h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Base Target
            <input
              type="number"
              name="baseTarget"
              value={params.baseTarget}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
            <input
              type="date"
              name="date"
              value={params.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Shift
            <select
              name="shift"
              value={params.shift}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value={1}>Shift 1</option>
              <option value={2}>Shift 2</option>
              <option value={3}>Shift 3</option>
            </select>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Line ID
            <input
              type="text"
              name="lineId"
              value={params.lineId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hour
            <input
              type="time"
              name="hour"
              value={params.hour}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {loading ? 'Calculating...' : 'Calculate Effective Target'}
        </button>
      </form>

      {error && (
        <div className="mt-4 text-red-600">
          Error: {error.message}
        </div>
      )}

      {result !== null && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Result:</h2>
          <div className="text-2xl font-bold text-blue-600">
            {result} units/hour
          </div>
        </div>
      )}
    </div>
  );
} 