import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ProductionCause {
  id: string;
  production_entry_id: string;
  cause_type_id: string;
  general_cause_id: number;
  specific_details: string;
  affected_units: number;
  downtime_minutes: number;
  created_at: string;
  created_by: string;
  general_causes?: {
    name: string;
    description: string;
  };
  cause_types?: {
    name: string;
    description: string;
  };
}

export default function ProductionCauseDebugPage() {
  const [data, setData] = useState<ProductionCause[] | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductionCauses() {
      try {
        console.log('Fetching production causes...');
        setLoading(true);
        
        const { data, error } = await supabase
          .from('production_causes')
          .select(`
            id,
            production_entry_id,
            cause_type_id,
            general_cause_id,
            specific_details,
            affected_units,
            downtime_minutes,
            created_at,
            created_by,
            general_causes (
              name,
              description
            ),
            cause_types (
              name,
              description
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        console.log('Production causes data:', data);
        setData(data);
      } catch (err) {
        console.error('Error fetching production causes:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProductionCauses();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Loading Production Causes...</h1>
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
      <h1 className="text-xl font-bold mb-4">Production Causes Debug Page</h1>
      
      {data && data.length > 0 ? (
        <div className="grid gap-4">
          {data.map((cause) => (
            <div key={cause.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">
                {cause.general_causes?.name || 'Unknown Cause'}
              </h2>
              <p className="text-gray-600">{cause.specific_details}</p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-500">
                  Type: {cause.cause_types?.name}
                </p>
                <p className="text-sm text-gray-500">
                  Affected Units: {cause.affected_units}
                </p>
                <p className="text-sm text-gray-500">
                  Downtime: {cause.downtime_minutes} minutes
                </p>
                <p className="text-sm text-gray-500">
                  Production Entry: {cause.production_entry_id}
                </p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(cause.created_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Created By: {cause.created_by}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No production causes found</p>
      )}
    </div>
  );
} 