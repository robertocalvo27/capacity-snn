import React, { useState, useEffect } from 'react';
import { Calendar, Check, AlertTriangle, Clock, User, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { CalendarDay } from '@/types/capacity';
import { calendarService } from '@/services/calendarService';
import CalendarDayModal from './CalendarDayModal';
import CalendarApprovalModal from './CalendarApprovalModal';

interface CalendarDaysTabProps {
  onSave: () => void;
}

const CalendarDaysTab: React.FC<CalendarDaysTabProps> = ({ onSave }) => {
  // Estados principales
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [editingDay, setEditingDay] = useState<CalendarDay | null>(null);

  // Estados de navegación
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedValueStream, setSelectedValueStream] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Estados de estadísticas
  const [monthlyStats, setMonthlyStats] = useState({
    totalDays: 0,
    workingDays: 0,
    totalHours: 0,
    approvedHours: 0,
    pendingHours: 0,
    weekdayHours: 0,
    saturdayHours: 0,
    sundayHours: 0
  });

  useEffect(() => {
    loadCalendarData();
    loadMonthlyStats();
  }, [currentDate, selectedValueStream]);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const days = await calendarService.getCalendarDaysByMonth(
        year, 
        month, 
        selectedValueStream === 'ALL' ? undefined : selectedValueStream
      );
      
      setCalendarDays(days);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMonthlyStats = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const stats = await calendarService.getMonthlyHoursStats(
        year, 
        month, 
        selectedValueStream === 'ALL' ? undefined : selectedValueStream
      );
      
      setMonthlyStats(stats);
    } catch (error) {
      console.error('Error loading monthly stats:', error);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    setSelectedDays([]); // Limpiar selección al cambiar de mes
  };

  const handleDayClick = (day: CalendarDay) => {
    if (day.dayType === 'weekday' || day.dayType === 'saturday') {
      // Solo permitir selección múltiple en días laborables estándar
      const dayId = day.id!;
      setSelectedDays(prev => 
        prev.includes(dayId) 
          ? prev.filter(id => id !== dayId)
          : [...prev, dayId]
      );
    }
  };

  const handleEditDay = (day: CalendarDay) => {
    setEditingDay(day);
    setShowDayModal(true);
  };

  const handleCreateSpecialDay = () => {
    setEditingDay(null);
    setShowDayModal(true);
  };

  const handleSaveDay = async (dayData: CalendarDay) => {
    try {
      if (editingDay) {
        await calendarService.updateCalendarDay(editingDay.id!, dayData);
      } else {
        await calendarService.createCalendarDay(dayData);
      }
      
      await loadCalendarData();
      await loadMonthlyStats();
      setShowDayModal(false);
      setEditingDay(null);
      onSave();
    } catch (error) {
      console.error('Error saving calendar day:', error);
    }
  };

  const handleBulkApproval = async () => {
    try {
      const selectedCalendarDays = calendarDays.filter(day => 
        selectedDays.includes(day.id!)
      );
      
      await calendarService.bulkApproveCalendarDays(selectedDays);
      await loadCalendarData();
      await loadMonthlyStats();
      setShowApprovalModal(false);
      setSelectedDays([]);
      onSave();
    } catch (error) {
      console.error('Error in bulk approval:', error);
    }
  };

  const getDayStatusColor = (day: CalendarDay): string => {
    if (!day.isWorkingDay) {
      return 'bg-red-100 border-red-200 text-red-800';
    }
    
    switch (day.status) {
      case 'approved':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'pending':
        return 'bg-amber-100 border-amber-200 text-amber-800';
      case 'rejected':
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getDayIcon = (day: CalendarDay) => {
    if (!day.isWorkingDay) {
      return <AlertTriangle className="w-3 h-3" />;
    }
    
    switch (day.status) {
      case 'approved':
        return <Check className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getFilteredDays = () => {
    if (filterStatus === 'all') {
      return calendarDays;
    }
    return calendarDays.filter(day => day.status === filterStatus);
  };

  const monthName = currentDate.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long' 
  });

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const filteredDays = getFilteredDays();

  return (
    <div className="space-y-6">
      {/* Header con título y navegación */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">
                Días Calendario - {monthName}
              </h3>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <button
            onClick={handleCreateSpecialDay}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Día Especial
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Define días laborables vs no laborables para el cálculo de capacidad
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value Stream
            </label>
            <select
              value={selectedValueStream}
              onChange={(e) => setSelectedValueStream(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Todos los VST</option>
              <option value="ENT">ENT</option>
              <option value="JR">JR</option>
              <option value="SM">SM</option>
              <option value="WND">WND</option>
              <option value="FIX">FIX</option>
              <option value="EA">EA</option>
              <option value="APO">APO</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobados</option>
              <option value="rejected">Rechazados</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{selectedDays.length}</span> días seleccionados
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas mejoradas con horas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-500">Total Días</div>
          <div className="text-2xl font-bold text-gray-900">{monthlyStats.totalDays}</div>
          <div className="text-xs text-gray-500">del mes</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-green-600">Días Laborables</div>
          <div className="text-2xl font-bold text-green-700">{monthlyStats.workingDays}</div>
          <div className="text-xs text-green-600">{monthlyStats.totalHours}h totales</div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-blue-600">Horas Aprobadas</div>
          <div className="text-2xl font-bold text-blue-700">{monthlyStats.approvedHours}</div>
          <div className="text-xs text-blue-600">horas productivas</div>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-amber-600">Pendientes</div>
          <div className="text-2xl font-bold text-amber-700">{monthlyStats.pendingHours}</div>
          <div className="text-xs text-amber-600">horas por aprobar</div>
        </div>
      </div>

      {/* Desglose de horas por tipo de día */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Distribución de Horas</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{monthlyStats.weekdayHours}h</div>
            <div className="text-sm text-gray-500">Días de semana</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{monthlyStats.saturdayHours}h</div>
            <div className="text-sm text-gray-500">Sábados</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">{monthlyStats.sundayHours}h</div>
            <div className="text-sm text-gray-500">Domingos</div>
          </div>
        </div>
      </div>

      {/* Controles de selección */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedDays.length === filteredDays.length && filteredDays.length > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedDays(filteredDays.map(day => day.id!));
                } else {
                  setSelectedDays([]);
                }
              }}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">
              Seleccionar todos ({filteredDays.length} {filteredDays.length === 1 ? 'día' : 'días'})
            </span>
          </label>
        </div>

        {selectedDays.length > 0 && (
          <button
            onClick={() => setShowApprovalModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Aprobar Seleccionados ({selectedDays.length})
          </button>
        )}
      </div>

      {/* Calendario */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Headers de días de la semana */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Días del calendario */}
            <div className="grid grid-cols-7 gap-2">
              {filteredDays.map((day) => {
                const isSelected = selectedDays.includes(day.id!);
                const dayNumber = day.date.getDate();
                
                return (
                  <div
                    key={day.id}
                    className={`
                      relative p-3 border-2 rounded-lg cursor-pointer transition-all
                      ${getDayStatusColor(day)}
                      ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                      hover:shadow-md
                    `}
                    onClick={() => handleDayClick(day)}
                    onDoubleClick={() => handleEditDay(day)}
                  >
                    {/* Número del día */}
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-lg">{dayNumber}</span>
                      <div className="flex flex-col items-end space-y-1">
                        {getDayIcon(day)}
                        {isSelected && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>

                    {/* Información de horas */}
                    <div className="mt-2">
                      <div className="text-xs font-medium">
                        {day.workingHours}h
                      </div>
                      <div className="text-xs text-gray-600">
                        {day.dayType === 'weekday' ? 'Laborable' :
                         day.dayType === 'saturday' ? 'Sábado' :
                         day.dayType === 'sunday' ? 'Domingo' :
                         day.dayType === 'holiday' ? 'Feriado' : 'Especial'}
                      </div>
                    </div>

                    {/* Descripción si existe */}
                    {day.description && day.description !== 'Día laborable estándar' && (
                      <div className="mt-1 text-xs text-gray-600 truncate" title={day.description}>
                        {day.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Modales */}
      {showDayModal && (
        <CalendarDayModal
          day={editingDay}
          onSave={handleSaveDay}
          onCancel={() => {
            setShowDayModal(false);
            setEditingDay(null);
          }}
        />
      )}

      {showApprovalModal && (
        <CalendarApprovalModal
          selectedDays={calendarDays.filter(day => selectedDays.includes(day.id!))}
          onConfirm={handleBulkApproval}
          onCancel={() => setShowApprovalModal(false)}
        />
      )}
    </div>
  );
};

export default CalendarDaysTab; 