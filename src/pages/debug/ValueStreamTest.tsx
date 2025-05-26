import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

// Definir la interfaz según la estructura de la tabla
interface ValueStream {
  id: string;
  name: string;
  description: string;
}

export default function ValueStreamDebugPage() {
  const [data, setData] = useState<ValueStream[] | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchValueStreams() {
      try {
        console.log('Fetching value streams...');
        setLoading(true);
        
        const { data, error } = await supabase
          .from('value_streams')
          .select('id, name, description')
          .order('name');

        if (error) throw error;
        
        console.log('Value streams data:', data);
        setData(data);
      } catch (err) {
        console.error('Error fetching value streams:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchValueStreams();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Loading Value Streams...</h1>
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
      <h1 className="text-xl font-bold mb-4">Value Streams Debug Page</h1>
      
      {data && data.length > 0 ? (
        <div className="grid gap-4">
          {data.map((stream) => (
            <div key={stream.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">{stream.name}</h2>
              <p className="text-gray-600">{stream.description}</p>
              <p className="text-sm text-gray-500">ID: {stream.id}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No value streams found</p>
      )}
    </div>
  );
} 