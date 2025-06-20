import { supabase } from '@/lib/supabase';
import type { CalendarDay } from '@/types/capacity';

class CalendarService {
  // Mock data temporal hasta que se actualice la base de datos
  private mockCalendarDays: CalendarDay[] = [];

  async getCalendarDaysByMonth(year: number, month: number, valueStream?: string): Promise<CalendarDay[]> {
    // Implementación mock temporal
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const days: CalendarDay[] = [];
    for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
      days.push({
        id: `${year}-${month}-${day.getDate()}`,
        date: new Date(day),
        isWorkingDay: !isWeekend,
        status: 'pending',
        valueStream: valueStream || 'ALL'
      });
    }
    
    return days;
  }

  async createCalendarDay(calendarDay: Omit<CalendarDay, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalendarDay> {
    // Implementación mock temporal
    const newDay: CalendarDay = {
      id: `${calendarDay.date.getTime()}`,
      ...calendarDay,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.mockCalendarDays.push(newDay);
    return newDay;
  }

  async updateCalendarDay(id: string, updates: Partial<CalendarDay>): Promise<CalendarDay> {
    // Implementación mock temporal
    const index = this.mockCalendarDays.findIndex(day => day.id === id);
    if (index === -1) {
      throw new Error('Calendar day not found');
    }
    
    const updatedDay = {
      ...this.mockCalendarDays[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.mockCalendarDays[index] = updatedDay;
    return updatedDay;
  }

  async deleteCalendarDay(id: string): Promise<void> {
    const index = this.mockCalendarDays.findIndex(day => day.id === id);
    if (index > -1) {
      this.mockCalendarDays.splice(index, 1);
    }
    // En producción: await supabase.from('calendar_days').delete().eq('id', id);
  }

  async bulkUpdateCalendarDays(days: Array<{ id: string; updates: Partial<CalendarDay> }>): Promise<CalendarDay[]> {
    const promises = days.map(({ id, updates }) => this.updateCalendarDay(id, updates));
    return Promise.all(promises);
  }

  async approveCalendarDays(ids: string[], approvedBy: string): Promise<CalendarDay[]> {
    const promises = ids.map(id => 
      this.updateCalendarDay(id, { 
        status: 'approved', 
        approvedBy: approvedBy,
        updatedAt: new Date().toISOString()
      })
    );
    
    return Promise.all(promises);
  }

  async getWorkingDaysInMonth(year: number, month: number, valueStream?: string): Promise<number> {
    const days = await this.getCalendarDaysByMonth(year, month, valueStream);
    return days.filter(day => day.isWorkingDay && day.status === 'approved').length;
  }

  async validateCalendarDay(date: Date, valueStream?: string): Promise<boolean> {
    const dateStr = date.toISOString().split('T')[0];
    const day = this.mockCalendarDays.find(d => 
      d.date.toISOString().split('T')[0] === dateStr &&
      d.status === 'approved' &&
      (!valueStream || d.valueStream === valueStream)
    );
    
    return day?.isWorkingDay ?? true; // Por defecto es día laborable si no está definido
  }

  // Método para agregar a mock data (desarrollo)
  async seedMockData(): Promise<void> {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    
    // Generar días del mes actual
    const days = await this.getCalendarDaysByMonth(currentYear, currentMonth);
    
    // Marcar algunos días como no laborables (ejemplos)
    const holidays = [1, 15, 25]; // Días del mes que son feriados
    
    for (const day of days) {
      if (holidays.includes(day.date.getDate())) {
        day.isWorkingDay = false;
        day.description = 'Día feriado';
        day.status = 'approved';
      }
    }
    
    this.mockCalendarDays = days;
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
}

export const calendarService = new CalendarService();
export default calendarService; 