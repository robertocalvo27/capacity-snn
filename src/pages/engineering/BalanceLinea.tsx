import { useState, useEffect } from 'react';
import { Calculator, Database, BarChart2, Settings, Layers, ArrowLeft, Table, Plus, Save, FileText } from 'lucide-react';
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

// Tipo para los modelos de optimización
type OptimizationModelType = 
  | 'balanced' // Balanceo uniforme (UPH iguales)
  | 'maxRunRate' // Maximización del Run Rate
  | 'critical' // Optimización por criticidad
  | 'minCost' // Minimización de costos
  | 'multiObjective' // Optimización multi-objetivo
  | 'custom'; // Personalizado

interface OptimizationModel {
  type: OptimizationModelType;
  name: string;
  description: string;
  processes: ProcessBalance[];
  runRate: number;
  bottleneck: string;
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
const calculateManualTime = (cycleTime: number): number => {
  // El tiempo manual es igual al cycle time (tiempo estático por proceso)
  return cycleTime;
};

const calculateUnitsPerHour = (manualTime: number, operators: number): number => {
  // Si no hay operadores asignados o el tiempo manual es 0, retornar 0 para evitar divisiones por cero
  if (operators === 0 || manualTime === 0) return 0;
  
  // UPH = 3600 / (Tiempo Manual/Cantidad de Operarios)
  return Math.round(3600 / (manualTime / operators));
};

const calculateFlowTime = (manualTime: number, operators: number): number => {
  // Si no hay operarios asignados, evitar división por cero
  if (operators === 0) return 0;
  
  // Flow Time = Tiempo Manual / Cantidad de Operarios
  return Math.round((manualTime / operators) * 100) / 100; // Redondear a 2 decimales
};

const findBottleneck = (processes: ProcessBalance[]): string => {
  if (processes.length === 0) return '';
  
  // Encontrar el proceso con el UPH más bajo
  const bottleneck = processes.reduce((prev, current) => {
    return prev.unitsPerHour < current.unitsPerHour ? prev : current;
  });
  
  return bottleneck.name;
};

const calculateRunRate = (processes: ProcessBalance[]): number => {
  if (processes.length === 0) return 0;
  
  // El Run Rate es el valor mínimo de las unidades por hora de todos los procesos
  const runRate = Math.min(...processes.map(process => process.unitsPerHour));
  
  return runRate;
};

// Función para optimización con balanceo uniforme (UPH iguales)
const optimizeBalanced = (processes: Process[], totalPersonnel: number): OptimizationModel => {
  // Distribuir personal para que todos los procesos tengan aproximadamente el mismo UPH
  // Nota: Las variables targetUPH y remainingPersonnel se han eliminado ya que no se utilizan
  // en la implementación actual del algoritmo de distribución
  
  // Calcular el tiempo manual total
  const totalManualTime = processes.reduce((sum, process) => sum + process.cycleTime, 0);
  
  // Distribuir personal proporcionalmente al tiempo de ciclo
  const balancedProcesses = processes.map(process => {
    // Calcular la proporción de personal para este proceso
    const proportion = process.cycleTime / totalManualTime;
    let assignedPersonnel = totalPersonnel * proportion;
    
    // Redondear a 2 decimales
    assignedPersonnel = Math.round(assignedPersonnel * 100) / 100;
    
    const manualTime = calculateManualTime(process.cycleTime);
    const flowTime = calculateFlowTime(manualTime, assignedPersonnel);
    const unitsPerHour = calculateUnitsPerHour(manualTime, assignedPersonnel);
    
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
  
  // Encontrar el cuello de botella
  const bottleneck = findBottleneck(balancedProcesses);
  // Calcular el Run Rate
  const runRate = calculateRunRate(balancedProcesses);
  
  return {
    type: 'balanced',
    name: 'Balanceo Uniforme',
    description: 'Distribución proporcional al tiempo de ciclo para balancear la línea',
    processes: balancedProcesses,
    runRate,
    bottleneck
  };
};

// Función para optimización maximizando el Run Rate
const optimizeMaxRunRate = (processes: Process[], totalPersonnel: number): OptimizationModel => {
  // Primero crear una distribución inicial básica
  let optimizedProcesses = processes.map(process => {
    const manualTime = calculateManualTime(process.cycleTime);
    // Asignar un valor mínimo inicial
    const assignedPersonnel = 0.1;
    const flowTime = calculateFlowTime(manualTime, assignedPersonnel);
    const unitsPerHour = calculateUnitsPerHour(manualTime, assignedPersonnel);
    
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
  
  // Distribuir el personal restante iterativamente al cuello de botella
  let remainingPersonnel = totalPersonnel - optimizedProcesses.reduce((sum, p) => sum + p.assignedPersonnel, 0);
  
  // Iteraciones para mejorar el Run Rate
  const iterations = 50; // Número máximo de iteraciones
  
  for (let i = 0; i < iterations && remainingPersonnel > 0.01; i++) {
    // Encontrar el proceso con menor UPH (cuello de botella)
    const bottleneckIndex = optimizedProcesses.findIndex(p => 
      p.unitsPerHour === Math.min(...optimizedProcesses.map(p => p.unitsPerHour)));
    
    if (bottleneckIndex === -1) break;
    
    // Asignar más personal al cuello de botella (incremento pequeño)
    const increment = Math.min(0.1, remainingPersonnel);
    const newAssignedPersonnel = optimizedProcesses[bottleneckIndex].assignedPersonnel + increment;
    
    // Actualizar el proceso
    const manualTime = optimizedProcesses[bottleneckIndex].manualTime;
    const newUnitsPerHour = calculateUnitsPerHour(manualTime, newAssignedPersonnel);
    const newFlowTime = calculateFlowTime(manualTime, newAssignedPersonnel);
    
    optimizedProcesses[bottleneckIndex] = {
      ...optimizedProcesses[bottleneckIndex],
      assignedPersonnel: newAssignedPersonnel,
      unitsPerHour: newUnitsPerHour,
      flowTime: newFlowTime
    };
    
    // Actualizar el personal restante
    remainingPersonnel -= increment;
  }
  
  // Si queda personal, distribuirlo proporcionalmente
  if (remainingPersonnel > 0.01) {
    const totalCurrentPersonnel = optimizedProcesses.reduce((sum, p) => sum + p.assignedPersonnel, 0);
    
    optimizedProcesses = optimizedProcesses.map(process => {
      const proportion = process.assignedPersonnel / totalCurrentPersonnel;
      const additionalPersonnel = remainingPersonnel * proportion;
      const newAssignedPersonnel = process.assignedPersonnel + additionalPersonnel;
      
      const newUnitsPerHour = calculateUnitsPerHour(process.manualTime, newAssignedPersonnel);
      const newFlowTime = calculateFlowTime(process.manualTime, newAssignedPersonnel);
      
      return {
        ...process,
        assignedPersonnel: Math.round(newAssignedPersonnel * 100) / 100,
        unitsPerHour: newUnitsPerHour,
        flowTime: newFlowTime
      };
    });
  }
  
  // Encontrar el cuello de botella final
  const bottleneck = findBottleneck(optimizedProcesses);
  // Calcular el Run Rate final
  const runRate = calculateRunRate(optimizedProcesses);
  
  return {
    type: 'maxRunRate',
    name: 'Maximización del Run Rate',
    description: 'Distribución que maximiza la producción total enfocándose en el cuello de botella',
    processes: optimizedProcesses,
    runRate,
    bottleneck
  };
};

// Función para optimización por criticidad de proceso
const optimizeCritical = (processes: Process[], totalPersonnel: number): OptimizationModel => {
  // Asignar factores de criticidad (en un caso real, estos vendrían de datos o configuración)
  const criticalityFactors: {[key: string]: number} = {};
  
  // Asignar factores de criticidad basados en el nombre del proceso (simulado)
  processes.forEach(process => {
    // Asignar mayor criticidad a procesos que contengan palabras clave
    if (process.name.toLowerCase().includes('calidad')) {
      criticalityFactors[process.id] = 3; // Alta criticidad
    } else if (process.name.toLowerCase().includes('ensamblaje')) {
      criticalityFactors[process.id] = 2; // Media criticidad
    } else {
      criticalityFactors[process.id] = 1; // Criticidad estándar
    }
  });
  
  // Calcular el total de factores de criticidad
  const totalCriticality = processes.reduce((sum, process) => sum + (criticalityFactors[process.id] || 1), 0);
  
  // Distribuir personal según criticidad
  const criticalProcesses = processes.map(process => {
    const criticalityFactor = criticalityFactors[process.id] || 1;
    const proportion = criticalityFactor / totalCriticality;
    let assignedPersonnel = totalPersonnel * proportion;
    
    // Redondear a 2 decimales
    assignedPersonnel = Math.round(assignedPersonnel * 100) / 100;
    
    const manualTime = calculateManualTime(process.cycleTime);
    const flowTime = calculateFlowTime(manualTime, assignedPersonnel);
    const unitsPerHour = calculateUnitsPerHour(manualTime, assignedPersonnel);
    
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
  
  // Encontrar el cuello de botella
  const bottleneck = findBottleneck(criticalProcesses);
  // Calcular el Run Rate
  const runRate = calculateRunRate(criticalProcesses);
  
  return {
    type: 'critical',
    name: 'Optimización por Criticidad',
    description: 'Distribución basada en la importancia relativa de cada proceso',
    processes: criticalProcesses,
    runRate,
    bottleneck
  };
};

// Función para optimización de minimización de costos
const optimizeMinCost = (processes: Process[], totalPersonnel: number): OptimizationModel => {
  // Definir costos por hora para diferentes tipos de procesos (simulado)
  const costPerHour: {[key: string]: number} = {};
  
  // Asignar costos basados en el nombre del proceso (simulado)
  processes.forEach(process => {
    // Asignar costos diferentes según el tipo de proceso
    if (process.name.toLowerCase().includes('calidad')) {
      costPerHour[process.id] = 15; // Mayor costo por hora (operarios especializados)
    } else if (process.name.toLowerCase().includes('ensamblaje')) {
      costPerHour[process.id] = 12; // Costo medio
    } else {
      costPerHour[process.id] = 10; // Costo estándar
    }
  });
  
  // Distribución inicial básica
  let costOptimizedProcesses = processes.map(process => {
    const manualTime = calculateManualTime(process.cycleTime);
    // Asignar un valor mínimo inicial
    const assignedPersonnel = 0.1;
    const flowTime = calculateFlowTime(manualTime, assignedPersonnel);
    const unitsPerHour = calculateUnitsPerHour(manualTime, assignedPersonnel);
    
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
  
  // Distribuir personal restante priorizando procesos con menor costo
  let remainingPersonnel = totalPersonnel - costOptimizedProcesses.reduce((sum, p) => sum + p.assignedPersonnel, 0);
  
  // Ordenar procesos por costo (de menor a mayor)
  const processesByCost = [...costOptimizedProcesses].sort((a, b) => 
    (costPerHour[a.processId] || 10) - (costPerHour[b.processId] || 10)
  );
  
  // Distribuir personal a los procesos menos costosos primero
  for (let i = 0; i < processesByCost.length && remainingPersonnel > 0.01; i++) {
    const processId = processesByCost[i].processId;
    const processIndex = costOptimizedProcesses.findIndex(p => p.processId === processId);
    
    if (processIndex === -1) continue;
    
    // Calcular cuánto personal asignar (más a los menos costosos)
    const proportion = (processesByCost.length - i) / ((processesByCost.length * (processesByCost.length + 1)) / 2);
    const additionalPersonnel = Math.min(remainingPersonnel, remainingPersonnel * proportion);
    
    // Actualizar el proceso
    const newAssignedPersonnel = costOptimizedProcesses[processIndex].assignedPersonnel + additionalPersonnel;
    const manualTime = costOptimizedProcesses[processIndex].manualTime;
    const newUnitsPerHour = calculateUnitsPerHour(manualTime, newAssignedPersonnel);
    const newFlowTime = calculateFlowTime(manualTime, newAssignedPersonnel);
    
    costOptimizedProcesses[processIndex] = {
      ...costOptimizedProcesses[processIndex],
      assignedPersonnel: Math.round(newAssignedPersonnel * 100) / 100,
      unitsPerHour: newUnitsPerHour,
      flowTime: newFlowTime
    };
    
    // Actualizar personal restante
    remainingPersonnel -= additionalPersonnel;
  }
  
  // Encontrar el cuello de botella
  const bottleneck = findBottleneck(costOptimizedProcesses);
  // Calcular el Run Rate
  const runRate = calculateRunRate(costOptimizedProcesses);
  
  return {
    type: 'minCost',
    name: 'Minimización de Costos',
    description: 'Distribución que prioriza procesos con menor costo por operario',
    processes: costOptimizedProcesses,
    runRate,
    bottleneck
  };
};

// Función para optimización multi-objetivo
const optimizeMultiObjective = (processes: Process[], totalPersonnel: number): OptimizationModel => {
  // Pesos para cada objetivo (ajustables)
  const weights = {
    runRate: 0.5,      // Importancia del Run Rate
    balance: 0.3,      // Importancia del balance entre procesos
    criticality: 0.2   // Importancia de la criticidad
  };
  
  // Factores de criticidad (simulados)
  const criticalityFactors: {[key: string]: number} = {};
  processes.forEach(process => {
    if (process.name.toLowerCase().includes('calidad')) {
      criticalityFactors[process.id] = 3;
    } else if (process.name.toLowerCase().includes('ensamblaje')) {
      criticalityFactors[process.id] = 2;
    } else {
      criticalityFactors[process.id] = 1;
    }
  });
  
  // Crear distribuciones iniciales usando los otros modelos
  const balancedModel = optimizeBalanced(processes, totalPersonnel);
  const maxRunRateModel = optimizeMaxRunRate(processes, totalPersonnel);
  const criticalModel = optimizeCritical(processes, totalPersonnel);
  
  // Combinar los resultados usando los pesos
  const multiObjectiveProcesses = processes.map(process => {
    // Encontrar el proceso correspondiente en cada modelo
    const balancedProcess = balancedModel.processes.find(p => p.processId === process.id);
    const maxRunRateProcess = maxRunRateModel.processes.find(p => p.processId === process.id);
    const criticalProcess = criticalModel.processes.find(p => p.processId === process.id);
    
    if (!balancedProcess || !maxRunRateProcess || !criticalProcess) {
      // Si no se encuentra en alguno de los modelos, usar valores por defecto
      const manualTime = calculateManualTime(process.cycleTime);
      const assignedPersonnel = totalPersonnel / processes.length;
      const flowTime = calculateFlowTime(manualTime, assignedPersonnel);
      const unitsPerHour = calculateUnitsPerHour(manualTime, assignedPersonnel);
      
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
    }
    
    // Calcular personal asignado ponderado
    const assignedPersonnel = 
      (balancedProcess.assignedPersonnel * weights.balance) +
      (maxRunRateProcess.assignedPersonnel * weights.runRate) +
      (criticalProcess.assignedPersonnel * weights.criticality);
    
    // Redondear a 2 decimales
    const roundedAssignedPersonnel = Math.round(assignedPersonnel * 100) / 100;
    
    // Calcular métricas con el personal asignado ponderado
    const manualTime = calculateManualTime(process.cycleTime);
    const flowTime = calculateFlowTime(manualTime, roundedAssignedPersonnel);
    const unitsPerHour = calculateUnitsPerHour(manualTime, roundedAssignedPersonnel);
    
    return {
      processId: process.id,
      name: process.name,
      cycleTime: process.cycleTime,
      stations: process.stations,
      assignedPersonnel: roundedAssignedPersonnel,
      manualTime,
      unitsPerHour,
      flowTime
    };
  });
  
  // Normalizar para asegurar que la suma sea exactamente el total de personal
  const currentTotal = multiObjectiveProcesses.reduce((sum, p) => sum + p.assignedPersonnel, 0);
  const normalizedProcesses = multiObjectiveProcesses.map(process => {
    const normalizedAssignedPersonnel = (process.assignedPersonnel / currentTotal) * totalPersonnel;
    const roundedAssignedPersonnel = Math.round(normalizedAssignedPersonnel * 100) / 100;
    
    // Recalcular métricas con el personal normalizado
    const manualTime = process.manualTime;
    const flowTime = calculateFlowTime(manualTime, roundedAssignedPersonnel);
    const unitsPerHour = calculateUnitsPerHour(manualTime, roundedAssignedPersonnel);
    
    return {
      ...process,
      assignedPersonnel: roundedAssignedPersonnel,
      flowTime,
      unitsPerHour
    };
  });
  
  // Encontrar el cuello de botella
  const bottleneck = findBottleneck(normalizedProcesses);
  // Calcular el Run Rate
  const runRate = calculateRunRate(normalizedProcesses);
  
  return {
    type: 'multiObjective',
    name: 'Optimización Multi-objetivo',
    description: 'Distribución balanceada que considera Run Rate, balance y criticidad',
    processes: normalizedProcesses,
    runRate,
    bottleneck
  };
};

// Función principal para generar modelos de optimización
const generateOptimizationModels = (processes: Process[], totalPersonnel: number): OptimizationModel[] => {
  if (processes.length === 0) return [];
  
  // Generar diferentes modelos de optimización
  const models: OptimizationModel[] = [
    optimizeBalanced(processes, totalPersonnel),
    optimizeMaxRunRate(processes, totalPersonnel),
    optimizeCritical(processes, totalPersonnel),
    optimizeMinCost(processes, totalPersonnel),
    optimizeMultiObjective(processes, totalPersonnel)
  ];
  
  return models;
};

// Función para distribuir personal entre procesos
const distributePersonnel = (processes: Process[], totalPersonnel: number): ProcessBalance[] => {
  // Si no hay procesos, retornar array vacío
  if (processes.length === 0) return [];
  
  // Calcular el tiempo total de ciclo para todos los procesos
  const totalCycleTime = processes.reduce((sum, process) => sum + process.cycleTime, 0);
  
  // Distribuir el personal proporcionalmente al tiempo de ciclo
  return processes.map(process => {
    // Calcular la proporción de personal para este proceso
    const proportion = process.cycleTime / totalCycleTime;
    let assignedPersonnel = totalPersonnel * proportion;
    
    // Redondear a 2 decimales para evitar problemas de precisión
    assignedPersonnel = Math.round(assignedPersonnel * 100) / 100;
    
    const manualTime = calculateManualTime(process.cycleTime);
    // Calcular unidades por hora basado en el tiempo manual y la cantidad de operarios
    const unitsPerHour = calculateUnitsPerHour(manualTime, assignedPersonnel);
    // Calcular flow time como Tiempo Manual / Cantidad de Operarios
    const flowTime = calculateFlowTime(manualTime, assignedPersonnel);
    
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
};  

// COMPONENTE PRINCIPAL
export default function BalanceLinea() {
  // Estados principales
  const [mainTab, setMainTab] = useState<'partnumbers' | 'processes' | 'hc-runrate' | 'balance'>('partnumbers');
  
  // Estados para Part Numbers
  const [partNumbers, setPartNumbers] = useState<PartNumber[]>(initialPartNumbers);
  const [searchPartNumber, setSearchPartNumber] = useState<string>('');
  const [selectedValueStreams, setSelectedValueStreams] = useState<string[]>([]);
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [editingPN, setEditingPN] = useState<PartNumber | null>(null);
  
  // Estados para Procesos
  const [processes, setProcesses] = useState<Process[]>(initialProcesses);
  const [selectedPartNumber, setSelectedPartNumber] = useState<PartNumber | null>(null);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);
  
  // Estados para Balance
  const [balanceConfig, setBalanceConfig] = useState<BalanceConfig | null>(null);
  const [totalPersonnel, setTotalPersonnel] = useState<number>(3); // Valor por defecto
  const [showPersonnelWarning, setShowPersonnelWarning] = useState<boolean>(false);
  const [personnelWarningMessage, setPersonnelWarningMessage] = useState<string>('');
  
  // Estados para modelos de optimización
  const [optimizationModels, setOptimizationModels] = useState<OptimizationModel[]>([]);
  // Estos estados se usarán en futuras implementaciones para seleccionar modelos específicos
  // const [selectedModelType, setSelectedModelType] = useState<OptimizationModelType>('balanced');
  const [showOptimizationResults, setShowOptimizationResults] = useState<boolean>(false);
  const [isOptimizationSectionExpanded, setIsOptimizationSectionExpanded] = useState<boolean>(true);
  
  // Estados para HC-Run Rate
  const [hcRunRateConfigs, setHCRunRateConfigs] = useState<HCRunRateConfig[]>(initialHCRunRateConfigs);
  const [selectedConfig, setSelectedConfig] = useState<HCRunRateConfig | null>(null);
  
  // Filtros para part numbers
  const filteredPartNumbers = partNumbers.filter(pn => {
    // Filtro por Part Number (búsqueda de texto)
    if (searchPartNumber && !pn.id.toLowerCase().includes(searchPartNumber.toLowerCase()) && 
        !pn.name.toLowerCase().includes(searchPartNumber.toLowerCase())) {
      return false;
    }
    
    // Filtro por Value Streams (multi-selección)
    if (selectedValueStreams.length > 0 && !selectedValueStreams.includes(pn.valueStream)) {
      return false;
    }
    
    // Filtro por Líneas (multi-selección)
    if (selectedLines.length > 0 && !selectedLines.includes(pn.line)) {
      return false;
    }
    
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
      valueStream: selectedValueStreams[0] || valueStreams[0].id,
      line: selectedLines[0] || '',
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
    // Actualizar el total de personal disponible al valor del Head Count del Part Number
    setTotalPersonnel(pn.headCount);
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
  
  // Estado para controlar la advertencia de actualización de Run Rate
  const [showRunRateWarning, setShowRunRateWarning] = useState<boolean>(false);
  const [processChangeInfo, setProcessChangeInfo] = useState<{process: Process, isNew: boolean} | null>(null);

  // Handler para guardar proceso
  const handleSaveProcess = (process: Process) => {
    const isExisting = processes.some(existingProcess => existingProcess.id === process.id);
    
    if (isExisting) {
      // Es una actualización de un proceso existente
      // Verificar si hay configuraciones HC-Run Rate existentes para este part number
      const hasHCRunRateConfigs = hcRunRateConfigs.some(config => 
        config.partNumberId === selectedPartNumber?.id
      );
      
      if (hasHCRunRateConfigs) {
        // Mostrar advertencia
        setProcessChangeInfo({process, isNew: false});
        setShowRunRateWarning(true);
        return;
      }
      
      // Si no hay configuraciones, actualizar normalmente
      setProcesses(prev => prev.map(item => item.id === process.id ? process : item));
    } else {
      // Es un proceso nuevo
      const newId = (processes.length + 1).toString();
      const newProcess = { ...process, id: newId };
      
      // Verificar si hay configuraciones HC-Run Rate existentes
      const hasHCRunRateConfigs = hcRunRateConfigs.some(config => 
        config.partNumberId === selectedPartNumber?.id
      );
      
      if (hasHCRunRateConfigs) {
        // Mostrar advertencia
        setProcessChangeInfo({process: newProcess, isNew: true});
        setShowRunRateWarning(true);
        return;
      }
      
      // Si no hay configuraciones, crear normalmente
      setProcesses(prev => [...prev, newProcess]);
    }
    
    setEditingProcess(null);
  };
  
  // Handler para confirmar cambios en procesos y actualizar Run Rate
  const handleConfirmProcessChange = () => {
    if (!processChangeInfo) return;
    
    if (processChangeInfo.isNew) {
      // Añadir nuevo proceso
      setProcesses(prev => [...prev, processChangeInfo.process]);
    } else {
      // Actualizar proceso existente
      setProcesses(prev => prev.map(item => 
        item.id === processChangeInfo.process.id ? processChangeInfo.process : item
      ));
    }
    
    // Cerrar modal de advertencia
    setShowRunRateWarning(false);
    setProcessChangeInfo(null);
    setEditingProcess(null);
    
    // Ir a la pestaña HC-Run Rate para recalcular
    handleViewHCRunRate();
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
    const runRate = calculateRunRate(balancedProcesses);
    
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
  
  // Handler para actualizar la cantidad de personal asignado a un proceso
  const handleUpdatePersonnel = (processId: string, value: number) => {
    if (!balanceConfig) return;
    
    // Validar que sea un número válido
    if (isNaN(value) || value < 0) return;
    
    // Crear una copia de los procesos actuales
    const updatedProcesses = [...balanceConfig.processes];
    
    // Encontrar el proceso a actualizar
    const processIndex = updatedProcesses.findIndex(p => p.processId === processId);
    if (processIndex === -1) return;
    
    // Calcular la suma actual de personal sin contar este proceso
    const currentTotal = updatedProcesses.reduce(
      (sum, p) => p.processId !== processId ? sum + p.assignedPersonnel : sum, 
      0
    );
    
    // Verificar que no exceda el total de personal disponible
    if (currentTotal + value > balanceConfig.totalPersonnel) {
      setPersonnelWarningMessage(
        `La asignación total de personal no puede exceder ${balanceConfig.totalPersonnel} operarios. ` +
        `Valor máximo permitido para este proceso: ${(balanceConfig.totalPersonnel - currentTotal).toFixed(2)}`
      );
      setShowPersonnelWarning(true);
      return;
    }
    
    // Actualizar el valor
    // El tiempo manual no cambia, es igual al cycle time
    const manualTime = updatedProcesses[processIndex].manualTime;
    // Recalcular las unidades por hora con el nuevo valor de operarios
    const newUnitsPerHour = calculateUnitsPerHour(manualTime, value);
    // Recalcular el flow time con el nuevo valor de operarios
    const newFlowTime = calculateFlowTime(manualTime, value);
    
    updatedProcesses[processIndex] = {
      ...updatedProcesses[processIndex],
      assignedPersonnel: value,
      unitsPerHour: newUnitsPerHour,
      flowTime: newFlowTime
    };
    
    // Recalcular el cuello de botella y run rate
    const bottleneck = findBottleneck(updatedProcesses);
    const runRate = calculateRunRate(updatedProcesses);
    
    // Actualizar la configuración
    setBalanceConfig({
      ...balanceConfig,
      processes: updatedProcesses,
      bottleneck,
      runRate
    });
    
    // Ocultar resultados de optimización cuando se edita manualmente
    setShowOptimizationResults(false);
  };
  
  // Handler para generar modelos de optimización
  const handleOptimize = () => {
    if (!selectedPartNumber || !balanceConfig) return;
    
    // Obtener procesos del part number seleccionado
    const partNumberProcesses = processes.filter(
      process => process.partNumberId === selectedPartNumber.id
    );
    
    // Generar modelos de optimización
    const models = generateOptimizationModels(partNumberProcesses, balanceConfig.totalPersonnel);
    setOptimizationModels(models);
    setShowOptimizationResults(true);
  };
  
  // Handler para aplicar un modelo de optimización
  const handleApplyModel = (model: OptimizationModel) => {
    if (!balanceConfig) return;
    
    // Actualizar la configuración con el modelo seleccionado
    setBalanceConfig({
      ...balanceConfig,
      processes: model.processes,
      bottleneck: model.bottleneck,
      runRate: model.runRate
    });
    
    // Ocultar resultados de optimización
    setShowOptimizationResults(false);
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
  
  // Efecto para actualizar el total de personal cuando cambia el part number seleccionado
  useEffect(() => {
    if (selectedPartNumber) {
      setTotalPersonnel(selectedPartNumber.headCount);
    }
  }, [selectedPartNumber]);
  
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
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Balance de Línea</h1>
            <p className="text-gray-500">Cálculo y optimización de balances operativos</p>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FileText className="w-4 h-4 mr-2" />
              Exportar
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </button>
          </div>
        </div>
      </div>
      
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
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Part Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por Part Number"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-3 pr-10 py-2"
                    value={searchPartNumber}
                    onChange={(e) => setSearchPartNumber(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value Stream</label>
                <div className="relative">
                  <div className="flex items-center space-x-2">
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          // Crear una copia del array actual y añadir el nuevo valor
                          const newValues = [...selectedValueStreams, e.target.value];
                          setSelectedValueStreams(newValues);
                          // Resetear el valor del select
                          setTimeout(() => {
                            e.target.value = "";
                          }, 0);
                        }
                      }}
                    >
                      <option value="">Seleccionar Value Stream...</option>
                      {valueStreams
                        .filter(vs => !selectedValueStreams.includes(vs.id))
                        .map(vs => (
                          <option key={vs.id} value={vs.id}>{vs.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedValueStreams.map(vsId => (
                      <span key={vsId} className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        <span className="mr-1">
                          {valueStreams.find(vs => vs.id === vsId)?.name || vsId}
                        </span>
                        <button 
                          type="button" 
                          className="ml-1 inline-flex text-blue-500 hover:text-blue-700"
                          onClick={() => setSelectedValueStreams(prev => prev.filter(id => id !== vsId))}
                        >
                          <span className="sr-only">Remove</span>
                          <span className="text-lg font-bold">×</span>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Línea</label>
                <div className="flex items-center space-x-2">
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        // Crear una copia del array actual y añadir el nuevo valor
                        const newValues = [...selectedLines, e.target.value];
                        setSelectedLines(newValues);
                        // Resetear el valor del select
                        setTimeout(() => {
                          e.target.value = "";
                        }, 0);
                      }
                    }}
                  >
                    <option value="">Seleccionar Línea...</option>
                    {lines
                      .filter(line => 
                        (!selectedValueStreams.length || selectedValueStreams.includes(line.valueStream)) && 
                        !selectedLines.includes(line.id)
                      )
                      .map(line => (
                        <option key={line.id} value={line.id}>{line.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedLines.map(lineId => (
                    <span key={lineId} className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                      <span className="mr-1">
                        {lines.find(line => line.id === lineId)?.name || lineId}
                      </span>
                      <button 
                        type="button" 
                        className="ml-1 inline-flex text-green-500 hover:text-green-700"
                        onClick={() => setSelectedLines(prev => prev.filter(id => id !== lineId))}
                      >
                        <span className="sr-only">Remove</span>
                        <span className="text-lg font-bold">×</span>
                      </button>
                    </span>
                  ))}
                </div>
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
                      {filteredProcesses.length > 0 && (
                        <tr className="bg-gray-100 font-semibold">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Total
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {filteredProcesses.length} procesos
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {filteredProcesses.reduce((sum, process) => sum + process.cycleTime, 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {filteredProcesses.reduce((sum, process) => sum + process.stations, 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            {/* Celda vacía para la columna de acciones */}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {filteredProcesses.length === 0 && (
                  <div className="py-4 text-center text-gray-500">
                    No hay procesos registrados para este part number.
                  </div>
                )}
                
                {filteredProcesses.length > 0 && selectedPartNumber && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleViewHCRunRate()}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Calcular Run Rate
                    </button>
                  </div>
                )}
              </div>
              
              {/* Modal de advertencia para cambios en procesos */}
              {showRunRateWarning && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Advertencia: Cambio en Proceso
                      </h2>
                      <button
                        onClick={() => {
                          setShowRunRateWarning(false);
                          setProcessChangeInfo(null);
                        }}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Cerrar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            Los cambios en los procesos afectarán el Run Rate actual. 
                            Es necesario recalcular los valores de Head Count - Run Rate.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-700 mb-4">
                        ¿Desea continuar con los cambios y actualizar las configuraciones de Run Rate?
                      </p>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                          onClick={() => {
                            setShowRunRateWarning(false);
                            setProcessChangeInfo(null);
                          }}
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                          onClick={handleConfirmProcessChange}
                        >
                          Continuar y Recalcular
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
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
              {/* Header con información del Balance */}
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
                      HC: {balanceConfig.totalPersonnel}
                    </span>
                    <span className="text-sm font-semibold px-3 py-1 bg-green-100 text-green-800 rounded-full">
                      Run Rate: {balanceConfig.runRate}
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
                      {balanceConfig.processes.map((process) => (
                        <tr 
                          key={process.processId} 
                          className={process.name === balanceConfig.bottleneck ? 'bg-blue-100' : 'bg-gray-50'}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {process.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 font-medium">
                            <div className="flex items-center justify-center">
                              <input
                                type="number"
                                className="w-16 text-center border rounded py-1 px-2"
                                value={process.assignedPersonnel}
                                step="0.01"
                                min="0"
                                max={balanceConfig.totalPersonnel}
                                onChange={(e) => handleUpdatePersonnel(process.processId, parseFloat(e.target.value))}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                            {Math.round(process.manualTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 font-bold">
                            {Math.round(process.unitsPerHour)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                            {process.flowTime}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Total
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 font-bold">
                          {balanceConfig.processes.reduce((sum, p) => sum + p.assignedPersonnel, 0).toFixed(2)} / {balanceConfig.totalPersonnel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                          {Math.round(balanceConfig.processes.reduce((sum, p) => sum + p.manualTime, 0))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 font-bold">
                          {balanceConfig.runRate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                          -
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                  
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Cuello de botella:</span> {balanceConfig.bottleneck}
                  </div>
                  <div>
                    <button
                      onClick={() => handleCreateHCRunRateConfig()}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Configuración
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Sección de Modelos de Optimización (Comprimible) */}
              <div className="bg-white rounded-lg shadow-lg border p-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center cursor-pointer" onClick={() => setIsOptimizationSectionExpanded(!isOptimizationSectionExpanded)}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 text-gray-500 mr-2 transition-transform ${isOptimizationSectionExpanded ? 'transform rotate-90' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <h3 className="text-md font-semibold text-gray-900">Modelos de Optimización</h3>
                  </div>
                  <button
                    onClick={handleOptimize}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Generar Escenarios
                  </button>
                </div>
                
                {isOptimizationSectionExpanded && (
                  <div className="transition-all duration-300 ease-in-out">
                    {!showOptimizationResults ? (
                      <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <p className="text-gray-600 mb-4">Genera diferentes escenarios de distribución de personal para optimizar la producción.</p>
                        <p className="text-sm text-gray-500">Haz clic en "Generar Escenarios" para ver modelos alternativos de distribución.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {optimizationModels.map((model, index) => (
                          <div key={`model-${index}`} className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                              <div>
                                <h4 className="font-medium text-gray-900">{model.name}</h4>
                                <p className="text-sm text-gray-500">{model.description}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-semibold px-3 py-1 bg-green-100 text-green-800 rounded-full">
                                  Run Rate: {model.runRate}
                                </span>
                                <button
                                  onClick={() => handleApplyModel(model)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                  Aplicar
                                </button>
                              </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Proceso
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Operarios
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      UPH
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Flow Time
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {model.processes.map((process) => (
                                    <tr 
                                      key={process.processId} 
                                      className={process.name === model.bottleneck ? 'bg-blue-50' : 'bg-white'}
                                    >
                                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {process.name}
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                                        {process.assignedPersonnel.toFixed(2)}
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-900 font-bold">
                                        {Math.round(process.unitsPerHour)}
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                                        {process.flowTime.toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                                  <tr className="bg-gray-100 font-semibold">
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      Total
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                                      {model.processes.reduce((sum, p) => sum + p.assignedPersonnel, 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                                      {model.runRate}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                                      -
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            
                            <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600">
                              <span className="font-semibold">Cuello de botella:</span> {model.bottleneck}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Modal de advertencia para la asignación de personal */}
              {showPersonnelWarning && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Advertencia: Asignación de Personal
                      </h2>
                      <button
                        onClick={() => setShowPersonnelWarning(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Cerrar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                      
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            {personnelWarningMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                      
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                        onClick={() => setShowPersonnelWarning(false)}
                      >
                        Entendido
                      </button>
                    </div>
                  </div>
                </div>
              )}
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