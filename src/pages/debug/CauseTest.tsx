import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface GeneralCause {
  id: number;
  cause_type_id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  cause_types?: {
    name: string;
    description: string;
  };
}

export default function CauseDebugPage() {
  const [data, setData] = useState<GeneralCause[] | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCauses() {
      try {
        console.log('Fetching general causes...');
        setLoading(true);
        
        const { data, error } = await supabase
          .from('general_causes')
          .select(`
            id,
            cause_type_id,
            name,
            description,
            is_active,
            created_at,
            cause_types (
              name,
              description
            )
          `)
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        
        console.log('General causes data:', data);
        setData(data);
      } catch (err) {
        console.error('Error fetching general causes:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCauses();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Loading General Causes...</h1>
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
      <h1 className="text-xl font-bold mb-4">General Causes Debug Page</h1>
      
      {data && data.length > 0 ? (
        <div className="grid gap-4">
          {data.map((cause) => (
            <div key={cause.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">{cause.name}</h2>
              <p className="text-gray-600">{cause.description}</p>
              <p className="text-sm text-gray-500">ID: {cause.id}</p>
              <p className="text-sm text-gray-500">
                Type: {cause.cause_types?.name}
              </p>
              <p className="text-sm text-gray-500 text-xs">
                Type Description: {cause.cause_types?.description}
              </p>
              <p className="text-sm text-gray-500">
                Status: {cause.is_active ? 'Active' : 'Inactive'}
              </p>
              <p className="text-sm text-gray-500">
                Created: {new Date(cause.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No general causes found</p>
      )}
    </div>
  );
} 