import { useEffect, useState } from 'react';
import { targetAdjustmentService } from '@/services/targetAdjustmentService';

export default function TargetAdjustmentDebugPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [correctionFactors, setCorrectionFactors] = useState([]);
  const [adjustments, setAdjustments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        console.log('Fetching correction factors...');
        const factors = await targetAdjustmentService.getAllCorrectionFactors();
        console.log('Correction factors data:', factors);
        setCorrectionFactors(factors);

        console.log('Fetching target adjustments...');
        const adjustmentsData = await targetAdjustmentService.getAllAdjustments();
        console.log('Target adjustments data:', adjustmentsData);
        setAdjustments(adjustmentsData);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Target Adjustments Debug Page</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Correction Factors</h2>
        {correctionFactors.map((factor: any) => (
          <div key={factor.id} className="border p-4 mb-2 rounded">
            <div className="font-medium">{factor.name}</div>
            <div className="text-sm text-gray-600">Factor: {factor.factor}</div>
            {factor.description && (
              <div className="text-sm text-gray-500">{factor.description}</div>
            )}
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Target Adjustments</h2>
        {adjustments.map((adjustment: any) => (
          <div key={adjustment.id} className="border p-4 mb-2 rounded">
            <div className="font-medium">Line ID: {adjustment.line_id}</div>
            <div className="text-sm text-gray-600">
              Factor ID: {adjustment.correction_factor_id}
            </div>
            <div className="text-sm text-gray-600">Date: {adjustment.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 