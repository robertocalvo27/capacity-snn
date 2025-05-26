import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Eye, Calendar } from 'lucide-react';

const mockVSTs = [
  {
    id: 'roadster',
    name: 'Roadster',
    produccion: 19123,
    meta: 20296,
    eficiencia: 117.68,
    detalles: 'Eficiencia Real',
  },
  {
    id: 'sports-medicine',
    name: 'Sports Medicine',
    produccion: 87442,
    meta: 100518,
    eficiencia: 121.39,
    detalles: 'Eficiencia META Vol/MIX',
  },
  {
    id: 'wound',
    name: 'Wound',
    produccion: 19922,
    meta: 25503,
    eficiencia: 106.98,
    detalles: 'Eficiencia REAL VOL/MIX',
  },
];

export default function CapacityMonthDetail() {
  const { cbpId } = useParams();
  const [expanded, setExpanded] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="space-y-6 p-8">
      <h2 className="text-2xl font-bold mb-6">Detalle del CBP mensual ({cbpId})</h2>
      <div className="space-y-4">
        {mockVSTs.map((vst) => (
          <div key={vst.id} className="bg-white rounded-lg shadow-lg border-l-4 border-green-500">
            <div className="flex justify-between items-center p-6 cursor-pointer" onClick={() => setExpanded(expanded === vst.id ? null : vst.id)}>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{vst.name}</h3>
                <p className="text-sm text-gray-500">{vst.detalles}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">{vst.produccion.toLocaleString()} / {vst.meta.toLocaleString()} unidades</div>
                  <div className="text-green-700 font-bold">{vst.eficiencia}%</div>
                </div>
                {expanded === vst.id ? (
                  <ChevronUp className="w-6 h-6 text-gray-500" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-500" />
                )}
              </div>
            </div>
            {expanded === vst.id && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-700">Aquí puedes mostrar más detalles, KPIs, gráficos o acciones para el Value Stream <span className="font-semibold">{vst.name}</span>.</p>
                  </div>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => navigate(`/capacities/${cbpId}/${vst.id}`)}>
                    <Calendar className="w-5 h-5 mr-2" /> Ver Calendario
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 