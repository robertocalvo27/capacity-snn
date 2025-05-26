import type { Shift } from '../../../types/production';
import { PART_NUMBERS } from '../../../types/part-numbers';
import { PROGRAMMED_STOPS } from '../../../types/production';
import { getYieldForWeekAndShift, getTheoreticalHC } from '../../../types/capacity';
import '../../../types/date-extensions';

export function generateHourRanges(shift: Shift): string[] {
  const hours = [];
  let currentHour = new Date(`2024-01-01 ${shift.startTime}`);
  const endHour = new Date(`2024-01-01 ${shift.endTime}`);
  
  if (endHour < currentHour) {
    endHour.setDate(endHour.getDate() + 1);
  }

  while (currentHour < endHour) {
    const startTime = currentHour.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    currentHour.setHours(currentHour.getHours() + 1);
    const endTime = currentHour.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    hours.push(`${startTime} - ${endTime}`);
  }

  return hours;
}

export const getRowBackgroundColor = (registeredAt: Date | undefined, hour: string, isOvertime = false): string => {
  if (!registeredAt) return 'bg-white';
  
  // Si es hora extra, mantener el color especial
  if (isOvertime) return 'bg-blue-50';

  const [startHour] = hour.split(' - ');
  const hourDate = parseHourString(startHour);
  
  // Calcular la diferencia en minutos
  const diffInMinutes = Math.floor((registeredAt.getTime() - hourDate.getTime()) / (1000 * 60));

  // Aplicar la nueva política de colores
  if (diffInMinutes <= 15) {
    return 'bg-green-50'; // Registro inmediato (≤ 15 min)
  } else if (diffInMinutes <= 30) {
    return 'bg-yellow-50'; // Registro tardío (15-30 min)
  } else {
    return 'bg-red-50'; // Registro crítico (> 30 min)
  }
};

// Función auxiliar para parsear la hora
const parseHourString = (hourStr: string): Date => {
  const today = new Date();
  const [time, period] = hourStr.split(' ');
  const [hours, minutes] = time.split(':');
  
  let hour = parseInt(hours);
  if (period.toLowerCase().includes('p.m.') && hour !== 12) {
    hour += 12;
  } else if (period.toLowerCase().includes('a.m.') && hour === 12) {
    hour = 0;
  }
  
  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    hour,
    parseInt(minutes)
  );
};

export function calculateAvailableTime(programmedStop: string | null): number {
  if (!programmedStop || programmedStop === 'Sin paro programado') return 60;
  const stop = PROGRAMMED_STOPS.find(s => s.name === programmedStop);
  return stop ? 60 - stop.duration : 60;
}

export function getShiftType(shift: Shift): 'T1' | 'T2' | 'T3' {
  const hour = parseInt(shift.startTime.split(':')[0]);
  
  if (hour >= 14 && hour < 22) return 'T2';
  if (hour >= 22 || hour < 6) return 'T3';
  return 'T1';
}

export function getRunRate(partNumber: string, shiftType: 'T1' | 'T2' | 'T3'): number {
  const selectedPart = PART_NUMBERS.find(pn => pn.code === partNumber);
  if (!selectedPart) return 0;

  switch (shiftType) {
    case 'T2': return selectedPart.runRateT2;
    case 'T3': return selectedPart.runRateT3;
    default: return selectedPart.runRateT1;
  }
}

export function calculateHourlyTargetFC(
  partNumber: string | null,
  shift: Shift
): number {
  if (!partNumber) return 0;

  const shiftType = getShiftType(shift);
  return getRunRate(partNumber, shiftType);
}

export function calculateHourlyTarget(
  partNumber: string | null,
  shift: Shift,
  availableTime: number,
  realHeadCount: number | null
): number {
  // Si falta algún dato requerido, retornar 0
  if (!partNumber || !realHeadCount) return 0;

  // Determinar el turno y obtener el Run Rate
  const shiftType = getShiftType(shift);
  const runRate = getRunRate(partNumber, shiftType);

  // Obtener el yield de la semana actual
  const currentWeek = new Date().getWeek();
  const yieldFactor = getYieldForWeekAndShift(currentWeek, shiftType);

  // Obtener el HC teórico del turno
  const theoreticalHC = getTheoreticalHC(shiftType);

  // Calcular los factores
  const timeRatio = availableTime / 60;
  const headCountRatio = theoreticalHC > 0 ? realHeadCount / theoreticalHC : 0;

  // Calcular el target final
  // Formula: Run Rate * (Tiempo Disponible/60) * Yield * (HC Real/HC Teórico)
  const target = Math.round(
    runRate * timeRatio * yieldFactor * headCountRatio
  );

  return target;
}

export function validateRegistrationOrder(
  entries: ProductionEntry[],
  currentHour: string,
  hourRanges: string[]
): { isValid: boolean; message: string } {
  const currentHourIndex = hourRanges.indexOf(currentHour);
  
  // Si es la primera franja horaria, siempre permitir edición
  if (currentHourIndex === 0) {
    return { isValid: true, message: '' };
  }
  
  // Verificar solo las franjas anteriores a la actual
  for (let i = 0; i < currentHourIndex; i++) {
    const previousHourEntries = entries.filter(e => e.hour === hourRanges[i]);
    const isComplete = previousHourEntries.some(entry => 
      entry.realHeadCount !== null && 
      entry.workOrder && 
      entry.partNumber && 
      entry.dailyProduction !== null
    );
    
    if (!isComplete) {
      return {
        isValid: false,
        message: `Debe completar el registro de la franja ${hourRanges[i]} antes de continuar.`
      };
    }
  }

  return { isValid: true, message: '' };
}

export function validateRegistrationTime(hourRange: string): { isValid: boolean; message: string } {
  const [startTime] = hourRange.split(' - ');
  const hourDate = new Date(`2024-01-01 ${startTime}`);
  const endHourDate = new Date(hourDate);
  endHourDate.setHours(endHourDate.getHours() + 1);
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Convertir la hora actual a la misma fecha base para comparación
  const currentTime = new Date(2024, 0, 1, currentHour, currentMinute);
  
  // No permitir registro de horas futuras
  if (currentTime < hourDate) {
    return {
      isValid: false,
      message: 'No se puede registrar información para franjas horarias futuras.'
    };
  }

  return { isValid: true, message: '' };
}