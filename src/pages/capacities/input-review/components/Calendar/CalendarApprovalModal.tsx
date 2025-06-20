import React from 'react';
import { CheckCircle, X, Calendar, AlertTriangle, Clock } from 'lucide-react';
import type { CalendarDay } from '@/types/capacity';

interface CalendarApprovalModalProps {
  selectedDays: CalendarDay[];
  onConfirm: () => void;
  onCancel: () => void;
}

const CalendarApprovalModal: React.FC<CalendarApprovalModalProps> = ({ 
  selectedDays, 
  onConfirm, 
  onCancel 
}) => {
  const workingDays = selectedDays.filter(day => day.isWorkingDay);
  const nonWorkingDays = selectedDays.filter(day => !day.isWorkingDay);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Aprobar Días Seleccionados
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">
                    Resumen de Aprobación
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Se aprobarán {selectedDays.length} días seleccionados. Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Total a aprobar</div>
              <div className="text-2xl font-bold text-gray-900">{selectedDays.length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-green-600">Días laborables</div>
              <div className="text-2xl font-bold text-green-700">{workingDays.length}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-red-600">Días no laborables</div>
              <div className="text-2xl font-bold text-red-700">{nonWorkingDays.length}</div>
            </div>
          </div>

          {/* Lista de días a aprobar */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">
              Días que serán aprobados:
            </h4>
            
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
              <div className="divide-y divide-gray-200">
                {selectedDays.map((day) => (
                  <div key={day.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium
                        ${day.isWorkingDay ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                      `}>
                        {day.date.getDate()}
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {day.date.toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        
                        {day.description && (
                          <div className="text-sm text-gray-500">
                            {day.description}
                          </div>
                        )}
                        
                        {day.valueStream && day.valueStream !== 'ALL' && (
                          <div className="text-xs text-gray-400">
                            VST: {day.valueStream}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {day.isWorkingDay ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-xs">Laborable</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          <span className="text-xs">No laborable</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-amber-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-xs">
                          {day.status === 'pending' ? 'Pendiente' : day.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Warning si hay días no laborables */}
          {nonWorkingDays.length > 0 && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-900">
                    Atención: Días no laborables incluidos
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    {nonWorkingDays.length} de los días seleccionados están marcados como no laborables. 
                    Esto afectará los cálculos de capacidad disponible.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 flex items-center"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Aprobar {selectedDays.length} días
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarApprovalModal; 