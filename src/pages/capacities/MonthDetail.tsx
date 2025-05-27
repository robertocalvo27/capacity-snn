import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Eye, Calendar, ClipboardCheck, Users, Sliders, BarChart3, FileCheck, BarChart2 } from 'lucide-react';

const mockVSTs = [
  {
    id: 'roadster',
    name: 'Roadster',
    produccion: 19123,
    meta: 20296,
    eficiencia: 117.68,
    detalles: 'Eficiencia Real',
    estado: 'Activo'
  },
  {
    id: 'sports-medicine',
    name: 'Sports Medicine',
    produccion: 87442,
    meta: 100518,
    eficiencia: 121.39,
    detalles: 'Eficiencia META Vol/MIX',
    estado: 'Activo'
  },
  {
    id: 'wound',
    name: 'Wound',
    produccion: 19922,
    meta: 25503,
    eficiencia: 106.98,
    detalles: 'Eficiencia REAL VOL/MIX',
    estado: 'Pendiente'
  },
];

// Estado de revisión de los inputs
const inputReviewStatus = {
  buildPlan: { complete: true, date: '2024-01-15' },
  headcount: { complete: true, date: '2024-01-16' },
  runRates: { complete: false, date: null },
  yield: { complete: true, date: '2024-01-16' },
  downtimes: { complete: false, date: null }
};

export default function CapacityMonthDetail() {
  const { cbpId } = useParams();
  const [expanded, setExpanded] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="space-y-6 p-8">
      {/* Header mejorado al estilo de index.tsx */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart2 className="w-7 h-7 text-blue-600 mr-2" />
              Detalle del CBP mensual ({cbpId})
            </h1>
            <p className="text-gray-500">Revisión y gestión de los inputs y capacidades del CBP</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Nueva Card de Input Review */}
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex justify-between items-center p-6 cursor-pointer" onClick={() => setExpanded(expanded === 'input-review' ? null : 'input-review')}>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Input Review</h3>
              <p className="text-sm text-gray-500">Revisión de los inputs necesarios para el modelo de capacidad</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  Estado: <span className={`font-semibold ${Object.values(inputReviewStatus).every(item => item.complete) ? 'text-green-600' : 'text-amber-600'}`}>
                    {Object.values(inputReviewStatus).every(item => item.complete) ? 'Completo' : 'En Proceso'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  3/5 inputs completados
                </div>
              </div>
              {expanded === 'input-review' ? (
                <ChevronUp className="w-6 h-6 text-gray-500" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-500" />
              )}
            </div>
          </div>
          {expanded === 'input-review' && (
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Inputs del Modelo de Capacidad</h4>
                <p className="text-sm text-gray-700 mb-4">
                  Estos son los insumos necesarios para calcular el modelo de capacidad correctamente. Todos los inputs deben ser revisados y aprobados antes de proceder con la distribución por VST.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className={`p-4 rounded-lg border ${inputReviewStatus.buildPlan.complete ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${inputReviewStatus.buildPlan.complete ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        <ClipboardCheck className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <h5 className="font-medium text-gray-900">Build Plan</h5>
                        <p className="text-sm text-gray-500">Demanda proyectada de productos</p>
                        {inputReviewStatus.buildPlan.complete ? (
                          <span className="text-xs text-green-600">Completado: {inputReviewStatus.buildPlan.date}</span>
                        ) : (
                          <button className="mt-1 text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Cargar Build Plan
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${inputReviewStatus.headcount.complete ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${inputReviewStatus.headcount.complete ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <h5 className="font-medium text-gray-900">Headcount</h5>
                        <p className="text-sm text-gray-500">Personal disponible por línea</p>
                        {inputReviewStatus.headcount.complete ? (
                          <span className="text-xs text-green-600">Completado: {inputReviewStatus.headcount.date}</span>
                        ) : (
                          <button className="mt-1 text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Cargar Headcount
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${inputReviewStatus.runRates.complete ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${inputReviewStatus.runRates.complete ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Sliders className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <h5 className="font-medium text-gray-900">Run Rates</h5>
                        <p className="text-sm text-gray-500">Velocidad por producto/línea</p>
                        {inputReviewStatus.runRates.complete ? (
                          <span className="text-xs text-green-600">Completado: {inputReviewStatus.runRates.date}</span>
                        ) : (
                          <button className="mt-1 text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Cargar Run Rates
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${inputReviewStatus.yield.complete ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${inputReviewStatus.yield.complete ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <h5 className="font-medium text-gray-900">Yield</h5>
                        <p className="text-sm text-gray-500">Rendimiento por producto</p>
                        {inputReviewStatus.yield.complete ? (
                          <span className="text-xs text-green-600">Completado: {inputReviewStatus.yield.date}</span>
                        ) : (
                          <button className="mt-1 text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Cargar Yield
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${inputReviewStatus.downtimes.complete ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${inputReviewStatus.downtimes.complete ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <h5 className="font-medium text-gray-900">Downtimes</h5>
                        <p className="text-sm text-gray-500">Paros programados y festivos</p>
                        {inputReviewStatus.downtimes.complete ? (
                          <span className="text-xs text-green-600">Completado: {inputReviewStatus.downtimes.date}</span>
                        ) : (
                          <button className="mt-1 text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Cargar Downtimes
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => navigate(`/capacities/input-review/${cbpId}`)}
                  >
                    Gestionar Inputs
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Cards de Value Streams - Cambiado para mostrar estado en lugar de unidades */}
        {mockVSTs.map((vst) => (
          <div key={vst.id} className="bg-white rounded-lg shadow-lg border-l-4 border-green-500">
            <div className="flex justify-between items-center p-6 cursor-pointer" onClick={() => setExpanded(expanded === vst.id ? null : vst.id)}>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{vst.name}</h3>
                <p className="text-sm text-gray-500">{vst.detalles}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    Estado: <span className={`font-semibold ${vst.estado === 'Activo' ? 'text-green-600' : 'text-amber-600'}`}>
                      {vst.estado}
                    </span>
                  </div>
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
                    <p className="text-sm text-gray-700 mb-2">Value Stream <span className="font-semibold">{vst.name}</span></p>
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Producción:</span> {vst.produccion.toLocaleString()} / {vst.meta.toLocaleString()} unidades
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {vst.id === 'roadster' && (
                      <button
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        onClick={() => navigate(`/capacities/${cbpId}/${vst.id}/usage`)}
                      >
                        <span className="w-5 h-5 mr-2">🔧</span> Usage
                      </button>
                    )}
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={() => navigate(`/capacities/${cbpId}/${vst.id}`)}>
                      <Calendar className="w-5 h-5 mr-2" /> Ver Calendario
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 