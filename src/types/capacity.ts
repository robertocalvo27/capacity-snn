export interface WeeklyYield {
  week: number;
  yieldT1: number;
  yieldT2: number;
  yieldT3: number;
}

export interface HeadCountCapacity {
  shift: 'T1' | 'T2' | 'T3';
  theoreticalHC: number;
}

// Datos de Yield por semana
export const WEEKLY_YIELDS: WeeklyYield[] = [
  { week: 45, yieldT1: 1.00, yieldT2: 1.00, yieldT3: 1.00 },
  { week: 46, yieldT1: 1.00, yieldT2: 1.00, yieldT3: 1.00 },
  { week: 47, yieldT1: 1.00, yieldT2: 1.00, yieldT3: 1.00 },
  { week: 48, yieldT1: 1.00, yieldT2: 1.00, yieldT3: 1.00 },
  { week: 49, yieldT1: 1.00, yieldT2: 1.00, yieldT3: 1.00 }
];

// Datos de Head Count teórico por turno
export const THEORETICAL_HC: HeadCountCapacity[] = [
  { shift: 'T1', theoreticalHC: 45 },
  { shift: 'T2', theoreticalHC: 45 },
  { shift: 'T3', theoreticalHC: 0 }
];

// Función para obtener el yield según la semana y turno
export function getYieldForWeekAndShift(week: number, shift: 'T1' | 'T2' | 'T3'): number {
  const weekData = WEEKLY_YIELDS.find(w => w.week === week);
  if (!weekData) return 1.0; // Valor por defecto si no se encuentra la semana

  switch (shift) {
    case 'T1': return weekData.yieldT1;
    case 'T2': return weekData.yieldT2;
    case 'T3': return weekData.yieldT3;
    default: return 1.0;
  }
}

// Función para obtener el HC teórico según el turno
export function getTheoreticalHC(shift: 'T1' | 'T2' | 'T3'): number {
  const hcData = THEORETICAL_HC.find(hc => hc.shift === shift);
  return hcData?.theoreticalHC || 0;
}

export interface CalendarDay {
  id?: string;
  date: Date;
  isWorkingDay: boolean;
  workingHours: number; // Horas laborables del día (0, 4, 8, 12, etc.)
  standardHours: number; // Horas estándar para este tipo de día (8 para días normales, 4 para sábados)
  description?: string;
  valueStream?: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  dayType: 'weekday' | 'saturday' | 'sunday' | 'holiday' | 'special';
  createdAt?: string;
  updatedAt?: string;
}

export interface ImportLog {
  id: string;
  fileName: string;
  uploadedBy: string;
  uploadDate: Date;
  fileType: 'buildplan' | 'headcount' | 'runrates' | 'yield' | 'downtimes' | 'calendar';
  status: 'success' | 'error' | 'processing';
  recordsProcessed: number;
  errorMessage?: string;
  fileSize?: number;
  filePath?: string;
}

export interface EnhancedDowntime {
  id: string;
  type: 'standard' | 'special';
  category: 'tier' | 'setup' | 'ergonomic' | 'validation' | 'material_change' | 'training' | 'maintenance';
  date: Date;
  startTime?: string;
  endTime?: string;
  hours: number;
  reason: string;
  description: string;
  valueStream?: string;
  line?: string;
  area: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  impact: 'low' | 'medium' | 'high';
  recurrent: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
}

export interface TrainingCurve {
  id?: string;
  employeeId: string;
  employeeName?: string;
  operation: string;
  efficiencyPercentage: number;
  startDate: Date;
  expectedCompletionDate: Date;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  valueStream?: string;
  line?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LotChangeCalculation {
  id?: string;
  partNumber: string;
  demand: number;
  lotSize: number;
  changesRequired: number;
  timePerChange: number; // minutos
  totalLostTime: number;
  impactOnCapacity: number;
  valueStream?: string;
  line?: string;
  week?: string;
  month?: string;
}

export interface NetAvailableTimeCalculation {
  id?: string;
  valueStream: string;
  line?: string;
  month: string;
  week?: string;
  calendarHours: number;
  standardDowntimes: number;
  specialDowntimes: number;
  trainingCurveImpact: number;
  lotChangeImpact: number;
  netAvailableTime: number;
  utilizationPercentage: number;
  calculatedAt: string;
}

// Tipos para Status extendidos
export interface ExtendedStatusItem {
  complete: boolean;
  date: string | null;
  approvedBy?: string;
  requiresApproval?: boolean;
  pendingItems?: number;
  totalItems?: number;
}

export interface InputReviewStatusExtended {
  buildPlan: ExtendedStatusItem;
  headcount: ExtendedStatusItem;
  runRates: ExtendedStatusItem;
  yield: ExtendedStatusItem;
  downtimes: ExtendedStatusItem;
  summary: ExtendedStatusItem;
  // Nuevos módulos
  calendarDays: ExtendedStatusItem;
  trainingCurves: ExtendedStatusItem;
  lotChanges: ExtendedStatusItem;
}

export interface CalendarConfiguration {
  standardWorkingHours: number; // Horas estándar de trabajo (ej: 8)
  saturdayHours: number; // Horas de trabajo los sábados (ej: 4)
  sundayHours: number; // Horas de trabajo los domingos (ej: 0)
  holidayHours: number; // Horas de trabajo en feriados (ej: 0)
  valueStreamSpecific: {
    [valueStream: string]: {
      standardHours: number;
      saturdayHours: number;
      sundayHours: number;
    };
  };
}