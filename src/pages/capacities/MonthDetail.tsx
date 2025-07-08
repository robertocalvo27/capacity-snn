import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Eye, Calendar, ClipboardCheck, Users, Sliders, BarChart3, FileCheck, BarChart2, Factory, AlertTriangle, Package, Percent, DollarSign } from 'lucide-react';

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
  {
    id: 'ent',
    name: 'ENT',
    produccion: 18450,
    meta: 21300,
    eficiencia: 103.75,
    detalles: 'Eficiencia REAL VOL/MIX',
    estado: 'Pendiente'
  },
  {
    id: 'fixation',
    name: 'Fixation',
    produccion: 22370,
    meta: 24800,
    eficiencia: 105.42,
    detalles: 'Eficiencia REAL VOL/MIX',
    estado: 'Pendiente'
  },
  {
    id: 'venus',
    name: 'Venus',
    produccion: 15280,
    meta: 18100,
    eficiencia: 102.85,
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
  const [expandedVST, setExpandedVST] = useState<string | null>(null);
  const navigate = useNavigate();

  // Calcular estado general de los VSTs
  const activeVSTs = mockVSTs.filter(vst => vst.estado === 'Activo').length;
  const totalVSTs = mockVSTs.length;
  const avgEfficiency = mockVSTs.reduce((sum, vst) => sum + vst.eficiencia, 0) / mockVSTs.length;

  // Determinar color y estado general de VSTs
  const vstsColor = activeVSTs === totalVSTs ? 'bg-green-500' : 'bg-amber-500';
  const vstsStatus = activeVSTs === totalVSTs ? 'Activo' : 'En Proceso';
  const vstsStatusClass = activeVSTs === totalVSTs ? 'text-green-600' : 'text-amber-600';

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
        
        {/* Nuevo grupo de Value Streams */}
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-green-500">
          <div className="flex justify-between items-center p-6 cursor-pointer" onClick={() => setExpanded(expanded === 'value-streams' ? null : 'value-streams')}>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Value Streams</h3>
              <p className="text-sm text-gray-500">Revisión de eficiencia y capacidad por Value Stream</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  Estado: <span className={`font-semibold ${vstsStatusClass}`}>
                    {vstsStatus}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {activeVSTs}/{totalVSTs} VSTs activos
                </div>
                <div className="text-green-700 font-bold">{avgEfficiency.toFixed(2)}% promedio</div>
              </div>
              {expanded === 'value-streams' ? (
                <ChevronUp className="w-6 h-6 text-gray-500" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-500" />
              )}
            </div>
          </div>
          {expanded === 'value-streams' && (
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {mockVSTs.map(vst => (
                    <div
                      key={vst.id}
                      className={`px-3 py-2 rounded-lg flex items-center cursor-pointer ${expandedVST === vst.id ? 'bg-blue-100 border-blue-300 border' : 'bg-gray-100 hover:bg-gray-200'}`}
                      onClick={() => setExpandedVST(expandedVST === vst.id ? null : vst.id)}
                    >
                      <div className={`w-3 h-3 rounded-full mr-2 ${vst.estado === 'Activo' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                      <span className="font-medium">{vst.name}</span>
                      <span className={`ml-2 text-sm ${vst.eficiencia >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                        {vst.eficiencia}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Visualización del VST seleccionado */}
                {expandedVST && (
                  <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
                    {mockVSTs.filter(vst => vst.id === expandedVST).map(vst => (
                      <div key={vst.id}>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{vst.name}</h4>
                            <p className="text-sm text-gray-500">{vst.detalles}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-sm text-gray-500">
                              Estado: <span className={`font-semibold ${vst.estado === 'Activo' ? 'text-green-600' : 'text-amber-600'}`}>
                                {vst.estado}
                              </span>
                            </div>
                            <div className="text-green-700 font-bold">{vst.eficiencia}%</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-50 p-3 rounded border border-gray-200">
                            <div className="text-sm font-medium text-gray-700">Producción</div>
                            <div className="flex justify-between items-baseline">
                              <div className="text-xl font-bold text-blue-600">{vst.produccion.toLocaleString()}</div>
                              <div className="text-sm text-gray-500">de {vst.meta.toLocaleString()} unidades</div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded border border-gray-200">
                            <div className="text-sm font-medium text-gray-700">Eficiencia</div>
                            <div className="flex justify-between items-baseline">
                              <div className={`text-xl font-bold ${vst.eficiencia >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                                {vst.eficiencia}%
                              </div>
                              <div className="text-sm text-gray-500">{vst.detalles}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          {vst.id === 'roadster' && (
                            <button
                              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                              onClick={() => navigate(`/capacities/${cbpId}/${vst.id}/usage`)}
                            >
                              <span className="w-5 h-5 mr-2">🔧</span> Usage
                            </button>
                          )}
                          <button 
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            onClick={() => navigate(`/capacities/${cbpId}/${vst.id}`)}
                          >
                            <Calendar className="w-5 h-5 mr-2" /> Ver Calendario
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!expandedVST && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm text-blue-700">Selecciona un Value Stream para ver sus detalles y opciones</span>
                  </div>
                )}

                <div className="flex justify-between mt-4">
                  <div className="text-sm text-gray-500 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div> Activo
                    <div className="w-3 h-3 rounded-full bg-amber-500 ml-3 mr-1"></div> Pendiente
                  </div>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    onClick={() => navigate(`/capacities/${cbpId}/overview`)}
                  >
                    <Factory className="w-5 h-5 mr-2" /> Ver Todos los VSTs
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Engineering Review */}
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-purple-500">
          <div className="flex justify-between items-center p-6 cursor-pointer" onClick={() => setExpanded(expanded === 'engineering-review' ? null : 'engineering-review')}>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Engineering Review</h3>
              <p className="text-sm text-gray-500">Revisión y validación técnica por Ingeniería</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  Estado: <span className="font-semibold text-amber-600">Pendiente</span>
                </div>
                <div className="text-sm text-gray-500">
                  0/6 VSTs revisados
                </div>
              </div>
              {expanded === 'engineering-review' ? (
                <ChevronUp className="w-6 h-6 text-gray-500" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-500" />
              )}
            </div>
          </div>
          {expanded === 'engineering-review' && (
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Validación por Ingeniería</h4>
                <p className="text-sm text-gray-700 mb-4">
                  El departamento de Ingeniería debe revisar y validar los cálculos de capacidad para cada Value Stream.
                </p>
                
                <div className="flex justify-end mt-4">
                  <button 
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    onClick={() => navigate(`/capacities/engineering/${cbpId}`)}
                  >
                    Gestionar Revisión
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hand Shake */}
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-amber-500">
          <div className="flex justify-between items-center p-6 cursor-pointer" onClick={() => setExpanded(expanded === 'hand-shake' ? null : 'hand-shake')}>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Hand Shake</h3>
              <p className="text-sm text-gray-500">Acuerdo entre Producción y Planeación</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  Estado: <span className="font-semibold text-amber-600">Pendiente</span>
                </div>
                <div className="text-sm text-gray-500">
                  0/2 aprobaciones
                </div>
              </div>
              {expanded === 'hand-shake' ? (
                <ChevronUp className="w-6 h-6 text-gray-500" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-500" />
              )}
            </div>
          </div>
          {expanded === 'hand-shake' && (
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Proceso de Hand Shake</h4>
                <p className="text-sm text-gray-700 mb-4">
                  El proceso de Hand Shake requiere la aprobación del Director de Producción y el Director de Planeación para confirmar el acuerdo sobre los niveles de capacidad.
                </p>
                
                <div className="flex justify-end mt-4">
                  <button 
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                    onClick={() => navigate(`/capacities/handshake/${cbpId}`)}
                  >
                    Iniciar Hand Shake
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CBP Final Summary */}
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-indigo-500">
          <div className="flex justify-between items-center p-6 cursor-pointer" onClick={() => setExpanded(expanded === 'cbp-summary' ? null : 'cbp-summary')}>
            <div>
              <h3 className="text-lg font-medium text-gray-900">CBP Final Summary</h3>
              <p className="text-sm text-gray-500">Resumen ejecutivo del CBP mensual</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  Estado: <span className="font-semibold text-green-600">Disponible</span>
                </div>
                <div className="text-sm text-gray-500">
                  Resumen completo listo
                </div>
              </div>
              {expanded === 'cbp-summary' ? (
                <ChevronUp className="w-6 h-6 text-gray-500" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-500" />
              )}
            </div>
          </div>
          {expanded === 'cbp-summary' && (
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Resumen Ejecutivo</h4>
                <p className="text-sm text-gray-700 mb-4">
                  El resumen ejecutivo del CBP incluye los indicadores clave de capacidad, eficiencia y producción por Value Stream. Visualiza datos de producción, eficiencia y absorción con opciones de análisis detallado.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <h5 className="font-medium text-gray-900">Producción</h5>
                        <p className="text-sm text-gray-500">Unidades por VST y línea</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-green-100 text-green-600">
                        <Percent className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <h5 className="font-medium text-gray-900">Eficiencia</h5>
                        <p className="text-sm text-gray-500">% de cumplimiento</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <h5 className="font-medium text-gray-900">Absorción</h5>
                        <p className="text-sm text-gray-500">Costos absorbidos</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                    onClick={() => navigate(`/capacities/cbp-summary/${cbpId}`)}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Ver Resumen Ejecutivo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 