import { supabase } from '@/lib/supabase';
import type { CalendarDay, CalendarConfiguration } from '@/types/capacity';

class CalendarService {
  // Mock data temporal hasta que se actualice la base de datos
  private mockCalendarDays: CalendarDay[] = [];
  
  // Configuración por defecto de horas de trabajo
  private defaultConfig: CalendarConfiguration = {
    standardWorkingHours: 8,
    saturdayHours: 4,
    sundayHours: 0,
    holidayHours: 0,
    valueStreamSpecific: {
      'ENT': { standardHours: 8, saturdayHours: 4, sundayHours: 0 },
      'JR': { standardHours: 8, saturdayHours: 4, sundayHours: 0 },
      'SM': { standardHours: 8, saturdayHours: 4, sundayHours: 0 },
      'WND': { standardHours: 8, saturdayHours: 4, sundayHours: 0 },
      'FIX': { standardHours: 8, saturdayHours: 4, sundayHours: 0 },
      'EA': { standardHours: 8, saturdayHours: 4, sundayHours: 0 },
      'APO': { standardHours: 8, saturdayHours: 4, sundayHours: 0 }
    }
  };

  private getDayType(date: Date): CalendarDay['dayType'] {
    const dayOfWeek = date.getDay();
    
    switch (dayOfWeek) {
      case 0: return 'sunday';
      case 6: return 'saturday';
      default: return 'weekday';
    }
  }

  private getStandardHours(dayType: CalendarDay['dayType'], valueStream?: string): number {
    if (valueStream && this.defaultConfig.valueStreamSpecific[valueStream]) {
      const vsConfig = this.defaultConfig.valueStreamSpecific[valueStream];
      switch (dayType) {
        case 'weekday':
          return vsConfig.standardHours;
        case 'saturday':
          return vsConfig.saturdayHours;
        case 'sunday':
          return vsConfig.sundayHours;
        case 'holiday':
          return this.defaultConfig.holidayHours;
        case 'special':
          return 0;
        default:
          return vsConfig.standardHours;
      }
    }

    switch (dayType) {
      case 'weekday':
        return this.defaultConfig.standardWorkingHours;
      case 'saturday':
        return this.defaultConfig.saturdayHours;
      case 'sunday':
        return this.defaultConfig.sundayHours;
      case 'holiday':
        return this.defaultConfig.holidayHours;
      case 'special':
        return 0; // Los días especiales se configuran manualmente
      default:
        return this.defaultConfig.standardWorkingHours;
    }
  }

  private isWorkingDay(dayType: CalendarDay['dayType']): boolean {
    switch (dayType) {
      case 'weekday':
        return true;
      case 'saturday':
        return true; // Los sábados se consideran días laborables (medio día)
      case 'sunday':
      case 'holiday':
        return false;
      case 'special':
        return false; // Los días especiales se configuran manualmente
      default:
        return true;
    }
  }

  async getCalendarDaysByMonth(year: number, month: number, valueStream?: string): Promise<CalendarDay[]> {
    // Implementación mock temporal - generar días del mes
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const days: CalendarDay[] = [];
    
    for (let day = 1; day <= endDate.getDate(); day++) {
      const currentDate = new Date(year, month - 1, day);
      const dayType = this.getDayType(currentDate);
      const standardHours = this.getStandardHours(dayType, valueStream);
      const isWorking = this.isWorkingDay(dayType);
      
      // Buscar si ya existe una configuración específica para este día
      const existingDay = this.mockCalendarDays.find(d => 
        d.date.getTime() === currentDate.getTime() && 
        (!valueStream || d.valueStream === valueStream || d.valueStream === 'ALL')
      );

      if (existingDay) {
        days.push(existingDay);
      } else {
        days.push({
          id: `${year}-${month}-${day}-${valueStream || 'ALL'}`,
          date: currentDate,
          isWorkingDay: isWorking,
          workingHours: isWorking ? standardHours : 0,
          standardHours: standardHours,
          dayType: dayType,
          valueStream: valueStream || 'ALL',
          status: 'approved', // Los días estándar se consideran aprobados por defecto
          description: this.getDefaultDescription(dayType)
        });
      }
    }
    
    return days;
  }

  private getDefaultDescription(dayType: CalendarDay['dayType']): string {
    switch (dayType) {
      case 'weekday':
        return 'Día laborable estándar';
      case 'saturday':
        return 'Sábado - Medio día laborable';
      case 'sunday':
        return 'Domingo - No laborable';
      case 'holiday':
        return 'Día feriado';
      case 'special':
        return 'Día especial';
      default:
        return 'Día estándar';
    }
  }

  async createCalendarDay(calendarDay: Omit<CalendarDay, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalendarDay> {
    // Generar ID único
    const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calcular horas de trabajo basado en el tipo de día si no se especifica
    let workingHours = calendarDay.workingHours;
    if (workingHours === undefined) {
      workingHours = calendarDay.isWorkingDay ? calendarDay.standardHours : 0;
    }
    
    const newCalendarDay: CalendarDay = {
      id,
      ...calendarDay,
      workingHours,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.mockCalendarDays.push(newCalendarDay);
    return newCalendarDay;
  }

  async updateCalendarDay(id: string, updates: Partial<CalendarDay>): Promise<CalendarDay> {
    const index = this.mockCalendarDays.findIndex(day => day.id === id);
    if (index === -1) {
      throw new Error('Calendar day not found');
    }
    
    // Recalcular horas de trabajo si cambió el estado de día laborable
    let workingHours = updates.workingHours;
    if (updates.isWorkingDay !== undefined && workingHours === undefined) {
      const currentDay = this.mockCalendarDays[index];
      workingHours = updates.isWorkingDay ? currentDay.standardHours : 0;
    }
    
    this.mockCalendarDays[index] = {
      ...this.mockCalendarDays[index],
      ...updates,
      workingHours: workingHours ?? this.mockCalendarDays[index].workingHours,
      updatedAt: new Date().toISOString()
    };
    
    return this.mockCalendarDays[index];
  }

  async deleteCalendarDay(id: string): Promise<void> {
    const index = this.mockCalendarDays.findIndex(day => day.id === id);
    if (index > -1) {
      this.mockCalendarDays.splice(index, 1);
    }
    // En producción: await supabase.from('calendar_days').delete().eq('id', id);
  }

  async getCalendarDaysByDateRange(startDate: Date, endDate: Date): Promise<CalendarDay[]> {
    return this.mockCalendarDays.filter(day => 
      day.date >= startDate && day.date <= endDate
    );
  }

  async bulkApproveCalendarDays(ids: string[]): Promise<void> {
    this.mockCalendarDays = this.mockCalendarDays.map(day => 
      ids.includes(day.id || '') 
        ? { ...day, status: 'approved', approvedBy: 'Usuario Actual' }
        : day
    );
    // En producción: bulk update en Supabase
  }

  // Método para obtener estadísticas de horas por mes
  async getMonthlyHoursStats(year: number, month: number, valueStream?: string): Promise<{
    totalDays: number;
    workingDays: number;
    totalHours: number;
    approvedHours: number;
    pendingHours: number;
    weekdayHours: number;
    saturdayHours: number;
    sundayHours: number;
  }> {
    const days = await this.getCalendarDaysByMonth(year, month, valueStream);
    
    const stats = {
      totalDays: days.length,
      workingDays: days.filter(d => d.isWorkingDay).length,
      totalHours: days.reduce((sum, d) => sum + d.workingHours, 0),
      approvedHours: days.filter(d => d.status === 'approved').reduce((sum, d) => sum + d.workingHours, 0),
      pendingHours: days.filter(d => d.status === 'pending').reduce((sum, d) => sum + d.workingHours, 0),
      weekdayHours: days.filter(d => d.dayType === 'weekday').reduce((sum, d) => sum + d.workingHours, 0),
      saturdayHours: days.filter(d => d.dayType === 'saturday').reduce((sum, d) => sum + d.workingHours, 0),
      sundayHours: days.filter(d => d.dayType === 'sunday').reduce((sum, d) => sum + d.workingHours, 0)
    };
    
    return stats;
  }

  // Método para obtener la configuración de horas
  getCalendarConfiguration(): CalendarConfiguration {
    return this.defaultConfig;
  }

  // Método para actualizar la configuración de horas
  updateCalendarConfiguration(config: Partial<CalendarConfiguration>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  // Método para seed de datos mock con feriados colombianos comunes
  async seedMockHolidays(year: number): Promise<void> {
    const holidays = [
      { month: 1, day: 1, description: 'Año Nuevo' },
      { month: 1, day: 6, description: 'Día de los Reyes Magos' },
      { month: 3, day: 19, description: 'Día de San José' },
      { month: 5, day: 1, description: 'Día del Trabajo' },
      { month: 7, day: 20, description: 'Día de la Independencia' },
      { month: 8, day: 7, description: 'Batalla de Boyacá' },
      { month: 8, day: 15, description: 'Asunción de la Virgen' },
      { month: 10, day: 12, description: 'Día de la Raza' },
      { month: 11, day: 1, description: 'Día de Todos los Santos' },
      { month: 11, day: 11, description: 'Independencia de Cartagena' },
      { month: 12, day: 8, description: 'Día de la Inmaculada Concepción' },
      { month: 12, day: 25, description: 'Navidad' }
    ];

    for (const holiday of holidays) {
      const holidayDate = new Date(year, holiday.month - 1, holiday.day);
      
      await this.createCalendarDay({
        date: holidayDate,
        isWorkingDay: false,
        workingHours: 0,
        standardHours: 0,
        dayType: 'holiday',
        description: holiday.description,
        valueStream: 'ALL',
        status: 'approved'
      });
    }
  }
}

export const calendarService = new CalendarService();
export default calendarService; 