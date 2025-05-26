import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ProductionEntry {
  id: string;
  hour: string;
  real_head_count: number;
  additional_hc?: number;
  programmed_stop_id?: string;
  work_order: string;
  part_number_code: string;
  hourly_target: number;
  daily_production: number;
  delta: number;
  downtime?: number;
  created_at: string;
  part_numbers?: {
    code: string;
    description: string;
  };
  production_programmed_stops?: {
    id: string;
    programmed_stop_id: string;
    programmed_stops: {
      name: string;
      duration: number;
    };
  }[];
}

export default function ProductionEntryDebugPage() {
  const [data, setData] = useState<ProductionEntry[] | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductionEntries() {
      try {
        console.log('Fetching production entries...');
        setLoading(true);
        
        const { data, error } = await supabase
          .from('production_entries')
          .select(`
            id,
            hour,
            real_head_count,
            additional_hc,
            work_order,
            part_number_code,
            hourly_target,
            daily_production,
            delta,
            downtime,
            created_at,
            part_numbers (
              code,
              description
            ),
            production_programmed_stops (
              id,
              programmed_stop_id,
              programmed_stops (
                name,
                duration
              )
            )
          `)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;
        
        console.log('Production entries data:', data);
        setData(data);
      } catch (err) {
        console.error('Error fetching production entries:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProductionEntries();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Loading Production Entries...</h1>
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
      <h1 className="text-xl font-bold mb-4">Production Entries Debug Page</h1>
      
      {data && data.length > 0 ? (
        <div className="grid gap-4">
          {data.map((entry) => (
            <div key={entry.id} className="border p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <h2 className="font-semibold">
                  Hour: {entry.hour}
                </h2>
                <span className={`px-2 py-1 rounded text-sm ${
                  entry.delta >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  Delta: {entry.delta}
                </span>
              </div>
              
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Work Order: {entry.work_order}</p>
                  <p className="text-sm text-gray-600">
                    Part: {entry.part_numbers?.code} - {entry.part_numbers?.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    HC: {entry.real_head_count} {entry.additional_hc ? `(+${entry.additional_hc})` : ''}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Target: {entry.hourly_target}</p>
                  <p className="text-sm text-gray-600">Production: {entry.daily_production}</p>
                  {entry.downtime && (
                    <p className="text-sm text-gray-600">Downtime: {entry.downtime} min</p>
                  )}
                </div>
              </div>

              {entry.production_programmed_stops && 
               entry.production_programmed_stops.length > 0 && 
               entry.production_programmed_stops[0]?.programmed_stops && (
                <div className="mt-2 text-sm text-gray-500">
                  Programmed Stop: {entry.production_programmed_stops[0].programmed_stops.name} (
                  {entry.production_programmed_stops[0].programmed_stops.duration} min)
                </div>
              )}

              <div className="mt-2 text-sm text-gray-500">
                Registered: {new Date(entry.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No production entries found</p>
      )}
    </div>
  );
} 