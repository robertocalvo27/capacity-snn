import React, { useState } from 'react';
import { Filter, Download, BarChart2, Plus, Copy, Trash2, Save, Info, ChevronUp, ChevronDown } from 'lucide-react';
import usageMock from './usageMock.ts';
import { useParams } from 'react-router-dom';

// Definir interfaces para los tipos de datos
interface WeeklyData {
  woi: number;
  wk14: number;
  wk15: number;
  wk16: number;
  wk17: number;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  targetUtilization: number;
  weeklyValues: {
    [productId: string]: WeeklyData;
  };
  woiProjection?: {
    [productId: string]: number[];
  };
  utilizationRates: {
    wk14: number;
    wk15: number;
    wk16: number;
    wk17: number;
  };
}

// Datos mock para estadísticas de producción
const productionStatsMock: ProductionStatsType = {
  '4391': {
    daily: {
      dates: ['2025-05-22', '2025-05-23', '2025-05-24', '2025-05-25', '2025-05-26', '2025-05-27', '2025-05-28'],
      efficiency: [94, 98, 102, 105, 98, 118, 121],
      target: [100, 100, 100, 100, 100, 100, 100],
      production: { actual: 950, target: 1000 },
      downtime: 1.8,
    },
    weekly: {
      dates: ['Sem 18', 'Sem 19', 'Sem 20', 'Sem 21', 'Sem 22'],
      efficiency: [98, 101, 104, 105, 110],
      target: [100, 100, 100, 100, 100],
      production: { actual: 4800, target: 5000 },
      downtime: 8.5,
    },
    twoWeeks: {
      dates: ['Sem 17-18', 'Sem 19-20', 'Sem 21-22', 'Sem 23-24'],
      efficiency: [99, 102, 107, 112],
      target: [100, 100, 100, 100],
      production: { actual: 9600, target: 10000 },
      downtime: 16.2,
    },
    threeWeeks: {
      dates: ['Sem 16-18', 'Sem 19-21', 'Sem 22-24'],
      efficiency: [100, 104, 110],
      target: [100, 100, 100],
      production: { actual: 14500, target: 15000 },
      downtime: 24.5,
    },
    month: {
      dates: ['Feb', 'Mar', 'Abr', 'May'],
      efficiency: [97, 101, 105, 109],
      target: [100, 100, 100, 100],
      production: { actual: 19200, target: 20000 },
      downtime: 32.6,
    }
  },
  '4230': {
    daily: {
      dates: ['2025-05-22', '2025-05-23', '2025-05-24', '2025-05-25', '2025-05-26', '2025-05-27', '2025-05-28'],
      efficiency: [88, 93, 95, 92, 97, 99, 101],
      target: [100, 100, 100, 100, 100, 100, 100],
      production: { actual: 780, target: 800 },
      downtime: 2.4,
    },
    weekly: {
      dates: ['Sem 18', 'Sem 19', 'Sem 20', 'Sem 21', 'Sem 22'],
      efficiency: [91, 94, 96, 98, 99],
      target: [100, 100, 100, 100, 100],
      production: { actual: 3900, target: 4000 },
      downtime: 10.2,
    },
    twoWeeks: {
      dates: ['Sem 17-18', 'Sem 19-20', 'Sem 21-22', 'Sem 23-24'],
      efficiency: [90, 95, 97, 99],
      target: [100, 100, 100, 100],
      production: { actual: 7800, target: 8000 },
      downtime: 20.5,
    },
    threeWeeks: {
      dates: ['Sem 16-18', 'Sem 19-21', 'Sem 22-24'],
      efficiency: [89, 96, 98],
      target: [100, 100, 100],
      production: { actual: 11700, target: 12000 },
      downtime: 31.0,
    },
    month: {
      dates: ['Feb', 'Mar', 'Abr', 'May'],
      efficiency: [88, 92, 97, 98],
      target: [100, 100, 100, 100],
      production: { actual: 15600, target: 16000 },
      downtime: 41.3,
    }
  },
  '4403': {
    daily: {
      dates: ['2025-05-22', '2025-05-23', '2025-05-24', '2025-05-25', '2025-05-26', '2025-05-27', '2025-05-28'],
      efficiency: [110, 115, 112, 108, 117, 120, 118],
      target: [100, 100, 100, 100, 100, 100, 100],
      production: { actual: 1300, target: 1200 },
      downtime: 0.9,
    },
    weekly: {
      dates: ['Sem 18', 'Sem 19', 'Sem 20', 'Sem 21', 'Sem 22'],
      efficiency: [108, 112, 115, 117, 118],
      target: [100, 100, 100, 100, 100],
      production: { actual: 6500, target: 6000 },
      downtime: 4.5,
    },
    twoWeeks: {
      dates: ['Sem 17-18', 'Sem 19-20', 'Sem 21-22', 'Sem 23-24'],
      efficiency: [107, 113, 116, 118],
      target: [100, 100, 100, 100],
      production: { actual: 13000, target: 12000 },
      downtime: 9.2,
    },
    threeWeeks: {
      dates: ['Sem 16-18', 'Sem 19-21', 'Sem 22-24'],
      efficiency: [105, 114, 117],
      target: [100, 100, 100],
      production: { actual: 19500, target: 18000 },
      downtime: 13.8,
    },
    month: {
      dates: ['Feb', 'Mar', 'Abr', 'May'],
      efficiency: [103, 108, 114, 117],
      target: [100, 100, 100, 100],
      production: { actual: 26000, target: 24000 },
      downtime: 18.5,
    }
  },
  '2503-S': {
    daily: {
      dates: ['2025-05-22', '2025-05-23', '2025-05-24', '2025-05-25', '2025-05-26', '2025-05-27', '2025-05-28'],
      efficiency: [85, 88, 92, 95, 98, 102, 101],
      target: [100, 100, 100, 100, 100, 100, 100],
      production: { actual: 580, target: 600 },
      downtime: 3.2,
    },
    weekly: {
      dates: ['Sem 18', 'Sem 19', 'Sem 20', 'Sem 21', 'Sem 22'],
      efficiency: [87, 92, 96, 99, 100],
      target: [100, 100, 100, 100, 100],
      production: { actual: 2900, target: 3000 },
      downtime: 12.8,
    },
    twoWeeks: {
      dates: ['Sem 17-18', 'Sem 19-20', 'Sem 21-22', 'Sem 23-24'],
      efficiency: [86, 94, 99, 101],
      target: [100, 100, 100, 100],
      production: { actual: 5800, target: 6000 },
      downtime: 25.5,
    },
    threeWeeks: {
      dates: ['Sem 16-18', 'Sem 19-21', 'Sem 22-24'],
      efficiency: [85, 95, 100],
      target: [100, 100, 100],
      production: { actual: 8700, target: 9000 },
      downtime: 38.2,
    },
    month: {
      dates: ['Feb', 'Mar', 'Abr', 'May'],
      efficiency: [84, 90, 97, 100],
      target: [100, 100, 100, 100],
      production: { actual: 11600, target: 12000 },
      downtime: 51.0,
    }
  },
  '4565D': {
    daily: {
      dates: ['2025-05-22', '2025-05-23', '2025-05-24', '2025-05-25', '2025-05-26', '2025-05-27', '2025-05-28'],
      efficiency: [105, 108, 106, 102, 107, 110, 108],
      target: [100, 100, 100, 100, 100, 100, 100],
      production: { actual: 420, target: 400 },
      downtime: 1.1,
    },
    weekly: {
      dates: ['Sem 18', 'Sem 19', 'Sem 20', 'Sem 21', 'Sem 22'],
      efficiency: [104, 106, 107, 109, 110],
      target: [100, 100, 100, 100, 100],
      production: { actual: 2100, target: 2000 },
      downtime: 5.3,
    },
    twoWeeks: {
      dates: ['Sem 17-18', 'Sem 19-20', 'Sem 21-22', 'Sem 23-24'],
      efficiency: [103, 106, 108, 110],
      target: [100, 100, 100, 100],
      production: { actual: 4200, target: 4000 },
      downtime: 10.8,
    },
    threeWeeks: {
      dates: ['Sem 16-18', 'Sem 19-21', 'Sem 22-24'],
      efficiency: [102, 107, 109],
      target: [100, 100, 100],
      production: { actual: 6300, target: 6000 },
      downtime: 16.2,
    },
    month: {
      dates: ['Feb', 'Mar', 'Abr', 'May'],
      efficiency: [101, 104, 107, 109],
      target: [100, 100, 100, 100],
      production: { actual: 8400, target: 8000 },
      downtime: 21.5,
    }
  },
  '4566D': {
    daily: {
      dates: ['2025-05-22', '2025-05-23', '2025-05-24', '2025-05-25', '2025-05-26', '2025-05-27', '2025-05-28'],
      efficiency: [95, 98, 101, 100, 102, 105, 103],
      target: [100, 100, 100, 100, 100, 100, 100],
      production: { actual: 390, target: 400 },
      downtime: 2.0,
    },
    weekly: {
      dates: ['Sem 18', 'Sem 19', 'Sem 20', 'Sem 21', 'Sem 22'],
      efficiency: [96, 99, 101, 103, 104],
      target: [100, 100, 100, 100, 100],
      production: { actual: 1950, target: 2000 },
      downtime: 7.8,
    },
    twoWeeks: {
      dates: ['Sem 17-18', 'Sem 19-20', 'Sem 21-22', 'Sem 23-24'],
      efficiency: [95, 100, 102, 104],
      target: [100, 100, 100, 100],
      production: { actual: 3900, target: 4000 },
      downtime: 15.5,
    },
    threeWeeks: {
      dates: ['Sem 16-18', 'Sem 19-21', 'Sem 22-24'],
      efficiency: [94, 101, 103],
      target: [100, 100, 100],
      production: { actual: 5850, target: 6000 },
      downtime: 23.2,
    },
    month: {
      dates: ['Feb', 'Mar', 'Abr', 'May'],
      efficiency: [93, 97, 101, 103],
      target: [100, 100, 100, 100],
      production: { actual: 7800, target: 8000 },
      downtime: 31.0,
    }
  }
};

// Interfaz para el tipo de datos de productionStatsMock
interface ProductionStatsType {
  [pn: string]: {
    daily: {
      dates: string[];
      efficiency: number[];
      target: number[];
      production: { actual: number; target: number };
      downtime: number;
    };
    weekly: {
      dates: string[];
      efficiency: number[];
      target: number[];
      production: { actual: number; target: number };
      downtime: number;
    };
    // Datos adicionales para rangos de tiempo más largos
    twoWeeks: {
      dates: string[];
      efficiency: number[];
      target: number[];
      production: { actual: number; target: number };
      downtime: number;
    };
    threeWeeks: {
      dates: string[];
      efficiency: number[];
      target: number[];
      production: { actual: number; target: number };
      downtime: number;
    };
    month: {
      dates: string[];
      efficiency: number[];
      target: number[];
      production: { actual: number; target: number };
      downtime: number;
    };
  }
}

// Datos mock para utilización de líneas
const lineUtilizationMock = {
  "FA": {
    wk14: 95,
    wk15: 87,
    wk16: 92,
    wk17: 88,
    unitsWk14: 320,
    unitsWk15: 295,
    unitsWk16: 312,
    unitsWk17: 298
  },
  "Next": {
    wk14: 110,
    wk15: 105,
    wk16: 108,
    wk17: 112,
    unitsWk14: 440,
    unitsWk15: 420,
    unitsWk16: 432,
    unitsWk17: 448
  },
  "CER3": {
    wk14: 98,
    wk15: 102,
    wk16: 100,
    wk17: 95,
    unitsWk14: 392,
    unitsWk15: 408,
    unitsWk16: 400,
    unitsWk17: 380
  }
};

export default function UsageRoadster() {
  // Datos mock
  const { products, period, linesSummary } = usageMock;
  const { cbpId } = useParams();
  
  // Estado para manejar múltiples escenarios
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: '1',
      name: 'Escenario Base',
      description: 'Distribución inicial basada en el CBP',
      targetUtilization: 100,
      weeklyValues: products.reduce((acc, prod, idx) => {
        acc[prod.catalog] = {
          woi: Math.round(Math.random() * 8 + 2),
          wk14: period[idx].wk14,
          wk15: period[idx].wk15,
          wk16: period[idx].wk16,
          wk17: period[idx].wk17
        };
        return acc;
      }, {}),
      utilizationRates: {
        wk14: 101,
        wk15: 101,
        wk16: 0,
        wk17: 101
      }
    }
  ]);
  
  // Escenario activo
  const [activeScenarioId, setActiveScenarioId] = useState<string>('1');
  const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];
  
  // Estado para manejar la visualización de estadísticas
  const [selectedPN, setSelectedPN] = useState<string | null>(null);
  const [statsPeriod, setStatsPeriod] = useState<'daily' | 'weekly' | 'twoWeeks' | 'threeWeeks' | 'month'>('daily');
  const [statsMetric, setStatsMetric] = useState<'production' | 'efficiency'>('production');
  const [showWoiTable, setShowWoiTable] = useState<boolean>(false);
  const [showLineUtilization, setShowLineUtilization] = useState<boolean>(false);
  const [lineUtilizationView, setLineUtilizationView] = useState<'efficiency' | 'units'>('efficiency');
  
  // Función para crear un nuevo escenario
  const createNewScenario = () => {
    const newId = (parseInt(scenarios[scenarios.length - 1].id) + 1).toString();
    const newScenario: Scenario = {
      id: newId,
      name: `Escenario ${newId}`,
      description: 'Nuevo escenario de simulación',
      targetUtilization: 100,
      weeklyValues: products.reduce((acc, prod, idx) => {
        acc[prod.catalog] = {
          woi: Math.round(Math.random() * 8 + 2),
          wk14: period[idx].wk14,
          wk15: period[idx].wk15,
          wk16: period[idx].wk16,
          wk17: period[idx].wk17
        };
        return acc;
      }, {}),
      utilizationRates: {
        wk14: 101,
        wk15: 101,
        wk16: 0,
        wk17: 101
      }
    };
    
    setScenarios([...scenarios, newScenario]);
    setActiveScenarioId(newId);
  };
  
  // Función para duplicar un escenario
  const duplicateScenario = (scenarioId: string) => {
    const scenarioToDuplicate = scenarios.find(s => s.id === scenarioId);
    if (!scenarioToDuplicate) return;
    
    const newId = (parseInt(scenarios[scenarios.length - 1].id) + 1).toString();
    const newScenario: Scenario = {
      ...scenarioToDuplicate,
      id: newId,
      name: `${scenarioToDuplicate.name} (copia)`,
      description: `Copia de: ${scenarioToDuplicate.description}`
    };
    
    setScenarios([...scenarios, newScenario]);
    setActiveScenarioId(newId);
  };
  
  // Función para eliminar un escenario
  const deleteScenario = (scenarioId: string) => {
    if (scenarios.length <= 1) return; // No eliminar el último escenario
    
    const newScenarios = scenarios.filter(s => s.id !== scenarioId);
    setScenarios(newScenarios);
    
    // Si se eliminó el escenario activo, activar el primero
    if (activeScenarioId === scenarioId) {
      setActiveScenarioId(newScenarios[0].id);
    }
  };
  
  // Función para actualizar un escenario
  const updateScenario = (scenarioId: string, updates: Partial<Scenario>) => {
    setScenarios(scenarios.map(s => 
      s.id === scenarioId ? { ...s, ...updates } : s
    ));
  };
  
  // Función para actualizar valores semanales de un producto
  const updateWeeklyValue = (productId: string, week: string, value: number) => {
    const updatedWeeklyValues = {
      ...activeScenario.weeklyValues,
      [productId]: {
        ...activeScenario.weeklyValues[productId],
        [week]: value
      }
    };
    
    updateScenario(activeScenarioId, { weeklyValues: updatedWeeklyValues });
  };
  
  // Función para actualizar WOI de un producto
  const updateWOI = (productId: string, value: number) => {
    const updatedWeeklyValues = {
      ...activeScenario.weeklyValues,
      [productId]: {
        ...activeScenario.weeklyValues[productId],
        woi: value
      }
    };
    
    updateScenario(activeScenarioId, { weeklyValues: updatedWeeklyValues });
  };
  
  // Función para calcular la distribución
  const calculateDistribution = () => {
    // Aquí iría la lógica real de distribución
    // Por ahora solo actualizamos las tasas de utilización con valores simulados
    updateScenario(activeScenarioId, {
      utilizationRates: {
        wk14: 95 + Math.round(Math.random() * 10),
        wk15: 95 + Math.round(Math.random() * 10),
        wk16: 95 + Math.round(Math.random() * 10),
        wk17: 95 + Math.round(Math.random() * 10)
      },
      woiProjection: products.reduce((acc, prod) => {
        const baseWoi = activeScenario.weeklyValues[prod.catalog].woi;
        acc[prod.catalog] = Array(7).fill(0).map((_, i) => {
          return parseFloat((baseWoi - i * 0.4 + Math.random() * 1.6 - 0.8).toFixed(1));
        });
        return acc;
      }, {})
    });
  };

  return (
    <div className="space-y-6">
      {/* Header mejorado (similar a index.tsx) */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart2 className="w-7 h-7 text-purple-600 mr-2" />
              Usage <span className="text-lg font-normal text-gray-500 ml-2">(Capacity Loading)</span>
            </h1>
            <p className="text-gray-500">Detalle de asignación semanal y carga de líneas para Roadster - {cbpId || "Abril 2025"}</p>
          </div>
          <div className="flex space-x-2">
            <button
              className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 border-gray-300 text-gray-900"
            >
              <Filter className="w-4 h-4 mr-2" /> Filtros
            </button>
            <button
              className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 border-gray-300 text-gray-900"
            >
              <Download className="w-4 h-4 mr-2" /> Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Nueva sección: Simulación de Productos y Programación Semanal */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Simulación de Productos y Programación Semanal</h2>
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
              onClick={() => createNewScenario()}
            >
              <Plus className="w-4 h-4 mr-1" /> Nuevo Escenario
            </button>
          </div>
        </div>

        {/* Pestañas de escenarios */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex overflow-x-auto">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 ${
                  activeScenarioId === scenario.id 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveScenarioId(scenario.id)}
              >
                {scenario.name}
              </button>
            ))}
          </div>
        </div>

        {/* Barra de herramientas del escenario activo */}
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                className="font-medium border-none bg-transparent focus:ring-0 text-gray-900"
                value={activeScenario.name}
                onChange={(e) => updateScenario(activeScenarioId, { name: e.target.value })}
              />
              <div className="flex space-x-2">
                <button 
                  className="p-1 text-gray-500 hover:text-blue-600"
                  onClick={() => duplicateScenario(activeScenarioId)}
                  title="Duplicar escenario"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {scenarios.length > 1 && (
                  <button 
                    className="p-1 text-gray-500 hover:text-red-600"
                    onClick={() => deleteScenario(activeScenarioId)}
                    title="Eliminar escenario"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button 
                  className="p-1 text-gray-500 hover:text-green-600"
                  title="Guardar escenario"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>
            <input 
              type="text" 
              className="text-sm border-none bg-transparent focus:ring-0 text-gray-500"
              value={activeScenario.description}
              onChange={(e) => updateScenario(activeScenarioId, { description: e.target.value })}
              placeholder="Descripción del escenario..."
            />
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={calculateDistribution}
            >
              Calcular Distribución
            </button>
            <button
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Reiniciar
            </button>
          </div>
        </div>

        {/* Capacidad y Utilización - Convertido a desplegable */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <button 
            onClick={() => setShowLineUtilization(!showLineUtilization)} 
            className="flex items-center justify-between w-full text-left"
          >
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full">
              <div>
                <label className="block text-xs font-medium text-gray-500">Capacidad Total</label>
                <span className="text-lg font-bold">3180</span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Utilización Wk14</label>
                <span className={`text-lg font-bold ${activeScenario.utilizationRates.wk14 > 100 ? 'text-red-600' : 'text-green-600'}`}>
                  {activeScenario.utilizationRates.wk14}%
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Utilización Wk15</label>
                <span className={`text-lg font-bold ${activeScenario.utilizationRates.wk15 > 100 ? 'text-red-600' : 'text-green-600'}`}>
                  {activeScenario.utilizationRates.wk15}%
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Utilización Wk16</label>
                <span className={`text-lg font-bold ${activeScenario.utilizationRates.wk16 > 100 ? 'text-red-600' : 'text-green-600'}`}>
                  {activeScenario.utilizationRates.wk16}%
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Utilización Wk17</label>
                <span className={`text-lg font-bold ${activeScenario.utilizationRates.wk17 > 100 ? 'text-red-600' : 'text-green-600'}`}>
                  {activeScenario.utilizationRates.wk17}%
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Target Utilización</label>
                <input 
                  type="number" 
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center" 
                  value={activeScenario.targetUtilization}
                  onChange={(e) => updateScenario(activeScenarioId, { targetUtilization: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <span className="text-gray-600 ml-2">
              {showLineUtilization ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </span>
          </button>
          
          {/* Detalle de utilización por línea */}
          {showLineUtilization && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium text-gray-700">Detalle por Línea de Producción</h3>
                
                {/* Toggle para cambiar entre eficiencia y unidades */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Vista:</span>
                  <div className="flex bg-gray-200 rounded-md overflow-hidden">
                    <button
                      className={`px-3 py-1 text-sm font-medium transition-colors ${
                        lineUtilizationView === 'efficiency'
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-300 text-gray-700'
                      }`}
                      onClick={() => setLineUtilizationView('efficiency')}
                    >
                      Eficiencia (%)
                    </button>
                    <button
                      className={`px-3 py-1 text-sm font-medium transition-colors ${
                        lineUtilizationView === 'units'
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-300 text-gray-700'
                      }`}
                      onClick={() => setLineUtilizationView('units')}
                    >
                      Unidades
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Línea
                      </th>
                      <th className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Load 36 (Wk14)
                      </th>
                      <th className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Load 37 (Wk15)
                      </th>
                      <th className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Load 38 (Wk16)
                      </th>
                      <th className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Load 39 (Wk17)
                      </th>
                      <th className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Loading
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(lineUtilizationMock).map(([line, rates]) => {
                      const totalUtilization = (rates.wk14 + rates.wk15 + rates.wk16 + rates.wk17) / 4;
                      const totalUnits = rates.unitsWk14 + rates.unitsWk15 + rates.unitsWk16 + rates.unitsWk17;
                      return (
                        <tr key={`line-${line}`}>
                          <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-blue-600">
                            {line}
                          </td>
                          
                          {lineUtilizationView === 'efficiency' ? (
                            <>
                              <td className={`px-6 py-2 whitespace-nowrap text-sm text-center ${
                                rates.wk14 > 100 ? 'text-red-600 font-medium' : 'text-gray-900'
                              }`}>
                                {rates.wk14}%
                              </td>
                              <td className={`px-6 py-2 whitespace-nowrap text-sm text-center ${
                                rates.wk15 > 100 ? 'text-red-600 font-medium' : 'text-gray-900'
                              }`}>
                                {rates.wk15}%
                              </td>
                              <td className={`px-6 py-2 whitespace-nowrap text-sm text-center ${
                                rates.wk16 > 100 ? 'text-red-600 font-medium' : 'text-gray-900'
                              }`}>
                                {rates.wk16}%
                              </td>
                              <td className={`px-6 py-2 whitespace-nowrap text-sm text-center ${
                                rates.wk17 > 100 ? 'text-red-600 font-medium' : 'text-gray-900'
                              }`}>
                                {rates.wk17}%
                              </td>
                              <td className={`px-6 py-2 whitespace-nowrap text-sm font-medium text-center ${
                                totalUtilization > 100 ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {Math.round(totalUtilization)}%
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                                {rates.unitsWk14}
                              </td>
                              <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                                {rates.unitsWk15}
                              </td>
                              <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                                {rates.unitsWk16}
                              </td>
                              <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                                {rates.unitsWk17}
                              </td>
                              <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-center text-gray-900">
                                {totalUnits}
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                    
                    {/* Fila de totales */}
                    <tr className="bg-gray-50 font-medium">
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                        Total
                      </td>
                      
                      {lineUtilizationView === 'efficiency' ? (
                        <>
                          <td className={`px-6 py-2 whitespace-nowrap text-sm text-center ${
                            activeScenario.utilizationRates.wk14 > 100 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {activeScenario.utilizationRates.wk14}%
                          </td>
                          <td className={`px-6 py-2 whitespace-nowrap text-sm text-center ${
                            activeScenario.utilizationRates.wk15 > 100 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {activeScenario.utilizationRates.wk15}%
                          </td>
                          <td className={`px-6 py-2 whitespace-nowrap text-sm text-center ${
                            activeScenario.utilizationRates.wk16 > 100 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {activeScenario.utilizationRates.wk16}%
                          </td>
                          <td className={`px-6 py-2 whitespace-nowrap text-sm text-center ${
                            activeScenario.utilizationRates.wk17 > 100 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {activeScenario.utilizationRates.wk17}%
                          </td>
                          <td className={`px-6 py-2 whitespace-nowrap text-sm text-center font-bold ${
                            (activeScenario.utilizationRates.wk14 + activeScenario.utilizationRates.wk15 + 
                            activeScenario.utilizationRates.wk16 + activeScenario.utilizationRates.wk17) / 4 > 100 
                              ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {Math.round((activeScenario.utilizationRates.wk14 + activeScenario.utilizationRates.wk15 + 
                                        activeScenario.utilizationRates.wk16 + activeScenario.utilizationRates.wk17) / 4)}%
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 font-medium">
                            {Object.values(lineUtilizationMock).reduce((sum, line) => sum + line.unitsWk14, 0)}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 font-medium">
                            {Object.values(lineUtilizationMock).reduce((sum, line) => sum + line.unitsWk15, 0)}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 font-medium">
                            {Object.values(lineUtilizationMock).reduce((sum, line) => sum + line.unitsWk16, 0)}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 font-medium">
                            {Object.values(lineUtilizationMock).reduce((sum, line) => sum + line.unitsWk17, 0)}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-center font-bold text-gray-900">
                            {Object.values(lineUtilizationMock).reduce((sum, line) => 
                              sum + line.unitsWk14 + line.unitsWk15 + line.unitsWk16 + line.unitsWk17, 0)}
                          </td>
                        </>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Tabla de Simulación Editable */}
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WOI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CBP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lot Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">wk25-14</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">wk25-15</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">wk25-16</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">wk25-17</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((prod: any, idx: number) => {
                const weeklyData = activeScenario.weeklyValues[prod.catalog];
                const total = weeklyData ? (
                  weeklyData.wk14 + weeklyData.wk15 + weeklyData.wk16 + weeklyData.wk17
                ) : (period[idx].wk14 + period[idx].wk15 + period[idx].wk16 + period[idx].wk17);
                
                return (
                  <tr key={`sim-${prod.catalog}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prod.pn}</td>
                    <td className="px-2 py-4 whitespace-nowrap text-center">
                      <button 
                        onClick={() => setSelectedPN(selectedPN === prod.pn ? null : prod.pn)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Ver estadísticas de producción"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <input 
                        type="number" 
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center" 
                        value={weeklyData?.woi || Math.round(Math.random() * 8 + 2)}
                        onChange={(e) => updateWOI(prod.catalog, parseInt(e.target.value))}
                        step="0.1"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{period[idx].bp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{period[idx].cbp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      {total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prod.lotSize}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 bg-blue-50">
                      <input 
                        type="number" 
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center" 
                        value={weeklyData?.wk14 || period[idx].wk14}
                        onChange={(e) => updateWeeklyValue(prod.catalog, 'wk14', parseInt(e.target.value))}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 bg-blue-50">
                      <input 
                        type="number" 
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center" 
                        value={weeklyData?.wk15 || period[idx].wk15}
                        onChange={(e) => updateWeeklyValue(prod.catalog, 'wk15', parseInt(e.target.value))}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 bg-blue-50">
                      <input 
                        type="number" 
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center" 
                        value={weeklyData?.wk16 || period[idx].wk16}
                        onChange={(e) => updateWeeklyValue(prod.catalog, 'wk16', parseInt(e.target.value))}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 bg-blue-50">
                      <input 
                        type="number" 
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center" 
                        value={weeklyData?.wk17 || period[idx].wk17}
                        onChange={(e) => updateWeeklyValue(prod.catalog, 'wk17', parseInt(e.target.value))}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Panel de Estadísticas de Producción */}
        {selectedPN && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-medium text-gray-900">Estadísticas de Producción - PN: {selectedPN}</h3>
              <button 
                onClick={() => setSelectedPN(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>
            
            {/* Controles y filtros */}
            <div className="mb-4 flex flex-wrap justify-between items-center">
              {/* Selector de período */}
              <div className="flex space-x-1 border-b border-gray-200">
                <button 
                  className={`px-4 py-2 text-sm font-medium ${
                    statsPeriod === 'daily' 
                      ? 'text-blue-600 border-b-2 border-blue-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setStatsPeriod('daily')}
                >
                  Día
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium ${
                    statsPeriod === 'weekly' 
                      ? 'text-blue-600 border-b-2 border-blue-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setStatsPeriod('weekly')}
                >
                  Última Semana
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium ${
                    statsPeriod === 'twoWeeks' 
                      ? 'text-blue-600 border-b-2 border-blue-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setStatsPeriod('twoWeeks')}
                >
                  Últimas 2W
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium ${
                    statsPeriod === 'threeWeeks' 
                      ? 'text-blue-600 border-b-2 border-blue-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setStatsPeriod('threeWeeks')}
                >
                  Últimas 3W
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium ${
                    statsPeriod === 'month' 
                      ? 'text-blue-600 border-b-2 border-blue-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setStatsPeriod('month')}
                >
                  Último Mes
                </button>
              </div>
              
              {/* Selector de métrica */}
              <div className="flex mt-2 md:mt-0">
                <button
                  className={`px-3 py-1 text-sm rounded-l ${
                    statsMetric === 'production'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setStatsMetric('production')}
                >
                  Producción
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-r ${
                    statsMetric === 'efficiency'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setStatsMetric('efficiency')}
                >
                  Eficiencia
                </button>
              </div>
            </div>
            
            {/* Gráfico y métricas */}
            {productionStatsMock[selectedPN as keyof typeof productionStatsMock] && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-white p-3 rounded border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    {statsMetric === 'production' ? 'Tendencia de Producción' : 'Tendencia de Eficiencia'}
                  </h4>
                  <div className="h-64 flex flex-col">
                    <div className="flex-1 relative">
                      {/* Eje Y */}
                      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
                        {statsMetric === 'production' ? (
                          <>
                            <span>120%</span>
                            <span>100%</span>
                            <span>80%</span>
                            <span>60%</span>
                            <span>40%</span>
                          </>
                        ) : (
                          <>
                            <span>150%</span>
                            <span>125%</span>
                            <span>100%</span>
                            <span>75%</span>
                            <span>50%</span>
                          </>
                        )}
                      </div>
                      
                      {/* Líneas de cuadrícula */}
                      <div className="absolute left-6 top-0 right-0 h-full">
                        <div className="border-t border-gray-200 h-1/4"></div>
                        <div className="border-t border-gray-200 h-1/4"></div>
                        <div className="border-t border-gray-200 h-1/4"></div>
                        <div className="border-t border-gray-200 h-1/4"></div>
                      </div>
                      
                      {/* Líneas de gráfico */}
                      <div className="absolute left-6 right-0 top-0 bottom-6 flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                          {/* Línea de meta */}
                          <line 
                            x1="0" 
                            y1={statsMetric === 'production' ? 80 : 100} 
                            x2="700" 
                            y2={statsMetric === 'production' ? 80 : 100} 
                            stroke="#9CA3AF" 
                            strokeWidth="1" 
                            strokeDasharray="5,5" 
                          />
                          
                          {/* Línea de datos */}
                          <polyline 
                            points={
                              statsMetric === 'efficiency' 
                                ? (productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].efficiency.map((val, idx, arr) => {
                                    const x = (idx / (arr.length - 1)) * 700;
                                    const y = 200 - (val / 150) * 200;
                                    return `${x},${y}`;
                                  }).join(' '))
                                : (productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].efficiency.map((val, idx, arr) => {
                                    // Usar datos de eficiencia como aproximación a producción para el ejemplo
                                    const x = (idx / (arr.length - 1)) * 700;
                                    const produccionRelativa = (val / 100) * 80; // Simular producción basada en eficiencia
                                    const y = 200 - (produccionRelativa / 120) * 200;
                                    return `${x},${y}`;
                                  }).join(' '))
                            }
                            fill="none" 
                            stroke={statsMetric === 'production' ? "#10B981" : "#3B82F6"} 
                            strokeWidth="2" 
                          />
                          
                          {/* Puntos de datos */}
                          {statsMetric === 'efficiency' 
                            ? (productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].efficiency.map((val, idx, arr) => {
                                const x = (idx / (arr.length - 1)) * 700;
                                const y = 200 - (val / 150) * 200;
                                return (
                                  <circle 
                                    key={idx} 
                                    cx={x} 
                                    cy={y} 
                                    r="4" 
                                    fill="#3B82F6" 
                                  />
                                );
                              }))
                            : (productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].efficiency.map((val, idx, arr) => {
                                const x = (idx / (arr.length - 1)) * 700;
                                const produccionRelativa = (val / 100) * 80; // Simular producción basada en eficiencia
                                const y = 200 - (produccionRelativa / 120) * 200;
                                return (
                                  <circle 
                                    key={idx} 
                                    cx={x} 
                                    cy={y} 
                                    r="4" 
                                    fill="#10B981" 
                                  />
                                );
                              }))
                          }
                        </svg>
                      </div>
                    </div>
                    
                    {/* Eje X */}
                    <div className="h-6 ml-6 flex justify-between text-xs text-gray-500">
                      {productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].dates.map((date, idx) => (
                        <span key={idx}>{date}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="text-sm text-gray-500">
                      Unidades producidas ({
                        statsPeriod === 'daily' ? 'hoy' : 
                        statsPeriod === 'weekly' ? 'esta semana' :
                        statsPeriod === 'twoWeeks' ? 'últimas 2 semanas' :
                        statsPeriod === 'threeWeeks' ? 'últimas 3 semanas' : 
                        'último mes'
                      })
                    </div>
                    <div className="text-xl font-bold">
                      {productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].production.actual.toLocaleString()} / {productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].production.target.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            (productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].production.actual / productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].production.target) >= 1 
                              ? 'bg-green-600' 
                              : 'bg-yellow-500'
                          }`} 
                          style={{ width: `${Math.min(100, (productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].production.actual / productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].production.target) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {Math.round((productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].production.actual / productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].production.target) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="text-sm text-gray-500">
                      Eficiencia ({
                        statsPeriod === 'daily' ? 'último día' : 
                        statsPeriod === 'weekly' ? 'última semana' :
                        statsPeriod === 'twoWeeks' ? 'últimas 2 semanas' :
                        statsPeriod === 'threeWeeks' ? 'últimas 3 semanas' : 
                        'último mes'
                      })
                    </div>
                    <div className="text-xl font-bold">
                      {productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].efficiency[productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].efficiency.length - 1]}%
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ 
                            width: `${Math.min(100, productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].efficiency[productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].efficiency.length - 1])}%` 
                          }}
                        ></div>
                      </div>
                      <span className={`ml-2 text-sm font-medium ${
                        productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].efficiency[productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].efficiency.length - 1] >= 100 
                          ? 'text-green-600' 
                          : 'text-yellow-500'
                      }`}>
                        {productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].efficiency[productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].efficiency.length - 1] >= 100 
                          ? `+${productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].efficiency[productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].efficiency.length - 1] - 100}%` 
                          : `-${100 - productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].efficiency[productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].efficiency.length - 1]}%`
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="text-sm text-gray-500">
                      Tiempo muerto ({
                        statsPeriod === 'daily' ? 'hoy' : 
                        statsPeriod === 'weekly' ? 'esta semana' :
                        statsPeriod === 'twoWeeks' ? 'últimas 2 semanas' :
                        statsPeriod === 'threeWeeks' ? 'últimas 3 semanas' : 
                        'último mes'
                      })
                    </div>
                    <div className="text-xl font-bold">{productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].downtime} hrs</div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].downtime > 2 
                              ? 'bg-red-500' 
                              : productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].downtime > 1 
                                ? 'bg-yellow-500' 
                                : 'bg-green-600'
                          }`} 
                          style={{ 
                            width: `${Math.min(100, (productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].downtime / (statsPeriod === 'daily' ? 8 : statsPeriod === 'weekly' ? 40 : statsPeriod === 'twoWeeks' ? 80 : statsPeriod === 'threeWeeks' ? 120 : 160)) * 100)}%` 
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {Math.round((productionStatsMock[selectedPN as keyof typeof productionStatsMock][statsPeriod].downtime / (statsPeriod === 'daily' ? 8 : statsPeriod === 'weekly' ? 40 : statsPeriod === 'twoWeeks' ? 80 : statsPeriod === 'threeWeeks' ? 120 : 160)) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabla de Semanas de Inventario Resultantes - Ahora Expandible */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <button 
            onClick={() => setShowWoiTable(!showWoiTable)} 
            className="flex items-center justify-between w-full text-left text-md font-medium text-gray-900 mb-2"
          >
            <span>Semanas de Inventario Resultantes</span>
            <span className="text-gray-600">
              {showWoiTable ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </span>
          </button>
          
          {showWoiTable && (
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WOI Actual</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-14</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-15</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-16</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-17</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-18</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-19</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-20</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((prod: any, idx: number) => {
                    const woiActual = activeScenario.weeklyValues[prod.catalog]?.woi || Math.round(Math.random() * 8 + 2);
                    const woiValues = activeScenario.woiProjection?.[prod.catalog] || 
                      Array(7).fill(0).map((_, i) => {
                        return parseFloat((woiActual - i * 0.4 + Math.random() * 1.6 - 0.8).toFixed(1));
                      });

                    return (
                      <tr key={`woi-${prod.catalog}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prod.pn}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{woiActual}</td>
                        {woiValues.map((val, i) => (
                          <td 
                            key={`woi-${prod.catalog}-${i}`} 
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              val < 0 ? 'text-red-600 font-bold' : 
                              val < 2 ? 'text-yellow-600' : 
                              'text-green-600'
                            }`}
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 