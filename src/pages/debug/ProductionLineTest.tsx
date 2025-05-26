import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ProductionLine {
  id: string;
  name: string;
  value_stream_id: string;
  is_active: boolean;
  value_streams?: {
    name: string;
  };
}

export default function ProductionLineDebugPage() {
  const [data, setData] = useState<ProductionLine[] | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductionLines() {
      try {
        console.log('Fetching production lines...');
        setLoading(true);
        
        const { data, error } = await supabase
          .from('production_lines')
          .select(`
            id,
            name,
            value_stream_id,
            is_active,
            value_streams (
              name
            )
          `)
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        
        console.log('Production lines data:', data);
        setData(data);
      } catch (err) {
        console.error('Error fetching production lines:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProductionLines();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Loading Production Lines...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4 text-red-600">Error</h1>
        <pre className="bg-red-50 p-4 rounded text-red-600">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Production Lines Debug Page</h1>
      
      {data && data.length > 0 ? (
        <div className="grid gap-4">
          {data.map((line) => (
            <div key={line.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">{line.name}</h2>
              <p className="text-sm text-gray-500">ID: {line.id}</p>
              <p className="text-sm text-gray-500">
                Value Stream: {line.value_streams?.name}
              </p>
              <p className="text-sm text-gray-500">
                Status: {line.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No production lines found</p>
      )}
    </div>
  );
} 