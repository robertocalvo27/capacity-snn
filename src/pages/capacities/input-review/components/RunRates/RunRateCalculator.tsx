import React, { useState } from 'react';
import { Calculator, Save, Plus, X, Info } from 'lucide-react';

interface Process {
  id: string;
  name: string;
  cycleTime: number;
  stations: number;
  manualTime: number;
}

interface ProcessBalance {
  processId: string;
  name: string;
  assignedPersonnel: number;
  unitsPerHour: number;
  flowTime: number;
  isCritical: boolean;
}

interface RunRateCalculatorProps {
  partNumber?: string;
  valueStream?: string;
  line?: string;
  onSaveScenario?: (scenario: any) => void;
  onCancel?: () => void;
}

// Calculation functions from BalanceLinea.tsx
const calculateUnitsPerHour = (manualTime: number, operators: number): number => {
  if (operators === 0 || manualTime === 0) return 0;
  return Math.round(3600 / (manualTime / operators));
};

const calculateFlowTime = (manualTime: number, operators: number): number => {
  if (operators === 0) return 0;
  return Math.round((manualTime / operators) * 100) / 100;
};

const findBottleneck = (processes: ProcessBalance[]): string => {
  if (processes.length === 0) return '';
  const bottleneck = processes.reduce((prev, current) => {
    return prev.unitsPerHour < current.unitsPerHour ? prev : current;
  });
  return bottleneck.name;
};

const calculateRunRate = (processes: ProcessBalance[]): number => {
  if (processes.length === 0) return 0;
  return Math.min(...processes.map(process => process.unitsPerHour));
};

const RunRateCalculator: React.FC<RunRateCalculatorProps> = ({
  partNumber = '',
  valueStream = '',
  line = '',
  onSaveScenario,
  onCancel
}) => {
  const [processes, setProcesses] = useState<Process[]>([
    { id: '1', name: 'Proceso 1', cycleTime: 30, stations: 1, manualTime: 30 }
  ]);
  const [headCount, setHeadCount] = useState<number>(3);
  const [calculatedBalance, setCalculatedBalance] = useState<ProcessBalance[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const addProcess = () => {
    const newProcess: Process = {
      id: Date.now().toString(),
      name: `Proceso ${processes.length + 1}`,
      cycleTime: 30,
      stations: 1,
      manualTime: 30
    };
    setProcesses([...processes, newProcess]);
  };

  const removeProcess = (id: string) => {
    if (processes.length > 1) {
      setProcesses(processes.filter(p => p.id !== id));
    }
  };

  const updateProcess = (id: string, field: keyof Process, value: string | number) => {
    setProcesses(processes.map(p => 
      p.id === id 
        ? { 
            ...p, 
            [field]: value,
            manualTime: field === 'cycleTime' ? Number(value) : p.manualTime
          }
        : p
    ));
  };

  const calculateBalance = () => {
    const totalCycleTime = processes.reduce((sum, p) => sum + p.cycleTime, 0);
    
    const balancedProcesses: ProcessBalance[] = processes.map(process => {
      const proportion = process.cycleTime / totalCycleTime;
      const assignedPersonnel = headCount * proportion;
      const unitsPerHour = calculateUnitsPerHour(process.manualTime, assignedPersonnel);
      const flowTime = calculateFlowTime(process.manualTime, assignedPersonnel);
      
      return {
        processId: process.id,
        name: process.name,
        assignedPersonnel: Math.round(assignedPersonnel * 100) / 100,
        unitsPerHour,
        flowTime,
        isCritical: false
      };
    });

    // Identify bottleneck
    const bottleneck = findBottleneck(balancedProcesses);
    
    // Mark critical process
    balancedProcesses.forEach(p => {
      p.isCritical = p.name === bottleneck;
    });

    setCalculatedBalance(balancedProcesses);
    setShowResults(true);
  };

  const saveScenario = () => {
    const runRate = calculateRunRate(calculatedBalance);
    const bottleneck = findBottleneck(calculatedBalance);
    const utilizationPercentage = Math.min(98, Math.max(75, Math.round(85 + Math.random() * 15)));

    const scenario = {
      id: `calc_${Date.now()}`,
      partNumber,
      valueStream,
      line,
      headCount,
      runRate,
      bottleneck,
      utilizationPercentage,
      processes,
      processDistribution: calculatedBalance,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    if (onSaveScenario) {
      onSaveScenario(scenario);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Calculadora de Run Rate</h3>
          <p className="text-sm text-gray-500">
            Análisis de balance de línea para determinar Run Rate óptimo
          </p>
        </div>
        <div className="flex space-x-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2 inline" />
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Configuration Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Part Number
          </label>
          <input
            type="text"
            value={partNumber}
            disabled
            className="w-full rounded-md border-gray-300 bg-gray-100 text-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value Stream
          </label>
          <input
            type="text"
            value={valueStream}
            disabled
            className="w-full rounded-md border-gray-300 bg-gray-100 text-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Head Count Total
          </label>
          <input
            type="number"
            value={headCount}
            onChange={(e) => setHeadCount(Number(e.target.value))}
            min="1"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Processes Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-medium text-gray-900">Procesos de Manufactura</h4>
          <button
            onClick={addProcess}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Proceso
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre del Proceso
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiempo de Ciclo (seg)
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estaciones
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {processes.map((process, index) => (
                <tr key={process.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={process.name}
                      onChange={(e) => updateProcess(process.id, 'name', e.target.value)}
                      className="w-full border-gray-300 rounded-md text-sm"
                      placeholder="Nombre del proceso"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      value={process.cycleTime}
                      onChange={(e) => updateProcess(process.id, 'cycleTime', Number(e.target.value))}
                      min="1"
                      className="w-20 border-gray-300 rounded-md text-sm text-center"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      value={process.stations}
                      onChange={(e) => updateProcess(process.id, 'stations', Number(e.target.value))}
                      min="1"
                      className="w-16 border-gray-300 rounded-md text-sm text-center"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => removeProcess(process.id)}
                      disabled={processes.length === 1}
                      className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={calculateBalance}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calcular Balance de Línea
        </button>
      </div>

      {/* Results Section */}
      {showResults && calculatedBalance.length > 0 && (
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Resultados del Análisis</h4>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="text-blue-600">
                  <Calculator className="w-8 h-8" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-900">Run Rate Calculado</p>
                  <p className="text-2xl font-bold text-blue-900">{calculateRunRate(calculatedBalance)} UPH</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="text-red-600">
                  <Info className="w-8 h-8" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-900">Cuello de Botella</p>
                  <p className="text-lg font-bold text-red-900">{findBottleneck(calculatedBalance)}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="text-green-600">
                  <Info className="w-8 h-8" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-900">Total Personal</p>
                  <p className="text-2xl font-bold text-green-900">{headCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Results Table */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proceso
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Personal Asignado
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unidades/Hora
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flow Time (seg)
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {calculatedBalance.map((process, index) => (
                  <tr 
                    key={process.processId} 
                    className={process.isCritical ? 'bg-red-50' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {process.name}
                      {process.isCritical && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Cuello de Botella
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900">
                      {process.assignedPersonnel}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-bold text-gray-900">
                      {process.unitsPerHour}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900">
                      {process.flowTime}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {process.isCritical ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Crítico
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Save Scenario Button */}
          <div className="flex justify-end">
            <button
              onClick={saveScenario}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-5 h-5 mr-2" />
              Guardar como Escenario
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunRateCalculator; 