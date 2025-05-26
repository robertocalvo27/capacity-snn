export type CorrectionFactorType = {
  id: string;
  name: string;
  description: string;
};

export const CORRECTION_FACTORS: CorrectionFactorType[] = [
  {
    id: 'new_operator',
    name: 'Operador Nuevo',
    description: 'Ajuste por curva de aprendizaje para nuevos operadores'
  },
  {
    id: 'process_change',
    name: 'Cambio de Proceso',
    description: 'Adaptación a modificaciones en el proceso productivo'
  },
  {
    id: 'material_variation',
    name: 'Variación de Material',
    description: 'Ajuste por cambios en las características del material'
  },
  {
    id: 'equipment_condition',
    name: 'Condición de Equipo',
    description: 'Ajuste por mantenimiento o condiciones especiales del equipo'
  },
  {
    id: 'environmental',
    name: 'Factores Ambientales',
    description: 'Ajuste por condiciones ambientales que afectan el rendimiento'
  }
];

export type ProgrammedStop = {
  name: string;
  duration: number;
  weekday: boolean;
  saturday: boolean;
};

export const PROGRAMMED_STOPS: ProgrammedStop[] = [
  { name: 'Desayuno / café', duration: 25, weekday: true, saturday: true },
  { name: 'Almuerzo / cena', duration: 35, weekday: true, saturday: false },
  { name: 'Ejercicios', duration: 5, weekday: true, saturday: false },
  { name: 'Limpieza de línea', duration: 10, weekday: true, saturday: true },
  { name: 'Cambio de orden', duration: 15, weekday: true, saturday: true },
  { name: 'Tier 1', duration: 7, weekday: true, saturday: true },
  { name: 'Cierre de turno', duration: 15, weekday: true, saturday: true },
  { name: 'Tier 1 & Limpieza de línea', duration: 17, weekday: true, saturday: true },
  { name: 'Town Hall Operaciones parte 1', duration: 60, weekday: true, saturday: false },
  { name: 'Town Hall Operaciones parte 2', duration: 30, weekday: true, saturday: false },
  { name: 'Entrenamientos', duration: 60, weekday: true, saturday: false },
  { name: 'Tecnologías del Ser', duration: 60, weekday: true, saturday: false }
];

export interface CauseEntry {
  typeCause: string;
  generalCause: string;
  specificCause: string;
  units: number | null;
}

export interface ProductionEntry {
  id: string;
  hour: string;
  endHour?: string;
  realHeadCount: number | null;
  additionalHC: number | null;
  programmedStop: string | null;
  availableTime: number;
  workOrder: string;
  partNumber: string;
  hourlyTarget: number;
  dailyProduction: number;
  delta: number;
  downtime?: number;
  causes: CauseEntry[];
  registeredAt?: Date;
  targetAdjustment?: TargetAdjustment;
  isOvertime?: boolean;
}

export interface ProductionShift {
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  valueStream: string;
  entries: ProductionEntry[];
}

export interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export interface ProductionLine {
  id: string;
  name: string;
}

export interface Leader {
  id: string;
  name: string;
  line: string;
  shift: number;
}

export interface Supervisor {
  id: string;
  name: string;
  shift: number;
  lines: string[];
}

export const PRODUCTION_LINES: ProductionLine[] = [
  { id: 'L07', name: 'Línea 07' },
  { id: 'L08', name: 'Línea 08' },
  { id: 'L09', name: 'Línea 09' }
];

export const LINE_LEADERS: Leader[] = [
  // Líderes Línea 07
  { id: 'L1', name: 'Ana Martínez', line: 'L07', shift: 1 },
  { id: 'L2', name: 'Roberto Sánchez', line: 'L07', shift: 2 },
  { id: 'L3', name: 'Carmen Ortiz', line: 'L07', shift: 3 },
  
  // Líderes Línea 08
  { id: 'L4', name: 'David López', line: 'L08', shift: 1 },
  { id: 'L5', name: 'Elena Torres', line: 'L08', shift: 2 },
  { id: 'L6', name: 'Francisco Ruiz', line: 'L08', shift: 3 },
  
  // Líderes Línea 09
  { id: 'L7', name: 'Gloria Ramírez', line: 'L09', shift: 1 },
  { id: 'L8', name: 'Hugo Morales', line: 'L09', shift: 2 },
  { id: 'L9', name: 'Isabel Flores', line: 'L09', shift: 3 }
];

export const SUPERVISORS: Supervisor[] = [
  { 
    id: 'S1', 
    name: 'Juan Pérez', 
    shift: 1,
    lines: ['L07', 'L08', 'L09']
  },
  { 
    id: 'S2', 
    name: 'María García', 
    shift: 2,
    lines: ['L07', 'L08', 'L09']
  },
  { 
    id: 'S3', 
    name: 'Carlos López', 
    shift: 3,
    lines: ['L07', 'L08', 'L09']
  }
];

export interface TargetAdjustment {
  id: string;
  factorType: string;
  description: string;
  percentage: number;
  appliedBy: string;
  appliedAt: Date;
}

export interface SupportPosition {
  id: string;
  name: string;
  defaultValue: number;
}

export const SUPPORT_POSITIONS: SupportPosition[] = [
  { id: 'leader', name: 'Líder', defaultValue: 2 },
  { id: 'dhr', name: 'DHR', defaultValue: 0.5 },
  { id: 'equipment', name: 'Equipment', defaultValue: 0.5 },
  { id: 'trainer', name: 'Trainer', defaultValue: 0.5 },
  { id: 'backup', name: 'Back up', defaultValue: 0 },
  { id: 'label', name: 'Tira etiquetas', defaultValue: 0 }
];

export interface SupportAdjustment {
  id: string;
  shift: number;
  positions: {
    positionId: string;
    value: number;
  }[];
  appliedBy: string;
  appliedAt: Date;
}

export interface ShiftEfficiency {
  targetEfficiency: number;  // Eficiencia Meta Turno
  actualEfficiency: number;  // Eficiencia Real Turno
  laborStandard: number;    // Labor Standard del Part Number actual
  supportHours: number;     // Horas de soporte (ejemplo: 3.5)
}

export interface ProductionMetrics {
  hourlyTarget: number;     // Meta de unidades por hora
  hourlyActual: number;     // Producción real de la hora
  accumulatedTarget: number; // Meta acumulada desde inicio del turno
  accumulatedActual: number; // Producción real acumulada
  headCountReal: number;     // HC actual
  headCountCapacity: number; // HC requerido según capacidad
  delta: number;            // Diferencia entre real y meta
  lostTime: number;         // Tiempo perdido en minutos
}