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