import { useEffect, useState } from 'react';
import { partNumberService } from '@/services/partNumberService';

export default function PartNumberDebugPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [partNumbers, setPartNumbers] = useState([]);
  const [selectedPart, setSelectedPart] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        console.log('Fetching part numbers...');
        const parts = await partNumberService.getAll();
        console.log('Part numbers data:', parts);
        setPartNumbers(parts);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handlePartClick = async (code: string) => {
    try {
      setLoading(true);
      console.log('Fetching run rates for part:', code);
      const partData = await partNumberService.getRunRatesByCode(code);
      console.log('Part run rates data:', partData);
      setSelectedPart(partData);
    } catch (err) {
      console.error('Error fetching run rates:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Part Numbers Debug Page</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Part Numbers</h2>
          {partNumbers.map((part: any) => (
            <div 
              key={part.code} 
              className="border p-4 mb-2 rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handlePartClick(part.code)}
            >
              <div className="font-medium">{part.code}</div>
              <div className="text-sm text-gray-600">{part.description}</div>
            </div>
          ))}
        </div>

        {selectedPart && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Run Rates for {selectedPart.code}</h2>
            {selectedPart.run_rates?.map((rate: any) => (
              <div key={rate.id} className="border p-4 mb-2 rounded">
                <div className="text-sm text-gray-600">
                  Rate: {rate.rate} units/hour
                </div>
                {rate.description && (
                  <div className="text-sm text-gray-500">{rate.description}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 