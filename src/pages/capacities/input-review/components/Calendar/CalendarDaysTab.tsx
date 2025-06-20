import React, { useState, useEffect } from 'react';
import { Calendar, Check, AlertTriangle, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  
  // Estados para navegación de calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedValueStream, setSelectedValueStream] = useState<string>('ALL');
  
  // Cargar datos del calendario
  useEffect(() => {
    loadCalendarData();
  }, [currentDate, selectedValueStream]);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const valueStream = selectedValueStream === 'ALL' ? undefined : selectedValueStream;
      
      const data = await calendarService.getCalendarDaysByMonth(year, month, valueStream);
      setCalendarDays(data);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navegación de mes
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Manejo de selección múltiple
  const handleDaySelection = (dayId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedDays([...selectedDays, dayId]);
    } else {
      setSelectedDays(selectedDays.filter(id => id !== dayId));
    }
  };

  const handleSelectAll = () => {
    if (selectedDays.length === calendarDays.length) {
      setSelectedDays([]);
    } else {
      setSelectedDays(calendarDays.map(day => day.id!));
    }
  };

  // Abrir modales
  const handleEditDay = (day: CalendarDay) => {
    setSelectedDay(day);
    setShowDayModal(true);
  };

  const handleApproveSelected = () => {
    if (selectedDays.length > 0) {
      setShowApprovalModal(true);
    }
  };

  // Callbacks de modales
  const handleDayModalSave = async (updatedDay: CalendarDay) => {
    try {
      if (selectedDay?.id) {
        await calendarService.updateCalendarDay(selectedDay.id, updatedDay);
      } else {
        await calendarService.createCalendarDay(updatedDay);
      }
      
      await loadCalendarData();
      setShowDayModal(false);
      setSelectedDay(null);
    } catch (error) {
      console.error('Error saving calendar day:', error);
    }
  };

  const handleApprovalConfirm = async () => {
    try {
      await calendarService.approveCalendarDays(selectedDays, 'Juan Pérez'); // TODO: usar usuario real
      await loadCalendarData();
      setSelectedDays([]);
      setShowApprovalModal(false);
      onSave(); // Notificar al padre que se guardaron cambios
    } catch (error) {
      console.error('Error approving calendar days:', error);
    }
  };

  // Obtener estadísticas del mes
  const getMonthStats = () => {
    const totalDays = calendarDays.length;
    const workingDays = calendarDays.filter(day => day.isWorkingDay).length;
    const approvedDays = calendarDays.filter(day => day.status === 'approved').length;
    const pendingDays = calendarDays.filter(day => day.status === 'pending').length;
    
    return { totalDays, workingDays, approvedDays, pendingDays };
  };

  const stats = getMonthStats();

  return (
    <div className="space-y-6">
      {/* Header con navegación y estadísticas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Días Calendario - {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Define días laborables vs no laborables para el cálculo de capacidad
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Selector de Value Stream */}
            <select
              value={selectedValueStream}
              onChange={(e) => setSelectedValueStream(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Todos los VST</option>
              <option value="ENT">ENT</option>
              <option value="JR">JR</option>
              <option value="SM">SM</option>
              <option value="WND">WND</option>
            </select>

            {/* Navegación de mes */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Total Días</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalDays}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-green-600">Días Laborables</div>
            <div className="text-2xl font-bold text-green-700">{stats.workingDays}</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-blue-600">Aprobados</div>
            <div className="text-2xl font-bold text-blue-700">{stats.approvedDays}</div>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-amber-600">Pendientes</div>
            <div className="text-2xl font-bold text-amber-700">{stats.pendingDays}</div>
          </div>
        </div>
      </div>

      {/* Controles de acción */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedDays.length === calendarDays.length && calendarDays.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Seleccionar todos ({selectedDays.length} seleccionados)
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            {selectedDays.length > 0 && (
              <button
                onClick={handleApproveSelected}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Aprobar Seleccionados ({selectedDays.length})
              </button>
            )}
            
            <button
              onClick={() => {
                setSelectedDay(null);
                setShowDayModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Agregar Día Especial
            </button>
          </div>
        </div>
      </div>

      {/* Vista de calendario (grid) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {/* Headers de días de la semana */}
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Días del calendario */}
            {calendarDays.map((day) => {
              const isSelected = selectedDays.includes(day.id!);
              const dayOfWeek = day.date.getDay();
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              
              return (
                <div
                  key={day.id}
                  className={`
                    relative p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                    ${!day.isWorkingDay ? 'bg-red-50' : day.status === 'approved' ? 'bg-green-50' : 'bg-white'}
                  `}
                  onClick={() => handleDaySelection(day.id!, !isSelected)}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${isWeekend ? 'text-gray-400' : 'text-gray-900'}`}>
                      {day.date.getDate()}
                    </span>
                    
                    <div className="flex items-center space-x-1">
                      {day.status === 'approved' && (
                        <Check className="w-3 h-3 text-green-600" />
                      )}
                      {day.status === 'pending' && (
                        <Clock className="w-3 h-3 text-amber-600" />
                      )}
                      {!day.isWorkingDay && (
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                      )}
                    </div>
                  </div>
                  
                  {day.description && (
                    <div className="mt-1 text-xs text-gray-500 truncate">
                      {day.description}
                    </div>
                  )}
                  
                  {day.approvedBy && (
                    <div className="mt-1 flex items-center text-xs text-gray-400">
                      <User className="w-3 h-3 mr-1" />
                      {day.approvedBy.split(' ')[0]}
                    </div>
                  )}

                  {/* Botón de edición (visible al hover) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditDay(day);
                    }}
                    className="absolute top-1 right-1 opacity-0 hover:opacity-100 transition-opacity bg-white rounded-full p-1 shadow-sm border border-gray-200"
                  >
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modales */}
      {showDayModal && (
        <CalendarDayModal
          day={selectedDay}
          onSave={handleDayModalSave}
          onCancel={() => {
            setShowDayModal(false);
            setSelectedDay(null);
          }}
        />
      )}

      {showApprovalModal && (
        <CalendarApprovalModal
          selectedDays={calendarDays.filter(day => selectedDays.includes(day.id!))}
          onConfirm={handleApprovalConfirm}
          onCancel={() => setShowApprovalModal(false)}
        />
      )}
    </div>
  );
};

export default CalendarDaysTab; 