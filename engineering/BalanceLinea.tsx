import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, Save, FileText, Database, BarChart2, Settings, Layers, ArrowLeft, Table } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart, ReferenceLine, Label, LabelList } from 'recharts';

// DATOS DE EJEMPLO
const valueStreams = [
  { id: 'SM', name: 'Sports Medicine' },
  { id: 'ENT', name: 'Ear, Nose & Throat' },
  { id: 'WOUND', name: 'Wound Management' },
  { id: 'ORTHO', name: 'Orthopaedics' },
  { id: 'TRAUMA', name: 'Trauma' },
  { id: 'RECON', name: 'Reconstruction' },
  { id: 'OTHER', name: 'Other' }
];

const lines = [
  { id: 'L01', name: 'Línea 1', valueStream: 'SM' },
  { id: 'L02', name: 'Línea 2', valueStream: 'ENT' },
  { id: 'L06', name: 'Línea 6', valueStream: 'WOUND' },
  { id: 'L07', name: 'Línea 7', valueStream: 'WOUND' },
  { id: 'L08', name: 'Línea 8', valueStream: 'ORTHO' },
  { id: 'L09', name: 'Línea 9', valueStream: 'TRAUMA' }
];

// INTERFACES
interface PartNumber {
  id: string;
  name: string;
  valueStream: string;
  line: string;
  runRate: number;
  laborStd: number;
  headCount: number;
  headCountType: string;
}

interface Process {
  id: string;
  partNumberId: string;
  name: string;
  cycleTime: number;
  stations: number;
}

interface ProcessBalance {
  processId: string;
  name: string;
  cycleTime: number;
  stations: number;
  assignedPersonnel: number;
  manualTime: number;
  unitsPerHour: number;
  flowTime: number;
}

interface BalanceConfig {
  partNumberId: string;
  totalPersonnel: number;
  processes: ProcessBalance[];
  runRate: number;
  bottleneck: string;
}

interface HCRunRateConfig {
  id: string;
  partNumberId: string;
  headCount: number;
  runRate: number;
  bottleneck: string;
  createdAt: Date;
}

// DATOS DE EJEMPLO - PART NUMBERS
const initialPartNumbers: PartNumber[] = [
  { id: '10600', name: 'Producto 10600', valueStream: 'SM', line: 'L01', runRate: 231, laborStd: 0.027, headCount: 3, headCountType: 'Final' },
  { id: '10610', name: 'Producto 10610', valueStream: 'ENT', line: 'L02', runRate: 231, laborStd: 0.031, headCount: 3, headCountType: 'Final' },
  { id: '10620', name: 'Producto 10620', valueStream: 'WOUND', line: 'L06', runRate: 231, laborStd: 0.080, headCount: 3, headCountType: 'Final' },
  { id: '10630', name: 'Producto 10630', valueStream: 'WOUND', line: 'L07', runRate: 231, laborStd: 0.058, headCount: 3, headCountType: 'Final' },
  { id: '10640', name: 'Producto 10640', valueStream: 'ORTHO', line: 'L08', runRate: 231, laborStd: 0.034, headCount: 3, headCountType: 'Final' },
  { id: '86990', name: 'Producto 86990', valueStream: 'WOUND', line: 'L06', runRate: 157, laborStd: 0.042, headCount: 24, headCountType: 'Final' }
];

// DATOS DE EJEMPLO - PROCESOS
const initialProcesses: Process[] = [
  { id: '1', partNumberId: '86990', name: 'Pegado de caracol', cycleTime: 4, stations: 1 },
  { id: '2', partNumberId: '86990', name: 'Soldadura', cycleTime: 22, stations: 1 },
  { id: '3', partNumberId: '86990', name: 'Quemado de pantalon', cycleTime: 16, stations: 1 },
  { id: '4', partNumberId: '86990', name: 'Pegado de manguera', cycleTime: 21, stations: 1 },
  { id: '5', partNumberId: '86990', name: 'Armado', cycleTime: 52, stations: 3 },
  { id: '6', partNumberId: '86990', name: 'IV-SET', cycleTime: 22, stations: 2 },
  { id: '7', partNumberId: '86990', name: 'Leak Test + Retrabajos', cycleTime: 23, stations: 1 },
  { id: '8', partNumberId: '10600', name: 'Preparación inicial', cycleTime: 18, stations: 1 },
  { id: '9', partNumberId: '10600', name: 'Ensamblaje', cycleTime: 35, stations: 2 },
  { id: '10', partNumberId: '10600', name: 'Prueba de calidad', cycleTime: 15, stations: 1 },
];

// DATOS DE EJEMPLO - CONFIGURACIONES HC-RUN RATE
const initialHCRunRateConfigs: HCRunRateConfig[] = [
  { id: '1', partNumberId: '10600', headCount: 3, runRate: 231, bottleneck: 'Ensamblaje', createdAt: new Date(2023, 5, 15) },
  { id: '2', partNumberId: '10600', headCount: 4, runRate: 257, bottleneck: 'Prueba de calidad', createdAt: new Date(2023, 6, 1) },
  { id: '3', partNumberId: '10600', headCount: 5, runRate: 310, bottleneck: 'Preparación inicial', createdAt: new Date(2023, 6, 15) },
  { id: '4', partNumberId: '86990', headCount: 24, runRate: 157, bottleneck: 'Leak Test + Retrabajos', createdAt: new Date(2023, 7, 1) },
  { id: '5', partNumberId: '86990', headCount: 22, runRate: 149, bottleneck: 'Soldadura', createdAt: new Date(2023, 7, 15) },
  { id: '6', partNumberId: '86990', headCount: 26, runRate: 165, bottleneck: 'Armado', createdAt: new Date(2023, 8, 1) },
];

// FUNCIONES DE CÁLCULO
const calculateManualTime = (cycleTime: number, personnel: number): number => {
  return cycleTime * personnel;
};

const calculateUnitsPerHour = (cycleTime: number, stations: number): number => {
  // UPH = (3600 segundos / cycleTime) * estaciones
  return Math.round((3600 / cycleTime) * stations);
};

const calculateFlowTime = (cycleTime: number): number => {
  // Flow Time = Tiempo de ciclo
  return cycleTime;
};

const findBottleneck = (processes: ProcessBalance[]): string => {
  if (processes.length === 0) return '';
  
  const bottleneck = processes.reduce((prev, current) => {
    return prev.unitsPerHour < current.unitsPerHour ? prev : current;
  });
  
  return bottleneck.name;
};

// Función para distribuir personal entre procesos
const distributePersonnel = (processes: Process[], totalPersonnel: number): ProcessBalance[] => {
  // Convertimos los procesos a ProcessBalance inicialmente con asignación básica
  const processBalances: ProcessBalance[] = processes.map(process => {
    // Por ahora usamos los valores iniciales del modelo de ejemplo
    let assignedPersonnel = 0;
    
    // Asignación según los datos de ejemplo
    if (process.name === 'Pegado de caracol') assignedPersonnel = 0.5;
    else if (process.name === 'Armado') assignedPersonnel = 2.5;
    else if (process.name === 'UVA- Adentro + retrabajos') assignedPersonnel = 2.0;
    else if (process.name === 'Hipot y continuidad') assignedPersonnel = 1.5;
    else if (process.name === 'Union de mangueras') assignedPersonnel = 1.5;
    else assignedPersonnel = 1.0;
    
    const manualTime = calculateManualTime(process.cycleTime, assignedPersonnel);
    const unitsPerHour = calculateUnitsPerHour(process.cycleTime, process.stations);
    const flowTime = calculateFlowTime(process.cycleTime);
    
    return {
      processId: process.id,
      name: process.name,
      cycleTime: process.cycleTime,
      stations: process.stations,
      assignedPersonnel,
      manualTime,
      unitsPerHour,
      flowTime
    };
  });
  
  return processBalances;
};

// COMPONENTE PRINCIPAL
export default function BalanceLinea() {
  // Estados principales
  const [mainTab, setMainTab] = useState<'partnumbers' | 'processes' | 'hc-runrate' | 'balance'>('partnumbers');
  
  // Estados para Part Numbers
  const [partNumbers, setPartNumbers] = useState<PartNumber[]>(initialPartNumbers);
  const [selectedVS, setSelectedVS] = useState<string>('');
  const [selectedLine, setSelectedLine] = useState<string>('');
  const [editingPN, setEditingPN] = useState<PartNumber | null>(null);
  
  // Estados para Procesos
  const [processes, setProcesses] = useState<Process[]>(initialProcesses);
  const [selectedPartNumber, setSelectedPartNumber] = useState<PartNumber | null>(null);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);
  
  // Estados para Balance
  const [balanceConfig, setBalanceConfig] = useState<BalanceConfig | null>(null);
  const [totalPersonnel, setTotalPersonnel] = useState<number>(24); // Comenzamos con 24 operarios
  
  // Estados para HC-Run Rate
  const [hcRunRateConfigs, setHCRunRateConfigs] = useState<HCRunRateConfig[]>(initialHCRunRateConfigs);
  const [selectedConfig, setSelectedConfig] = useState<HCRunRateConfig | null>(null);
  
  // Filtros para part numbers
  const filteredPartNumbers = partNumbers.filter(pn => {
    if (selectedVS && pn.valueStream !== selectedVS) return false;
    if (selectedLine && pn.line !== selectedLine) return false;
    return true;
  });
  
  // Filtro para procesos del part number seleccionado
  const filteredProcesses = processes.filter(process => 
    process.partNumberId === selectedPartNumber?.id
  );
  
  // Filtros para configuraciones HC-Run Rate del part number seleccionado
  const filteredConfigs = hcRunRateConfigs.filter(config => 
    config.partNumberId === selectedPartNumber?.id
  );
  
  // Handler para crear/editar part number
  const handleEditPartNumber = (pn: PartNumber | null) => {
    setEditingPN(pn || {
      id: '',
      name: '',
      valueStream: selectedVS || valueStreams[0].id,
      line: selectedLine || '',
      runRate: 0,
      laborStd: 0,
      headCount: 0,
      headCountType: 'Final'
    });
  };
  
  // Handler para guardar part number
  const handleSavePartNumber = (pn: PartNumber) => {
    if (partNumbers.some(existingPN => existingPN.id === pn.id)) {
      // Actualizar existente
      setPartNumbers(prev => prev.map(item => item.id === pn.id ? pn : item));
    } else {
      // Crear nuevo
      setPartNumbers(prev => [...prev, pn]);
    }
    setEditingPN(null);
  };
  
  // Handler para eliminar part number
  const handleDeletePartNumber = (id: string) => {
    setPartNumbers(prev => prev.filter(pn => pn.id !== id));
  };
  
  // Handler para ver procesos de un part number
  const handleViewProcesses = (pn: PartNumber) => {
    setSelectedPartNumber(pn);
    setMainTab('processes');
  };
  
  // Handler para crear/editar proceso
  const handleEditProcess = (process: Process | null) => {
    if (!selectedPartNumber) return;
    
    setEditingProcess(process || {
      id: '',
      partNumberId: selectedPartNumber.id,
      name: '',
      cycleTime: 0,
      stations: 1
    });
  };
  
  // Handler para guardar proceso
  const handleSaveProcess = (process: Process) => {
    if (processes.some(existingProcess => existingProcess.id === process.id)) {
      // Actualizar existente
      setProcesses(prev => prev.map(item => item.id === process.id ? process : item));
    } else {
      // Crear nuevo
      const newId = (processes.length + 1).toString();
      setProcesses(prev => [...prev, { ...process, id: newId }]);
    }
    setEditingProcess(null);
  };
  
  // Handler para eliminar proceso
  const handleDeleteProcess = (id: string) => {
    setProcesses(prev => prev.filter(process => process.id !== id));
  };
  
  // Handler para volver a la lista de part numbers
  const handleBackToPartNumbers = () => {
    setMainTab('partnumbers');
    setSelectedPartNumber(null);
  };
  
  // Handler para calcular balance
  const handleCalculateBalance = () => {
    if (!selectedPartNumber) return;
    
    // Obtener procesos del part number seleccionado
    const partNumberProcesses = processes.filter(
      process => process.partNumberId === selectedPartNumber.id
    );
    
    // Distribuir personal
    const balancedProcesses = distributePersonnel(partNumberProcesses, totalPersonnel);
    
    // Encontrar cuello de botella y run rate
    const bottleneck = findBottleneck(balancedProcesses);
    const bottleneckProcess = balancedProcesses.find(p => p.name === bottleneck);
    const runRate = bottleneckProcess ? bottleneckProcess.unitsPerHour : 0;
    
    // Actualizar configuración de balance
    setBalanceConfig({
      partNumberId: selectedPartNumber.id,
      totalPersonnel,
      processes: balancedProcesses,
      runRate,
      bottleneck
    });
    
    // Cambiar a pestaña de balance
    setMainTab('balance');
  };
  
  // Handler para ir a la página de HC-Run Rate
  const handleViewHCRunRate = () => {
    if (selectedPartNumber) {
      setMainTab('hc-runrate');
    }
  };
  
  // Handler para crear nueva configuración de HC-Run Rate
  const handleCreateHCRunRateConfig = () => {
    if (!selectedPartNumber) return;
    
    handleCalculateBalance();
    
    // Guardar la configuración actual
    const newConfig: HCRunRateConfig = {
      id: (hcRunRateConfigs.length + 1).toString(),
      partNumberId: selectedPartNumber.id,
      headCount: totalPersonnel,
      runRate: balanceConfig?.runRate || 0,
      bottleneck: balanceConfig?.bottleneck || '',
      createdAt: new Date()
    };
    
    setHCRunRateConfigs(prev => [...prev, newConfig]);
    setSelectedConfig(newConfig);
    setMainTab('balance');
  };
  
  // Handler para seleccionar una configuración y ver su balance
  const handleSelectConfig = (config: HCRunRateConfig) => {
    setSelectedConfig(config);
    setTotalPersonnel(config.headCount);
    
    // Recalcular el balance con el headCount de esta configuración
    if (selectedPartNumber) {
      handleCalculateBalance();
      setMainTab('balance');
    }
  };
  
  // Handler para eliminar una configuración
  const handleDeleteConfig = (id: string) => {
    setHCRunRateConfigs(prev => prev.filter(config => config.id !== id));
    if (selectedConfig?.id === id) {
      setSelectedConfig(null);
    }
  };
  
  // Preparar datos para el gráfico
  const prepareChartData = () => {
    if (!balanceConfig) return [];
    
    return balanceConfig.processes.map((process, index) => {
      // Asignar una letra corta para cada proceso
      const shortLabel = String.fromCharCode(65 + index); // A, B, C, etc.
      
      return {
        name: shortLabel,
        fullName: process.name,
        tiempoManual: Math.round(process.manualTime),
        flowTime: process.flowTime,
        unidadesPorHora: process.unitsPerHour,
        personal: process.assignedPersonnel,
        isCuelloBottela: process.name === balanceConfig.bottleneck
      };
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Balance de Línea</h1>
      
      {/* Tabs Principales */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setMainTab('partnumbers')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              mainTab === 'partnumbers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Database className="w-5 h-5 inline-block mr-2" />
            Part Numbers
          </button>
          <button
            onClick={() => mainTab === 'processes' ? null : setMainTab('processes')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              mainTab === 'processes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } ${!selectedPartNumber && mainTab !== 'processes' ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!selectedPartNumber && mainTab !== 'processes'}
          >
            <Settings className="w-5 h-5 inline-block mr-2" />
            Procesos
          </button>
          <button
            onClick={() => selectedPartNumber ? handleViewHCRunRate() : null}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              mainTab === 'hc-runrate'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } ${!selectedPartNumber ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!selectedPartNumber}
          >
            <Table className="w-5 h-5 inline-block mr-2" />
            HC-Run Rate
          </button>
          <button
            onClick={() => selectedConfig ? handleSelectConfig(selectedConfig) : null}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              mainTab === 'balance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } ${!selectedConfig ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!selectedConfig}
          >
            <BarChart2 className="w-5 h-5 inline-block mr-2" />
            Balance
          </button>
        </nav>
      </div>
      
      {/* Contenido según el tab principal */}
      {mainTab === 'partnumbers' && (
        <>
          {/* Panel de filtros */}
          <div className="bg-white rounded-lg shadow-lg border p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Catálogo de Part Numbers</h2>
              <button
                onClick={() => handleEditPartNumber(null)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Part Number
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value Stream</label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedVS}
                  onChange={(e) => setSelectedVS(e.target.value)}
                >
                  <option value="">Todos</option>
                  {valueStreams.map(vs => (
                    <option key={vs.id} value={vs.id}>{vs.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Línea</label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedLine}
                  onChange={(e) => setSelectedLine(e.target.value)}
                >
                  <option value="">Todas</option>
                  {lines.filter(line => !selectedVS || line.valueStream === selectedVS).map(line => (
                    <option key={line.id} value={line.id}>{line.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Tabla de Part Numbers */}
          <div className="bg-white rounded-lg shadow-lg border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Part Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Run Rate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Labor STD
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      HC
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo HC
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value Stream
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Línea
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPartNumbers.map((pn) => (
                    <tr key={pn.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pn.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pn.runRate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pn.laborStd.toFixed(3)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pn.headCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pn.headCountType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {valueStreams.find(vs => vs.id === pn.valueStream)?.name || pn.valueStream}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lines.find(l => l.id === pn.line)?.name || pn.line}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewProcesses(pn)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Layers className="w-5 h-5 inline" aria-label="Procesos" />
                        </button>
                        <button
                          onClick={() => handleEditPartNumber(pn)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeletePartNumber(pn.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredPartNumbers.length === 0 && (
              <div className="px-6 py-4 text-center text-gray-500">
                No hay part numbers que coincidan con los filtros aplicados.
              </div>
            )}
          </div>
          
          {/* Modal para editar part number */}
          {editingPN && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingPN.id ? `Editar Part Number: ${editingPN.id}` : 'Nuevo Part Number'}
                  </h2>
                  <button
                    onClick={() => setEditingPN(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Cerrar</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID Part Number
                    </label>
                    <input
                      type="text"
                      value={editingPN.id}
                      onChange={(e) => setEditingPN({ ...editingPN, id: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={!!editingPN.id} // No permitir editar ID de PN existente
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={editingPN.name}
                      onChange={(e) => setEditingPN({ ...editingPN, name: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value Stream
                    </label>
                    <select
                      value={editingPN.valueStream}
                      onChange={(e) => setEditingPN({ ...editingPN, valueStream: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar Value Stream</option>
                      {valueStreams.map(vs => (
                        <option key={vs.id} value={vs.id}>{vs.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Línea
                    </label>
                    <select
                      value={editingPN.line}
                      onChange={(e) => setEditingPN({ ...editingPN, line: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar Línea</option>
                      {lines
                        .filter(line => !editingPN.valueStream || line.valueStream === editingPN.valueStream)
                        .map(line => (
                          <option key={line.id} value={line.id}>{line.name}</option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Run Rate
                    </label>
                    <input
                      type="number"
                      value={editingPN.runRate || ''}
                      onChange={(e) => setEditingPN({ ...editingPN, runRate: Number(e.target.value) })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Labor STD
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={editingPN.laborStd || ''}
                      onChange={(e) => setEditingPN({ ...editingPN, laborStd: Number(e.target.value) })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Head Count
                    </label>
                    <input
                      type="number"
                      value={editingPN.headCount || ''}
                      onChange={(e) => setEditingPN({ ...editingPN, headCount: Number(e.target.value) })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo Head Count
                    </label>
                    <select
                      value={editingPN.headCountType}
                      onChange={(e) => setEditingPN({ ...editingPN, headCountType: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Final">Final</option>
                      <option value="Parcial">Parcial</option>
                      <option value="Teórico">Teórico</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 mr-3"
                    onClick={() => setEditingPN(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                    onClick={() => handleSavePartNumber(editingPN)}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {mainTab === 'processes' && (
        <>
          {selectedPartNumber ? (
            <>
              {/* Header con información del Part Number */}
              <div className="bg-white rounded-lg shadow-lg border p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <button 
                      onClick={handleBackToPartNumbers}
                      className="mr-4 text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Procesos para Part Number: <span className="text-blue-600">{selectedPartNumber.id}</span>
                    </h2>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditProcess(null)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Proceso
                    </button>
                    <button
                      onClick={handleViewHCRunRate}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      <Table className="w-4 h-4 mr-2" />
                      HC-Run Rate
                    </button>
                  </div>
                </div>
                
                {/* Información del Part Number */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Nombre</p>
                    <p className="text-sm font-semibold">{selectedPartNumber.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Value Stream</p>
                    <p className="text-sm font-semibold">
                      {valueStreams.find(vs => vs.id === selectedPartNumber.valueStream)?.name || selectedPartNumber.valueStream}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Línea</p>
                    <p className="text-sm font-semibold">
                      {lines.find(l => l.id === selectedPartNumber.line)?.name || selectedPartNumber.line}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Tabla de Procesos */}
              <div className="bg-white rounded-lg shadow-lg border p-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Pasos del Proceso</h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg shadow">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Nombre del Proceso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Ciclo (seg)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Estaciones
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProcesses.map((process, idx) => (
                        <tr key={process.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {idx + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {process.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {process.cycleTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {process.stations}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <button
                              onClick={() => handleEditProcess(process)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteProcess(process.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredProcesses.length === 0 && (
                  <div className="py-4 text-center text-gray-500">
                    No hay procesos registrados para este part number.
                  </div>
                )}
              </div>
              
              {/* Modal para editar proceso */}
              {editingProcess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {editingProcess.id ? 'Editar Proceso' : 'Nuevo Proceso'}
                      </h2>
                      <button
                        onClick={() => setEditingProcess(null)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Cerrar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre del Proceso
                        </label>
                        <input
                          type="text"
                          value={editingProcess.name}
                          onChange={(e) => setEditingProcess({ ...editingProcess, name: e.target.value })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Ej: Soldadura, Ensamblaje, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tiempo de Ciclo (segundos)
                        </label>
                        <input
                          type="number"
                          value={editingProcess.cycleTime}
                          onChange={(e) => setEditingProcess({ ...editingProcess, cycleTime: Number(e.target.value) })}
                          min="0"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número de Estaciones
                        </label>
                        <input
                          type="number"
                          value={editingProcess.stations}
                          onChange={(e) => setEditingProcess({ ...editingProcess, stations: Number(e.target.value) })}
                          min="1"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 mr-3"
                        onClick={() => setEditingProcess(null)}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                        onClick={() => handleSaveProcess(editingProcess)}
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-lg border p-6 flex items-center justify-center h-64">
              <p className="text-gray-500">Seleccione un Part Number para ver sus procesos</p>
            </div>
          )}
        </>
      )}
      
      {mainTab === 'hc-runrate' && (
        <>
          {selectedPartNumber ? (
            <>
              {/* Header con información del Part Number */}
              <div className="bg-white rounded-lg shadow-lg border p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <button 
                      onClick={() => setMainTab('processes')}
                      className="mr-4 text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Head Count - Run Rate para: <span className="text-blue-600">{selectedPartNumber.id}</span>
                    </h2>
                  </div>
                  <button
                    onClick={handleCreateHCRunRateConfig}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Configuración
                  </button>
                </div>
                
                {/* Información del Part Number */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Nombre</p>
                    <p className="text-sm font-semibold">{selectedPartNumber.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Value Stream</p>
                    <p className="text-sm font-semibold">
                      {valueStreams.find(vs => vs.id === selectedPartNumber.valueStream)?.name || selectedPartNumber.valueStream}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Línea</p>
                    <p className="text-sm font-semibold">
                      {lines.find(l => l.id === selectedPartNumber.line)?.name || selectedPartNumber.line}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Formulario para nueva configuración */}
              <div className="bg-white rounded-lg shadow-lg border p-6 mb-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Calcular nueva configuración</h3>
                
                <div className="flex items-center space-x-4">
                  <div className="w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total de Personal (HC)
                    </label>
                    <input
                      type="number"
                      value={totalPersonnel}
                      onChange={(e) => setTotalPersonnel(Number(e.target.value))}
                      min={1}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleCreateHCRunRateConfig}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 mt-5"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calcular y Guardar
                  </button>
                </div>
              </div>
              
              {/* Tabla de Configuraciones */}
              <div className="bg-white rounded-lg shadow-lg border p-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Configuraciones Guardadas</h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Head Count
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Run Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cuello de Botella
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredConfigs.map((config, idx) => (
                        <tr 
                          key={config.id} 
                          className={`${selectedConfig?.id === config.id ? 'bg-blue-50' : (idx % 2 === 0 ? 'bg-white' : 'bg-gray-50')} hover:bg-gray-100 cursor-pointer`}
                          onClick={() => handleSelectConfig(config)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{config.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 font-medium">
                            {config.headCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 font-bold">
                            {config.runRate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {config.bottleneck}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                            {config.createdAt.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectConfig(config);
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Ver
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteConfig(config.id);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredConfigs.length === 0 && (
                  <div className="py-4 text-center text-gray-500">
                    No hay configuraciones guardadas para este part number.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-lg border p-6 flex items-center justify-center h-64">
              <p className="text-gray-500">Seleccione un Part Number para ver las configuraciones HC-Run Rate</p>
            </div>
          )}
        </>
      )}
      
      {mainTab === 'balance' && (
        <>
          {selectedPartNumber && balanceConfig && selectedConfig ? (
            <>
              {/* Header con información del Part Number */}
              <div className="bg-white rounded-lg shadow-lg border p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <button 
                      onClick={() => setMainTab('hc-runrate')}
                      className="mr-4 text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Balance Operativo: <span className="text-blue-600">{selectedPartNumber.id}</span>
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      HC: {selectedConfig.headCount}
                    </span>
                    <span className="text-sm font-semibold px-3 py-1 bg-green-100 text-green-800 rounded-full">
                      Run Rate: {selectedConfig.runRate}
                    </span>
                  </div>
                </div>
                
                {/* Información general del balance */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Nombre</p>
                    <p className="text-sm font-semibold">{selectedPartNumber.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Línea</p>
                    <p className="text-sm font-semibold">
                      {lines.find(l => l.id === selectedPartNumber.line)?.name || selectedPartNumber.line}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cuello de Botella</p>
                    <p className="text-sm font-semibold">{balanceConfig.bottleneck}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fecha</p>
                    <p className="text-sm font-semibold">{selectedConfig.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              {/* Gráfico */}
              <div className="bg-white rounded-lg shadow-lg border p-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Gráfico de Balance</h3>
                
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={prepareChartData()}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 40,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                      >
                        <Label value="Procesos" offset={-20} position="insideBottom" />
                      </XAxis>
                      <YAxis 
                        yAxisId="left"
                        orientation="left"
                        domain={[0, 'dataMax + 20']}
                        label={{ value: 'Tiempo (seg)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        domain={[0, 'dataMax + 20']}
                        tickFormatter={(value) => ''}
                      />
                      <Tooltip 
                        formatter={(value: any, name: string, props: any) => {
                          if (name === 'tiempoManual') return [`${value} seg`, 'Tiempo Manual'];
                          if (name === 'flowTime') return [`${value} seg`, 'Flow Time'];
                          return [value, name];
                        }}
                        labelFormatter={(label: string) => {
                          const item = prepareChartData().find(item => item.name === label);
                          return `${label}: ${item?.fullName}`;
                        }}
                      />
                      <Legend 
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ paddingTop: 20 }}
                        iconSize={15}
                        iconType="circle"
                        formatter={(value, entry) => (
                          <span style={{ color: '#333', marginRight: 15, padding: '0 10px' }}>{value}</span>
                        )}
                      />
                      <Bar 
                        yAxisId="left" 
                        dataKey="tiempoManual" 
                        name="Tiempo Manual" 
                        fill="#1e4d8c"
                        radius={[4, 4, 0, 0]}
                      >
                        <LabelList dataKey="tiempoManual" position="top" fill="#000" fontSize={11} />
                      </Bar>
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="flowTime" 
                        name="Flow Time" 
                        stroke="#e53e3e" 
                        strokeWidth={2} 
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                      >
                        <LabelList dataKey="flowTime" position="top" fill="#e53e3e" fontSize={11} />
                      </Line>
                      
                      {/* Línea de referencia para el cuello de botella */}
                      {prepareChartData().map((item, index) => (
                        item.isCuelloBottela && (
                          <ReferenceLine
                            key={`ref-${index}`}
                            x={item.name}
                            yAxisId="left"
                            stroke="#0694a2"
                            strokeWidth={2}
                            strokeDasharray="3 3"
                          >
                            <Label 
                              value="Cuello de Botella" 
                              position="top" 
                              fill="#0694a2" 
                              fontSize={12}
                            />
                          </ReferenceLine>
                        )
                      ))}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Leyenda de abreviaturas */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Referencia de Procesos</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                    {prepareChartData().map((item, idx) => (
                      <div 
                        key={`legend-${idx}`} 
                        className={`py-1 px-2 rounded ${item.isCuelloBottela ? 'bg-blue-100' : 'bg-gray-50'}`}
                      >
                        <span className="font-semibold">{item.name}:</span> {item.fullName} 
                        {item.isCuelloBottela && <span className="text-blue-600 font-medium ml-1">(Cuello)</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Tabla de Personal */}
              <div className="bg-white rounded-lg shadow-lg border p-6 mt-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Distribución de Personal</h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Proceso
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cantidad de Operarios
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tiempo Manual (seg)
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unidades por Hora
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Flow Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {balanceConfig.processes.map((process, idx) => (
                        <tr 
                          key={process.processId} 
                          className={`${process.name === balanceConfig.bottleneck 
                            ? 'bg-blue-100' 
                            : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {process.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 font-medium">
                            {process.assignedPersonnel.toFixed(1)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                            {Math.round(process.manualTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 font-bold">
                            {process.unitsPerHour}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                            {process.flowTime}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-lg border p-6 flex items-center justify-center h-64">
              <p className="text-gray-500">Seleccione una configuración HC-Run Rate para ver el balance detallado</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// CSS para texto vertical en la tabla
const styles = `
  .writing-vertical {
    position: relative;
  }
  .writing-vertical span {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    display: inline-block;
    white-space: nowrap;
  }
`;

// Agregar estilos al componente
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet); 