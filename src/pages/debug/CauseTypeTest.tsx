import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CauseType {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default function CauseTypeDebugPage() {
  const [data, setData] = useState<CauseType[] | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCauseTypes() {
      try {
        console.log('Fetching cause types...');
        setLoading(true);
        
        const { data, error } = await supabase
          .from('cause_types')
          .select(`
            id,
            name,
            description,
            created_at
          `)
          .order('name');

        if (error) throw error;
        
        console.log('Cause types data:', data);
        setData(data);
      } catch (err) {
        console.error('Error fetching cause types:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCauseTypes();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Loading Cause Types...</h1>
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
      <h1 className="text-xl font-bold mb-4">Cause Types Debug Page</h1>
      
      {data && data.length > 0 ? (
        <div className="grid gap-4">
          {data.map((type) => (
            <div key={type.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">{type.name}</h2>
              <p className="text-gray-600">{type.description}</p>
              <p className="text-sm text-gray-500">ID: {type.id}</p>
              <p className="text-sm text-gray-500">
                Created: {new Date(type.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No cause types found</p>
      )}
    </div>
  );
} 