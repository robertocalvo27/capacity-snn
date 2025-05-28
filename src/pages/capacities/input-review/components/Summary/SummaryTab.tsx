import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, Clock, TrendingUp, AlertTriangle, Check, Info } from 'lucide-react';
import SummaryCard from './SummaryCard';
import SummaryTable from './SummaryTable';
import SummaryChart from './SummaryChart';

interface SummaryTabProps {
  buildPlanData?: any[];
  headcountData?: any[];
  downtimesData?: any[];
  runRatesData?: any[];
  yieldData?: any[];
  onSave?: () => void;
  cbpId?: string;
}

const SummaryTab: React.FC<SummaryTabProps> = ({
  buildPlanData = [],
  headcountData = [],
  downtimesData = [],
  runRatesData = [],
  yieldData = [],
  onSave,
  cbpId = '24-01'
}) => {
  const [viewType, setViewType] = useState<'overview' | 'details'>('overview');
  const [selectedValueStream, setSelectedValueStream] = useState<string | null>(null);
  
  // Métricas calculadas
  const [metrics, setMetrics] = useState({
    demandHours: 0,
    capacityHours: 0,
    utilizationPercentage: 0,
    utilizationStatus: 'warning', // 'success', 'warning', 'danger'
    detailedMetrics: []
  });

  // Cálculo de métricas basado en los datos de los diferentes tabs
  useEffect(() => {
    calculateMetrics();
  }, [buildPlanData, headcountData, downtimesData, runRatesData, yieldData]);

  const calculateMetrics = () => {
    // Este es un cálculo simulado basado en la descripción proporcionada
    // En un caso real, estos cálculos serían más complejos e integrarían realmente los datos de los diferentes tabs
    
    // Ejemplo: Calcular horas de demanda basado en Build Plan, Yield y Run Rates
    const demandHours = 43.70; // Valor de ejemplo basado en la imagen proporcionada
    
    // Ejemplo: Calcular horas de capacidad basado en Headcount y Downtimes
    const capacityHours = 35.92; // Valor de ejemplo basado en la imagen proporcionada
    
    // Calcular porcentaje de utilización
    const utilizationPercentage = Math.round((demandHours / capacityHours) * 100);
    
    // Determinar estado basado en el porcentaje
    let status = 'warning';
    if (utilizationPercentage >= 85 && utilizationPercentage <= 100) {
      status = 'success';
    } else if (utilizationPercentage > 100) {
      status = 'danger';
    }
    
    // Datos detallados por producto (simulado)
    const detailedMetrics = [
      {
        product: 'A',
        volume: 2200,
        yield: '98%',
        newVolume: 2245,
        lotSize: 7,
        cbp: 8,
        runRate: 120,
        curvaEntren: '95%',
        newRunRate: 114,
        demandHours: 20
      },
      {
        product: 'B',
        volume: 700,
        yield: '95%',
        newVolume: 737,
        lotSize: 2,
        cbp: 3,
        runRate: 105,
        curvaEntren: '100%',
        newRunRate: 105,
        demandHours: 7
      },
      {
        product: 'C',
        volume: 1500,
        yield: '97%',
        newVolume: 1546,
        lotSize: 5,
        cbp: 6,
        runRate: 130,
        curvaEntren: '70%',
        newRunRate: 91,
        demandHours: 17
      }
    ];
    
    setMetrics({
      demandHours,
      capacityHours,
      utilizationPercentage,
      utilizationStatus: status,
      detailedMetrics
    });
  };

  const getUtilizationColorClass = () => {
    switch (metrics.utilizationStatus) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'danger':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Datos para la tabla de downtime (simulado)
  const downtimeTableData = {
    days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    categories: [
      { name: 'Line Clearance', values: [15, 15, 15, 15, 15, 15] },
      { name: 'Tiers', values: [10, 10, 10, 10, 10, 10] },
      { name: 'Degown', values: [2, 2, 2, 2, 2, 2] },
      { name: 'Café', values: [20, 20, 20, 20, 20, 20] },
      { name: 'Gown', values: [3, 3, 3, 3, 3, 3] },
      { name: 'Ergonomicos', values: [5, 5, 5, 5, 5, 5] },
      { name: 'Degown', values: [2, 2, 2, 2, 2, 2] },
      { name: 'Almuerzo', values: [20, 20, 20, 20, 20, 20] },
      { name: 'Gown', values: [3, 3, 3, 3, 3, 3] },
      { name: 'Cambio Orden', values: [15, 15, 15, 15, 15, 15] },
      { name: 'Cierre Turno', values: [10, 10, 10, 10, 10, 10] }
    ],
    totals: {
      minutes: [105, 105, 105, 105, 105, 80],
      hours: [1.75, 1.75, 1.75, 1.75, 1.75, 1.33],
      totalHours: 10.08
    },
    bruttoTime: {
      values: [8.00, 8.00, 8.00, 8.00, 8.00, 6.00],
      total: 46.00
    },
    nettoTime: {
      values: [6.25, 6.25, 6.25, 6.25, 6.25, 4.67],
      total: 35.92
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Summary - Resumen de Capacidad vs Demanda
        </h3>
        <div className="flex space-x-3">
          <button 
            className={`px-3 py-1.5 text-sm rounded-lg ${viewType === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setViewType('overview')}
          >
            Vista General
          </button>
          <button 
            className={`px-3 py-1.5 text-sm rounded-lg ${viewType === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setViewType('details')}
          >
            Detalles
          </button>
          {onSave && (
            <button 
              className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={onSave}
            >
              <Check className="w-4 h-4 mr-2" /> Aprobar
            </button>
          )}
        </div>
      </div>

      {viewType === 'overview' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tarjeta de Demanda */}
            <SummaryCard 
              title="Demanda Total"
              value={`${metrics.demandHours.toFixed(2)}`}
              unit="horas-línea/sem"
              icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
              description="Horas requeridas para cumplir con la demanda planificada"
              color="bg-blue-50 border-blue-200"
            />
            
            {/* Tarjeta de Capacidad */}
            <SummaryCard 
              title="Capacidad Disponible"
              value={`${metrics.capacityHours.toFixed(2)}`}
              unit="horas-línea/sem"
              icon={<Clock className="w-6 h-6 text-green-600" />}
              description="Esta capacidad es con un Turno"
              color="bg-green-50 border-green-200"
            />
            
            {/* Tarjeta de Utilización */}
            <SummaryCard 
              title="Porcentaje de Utilización"
              value={`${metrics.utilizationPercentage}%`}
              icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
              description="Este es el valor final de utilización que se muestra en las metas"
              color={getUtilizationColorClass()}
            />
          </div>
          
          {/* Cuadro de rangos de utilización */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Rangos de Utilización</h4>
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1 rounded bg-red-100 text-red-800 text-sm">0%-84% (Subutilizado)</div>
              <div className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 text-sm">85%-91% (Aceptable)</div>
              <div className="px-3 py-1 rounded bg-green-100 text-green-800 text-sm">92%-95% (Óptimo)</div>
              <div className="px-3 py-1 rounded bg-blue-100 text-blue-800 text-sm">96%-100% (Excelente)</div>
              <div className="px-3 py-1 rounded bg-red-100 text-red-800 text-sm">&gt;101% (Sobrecarga)</div>
            </div>
          </div>
          
          {/* Gráfico comparativo */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-base font-medium text-gray-900 mb-4">Comparación Demanda vs Capacidad</h4>
            <div className="h-64">
              <SummaryChart 
                demandHours={metrics.demandHours}
                capacityHours={metrics.capacityHours}
                utilizationPercentage={metrics.utilizationPercentage}
              />
            </div>
          </div>
          
          {/* Alertas o notas */}
          {metrics.utilizationPercentage > 100 && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg flex items-start">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Alerta: Sobrecarga de capacidad</h4>
                <p className="text-sm text-red-700 mt-1">
                  La demanda actual excede la capacidad disponible. Se recomienda evaluar opciones como tiempo extra, 
                  contrataciones adicionales o ajustes en la programación.
                </p>
              </div>
            </div>
          )}
          
          {metrics.utilizationPercentage < 85 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg flex items-start">
              <Info className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Aviso: Capacidad subutilizada</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  La capacidad actual es significativamente mayor que la demanda. Se recomienda revisar 
                  la asignación de recursos o explorar oportunidades para incrementar la producción.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Vista detallada - Tabla de condiciones de demanda */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-base font-medium text-gray-900 mb-4">PARTE 2. DEMAND CONDITIONS</h4>
            <p className="text-sm text-gray-600 mb-4">
              La estimación de la demanda proviene primero del Volumen de unidades para cada uno de los productos, 
              se realizan los ajustes respectivos con el Yield para Volumen Neto y luego del Run Rate.
            </p>
            <SummaryTable 
              data={metrics.detailedMetrics} 
              type="demand"
            />
          </div>
          
          {/* Vista detallada - Tabla de capacidad */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-base font-medium text-gray-900 mb-4">PARTE 3. CAPACITY</h4>
            <p className="text-sm text-gray-600 mb-4">
              La capacidad tiene que ver con las condiciones que presenta la planta para atender las 
              necesidades de la producción, no en términos de unidades, sino en términos del tiempo.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                      Paros Programados
                    </th>
                    {downtimeTableData.days.map((day, index) => (
                      <th key={index} className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
                        Día {index + 1}<br/>{day}
                      </th>
                    ))}
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {downtimeTableData.categories.map((category, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 text-sm text-gray-900 border">{category.name}</td>
                      {category.values.map((value, idx) => (
                        <td key={idx} className="px-4 py-2 text-sm text-gray-500 text-center border">{value}</td>
                      ))}
                      <td className="px-4 py-2 text-sm text-gray-500 text-center border font-medium">
                        {category.values.reduce((a, b) => a + b, 0)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100">
                    <td className="px-4 py-2 text-sm text-gray-900 font-medium border">Total (min)</td>
                    {downtimeTableData.totals.minutes.map((value, idx) => (
                      <td key={idx} className="px-4 py-2 text-sm text-gray-900 text-center border font-medium">{value}</td>
                    ))}
                    <td className="px-4 py-2 text-sm text-gray-900 text-center border font-medium">
                      {downtimeTableData.totals.minutes.reduce((a, b) => a + b, 0)}
                    </td>
                  </tr>
                  <tr className="bg-red-100">
                    <td className="px-4 py-2 text-sm text-red-700 font-medium border">Total (hrs)</td>
                    {downtimeTableData.totals.hours.map((value, idx) => (
                      <td key={idx} className="px-4 py-2 text-sm text-red-700 text-center border font-medium">{value.toFixed(2)}</td>
                    ))}
                    <td className="px-4 py-2 text-sm text-red-700 text-center border font-medium">
                      {downtimeTableData.totals.totalHours.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={downtimeTableData.days.length + 2} className="px-4 py-2 border"></td>
                  </tr>
                  <tr className="bg-blue-100">
                    <td className="px-4 py-2 text-sm text-blue-700 font-medium border">Tiempo Bruto</td>
                    {downtimeTableData.bruttoTime.values.map((value, idx) => (
                      <td key={idx} className="px-4 py-2 text-sm text-blue-700 text-center border font-medium">{value.toFixed(2)}</td>
                    ))}
                    <td className="px-4 py-2 text-sm text-blue-700 text-center border font-medium">
                      {downtimeTableData.bruttoTime.total.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="bg-green-100">
                    <td className="px-4 py-2 text-sm text-green-700 font-medium border">Tiempo Neto</td>
                    {downtimeTableData.nettoTime.values.map((value, idx) => (
                      <td key={idx} className="px-4 py-2 text-sm text-green-700 text-center border font-medium">{value.toFixed(2)}</td>
                    ))}
                    <td className="px-4 py-2 text-sm text-green-700 text-center border font-medium">
                      {downtimeTableData.nettoTime.total.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Resumen final */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-base font-medium text-gray-900 mb-4">PARTE 1. RESUMEN</h4>
            <div className="grid grid-cols-2 gap-4 max-w-xl">
              <div className="text-sm text-gray-700">Demanda (hrs-línea/sem)</div>
              <div className="text-sm font-medium bg-purple-100 px-4 py-1 text-center">{metrics.demandHours.toFixed(2)}</div>
              
              <div className="text-sm text-gray-700">Capacidad (hrs-línea/sem)</div>
              <div className="text-sm font-medium bg-green-100 px-4 py-1 text-center flex items-center justify-between">
                {metrics.capacityHours.toFixed(2)}
                <span className="text-xs text-gray-500">Esta capacidad es con un Turno!</span>
              </div>
              
              <div className="text-sm text-gray-700">% Utilización</div>
              <div className="text-sm font-medium px-4 py-1">{metrics.utilizationPercentage}%</div>
              
              <div className="col-span-2 text-xs text-gray-500 italic">
                Este es el valor final de utilización que se muestra en las metas.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryTab; 