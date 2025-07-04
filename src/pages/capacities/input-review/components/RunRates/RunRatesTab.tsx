import React, { useState, useEffect } from 'react';
import { Calculator, Plus, TrendingUp, Users, Settings, BarChart3, ChevronDown, ChevronUp, Eye, Edit, Trash2, Save } from 'lucide-react';

// Interfaces
interface ProcessStep {
  id: string;
  name: string;
  cycleTime: number; // seconds
  stations: number;
  manualTime: number;
}

interface RunRateScenario {
  id: string;
  headCount: number;
  runRate: number;
  bottleneck: string;
  utilizationPercentage: number;
  processDistribution: ProcessBalance[];
  createdAt: string;
  status: 'draft' | 'approved' | 'active';
  createdBy?: string;
  approvedBy?: string;
  approvedAt?: string;
}

interface ProcessBalance {
  processId: string;
  name: string;
  assignedPersonnel: number;
  unitsPerHour: number;
  flowTime: number;
  isCritical: boolean;
}

interface RunRateConfiguration {
  id: string;
  partNumber: string;
  partDescription: string;
  valueStream: string;
  line: string;
  laborStd: number;
  processes: ProcessStep[];
  scenarios: RunRateScenario[];
  baselineHC: number;
  baselineRunRate: number;
  status: 'pending' | 'approved' | 'active';
  lastUpdated: string;
}

interface RunRatesTabProps {
  onSave?: () => void;
  selectedValueStream?: string;
}

// Mock data - en producción vendría de la API integrada con BalanceLinea
const mockRunRateConfigurations: RunRateConfiguration[] = [
  {
    id: 'rr-001',
    partNumber: '86990',
    partDescription: 'Wound Care Device Assembly',
    valueStream: 'WOUND',
    line: 'L06',
    laborStd: 0.042,
    baselineHC: 24,
    baselineRunRate: 157,
    status: 'approved',
    lastUpdated: '2024-01-15T10:30:00Z',
    processes: [
      { id: 'p1', name: 'Pegado de caracol', cycleTime: 4, stations: 1, manualTime: 4 },
      { id: 'p2', name: 'Soldadura', cycleTime: 22, stations: 1, manualTime: 22 },
      { id: 'p3', name: 'Quemado de pantalon', cycleTime: 16, stations: 1, manualTime: 16 },
      { id: 'p4', name: 'Pegado de manguera', cycleTime: 21, stations: 1, manualTime: 21 },
      { id: 'p5', name: 'Armado', cycleTime: 52, stations: 3, manualTime: 52 },
      { id: 'p6', name: 'IV-SET', cycleTime: 22, stations: 2, manualTime: 22 },
      { id: 'p7', name: 'Leak Test + Retrabajos', cycleTime: 23, stations: 1, manualTime: 23 }
    ],
    scenarios: [
      {
        id: 's1',
        headCount: 22,
        runRate: 149,
        bottleneck: 'Soldadura',
        utilizationPercentage: 92,
        status: 'approved',
        createdAt: '2024-01-10T09:15:00Z',
        createdBy: 'engineering@company.com',
        approvedBy: 'supervisor@company.com',
        approvedAt: '2024-01-12T14:30:00Z',
        processDistribution: [
          { processId: 'p1', name: 'Pegado de caracol', assignedPersonnel: 2.1, unitsPerHour: 1890, flowTime: 1.9, isCritical: false },
          { processId: 'p2', name: 'Soldadura', assignedPersonnel: 3.2, unitsPerHour: 149, flowTime: 6.9, isCritical: true },
          { processId: 'p3', name: 'Quemado de pantalon', assignedPersonnel: 2.8, unitsPerHour: 630, flowTime: 5.7, isCritical: false },
          { processId: 'p4', name: 'Pegado de manguera', assignedPersonnel: 3.1, unitsPerHour: 534, flowTime: 6.8, isCritical: false },
          { processId: 'p5', name: 'Armado', assignedPersonnel: 7.2, unitsPerHour: 498, flowTime: 7.2, isCritical: false },
          { processId: 'p6', name: 'IV-SET', assignedPersonnel: 2.8, unitsPerHour: 457, flowTime: 7.9, isCritical: false },
          { processId: 'p7', name: 'Leak Test + Retrabajos', assignedPersonnel: 0.8, unitsPerHour: 627, flowTime: 28.8, isCritical: false }
        ]
      },
      {
        id: 's2',
        headCount: 24,
        runRate: 157,
        bottleneck: 'Leak Test + Retrabajos',
        utilizationPercentage: 95,
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z',
        createdBy: 'engineering@company.com',
        processDistribution: [
          { processId: 'p1', name: 'Pegado de caracol', assignedPersonnel: 2.3, unitsPerHour: 2070, flowTime: 1.7, isCritical: false },
          { processId: 'p2', name: 'Soldadura', assignedPersonnel: 3.5, unitsPerHour: 573, flowTime: 6.3, isCritical: false },
          { processId: 'p3', name: 'Quemado de pantalon', assignedPersonnel: 3.0, unitsPerHour: 675, flowTime: 5.3, isCritical: false },
          { processId: 'p4', name: 'Pegado de manguera', assignedPersonnel: 3.4, unitsPerHour: 584, flowTime: 6.2, isCritical: false },
          { processId: 'p5', name: 'Armado', assignedPersonnel: 7.8, unitsPerHour: 540, flowTime: 6.7, isCritical: false },
          { processId: 'p6', name: 'IV-SET', assignedPersonnel: 3.1, unitsPerHour: 508, flowTime: 7.1, isCritical: false },
          { processId: 'p7', name: 'Leak Test + Retrabajos', assignedPersonnel: 0.9, unitsPerHour: 157, flowTime: 25.6, isCritical: true }
        ]
      },
      {
        id: 's3',
        headCount: 26,
        runRate: 165,
        bottleneck: 'Armado',
        utilizationPercentage: 98,
        status: 'draft',
        createdAt: '2024-01-20T08:45:00Z',
        createdBy: 'engineering@company.com',
        processDistribution: [
          { processId: 'p1', name: 'Pegado de caracol', assignedPersonnel: 2.5, unitsPerHour: 2250, flowTime: 1.6, isCritical: false },
          { processId: 'p2', name: 'Soldadura', assignedPersonnel: 3.8, unitsPerHour: 622, flowTime: 5.8, isCritical: false },
          { processId: 'p3', name: 'Quemado de pantalon', assignedPersonnel: 3.2, unitsPerHour: 720, flowTime: 5.0, isCritical: false },
          { processId: 'p4', name: 'Pegado de manguera', assignedPersonnel: 3.6, unitsPerHour: 618, flowTime: 5.8, isCritical: false },
          { processId: 'p5', name: 'Armado', assignedPersonnel: 8.4, unitsPerHour: 165, flowTime: 6.2, isCritical: true },
          { processId: 'p6', name: 'IV-SET', assignedPersonnel: 3.4, unitsPerHour: 557, flowTime: 6.5, isCritical: false },
          { processId: 'p7', name: 'Leak Test + Retrabajos', assignedPersonnel: 1.1, unitsPerHour: 172, flowTime: 20.9, isCritical: false }
        ]
      }
    ]
  },
  {
    id: 'rr-002',
    partNumber: '10600',
    partDescription: 'Sports Medicine Implant',
    valueStream: 'SM',
    line: 'L01',
    laborStd: 0.027,
    baselineHC: 3,
    baselineRunRate: 231,
    status: 'pending',
    lastUpdated: '2024-01-18T14:20:00Z',
    processes: [
      { id: 'p8', name: 'Preparación inicial', cycleTime: 18, stations: 1, manualTime: 18 },
      { id: 'p9', name: 'Ensamblaje', cycleTime: 35, stations: 2, manualTime: 35 },
      { id: 'p10', name: 'Prueba de calidad', cycleTime: 15, stations: 1, manualTime: 15 }
    ],
    scenarios: [
      {
        id: 's4',
        headCount: 3,
        runRate: 231,
        bottleneck: 'Ensamblaje',
        utilizationPercentage: 88,
        status: 'approved',
        createdAt: '2024-01-15T11:00:00Z',
        processDistribution: [
          { processId: 'p8', name: 'Preparación inicial', assignedPersonnel: 0.8, unitsPerHour: 160, flowTime: 22.5, isCritical: false },
          { processId: 'p9', name: 'Ensamblaje', assignedPersonnel: 1.5, unitsPerHour: 231, flowTime: 23.3, isCritical: true },
          { processId: 'p10', name: 'Prueba de calidad', assignedPersonnel: 0.7, unitsPerHour: 336, flowTime: 21.4, isCritical: false }
        ]
      },
      {
        id: 's5',
        headCount: 4,
        runRate: 257,
        bottleneck: 'Prueba de calidad',
        utilizationPercentage: 91,
        status: 'draft',
        createdAt: '2024-01-18T14:20:00Z',
        processDistribution: [
          { processId: 'p8', name: 'Preparación inicial', assignedPersonnel: 1.1, unitsPerHour: 220, flowTime: 16.4, isCritical: false },
          { processId: 'p9', name: 'Ensamblaje', assignedPersonnel: 2.0, unitsPerHour: 308, flowTime: 17.5, isCritical: false },
          { processId: 'p10', name: 'Prueba de calidad', assignedPersonnel: 0.9, unitsPerHour: 257, flowTime: 16.7, isCritical: true }
        ]
      }
    ]
  }
];

const valueStreams = [
  { id: 'SM', name: 'Sports Medicine' },
  { id: 'ENT', name: 'Ear, Nose & Throat' },
  { id: 'WOUND', name: 'Wound Management' },
  { id: 'ORTHO', name: 'Orthopaedics' },
  { id: 'TRAUMA', name: 'Trauma' },
  { id: 'RECON', name: 'Reconstruction' }
];

// Calculation functions (simplified from BalanceLinea.tsx)
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

const RunRatesTab: React.FC<RunRatesTabProps> = ({ onSave, selectedValueStream = 'all' }) => {
  const [configurations, setConfigurations] = useState<RunRateConfiguration[]>(mockRunRateConfigurations);
  const [expandedConfig, setExpandedConfig] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<RunRateConfiguration | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'scenario'>('list');
  const [selectedScenario, setSelectedScenario] = useState<RunRateScenario | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'active'>('all');

  // Filter configurations
  const filteredConfigurations = configurations.filter(config => {
    const matchesSearch = searchTerm === '' || 
      config.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.partDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesValueStream = selectedValueStream === 'all' || config.valueStream === selectedValueStream;
    const matchesStatus = statusFilter === 'all' || config.status === statusFilter;
    
    return matchesSearch && matchesValueStream && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 95) return 'text-green-600';
    if (percentage >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleConfigSelect = (config: RunRateConfiguration) => {
    setSelectedConfig(config);
    setViewMode('detail');
  };

  const handleScenarioSelect = (scenario: RunRateScenario) => {
    setSelectedScenario(scenario);
    setViewMode('scenario');
  };

  const handleApproveScenario = (scenarioId: string) => {
    setConfigurations(prev => prev.map(config => ({
      ...config,
      scenarios: config.scenarios.map(scenario => 
        scenario.id === scenarioId 
          ? { ...scenario, status: 'approved', approvedBy: 'current_user@company.com', approvedAt: new Date().toISOString() }
          : scenario
      )
    })));
  };

  const generateNewScenario = (config: RunRateConfiguration, headCount: number): RunRateScenario => {
    // Simple distribution based on cycle time proportion
    const totalCycleTime = config.processes.reduce((sum, p) => sum + p.cycleTime, 0);
    
    const processDistribution: ProcessBalance[] = config.processes.map(process => {
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
    const bottleneck = findBottleneck(processDistribution);
    const runRate = calculateRunRate(processDistribution);

    // Mark critical process
    processDistribution.forEach(p => {
      p.isCritical = p.name === bottleneck;
    });

    const utilizationPercentage = Math.min(98, Math.max(75, Math.round(85 + Math.random() * 15)));

    return {
      id: `s${Date.now()}`,
      headCount,
      runRate,
      bottleneck,
      utilizationPercentage,
      processDistribution,
      status: 'draft',
      createdAt: new Date().toISOString(),
      createdBy: 'current_user@company.com'
    };
  };

  if (viewMode === 'scenario' && selectedScenario && selectedConfig) {
    return (
      <div className="space-y-6">
        {/* Scenario Detail Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('detail')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Volver al detalle
            </button>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Escenario: {selectedScenario.headCount} HC - {selectedScenario.runRate} UPH
              </h3>
              <p className="text-sm text-gray-500">
                {selectedConfig.partNumber} - {selectedConfig.partDescription}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedScenario.status)}`}>
              {selectedScenario.status}
            </span>
            {selectedScenario.status === 'draft' && (
              <button
                onClick={() => handleApproveScenario(selectedScenario.id)}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Aprobar
              </button>
            )}
          </div>
        </div>

        {/* Scenario Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Head Count</p>
                <p className="text-lg font-semibold text-gray-900">{selectedScenario.headCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Run Rate</p>
                <p className="text-lg font-semibold text-gray-900">{selectedScenario.runRate} UPH</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Utilización</p>
                <p className={`text-lg font-semibold ${getUtilizationColor(selectedScenario.utilizationPercentage)}`}>
                  {selectedScenario.utilizationPercentage}%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Cuello de Botella</p>
                <p className="text-sm font-semibold text-gray-900">{selectedScenario.bottleneck}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Process Distribution Table */}
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">Distribución de Procesos</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proceso
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Personal Asignado
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unidades/Hora
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flow Time (seg)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedScenario.processDistribution.map((process) => (
                  <tr 
                    key={process.processId} 
                    className={process.isCritical ? 'bg-red-50' : 'bg-white'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {process.name}
                      {process.isCritical && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Cuello de Botella
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {process.assignedPersonnel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                      {process.unitsPerHour}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {process.flowTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
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
        </div>
      </div>
    );
  }

  if (viewMode === 'detail' && selectedConfig) {
    return (
      <div className="space-y-6">
        {/* Detail Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('list')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Volver a la lista
            </button>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {selectedConfig.partNumber} - {selectedConfig.partDescription}
              </h3>
              <p className="text-sm text-gray-500">
                {valueStreams.find(vs => vs.id === selectedConfig.valueStream)?.name} - {selectedConfig.line}
              </p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedConfig.status)}`}>
            {selectedConfig.status}
          </span>
        </div>

        {/* Configuration Info */}
        <div className="bg-white rounded-lg border p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Información de Configuración</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Labor STD</p>
              <p className="text-lg font-semibold text-gray-900">{selectedConfig.laborStd}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Baseline HC</p>
              <p className="text-lg font-semibold text-gray-900">{selectedConfig.baselineHC}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Baseline Run Rate</p>
              <p className="text-lg font-semibold text-gray-900">{selectedConfig.baselineRunRate} UPH</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Última Actualización</p>
              <p className="text-sm text-gray-900">{new Date(selectedConfig.lastUpdated).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">Pasos del Proceso</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proceso
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiempo de Ciclo (seg)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estaciones
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiempo Manual (seg)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedConfig.processes.map((process, index) => (
                  <tr key={process.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {process.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {process.cycleTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {process.stations}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {process.manualTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scenarios */}
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h4 className="text-lg font-medium text-gray-900">Escenarios de Run Rate</h4>
            <button
              onClick={() => {
                const newScenario = generateNewScenario(selectedConfig, selectedConfig.baselineHC + 2);
                setConfigurations(prev => prev.map(config => 
                  config.id === selectedConfig.id 
                    ? { ...config, scenarios: [...config.scenarios, newScenario] }
                    : config
                ));
              }}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Escenario
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Head Count
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Run Rate (UPH)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilización %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuello de Botella
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedConfig.scenarios.map((scenario, index) => (
                  <tr key={scenario.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                      {scenario.headCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-900">
                      {scenario.runRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`font-medium ${getUtilizationColor(scenario.utilizationPercentage)}`}>
                        {scenario.utilizationPercentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {scenario.bottleneck}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(scenario.status)}`}>
                        {scenario.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleScenarioSelect(scenario)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {scenario.status === 'draft' && (
                        <button
                          onClick={() => handleApproveScenario(scenario.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Run Rates - Análisis de Balance de Línea</h3>
        {onSave && (
          <button 
            onClick={onSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar Part Number
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Part Number o descripción..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="approved">Aprobado</option>
              <option value="active">Activo</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Configuración
            </button>
          </div>
        </div>
      </div>

      {/* Configurations List */}
      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Part Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value Stream
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Baseline HC
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Baseline Run Rate
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Escenarios
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredConfigurations.map((config, index) => (
                <tr key={config.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{config.partNumber}</div>
                      <div className="text-sm text-gray-500">{config.partDescription}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {valueStreams.find(vs => vs.id === config.valueStream)?.name}
                    </div>
                    <div className="text-sm text-gray-500">{config.line}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                    {config.baselineHC}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-900">
                    {config.baselineRunRate} UPH
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {config.scenarios.length} escenarios
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(config.status)}`}>
                      {config.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => handleConfigSelect(config)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 mr-3">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredConfigurations.length === 0 && (
          <div className="text-center py-12">
            <Calculator className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay configuraciones</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comience creando una nueva configuración de Run Rate.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Configuración
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RunRatesTab; 