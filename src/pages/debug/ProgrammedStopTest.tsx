import { useEffect, useState } from 'react';
import { programmedStopService } from '@/services/programmedStopService';

export default function ProgrammedStopDebugPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [programmedStops, setProgrammedStops] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        console.log('Fetching programmed stops...');
        const stops = await programmedStopService.getAll();
        console.log('Programmed stops data:', stops);
        setProgrammedStops(stops);

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
      <h1 className="text-2xl font-bold mb-4">Programmed Stops Debug Page</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Programmed Stops</h2>
        {programmedStops.map((stop: any) => (
          <div key={stop.id} className="border p-4 mb-2 rounded">
            <div className="font-medium">{stop.name}</div>
            <div className="text-sm text-gray-600">Duration: {stop.duration} min</div>
            {stop.description && (
              <div className="text-sm text-gray-500">{stop.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 