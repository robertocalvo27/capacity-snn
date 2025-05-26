import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Shift {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export default function ShiftDebugPage() {
  const [data, setData] = useState<Shift[] | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShifts() {
      try {
        console.log('Fetching shifts...');
        setLoading(true);
        
        const { data, error } = await supabase
          .from('shifts')
          .select(`
            id,
            name,
            start_time,
            end_time,
            created_at,
            updated_at
          `)
          .order('start_time');

        if (error) throw error;
        
        console.log('Shifts data:', data);
        setData(data);
      } catch (err) {
        console.error('Error fetching shifts:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchShifts();
  }, []);

  const formatTime = (time: string) => {
    // Convertir "14:30:00" a "14:30"
    return time.substring(0, 5);
  };

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Loading Shifts...</h1>
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
      <h1 className="text-xl font-bold mb-4">Shifts Debug Page</h1>
      
      {data && data.length > 0 ? (
        <div className="grid gap-4">
          {data.map((shift) => (
            <div key={shift.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">{shift.name}</h2>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-500">
                  Hours: {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                </p>
                <p className="text-sm text-gray-500">ID: {shift.id}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(shift.created_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Last Update: {new Date(shift.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No shifts found</p>
      )}
    </div>
  );
} 